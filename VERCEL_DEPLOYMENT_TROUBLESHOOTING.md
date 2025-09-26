# 🚨 Vercel Deployment Troubleshooting

## 🚨 **Problem:**

Vercel deployment not working - "Not found" error at:
https://api-r2y715fx7-thien-nguyens-projects-abdd38ab.vercel.app/

## 🔍 **Possible Issues:**

### **1. Vercel Still Detecting Node.js**

- Framework Preset: "Other" instead of "PHP"
- Build Command: npm/yarn instead of composer
- Install Command: npm/yarn instead of composer

### **2. Build Failed**

- Wrong framework settings
- PHP runtime not detected
- Dependencies not installed

### **3. Root Directory Not Set**

- Vercel looking at wrong directory
- Not pointing to apps/api

### **4. PHP Runtime Not Configured**

- @vercel/php not detected
- Wrong vercel.json configuration

---

## 🔧 **Solution Steps:**

### **Step 1: Check Vercel Dashboard**

1. **Go to**: https://vercel.com/dashboard
2. **Find**: Your project
3. **Check**: "Deployments" tab
4. **Look for**: Build logs and errors

### **Step 2: Verify Framework Settings**

1. **Go to**: Project Settings → General
2. **Check**: Root Directory = `apps/api`
3. **Check**: Framework Preset = "PHP" or "Other"
4. **Check**: Build Command = `composer install --no-dev --optimize-autoloader`
5. **Check**: Install Command = `composer install`
6. **Check**: Output Directory = `public`

### **Step 3: Check Build Logs**

1. **Go to**: Deployments tab
2. **Click**: Latest deployment
3. **Check**: Build logs for errors
4. **Look for**: PHP detection, composer install, etc.

### **Step 4: Manual Override**

If settings are wrong:

1. **Toggle**: All "Override" switches ON
2. **Set**: Correct values manually
3. **Save**: Settings
4. **Redeploy**: Trigger new deployment

---

## 🚀 **Expected Build Logs:**

### **✅ Successful PHP Build:**

```
Detecting framework... PHP
Installing dependencies... composer install
Building... composer install --no-dev --optimize-autoloader
Deploying... PHP runtime
```

### **❌ Failed Node.js Build:**

```
Detecting framework... Node.js
Installing dependencies... npm install
Building... npm run build
Error: No Next.js version detected
```

---

## 🎯 **Next Steps:**

1. **Check Vercel dashboard** for build logs
2. **Verify framework settings** are correct
3. **Manual override** if needed
4. **Redeploy** with correct settings
5. **Test** the deployment URL

---

_Check Vercel dashboard for build logs and errors!_ 🚀
