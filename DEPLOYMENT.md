# VNCompare.com Deployment Guide

## 🚀 Production Deployment Setup

This guide will help you deploy VNCompare.com to production using Vercel and configure your domain.

## 📋 Prerequisites

1. **Domain**: vncompare.com (already owned)
2. **GitHub Account**: For code repository
3. **Vercel Account**: For hosting
4. **Supabase Account**: For database
5. **Cloudflare Account**: For CDN and DNS management

## 🏗 Infrastructure Setup

### 1. Database Setup (Supabase)

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project: `vncompare-prod`
   - Choose region: `Southeast Asia (Singapore)`

2. **Get Database URL**:
   ```bash
   # Format: postgresql://postgres:[password]@[host]:5432/postgres
   DATABASE_URL="postgresql://postgres:your-password@db.xxx.supabase.co:5432/postgres"
   ```

### 2. Vercel Deployment

1. **Connect GitHub Repository**:

   ```bash
   # Push your code to GitHub
   git remote add origin https://github.com/your-username/vncompare.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory: `apps/web`
   - Framework preset: `Next.js`

3. **Configure Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `env.example`

### 3. Domain Configuration

#### Option A: Using Vercel DNS (Recommended)

1. **Add Domain in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add domain: `vncompare.com`
   - Add subdomain: `www.vncompare.com`

2. **Update Name.com DNS**:
   - Log into your Name.com account
   - Go to DNS Management for vncompare.com
   - Update nameservers to Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ns3.vercel-dns.com
     ```

#### Option B: Using Cloudflare (Advanced)

1. **Add Domain to Cloudflare**:
   - Add vncompare.com to Cloudflare
   - Update nameservers at Name.com to Cloudflare's

2. **Configure DNS Records**:

   ```
   Type: A
   Name: @
   Content: 76.76.19.36 (Vercel IP)

   Type: CNAME
   Name: www
   Content: vncompare.com
   ```

3. **Configure SSL/TLS**:
   - Set SSL/TLS encryption mode to "Full (strict)"
   - Enable "Always Use HTTPS"

## 🔧 Environment Configuration

### Required Environment Variables

Create `.env.local` in `apps/web/` with:

```env
# Database
DATABASE_URL="your-supabase-database-url"
DIRECT_URL="your-supabase-direct-url"

# Authentication
NEXTAUTH_URL="https://vncompare.com"
NEXTAUTH_SECRET="generate-32-character-secret"

# OAuth (Optional for MVP)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Search (Optional for MVP)
ALGOLIA_APP_ID="your-algolia-app-id"
ALGOLIA_SEARCH_KEY="your-algolia-search-key"

# Email (Optional for MVP)
RESEND_API_KEY="your-resend-api-key"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# App URL
NEXT_PUBLIC_APP_URL="https://vncompare.com"
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate random strings for other secrets
openssl rand -hex 32
```

## 🗄 Database Setup

1. **Run Migrations**:

   ```bash
   cd apps/web
   npx prisma db push
   npx prisma generate
   ```

2. **Seed Database** (Optional):
   ```bash
   npx prisma db seed
   ```

## 🔍 SEO & Analytics Setup

### 1. Google Search Console

1. **Add Property**:
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add property: `https://vncompare.com`
   - Verify ownership (DNS or HTML file)

2. **Submit Sitemap**:
   - Submit: `https://vncompare.com/sitemap.xml`

### 2. Google Analytics

1. **Create Property**:
   - Go to [Google Analytics](https://analytics.google.com)
   - Create property: `VNCompare`
   - Get Measurement ID: `G-XXXXXXXXXX`

2. **Add to Environment**:
   ```env
   GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
   ```

### 3. Bing Webmaster Tools

1. **Add Site**:
   - Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
   - Add site: `https://vncompare.com`
   - Verify ownership

## 📱 Performance Optimization

### 1. Image Optimization

1. **Cloudinary Setup** (Optional):

   ```env
   CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
   ```

2. **Next.js Image Optimization**:
   - Already configured in `next.config.js`
   - Uses Vercel's image optimization

### 2. CDN Configuration

1. **Vercel Edge Network**:
   - Automatically enabled
   - Global CDN with 200+ locations

2. **Custom Domain**:
   - SSL certificate automatically provisioned
   - HTTP/2 and HTTP/3 enabled

## 🔒 Security Setup

### 1. Security Headers

Already configured in `vercel.json`:

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: origin-when-cross-origin

### 2. SSL/TLS

- Automatically provisioned by Vercel
- HSTS enabled
- Modern TLS protocols

### 3. Rate Limiting

Configure in Vercel:

```json
{
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## 📊 Monitoring Setup

### 1. Vercel Analytics

- Enable in Vercel Dashboard
- Real-time performance monitoring
- Core Web Vitals tracking

### 2. Error Tracking (Optional)

```env
SENTRY_DSN="your-sentry-dsn"
```

## 🚀 Deployment Commands

### Initial Deployment

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to Vercel
vercel --prod
```

### Continuous Deployment

1. **GitHub Integration**:
   - Push to `main` branch
   - Automatic deployment to production

2. **Preview Deployments**:
   - Push to feature branches
   - Automatic preview deployments

## 🔄 Post-Deployment Checklist

- [ ] Domain resolves correctly
- [ ] SSL certificate is active
- [ ] Database migrations completed
- [ ] Environment variables configured
- [ ] Google Analytics tracking
- [ ] Search console verification
- [ ] Performance testing
- [ ] Mobile responsiveness
- [ ] SEO meta tags
- [ ] Error monitoring

## 🛠 Maintenance

### Regular Tasks

1. **Database Backups**:
   - Supabase provides automatic backups
   - Manual backups available

2. **Security Updates**:
   - Monitor npm audit warnings
   - Update dependencies regularly

3. **Performance Monitoring**:
   - Monitor Core Web Vitals
   - Check Vercel Analytics

### Scaling Considerations

1. **Database Scaling**:
   - Supabase Pro plan for higher limits
   - Connection pooling for high traffic

2. **CDN Optimization**:
   - Vercel Edge Functions for dynamic content
   - Static asset optimization

## 📞 Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **Documentation**: [vncompare.com/docs](https://vncompare.com/docs)

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**VNCompare.com** - Ready for production! 🎨🇻🇳
