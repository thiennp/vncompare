# 🚀 Vercel Deployment Guide

## 🎯 **Why Vercel?**
- ✅ **Simple PHP support** - No Docker complexity
- ✅ **Auto-scaling** - Handles traffic automatically
- ✅ **Global CDN** - Fast worldwide
- ✅ **Easy deployment** - Just connect GitHub

---

## 🚀 **Deployment Steps**

### **1. Go to Vercel Dashboard**
- **URL**: https://vercel.com/
- **Login**: With your GitHub account

### **2. Import Project**
- **Click**: "New Project"
- **Import**: `thiennp/vncompare` from GitHub
- **Framework**: Auto-detect (PHP)

### **3. Configure Project**
- **Project Name**: `vncompare-api`
- **Root Directory**: `apps/api`
- **Build Command**: (leave empty)
- **Output Directory**: `public`

### **4. Environment Variables**
Add these in Vercel dashboard:
```
APP_ENV=prod
APP_DEBUG=false
JWT_PASSPHRASE=your-secret-key
DATABASE_URL=your-database-url
```

### **5. Deploy**
- **Click**: "Deploy"
- **Wait**: 2-3 minutes for deployment

---

## 🔧 **Vercel Configuration**

### **vercel.json Created:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/api/public/index.php",
      "use": "@vercel/php"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "apps/api/public/index.php"
    }
  ]
}
```

### **Why This Works:**
- ✅ **PHP Runtime** - Vercel handles PHP automatically
- ✅ **Route Mapping** - All requests go to Symfony
- ✅ **No Build Process** - Just deploy PHP files
- ✅ **Auto-scaling** - Handles traffic spikes

---

## 📊 **Expected Result**

After successful deployment:
- ✅ **API URL**: `https://vncompare-api.vercel.app`
- ✅ **Health Check**: `https://vncompare-api.vercel.app/api/health`
- ✅ **Products**: `https://vncompare-api.vercel.app/api/v1/products`
- ✅ **Dashboard**: `https://vncompare-api.vercel.app/api/v1/analytics/dashboard`

---

## 🎯 **Advantages of Vercel**

### **vs Render:**
- ✅ **Faster deployment** - 2-3 minutes vs 10+ minutes
- ✅ **Better performance** - Global CDN
- ✅ **Auto-scaling** - No manual configuration
- ✅ **Simpler setup** - No build commands needed

### **vs Railway:**
- ✅ **No Docker complexity** - Native PHP support
- ✅ **No Nixpacks issues** - Vercel handles PHP
- ✅ **Reliable deployment** - Less configuration
- ✅ **Better monitoring** - Built-in analytics

---

## 🚀 **Next Steps**

1. **Delete Render service** (if exists)
2. **Delete Railway service** (if exists)
3. **Create Vercel project** with above configuration
4. **Add environment variables**
5. **Deploy and test**

---

*Vercel - Simple, fast, and reliable!* 🚀
