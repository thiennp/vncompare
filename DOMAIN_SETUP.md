# VNCompare.com Domain Configuration Guide

## 🌐 Domain Setup with Name.com

Since you own `vncompare.com` through Name.com, here's how to configure it for deployment:

## 📋 Quick Setup Steps

### 1. Vercel Deployment First

1. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from the web directory
   cd apps/web
   vercel --prod
   ```

2. **Get Vercel Domain**:
   - After deployment, Vercel will give you a URL like: `https://vncompare-xxx.vercel.app`
   - Note this URL for the next steps

### 2. Configure Domain in Vercel

1. **Add Custom Domain**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project
   - Go to Settings → Domains
   - Add domain: `vncompare.com`
   - Add subdomain: `www.vncompare.com`

2. **Vercel will show you the required DNS records**

### 3. Update Name.com DNS

#### Option A: Use Vercel Nameservers (Recommended)

1. **Log into Name.com**:
   - Go to [name.com](https://name.com)
   - Login to your account

2. **Find vncompare.com**:
   - Go to "My Domains"
   - Click on `vncompare.com`

3. **Update Nameservers**:
   - Click "DNS Records" or "Nameservers"
   - Change from "Name.com BasicDNS" to "Custom Nameservers"
   - Add these Vercel nameservers:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ns3.vercel-dns.com
     ```

4. **Save Changes**:
   - Click "Save" or "Update"
   - Wait 24-48 hours for propagation

#### Option B: Use Custom DNS Records

If you prefer to keep Name.com DNS:

1. **Add DNS Records in Name.com**:
   - Go to DNS Management for vncompare.com
   - Add these records:

   ```
   Type: A
   Name: @
   Value: 76.76.19.36
   TTL: 3600
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

2. **Add TXT Record for Verification**:
   - Vercel will provide a TXT record for domain verification
   - Add it to your DNS records

## 🔒 SSL Certificate

- **Automatic**: Vercel will automatically provision SSL certificates
- **Time**: Takes 5-10 minutes after DNS propagation
- **Coverage**: Both `vncompare.com` and `www.vncompare.com`

## ⏱ DNS Propagation Timeline

- **Immediate**: Some users may see the site
- **1-2 hours**: Most users will see the site
- **24-48 hours**: Full global propagation
- **Maximum**: Up to 72 hours in rare cases

## 🔍 Verification Steps

### 1. Check DNS Propagation

```bash
# Check from your computer
nslookup vncompare.com

# Check from different locations
dig vncompare.com
```

### 2. Test Website Access

1. **Direct Access**:
   - Try: `https://vncompare.com`
   - Try: `https://www.vncompare.com`

2. **SSL Check**:
   - Visit: [SSL Labs](https://www.ssllabs.com/ssltest/)
   - Test: `vncompare.com`

### 3. Vercel Dashboard Check

- Go to Vercel Dashboard → Your Project → Domains
- Status should show "Valid Configuration"

## 🚨 Troubleshooting

### Domain Not Working

1. **Check DNS Records**:
   ```bash
   dig vncompare.com
   dig www.vncompare.com
   ```

2. **Clear DNS Cache**:
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemctl restart systemd-resolved
   ```

3. **Check Vercel Status**:
   - Go to [Vercel Status](https://vercel-status.com/)
   - Ensure no service issues

### SSL Certificate Issues

1. **Wait**: SSL certificates take 5-10 minutes
2. **Check Vercel Dashboard**: Domain status should be "Valid"
3. **Contact Support**: If issues persist after 24 hours

### Nameserver Issues

1. **Verify Nameservers**:
   ```bash
   dig NS vncompare.com
   ```

2. **Expected Output**:
   ```
   vncompare.com.    3600    IN    NS    ns1.vercel-dns.com.
   vncompare.com.    3600    IN    NS    ns2.vercel-dns.com.
   vncompare.com.    3600    IN    NS    ns3.vercel-dns.com.
   ```

## 📞 Support Contacts

### Name.com Support
- **Email**: support@name.com
- **Phone**: 1-855-996-3973
- **Live Chat**: Available on name.com

### Vercel Support
- **Email**: support@vercel.com
- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🔄 Post-Setup Checklist

- [ ] Domain resolves to Vercel
- [ ] SSL certificate is active
- [ ] Both www and non-www work
- [ ] Site loads correctly
- [ ] No mixed content warnings
- [ ] Mobile responsiveness works
- [ ] Performance is good

## 🎯 Next Steps

After domain setup:

1. **Configure Environment Variables** in Vercel
2. **Set up Google Analytics**
3. **Configure Google Search Console**
4. **Test all features**
5. **Monitor performance**

---

**Your domain is ready for VNCompare.com! 🎨🇻🇳**
