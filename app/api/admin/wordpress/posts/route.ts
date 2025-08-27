import { NextRequest, NextResponse } from 'next/server'
import { fetchWordPressPosts } from '@/lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const per_page = searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : 100
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const status = searchParams.get('status') || 'publish'
    
    const posts = await fetchWordPressPosts({
      per_page,
      page,
      status
    })
    
    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
      page,
      per_page
    })
  } catch (error) {
    console.error('WordPress posts error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch WordPress posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
