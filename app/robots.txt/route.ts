import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAllUrls, 
  chunkUrls, 
  generateRobotsTxt
} from '../../lib/sitemap-generator'

export async function GET(request: NextRequest) {
  try {
    // Generate all URLs to determine chunking
    const urls = await generateAllUrls()
    const chunks = chunkUrls(urls)
    
    // Generate robots.txt content
    const robotsTxt = generateRobotsTxt(chunks)
    
    // Return text response
    return new NextResponse(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    return NextResponse.json(
      { error: 'Failed to generate robots.txt' },
      { status: 500 }
    )
  }
}
