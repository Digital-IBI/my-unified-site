// Cloudflare Worker for Next.js Proxy
// Deploy this to Cloudflare Workers to handle proxy requests

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname
  
  // Define Next.js paths that should be proxied
  const nextJsPaths = [
    '/en/', '/hi/', '/fr/', '/es/', '/de/',
    '/admin/', '/api/', '/sitemap.xml', '/robots.txt', '/sitemaps/',
    '/currency/', '/swift/', '/ops/'
  ]
  
  // Check if the path should be proxied to Netlify
  const shouldProxy = nextJsPaths.some(prefix => path.startsWith(prefix))
  
  if (shouldProxy) {
    // Proxy to Netlify
    const netlifyUrl = `https://netlifyhwp.netlify.app${path}${url.search}`
    
    // Create new request with original headers
    const proxyRequest = new Request(netlifyUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    try {
      const response = await fetch(proxyRequest)
      
      // Return response with CORS headers
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
      
      return newResponse
    } catch (error) {
      return new Response('Proxy Error: ' + error.message, { status: 500 })
    }
  }
  
  // For non-Next.js paths, return 404 or pass to WordPress
  return new Response('Not Found', { status: 404 })
}
