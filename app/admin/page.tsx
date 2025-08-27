import Link from 'next/link'
import { fetchCategories } from '../../lib/cms'

export default async function AdminPage() {
  const categories = await fetchCategories()
  const activeCategories = categories.filter(cat => cat.isActive)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome to the Unified Programmatic Site admin panel
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Category
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Categories</h3>
          <p className="text-3xl font-bold text-blue-600">{categories.length}</p>
          <p className="text-sm text-gray-500 mt-1">
            {activeCategories.length} active
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Pages</h3>
          <p className="text-3xl font-bold text-green-600">
            {activeCategories.reduce((total, cat) => total + (cat.locales?.length || 0) * 10, 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Programmatic pages</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Supported Locales</h3>
          <p className="text-3xl font-bold text-purple-600">3</p>
          <p className="text-sm text-gray-500 mt-1">
            <Link href="/admin/locales" className="text-blue-600 hover:underline">
              Manage locales
            </Link>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Status</h3>
          <p className="text-3xl font-bold text-green-600">Live</p>
          <p className="text-sm text-gray-500 mt-1">All systems operational</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Performance optimization completed</span>
              </div>
              <span className="text-sm text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-gray-700">SEO validation passed</span>
              </div>
              <span className="text-sm text-gray-500">5 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-gray-700">Sitemap updated</span>
              </div>
              <span className="text-sm text-gray-500">10 minutes ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/categories"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">C</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Manage Categories</h3>
                <p className="text-sm text-gray-500">Add or edit page categories</p>
              </div>
            </Link>
            
            <Link
              href="/admin/blocks"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">B</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Content Blocks</h3>
                <p className="text-sm text-gray-500">Manage dynamic content</p>
              </div>
            </Link>
            
            <Link
              href="/admin/locales"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-purple-600 font-semibold">L</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Locales</h3>
                <p className="text-sm text-gray-500">Manage site languages</p>
              </div>
            </Link>
            
            <Link
              href="/admin/sitemaps"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-orange-600 font-semibold">S</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Sitemaps</h3>
                <p className="text-sm text-gray-500">View and manage sitemaps</p>
              </div>
            </Link>
            
            <Link
              href="/admin/seo"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-red-600 font-semibold">E</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">SEO Monitoring</h3>
                <p className="text-sm text-gray-500">Check SEO performance</p>
              </div>
            </Link>
            
            <Link
              href="/admin/performance"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-yellow-600 font-semibold">P</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Performance</h3>
                <p className="text-sm text-gray-500">Monitor site performance</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
