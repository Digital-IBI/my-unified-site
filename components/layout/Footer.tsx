'use client'

import { MenuItem } from '../../lib/types'
import Link from 'next/link'

interface FooterProps {
  menus: MenuItem[]
  locale: string
}

export default function Footer({ menus, locale }: FooterProps) {
  const renderFooterLink = (item: MenuItem) => {
    if (!item.visible) return null

    const url = item.url.startsWith('http') ? item.url : `/${locale}${item.url}`
    
    return (
      <li key={item.id || item.url}>
        <Link
          href={url}
          target={item.target}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Unified Programmatic Site</h3>
            <p className="text-gray-400 mb-4">
              Next.js on Netlify — CMS-as-data — Programmatic SEO
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {menus
                .filter(item => item.visible)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .slice(0, 5)
                .map(renderFooterLink)}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-md font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale === 'en' ? '' : locale}/about`} className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${locale === 'en' ? '' : locale}/contact`} className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href={`/${locale === 'en' ? '' : locale}/privacy`} className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href={`/${locale === 'en' ? '' : locale}/terms`} className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            Built with Next.js and deployed on Netlify
          </p>
        </div>
      </div>
    </footer>
  )
}
