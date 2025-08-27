import { JsonLdSchema } from './seo'

// SEO Validation Guardrails
export const SEO_GUARDRAILS = {
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
  MAX_CANONICAL_LENGTH: 2048,
  MAX_JSON_LD_SIZE: 10000,
  MIN_TITLE_LENGTH: 10,
  MIN_DESCRIPTION_LENGTH: 50,
} as const

export interface SeoValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  score: number // 0-100
}

export interface SeoValidationData {
  title?: string
  description?: string
  canonical?: string
  hreflang?: Record<string, string>
  jsonLd?: JsonLdSchema[]
  breadcrumbs?: Array<{ name: string; url: string }>
}

// Validate complete SEO data for a page
export function validateSeo(data: SeoValidationData): SeoValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  let score = 100

  // Title validation
  if (data.title) {
    if (data.title.length < SEO_GUARDRAILS.MIN_TITLE_LENGTH) {
      errors.push(`Title too short: ${data.title.length} characters (min: ${SEO_GUARDRAILS.MIN_TITLE_LENGTH})`)
      score -= 20
    } else if (data.title.length > SEO_GUARDRAILS.MAX_TITLE_LENGTH) {
      errors.push(`Title too long: ${data.title.length} characters (max: ${SEO_GUARDRAILS.MAX_TITLE_LENGTH})`)
      score -= 15
    }
  } else {
    errors.push('Missing title')
    score -= 25
  }

  // Description validation
  if (data.description) {
    if (data.description.length < SEO_GUARDRAILS.MIN_DESCRIPTION_LENGTH) {
      warnings.push(`Description too short: ${data.description.length} characters (min: ${SEO_GUARDRAILS.MIN_DESCRIPTION_LENGTH})`)
      score -= 10
    } else if (data.description.length > SEO_GUARDRAILS.MAX_DESCRIPTION_LENGTH) {
      warnings.push(`Description too long: ${data.description.length} characters (max: ${SEO_GUARDRAILS.MAX_DESCRIPTION_LENGTH})`)
      score -= 5
    }
  } else {
    warnings.push('Missing description')
    score -= 15
  }

  // Canonical URL validation
  if (data.canonical) {
    if (data.canonical.length > SEO_GUARDRAILS.MAX_CANONICAL_LENGTH) {
      errors.push(`Canonical URL too long: ${data.canonical.length} characters (max: ${SEO_GUARDRAILS.MAX_CANONICAL_LENGTH})`)
      score -= 10
    }
    
    try {
      new URL(data.canonical)
    } catch {
      errors.push('Invalid canonical URL format')
      score -= 15
    }
  } else {
    warnings.push('Missing canonical URL')
    score -= 10
  }

  // Hreflang validation
  if (data.hreflang) {
    const hreflangEntries = Object.entries(data.hreflang)
    
    if (hreflangEntries.length === 0) {
      warnings.push('No hreflang tags found')
      score -= 10
    } else {
      // Check for x-default
      const hasXDefault = hreflangEntries.some(([lang]) => lang === 'x-default')
      if (!hasXDefault) {
        warnings.push('Missing x-default hreflang')
        score -= 5
      }

      // Validate hreflang URLs
      for (const [lang, url] of hreflangEntries) {
        try {
          new URL(url)
        } catch {
          errors.push(`Invalid hreflang URL for ${lang}: ${url}`)
          score -= 5
        }
      }
    }
  }

  // JSON-LD validation
  if (data.jsonLd && data.jsonLd.length > 0) {
    for (let i = 0; i < data.jsonLd.length; i++) {
      const schema = data.jsonLd[i]
      const schemaString = JSON.stringify(schema)
      
      if (schemaString.length > SEO_GUARDRAILS.MAX_JSON_LD_SIZE) {
        errors.push(`JSON-LD schema ${i + 1} too large: ${schemaString.length} characters (max: ${SEO_GUARDRAILS.MAX_JSON_LD_SIZE})`)
        score -= 10
      }

      if (!schema['@context'] || !schema['@type']) {
        errors.push(`JSON-LD schema ${i + 1} missing required fields (@context or @type)`)
        score -= 15
      }
    }
  } else {
    warnings.push('No JSON-LD structured data found')
    score -= 15
  }

  // Breadcrumb validation
  if (data.breadcrumbs && data.breadcrumbs.length > 0) {
    if (data.breadcrumbs.length < 2) {
      warnings.push('Breadcrumbs should have at least 2 levels')
      score -= 5
    }

    // Check for valid URLs in breadcrumbs
    for (const breadcrumb of data.breadcrumbs) {
      try {
        new URL(breadcrumb.url)
      } catch {
        errors.push(`Invalid breadcrumb URL: ${breadcrumb.url}`)
        score -= 5
      }
    }
  } else {
    warnings.push('No breadcrumb navigation found')
    score -= 10
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score)
  }
}

// Validate multiple pages for consistency
export function validateSeoConsistency(pages: SeoValidationData[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
  duplicateTitles: string[]
  duplicateDescriptions: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []
  const titles = new Map<string, string[]>()
  const descriptions = new Map<string, string[]>()

  // Check for duplicates
  pages.forEach((page, index) => {
    if (page.title) {
      const normalizedTitle = page.title.toLowerCase().trim()
      if (!titles.has(normalizedTitle)) {
        titles.set(normalizedTitle, [])
      }
      titles.get(normalizedTitle)!.push(`Page ${index + 1}`)
    }

    if (page.description) {
      const normalizedDesc = page.description.toLowerCase().trim()
      if (!descriptions.has(normalizedDesc)) {
        descriptions.set(normalizedDesc, [])
      }
      descriptions.get(normalizedDesc)!.push(`Page ${index + 1}`)
    }
  })

  const duplicateTitles: string[] = []
  const duplicateDescriptions: string[] = []

  titles.forEach((pages, title) => {
    if (pages.length > 1) {
      duplicateTitles.push(`${title} (used on: ${pages.join(', ')})`)
      errors.push(`Duplicate title found: "${title}" used on ${pages.length} pages`)
    }
  })

  descriptions.forEach((pages, desc) => {
    if (pages.length > 1) {
      duplicateDescriptions.push(`${desc} (used on: ${pages.join(', ')})`)
      warnings.push(`Duplicate description found: "${desc}" used on ${pages.length} pages`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    duplicateTitles,
    duplicateDescriptions
  }
}
