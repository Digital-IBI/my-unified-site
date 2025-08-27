import { NextRequest, NextResponse } from 'next/server'
import { 
  generateAllUrls, 
  chunkUrls, 
  validateSitemapUrls,
  getSitemapStats
} from '@/lib/sitemap-generator'

export async function GET(request: NextRequest) {
  try {
    // Generate all URLs
    const urls = await generateAllUrls()
    
    // Validate URLs
    const validation = validateSitemapUrls(urls)
    
    // Split into chunks
    const chunks = chunkUrls(urls)
    
    // Get statistics
    const stats = getSitemapStats(urls, chunks)
    
    // Return comprehensive sitemap information
    return NextResponse.json({
      success: true,
      validation: {
        valid: validation.valid,
        errors: validation.errors,
        totalUrls: urls.length,
      },
      chunks: chunks.map((chunk, index) => ({
        index,
        filename: chunk.filename,
        urlCount: chunk.urls.length,
        sizeBytes: chunk.size,
        sizeMB: (chunk.size / (1024 * 1024)).toFixed(2),
        sampleUrls: chunk.urls.slice(0, 3).map(u => u.loc), // Show first 3 URLs as sample
      })),
      statistics: {
        totalUrls: stats.totalUrls,
        totalChunks: stats.totalChunks,
        totalSizeMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
        averageUrlsPerChunk: Math.round(stats.averageUrlsPerChunk),
        largestChunk: stats.largestChunk,
        generatedAt: new Date().toISOString(),
      },
      endpoints: {
        sitemapIndex: '/sitemap.xml',
        robotsTxt: '/robots.txt',
        sitemapChunks: chunks.map((chunk, index) => `/sitemaps/${chunk.filename}`),
      },
    })
  } catch (error) {
    console.error('Error generating sitemap information:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate sitemap information',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      case 'validate':
        // Validate sitemap URLs
        const urls = await generateAllUrls()
        const validation = validateSitemapUrls(urls)
        
        return NextResponse.json({
          success: true,
          validation: {
            valid: validation.valid,
            errors: validation.errors,
            totalUrls: urls.length,
          },
        })
        
      case 'stats':
        // Get sitemap statistics
        const allUrls = await generateAllUrls()
        const chunks = chunkUrls(allUrls)
        const stats = getSitemapStats(allUrls, chunks)
        
        return NextResponse.json({
          success: true,
          statistics: {
            totalUrls: stats.totalUrls,
            totalChunks: stats.totalChunks,
            totalSizeMB: (stats.totalSize / (1024 * 1024)).toFixed(2),
            averageUrlsPerChunk: Math.round(stats.averageUrlsPerChunk),
            largestChunk: stats.largestChunk,
            generatedAt: new Date().toISOString(),
          },
        })
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing sitemap action:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process sitemap action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
