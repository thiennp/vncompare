# 🚨 Railway Deployment Troubleshooting

## 🔧 **Common Railway Deployment Issues**

### **Issue 1: "There was an error deploying from source"**

**Cause**: Railway is confused by root `package.json` and tries to deploy as Node.js

**Solution**: Use the configuration files we created:
- `railway.toml` - Forces PHP detection
- `nixpacks.toml` - Custom build process
- `.railwayignore` - Excludes Node.js files

### **Issue 2: Build Fails**

**Check these files exist:**
- ✅ `apps/api/composer.json`
- ✅ `apps/api/public/index.php`
- ✅ `apps/api/src/Controller/`

### **Issue 3: Database Connection**

**Add these environment variables in Railway:**
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
APP_ENV=prod
APP_DEBUG=false
```

---

## 🚀 **Step-by-Step Fix**

### **1. Delete Current Railway Service**
- Go to Railway dashboard
- Delete the failed service
- Start fresh

### **2. Create New Service**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose `thiennp/vncompare`

### **3. Configure Service**
- **Root Directory**: `apps/api`
- **Build Command**: (leave empty - use nixpacks.toml)
- **Start Command**: `php -S 0.0.0.0:$PORT -t public`

### **4. Add Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
DATABASE_URL=[Railway will provide]
JWT_PASSPHRASE=your-secret-key
```

### **5. Deploy**
- Click "Deploy"
- Monitor logs for any errors

---

## 🔍 **Debugging Steps**

### **Check Railway Logs**
1. Go to your service dashboard
2. Click "Logs" tab
3. Look for error messages
4. Check build and deploy phases

### **Common Error Messages**

**"No such file or directory"**
- Check if root directory is set to `apps/api`
- Verify all files exist in the repository

**"Composer not found"**
- Railway should auto-install PHP and Composer
- Check nixpacks.toml configuration

**"Database connection failed"**
- Verify DATABASE_URL is set
- Check if PostgreSQL service is running

---

## 🎯 **Alternative: Manual Configuration**

If automatic detection fails:

### **1. Set Root Directory**
- In Railway service settings
- Set "Root Directory" to `apps/api`

### **2. Manual Build Commands**
```
Build Command: cd apps/api && composer install --no-dev --optimize-autoloader
Start Command: cd apps/api && php -S 0.0.0.0:$PORT -t public
```

### **3. Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
DATABASE_URL=[from Railway PostgreSQL service]
```

---

## 📞 **Getting Help**

- **Railway Discord**: https://discord.gg/railway
- **Railway Docs**: https://docs.railway.app/
- **Check Logs**: Always check Railway logs first

---

*Follow these steps to fix your Railway deployment!* 🚀
