# 🚀 VNCompare API Deployment Guide for Render

## 📋 **Prerequisites**
- GitHub account with VNCompare repository
- Render account (free tier available)
- API code ready in repository

---

## 🔧 **Step 1: Prepare Your Repository**

### **1.1 Verify Repository Structure**
```bash
# Your repository should have this structure:
vncompare/
├── apps/
│   └── api/                 # ← This is your API code
│       ├── src/
│       ├── config/
│       ├── public/
│       ├── composer.json
│       └── render.yaml      # ← Render configuration
```

### **1.2 Check render.yaml Configuration**
```yaml
# apps/api/render.yaml should contain:
services:
  - type: web
    name: vncompare-api
    env: php
    plan: free
    buildCommand: |
      cd apps/api
      chmod +x deploy-render.sh
      ./deploy-render.sh
    startCommand: |
      cd apps/api
      php -S 0.0.0.0:$PORT -t public
```

---

## 🌐 **Step 2: Create Render Service**

### **2.1 Go to Render Dashboard**
1. **Visit**: https://dashboard.render.com/
2. **Sign in** with your account
3. **Click**: "New +" button (top right)
4. **Select**: "Web Service"

### **2.2 Connect GitHub Repository**
1. **Connect GitHub** if not already connected
2. **Select Repository**: `thiennp/vncompare`
3. **Branch**: `main`
4. **Root Directory**: `apps/api` ← **IMPORTANT!**

### **2.3 Configure Service Settings**
```
Name: vncompare-api
Environment: PHP
Region: Oregon (US West)
Plan: Free
```

### **2.4 Build & Start Commands**
```
Build Command:
cd apps/api && chmod +x deploy-render.sh && ./deploy-render.sh

Start Command:
cd apps/api && php -S 0.0.0.0:$PORT -t public
```

---

## 🗄️ **Step 3: Database Setup**

### **3.1 Create PostgreSQL Database**
1. **In Render Dashboard**: Click "New +"
2. **Select**: "PostgreSQL"
3. **Name**: `vncompare-db`
4. **Plan**: Free
5. **Region**: Same as your API service

### **3.2 Connect Database to API**
1. **Go to your API service settings**
2. **Environment Variables**:
   ```
   DATABASE_URL: [Auto-generated from database]
   APP_ENV: prod
   APP_DEBUG: false
   ```

---

## ⚙️ **Step 4: Environment Variables**

### **4.1 Required Environment Variables**
```
APP_ENV=prod
APP_DEBUG=false
APP_SECRET=[Auto-generated]
JWT_PASSPHRASE=[Auto-generated]
DATABASE_URL=[From PostgreSQL service]
CORS_ALLOW_ORIGIN=https://vncompare.com,https://www.vncompare.com,https://admin.vncompare.com,https://vncompare-backoffice.netlify.app,http://localhost:3000
```

### **4.2 JWT Keys (Auto-generated)**
```
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
```

---

## 🚀 **Step 5: Deploy**

### **5.1 Start Deployment**
1. **Click**: "Create Web Service"
2. **Wait**: 3-5 minutes for build to complete
3. **Monitor**: Build logs for any errors

### **5.2 Verify Deployment**
```bash
# Test your API
curl https://your-service-name.onrender.com/api/health

# Should return:
{"status":"OK","timestamp":"..."}
```

---

## 🔍 **Step 6: Test Endpoints**

### **6.1 Basic Health Check**
```bash
curl https://your-service-name.onrender.com/api/health
```

### **6.2 Test API Endpoints**
```bash
# Products
curl https://your-service-name.onrender.com/api/v1/products

# Dashboard
curl https://your-service-name.onrender.com/api/v1/analytics/dashboard

# Test endpoints (after deployment)
curl https://your-service-name.onrender.com/api/v1/test/users
```

---

## 🐛 **Troubleshooting**

### **Common Issues:**

**1. Build Fails**
- Check if `apps/api` directory exists
- Verify `composer.json` is present
- Check build logs for PHP errors

**2. Database Connection Issues**
- Verify `DATABASE_URL` environment variable
- Check if PostgreSQL service is running
- Run database migrations manually

**3. 404 Errors**
- Check if routes are properly configured
- Verify `public/` directory structure
- Check Symfony routing configuration

### **Debug Commands:**
```bash
# Check service logs
# In Render dashboard → Your service → Logs

# Test specific endpoints
curl -v https://your-service-name.onrender.com/api/health
```

---

## 📊 **Step 7: Monitor & Maintain**

### **7.1 Service Monitoring**
- **Logs**: Check Render dashboard for errors
- **Metrics**: Monitor CPU, memory usage
- **Uptime**: Check service availability

### **7.2 Updates**
- **Code Changes**: Push to GitHub → Auto-deploy
- **Environment Changes**: Update in Render dashboard
- **Database Changes**: Run migrations manually

---

## 🎯 **Expected Results**

After successful deployment, you should have:

✅ **Working API**: `https://your-service-name.onrender.com`  
✅ **Health Check**: `/api/health` returns 200  
✅ **Products**: `/api/v1/products` returns data  
✅ **Dashboard**: `/api/v1/analytics/dashboard` returns metrics  
✅ **Test Endpoints**: `/api/v1/test/users` returns user data  

---

## 📞 **Support**

- **Render Docs**: https://render.com/docs
- **Symfony Docs**: https://symfony.com/doc/current/
- **GitHub Issues**: Create issue in your repository

---

*Guide created for VNCompare API deployment on Render* 🚀
