
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

// API ROUTES - These must come BEFORE the catch-all route
console.log('🔌 Setting up API routes...');

// Locations API
app.get('/api/locations', (req, res) => {
  console.log('📍 GET /api/locations called');
  res.json([]);
});

app.get('/api/admin/locations', (req, res) => {
  console.log('📍 GET /api/admin/locations called');
  res.json([]);
});

app.post('/api/admin/locations', (req, res) => {
  console.log('📍 POST /api/admin/locations called with body:', req.body);
  const newLocation = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  console.log('📍 Created location:', newLocation);
  res.json(newLocation);
});

// Products API
app.get('/api/products', (req, res) => {
  console.log('🛍️ GET /api/products called');
  res.json([]);
});

app.get('/api/admin/products', (req, res) => {
  console.log('🛍️ GET /api/admin/products called');
  res.json([]);
});

app.post('/api/admin/products', (req, res) => {
  console.log('🛍️ POST /api/admin/products called with body:', req.body);
  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  console.log('🛍️ Created product:', newProduct);
  res.json({ message: 'Product created successfully', product: newProduct });
});

// Content API
app.get('/api/admin/content', (req, res) => {
  console.log('📝 GET /api/admin/content called');
  res.json([]);
});

app.post('/api/admin/content', (req, res) => {
  console.log('📝 POST /api/admin/content called with body:', req.body);
  const newContent = {
    id: Math.random().toString(36).substr(2, 9),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  console.log('📝 Created content:', newContent);
  res.json({ message: 'Content created successfully', content: newContent });
});

// Orders API
app.get('/api/admin/orders', (req, res) => {
  console.log('📦 GET /api/admin/orders called');
  res.json([]);
});

// Admin login (mock)
app.post('/api/admin/login', (req, res) => {
  console.log('🔐 POST /api/admin/login called with body:', req.body);
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    console.log('🔐 Login successful for admin');
    res.json({
      token: 'mock-jwt-token',
      admin: {
        id: '1',
        username: 'admin',
        role: 'admin'
      }
    });
  } else {
    console.log('🔐 Login failed for:', username);
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

console.log('🔌 API routes setup complete');

// CATCH-ALL ROUTE - This must come AFTER all API routes
app.get('*', (req, res) => {
  console.log(`🌐 Catch-all route serving index.html for: ${req.path}`);
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Admin interface: http://localhost:${PORT}/admin/login`);
  console.log(`📁 Static files from: ${path.join(__dirname, 'dist/public')}`);
  console.log(`📁 Assets from: ${path.join(__dirname, 'dist/public/assets')}`);
  console.log(`🔌 API endpoints available for admin functionality`);
  console.log(`🔌 Available API routes:`);
  console.log(`   - GET  /api/locations`);
  console.log(`   - GET  /api/admin/locations`);
  console.log(`   - POST /api/admin/locations`);
  console.log(`   - GET  /api/products`);
  console.log(`   - GET  /api/admin/products`);
  console.log(`   - POST /api/admin/products`);
  console.log(`   - GET  /api/admin/content`);
  console.log(`   - POST /api/admin/content`);
  console.log(`   - GET  /api/admin/orders`);
  console.log(`   - POST /api/admin/login`);
});

// Handle process errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});
