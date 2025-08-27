import { Category } from './types'
import { generateAllStaticParams } from './data-generator'
import { generateUrlsetXml, generateIndexXml } from './sitemap'
import { 
  fetchWordPressPages, 
  fetchWordPressPosts, 
  convertWordPressPagesToSitemap, 
  convertWordPressPostsToSitemap 
} from './wordpress'

interface SitemapConfig {
  baseUrl: string
  maxUrlsPerSitemap: number
  maxSitemapSize: number // in bytes
  changefreq: string
  priority: number
}

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

interface SitemapChunk {
  filename: string
  urls: SitemapEntry[]
  size: number
}

interface SitemapStats {
  totalUrls: number
  totalChunks: number
  totalSize: number
  averageUrlsPerChunk: number
  largestChunk: number
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

// Global sitemap generator instance
let sitemapGenerator: SitemapGenerator | null = null

// Initialize sitemap generator
function getSitemapGenerator(): SitemapGenerator {
  if (!sitemapGenerator) {
    sitemapGenerator = new SitemapGenerator()
  }
  return sitemapGenerator
}

// Generate all URLs for sitemap
export async function generateAllUrls(): Promise<SitemapEntry[]> {
  const generator = getSitemapGenerator()
  
  // Get categories and locales
  const categories = await fetchCategories()
  const locales = await fetchLocales()
  
  // Add programmatic pages
  await generator.addProgrammaticPages(categories, locales)
  
  // Add category index pages
  generator.addCategoryIndexPages(categories, locales)
  
  // Add WordPress pages and posts
  const wordpressPages = await fetchWordPressPages({ status: 'publish', per_page: 100 })
  const wordpressPosts = await fetchWordPressPosts({ status: 'publish', per_page: 100 })
  
  const wpPagesForSitemap = convertWordPressPagesToSitemap(wordpressPages)
  const wpPostsForSitemap = convertWordPressPostsToSitemap(wordpressPosts)
  
  generator.addCmsPages(wpPagesForSitemap)
  generator.addCmsPages(wpPostsForSitemap)
  
  return [...generator.programmaticPages, ...generator.cmsPages]
}

// Split URLs into chunks
export function chunkUrls(urls: SitemapEntry[]): SitemapChunk[] {
  const generator = getSitemapGenerator()
  return generator.chunkPages(urls)
}

// Validate sitemap URLs
export function validateSitemapUrls(urls: SitemapEntry[]): ValidationResult {
  const errors: string[] = []
  
  if (urls.length === 0) {
    errors.push('No URLs found in sitemap')
  }
  
  for (const url of urls) {
    if (!url.loc) {
      errors.push('URL missing location')
      continue
    }
    
    if (!url.loc.startsWith('http')) {
      errors.push(`Invalid URL format: ${url.loc}`)
    }
    
    if (url.priority && (url.priority < 0 || url.priority > 1)) {
      errors.push(`Invalid priority value: ${url.priority} for ${url.loc}`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Get sitemap statistics
export function getSitemapStats(urls: SitemapEntry[], chunks: SitemapChunk[]): SitemapStats {
  const totalUrls = urls.length
  const totalChunks = chunks.length
  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
  const averageUrlsPerChunk = totalChunks > 0 ? totalUrls / totalChunks : 0
  const largestChunk = chunks.length > 0 ? Math.max(...chunks.map(c => c.urls.length)) : 0
  
  return {
    totalUrls,
    totalChunks,
    totalSize,
    averageUrlsPerChunk,
    largestChunk
  }
}

  // Generate sitemap index XML
export function generateSitemapIndexXml(chunks: SitemapChunk[]): string {
  const baseUrl = process.env.SITE_URL || 'https://seashell-owl-443814.hostingersite.com'

  const sitemaps = chunks.map((chunk, index) => ({
    loc: `${baseUrl}/sitemaps/sitemap-${index}.xml`,
    lastmod: new Date().toISOString()
  }))

  return generateIndexXml(sitemaps)
}

// Generate robots.txt content
export function generateRobotsTxt(chunks: SitemapChunk[]): string {
  const baseUrl = process.env.SITE_URL || 'https://seashell-owl-443814.hostingersite.com'
  
  const sitemapUrls = chunks.map((chunk, index) => 
    `${baseUrl}/sitemaps/sitemap-${index}.xml`
  )
  
  return [
    'User-agent: *',
    'Allow: /',
    '',
    'Sitemap: ' + baseUrl + '/sitemap.xml',
    ...sitemapUrls.map(url => 'Sitemap: ' + url),
    '',
    '# Crawl-delay: 1',
    '# Disallow: /admin/',
    '# Disallow: /api/'
  ].join('\n')
}

// Mock functions for fetching data (replace with actual CMS integration)
async function fetchCategories(): Promise<Category[]> {
  // For now, return default categories
  return [
    {
      id: 'currency',
      name: 'Currency Converter',
      slug: 'currency',
      urlPattern: ':base-:quote',
      templateType: 'converter',
      priority: 10,
      isActive: true,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      description: 'Currency conversion tools',
      seoSettings: {
        titleTemplate: '{category} - {param}',
        descriptionTemplate: 'Convert {param} with our {category} tool',
        canonicalPattern: '/{locale}/{category}/{identifier}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'swift',
      name: 'SWIFT Codes',
      slug: 'swift',
      urlPattern: ':code',
      templateType: 'directory',
      priority: 8,
      isActive: true,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      description: 'Bank SWIFT code directory',
      seoSettings: {
        titleTemplate: '{category} - {param}',
        descriptionTemplate: 'Find {param} in our {category} directory',
        canonicalPattern: '/{locale}/{category}/{identifier}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

interface LocaleData {
  code: string
  name: string
  nativeName: string
  isActive: boolean
  isDefault: boolean
}

async function fetchLocales(): Promise<LocaleData[]> {
  // For now, return default locales
  return [
    { code: 'en', name: 'English', nativeName: 'English', isActive: true, isDefault: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true, isDefault: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isActive: true, isDefault: false }
  ]
}

export class SitemapGenerator {
  private config: SitemapConfig
  public programmaticPages: SitemapEntry[] = []
  public cmsPages: SitemapEntry[] = []
  private sitemapIndex: SitemapEntry[] = []

  constructor(config: Partial<SitemapConfig> = {}) {
    this.config = {
      baseUrl: process.env.SITE_URL || 'https://seashell-owl-443814.hostingersite.com',
      maxUrlsPerSitemap: 50000,
      maxSitemapSize: 50 * 1024 * 1024, // 50MB
      changefreq: 'weekly',
      priority: 0.5,
      ...config
    }
  }

  // Add programmatic pages from categories
  async addProgrammaticPages(categories: Category[], locales: LocaleData[]) {
    const activeLocales = locales.filter(locale => locale.isActive)
    const staticParams = generateAllStaticParams(categories, activeLocales)
    
    for (const params of staticParams) {
      const { locale, category, identifier } = params
      const categoryData = categories.find(c => c.slug === category)
      
      if (!categoryData || !categoryData.isActive) continue

      // Generate URL
      const url = this.generateUrl(locale, category, identifier)
      
      // Add to programmatic pages
      this.programmaticPages.push({
        loc: url,
        lastmod: new Date().toISOString(),
        changefreq: this.config.changefreq,
        priority: this.config.priority
      })
    }
  }

  // Add CMS-based pages (editorial content)
  addCmsPages(pages: Array<{ path: string; lastmod?: string; changefreq?: string; priority?: number }>) {
    for (const page of pages) {
      this.cmsPages.push({
        loc: `${this.config.baseUrl}${page.path}`,
        lastmod: page.lastmod || new Date().toISOString(),
        changefreq: page.changefreq || this.config.changefreq,
        priority: page.priority || this.config.priority
      })
    }
  }

  // Add category index pages
  addCategoryIndexPages(categories: Category[], locales: LocaleData[]) {
    const activeLocales = locales.filter(locale => locale.isActive)
    
    for (const category of categories) {
      if (!category.isActive) continue
      
      for (const locale of activeLocales) {
        if (!category.locales.includes(locale.code)) continue
        
        const url = this.generateCategoryUrl(locale.code, category.slug)
        this.programmaticPages.push({
          loc: url,
          lastmod: new Date().toISOString(),
          changefreq: 'daily', // Category pages update more frequently
          priority: 0.8 // Higher priority for category pages
        })
      }
    }
  }

  // Generate sitemap files
  async generateSitemaps(outputDir: string = 'public/sitemaps') {
    const allPages = [...this.programmaticPages, ...this.cmsPages]
    const chunks = this.chunkPages(allPages)
    
    // Write individual sitemap files
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const filename = `sitemap-${i}.xml`
      const xml = generateUrlsetXml(chunk.urls)
      
      // In a real implementation, you would write to file system
      // For now, we'll just store in memory
      chunk.filename = filename
      chunk.size = Buffer.byteLength(xml, 'utf8')
    }
    
    return chunks
  }

  // Split pages into chunks
  chunkPages(pages: SitemapEntry[]): SitemapChunk[] {
    const chunks: SitemapChunk[] = []
    const maxUrls = this.config.maxUrlsPerSitemap
    
    for (let i = 0; i < pages.length; i += maxUrls) {
      const chunkUrls = pages.slice(i, i + maxUrls)
      const xml = generateUrlsetXml(chunkUrls)
      
      chunks.push({
        filename: `sitemap-${chunks.length}.xml`,
        urls: chunkUrls,
        size: Buffer.byteLength(xml, 'utf8')
      })
    }
    
    return chunks
  }

  // Generate URL for programmatic page
  private generateUrl(locale: string, category: string, identifier: string): string {
    const localePath = locale === 'en' ? '' : `/${locale}`
    return `${this.config.baseUrl}${localePath}/${category}/${identifier}`
  }

  // Generate URL for category index page
  private generateCategoryUrl(locale: string, category: string): string {
    const localePath = locale === 'en' ? '' : `/${locale}`
    return `${this.config.baseUrl}${localePath}/${category}`
  }
}

// Export the complete sitemap generation function
export async function generateCompleteSitemap() {
  const generator = new SitemapGenerator()
  
  // Get data
  const categories = await fetchCategories()
  const locales = await fetchLocales()
  
  // Add all types of pages
  await generator.addProgrammaticPages(categories, locales)
  generator.addCategoryIndexPages(categories, locales)
  generator.addCmsPages([
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/about', priority: 0.8, changefreq: 'monthly' },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  ])
  
  // Generate sitemaps
  return await generator.generateSitemaps()
}
