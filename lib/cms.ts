import { MenuItem, Block, Category } from './types'

const base = process.env.CMS_MENUS_ENDPOINT || ""
const footerBase = process.env.CMS_FOOTER_ENDPOINT || ""
const blocksBase = process.env.CMS_BLOCKS_ENDPOINT || ""
const categoriesBase = process.env.CMS_CATEGORIES_ENDPOINT || ""
const token = process.env.CMS_API_TOKEN

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : undefined, cache: "no-store" })
  if (!res.ok) throw new Error(`CMS fetch failed ${res.status} for ${url}`)
  return res.json() as Promise<T>
}

export async function fetchMenus(locale: string): Promise<MenuItem[]> {
  if (!base) return getDefaultMenus(locale)
  try {
    const url = `${base}?locale=${encodeURIComponent(locale)}`
    return await fetchJSON<MenuItem[]>(url)
  } catch (error) {
    console.warn('Failed to fetch menus from CMS, using defaults:', error)
    return getDefaultMenus(locale)
  }
}
export async function fetchFooter(locale: string): Promise<MenuItem[]> {
  if (!footerBase) return []
  const url = `${footerBase}?locale=${encodeURIComponent(locale)}`
  return fetchJSON<MenuItem[]>(url)
}
export async function fetchBlocks(locale: string): Promise<Block[]> {
  if (!blocksBase) return getDefaultBlocks(locale)
  try {
    const url = `${blocksBase}?locale=${encodeURIComponent(locale)}`
    return await fetchJSON<Block[]>(url)
  } catch (error) {
    console.warn('Failed to fetch blocks from CMS, using defaults:', error)
    return getDefaultBlocks(locale)
  }
}

export async function fetchCategories(): Promise<Category[]> {
  // During build time, use defaults. At runtime, try admin API
  if (typeof window === 'undefined') {
    // Build time - use defaults
    if (!categoriesBase) return getDefaultCategories()
    try {
      const url = `${categoriesBase}`
      return await fetchJSON<Category[]>(url)
    } catch (error) {
      console.warn('Failed to fetch categories from CMS, using defaults:', error)
      return getDefaultCategories()
    }
  }

  // Runtime - try admin API first, then fallback
  try {
    const response = await fetch('/api/admin/categories')
    if (response.ok) {
      const data = await response.json()
      return data.categories || []
    }
  } catch (error) {
    console.warn('Failed to fetch categories from admin API:', error)
  }

  if (!categoriesBase) return getDefaultCategories()
  try {
    const url = `${categoriesBase}`
    return await fetchJSON<Category[]>(url)
  } catch (error) {
    console.warn('Failed to fetch categories from CMS, using defaults:', error)
    return getDefaultCategories()
  }
}

export async function fetchLocales(): Promise<Array<{ code: string; name: string; nativeName: string; isActive: boolean; isDefault: boolean }>> {
  // During build time, use defaults. At runtime, try admin API
  if (typeof window === 'undefined') {
    // Build time - use defaults
    return [
      { code: 'en', name: 'English', nativeName: 'English', isActive: true, isDefault: true },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true, isDefault: false },
      { code: 'fr', name: 'French', nativeName: 'Français', isActive: true, isDefault: false },
      { code: 'es', name: 'Spanish', nativeName: 'Español', isActive: true, isDefault: false },
      { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true, isDefault: false }
    ]
  }

  // Runtime - try admin API first, then fallback
  try {
    const response = await fetch('/api/admin/locales')
    if (response.ok) {
      const data = await response.json()
      return data.locales || []
    }
  } catch (error) {
    console.warn('Failed to fetch locales from admin API:', error)
  }

  // Fallback to defaults
  return [
    { code: 'en', name: 'English', nativeName: 'English', isActive: true, isDefault: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true, isDefault: false },
    { code: 'fr', name: 'French', nativeName: 'Français', isActive: true, isDefault: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', isActive: true, isDefault: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true, isDefault: false }
  ]
}

// Default categories for development and fallback
function getDefaultCategories(): Category[] {
  return [
    {
      id: 'currency-converter',
      name: 'Currency Converter',
      slug: 'currency',
      urlPattern: ':base-:quote',
      templateType: 'converter',
      isActive: true,
      priority: 10,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      seoSettings: {
        titleTemplate: '{base} to {quote} Converter - Real-time Exchange Rates',
        descriptionTemplate: 'Convert {base} to {quote} with live exchange rates. Get accurate currency conversion for {base} to {quote}.',
        canonicalPattern: '/currency/{base}-{quote}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'swift-codes',
      name: 'SWIFT Codes',
      slug: 'swift',
      urlPattern: ':code',
      templateType: 'directory',
      isActive: true,
      priority: 9,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      seoSettings: {
        titleTemplate: 'SWIFT Code {code} - Bank Information & Details',
        descriptionTemplate: 'Find SWIFT code {code} details, bank information, and routing details. Complete SWIFT code directory.',
        canonicalPattern: '/swift/{code}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'country-news',
      name: 'Country News',
      slug: 'news',
      urlPattern: ':country',
      templateType: 'news',
      isActive: true,
      priority: 8,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      seoSettings: {
        titleTemplate: '{country} News - Latest Updates & Breaking News',
        descriptionTemplate: 'Get the latest {country} news, breaking updates, and current events. Stay informed with {country} news.',
        canonicalPattern: '/news/{country}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'banking-info',
      name: 'Banking Information',
      slug: 'banking',
      urlPattern: ':type',
      templateType: 'information',
      isActive: true,
      priority: 7,
      locales: ['en', 'hi', 'fr', 'es', 'de'],
      seoSettings: {
        titleTemplate: '{type} Information - Banking Details & Guide',
        descriptionTemplate: 'Complete guide to {type} information, banking details, and procedures. Learn about {type}.',
        canonicalPattern: '/banking/{type}'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

// Default content blocks for development and fallback
function getDefaultBlocks(locale: string): Block[] {
  return [
    {
      id: 'benefit-fast',
      type: 'benefit',
      title: 'Fast & Reliable',
      body: 'Get instant currency conversion with real-time exchange rates. Our service is fast, reliable, and always up-to-date.',
      weight: 10,
      reviewed: true,
      locale,
      constraints: {
        slots: ['benefits'],
        categories: ['currency']
      }
    },
    {
      id: 'benefit-secure',
      type: 'benefit',
      title: 'Secure & Private',
      body: 'Your currency conversion queries are completely private and secure. No personal data is stored or shared.',
      weight: 9,
      reviewed: true,
      locale,
      constraints: {
        slots: ['benefits'],
        categories: ['currency']
      }
    },
    {
      id: 'cta-convert',
      type: 'cta',
      title: 'Start Converting Now',
      body: 'Ready to convert your currency? Use our reliable converter tool to get accurate exchange rates instantly.',
      weight: 8,
      reviewed: true,
      locale,
      constraints: {
        slots: ['cta'],
        categories: ['currency']
      }
    },
    {
      id: 'faq-how-to',
      type: 'faq',
      title: 'How to use the currency converter?',
      body: 'Simply enter the amount you want to convert, select the source and target currencies, and click convert. The result will be displayed instantly with the current exchange rate.',
      weight: 7,
      reviewed: true,
      locale,
      constraints: {
        slots: ['faq'],
        categories: ['currency']
      }
    },
    {
      id: 'promo-accurate',
      type: 'promo',
      title: 'Most Accurate Rates',
      body: 'Our currency converter uses real-time exchange rates from reliable financial sources to ensure accuracy.',
      weight: 6,
      reviewed: true,
      locale,
      constraints: {
        slots: ['promo'],
        categories: ['currency']
      }
    }
  ]
}

// Default menus for development and fallback
function getDefaultMenus(locale: string): MenuItem[] {
  return [
    {
      label: 'Home',
      url: '/',
      target: '_self',
      order: 1,
      visible: true,
      locale
    },
    {
      label: 'Currency Converter',
      url: '/currency',
      target: '_self',
      order: 2,
      visible: true,
      locale
    },
    {
      label: 'SWIFT Codes',
      url: '/swift',
      target: '_self',
      order: 3,
      visible: true,
      locale
    },
    {
      label: 'News',
      url: '/news',
      target: '_self',
      order: 4,
      visible: true,
      locale
    },
    {
      label: 'About',
      url: '/about',
      target: '_self',
      order: 5,
      visible: true,
      locale
    }
  ]
}
