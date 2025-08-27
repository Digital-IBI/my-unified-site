import { NextResponse } from 'next/server'

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
const locales: Locale[] = []

function generateCSV(locales: Locale[]): string {
  const headers = ['code', 'name', 'nativeName', 'isActive', 'isDefault', 'createdAt']
  const csvRows = [headers.join(',')]
  
  locales.forEach(locale => {
    const row = [
      locale.code,
      `"${locale.name}"`,
      `"${locale.nativeName}"`,
      locale.isActive.toString(),
      locale.isDefault.toString(),
      locale.createdAt
    ]
    csvRows.push(row.join(','))
  })
  
  return csvRows.join('\n')
}

export async function GET() {
  try {
    // Fetch locales from the main endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/locales`)
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch locales' },
        { status: 500 }
      )
    }
    
    const csvContent = generateCSV(data.locales || [])
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="locales.csv"'
      }
    })
  } catch (error) {
    console.error('CSV export error:', error)
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}
