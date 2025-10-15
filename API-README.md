# VNCompare API Server

A Node.js Express server with OpenAPI/Swagger documentation for the VNCompare paint comparison platform.

## Features

- ✅ Express.js REST API
- ✅ OpenAPI/Swagger documentation
- ✅ Interactive API testing UI
- ✅ CORS enabled
- ✅ Mock data for testing
- ✅ Railway deployment ready

## API Endpoints

### General

- `GET /` - Server information and available endpoints
- `GET /api/health` - Health check
- `GET /api-docs` - Interactive API documentation (Swagger UI)

### Authentication

- `POST /api/login` - User login

### Users

- `GET /api/users` - Get users list
- `POST /api/users` - Create user

### Products

- `GET /api/products` - Get products list
- `POST /api/products` - Create product

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start the deployment server (with mock data)
pnpm run server:deploy

# Or start the full server (requires MongoDB)
pnpm run server
```

### Access Points

- **API Server**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/api/health

## Testing the API

### Using Swagger UI

1. Open http://localhost:3001/api-docs
2. Click "Try it out" on any endpoint
3. Fill in the required parameters
4. Click "Execute" to test

### Using curl

```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenphongthien@gmail.com","password":"Kimtuoc2"}'

# Get users
curl http://localhost:3001/api/users

# Get products
curl http://localhost:3001/api/products
```

## Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Railway will automatically detect the `railway.toml` configuration
3. The server will be deployed using `server-deploy.js` with mock data
4. Access your deployed API at the Railway-provided URL

### Environment Variables

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3001)

## Mock Data

The deployment server (`server-deploy.js`) includes mock data for testing:

### Users

- Admin: `nguyenphongthien@gmail.com` / `Kimtuoc2`
- User: `user@example.com` / `password`

### Products

- Dulux Weathershield (450,000 VND)
- Jotun Majestic (520,000 VND)

## API Documentation

The API documentation is automatically generated using Swagger/OpenAPI 3.0 and includes:

- Complete endpoint descriptions
- Request/response schemas
- Example requests and responses
- Interactive testing interface
- Authentication documentation

Access the documentation at `/api-docs` when the server is running.

## Project Structure

```
├── server.js              # Full server with MongoDB
├── server-deploy.js       # Deployment server with mock data
├── railway.toml          # Railway deployment configuration
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## Next Steps

1. **Database Integration**: Connect to MongoDB Atlas for production
2. **Authentication**: Implement JWT token validation
3. **Validation**: Add request validation middleware
4. **Testing**: Add unit and integration tests
5. **Monitoring**: Add logging and monitoring
6. **Security**: Implement rate limiting and security headers
