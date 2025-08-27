// Core types for the generic page generation system

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  urlPattern: string
  templateType: 'converter' | 'directory' | 'news' | 'information' | 'custom'
  isActive: boolean
  priority: number
  locales: string[]
  dataSource?: string
  seoSettings: {
    titleTemplate: string
    descriptionTemplate: string
    canonicalPattern: string
  }
  createdAt: string
  updatedAt: string
}

export type PageIdentifier = {
  category: string
  identifier: string
  locale: string
  params: Record<string, string>
}

export type GeneratedPage = {
  path: string
  category: Category
  identifier: PageIdentifier
  seo: {
    title: string
    description: string
    canonical: string
    hreflang: Record<string, string>
  }
  blocks: ContentBlock[]
  data?: any
}

export type ContentBlock = {
  id: string
  type: 'benefit' | 'cta' | 'faq' | 'promo' | 'info'
  title: string
  body: string
  weight: number
  constraints?: {
    slots?: string[]
    mutually_exclusive?: string[]
    categories?: string[]
  }
  reviewed: boolean
  locale: string
  media?: {
    image?: string
    alt?: string
  }
}

export type Block = ContentBlock

export type MenuItem = {
  id?: string
  label: string
  url: string
  target?: '_self' | '_blank'
  order?: number
  visible?: boolean
  children?: MenuItem[]
  locale: string
}

export type BuildConfig = {
  siteUrl: string
  locales: string[]
  defaultLocale: string
  categories: Category[]
  buildSha: string
  buildTime: string
}

export type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export type SitemapSection = {
  category: string
  locale: string
  entries: SitemapEntry[]
  filePath: string
}
