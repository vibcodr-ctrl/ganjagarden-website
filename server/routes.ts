import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertContactSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  app.get('/api/products/category/:category', async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch products by category' });
    }
  });

  // Order routes
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body.order);
      const orderItems = req.body.items;

      // Create order
      const order = await storage.createOrder(orderData);

      // Create order items and update stock
      for (const item of orderItems) {
        const orderItemData = insertOrderItemSchema.parse({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        
        await storage.createOrderItem(orderItemData);
        
        // Update product stock
        const product = await storage.getProduct(item.productId);
        if (product) {
          const newStock = product.stock - item.quantity;
          await storage.updateProductStock(item.productId, Math.max(0, newStock));
        }
      }

      res.json({ order, message: 'Order placed successfully' });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ message: 'Failed to create order' });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ contact, message: 'Message sent successfully' });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(400).json({ message: 'Failed to send message' });
    }
  });

  // Chat session routes
  app.post('/api/chat/session', async (req, res) => {
    try {
      const session = await storage.createChatSession({
        status: 'active'
      });
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  app.get('/api/chat/messages/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post('/api/chat/message', async (req, res) => {
    try {
      const { sessionId, content, sender } = req.body;
      
      if (!sessionId || !content || !sender) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Save customer message
      const customerMessage = await storage.createChatMessage({
        sessionId,
        content,
        sender,
        messageType: 'text'
      });

      // Generate AI response if sender is customer
      if (sender === 'customer') {
        try {
          const aiResponse = await generateAIResponse(content);
          await storage.createChatMessage({
            sessionId,
            content: aiResponse,
            sender: 'ai',
            messageType: 'text'
          });
        } catch (aiError) {
          console.error("AI response error:", aiError);
          await storage.createChatMessage({
            sessionId,
            content: "Thanks for your message! I'm having trouble with my AI connection right now. Our team will respond shortly, or feel free to browse our products while you wait!",
            sender: 'ai',
            messageType: 'text'
          });
        }
      }

      res.json(customerMessage);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI Response Generation
async function generateAIResponse(customerMessage: string): Promise<string> {
  const lowerMessage = customerMessage.toLowerCase();
  
  if (lowerMessage.includes('indica') || lowerMessage.includes('relaxing') || lowerMessage.includes('sleep')) {
    return "Great choice! Indica strains are perfect for relaxation and evening use. I'd recommend our Purple Kush cuttings - they have beautiful deep purple hues and provide excellent relaxing effects. Would you like to know more about our indica selection?";
  }
  
  if (lowerMessage.includes('sativa') || lowerMessage.includes('energy') || lowerMessage.includes('daytime')) {
    return "Sativa strains are excellent for daytime use! Our Green Crack cuttings are very popular - they provide clean, energizing effects perfect for staying active. Check out our sativa section for more energizing options!";
  }
  
  if (lowerMessage.includes('hybrid') || lowerMessage.includes('balanced')) {
    return "Hybrid strains offer the best of both worlds! Our Blue Dream seedlings are a customer favorite - they provide a nice balanced effect with a sweet berry aroma. Perfect for new growers too!";
  }
  
  if (lowerMessage.includes('beginner') || lowerMessage.includes('new') || lowerMessage.includes('first time')) {
    return "Welcome to cannabis cultivation! For beginners, I'd recommend starting with our hardy seedlings like Blue Dream or Northern Lights. They're forgiving plants and grow well in most conditions. Would you like some growing tips?";
  }
  
  if (lowerMessage.includes('growing') || lowerMessage.includes('tips') || lowerMessage.includes('how to')) {
    return "I'd be happy to share some growing tips! The key factors are proper lighting (18-24 hours for vegetative growth), good drainage, pH between 6.0-7.0, and consistent watering. What specific aspect of growing would you like to know more about?";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
    return "Our prices are competitive and reflect the quality of our genetics! Cuttings range from $25-30 and seedlings from $15-20. We also offer safe delivery or pickup from our secure locations. What's your budget range?";
  }
  
  if (lowerMessage.includes('delivery') || lowerMessage.includes('pickup') || lowerMessage.includes('location')) {
    return "We offer both safe delivery and pickup options! For pickup, we have 6 secure locations including Downtown Mall, Riverside Park, and Metro Station. All meetings are at safe, public locations. Would you prefer delivery or pickup?";
  }
  
  return "Thanks for your question! I'm here to help with anything about our cannabis plants, strains, growing tips, or ordering. What specific information can I provide for you today?";
}
