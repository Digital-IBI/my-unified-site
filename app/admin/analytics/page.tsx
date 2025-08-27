'use client'

import { useState, useEffect } from 'react'

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  })

  useEffect(() => {
    // Simulate analytics data
    setAnalyticsData({
      pageViews: 1247,
      uniqueVisitors: 892,
      bounceRate: 34.2,
      avgSessionDuration: 2.5
    })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            View site analytics and performance metrics
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Export Data
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Views</h3>
          <p className="text-3xl font-bold text-blue-600">{analyticsData.pageViews.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unique Visitors</h3>
          <p className="text-3xl font-bold text-green-600">{analyticsData.uniqueVisitors.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold text-orange-600">{analyticsData.bounceRate}%</p>
          <p className="text-sm text-gray-500 mt-1">Lower is better</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Session</h3>
          <p className="text-3xl font-bold text-purple-600">{analyticsData.avgSessionDuration}m</p>
          <p className="text-sm text-gray-500 mt-1">Duration</p>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Top Pages</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">/en/currency/usd-eur</h3>
                <p className="text-sm text-gray-500">Currency Converter</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">342 views</p>
                <p className="text-sm text-gray-500">12% of total</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">/en/swift/CHASUS33</h3>
                <p className="text-sm text-gray-500">SWIFT Code Lookup</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">287 views</p>
                <p className="text-sm text-gray-500">10% of total</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">/en/banking/checking-accounts</h3>
                <p className="text-sm text-gray-500">Banking Information</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">234 views</p>
                <p className="text-sm text-gray-500">8% of total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Traffic Sources</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Organic Search</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">65%</p>
                <p className="text-sm text-gray-500">812 visitors</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Direct</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">20%</p>
                <p className="text-sm text-gray-500">249 visitors</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Social Media</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">10%</p>
                <p className="text-sm text-gray-500">125 visitors</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-900">Referral</span>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">5%</p>
                <p className="text-sm text-gray-500">62 visitors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
