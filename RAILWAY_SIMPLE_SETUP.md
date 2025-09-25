# 🚀 Simple Railway Setup (Fixed)

## 🎯 **The Problem**
Railway was trying to use complex nixpacks configuration that failed. Let's use the simple approach.

## ✅ **Simple Solution**

### **Step 1: Delete Current Service**
- Go to Railway dashboard
- Delete the failed service
- Start completely fresh

### **Step 2: Create New Service**
1. **Go to**: https://railway.app/
2. **Click**: "New Project"
3. **Select**: "Deploy from GitHub repo"
4. **Choose**: `thiennp/vncompare`

### **Step 3: Configure Service (CRITICAL)**
- **Root Directory**: `apps/api` ← **MOST IMPORTANT!**
- **Build Command**: (leave empty)
- **Start Command**: `php -S 0.0.0.0:$PORT -t public`

### **Step 4: Add Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
DATABASE_URL=[Railway will provide when you add PostgreSQL]
JWT_PASSPHRASE=your-secret-key-here
```

### **Step 5: Add PostgreSQL Database**
1. **In Railway dashboard**: Click "New" → "Database" → "PostgreSQL"
2. **Connect**: Railway will auto-provide DATABASE_URL
3. **Copy**: DATABASE_URL to your service environment variables

### **Step 6: Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Check logs for any errors

---

## 🔧 **Why This Works**

- **Root Directory**: `apps/api` tells Railway where your PHP code is
- **No Complex Config**: Let Railway auto-detect PHP
- **Simple Start Command**: Basic PHP server command
- **Environment Variables**: Standard Symfony setup

---

## 🐛 **If It Still Fails**

### **Check These:**
1. **Root Directory**: Must be `apps/api`
2. **Files Exist**: `apps/api/composer.json` and `apps/api/public/index.php`
3. **Database**: PostgreSQL service connected
4. **Environment**: All variables set

### **Alternative: Manual Build Commands**
If auto-detection fails, try these manual commands:
```
Build Command: cd apps/api && composer install --no-dev --optimize-autoloader
Start Command: cd apps/api && php -S 0.0.0.0:$PORT -t public
```

---

## 📊 **Expected Result**

After successful deployment:
- ✅ **Health Check**: `https://your-app.railway.app/api/health`
- ✅ **Products**: `https://your-app.railway.app/api/v1/products`
- ✅ **Dashboard**: `https://your-app.railway.app/api/v1/analytics/dashboard`

---

*This simple approach should work!* 🚀
