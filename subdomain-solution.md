# Subdomain Solution for Next.js Integration

## Problem Analysis
The CDN (Hostinger's hcdn) is intercepting requests before they reach the WordPress server, preventing the proxy rules from working.

## Solution: Use Subdomain
Instead of trying to proxy through the CDN, use a subdomain that points directly to Netlify.

### Step 1: Create Subdomain
1. Go to your Hostinger control panel
2. Navigate to "Domains" → "Subdomains"
3. Create a subdomain: `tools.seashell-owl-443814.hostingersite.com`
4. Point it to: `netlifyhwp.netlify.app`

### Step 2: Update Next.js Configuration
Update `next.config.js` to handle the subdomain:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove basePath and assetPrefix for subdomain
  images: {
    domains: ['seashell-owl-443814.hostingersite.com'],
  },
  serverActions: {
    allowedOrigins: ['seashell-owl-443814.hostingersite.com', 'tools.seashell-owl-443814.hostingersite.com'],
  },
  env: {
    SITE_URL: 'https://tools.seashell-owl-443814.hostingersite.com',
    WORDPRESS_URL: 'https://seashell-owl-443814.hostingersite.com',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
```

### Step 3: Update WordPress Navigation
Add links to the subdomain in WordPress:

1. Go to WordPress Admin → Appearance → Menus
2. Add custom links:
   - Currency Converter: `https://tools.seashell-owl-443814.hostingersite.com/en/currency`
   - SWIFT Codes: `https://tools.seashell-owl-443814.hostingersite.com/en/swift`
   - Admin Panel: `https://tools.seashell-owl-443814.hostingersite.com/admin`

### Step 4: Update Sitemap Base URL
Update `lib/sitemap-generator.ts`:

```typescript
constructor(config: Partial<SitemapConfig> = {}) {
  this.config = {
    baseUrl: process.env.SITE_URL || 'https://tools.seashell-owl-443814.hostingersite.com',
    // ... rest of config
  }
}
```

### Step 5: Test URLs
After setup, test these URLs:
- `https://tools.seashell-owl-443814.hostingersite.com/en/currency`
- `https://tools.seashell-owl-443814.hostingersite.com/en/swift`
- `https://tools.seashell-owl-443814.hostingersite.com/admin`

## Benefits of Subdomain Approach
1. **Bypasses CDN issues** - Direct connection to Netlify
2. **Better performance** - No proxy overhead
3. **Easier debugging** - Clear separation of concerns
4. **SEO friendly** - Can set up proper canonical URLs
5. **No .htaccess complexity** - WordPress remains untouched

## Alternative: DNS CNAME
If subdomain creation is not possible, you can also:
1. Add a CNAME record in DNS: `tools` → `netlifyhwp.netlify.app`
2. This will achieve the same result as subdomain creation

## Implementation Steps
1. Create the subdomain in Hostinger
2. Update Next.js configuration
3. Deploy to Netlify
4. Update WordPress navigation
5. Test all functionality
