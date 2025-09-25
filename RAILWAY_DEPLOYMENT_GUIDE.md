# 🚀 VNCompare API Deployment on Railway

## 🎯 **Why Railway?**
- ✅ **Zero Configuration** - Auto-detects PHP
- ✅ **Free Tier** - Perfect for development
- ✅ **Simple Setup** - Connect GitHub and deploy
- ✅ **Fast Deployments** - Usually under 2 minutes

---

## 🚀 **Step-by-Step Deployment**

### **Step 1: Go to Railway**
1. **Visit**: https://railway.app/
2. **Sign up** with GitHub account
3. **Click**: "New Project"

### **Step 2: Connect Repository**
1. **Select**: "Deploy from GitHub repo"
2. **Choose**: `thiennp/vncompare`
3. **Railway auto-detects** PHP application

### **Step 3: Configure (Optional)**
Railway will automatically:
- ✅ Detect PHP
- ✅ Set root directory to `apps/api`
- ✅ Install dependencies
- ✅ Start the server

### **Step 4: Add Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
DATABASE_URL=[Railway will provide PostgreSQL URL]
JWT_PASSPHRASE=your-secret-key
```

### **Step 5: Deploy**
1. **Click**: "Deploy"
2. **Wait**: 2-3 minutes
3. **Test**: Your API URL will be provided

---

## 🔧 **Railway Configuration Files**

### **railway.json** (Auto-created)
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php -S 0.0.0.0:$PORT -t public",
    "healthcheckPath": "/api/health"
  }
}
```

### **railway-deploy.sh** (Backup script)
- Custom deployment script if needed
- Handles database setup
- Generates JWT keys
- Optimizes cache

---

## 🗄️ **Database Setup**

### **Option 1: Railway PostgreSQL (Recommended)**
1. **In Railway dashboard**: Add PostgreSQL service
2. **Connect**: Railway auto-provides DATABASE_URL
3. **Migrations**: Run automatically on deploy

### **Option 2: External Database**
- Use any PostgreSQL provider
- Add DATABASE_URL environment variable

---

## 🔍 **Testing Your Deployment**

### **Health Check**
```bash
curl https://your-app.railway.app/api/health
```

### **API Endpoints**
```bash
# Products
curl https://your-app.railway.app/api/v1/products

# Dashboard
curl https://your-app.railway.app/api/v1/analytics/dashboard

# Test endpoints
curl https://your-app.railway.app/api/v1/test/users
```

---

## 📊 **Expected Results**

After successful deployment:
- ✅ **Health Check**: `/api/health` returns 200
- ✅ **Products**: `/api/v1/products` returns data
- ✅ **Dashboard**: `/api/v1/analytics/dashboard` returns metrics
- ✅ **Test Endpoints**: All test endpoints working

---

## 🐛 **Troubleshooting**

### **Common Issues:**

**1. Build Fails**
- Check Railway logs
- Verify PHP version compatibility
- Ensure all dependencies are in composer.json

**2. Database Connection**
- Verify DATABASE_URL is set
- Check PostgreSQL service is running
- Run migrations manually if needed

**3. 404 Errors**
- Check if routes are properly configured
- Verify public directory structure
- Check Symfony routing

---

## 🎯 **Railway Advantages**

- **🚀 Fast Setup**: 5 minutes from start to finish
- **💰 Free Tier**: No credit card required
- **🔧 Auto-Detection**: No configuration needed
- **📊 Monitoring**: Built-in logs and metrics
- **🔄 Auto-Deploy**: Updates on every git push

---

## 📞 **Support**

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway
- **GitHub Issues**: Create issue in your repository

---

*Railway makes PHP deployment effortless!* 🚀
