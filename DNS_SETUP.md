# DNS Configuration for vncompare.com

## 🎯 **Domain Setup Complete!**

Your domain `vncompare.com` has been successfully added to Vercel. Now you need to configure the DNS settings in Name.com.

## 🔧 **DNS Configuration Options**

### **Option 1: A Record (Recommended)**

Add this A record in your Name.com DNS settings:

```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
TTL: 3600 (or default)
```

### **Option 2: Change Nameservers**

Change your domain's nameservers in Name.com to:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

## 📋 **Step-by-Step Instructions for Name.com**

### **Using A Record (Option 1):**

1. **Log into Name.com:** [https://www.name.com/account](https://www.name.com/account)
2. **Go to:** My Domains → vncompare.com → DNS Records
3. **Add A Record:**
   - **Type:** A
   - **Name:** @ (or leave blank)
   - **Value:** 76.76.21.21
   - **TTL:** 3600
4. **Save the record**
5. **Wait 5-10 minutes** for DNS propagation

### **Using Nameservers (Option 2):**

1. **Log into Name.com:** [https://www.name.com/account](https://www.name.com/account)
2. **Go to:** My Domains → vncompare.com → Nameservers
3. **Change to Custom Nameservers:**
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
4. **Save changes**
5. **Wait 24-48 hours** for full propagation

## ✅ **Verification**

After DNS configuration:

- Vercel will automatically verify the domain
- You'll receive an email confirmation
- The site will be accessible at https://vncompare.com

## 🚀 **Current Status**

- ✅ **Vercel Project:** Deployed and ready
- ✅ **Domain Added:** vncompare.com added to Vercel
- ✅ **Environment Variables:** Configured
- ⏳ **DNS Configuration:** Pending (you need to do this in Name.com)

## 🔗 **Useful Links**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Name.com DNS Management:** https://www.name.com/account
- **Current Deployment:** https://vncompare-59lzeo3a0-thien-nguyens-projects-abdd38ab.vercel.app

## 📞 **Need Help?**

If you encounter any issues with DNS configuration, you can:

1. Contact Name.com support
2. Use Vercel's domain troubleshooting guide
3. Check DNS propagation with tools like whatsmydns.net
