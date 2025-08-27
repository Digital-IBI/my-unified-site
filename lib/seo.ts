import { Category } from './types'

// SEO Guardrails
const SEO_CONFIG = {
  MAX_TITLE_LENGTH: 60, // characters
  MAX_DESCRIPTION_LENGTH: 160, // characters
  MAX_CANONICAL_LENGTH: 2048, // characters
  MAX_JSON_LD_SIZE: 10000, // characters
} as const

// JSON-LD Schema Types
export interface JsonLdSchema {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface BreadcrumbItem {
  name: string
  url: string
}

// Generate JSON-LD for different page types
export function generateJsonLd(
  type: 'WebPage' | 'Article' | 'FAQPage' | 'CurrencyConverter',
  data: {
    title: string
    description: string
    url: string
    category?: Category
    params?: Record<string, string>
    locale?: string
  }
): JsonLdSchema {
  const baseSchema: JsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: data.title,
    description: data.description,
    url: data.url,
  }

  switch (type) {
    case 'WebPage':
      return {
        ...baseSchema,
        breadcrumb: generateBreadcrumbJsonLd(data.url, data.category, data.params),
      }

    case 'Article':
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: data.title,
        datePublished: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: 'Unified Programmatic Site',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Unified Programmatic Site',
        },
      }

    case 'FAQPage':
      return {
        ...baseSchema,
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How to use this service?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'This service provides automated content generation with SEO optimization.',
            },
          },
        ],
      }

    case 'CurrencyConverter':
      return {
        ...baseSchema,
        '@type': 'WebApplication',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'Real-time exchange rates',
          'Multiple currency support',
          'Instant conversion',
        ],
      }

    default:
      return baseSchema
  }
}

// Generate breadcrumb JSON-LD
function generateBreadcrumbJsonLd(
  url: string,
  category?: Category,
  params?: Record<string, string>
): JsonLdSchema {
  const baseUrl = process.env.SITE_URL || 'https://example.com'
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
  ]

  if (category) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: category.name,
      item: `${baseUrl}/${category.slug}`,
    })
  }

  if (params && Object.keys(params).length > 0) {
    const paramNames = Object.values(params).join(' - ')
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: paramNames,
      item: url,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

// Generate breadcrumb navigation items
export function generateBreadcrumbs(
  url: string,
  category?: Category,
  params?: Record<string, string>
): BreadcrumbItem[] {
  // Use a consistent base URL to prevent hydration mismatches
  const baseUrl = process.env.SITE_URL || 'https://www.example.com'
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: baseUrl },
  ]

  if (category) {
    breadcrumbs.push({
      name: category.name,
      url: `${baseUrl}/${category.slug}`,
    })
  }

  if (params && Object.keys(params).length > 0) {
    const paramNames = Object.values(params).join(' - ')
    breadcrumbs.push({
      name: paramNames,
      url: url,
    })
  }

  return breadcrumbs
}

// Validate JSON-LD schema
export function validateJsonLd(schema: JsonLdSchema): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required fields
  if (!schema['@context']) {
    errors.push('Missing @context')
  }
  if (!schema['@type']) {
    errors.push('Missing @type')
  }

  // Check size limit
  const schemaString = JSON.stringify(schema)
  if (schemaString.length > SEO_CONFIG.MAX_JSON_LD_SIZE) {
    errors.push(`JSON-LD too large: ${schemaString.length} characters (max: ${SEO_CONFIG.MAX_JSON_LD_SIZE})`)
  }

  // Check for common issues
  if (schema.name && schema.name.length > SEO_CONFIG.MAX_TITLE_LENGTH) {
    warnings.push(`Name too long: ${schema.name.length} characters (max: ${SEO_CONFIG.MAX_TITLE_LENGTH})`)
  }

  if (schema.description && schema.description.length > SEO_CONFIG.MAX_DESCRIPTION_LENGTH) {
    warnings.push(`Description too long: ${schema.description.length} characters (max: ${SEO_CONFIG.MAX_DESCRIPTION_LENGTH})`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Generate all JSON-LD for a page
export function generateAllJsonLd(
  pageData: {
    title: string
    description: string
    url: string
    category?: Category
    params?: Record<string, string>
    locale?: string
  }
): {
  webPage: JsonLdSchema
  breadcrumb: JsonLdSchema
  categorySpecific?: JsonLdSchema
} {
  const webPage = generateJsonLd('WebPage', pageData)
  const breadcrumb = generateBreadcrumbJsonLd(pageData.url, pageData.category, pageData.params)

  let categorySpecific: JsonLdSchema | undefined

  if (pageData.category) {
    switch (pageData.category.templateType) {
      case 'converter':
        categorySpecific = generateJsonLd('CurrencyConverter', pageData)
        break
      case 'news':
        categorySpecific = generateJsonLd('Article', pageData)
        break
      case 'information':
        categorySpecific = generateJsonLd('FAQPage', pageData)
        break
    }
  }

  return {
    webPage,
    breadcrumb,
    categorySpecific,
  }
}
