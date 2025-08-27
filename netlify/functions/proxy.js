const NETLIFY_APP_URL = 'https://netlifyhwp.netlify.app'

// Define Next.js paths that should be proxied
const NEXT_JS_PATHS = [
  '/en', '/hi', '/fr', '/es', '/de',
  '/admin', '/api', '/sitemap.xml', '/robots.txt', '/sitemaps',
  '/currency', '/swift', '/ops'
]

exports.handler = async (event, context) => {
  try {
    const path = event.path.replace('/.netlify/functions/proxy', '')
    const queryString = event.queryStringParameters 
      ? '?' + new URLSearchParams(event.queryStringParameters).toString() 
      : ''

    // Check if the path should be proxied
    const shouldProxy = NEXT_JS_PATHS.some(prefix => 
      path === prefix || path.startsWith(prefix + '/')
    )

    if (!shouldProxy) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Path not found' })
      }
    }

    // Build the target URL
    const targetUrl = `${NETLIFY_APP_URL}${path}${queryString}`

    // Prepare headers for the proxy request
    const headers = {
      'User-Agent': event.headers['user-agent'] || 'Netlify-Proxy',
      'Accept': event.headers['accept'] || '*/*',
      'Accept-Language': event.headers['accept-language'] || 'en-US,en;q=0.9',
      'Accept-Encoding': event.headers['accept-encoding'] || 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1'
    }

    // Add authorization header if present
    if (event.headers.authorization) {
      headers['Authorization'] = event.headers.authorization
    }

    // Add content-type for POST requests
    if (event.httpMethod === 'POST' && event.headers['content-type']) {
      headers['Content-Type'] = event.headers['content-type']
    }

    // Make the proxy request
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers,
      body: event.body ? event.body : undefined
    })

    // Get response body
    const body = await response.text()

    // Return the proxied response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'text/html',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body
    }

  } catch (error) {
    console.error('Proxy error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      })
    }
  }
}
