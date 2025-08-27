'use client'

import { useEffect, useState } from 'react'
import { 
  PerformanceMetrics, 
  PerformanceReport, 
  calculatePerformanceScore,
  getPerformanceMetrics 
} from '../../lib/performance'

interface PerformanceMonitorProps {
  showDetails?: boolean
  className?: string
}

export default function PerformanceMonitor({ 
  showDetails = false, 
  className = '' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const measurePerformance = async () => {
      try {
        const performanceMetrics = await getPerformanceMetrics()
        setMetrics(performanceMetrics)
        
        const performanceReport = calculatePerformanceScore(performanceMetrics)
        setReport(performanceReport)
      } catch (error) {
        console.error('Failed to measure performance:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Wait for page to load before measuring
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
      return () => window.removeEventListener('load', measurePerformance)
    }
  }, [])

  if (isLoading) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    if (score >= 60) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600'
      case 'B': return 'text-blue-600'
      case 'C': return 'text-yellow-600'
      case 'D': return 'text-orange-600'
      case 'F': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(report.score)}`}>
            {report.score}/100
          </span>
          <span className={`text-2xl font-bold ${getGradeColor(report.grade)}`}>
            {report.grade}
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="space-y-4">
          {/* Core Web Vitals */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Core Web Vitals</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">LCP:</span>
                <span className={`ml-2 font-medium ${metrics.lcp && metrics.lcp > 2500 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">FID:</span>
                <span className={`ml-2 font-medium ${metrics.fid && metrics.fid > 100 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">CLS:</span>
                <span className={`ml-2 font-medium ${metrics.cls && metrics.cls > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.cls ? metrics.cls.toFixed(3) : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">TTFB:</span>
                <span className={`ml-2 font-medium ${metrics.ttfb && metrics.ttfb > 600 ? 'text-red-600' : 'text-green-600'}`}>
                  {metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">First Paint:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {metrics.firstPaint ? `${Math.round(metrics.firstPaint)}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">FCP:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {metrics.firstContentfulPaint ? `${Math.round(metrics.firstContentfulPaint)}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">DOM Ready:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {metrics.domContentLoaded ? `${Math.round(metrics.domContentLoaded)}ms` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Memory:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {metrics.memoryUsage ? `${Math.round(metrics.memoryUsage)}MB` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Issues and Recommendations */}
          {report.issues.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2">Issues Found</h4>
              <ul className="text-sm text-red-600 space-y-1">
                {report.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-700 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {recommendation}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Performance Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-sm font-medium ${report.isOptimized ? 'text-green-600' : 'text-red-600'}`}>
            {report.isOptimized ? 'Optimized' : 'Needs Improvement'}
          </span>
        </div>
      </div>
    </div>
  )
}
