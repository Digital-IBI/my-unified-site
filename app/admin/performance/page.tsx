'use client'

import { useState, useEffect } from 'react'
import { 
  PerformanceMetrics, 
  PerformanceReport, 
  calculatePerformanceScore,
  getPerformanceMetrics,
  analyzeBundleSize,
  optimizeImages,
  optimizeJavaScript,
  optimizeCSS,
  optimizeBuild,
  optimizeCaching,
  PERFORMANCE_GUARDRAILS
} from '../../../lib/performance'

interface BundleStats {
  chunks: Array<{ name: string; size: number }>
  totalSize: number
}

export default function PerformanceAdminPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [bundleStats, setBundleStats] = useState<BundleStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'optimization' | 'monitoring'>('overview')

  useEffect(() => {
    fetchPerformanceData()
  }, [])

           const fetchPerformanceData = async () => {
           setLoading(true)
           try {
             // Fetch performance data from API
             const [overviewRes, metricsRes, bundleRes] = await Promise.all([
               fetch('/api/admin/performance'),
               fetch('/api/admin/performance?action=metrics'),
               fetch('/api/admin/performance?action=bundle')
             ])

             if (overviewRes.ok) {
               const overviewData = await overviewRes.json()
               setMetrics(overviewData.data.metrics)
               setReport(overviewData.data.report)
             }

             if (bundleRes.ok) {
               const bundleData = await bundleRes.json()
               setBundleStats(bundleData.data)
             }
             
           } catch (error) {
             console.error('Failed to fetch performance data:', error)
           } finally {
             setLoading(false)
           }
         }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 80) return 'bg-blue-100'
    if (score >= 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'optimization', name: 'Optimization', icon: '⚡' },
    { id: 'monitoring', name: 'Monitoring', icon: '📈' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Optimization</h1>
        <p className="text-gray-600 mb-6">
          Monitor and optimize Core Web Vitals, bundle size, and overall performance.
        </p>
        
        <button
          onClick={fetchPerformanceData}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Performance Data'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-8">
          {/* Performance Score */}
          {report && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(report.score)} ${getScoreColor(report.score)} text-2xl font-bold mb-2`}>
                    {report.score}
                  </div>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(report.score)} ${getScoreColor(report.score)} text-2xl font-bold mb-2`}>
                    {report.grade}
                  </div>
                  <p className="text-sm text-gray-600">Grade</p>
                </div>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${report.isOptimized ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-2xl font-bold mb-2`}>
                    {report.isOptimized ? '✓' : '⚠'}
                  </div>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 text-2xl font-bold mb-2">
                    {report.issues.length}
                  </div>
                  <p className="text-sm text-gray-600">Issues</p>
                </div>
              </div>
            </div>
          )}

          {/* Core Web Vitals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Core Web Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">LCP</h3>
                <p className={`text-2xl font-bold ${metrics.lcp && metrics.lcp > PERFORMANCE_GUARDRAILS.LCP_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Target: {PERFORMANCE_GUARDRAILS.LCP_THRESHOLD}ms</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">FID</h3>
                <p className={`text-2xl font-bold ${metrics.fid && metrics.fid > PERFORMANCE_GUARDRAILS.FID_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Target: {PERFORMANCE_GUARDRAILS.FID_THRESHOLD}ms</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">CLS</h3>
                <p className={`text-2xl font-bold ${metrics.cls && metrics.cls > PERFORMANCE_GUARDRAILS.CLS_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Target: {PERFORMANCE_GUARDRAILS.CLS_THRESHOLD}</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">TTFB</h3>
                <p className={`text-2xl font-bold ${metrics.ttfb && metrics.ttfb > PERFORMANCE_GUARDRAILS.TTFB_THRESHOLD ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
                </p>
                <p className="text-sm text-gray-500">Target: {PERFORMANCE_GUARDRAILS.TTFB_THRESHOLD}ms</p>
              </div>
            </div>
          </div>

          {/* Bundle Analysis */}
          {bundleStats && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Bundle Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Total Bundle Size</h3>
                  <p className={`text-3xl font-bold ${bundleStats.totalSize > PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD * 1024 ? 'text-red-600' : 'text-green-600'}`}>
                    {Math.round(bundleStats.totalSize / 1024)}KB
                  </p>
                  <p className="text-sm text-gray-500">Target: {PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD}KB</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Largest Chunks</h3>
                  <div className="space-y-2">
                    {bundleStats.chunks.slice(0, 3).map((chunk, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{chunk.name}</span>
                        <span className="text-sm font-medium text-gray-900">{Math.round(chunk.size / 1024)}KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Tab */}
      {selectedTab === 'optimization' && (
        <div className="space-y-8">
          {/* Issues and Recommendations */}
          {report && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issues & Recommendations</h2>
              
              {report.issues.length > 0 ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-red-700 mb-2">Issues Found</h3>
                    <ul className="space-y-2">
                      {report.issues.map((issue, index) => (
                        <li key={index} className="flex items-start text-red-600">
                          <span className="mr-2 mt-1">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-blue-700 mb-2">Recommendations</h3>
                    <ul className="space-y-2">
                      {report.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start text-blue-600">
                          <span className="mr-2 mt-1">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-green-600 font-medium">No performance issues detected! 🎉</p>
              )}
            </div>
          )}

          {/* Optimization Strategies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {optimizeImages().map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">JavaScript Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {optimizeJavaScript().map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CSS Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {optimizeCSS().map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Build Optimization</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {optimizeBuild().map((strategy, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {selectedTab === 'monitoring' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Monitoring</h2>
            <p className="text-gray-600 mb-4">
              Real-time performance monitoring and alerting system.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Core Web Vitals</h3>
                <p className="text-sm text-gray-600">LCP, FID, CLS monitoring</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bundle Size</h3>
                <p className="text-sm text-gray-600">Automatic size tracking</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Build Time</h3>
                <p className="text-sm text-gray-600">CI/CD integration</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Guardrails</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Thresholds</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>LCP: ≤ {PERFORMANCE_GUARDRAILS.LCP_THRESHOLD}ms</li>
                  <li>FID: ≤ {PERFORMANCE_GUARDRAILS.FID_THRESHOLD}ms</li>
                  <li>CLS: ≤ {PERFORMANCE_GUARDRAILS.CLS_THRESHOLD}</li>
                  <li>TTFB: ≤ {PERFORMANCE_GUARDRAILS.TTFB_THRESHOLD}ms</li>
                  <li>Bundle Size: ≤ {PERFORMANCE_GUARDRAILS.BUNDLE_SIZE_THRESHOLD}KB</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Alerts</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Performance score drops below 80</li>
                  <li>Core Web Vitals exceed thresholds</li>
                  <li>Bundle size increases by 20%</li>
                  <li>Build time exceeds 5 minutes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
