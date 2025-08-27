'use client'

import { Category, PageIdentifier, ContentBlock, MenuItem } from '../../lib/types'
import { generateSeoTitle, generateSeoDescription } from '../../lib/categories'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import ContentBlockRenderer from '../blocks/ContentBlockRenderer'
import Breadcrumbs from '../layout/Breadcrumbs'
import { generateBreadcrumbs } from '../../lib/seo'
import ConverterTemplate from './ConverterTemplate'
import DirectoryTemplate from './DirectoryTemplate'
import NewsTemplate from './NewsTemplate'
import InformationTemplate from './InformationTemplate'

interface CategoryPageTemplateProps {
  category: Category
  pageIdentifier: PageIdentifier
  blocks: ContentBlock[]
  menus: MenuItem[]
  locale: string
}

export default function CategoryPageTemplate({
  category,
  pageIdentifier,
  blocks,
  menus,
  locale
}: CategoryPageTemplateProps) {
  // Generate SEO data
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

  // Render appropriate template based on category type
  const renderTemplate = () => {
    switch (category.templateType) {
      case 'converter':
        return (
          <ConverterTemplate
            category={category}
            pageIdentifier={pageIdentifier}
            blocks={blocks}
          />
        )
      case 'directory':
        return (
          <DirectoryTemplate
            category={category}
            pageIdentifier={pageIdentifier}
            blocks={blocks}
          />
        )
      case 'news':
        return (
          <NewsTemplate
            category={category}
            pageIdentifier={pageIdentifier}
            blocks={blocks}
          />
        )
      case 'information':
        return (
          <InformationTemplate
            category={category}
            pageIdentifier={pageIdentifier}
            blocks={blocks}
          />
        )
      default:
        return (
          <DefaultTemplate
            category={category}
            pageIdentifier={pageIdentifier}
            blocks={blocks}
          />
        )
    }
  }

  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(
    `${process.env.SITE_URL || 'https://example.com'}/${locale === 'en' ? '' : locale}/${category.slug}/${pageIdentifier.identifier}`,
    category,
    pageIdentifier.params
  )

  return (
    <div className="min-h-screen bg-white">
      <Header menus={menus} locale={locale} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        {renderTemplate()}
      </main>
      
      <Footer menus={menus} locale={locale} />
    </div>
  )
}

// Default template for unknown category types
function DefaultTemplate({
  category,
  pageIdentifier,
  blocks
}: {
  category: Category
  pageIdentifier: PageIdentifier
  blocks: ContentBlock[]
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.name} - {pageIdentifier.identifier}
        </h1>
        <p className="text-lg text-gray-600">
          {category.description || `Information about ${pageIdentifier.identifier}`}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Details
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <dl className="grid grid-cols-1 gap-4">
                {Object.entries(pageIdentifier.params).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <ContentBlockRenderer blocks={blocks} />
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Category Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-900 capitalize">
                  {category.templateType}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Priority:</span>
                <span className="ml-2 text-gray-900">{category.priority}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Locales:</span>
                <span className="ml-2 text-gray-900">
                  {category.locales.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
