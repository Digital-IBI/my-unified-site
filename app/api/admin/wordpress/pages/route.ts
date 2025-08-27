import { NextRequest, NextResponse } from 'next/server'
import { fetchWordPressPages } from '../../../../../lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const per_page = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : 100
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const status = searchParams.get('status') || 'publish'
    
    const pages = await fetchWordPressPages({
      per_page,
      page,
      status
    })
    
    return NextResponse.json({
      success: true,
      pages,
      total: pages.length,
      page,
      per_page
    })
  } catch (error) {
    console.error('WordPress pages error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch WordPress pages',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
