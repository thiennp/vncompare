# 🚀 Railway PHP-Only Setup (Fixed)

## 🚨 **The Problem**
Railway keeps detecting Node.js instead of PHP because of root `package.json` and `yarn.lock` files.

## ✅ **Solution: Force PHP Detection**

### **Files Created:**
- ✅ `Dockerfile` - Forces PHP 8.2 with Composer
- ✅ `nixpacks.toml` - Custom PHP build process
- ✅ `.railwayignore` - Excludes Node.js files

---

## 🚀 **Step-by-Step Fix**

### **1. Delete Current Railway Service**
- Go to Railway dashboard
- Delete the failed service
- Start completely fresh

### **2. Create New Service**
1. **Go to**: https://railway.app/
2. **Click**: "New Project"
3. **Select**: "Deploy from GitHub repo"
4. **Choose**: `thiennp/vncompare`

### **3. Configure Service**
- **Root Directory**: `apps/api` ← **CRITICAL!**
- **Build Command**: (leave empty - use Dockerfile)
- **Start Command**: `php -S 0.0.0.0:$PORT -t public`

### **4. Add Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
DATABASE_URL=[Railway will provide]
JWT_PASSPHRASE=your-secret-key
```

### **5. Add PostgreSQL Database**
1. **In Railway**: Click "New" → "Database" → "PostgreSQL"
2. **Copy**: DATABASE_URL to your service

### **6. Deploy**
- Click "Deploy"
- Railway will use Dockerfile (PHP 8.2)
- Should work without Node.js conflicts

---

## 🔧 **Why This Works**

### **Dockerfile Approach:**
- ✅ **Forces PHP 8.2** - No Node.js detection
- ✅ **Copies only API** - `apps/api/` directory
- ✅ **Installs Composer** - PHP dependencies only
- ✅ **Ignores Node.js** - No package.json conflicts

### **nixpacks.toml Backup:**
- ✅ **PHP packages** - `php82`, `php82Packages.composer`
- ✅ **Custom build** - PHP-specific commands
- ✅ **No Node.js** - Excludes yarn/npm

---

## 🐛 **If It Still Fails**

### **Alternative: Manual Configuration**
If Dockerfile doesn't work, try:

**Build Command:**
```
cd apps/api && composer install --no-dev --optimize-autoloader
```

**Start Command:**
```
cd apps/api && php -S 0.0.0.0:$PORT -t public
```

### **Check These:**
1. **Root Directory**: Must be `apps/api`
2. **Dockerfile**: Should be detected automatically
3. **Environment**: All variables set
4. **Database**: PostgreSQL connected

---

## 📊 **Expected Result**

After successful deployment:
- ✅ **Health Check**: `https://your-app.railway.app/api/health`
- ✅ **Products**: `https://your-app.railway.app/api/v1/products`
- ✅ **Dashboard**: `https://your-app.railway.app/api/v1/analytics/dashboard`

---

*This Dockerfile approach should force PHP detection!* 🚀
