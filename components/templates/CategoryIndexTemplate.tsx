'use client'

import Link from 'next/link'
import { Category } from '../../lib/types'
import Breadcrumbs from '../layout/Breadcrumbs'
import { generateBreadcrumbs } from '../../lib/seo'

interface CategoryIndexTemplateProps {
  category: Category
  identifiers: string[]
  locale: string
}

export default function CategoryIndexTemplate({
  category,
  identifiers,
  locale
}: CategoryIndexTemplateProps) {
  // Generate breadcrumbs
  const breadcrumbs = generateBreadcrumbs(
    `${process.env.SITE_URL || 'https://example.com'}/${locale === 'en' ? '' : locale}/${category.slug}`,
    category
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {category.name} Directory
        </h1>
        <p className="text-lg text-gray-600">
          Browse all {category.name.toLowerCase()} items and information.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {identifiers.map((identifier) => (
          <div key={identifier} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {identifier}
            </h2>
            <p className="text-gray-600 mb-4">
              View detailed information about {identifier.toLowerCase()}.
            </p>
            <Link
              href={`/${locale}/${category.slug}/${identifier}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {identifiers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No items found in this category.
          </p>
        </div>
      )}
    </div>
  )
}
