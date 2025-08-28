#!/bin/bash

echo "🚀 Setting up Vercel deployment for VNCompare.com..."

# Environment variables for Vercel
ENV_VARS=(
    "DATABASE_URL=postgresql://postgres:DZz5xGuzy0HuYUWG@mepomouqfdnekobceccw.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0&sslmode=require"
    "DIRECT_URL=postgresql://postgres:DZz5xGuzy0HuYUWG@mepomouqfdnekobceccw.supabase.co:5432/postgres?sslmode=require"
    "NEXTAUTH_URL=https://vncompare.com"
    "NEXTAUTH_SECRET=SyXBs5ZPYTS0dFtYjdi6O+cfbqD83krawClu1elzOiY="
    "NEXT_PUBLIC_SUPABASE_URL=https://mepomouqfdnekobceccw.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcG9tb3VxZmRuZWtvYmNlY2N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzNDk0NDQsImV4cCI6MjA3MTkyNTQ0NH0.XYzqZQVQ3uG7GfEt4Cf5GNi-p_ZPB5IG8y7YQmaFrEI"
)

echo "📝 Adding environment variables to Vercel..."

# Add each environment variable to Vercel
for env_var in "${ENV_VARS[@]}"; do
    key=$(echo $env_var | cut -d'=' -f1)
    value=$(echo $env_var | cut -d'=' -f2-)
    
    echo "Adding $key..."
    echo "$value" | vercel env add "$key" production
done

echo "✅ Environment variables configured!"
echo "🌐 Deploying to production..."

# Deploy to production
vercel --prod

echo "🎉 Deployment complete!"
echo "🔗 Your site should be available at: https://vncompare.com"
