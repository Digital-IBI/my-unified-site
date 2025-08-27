# WordPress Navigation Setup Guide

## **Adding Next.js Links to WordPress Navigation**

### **Step 1: Access WordPress Admin**
1. Go to: `https://seashell-owl-443814.hostingersite.com/wp-admin/`
2. Login with your credentials

### **Step 2: Add Custom Menu Items**

**Option A: Using WordPress Customizer**
1. Go to **Appearance > Customize**
2. Click **Menus**
3. Select your main navigation menu
4. Click **Add Items**
5. Add these **Custom Links**:

```
Currency Converter
URL: /currency/usd-eur
Description: Convert currencies with our free tool

SWIFT Code Lookup
URL: /swift/ABCDEF12
Description: Find bank SWIFT codes worldwide

Admin Panel
URL: /admin
Description: Site administration
```

**Option B: Using Menu Editor**
1. Go to **Appearance > Menus**
2. Select your main menu
3. Add **Custom Links** with the same URLs above

### **Step 3: Add to Footer (Optional)**

Create a footer menu with:
```
Tools
├── Currency Converter (/currency/usd-eur)
├── SWIFT Code Lookup (/swift/ABCDEF12)
└── Admin Panel (/admin)

Programmatic Pages
├── Currency Tools (/en/currency)
├── SWIFT Tools (/en/swift)
└── All Categories (/admin/categories)
```

### **Step 4: Test Navigation**

After adding the links, test these URLs:
- ✅ `/currency/usd-eur` (should show currency converter)
- ✅ `/swift/ABCDEF12` (should show SWIFT lookup)
- ✅ `/admin` (should show admin panel)

### **Step 5: SEO Optimization**

**Add Meta Descriptions in WordPress:**
1. Install **Yoast SEO** or **All in One SEO** plugin
2. Set canonical URLs to your main domain
3. Configure sitemap to include Next.js pages

**Example Meta Tags:**
```html
<!-- For currency pages -->
<meta name="description" content="Convert USD to EUR with our free currency converter tool. Real-time exchange rates and easy-to-use interface.">

<!-- For SWIFT pages -->
<meta name="description" content="Find bank SWIFT codes worldwide. Search by bank name, country, or SWIFT code.">
```

### **Step 6: Cross-Linking Strategy**

**WordPress to Next.js:**
- Add "Tools" section in WordPress sidebar
- Include tool links in blog posts
- Add call-to-action buttons

**Next.js to WordPress:**
- Add "Blog" link in Next.js navigation
- Include WordPress content in Next.js pages
- Cross-reference related content

### **Step 7: Analytics Setup**

**Google Analytics:**
1. Use the same GA property for both WordPress and Next.js
2. Set up goals for tool usage
3. Track user journey between WordPress and Next.js

**Example Goals:**
- Currency converter usage
- SWIFT code lookups
- Admin panel access
- Cross-site navigation

### **Step 8: Performance Monitoring**

**Check these metrics:**
- Page load times for both WordPress and Next.js
- User engagement on tool pages
- Conversion rates from WordPress to tools
- SEO performance of combined site

### **Step 9: Content Strategy**

**WordPress Content Ideas:**
- Blog posts about currency exchange
- Articles about international banking
- Guides on using the tools
- Case studies and testimonials

**Next.js Content Ideas:**
- Tool-specific help pages
- API documentation
- Usage statistics
- User guides

### **Step 10: Maintenance**

**Regular Tasks:**
- Update WordPress plugins and themes
- Monitor Next.js deployment
- Check for broken links
- Update content regularly
- Monitor SEO performance
