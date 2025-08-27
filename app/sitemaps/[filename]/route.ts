import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAllUrls, 
  chunkUrls, 
  validateSitemapUrls
} from '../../../lib/sitemap-generator'
import { generateUrlsetXml } from '../../../lib/sitemap'

interface RouteParams {
  params: Promise<{ filename: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = await params
    
    // Validate filename format
    if (!filename.match(/^sitemap-\d+\.xml$/)) {
      return NextResponse.json(
        { error: 'Invalid sitemap filename' },
        { status: 400 }
      )
    }
    
    // Extract chunk index from filename
    const chunkIndex = parseInt(filename.replace('sitemap-', '').replace('.xml', ''), 10)
    
    // Generate all URLs
    const urls = await generateAllUrls()
    
    // Validate URLs
    const validation = validateSitemapUrls(urls)
    if (!validation.valid) {
      console.error('Sitemap validation failed:', validation.errors)
      return NextResponse.json(
        { error: 'Sitemap validation failed', details: validation.errors },
        { status: 500 }
      )
    }
    
    // Split into chunks
    const chunks = chunkUrls(urls)
    
    // Find the requested chunk
    const requestedChunk = chunks[chunkIndex]
    if (!requestedChunk) {
      return NextResponse.json(
        { error: 'Sitemap chunk not found' },
        { status: 404 }
      )
    }
    
    // Generate sitemap XML for this chunk
    const sitemapXml = generateUrlsetXml(requestedChunk.urls)
    
    // Return XML response
    return new NextResponse(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap chunk:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap chunk' },
      { status: 500 }
    )
  }
}
