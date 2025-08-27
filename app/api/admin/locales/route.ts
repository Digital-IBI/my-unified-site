import { NextRequest, NextResponse } from 'next/server'

interface Locale {
  code: string
  name: string
  nativeName: string
  isActive: boolean
  isDefault: boolean
  createdAt: string
}

// In-memory storage for demonstration (replace with database in production)
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

function validateLocale(locale: Partial<Locale>): string[] {
  const errors: string[] = []
  
  if (!locale.code || locale.code.length !== 2) {
    errors.push('Locale code must be exactly 2 characters')
  }
  
  if (!locale.name || locale.name.trim().length === 0) {
    errors.push('Locale name is required')
  }
  
  if (!locale.nativeName || locale.nativeName.trim().length === 0) {
    errors.push('Native name is required')
  }
  
  // Check for duplicate codes
  const existingLocale = locales.find(l => l.code === locale.code)
  if (existingLocale && !locale.isDefault) {
    errors.push('Locale code already exists')
  }
  
  return errors
}

export async function GET() {
  try {
    return NextResponse.json({ 
      locales: locales.filter(l => l.isActive),
      total: locales.length,
      active: locales.filter(l => l.isActive).length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch locales' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const errors = validateLocale(body)
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }
    
    const newLocale: Locale = {
      code: body.code,
      name: body.name,
      nativeName: body.nativeName,
      isActive: body.isActive ?? true,
      isDefault: body.isDefault ?? false,
      createdAt: new Date().toISOString()
    }
    
    // If this is the first locale, make it default
    if (locales.length === 0) {
      newLocale.isDefault = true
    }
    
    // If this locale is being set as default, unset others
    if (newLocale.isDefault) {
      locales = locales.map(l => ({ ...l, isDefault: false }))
    }
    
    locales.push(newLocale)
    
    return NextResponse.json({ 
      locale: newLocale,
      message: 'Locale created successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create locale' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    const existingIndex = locales.findIndex(l => l.code === body.code)
    if (existingIndex === -1) {
      return NextResponse.json(
        { error: 'Locale not found' },
        { status: 404 }
      )
    }
    
    const updatedLocale = {
      ...locales[existingIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    // If setting as default, unset others
    if (body.isDefault) {
      locales = locales.map(l => ({ ...l, isDefault: false }))
    }
    
    locales[existingIndex] = updatedLocale
    
    return NextResponse.json({ 
      locale: updatedLocale,
      message: 'Locale updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update locale' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json(
        { error: 'Locale code is required' },
        { status: 400 }
      )
    }
    
    const existingIndex = locales.findIndex(l => l.code === code)
    if (existingIndex === -1) {
      return NextResponse.json(
        { error: 'Locale not found' },
        { status: 404 }
      )
    }
    
    const localeToDelete = locales[existingIndex]
    
    // Prevent deletion of default locale if it's the only one
    if (localeToDelete.isDefault && locales.length === 1) {
      return NextResponse.json(
        { error: 'Cannot delete the only default locale' },
        { status: 400 }
      )
    }
    
    // If deleting default locale, set another as default
    if (localeToDelete.isDefault) {
      const nextLocale = locales.find(l => l.code !== code && l.isActive)
      if (nextLocale) {
        nextLocale.isDefault = true
      }
    }
    
    locales.splice(existingIndex, 1)
    
    return NextResponse.json({ 
      message: 'Locale deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete locale' },
      { status: 500 }
    )
  }
}
