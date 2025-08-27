import { Category, PageIdentifier } from './types'

// Category validation utilities
export function validateCategory(category: Partial<Category>): string[] {
  const errors: string[] = []
  
  if (!category.slug) {
    errors.push('Category slug is required')
  } else if (!/^[a-z0-9-]+$/.test(category.slug)) {
    errors.push('Category slug must be lowercase alphanumeric with hyphens only')
  }
  
  if (!category.urlPattern) {
    errors.push('URL pattern is required')
  } else if (!category.urlPattern.includes(':')) {
    errors.push('URL pattern must contain at least one parameter (e.g., :code, :country)')
  }
  
  if (!category.name) {
    errors.push('Category name is required')
  }
  
  if (!category.templateType) {
    errors.push('Template type is required')
  }
  
  if (!category.locales || category.locales.length === 0) {
    errors.push('At least one locale must be specified')
  }
  
  return errors
}

// URL pattern parsing utilities
export function parseUrlPattern(pattern: string): string[] {
  const matches = pattern.match(/:[a-zA-Z0-9_]+/g)
  return matches ? matches.map(match => match.slice(1)) : []
}

export function buildUrlFromPattern(pattern: string, params: Record<string, string>): string {
  let url = pattern
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, encodeURIComponent(value))
  }
  return url
}

export function extractParamsFromUrl(pattern: string, url: string): Record<string, string> | null {
  // Handle patterns that don't contain slashes (like :base-:quote)
  if (!pattern.includes('/')) {
    // Create a regex pattern from the URL pattern
    let regexPattern = pattern
    const paramNames: string[] = []
    
    // Extract parameter names and replace with regex groups
    regexPattern = regexPattern.replace(/:[a-zA-Z0-9_]+/g, (match) => {
      const paramName = match.slice(1)
      paramNames.push(paramName)
      return '([^/]+)' // Match any characters except slash
    })
    
    // Create regex and test against URL
    const regex = new RegExp(`^${regexPattern}$`)
    const match = url.match(regex)
    
    if (!match) {
      return null
    }
    
    // Extract parameters from regex groups
    const params: Record<string, string> = {}
    for (let i = 0; i < paramNames.length; i++) {
      params[paramNames[i]] = decodeURIComponent(match[i + 1])
    }
    
    return params
  }
  
  // Handle patterns with slashes (original logic)
  const patternParts = pattern.split('/')
  const urlParts = url.split('/')
  
  if (patternParts.length !== urlParts.length) {
    return null
  }
  
  const params: Record<string, string> = {}
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i]
    const urlPart = urlParts[i]
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1)
      params[paramName] = decodeURIComponent(urlPart)
    } else if (patternPart !== urlPart) {
      return null
    }
  }
  
  return params
}

// Category management utilities
export function getActiveCategories(categories: Category[]): Category[] {
  return categories
    .filter(cat => cat.isActive)
    .sort((a, b) => b.priority - a.priority)
}

export function getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug)
}

export function validateCategoryUniqueness(categories: Category[], newCategory: Category): string[] {
  const errors: string[] = []
  
  // Check for duplicate slugs
  const existingSlug = categories.find(cat => 
    cat.slug === newCategory.slug && cat.id !== newCategory.id
  )
  if (existingSlug) {
    errors.push(`Category slug "${newCategory.slug}" already exists`)
  }
  
  // Check for duplicate URL patterns
  const existingPattern = categories.find(cat => 
    cat.urlPattern === newCategory.urlPattern && cat.id !== newCategory.id
  )
  if (existingPattern) {
    errors.push(`URL pattern "${newCategory.urlPattern}" already exists`)
  }
  
  return errors
}

// Page generation utilities
export function generatePagePath(category: Category, identifier: string, locale: string): string {
  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const categoryPath = `/${category.slug}/${identifier}`
  return `${localePrefix}${categoryPath}`
}

export function parsePagePath(path: string, categories: Category[]): PageIdentifier | null {
  // Remove leading/trailing slashes and split
  const parts = path.replace(/^\/+|\/+$/g, '').split('/')
  
  if (parts.length < 2) return null
  
  // Check if first part is a locale
  const locales = ['en', 'hi', 'fr', 'es', 'de'] // Add more as needed
  const isLocale = locales.includes(parts[0])
  
  const locale = isLocale ? parts[0] : 'en'
  const categorySlug = isLocale ? parts[1] : parts[0]
  const identifier = isLocale ? parts.slice(2).join('/') : parts.slice(1).join('/')
  
  const category = getCategoryBySlug(categories, categorySlug)
  if (!category || !category.isActive) return null
  
  const params = extractParamsFromUrl(category.urlPattern, identifier)
  if (!params) return null
  
  return {
    category: category.slug,
    identifier,
    locale,
    params
  }
}

// SEO utilities
export function generateSeoTitle(template: string, params: Record<string, string>, category: Category): string {
  let title = template
  
  // Replace category-specific placeholders
  title = title.replace(/{category}/g, category.name)
  
  // Replace URL parameters
  for (const [key, value] of Object.entries(params)) {
    title = title.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  
  // Ensure title length limit (580px ≈ 60 characters)
  if (title.length > 60) {
    title = title.substring(0, 57) + '...'
  }
  
  return title
}

export function generateSeoDescription(template: string, params: Record<string, string>, category: Category): string {
  let description = template
  
  // Replace category-specific placeholders
  description = description.replace(/{category}/g, category.name)
  
  // Replace URL parameters
  for (const [key, value] of Object.entries(params)) {
    description = description.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  
  // Ensure description length limit (160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...'
  }
  
  return description
}

// Build configuration utilities
export function createBuildConfig(
  siteUrl: string,
  locales: string[],
  categories: Category[],
  buildSha: string
) {
  return {
    siteUrl: siteUrl.replace(/\/$/, ''),
    locales,
    defaultLocale: 'en',
    categories: getActiveCategories(categories),
    buildSha,
    buildTime: new Date().toISOString()
  }
}
