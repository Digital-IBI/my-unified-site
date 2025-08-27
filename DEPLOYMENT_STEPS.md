# 🚀 Netlify Deployment - Step by Step Guide

## **Step 1: Create GitHub Repository**

### **Option A: Using GitHub CLI (if installed)**
```bash
# Install GitHub CLI if not installed
# brew install gh (macOS)
# Then authenticate: gh auth login

# Create repository
gh repo create my-unified-site --public --source=. --remote=origin --push
```

### **Option B: Manual GitHub Setup**
1. **Go to [github.com](https://github.com)**
2. **Click "New repository"**
3. **Repository name:** `my-unified-site`
4. **Make it Public** (or Private if you prefer)
5. **Don't initialize with README** (we already have one)
6. **Click "Create repository"**

### **Option C: Using GitHub Desktop**
1. **Open GitHub Desktop**
2. **Add existing repository**
3. **Select your project folder**
4. **Publish to GitHub**

## **Step 2: Push to GitHub**

After creating the repository, run these commands:

```bash
# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/my-unified-site.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## **Step 3: Deploy to Netlify**

### **Method A: Git Integration (Recommended)**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login with your GitHub account**
3. **Click "New site from Git"**
4. **Choose GitHub**
5. **Select your repository:** `my-unified-site`
6. **Configure build settings:**
   ```
   Build command: npm run build
   Publish directory: .next
   ```
7. **Click "Deploy site"**

### **Method B: Manual Upload**

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "New site from file upload"**
3. **Upload the `.next` folder** (after running `npm run build`)
4. **Set site name** (optional)
5. **Click "Deploy site"**

## **Step 4: Configure Environment Variables**

In Netlify dashboard:

1. **Go to Site settings > Environment variables**
2. **Add these variables:**
   ```
   NODE_ENV=production
   SITE_URL=https://seashell-owl-443814.hostingersite.com
   WORDPRESS_URL=https://seashell-owl-443814.hostingersite.com
   ```
3. **Save and redeploy**

## **Step 5: Get Your Netlify URL**

After deployment, you'll get a URL like:
```
https://your-app-name-123456.netlify.app
```

**Save this URL!** You'll need it for the WordPress configuration.

## **Step 6: Test Your Deployment**

Test these URLs on your Netlify site:
- ✅ `https://your-app-name-123456.netlify.app/` (Home)
- ✅ `https://your-app-name-123456.netlify.app/admin` (Admin)
- ✅ `https://your-app-name-123456.netlify.app/currency/usd-eur` (Currency)
- ✅ `https://your-app-name-123456.netlify.app/sitemap.xml` (Sitemap)

## **Step 7: Update WordPress .htaccess**

1. **Open `wordpress-htaccess-with-litespeed.txt`**
2. **Replace `YOUR_NETLIFY_URL` with your actual Netlify URL**
3. **Copy the updated content to your WordPress .htaccess file**

## **Step 8: Test Integration**

Test these URLs on your WordPress domain:
- ✅ `https://seashell-owl-443814.hostingersite.com/currency/usd-eur`
- ✅ `https://seashell-owl-443814.hostingersite.com/admin`
- ✅ `https://seashell-owl-443814.hostingersite.com/sitemap.xml`

## **🔧 Troubleshooting**

### **Build Fails:**
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check environment variables

### **404 Errors:**
- Verify .htaccess configuration
- Check Netlify URL is correct
- Ensure proxy rules are working

### **Assets Not Loading:**
- Check basePath configuration
- Clear browser cache
- Verify assetPrefix settings

## **📊 Success Checklist**

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Netlify deployment successful
- [ ] Environment variables set
- [ ] All URLs working on Netlify
- [ ] WordPress .htaccess updated
- [ ] Integration working on WordPress domain
- [ ] Sitemap accessible
- [ ] Admin panel functional

## **🎯 Next Steps**

1. **Add navigation links in WordPress**
2. **Configure Google Analytics**
3. **Set up monitoring**
4. **Test all functionality**
5. **Monitor performance**
6. **Optimize SEO**
