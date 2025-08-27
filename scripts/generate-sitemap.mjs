#!/usr/bin/env node

import { generateCompleteSitemap } from '../lib/sitemap-generator.js'
import { fetchCategories, fetchLocales } from '../lib/cms.js'

// Example CMS-based pages (editorial content)
const cmsPages = [
  {
    path: '/',
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 1.0
  },
  {
    path: '/about',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    path: '/contact',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    path: '/privacy-policy',
    lastmod: new Date().toISOString(),
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/terms-of-service',
    lastmod: new Date().toISOString(),
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    path: '/blog',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 0.6
  },
  {
    path: '/blog/how-to-convert-currency',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    path: '/blog/swift-code-guide',
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.5
  }
]

async function main() {
  try {
    console.log('🚀 Starting sitemap generation...')
    
    // Fetch categories and locales
    const categories = await fetchCategories()
    const locales = await fetchLocales()
    
    console.log(`📊 Found ${categories.length} categories and ${locales.length} locales`)
    
    // Generate complete sitemap
    const result = await generateCompleteSitemap(
      categories,
      locales,
      cmsPages,
      {
        baseUrl: process.env.SITE_URL || 'https://www.example.com',
        maxUrlsPerSitemap: 50000,
        maxSitemapSize: 50 * 1024 * 1024, // 50MB
        changefreq: 'weekly',
        priority: 0.5
      }
    )
    
    console.log('✅ Sitemap generation completed successfully!')
    console.log('📈 Statistics:')
    console.log(`   - Total pages: ${result.totalPages}`)
    console.log(`   - Sitemap files: ${result.sitemapCount}`)
    console.log(`   - Programmatic pages: ${result.stats.programmaticPages}`)
    console.log(`   - CMS pages: ${result.stats.cmsPages}`)
    
    console.log('\n🗂️ Generated files:')
    console.log('   - /public/sitemaps/sitemap.xml (sitemap index)')
    console.log('   - /public/sitemaps/sitemap-0.xml (individual sitemap)')
    console.log('   - /public/sitemaps/robots.txt (robots file)')
    
    console.log('\n🔗 Sitemap URLs:')
    console.log(`   - Sitemap Index: ${process.env.SITE_URL || 'https://www.example.com'}/sitemaps/sitemap.xml`)
    console.log(`   - Robots.txt: ${process.env.SITE_URL || 'https://www.example.com'}/robots.txt`)
    
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
