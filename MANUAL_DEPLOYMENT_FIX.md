# 🔧 Manual Deployment Fix for Backoffice Routing

## 🚨 **CURRENT ISSUE**
The automatic deployment is not working due to Netlify CLI conflicts with the Angular runtime plugin.

## ✅ **MANUAL SOLUTION**

### **Step 1: Build the Application**
```bash
cd /Users/thiennguyen/studyvn/apps/backoffice
npm run build
```

### **Step 2: Create _redirects File**
```bash
echo "/*    /index.html   200" > dist/backoffice/browser/_redirects
```

### **Step 3: Manual Upload via Netlify Dashboard**

1. **Go to:** https://app.netlify.com/
2. **Find:** `vncompare-backoffice` site
3. **Go to:** "Deploys" tab
4. **Click:** "Deploy manually" or "Drag and drop"
5. **Upload:** The entire `dist/backoffice/browser` folder
6. **Wait:** For deployment to complete

### **Step 4: Alternative - Use Netlify Drop**

1. **Go to:** https://app.netlify.com/drop
2. **Drag and drop:** The `dist/backoffice/browser` folder
3. **Note the URL** and update your domain settings

## 🎯 **EXPECTED RESULTS**

After manual deployment:
- ✅ `https://vncompare-backoffice.netlify.app/products/add` - **WILL WORK!**
- ✅ `https://vncompare-backoffice.netlify.app/orders` - **WILL WORK!**
- ✅ `https://vncompare-backoffice.netlify.app/suppliers` - **WILL WORK!**

## 🧪 **Test After Deployment**
```bash
curl -I https://vncompare-backoffice.netlify.app/products/add
# Should return: HTTP/2 200 (instead of 404)
```

## 📁 **Files to Upload**
Upload the entire contents of:
`/Users/thiennguyen/studyvn/apps/backoffice/dist/backoffice/browser/`

This includes:
- `index.html`
- `_redirects` (the key file for routing)
- All JavaScript chunks
- CSS files
- Assets

## 🔑 **Key Point**
The `_redirects` file with content `/*    /index.html   200` is the critical component that will fix the routing issues.
