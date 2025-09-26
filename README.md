# VNCompare - Unified React Router v7 Application

A modern paint comparison platform built with React Router v7, MongoDB, and deployed on Vercel. This application consolidates the previous Next.js web app, Angular backoffice, and Symfony API into a single unified application.

## 🚀 Features

- **Unified Application**: Single React Router v7 app with integrated admin panel
- **MongoDB Integration**: Direct database connection using MongoDB with loaders
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Authentication**: JWT-based authentication with role-based access control
- **Admin Panel**: Integrated admin dashboard for managing products, orders, users, and suppliers
- **Paint Calculator**: Coverage calculator and shipping cost calculator
- **Responsive Design**: Mobile-first design that works on all devices

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React Router v7, TypeScript, Tailwind CSS
- **Database**: MongoDB with direct connection
- **Authentication**: JWT tokens
- **Deployment**: Vercel
- **UI Components**: Radix UI + custom components

### Key Changes from Previous Architecture

- ✅ Removed Symfony API - now using React Router loaders
- ✅ Removed MySQL - now using MongoDB
- ✅ Removed Angular backoffice - now integrated into main app
- ✅ Consolidated into single application
- ✅ Direct database access through loaders

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   └── Layout.tsx      # Main layout component
├── contexts/           # React contexts (Auth, Cart)
├── hooks/              # Custom React hooks
├── lib/                # Core utilities
│   ├── auth.ts         # Authentication service
│   ├── database.ts     # Database service layer
│   ├── mongodb.ts      # MongoDB connection
│   └── models.ts       # TypeScript interfaces
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── ...             # Public pages
├── routes.tsx          # React Router v7 routes with loaders
└── App.tsx             # Main app component
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb://localhost:27017/vncompare
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   ```

3. **Set up MongoDB**
   - For local development: Install and start MongoDB
   - For production: Use MongoDB Atlas

4. **Seed the database**

   ```bash
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

````

The application will be available at `http://localhost:3000`

### Sample Accounts
After seeding, you can use these accounts:
- **Admin**: `admin@vncompare.com` / `admin123`
- **Customer**: `customer@example.com` / `customer123`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (clear all data)

## 🎯 Key Features

### Public Features
- **Home Page**: Featured products and suppliers
- **Product Catalog**: Browse and search products
- **Product Details**: Detailed product information and reviews
- **Coverage Calculator**: Calculate paint coverage for rooms
- **Shipping Calculator**: Calculate shipping costs
- **User Authentication**: Login/register functionality

### Admin Features (Role-based Access)
- **Dashboard**: Overview of system statistics
- **Product Management**: CRUD operations for products
- **Order Management**: View and manage customer orders
- **User Management**: Manage customer and supplier accounts
- **Supplier Management**: Verify and manage suppliers
- **Review Management**: Moderate product reviews

### User Features
- **Dashboard**: Personal dashboard with order history
- **Order Management**: View order history and details
- **Profile Management**: Update personal information
- **Address Management**: Manage shipping addresses

## 🗄️ Database Schema

### Collections
- **users**: User accounts (customers, admins, suppliers)
- **products**: Paint products with specifications
- **suppliers**: Supplier information and verification status
- **orders**: Customer orders with items
- **orderItems**: Individual items within orders
- **addresses**: User shipping addresses
- **reviews**: Product reviews and ratings
- **provinces/districts/wards**: Vietnam address hierarchy
- **productCoverage**: Coverage specifications for different surfaces
- **shippingZones**: Shipping rate configurations
- **serviceAreas**: Delivery area mappings

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure JWT secret key
   - `NODE_ENV`: `production`

3. **Deploy**: Vercel will automatically build and deploy

The application will be available at your Vercel domain.

### Environment Variables for Production
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vncompare
JWT_SECRET=your-production-jwt-secret-key
NODE_ENV=production
````

## 🔧 Configuration

### MongoDB Connection

- **Local**: `mongodb://localhost:27017/vncompare`
- **Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/vncompare`

### JWT Configuration

- Tokens expire after 7 days
- Secret key should be at least 32 characters
- Used for authentication and authorization

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Secure headers

## 🎨 UI/UX Features

- Modern, clean design
- Dark/light mode support (via CSS variables)
- Smooth animations and transitions
- Accessible components (ARIA compliant)
- Mobile-first responsive design
- Loading states and error handling

## 📈 Performance

- Code splitting with React Router v7
- Lazy loading of admin components
- Optimized images and assets
- Efficient database queries
- Client-side caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:

- Check the documentation
- Review the code comments
- Contact the development team

---

**Note**: This application replaces the previous multi-app architecture (Next.js + Angular + Symfony) with a unified React Router v7 application for better maintainability and performance.
