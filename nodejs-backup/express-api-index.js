const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000', 'https://studyvn.netlify.app'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// All other endpoints should connect to the real Symfony API
// This is just a proxy/health check service
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Please use the Symfony API at the configured backend URL.',
    availableEndpoints: ['/api/v1/health']
  });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on port ${PORT}`);
  console.log('Note: This is a minimal API. Use the Symfony backend for full functionality.');
});