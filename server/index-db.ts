import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { db } from './db';
import { products, adminUsers, siteContent, orders, chatSessions, chatMessages, knowledgeBase, specialOrders, apiUsage } from '@shared/schema';
import { eq, desc, like } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { upload } from './middleware/upload.js';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, '../dist/public')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'ganjagarden-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find admin user
    const adminUser = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    
    if (adminUser.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = adminUser[0];
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Update last login
    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, user.id));
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get products
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await db.select().from(products).where(eq(products.isActive, true));
    res.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Admin product management
app.post('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    const newProduct = await db.insert(products).values({
      ...req.body,
      isActive: true,
      createdAt: new Date()
    }).returning();
    
    res.json({ message: 'Product created successfully', product: newProduct[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedProduct = await db.update(products)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(products.id, id))
      .returning();
    
    if (updatedProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully', product: updatedProduct[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedProduct = await db.delete(products)
      .where(eq(products.id, id))
      .returning();
    
    if (deletedProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully', id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Admin content management
app.get('/api/admin/content', authenticateToken, async (req, res) => {
  try {
    const allContent = await db.select().from(siteContent).orderBy(siteContent.orderIndex);
    res.json(allContent);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

app.post('/api/admin/content', authenticateToken, async (req, res) => {
  try {
    const newContent = await db.insert(siteContent).values({
      ...req.body,
      createdAt: new Date()
    }).returning();
    
    res.json({ message: 'Content created successfully', content: newContent[0] });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Failed to create content' });
  }
});

app.put('/api/admin/content/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const updatedContent = await db.update(siteContent)
      .set({
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(siteContent.id, id))
      .returning();
    
    if (updatedContent.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json({ message: 'Content updated successfully', content: updatedContent[0] });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Failed to update content' });
  }
});

// Get orders
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(orders.createdAt);
    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// Get locations from content (public endpoint)
app.get('/api/locations', async (req, res) => {
  try {
    const pickupContent = await db.select().from(siteContent).where(eq(siteContent.key, 'pickup_locations_list'));
    
    if (pickupContent.length > 0 && pickupContent[0].contentType === 'json') {
      try {
        const locations = JSON.parse(pickupContent[0].content);
        
        // Ensure all locations have IDs
        const locationsWithIds = locations.map((location: any, index: number) => {
          if (!location.id) {
            return {
              ...location,
              id: Math.random().toString(36).substr(2, 9)
            };
          }
          return location;
        });
        
        // If any locations were missing IDs, update the database
        if (locationsWithIds.length !== locations.length || locationsWithIds.some((loc: any, index: number) => loc.id !== locations[index]?.id)) {
          await db.update(siteContent)
            .set({ 
              content: JSON.stringify(locationsWithIds),
              updatedAt: new Date()
            })
            .where(eq(siteContent.key, 'pickup_locations_list'));
        }
        
        res.json(locationsWithIds);
      } catch (error) {
        res.json([]);
      }
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});

// Get locations from content (admin endpoint)
app.get('/api/admin/locations', authenticateToken, async (req, res) => {
  try {
    const pickupContent = await db.select().from(siteContent).where(eq(siteContent.key, 'pickup_locations_list'));
    
    if (pickupContent.length > 0 && pickupContent[0].contentType === 'json') {
      try {
        const locations = JSON.parse(pickupContent[0].content);
        
        // Ensure all locations have IDs
        const locationsWithIds = locations.map((location: any, index: number) => {
          if (!location.id) {
            return {
              ...location,
              id: Math.random().toString(36).substr(2, 9)
            };
          }
          return location;
        });
        
        // If any locations were missing IDs, update the database
        if (locationsWithIds.length !== locations.length || locationsWithIds.some((loc: any, index: number) => loc.id !== locations[index]?.id)) {
          await db.update(siteContent)
            .set({ 
              content: JSON.stringify(locationsWithIds),
              updatedAt: new Date()
            })
            .where(eq(siteContent.key, 'pickup_locations_list'));
        }
        
        res.json(locationsWithIds);
      } catch (error) {
        res.json([]);
      }
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Failed to fetch locations' });
  }
});

// Create new location
app.post('/api/admin/locations', authenticateToken, async (req, res) => {
  try {
    const { name, district, spot, hours, notes, isPopular, isActive } = req.body;
    
    // Get current locations
    const pickupContent = await db.select().from(siteContent).where(eq(siteContent.key, 'pickup_locations_list'));
    
    let locations = [];
    if (pickupContent.length > 0 && pickupContent[0].contentType === 'json') {
      try {
        locations = JSON.parse(pickupContent[0].content);
      } catch (error) {
        locations = [];
      }
    }
    
    // Add new location with unique ID
    const newLocation = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      district,
      spot,
      hours,
      notes,
      isPopular: isPopular || false,
      isActive: isActive !== undefined ? isActive : true
    };
    
    locations.push(newLocation);
    
    // Update content
    if (pickupContent.length > 0) {
      await db.update(siteContent)
        .set({ 
          content: JSON.stringify(locations),
          updatedAt: new Date()
        })
        .where(eq(siteContent.key, 'pickup_locations_list'));
    } else {
      await db.insert(siteContent).values({
        key: 'pickup_locations_list',
        title: 'Pickup Locations List',
        content: JSON.stringify(locations),
        contentType: 'json',
        isActive: true,
        orderIndex: 33
      });
    }
    
    res.json(newLocation);
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Failed to create location' });
  }
});

// Update location
app.put('/api/admin/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, district, spot, hours, notes, isPopular, isActive } = req.body;
    
    // Get current locations
    const pickupContent = await db.select().from(siteContent).where(eq(siteContent.key, 'pickup_locations_list'));
    
    if (pickupContent.length === 0) {
      return res.status(404).json({ message: 'Locations not found' });
    }
    
    let locations = [];
    try {
      locations = JSON.parse(pickupContent[0].content);
    } catch (error) {
      return res.status(500).json({ message: 'Invalid locations data' });
    }
    
    // Find and update location
    const locationIndex = locations.findIndex((loc: any) => loc.id === id);
    if (locationIndex === -1) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    locations[locationIndex] = {
      ...locations[locationIndex],
      name,
      district,
      spot,
      hours,
      notes,
      isPopular: isPopular !== undefined ? isPopular : locations[locationIndex].isPopular,
      isActive: isActive !== undefined ? isActive : locations[locationIndex].isActive
    };
    
    // Update content
    await db.update(siteContent)
      .set({ 
        content: JSON.stringify(locations),
        updatedAt: new Date()
      })
      .where(eq(siteContent.key, 'pickup_locations_list'));
    
    res.json(locations[locationIndex]);
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Failed to update location' });
  }
});

// Delete location
app.delete('/api/admin/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current locations
    const pickupContent = await db.select().from(siteContent).where(eq(siteContent.key, 'pickup_locations_list'));
    
    if (pickupContent.length === 0) {
      return res.status(404).json({ message: 'Locations not found' });
    }
    
    let locations = [];
    try {
      locations = JSON.parse(pickupContent[0].content);
    } catch (error) {
      return res.status(500).json({ message: 'Invalid locations data' });
    }
    
    // Find and remove location
    const locationIndex = locations.findIndex((loc: any) => loc.id === id);
    if (locationIndex === -1) {
      return res.status(404).json({ message: 'Location not found' });
    }
    
    locations.splice(locationIndex, 1);
    
    // Update content
    await db.update(siteContent)
      .set({ 
        content: JSON.stringify(locations),
        updatedAt: new Date()
      })
      .where(eq(siteContent.key, 'pickup_locations_list'));
    
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Failed to delete location' });
  }
});

// Update order status
app.put('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const updatedOrder = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    
    if (updatedOrder.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order status updated successfully', order: updatedOrder[0] });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

// Public content endpoint
app.get('/api/content/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const content = await db.select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
    
    if (content.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    res.json(content[0]);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Failed to fetch content' });
  }
});

// Test endpoint for virtual dispensary services
app.get('/api/test/virtual-dispensary', async (req, res) => {
  try {
    res.json({
      message: 'Virtual Dispensary services are ready!',
      services: ['Gemini AI', 'Google Search', 'Email Notifications', 'Knowledge Base'],
      status: 'operational'
    });
  } catch (error) {
    console.error('Error testing virtual dispensary:', error);
    res.status(500).json({ message: 'Service test failed' });
  }
});

// Virtual Dispensary API Endpoints
import { GeminiService } from './services/gemini-service.js';
import { GoogleSearchService } from './services/google-search-service.js';
import { EmailService } from './services/email-service.js';

const geminiService = new GeminiService();
const googleSearchService = new GoogleSearchService();
const emailService = new EmailService();

// Chat Sessions
app.post('/api/chat/sessions', async (req, res) => {
  try {
    const { chatType } = req.body;
    const sessionId = crypto.randomUUID();
    
    await db.insert(chatSessions).values({
      id: sessionId,
      chatType,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ sessionId, message: 'Chat session created' });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: 'Failed to create chat session' });
  }
});

// AI Chat Messages
app.post('/api/chat/ai/message', upload.array('images', 5), async (req, res) => {
  try {
    const { sessionId, message, language = 'de' } = req.body;
    const images = req.files as Express.Multer.File[];

    // Save user message
    const userMessageId = crypto.randomUUID();
    await db.insert(chatMessages).values({
      id: userMessageId,
      sessionId,
      content: message,
      sender: 'customer',
      messageType: 'text',
      createdAt: new Date()
    });

    // Process images if any
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      for (const image of images) {
        const imageUrl = `/uploads/${image.filename}`;
        imageUrls.push(imageUrl);
        
        await db.insert(chatMessages).values({
          id: crypto.randomUUID(),
          sessionId,
          content: 'Image uploaded',
          sender: 'customer',
          messageType: 'image',
          imageUrl,
          createdAt: new Date()
        });
      }
    }

    // Generate AI response
    let aiResponse: any;
    if (images && images.length > 0) {
      // Analyze image with AI
      const imageBase64 = images[0].buffer.toString('base64');
      aiResponse = await geminiService.analyzePlantImage(imageBase64, message);
    } else {
      // Generate text response
      aiResponse = await geminiService.generateChatResponse(message, language);
    }

    // Save AI response
    const aiMessageId = crypto.randomUUID();
    await db.insert(chatMessages).values({
      id: aiMessageId,
      sessionId,
      content: aiResponse.response,
      sender: 'ai',
      messageType: 'text',
      metadata: JSON.stringify(aiResponse.metadata),
      createdAt: new Date()
    });

    // Perform online search if needed
    let searchResults = null;
    if (aiResponse.needsSearch && aiResponse.searchQuery) {
      try {
        searchResults = await googleSearchService.searchPlantCare(aiResponse.searchQuery);
      } catch (searchError) {
        console.error('Search failed:', searchError);
      }
    }

    res.json({
      aiResponse: aiResponse.response,
      searchResults,
      metadata: aiResponse.metadata
    });

  } catch (error) {
    console.error('Error processing AI chat:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

// Admin Chat Messages
app.post('/api/chat/admin/message', upload.array('images', 5), async (req, res) => {
  try {
    const { sessionId, message, customerEmail, customerName } = req.body;
    const images = req.files as Express.Multer.File[];

    // Save user message
    const userMessageId = crypto.randomUUID();
    await db.insert(chatMessages).values({
      id: userMessageId,
      sessionId,
      content: message,
      sender: 'customer',
      messageType: 'text',
      createdAt: new Date()
    });

    // Process images if any
    if (images && images.length > 0) {
      for (const image of images) {
        const imageUrl = `/uploads/${image.filename}`;
        
        await db.insert(chatMessages).values({
          id: crypto.randomUUID(),
          sessionId,
          content: 'Image uploaded',
          sender: 'customer',
          messageType: 'image',
          imageUrl,
          createdAt: new Date()
        });
      }
    }

    // Notify admin
    const adminUsersList = await db.select().from(adminUsers);
    if (adminUsersList.length > 0) {
      await emailService.notifyAdminOfChatRequest(adminUsersList[0].email, {
        email: customerEmail,
        name: customerName,
        message,
        chatType: 'admin'
      });
    }

    res.json({ message: 'Message sent to admin' });

  } catch (error) {
    console.error('Error processing admin chat:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Special Order Submission
app.post('/api/chat/special-order', async (req, res) => {
  try {
    const { sessionId, orderData } = req.body;
    
    const specialOrderId = crypto.randomUUID();
    await db.insert(specialOrders).values({
      id: specialOrderId,
      chatSessionId: sessionId,
      customerEmail: orderData.email,
      customerName: orderData.name,
      customerPhone: orderData.phone,
      requestDetails: orderData.details,
      requestedQuantity: parseInt(orderData.quantity),
      requestedStrain: orderData.strain,
      requestedDate: orderData.date,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Notify admin
    const adminUsersList = await db.select().from(adminUsers);
    if (adminUsersList.length > 0) {
      await emailService.notifyAdminOfChatRequest(adminUsersList[0].email, {
        email: orderData.email,
        name: orderData.name,
        message: `Special order request: ${orderData.details}`,
        chatType: 'admin'
      });
    }

    res.json({ message: 'Special order submitted successfully' });

  } catch (error) {
    console.error('Error submitting special order:', error);
    res.status(500).json({ message: 'Failed to submit order' });
  }
});

// Knowledge Base Management
app.get('/api/admin/knowledge-base', async (req, res) => {
  try {
    const knowledgeItems = await db.select().from(knowledgeBase).orderBy(desc(knowledgeBase.createdAt));
    res.json(knowledgeItems);
  } catch (error) {
    console.error('Error fetching knowledge base:', error);
    res.status(500).json({ message: 'Failed to fetch knowledge base' });
  }
});

app.post('/api/admin/knowledge-base', upload.array('images', 10), async (req, res) => {
  try {
    const { title, description, problemType, symptoms, causes, solutions, prevention } = req.body;
    const images = req.files as Express.Multer.File[];
    
    const imageUrls = images ? images.map(img => `/uploads/${img.filename}`) : [];
    
    const knowledgeItemId = crypto.randomUUID();
    await db.insert(knowledgeBase).values({
      id: knowledgeItemId,
      title,
      description,
      problemType,
      symptoms: JSON.stringify(JSON.parse(symptoms)),
      causes: JSON.stringify(JSON.parse(causes)),
      solutions: JSON.stringify(JSON.parse(solutions)),
      prevention,
      imageUrls: JSON.stringify(imageUrls),
      isActive: true,
      uploadedBy: (req as any).user?.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ message: 'Knowledge base item created', id: knowledgeItemId });
  } catch (error) {
    console.error('Error creating knowledge base item:', error);
    res.status(500).json({ message: 'Failed to create knowledge base item' });
  }
});

app.put('/api/admin/knowledge-base/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, problemType, symptoms, causes, solutions, prevention, isActive } = req.body;
    
    await db.update(knowledgeBase)
      .set({
        title,
        description,
        problemType,
        symptoms: JSON.stringify(JSON.parse(symptoms)),
        causes: JSON.stringify(JSON.parse(causes)),
        solutions: JSON.stringify(JSON.parse(solutions)),
        prevention,
        isActive: isActive === 'true',
        updatedAt: new Date()
      })
      .where(eq(knowledgeBase.id, id));

    res.json({ message: 'Knowledge base item updated' });
  } catch (error) {
    console.error('Error updating knowledge base item:', error);
    res.status(500).json({ message: 'Failed to update knowledge base item' });
  }
});

app.delete('/api/admin/knowledge-base/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
    res.json({ message: 'Knowledge base item deleted' });
  } catch (error) {
    console.error('Error deleting knowledge base item:', error);
    res.status(500).json({ message: 'Failed to delete knowledge base item' });
  }
});

// API Usage Tracking
app.get('/api/admin/api-usage', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0');
    
    const dailyUsage = await db.select()
      .from(apiUsage)
      .where(eq(apiUsage.date, today));
    
    const monthlyUsage = await db.select()
      .from(apiUsage)
      .where(like(apiUsage.date, thisMonth + '%'));
    
    const totalDailyTokens = dailyUsage
      .filter(u => u.apiType === 'gemini')
      .reduce((sum, u) => sum + (u.tokensUsed || 0), 0);
    
    const totalDailyCost = dailyUsage.reduce((sum, u) => sum + (u.cost || 0), 0);
    
    res.json({
      daily: {
        tokens: totalDailyTokens,
        cost: totalDailyCost,
        searches: dailyUsage.filter(u => u.apiType === 'google_search').length
      },
      monthly: {
        tokens: monthlyUsage
          .filter(u => u.apiType === 'gemini')
          .reduce((sum, u) => sum + (u.tokensUsed || 0), 0),
        cost: monthlyUsage.reduce((sum, u) => sum + (u.cost || 0), 0),
        searches: monthlyUsage.filter(u => u.apiType === 'google_search').length
      },
      limits: {
        dailyTokens: config.limits.dailyGeminiTokens,
        monthlyTokens: config.limits.monthlyGeminiTokens,
        dailySearches: config.limits.dailyGoogleSearches,
        monthlySearches: config.limits.monthlyGoogleSearches
      }
    });
  } catch (error) {
    console.error('Error fetching API usage:', error);
    res.status(500).json({ message: 'Failed to fetch API usage' });
  }
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
  console.log(`💾 Using SQLite database: ganjagarden.db`);
});


