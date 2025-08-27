'use client'

import { useState, useEffect } from 'react'
import { SeoValidationResult, validateSeo, validateSeoConsistency } from '@/lib/seo-validator'

interface SeoPageData {
  url: string
  title?: string
  description?: string
  canonical?: string
  hreflang?: Record<string, string>
  jsonLd?: any[]
  breadcrumbs?: Array<{ name: string; url: string }>
}

export default function SeoAdminPage() {
  const [seoData, setSeoData] = useState<SeoPageData[]>([])
  const [validationResults, setValidationResults] = useState<SeoValidationResult[]>([])
  const [consistencyResults, setConsistencyResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPage, setSelectedPage] = useState<string | null>(null)

  useEffect(() => {
    fetchSeoData()
  }, [])

  const fetchSeoData = async () => {
    setLoading(true)
    try {
      // Fetch sample pages for SEO validation
      const sampleUrls = [
        '/en/currency/usd-eur',
        '/en/currency/gbp-usd',
        '/en/swift/CHASUS33',
        '/en/banking/checking-accounts',
        '/en/news/latest-updates'
      ]

      const data: SeoPageData[] = []
      
      for (const url of sampleUrls) {
        try {
          const response = await fetch(url)
          const html = await response.text()
          
          // Extract SEO data from HTML (simplified)
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)
          const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/i)
          
          const jsonLdMatches = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)
          const jsonLd = jsonLdMatches ? jsonLdMatches.map(match => {
            const content = match.replace(/<script[^>]*>([\s\S]*?)<\/script>/i, '$1')
            try {
              return JSON.parse(content)
            } catch {
              return null
            }
          }).filter(Boolean) : []

          data.push({
            url,
            title: titleMatch ? titleMatch[1] : undefined,
            description: descriptionMatch ? descriptionMatch[1] : undefined,
            canonical: canonicalMatch ? canonicalMatch[1] : undefined,
            jsonLd
          })
        } catch (error) {
          console.warn(`Failed to fetch SEO data for ${url}:`, error)
        }
      }

      setSeoData(data)
      
      // Validate each page
      const results = data.map(page => validateSeo(page))
      setValidationResults(results)
      
      // Check consistency across pages
      const consistency = validateSeoConsistency(data)
      setConsistencyResults(consistency)
      
    } catch (error) {
      console.error('Failed to fetch SEO data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">SEO Monitoring & Validation</h1>
        <p className="text-gray-600 mb-6">
          Monitor SEO performance and validate against guardrails across all pages.
        </p>
        
        <button
          onClick={fetchSeoData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh SEO Data'}
        </button>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pages Analyzed</h3>
          <p className="text-3xl font-bold text-blue-600">{seoData.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {validationResults.length > 0 
              ? Math.round(validationResults.reduce((sum, r) => sum + r.score, 0) / validationResults.length)
              : 0
            }
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Valid Pages</h3>
          <p className="text-3xl font-bold text-green-600">
            {validationResults.filter(r => r.isValid).length}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Errors</h3>
          <p className="text-3xl font-bold text-red-600">
            {validationResults.reduce((sum, r) => sum + r.errors.length, 0)}
          </p>
        </div>
      </div>

      {/* Page-by-Page Analysis */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Page Analysis</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Errors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warnings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seoData.map((page, index) => {
                const validation = validationResults[index]
                if (!validation) return null
                
                return (
                  <tr key={page.url} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {page.url}
                      </div>
                      <div className="text-sm text-gray-500">
                        {page.title || 'No title'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreBgColor(validation.score)} ${getScoreColor(validation.score)}`}>
                        {validation.score}/100
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        validation.isValid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {validation.isValid ? 'Valid' : 'Invalid'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {validation.errors.length}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {validation.warnings.length}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPage(selectedPage === page.url ? null : page.url)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {selectedPage === page.url ? 'Hide' : 'Details'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {/* Detailed view for selected page */}
        {selectedPage && (
          <div className="p-6 border-t border-gray-200">
            {(() => {
              const page = seoData.find(p => p.url === selectedPage)
              const validation = validationResults[seoData.findIndex(p => p.url === selectedPage)]
              
              if (!page || !validation) return null
              
              return (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Detailed Analysis: {page.url}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Errors</h4>
                      {validation.errors.length > 0 ? (
                        <ul className="space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-600 flex items-start">
                              <span className="mr-2">•</span>
                              {error}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-600">No errors found</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Warnings</h4>
                      {validation.warnings.length > 0 ? (
                        <ul className="space-y-1">
                          {validation.warnings.map((warning, index) => (
                            <li key={index} className="text-sm text-yellow-600 flex items-start">
                              <span className="mr-2">•</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-600">No warnings found</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Consistency Analysis */}
      {consistencyResults && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Consistency Analysis</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Duplicate Titles</h3>
                {consistencyResults.duplicateTitles.length > 0 ? (
                  <ul className="space-y-1">
                    {consistencyResults.duplicateTitles.map((title: string, index: number) => (
                      <li key={index} className="text-sm text-red-600">
                        {title}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600">No duplicate titles found</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Duplicate Descriptions</h3>
                {consistencyResults.duplicateDescriptions.length > 0 ? (
                  <ul className="space-y-1">
                    {consistencyResults.duplicateDescriptions.map((desc: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-600">
                        {desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-600">No duplicate descriptions found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
