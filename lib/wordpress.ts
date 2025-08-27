// WordPress REST API integration
const WORDPRESS_API_BASE = process.env.WORDPRESS_URL 
  ? `${process.env.WORDPRESS_URL}/wp-json/wp/v2`
  : 'https://seashell-owl-443814.hostingersite.com/wp-json/wp/v2'

export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: string
  ping_status: string
  sticky: boolean
  template: string
  format: string
  meta: any
  _links: any
}

export interface WordPressPage {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: string
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: string
  ping_status: string
  template: string
  meta: any
  _links: any
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
  meta: any
  _links: any
}

export interface WordPressMenu {
  ID: number
  name: string
  slug: string
  description: string
  count: number
  items: WordPressMenuItem[]
}

export interface WordPressMenuItem {
  ID: number
  title: string
  url: string
  target: string
  classes: string[]
  xfn: string
  description: string
  object_id: number
  object: string
  object_type: string
  type: string
  type_label: string
  parent: number
  menu_item_parent: number
  menu_order: number
  db_id: number
  position: number
  children: WordPressMenuItem[]
}

// Fetch WordPress posts
export async function fetchWordPressPosts(params: {
  per_page?: number
  page?: number
  status?: string
  categories?: number[]
  search?: string
} = {}): Promise<WordPressPost[]> {
  const searchParams = new URLSearchParams()
  
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.status) searchParams.append('status', params.status)
  if (params.categories) searchParams.append('categories', params.categories.join(','))
  if (params.search) searchParams.append('search', params.search)
  
  const url = `${WORDPRESS_API_BASE}/posts?${searchParams.toString()}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress posts:', error)
    return []
  }
}

// Fetch WordPress pages
export async function fetchWordPressPages(params: {
  per_page?: number
  page?: number
  status?: string
  parent?: number
  search?: string
} = {}): Promise<WordPressPage[]> {
  const searchParams = new URLSearchParams()
  
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.status) searchParams.append('status', params.status)
  if (params.parent) searchParams.append('parent', params.parent.toString())
  if (params.search) searchParams.append('search', params.search)
  
  const url = `${WORDPRESS_API_BASE}/pages?${searchParams.toString()}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress pages:', error)
    return []
  }
}

// Fetch WordPress categories
export async function fetchWordPressCategories(params: {
  per_page?: number
  page?: number
  hide_empty?: boolean
  parent?: number
} = {}): Promise<WordPressCategory[]> {
  const searchParams = new URLSearchParams()
  
  if (params.per_page) searchParams.append('per_page', params.per_page.toString())
  if (params.page) searchParams.append('page', params.page.toString())
  if (params.hide_empty !== undefined) searchParams.append('hide_empty', params.hide_empty.toString())
  if (params.parent) searchParams.append('parent', params.parent.toString())
  
  const url = `${WORDPRESS_API_BASE}/categories?${searchParams.toString()}`
  
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress categories:', error)
    return []
  }
}

// Fetch WordPress menu (if available)
export async function fetchWordPressMenu(location: string = 'primary'): Promise<WordPressMenu | null> {
  try {
    // Try to fetch menu from WordPress REST API
    const response = await fetch(`${WORDPRESS_API_BASE}/menu-locations/${location}`)
    if (!response.ok) {
      console.warn(`Menu location '${location}' not found, returning null`)
      return null
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress menu:', error)
    return null
  }
}

// Convert WordPress pages to sitemap entries
export function convertWordPressPagesToSitemap(pages: WordPressPage[]): Array<{
  path: string
  lastmod: string
  changefreq: string
  priority: number
}> {
  return pages.map(page => ({
    path: `/${page.slug}`,
    lastmod: page.modified,
    changefreq: 'monthly',
    priority: page.slug === 'home' || page.slug === '' ? 1.0 : 0.8
  }))
}

// Convert WordPress posts to sitemap entries
export function convertWordPressPostsToSitemap(posts: WordPressPost[]): Array<{
  path: string
  lastmod: string
  changefreq: string
  priority: number
}> {
  return posts.map(post => ({
    path: `/blog/${post.slug}`,
    lastmod: post.modified,
    changefreq: 'weekly',
    priority: 0.6
  }))
}

// Get WordPress site info
export async function getWordPressSiteInfo() {
  try {
    const response = await fetch('https://seashell-owl-443814.hostingersite.com/wp-json/')
    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress site info:', error)
    return null
  }
}

// Test WordPress API connection
export async function testWordPressConnection(): Promise<{
  success: boolean
  message: string
  data?: any
}> {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?per_page=1`)
    if (!response.ok) {
      return {
        success: false,
        message: `WordPress API error: ${response.status} ${response.statusText}`
      }
    }
    
    const posts = await response.json()
    return {
      success: true,
      message: 'WordPress API connection successful',
      data: {
        postsCount: posts.length,
        apiVersion: 'v2',
        baseUrl: WORDPRESS_API_BASE
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
