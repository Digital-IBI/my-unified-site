import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAllUrls, 
  chunkUrls, 
  generateSitemapIndexXml,
  validateSitemapUrls,
  getSitemapStats
} from '@/lib/sitemap-generator'

export async function GET(request: NextRequest) {
  try {
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
    
    // Generate sitemap index XML
    const sitemapIndexXml = generateSitemapIndexXml(chunks)
    
    // Get statistics for logging
    const stats = getSitemapStats(urls, chunks)
    console.log('Sitemap generated:', {
      totalUrls: stats.totalUrls,
      totalChunks: stats.totalChunks,
      totalSizeMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
      averageUrlsPerChunk: Math.round(stats.averageUrlsPerChunk),
      largestChunk: stats.largestChunk,
    })
    
    // Return XML response
    return new NextResponse(sitemapIndexXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    )
  }
}
