import { NextResponse } from 'next/server'
import { fetchWordPressMenu } from '../../../../../lib/wordpress'

export async function GET() {
  try {
    const menu = await fetchWordPressMenu('primary')
    
    if (!menu) {
      return NextResponse.json(
        { 
          success: false,
          message: 'WordPress menu not found',
          items: []
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'WordPress menu fetched successfully',
      items: menu.items || []
    })
  } catch (error) {
    console.error('WordPress menu error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch WordPress menu',
        details: error instanceof Error ? error.message : 'Unknown error',
        items: []
      },
      { status: 500 }
    )
  }
}
