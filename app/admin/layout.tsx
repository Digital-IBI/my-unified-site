'use client'

import Link from 'next/link'
import { Settings, FolderOpen, FileText, BarChart3, Globe, Network, Search, Zap } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: BarChart3,
      description: 'Site overview'
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
      description: 'Manage page categories'
    },
    {
      name: 'Content Blocks',
      href: '/admin/blocks',
      icon: FileText,
      description: 'Manage content blocks'
    },
    {
      name: 'Locales',
      href: '/admin/locales',
      icon: Globe,
      description: 'Manage site locales'
    },
    {
      name: 'Sitemaps',
      href: '/admin/sitemaps',
      icon: Network,
      description: 'Manage sitemaps'
    },
    {
      name: 'WordPress',
      href: '/admin/wordpress',
      icon: Globe,
      description: 'WordPress integration'
    },
    {
      name: 'SEO',
      href: '/admin/seo',
      icon: Search,
      description: 'SEO monitoring & validation'
    },
    {
      name: 'Performance',
      href: '/admin/performance',
      icon: Zap,
      description: 'Performance optimization'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      description: 'View site analytics'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      description: 'Site configuration'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
                View Site
              </Link>
              <Link href="/ops" className="text-sm text-gray-600 hover:text-gray-900">
                Ops Panel
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className={`text-xs ${
                        isActive ? 'text-blue-600' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
