# Railway Deployment Guide

## Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Choose the FREE tier (M0 Sandbox)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier
   - Select a region close to your users
   - Name your cluster (e.g., "vncompare-cluster")
   - Click "Create"

3. **Set Up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `vncompare-admin`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: "Node.js"
   - Version: "4.1 or later"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `vncompare`

   **Example connection string:**
   ```
   mongodb+srv://vncompare-admin:YOUR_PASSWORD@vncompare-cluster.xxxxx.mongodb.net/vncompare?retryWrites=true&w=majority
   ```

## Step 2: Railway Deployment

1. **Login to Railway**
   ```bash
   railway login
   ```
   - This will open a browser window for authentication
   - Complete the login process

2. **Initialize Railway Project**
   ```bash
   railway init
   ```
   - Choose "Empty Project"
   - Name: `vncompare-api`

3. **Deploy to Railway**
   ```bash
   railway up
   ```
   - This will build and deploy your application
   - Wait for deployment to complete

4. **Set Environment Variables**
   - Go to Railway dashboard: https://railway.app/dashboard
   - Select your project
   - Go to "Variables" tab
   - Add the following variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: A secure random string (e.g., `your-super-secret-jwt-key-here`)
     - `NODE_ENV`: `production`

5. **Redeploy After Setting Variables**
   ```bash
   railway up
   ```

## Step 3: Test Deployment

After deployment completes, Railway will provide a URL like:
`https://your-app-name.railway.app`

Test the endpoints:

```bash
# Health check
curl https://your-app-name.railway.app/api/health

# Swagger UI
curl https://your-app-name.railway.app/api-docs/

# Test login
curl -X POST https://your-app-name.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenphongthien@gmail.com","password":"Kimtuoc2"}'

# Test users endpoint
curl https://your-app-name.railway.app/api/users

# Test products endpoint
curl https://your-app-name.railway.app/api/products

# Test dashboard stats
curl https://your-app-name.railway.app/api/dashboard/stats
```

## Troubleshooting

- **MongoDB Connection Issues**: Ensure IP whitelist includes 0.0.0.0/0
- **Deployment Fails**: Check Railway logs in the dashboard
- **Environment Variables**: Make sure all required variables are set
- **Port Issues**: Railway automatically assigns PORT, don't override it

## Expected Results

- ✅ Server responds to health check
- ✅ Swagger UI loads at `/api-docs`
- ✅ Login endpoint works with admin credentials
- ✅ All API endpoints return proper JSON responses
- ✅ Database operations work (users, products, etc.)
