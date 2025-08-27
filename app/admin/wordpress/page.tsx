'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, 
  FileText, 
  FolderOpen, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Calendar,
  User
} from 'lucide-react'

interface WordPressTestResult {
  success: boolean
  message: string
  data?: any
}

interface WordPressPage {
  id: number
  title: { rendered: string }
  slug: string
  status: string
  modified: string
  link: string
}

interface WordPressPost {
  id: number
  title: { rendered: string }
  slug: string
  status: string
  modified: string
  link: string
  excerpt: { rendered: string }
}

export default function WordPressIntegrationPage() {
  const [connectionTest, setConnectionTest] = useState<WordPressTestResult | null>(null)
  const [pages, setPages] = useState<WordPressPage[]>([])
  const [posts, setPosts] = useState<WordPressPost[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'connection' | 'pages' | 'posts'>('connection')

  const testConnection = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/wordpress/test')
      const result = await response.json()
      setConnectionTest(result)
    } catch (error) {
      setConnectionTest({
        success: false,
        message: 'Failed to test connection'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/wordpress/pages')
      const data = await response.json()
      if (data.success) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/wordpress/posts')
      const data = await response.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  useEffect(() => {
    if (activeTab === 'pages') {
      fetchPages()
    } else if (activeTab === 'posts') {
      fetchPosts()
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-600" />
                WordPress Integration
              </h1>
              <p className="text-gray-600 mt-2">
                Test and manage WordPress REST API integration
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={testConnection}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Test Connection
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('connection')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'connection'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Connection Test
              </button>
              <button
                onClick={() => setActiveTab('pages')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pages ({pages.length})
              </button>
              <button
                onClick={() => setActiveTab('posts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'posts'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Posts ({posts.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Connection Test Tab */}
            {activeTab === 'connection' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Connection Status</h2>
                {connectionTest ? (
                  <div className={`p-4 rounded-lg border ${
                    connectionTest.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {connectionTest.success ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      )}
                      <div>
                        <h3 className={`font-medium ${
                          connectionTest.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {connectionTest.success ? 'Connection Successful' : 'Connection Failed'}
                        </h3>
                        <p className={`text-sm ${
                          connectionTest.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {connectionTest.message}
                        </p>
                        {connectionTest.data && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>API Version: {connectionTest.data.apiVersion}</p>
                            <p>Base URL: {connectionTest.data.baseUrl}</p>
                            <p>Posts Available: {connectionTest.data.postsCount}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
                    <p className="text-gray-600">Testing connection...</p>
                  </div>
                )}
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">WordPress Pages</h2>
                  <button
                    onClick={fetchPages}
                    disabled={loading}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
                    <p className="text-gray-600">Loading pages...</p>
                  </div>
                ) : pages.length > 0 ? (
                  <div className="grid gap-4">
                    {pages.map((page) => (
                      <div key={page.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {page.title.rendered}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Slug: {page.slug} • Status: {page.status}
                            </p>
                            <p className="text-xs text-gray-500">
                              Modified: {new Date(page.modified).toLocaleDateString()}
                            </p>
                          </div>
                          <a
                            href={page.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No pages found</p>
                  </div>
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">WordPress Posts</h2>
                  <button
                    onClick={fetchPosts}
                    disabled={loading}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
                    <p className="text-gray-600">Loading posts...</p>
                  </div>
                ) : posts.length > 0 ? (
                  <div className="grid gap-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-1">
                              {post.title.rendered}
                            </h3>
                            <div 
                              className="text-sm text-gray-600 mb-2"
                              dangerouslySetInnerHTML={{ 
                                __html: post.excerpt.rendered.substring(0, 150) + '...' 
                              }}
                            />
                            <p className="text-sm text-gray-600 mb-2">
                              Slug: {post.slug} • Status: {post.status}
                            </p>
                            <p className="text-xs text-gray-500">
                              Modified: {new Date(post.modified).toLocaleDateString()}
                            </p>
                          </div>
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-4"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No posts found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
