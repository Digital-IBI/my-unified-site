'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SitemapChunk {
  index: number
  filename: string
  urlCount: number
  sizeBytes: number
  sizeMB: string
  sampleUrls: string[]
}

interface SitemapStats {
  totalUrls: number
  totalChunks: number
  totalSizeMB: string
  averageUrlsPerChunk: number
  largestChunk: number
  generatedAt: string
}

interface SitemapData {
  success: boolean
  validation: {
    valid: boolean
    errors: string[]
    totalUrls: number
  }
  chunks: SitemapChunk[]
  statistics: SitemapStats
  endpoints: {
    sitemapIndex: string
    robotsTxt: string
    sitemapChunks: string[]
  }
}

export default function SitemapManagementPage() {
  const [sitemapData, setSitemapData] = useState<SitemapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSitemapData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/sitemaps')
      const data = await response.json()
      
      if (data.success) {
        setSitemapData(data)
      } else {
        setError(data.error || 'Failed to fetch sitemap data')
      }
    } catch (err) {
      setError('Failed to fetch sitemap data')
      console.error('Error fetching sitemap data:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshSitemap = async () => {
    try {
      setRefreshing(true)
      await fetchSitemapData()
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchSitemapData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchSitemapData}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!sitemapData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sitemap Management</h1>
                <p className="text-gray-600 mt-2">
                  Manage and monitor your dynamic sitemaps for SEO optimization
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={refreshSitemap}
                  disabled={refreshing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <Link
                  href="/admin"
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Back to Admin
                </Link>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Validation Status</h2>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                sitemapData.validation.valid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {sitemapData.validation.valid ? 'Valid' : 'Invalid'}
              </div>
              <span className="text-gray-600">
                {sitemapData.validation.totalUrls} URLs validated
              </span>
            </div>
            
            {sitemapData.validation.errors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Validation Errors:</h3>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <ul className="text-sm text-red-700 space-y-1">
                    {sitemapData.validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sitemap Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {sitemapData.statistics.totalUrls.toLocaleString()}
                </div>
                <div className="text-sm text-blue-800">Total URLs</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {sitemapData.statistics.totalChunks}
                </div>
                <div className="text-sm text-green-800">Sitemap Files</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {sitemapData.statistics.totalSizeMB} MB
                </div>
                <div className="text-sm text-purple-800">Total Size</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {sitemapData.statistics.averageUrlsPerChunk.toLocaleString()}
                </div>
                <div className="text-sm text-orange-800">Avg URLs/File</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Last generated: {new Date(sitemapData.statistics.generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Sitemap Chunks */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sitemap Files</h2>
            <div className="space-y-4">
              {sitemapData.chunks.map((chunk) => (
                <div key={chunk.index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{chunk.filename}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{chunk.urlCount.toLocaleString()} URLs</span>
                      <span>{chunk.sizeMB} MB</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Sample URLs:
                  </div>
                  <div className="space-y-1">
                    {chunk.sampleUrls.map((url, index) => (
                      <div key={index} className="text-xs text-gray-500 font-mono bg-gray-50 p-1 rounded">
                        {url}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Endpoints */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sitemap Endpoints</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Sitemap Index</div>
                  <div className="text-sm text-gray-600">Main sitemap index file</div>
                </div>
                <a
                  href={sitemapData.endpoints.sitemapIndex}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View XML
                </a>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Robots.txt</div>
                  <div className="text-sm text-gray-600">Search engine directives</div>
                </div>
                <a
                  href={sitemapData.endpoints.robotsTxt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Text
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
