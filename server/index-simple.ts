import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage for the session
let products = [
  {
    id: '1',
    name: 'Purple Kush Cutting',
    description: 'Premium indica cutting with deep purple hues and relaxing effects.',
    price: '25.00',
    stock: 12,
    category: 'cutting',
    imageUrl: 'https://images.pexels.com/photos/3536257/pexels-photo-3536257.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    strain: 'Purple Kush',
    genetics: 'indica'
  },
  {
    id: '2',
    name: 'Blue Dream Seedling',
    description: 'Balanced hybrid with sweet berry aroma.',
    price: '15.00',
    stock: 20,
    category: 'seedling',
    imageUrl: 'https://images.pexels.com/photos/4543134/pexels-photo-4543134.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
    strain: 'Blue Dream',
    genetics: 'hybrid'
  }
];

let contentSections = [
  {
    id: '1',
    key: 'hero_title',
    title: 'Hero Section Title',
    content: 'Premium Cannabis Plants for Serious Growers',
    contentType: 'text',
    isActive: true,
    orderIndex: 0
  },
  {
    id: '2',
    key: 'hero_subtitle',
    title: 'Hero Section Subtitle',
    content: 'Discover our selection of premium cuttings and seedlings, carefully cultivated for optimal growth and potency.',
    contentType: 'text',
    isActive: true,
    orderIndex: 1
  }
];

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../dist/public')));

// Simple admin routes for testing
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin123') {
    res.json({ 
      token: 'test-token-123', 
      admin: { 
        id: '1', 
        username: 'admin', 
        role: 'super_admin' 
      } 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// API endpoints using in-memory storage
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Admin product management endpoints
app.post('/api/admin/products', (req, res) => {
  // Create a new product
  const newProduct = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.json({ message: 'Product created successfully', product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
  // Update an existing product
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  const updatedProduct = {
    ...products[productIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  products[productIndex] = updatedProduct;
  res.json({ message: 'Product updated successfully', product: updatedProduct });
});

app.delete('/api/admin/products/:id', (req, res) => {
  // Delete a product
  const { id } = req.params;
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully', id });
});

// Admin content management endpoints
app.get('/api/admin/content', (req, res) => {
  res.json(contentSections);
});

app.post('/api/admin/content', (req, res) => {
  // Create new content
  const newContent = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  contentSections.push(newContent);
  res.json({ message: 'Content created successfully', content: newContent });
});

app.put('/api/admin/content/:id', (req, res) => {
  // Update existing content
  const { id } = req.params;
  const contentIndex = contentSections.findIndex(c => c.id === id);
  
  if (contentIndex === -1) {
    return res.status(404).json({ message: 'Content not found' });
  }
  
  const updatedContent = {
    ...contentSections[contentIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  
  contentSections[contentIndex] = updatedContent;
  res.json({ message: 'Content updated successfully', content: updatedContent });
});

app.get('/api/admin/orders', (req, res) => {
  res.json([]); // No mock orders
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

const port = 5000;
app.listen(port, () => {
  console.log(`🚀 GanjaGarden server running on port ${port}`);
  console.log(`🌐 Admin interface: http://localhost:${port}/admin/login`);
  console.log(`👤 Username: admin, Password: admin123`);
  console.log(`⚠️  This is a test server without database connection`);
});
