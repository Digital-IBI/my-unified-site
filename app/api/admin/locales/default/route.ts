import { NextRequest, NextResponse } from 'next/server'

// This endpoint is for setting the default locale
// The actual locale data is managed in the main locales route

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body
    
    if (!code) {
      return NextResponse.json(
        { error: 'Locale code is required' },
        { status: 400 }
      )
    }
    
    // This endpoint delegates to the main locales endpoint
    // The actual logic is handled in the PUT method of /api/admin/locales
    const response = await fetch(`${request.nextUrl.origin}/api/admin/locales`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, isDefault: true })
    })
    
    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }
    
    return NextResponse.json({ 
      message: 'Default locale updated successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update default locale' },
      { status: 500 }
    )
  }
}
