import { NextRequest, NextResponse } from 'next/server'
import { testWordPressConnection } from '../../../../../lib/wordpress'

export async function GET(request: NextRequest) {
  try {
    const result = await testWordPressConnection()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('WordPress test error:', error)
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to test WordPress connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
