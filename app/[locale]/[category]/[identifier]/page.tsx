import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Category, PageIdentifier } from '../../../../lib/types'
import { 
  parsePagePath, 
  generateSeoTitle, 
  generateSeoDescription,
  getCategoryBySlug 
} from '../../../../lib/categories'
import { fetchCategories, fetchBlocks, fetchMenus, fetchLocales } from '../../../../lib/cms'
import { generateAllStaticParams } from '../../../../lib/data-generator'
import CategoryPageTemplate from '../../../../components/templates/CategoryPageTemplate'
import { generateAllJsonLd, generateBreadcrumbs } from '../../../../lib/seo'

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string; category: string; identifier: string }> 
}): Promise<Metadata> {
  const { locale, category: categorySlug, identifier } = await params
  const categories = await fetchCategories()
  const category = getCategoryBySlug(categories, categorySlug)
  
  if (!category || !category.isActive) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  // Parse the identifier to extract parameters
  const pageIdentifier = parsePagePath(
    `${locale}/${categorySlug}/${identifier}`,
    categories
  )

  if (!pageIdentifier) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  const title = generateSeoTitle(
    category.seoSettings.titleTemplate,
    pageIdentifier.params,
    category
  )

  const description = generateSeoDescription(
    category.seoSettings.descriptionTemplate,
    pageIdentifier.params,
    category
  )

  const canonical = `${process.env.SITE_URL || 'https://example.com'}/${locale === 'en' ? '' : locale}/${categorySlug}/${identifier}`

  // Generate hreflang tags for all active locales
  const locales = await fetchLocales()
  const activeLocales = locales.filter(l => l.isActive && category.locales.includes(l.code))
  const alternates: Record<string, string> = {
    canonical,
  }

  // Add hreflang for each supported locale
  for (const loc of activeLocales) {
    const localeUrl = `${process.env.SITE_URL || 'https://example.com'}/${loc.code === 'en' ? '' : loc.code}/${categorySlug}/${identifier}`
    alternates[`hreflang-${loc.code}`] = localeUrl
  }

  // Add x-default hreflang (usually the default locale)
  const defaultLocale = activeLocales.find(l => l.isDefault) || activeLocales[0]
  if (defaultLocale) {
    const defaultUrl = `${process.env.SITE_URL || 'https://example.com'}/${defaultLocale.code === 'en' ? '' : defaultLocale.code}/${categorySlug}/${identifier}`
    alternates['hreflang-x-default'] = defaultUrl
  }

             // Generate JSON-LD structured data
           const jsonLd = generateAllJsonLd({
             title,
             description,
             url: canonical,
             category,
             params: pageIdentifier.params,
             locale
           })

           return {
             title,
             description,
             alternates: {
               canonical,
               languages: Object.fromEntries(
                 activeLocales.map(loc => [
                   loc.code,
                   `${process.env.SITE_URL || 'https://example.com'}/${loc.code === 'en' ? '' : loc.code}/${categorySlug}/${identifier}`
                 ])
               )
             },
             openGraph: {
               title,
               description,
               url: canonical,
               type: 'website',
             },
             twitter: {
               card: 'summary_large_image',
               title,
               description,
             },
             other: {
               // Add JSON-LD structured data
               'application/ld+json': [
                 JSON.stringify(jsonLd.webPage),
                 JSON.stringify(jsonLd.breadcrumb),
                 ...(jsonLd.categorySpecific ? [JSON.stringify(jsonLd.categorySpecific)] : [])
               ]
             }
           }
}

// Generate static params for all active categories
export async function generateStaticParams() {
  const categories = await fetchCategories()
  const locales = await fetchLocales()
  const activeLocales = locales.filter(locale => locale.isActive)
  return generateAllStaticParams(categories, activeLocales)
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ locale: string; category: string; identifier: string }> 
}) {
  const { locale, category: categorySlug, identifier } = await params
  const categories = await fetchCategories()
  const category = getCategoryBySlug(categories, categorySlug)
  
  if (!category || !category.isActive) {
    notFound()
  }

  // Parse the page identifier
  const pageIdentifier = parsePagePath(
    `${locale}/${categorySlug}/${identifier}`,
    categories
  )

  if (!pageIdentifier) {
    notFound()
  }

  // Fetch content for this page
  const [blocks, menus] = await Promise.all([
    fetchBlocks(locale),
    fetchMenus(locale)
  ])

  // Filter blocks for this category
  const categoryBlocks = blocks.filter(block => 
    !block.constraints?.categories || 
    block.constraints.categories.includes(category.slug)
  )

  return (
    <CategoryPageTemplate
      category={category}
      pageIdentifier={pageIdentifier}
      blocks={categoryBlocks}
      menus={menus}
      locale={locale}
    />
  )
}
