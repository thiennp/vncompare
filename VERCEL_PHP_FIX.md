# 🚀 Vercel PHP API Fix

## 🚨 **Issue: Vercel Trying to Build Next.js**

The error shows: `No Next.js version detected` - Vercel is trying to build a Next.js app instead of the PHP API.

## ✅ **Solution: Force PHP API Deployment**

### **Updated vercel.json:**
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
    },
    {
      "src": "/(.*)",
      "dest": "apps/api/public/index.php"
    }
  ],
  "functions": {
    "apps/api/public/index.php": {
      "runtime": "@vercel/php@2.0.0"
    }
  }
}
```

---

## 🚀 **Deployment Steps**

### **1. Update Vercel Project Settings**
- **Go to**: Vercel Dashboard → Your Project
- **Click**: "Settings" → "General"
- **Root Directory**: `apps/api`
- **Build Command**: (leave empty)
- **Output Directory**: `public`

### **2. Redeploy**
- **Click**: "Deployments" → "Redeploy"
- **Or**: Push new commit to trigger redeploy

### **3. Alternative: Create New Project**
If settings don't work:
- **Delete**: Current project
- **Create**: New project
- **Import**: `thiennp/vncompare`
- **Root Directory**: `apps/api`
- **Framework**: PHP

---

## 🔧 **Why This Fixes It**

### **Root Directory Issue:**
- **Problem**: Vercel looking at root `package.json` (Next.js)
- **Solution**: Set root directory to `apps/api` (PHP)

### **Framework Detection:**
- **Problem**: Vercel auto-detecting Next.js
- **Solution**: Explicitly configure PHP runtime

### **Build Process:**
- **Problem**: Vercel trying to build Next.js
- **Solution**: Skip build, use PHP directly

---

## 📊 **Expected Result**

After fix:
- ✅ **PHP Runtime** - Vercel uses PHP instead of Node.js
- ✅ **API Routes** - All requests go to Symfony
- ✅ **No Build Process** - Direct PHP execution
- ✅ **API Working** - Health check and endpoints

---

## 🎯 **Next Steps**

1. **Update Vercel settings** - Set root directory to `apps/api`
2. **Redeploy** - Trigger new deployment
3. **Test API** - Check health endpoint
4. **Monitor** - Watch for PHP runtime

---

*This should fix the Next.js detection issue!* 🚀
