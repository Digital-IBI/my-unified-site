import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { Category } from '../../../lib/types'
import { getCategoryBySlug } from '../../../lib/categories'
import { fetchCategories, fetchLocales } from '../../../lib/cms'
import { generateSampleIdentifiers } from '../../../lib/data-generator'
import { generateAllJsonLd, generateBreadcrumbs } from '../../../lib/seo'
import CategoryIndexTemplate from '../../../components/templates/CategoryIndexTemplate'

interface CategoryPageProps {
  params: Promise<{ locale: string; category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  const categories = await fetchCategories()
  const category = getCategoryBySlug(categories, categorySlug)
  
  if (!category || !category.isActive) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    }
  }

  const canonical = `${process.env.SITE_URL || 'https://example.com'}/${locale === 'en' ? '' : locale}/${categorySlug}`

  // Generate hreflang tags for all active locales
  const locales = await fetchLocales()
  const activeLocales = locales.filter(l => l.isActive && category.locales.includes(l.code))
  const alternates: Record<string, string> = {
    canonical,
  }

  // Add hreflang for each supported locale
  for (const loc of activeLocales) {
    const localeUrl = `${process.env.SITE_URL || 'https://example.com'}/${loc.code === 'en' ? '' : loc.code}/${categorySlug}`
    alternates[`hreflang-${loc.code}`] = localeUrl
  }

  // Add x-default hreflang (usually the default locale)
  const defaultLocale = activeLocales.find(l => l.isDefault) || activeLocales[0]
  if (defaultLocale) {
    const defaultUrl = `${process.env.SITE_URL || 'https://example.com'}/${defaultLocale.code === 'en' ? '' : defaultLocale.code}/${categorySlug}`
    alternates['hreflang-x-default'] = defaultUrl
  }

             // Generate JSON-LD structured data
           const jsonLd = generateAllJsonLd({
             title: `${category.name} Directory`,
             description: `Browse all ${category.name.toLowerCase()} items and information.`,
             url: canonical,
             category,
             locale
           })

           return {
             title: `${category.name} Directory`,
             description: `Browse all ${category.name.toLowerCase()} items and information.`,
             alternates: {
               canonical,
               languages: Object.fromEntries(
                 activeLocales.map(loc => [
                   loc.code,
                   `${process.env.SITE_URL || 'https://example.com'}/${loc.code === 'en' ? '' : loc.code}/${categorySlug}`
                 ])
               )
             },
             openGraph: {
               title: `${category.name} Directory`,
               description: `Browse all ${category.name.toLowerCase()} items and information.`,
               url: canonical,
             },
             other: {
               // Add JSON-LD structured data
               'application/ld+json': [
                 JSON.stringify(jsonLd.webPage),
                 JSON.stringify(jsonLd.breadcrumb)
               ]
             }
           }
}

export async function generateStaticParams() {
  const categories = await fetchCategories()
  const locales = await fetchLocales()
  const activeCategories = categories.filter(cat => cat.isActive)
  const activeLocales = locales.filter(locale => locale.isActive)
  
  const params: Array<{ locale: string; category: string }> = []
  
  for (const category of activeCategories) {
    for (const locale of activeLocales) {
      // Only generate pages for locales that the category supports
      if (category.locales.includes(locale.code)) {
        params.push({
          locale: locale.code,
          category: category.slug
        })
      }
    }
  }
  
  return params
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params
  const categories = await fetchCategories()
  const category = getCategoryBySlug(categories, categorySlug)
  
  if (!category || !category.isActive) {
    notFound()
  }

  const sampleIdentifiers = generateSampleIdentifiers(category, 12)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <CategoryIndexTemplate
          category={category}
          identifiers={sampleIdentifiers}
          locale={locale}
        />
      </div>
    </div>
  )
}
