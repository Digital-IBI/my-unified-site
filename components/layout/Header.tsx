'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface WordPressMenuItem {
  ID: number
  title: string
  url: string
  target: string
  classes: string[]
  children: WordPressMenuItem[]
}

interface HeaderProps {
  locale: string
}

export default function Header({ locale }: HeaderProps) {
  const [wordPressMenu, setWordPressMenu] = useState<WordPressMenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWordPressMenu = async () => {
      try {
        const response = await fetch('/api/admin/wordpress/menu')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.items.length > 0) {
            setWordPressMenu(data.items)
          } else {
            // Fallback to static menu based on WordPress pages
            setWordPressMenu([
              {
                ID: 1,
                title: 'Home',
                url: 'https://seashell-owl-443814.hostingersite.com/',
                target: '_self',
                classes: [],
                children: []
              },
              {
                ID: 2,
                title: 'About Us',
                url: 'https://seashell-owl-443814.hostingersite.com/about-us/',
                target: '_self',
                classes: [],
                children: []
              },
              {
                ID: 3,
                title: 'Services',
                url: 'https://seashell-owl-443814.hostingersite.com/services/',
                target: '_self',
                classes: [],
                children: []
              },
              {
                ID: 4,
                title: 'Works',
                url: 'https://seashell-owl-443814.hostingersite.com/works/',
                target: '_self',
                classes: [],
                children: []
              },
              {
                ID: 5,
                title: 'Tools',
                url: '#',
                target: '_self',
                classes: [],
                children: [
                  {
                    ID: 6,
                    title: 'Currency Converter',
                    url: '/en/currency',
                    target: '_self',
                    classes: [],
                    children: []
                  },
                  {
                    ID: 7,
                    title: 'SWIFT Codes',
                    url: '/en/swift',
                    target: '_self',
                    classes: [],
                    children: []
                  }
                ]
              }
            ])
          }
        } else {
          // Fallback to static menu
          setWordPressMenu([
            {
              ID: 1,
              title: 'Home',
              url: 'https://seashell-owl-443814.hostingersite.com/',
              target: '_self',
              classes: [],
              children: []
            },
            {
              ID: 2,
              title: 'About Us',
              url: 'https://seashell-owl-443814.hostingersite.com/about-us/',
              target: '_self',
              classes: [],
              children: []
            },
            {
              ID: 3,
              title: 'Services',
              url: 'https://seashell-owl-443814.hostingersite.com/services/',
              target: '_self',
              classes: [],
              children: []
            },
            {
              ID: 4,
              title: 'Works',
              url: 'https://seashell-owl-443814.hostingersite.com/works/',
              target: '_self',
              classes: [],
              children: []
            },
            {
              ID: 5,
              title: 'Tools',
              url: '#',
              target: '_self',
              classes: [],
              children: [
                {
                  ID: 6,
                  title: 'Currency Converter',
                  url: '/en/currency',
                  target: '_self',
                  classes: [],
                  children: []
                },
                {
                  ID: 7,
                  title: 'SWIFT Codes',
                  url: '/en/swift',
                  target: '_self',
                  classes: [],
                  children: []
                }
              ]
            }
          ])
        }
      } catch (error) {
        console.error('Failed to fetch WordPress menu:', error)
        // Fallback to static menu
        setWordPressMenu([
          {
            ID: 1,
            title: 'Home',
            url: 'https://seashell-owl-443814.hostingersite.com/',
            target: '_self',
            classes: [],
            children: []
          },
          {
            ID: 2,
            title: 'About Us',
            url: 'https://seashell-owl-443814.hostingersite.com/about-us/',
            target: '_self',
            classes: [],
            children: []
          },
          {
            ID: 3,
            title: 'Services',
            url: 'https://seashell-owl-443814.hostingersite.com/services/',
            target: '_self',
            classes: [],
            children: []
          },
          {
            ID: 4,
            title: 'Works',
            url: 'https://seashell-owl-443814.hostingersite.com/works/',
            target: '_self',
            classes: [],
            children: []
          },
          {
            ID: 5,
            title: 'Tools',
            url: '#',
            target: '_self',
            classes: [],
            children: [
              {
                ID: 6,
                title: 'Currency Converter',
                url: '/en/currency',
                target: '_self',
                classes: [],
                children: []
              },
              {
                ID: 7,
                title: 'SWIFT Codes',
                url: '/en/swift',
                target: '_self',
                classes: [],
                children: []
              }
            ]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchWordPressMenu()
  }, [])

  const renderMenuItem = (item: WordPressMenuItem) => {
    return (
      <li key={item.ID} className="relative group">
        <Link
          href={item.url}
          target={item.target}
          className={`block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors ${item.classes.join(' ')}`}
        >
          {item.title}
        </Link>
        
        {item.children && item.children.length > 0 && (
          <ul className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            {item.children.map(child => (
              <li key={child.ID}>
                <Link
                  href={child.url}
                  target={child.target}
                  className={`block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 ${child.classes.join(' ')}`}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    )
  }

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-bold text-gray-900">Loading...</div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              seashell-owl-443814.hostingersite.com
            </Link>
          </div>

          {/* WordPress Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              {wordPressMenu.map(renderMenuItem)}
            </ul>
          </nav>

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
