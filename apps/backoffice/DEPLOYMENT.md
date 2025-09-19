# VNCompare Backoffice Deployment Guide

## 🌐 Domain Configuration

The backoffice is configured to work with `admin.vncompare.com` instead of `vncompare.com/backoffice`.

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   # From the backoffice directory
   ./deploy.sh
   # OR
   npm run deploy
   ```

4. **Configure Custom Domain**:
   - Go to your Netlify dashboard
   - Select your site
   - Go to Domain settings
   - Add custom domain: `admin.vncompare.com`
   - Configure DNS records as instructed by Netlify

### Option 2: Manual Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload files**:
   - Upload the contents of `dist/backoffice/` to your hosting service
   - Ensure your server is configured to serve `index.html` for all routes (SPA routing)

## 🔧 Configuration Files

- `netlify.toml` - Netlify configuration
- `angular.json` - Angular build configuration
- `deploy.sh` - Deployment script

## 🌍 Environment Variables

The backoffice connects to the production API at `https://api.vncompare.com/api/v1`.

## 📱 Features

- Responsive design
- Authentication with JWT tokens
- Real-time data from VNCompare API
- Admin dashboard for managing:
  - Products
  - Orders
  - Users
  - Suppliers
  - Reviews
  - Analytics

## 🔒 Security

- HTTPS enforced
- Security headers configured
- JWT token authentication
- CORS properly configured

## 🚨 Troubleshooting

### Build Issues
- Ensure Node.js 18+ is installed
- Run `npm install` before building
- Check for TypeScript errors

### Deployment Issues
- Verify Netlify CLI is installed and authenticated
- Check that the build output exists in `dist/backoffice/`
- Ensure custom domain DNS is properly configured

### API Connection Issues
- Verify the API is accessible at `https://api.vncompare.com/api/v1`
- Check browser console for CORS errors
- Ensure authentication tokens are valid
