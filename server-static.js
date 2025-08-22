
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add some basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Serve static files FIRST - this is crucial!
app.use('/assets', express.static(path.join(__dirname, 'dist/public/assets')));
app.use(express.static(path.join(__dirname, 'dist/public')));

// Mock API endpoints for admin functionality
// In production, you'd connect to a real database

// Locations API
app.get('/api/locations', (req, res) => {
  res.json([]);
});

app.get('/api/admin/locations', (req, res) => {
  res.json([]);
});

app.post('/api/admin/locations', (req, res) => {
  const newLocation = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json(newLocation);
});

// Products API
app.get('/api/products', (req, res) => {
  res.json([]);
});

app.get('/api/admin/products', (req, res) => {
  res.json([]);
});

app.post('/api/admin/products', (req, res) => {
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  res.json({ message: 'Product created successfully', product: newProduct });
});

// Content API
app.get('/api/admin/content', (req, res) => {
  res.json([]);
});

app.post('/api/admin/content', (req, res) => {
  const newContent = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  res.json({ message: 'Content created successfully', content: newContent });
});

// Orders API
app.get('/api/admin/orders', (req, res) => {
  res.json([]);
});

// Admin login (mock)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({
      token: 'mock-jwt-token',
      admin: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Handle all other routes by serving index.html (but only after API routes are checked)
app.get('*', (req, res) => {
  console.log(`Serving index.html for route: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Admin interface: http://localhost:${PORT}/admin/login`);
  console.log(`📁 Static files from: ${path.join(__dirname, 'dist/public')}`);
  console.log(`📁 Assets from: ${path.join(__dirname, 'dist/public/assets')}`);
  console.log(`🔌 API endpoints available for admin functionality`);
});

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
