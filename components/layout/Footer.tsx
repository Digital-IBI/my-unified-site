'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">CONTACT INFO</h3>
            <div className="space-y-2 text-gray-300">
              <p>123 Fifth Ave, New York, NY 12004, USA.</p>
              <p>+1 123 456 78 90</p>
              <p>mail@example.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/works" className="text-gray-300 hover:text-white transition-colors">
                  Works
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Programmatic Tools */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/en/currency" className="text-gray-300 hover:text-white transition-colors">
                  Currency Converter
                </Link>
              </li>
              <li>
                <Link href="/en/swift" className="text-gray-300 hover:text-white transition-colors">
                  SWIFT Codes
                </Link>
              </li>
              <li>
                <Link href="/hi/currency" className="text-gray-300 hover:text-white transition-colors">
                  मुद्रा कनवर्टर
                </Link>
              </li>
              <li>
                <Link href="/fr/currency" className="text-gray-300 hover:text-white transition-colors">
                  Convertisseur de Devises
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>Copyright © 2025 seashell-owl-443814.hostingersite.com | Powered by seashell-owl-443814.hostingersite.com</p>
        </div>
      </div>
    </footer>
  )
}
