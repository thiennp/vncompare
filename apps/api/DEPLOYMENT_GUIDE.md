# 🚀 VNCompare API - Render Deployment Guide

## 📋 Quick Start (5 Minutes)

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. **No credit card required!**

### 2. Deploy Your API

#### Step 1: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your `vncompare` repository

#### Step 2: Configure Service
```
Name: vncompare-api
Environment: PHP
Region: Oregon (US West) or Frankfurt (EU)
Branch: main
Root Directory: apps/api
```

#### Step 3: Build & Start Commands
```bash
# Build Command
cd apps/api && composer install --no-dev --optimize-autoloader && php bin/console cache:clear --env=prod --no-debug

# Start Command  
cd apps/api && php -S 0.0.0.0:$PORT -t public
```

#### Step 4: Environment Variables
Add these in Render dashboard:

```env
APP_ENV=prod
APP_DEBUG=false
APP_SECRET=your-32-character-secret-key-here
JWT_PASSPHRASE=vncompare2024
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
CORS_ALLOW_ORIGIN=https://vncompare.com,https://www.vncompare.com,http://localhost:3000
```

### 3. Create Database

#### Step 1: Add PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `vncompare-db`
3. Plan: **Free**
4. Click "Create Database"

#### Step 2: Connect Database to API
1. Go back to your web service
2. Go to "Environment" tab
3. Add environment variable:
   ```
   DATABASE_URL = [Copy from database dashboard]
   ```

### 4. Deploy!
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Your API will be available at: `https://vncompare-api.onrender.com`

## 🧪 Test Your API

### Health Check
```bash
curl https://vncompare-api.onrender.com/api/health
```

### Test Authentication
```bash
# Register a user
curl -X POST https://vncompare-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Products API
```bash
curl https://vncompare-api.onrender.com/api/v1/products
```

## 🔧 Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check PHP version (should be 8.2+)
   - Verify all dependencies in composer.json
   - Check build logs in Render dashboard

2. **Database Connection Error**:
   - Verify DATABASE_URL is set correctly
   - Check database is running
   - Ensure migrations are up to date

3. **JWT Errors**:
   - Verify JWT keys exist in config/jwt/
   - Check JWT_PASSPHRASE is set correctly
   - Ensure keys have correct permissions

4. **CORS Issues**:
   - Check CORS_ALLOW_ORIGIN includes your frontend URL
   - Verify CORS configuration in config/packages/cors.yaml

### Debug Commands

```bash
# Check logs in Render dashboard
# Go to your service → Logs tab

# Test database connection
php bin/console doctrine:database:create --if-not-exists

# Run migrations manually
php bin/console doctrine:migrations:migrate --no-interaction
```

## 📊 Free Tier Limitations

### Render Free Tier:
- ✅ **750 hours/month** (enough for 24/7)
- ✅ **Free PostgreSQL** (1GB storage)
- ✅ **512MB RAM**
- ⚠️ **Sleeps after 15 min** inactivity
- ⚠️ **Cold start** ~30 seconds
- ❌ **No custom domain** (free tier)

### Keep Your App Alive:
1. **UptimeRobot** (free):
   - Sign up at [uptimerobot.com](https://uptimerobot.com)
   - Add monitor: `https://vncompare-api.onrender.com/api/health`
   - Set interval: 14 minutes

2. **Simple Cron Job**:
   ```bash
   # Add to your server or use a free cron service
   */14 * * * * curl https://vncompare-api.onrender.com/api/health
   ```

## 🚀 Performance Tips

### Optimize for Free Tier:
1. **Enable OPcache** (already configured)
2. **Use Redis** for caching (optional)
3. **Optimize database queries**
4. **Implement connection pooling**

### Monitor Usage:
- Check Render dashboard regularly
- Monitor database usage
- Watch for memory limits

## 🔄 Updates & Maintenance

### Deploy Updates:
1. Push changes to GitHub
2. Render automatically redeploys
3. Check deployment logs

### Database Migrations:
- Run automatically during deployment
- Or manually via Render console

### Environment Variables:
- Update in Render dashboard
- Redeploy to apply changes

## 📈 Scaling Up

When you're ready to upgrade:

### Render Paid Plans:
- **Starter**: $7/month
  - No sleep mode
  - Custom domains
  - Better performance
  - 1GB RAM

- **Standard**: $25/month
  - 2GB RAM
  - Better CPU
  - Auto-scaling

### Database Upgrades:
- **Starter**: $7/month (1GB → 1GB, no sleep)
- **Standard**: $20/month (1GB → 1GB, better performance)

## 🎯 Next Steps

1. **Deploy to Render** (follow steps above)
2. **Test all endpoints**
3. **Set up monitoring** (UptimeRobot)
4. **Update frontend** to use new API URL
5. **Configure custom domain** (when ready to upgrade)

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Symfony on Render](https://render.com/docs/deploy-symfony)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [UptimeRobot](https://uptimerobot.com)

---

**Your Symfony API is now ready for production on Render!** 🎉

**API URL**: `https://vncompare-api.onrender.com`
**Database**: Free PostgreSQL included
**Cost**: $0/month (free tier)
