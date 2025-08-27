import { NextRequest, NextResponse } from 'next/server'

interface Locale {
  code: string
  name: string
  nativeName: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
}

// In-memory storage reference (same as main locales route)
// In production, this would be a database reference
let locales: Locale[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isActive: true,
    isDefault: true,
    createdAt: new Date().toISOString()
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString()
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString()
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString()
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString()
  }
]

function parseCSV(csvText: string): Locale[] {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  const parsedLocales: Locale[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row: any = {}
    
    headers.forEach((header, index) => {
      row[header] = values[index] || ''
    })
    
    // Validate required fields
    if (!row.code || !row.name) {
      continue // Skip invalid rows
    }
    
    const locale: Locale = {
      code: row.code.toLowerCase(),
      name: row.name,
      nativeName: row.nativename || row.name,
      isActive: row.isactive === 'true' || row.isactive === '1' || true,
      isDefault: row.isdefault === 'true' || row.isdefault === '1' || false,
      createdAt: new Date().toISOString()
    }
    
    parsedLocales.push(locale)
  }
  
  return parsedLocales
}

function validateLocale(locale: Locale): string[] {
  const errors: string[] = []
  
  if (!locale.code || locale.code.length !== 2) {
    errors.push(`Locale code must be exactly 2 characters for ${locale.name}`)
  }
  
  if (!locale.name || locale.name.trim().length === 0) {
    errors.push('Locale name is required')
  }
  
  if (!locale.nativeName || locale.nativeName.trim().length === 0) {
    errors.push(`Native name is required for ${locale.name}`)
  }
  
  return errors
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV' },
        { status: 400 }
      )
    }
    
    const csvText = await file.text()
    const parsedLocales = parseCSV(csvText)
    
    if (parsedLocales.length === 0) {
      return NextResponse.json(
        { error: 'No valid locales found in CSV' },
        { status: 400 }
      )
    }
    
    // Validate all locales
    const errors: string[] = []
    parsedLocales.forEach(locale => {
      const localeErrors = validateLocale(locale)
      errors.push(...localeErrors)
    })
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }
    
    // Check for duplicates
    const existingCodes = new Set(locales.map(l => l.code))
    const duplicateCodes = parsedLocales.filter(l => existingCodes.has(l.code))
    
    if (duplicateCodes.length > 0) {
      return NextResponse.json(
        { error: `Duplicate locale codes: ${duplicateCodes.map(l => l.code).join(', ')}` },
        { status: 400 }
      )
    }
    
    // Add locales
    let importedCount = 0
    parsedLocales.forEach(locale => {
      // If this is the first locale, make it default
      if (locales.length === 0) {
        locale.isDefault = true
      }
      
      // If this locale is being set as default, unset others
      if (locale.isDefault) {
        locales = locales.map(l => ({ ...l, isDefault: false }))
      }
      
      locales.push(locale)
      importedCount++
    })
    
    return NextResponse.json({ 
      message: 'Locales imported successfully',
      imported: importedCount,
      total: locales.length
    })
  } catch (error) {
    console.error('CSV upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process CSV file' },
      { status: 500 }
    )
  }
}
