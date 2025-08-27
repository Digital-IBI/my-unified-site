# Single Site Deployment Guide

## 🌐 Single Domain Setup: https://seashell-owl-443814.hostingersite.com/

### **Architecture Overview:**
```
Single Domain: https://seashell-owl-443814.hostingersite.com/
├── / (WordPress Home)
├── /about-us (WordPress)
├── /services (WordPress)
├── /currency/usd-eur (Next.js)
├── /swift/ABCDEF12 (Next.js)
├── /admin (Next.js Admin)
└── /tools/* (Next.js static assets)
```

## **Step 1: Deploy Next.js to Netlify**

1. **Connect your repository to Netlify**
2. **Set build settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Set environment variables in Netlify:**
   ```
   NODE_ENV=production
   SITE_URL=https://seashell-owl-443814.hostingersite.com
   WORDPRESS_URL=https://seashell-owl-443814.hostingersite.com
   ```

4. **Deploy to get your Netlify URL:**
   ```
   https://your-app-name.netlify.app
   ```

## **Step 2: Configure WordPress Site**

1. **Access your WordPress site's .htaccess file**
2. **Replace the content with the configuration from `wordpress-htaccess.txt`**
3. **Update the proxy URL in the .htaccess:**
   ```apache
   # Replace YOUR_NETLIFY_URL with your actual Netlify URL
   RewriteRule ^(.*)$ https://your-app-name.netlify.app/$1 [P,L]
   ```

## **Step 3: Test the Integration**

### **WordPress Pages (should work normally):**
- ✅ https://seashell-owl-443814.hostingersite.com/
- ✅ https://seashell-owl-443814.hostingersite.com/about-us
- ✅ https://seashell-owl-443814.hostingersite.com/services

### **Next.js Pages (should work via proxy):**
- ✅ https://seashell-owl-443814.hostingersite.com/currency/usd-eur
- ✅ https://seashell-owl-443814.hostingersite.com/swift/ABCDEF12
- ✅ https://seashell-owl-443814.hostingersite.com/admin

### **API Endpoints:**
- ✅ https://seashell-owl-443814.hostingersite.com/api/admin/categories
- ✅ https://seashell-owl-443814.hostingersite.com/api/admin/wordpress/test

## **Step 4: Update WordPress Navigation**

Add links to your Next.js tools in WordPress:

```html
<!-- Add to WordPress menu -->
<a href="/currency/usd-eur">Currency Converter</a>
<a href="/swift/ABCDEF12">SWIFT Code Lookup</a>
<a href="/admin">Admin Panel</a>
```

## **Step 5: Configure SEO**

### **WordPress SEO (Yoast/All in One SEO):**
- Set canonical URLs to your main domain
- Configure sitemap to include Next.js pages

### **Next.js SEO:**
- All pages automatically include proper meta tags
- Sitemap generated at `/sitemap.xml`
- Robots.txt at `/robots.txt`

## **Step 6: Monitor and Optimize**

### **Check these URLs after deployment:**
1. **WordPress Integration:** `/admin/wordpress`
2. **Sitemap:** `/sitemap.xml`
3. **Programmatic Pages:** `/currency/usd-eur`
4. **Admin Panel:** `/admin`

### **Common Issues & Solutions:**

**Issue: 404 errors on Next.js pages**
- Check .htaccess configuration
- Verify Netlify URL is correct
- Ensure proxy rules are working

**Issue: Assets not loading**
- Check basePath configuration in next.config.js
- Verify assetPrefix settings

**Issue: API calls failing**
- Check CORS settings
- Verify allowedOrigins in next.config.js

## **Final Site Structure:**

```
https://seashell-owl-443814.hostingersite.com/
├── WordPress Pages:
│   ├── / (Home)
│   ├── /about-us
│   ├── /services
│   ├── /works
│   └── /testimonials
├── Next.js Programmatic Pages:
│   ├── /currency/* (110+ pages)
│   ├── /swift/* (programmatic)
│   ├── /en/currency, /hi/currency, etc.
│   └── /admin (Admin panel)
└── API Endpoints:
    ├── /api/admin/*
    ├── /sitemap.xml
    └── /robots.txt
```

## **Benefits of This Setup:**

✅ **Single Domain SEO** - All pages on one domain
✅ **Unified Analytics** - Single Google Analytics property
✅ **Shared SSL Certificate** - No mixed content issues
✅ **Simplified Management** - One domain to manage
✅ **Better User Experience** - Seamless navigation

## **Next Steps:**

1. Deploy Next.js to Netlify
2. Update WordPress .htaccess
3. Test all functionality
4. Add cross-links between WordPress and Next.js
5. Monitor performance and SEO
