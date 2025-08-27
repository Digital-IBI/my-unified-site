'use client'

import { Category, PageIdentifier, ContentBlock } from '../../lib/types'
import ContentBlockRenderer from '../blocks/ContentBlockRenderer'

interface ConverterTemplateProps {
  category: Category
  pageIdentifier: PageIdentifier
  blocks: ContentBlock[]
}

export default function ConverterTemplate({
  category,
  pageIdentifier,
  blocks
}: ConverterTemplateProps) {
  const { base, quote } = pageIdentifier.params

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {base?.toUpperCase()} to {quote?.toUpperCase()} Converter
        </h1>
        <p className="text-xl text-gray-600">
          Convert {base?.toUpperCase()} to {quote?.toUpperCase()} with real-time exchange rates
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Converter Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Currency Converter
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="1.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value={base}>{base?.toUpperCase()}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value={quote}>{quote?.toUpperCase()}</option>
                </select>
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Convert
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">1.00 {base?.toUpperCase()}</div>
                <div className="text-lg text-gray-600">= 0.85 {quote?.toUpperCase()}</div>
                <div className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="lg:col-span-2">
          <ContentBlockRenderer blocks={blocks} />
        </div>
      </div>
    </div>
  )
}
