import { NextRequest, NextResponse } from 'next/server'
import { Category } from '../../../../lib/types'
import { validateCategory, validateCategoryUniqueness } from '../../../../lib/categories'

// In-memory storage for demo (replace with database in production)
const categories: Category[] = [
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    slug: 'currency',
    description: 'Currency conversion pages with real-time exchange rates',
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
    description: 'SWIFT code directory and bank information',
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
  }
]

// GET /api/admin/categories
export async function GET() {
  try {
    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/admin/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newCategory: Category = {
      ...body,
      id: body.id || `category-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Validate category
    const validationErrors = validateCategory(newCategory)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check uniqueness
    const uniquenessErrors = validateCategoryUniqueness(categories, newCategory)
    if (uniquenessErrors.length > 0) {
      return NextResponse.json(
        { error: 'Uniqueness validation failed', details: uniquenessErrors },
        { status: 400 }
      )
    }

    categories.push(newCategory)
    return NextResponse.json({ category: newCategory }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/categories
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const categoryIndex = categories.findIndex(cat => cat.id === id)
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const updatedCategory: Category = {
      ...categories[categoryIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }

    // Validate category
    const validationErrors = validateCategory(updatedCategory)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Check uniqueness (excluding self)
    const uniquenessErrors = validateCategoryUniqueness(categories, updatedCategory)
    if (uniquenessErrors.length > 0) {
      return NextResponse.json(
        { error: 'Uniqueness validation failed', details: uniquenessErrors },
        { status: 400 }
      )
    }

    categories[categoryIndex] = updatedCategory
    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/categories
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const categoryIndex = categories.findIndex(cat => cat.id === id)
    if (categoryIndex === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0]
    return NextResponse.json({ category: deletedCategory })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
