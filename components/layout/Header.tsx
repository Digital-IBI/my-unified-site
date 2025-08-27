'use client'

import { MenuItem } from '@/lib/types'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeaderProps {
  menus: MenuItem[]
  locale: string
}

interface Locale {
  code: string
  name: string
  nativeName: string
  isActive: boolean
  isDefault: boolean
}

export default function Header({ menus, locale }: HeaderProps) {
  const [locales, setLocales] = useState<Locale[]>([])
  const [showLocaleMenu, setShowLocaleMenu] = useState(false)

  useEffect(() => {
    // Fetch available locales
    const fetchLocales = async () => {
      try {
        const response = await fetch('/api/admin/locales')
        if (response.ok) {
          const data = await response.json()
          setLocales(data.locales || [])
        }
      } catch (error) {
        console.warn('Failed to fetch locales for header')
      }
    }

    fetchLocales()
  }, [])

  useEffect(() => {
    // Close locale menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.locale-switcher')) {
        setShowLocaleMenu(false)
      }
    }

    if (showLocaleMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showLocaleMenu])

  const renderMenuItem = (item: MenuItem) => {
    if (!item.visible) return null

    const url = item.url.startsWith('http') ? item.url : `/${locale}${item.url}`
    
    return (
      <li key={item.id || item.url} className="relative group">
        <Link
          href={url}
          target={item.target}
          className="block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
        >
          {item.label}
        </Link>
        
        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.children
              .filter(child => child.visible)
              .map(child => (
                <li key={child.id || child.url}>
                  <Link
                    href={child.url.startsWith('http') ? child.url : `/${locale}${child.url}`}
                    target={child.target}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={`/${locale === 'en' ? '' : locale}`} className="text-xl font-bold text-gray-900">
              Unified Site
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {menus
                .filter(item => item.visible)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map(renderMenuItem)}
            </ul>
          </nav>

          {/* Locale Switcher */}
          <div className="hidden md:block relative locale-switcher">
            <button
              onClick={() => setShowLocaleMenu(!showLocaleMenu)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                {locale.toUpperCase()}
              </span>
              <span className="hidden sm:inline">{locales.find(l => l.code === locale)?.nativeName || locale}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLocaleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-1">
                  {locales
                    .filter(l => l.isActive)
                    .map(loc => (
                      <Link
                        key={loc.code}
                        href={`/${loc.code === 'en' ? '' : loc.code}${window.location.pathname.replace(/^\/[a-z]{2}/, '')}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        onClick={() => setShowLocaleMenu(false)}
                      >
                        <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800 mr-3">
                          {loc.code.toUpperCase()}
                        </span>
                        <span>{loc.nativeName}</span>
                        {loc.code === locale && (
                          <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
