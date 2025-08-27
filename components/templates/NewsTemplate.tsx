'use client'

import { Category, PageIdentifier, ContentBlock } from '@/lib/types'
import ContentBlockRenderer from '@/components/blocks/ContentBlockRenderer'

interface NewsTemplateProps {
  category: Category
  pageIdentifier: PageIdentifier
  blocks: ContentBlock[]
}

export default function NewsTemplate({
  category,
  pageIdentifier,
  blocks
}: NewsTemplateProps) {
  const { country } = pageIdentifier.params

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {country} News
        </h1>
        <p className="text-xl text-gray-600">
          Latest news and updates from {country}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ContentBlockRenderer blocks={blocks} />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {country} Information
            </h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Country:</span>
                <span className="ml-2 text-gray-900">{country}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">News Category:</span>
                <span className="ml-2 text-gray-900">{category.name}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <span className="ml-2 text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
