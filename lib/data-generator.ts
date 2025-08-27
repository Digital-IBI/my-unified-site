import { Category } from './types'

// Sample data for different category types
const CURRENCY_PAIRS = [
  'usd-eur', 'eur-usd', 'gbp-usd', 'usd-gbp', 'jpy-usd', 'usd-jpy',
  'eur-gbp', 'gbp-eur', 'usd-cad', 'cad-usd', 'aud-usd', 'usd-aud',
  'usd-chf', 'chf-usd', 'usd-cny', 'cny-usd', 'usd-inr', 'inr-usd'
]

const SWIFT_CODES = [
  'BOFAUS3N', 'CHASUS33', 'CITIUS33', 'DEUTDEFF', 'UBSWCHZH',
  'RZBAATWW', 'BNPAFRPP', 'CRESCHZZ', 'DABADKKK', 'ESSEGB2L',
  'GENODEF1', 'HANDDEFF', 'INGBNL2A', 'JPMBCH6L', 'KREUTZZ'
]

const COUNTRIES = [
  'usa', 'india', 'uk', 'germany', 'france', 'japan', 'canada',
  'australia', 'china', 'brazil', 'russia', 'south-korea', 'italy',
  'spain', 'netherlands', 'switzerland', 'sweden', 'norway'
]

const BANKING_TYPES = [
  'swift-code', 'iban-number', 'routing-number', 'sort-code',
  'bsb-code', 'ifsc-code', 'micr-code', 'account-number'
]

// Generate sample identifiers based on category type
export function generateSampleIdentifiers(category: Category, maxCount: number = 10): string[] {
  switch (category.templateType) {
    case 'converter':
      return CURRENCY_PAIRS.slice(0, maxCount)
    case 'directory':
      return SWIFT_CODES.slice(0, maxCount)
    case 'news':
      return COUNTRIES.slice(0, maxCount)
    case 'information':
      return BANKING_TYPES.slice(0, maxCount)
    default:
      return Array.from({ length: maxCount }, (_, i) => `sample-${i + 1}`)
  }
}

// Generate all possible page identifiers for a category
export function generateAllPageIdentifiers(category: Category, activeLocales: Array<{ code: string }>): Array<{ locale: string; identifier: string }> {
  const identifiers = generateSampleIdentifiers(category, 20) // Generate more for build
  const pages: Array<{ locale: string; identifier: string }> = []
  
  // Filter locales to only include active ones that the category supports
  const supportedLocales = activeLocales.filter(locale => 
    category.locales.includes(locale.code)
  )
  
  for (const locale of supportedLocales) {
    for (const identifier of identifiers) {
      pages.push({ locale: locale.code, identifier })
    }
  }
  
  return pages
}

// Generate static params for build-time page generation
export function generateStaticParamsForCategory(category: Category, activeLocales: Array<{ code: string }>) {
  const pages = generateAllPageIdentifiers(category, activeLocales)
  
  return pages.map(({ locale, identifier }) => ({
    locale,
    category: category.slug,
    identifier
  }))
}

// Generate all static params for all active categories
export function generateAllStaticParams(categories: Category[], activeLocales: Array<{ code: string }>) {
  const activeCategories = categories.filter(cat => cat.isActive)
  const allParams: Array<{ locale: string; category: string; identifier: string }> = []
  
  for (const category of activeCategories) {
    const categoryParams = generateStaticParamsForCategory(category, activeLocales)
    allParams.push(...categoryParams)
  }
  
  return allParams
}
