var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/db.ts
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  adminUsers: () => adminUsers,
  apiUsage: () => apiUsage,
  chatMessages: () => chatMessages,
  chatMessagesRelations: () => chatMessagesRelations,
  chatSessions: () => chatSessions,
  chatSessionsRelations: () => chatSessionsRelations,
  contacts: () => contacts,
  images: () => images,
  insertAdminUserSchema: () => insertAdminUserSchema,
  insertApiUsageSchema: () => insertApiUsageSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertChatSessionSchema: () => insertChatSessionSchema,
  insertContactSchema: () => insertContactSchema,
  insertImageSchema: () => insertImageSchema,
  insertKnowledgeBaseSchema: () => insertKnowledgeBaseSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductSchema: () => insertProductSchema,
  insertSiteContentSchema: () => insertSiteContentSchema,
  insertSpecialOrderSchema: () => insertSpecialOrderSchema,
  insertUserSchema: () => insertUserSchema,
  knowledgeBase: () => knowledgeBase,
  orderItems: () => orderItems,
  orders: () => orders,
  products: () => products,
  siteContent: () => siteContent,
  specialOrders: () => specialOrders,
  users: () => users
});
import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var products = sqliteTable("products", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  category: text("category").notNull(),
  // 'cutting' or 'seedling'
  imageUrl: text("image_url").notNull(),
  strain: text("strain"),
  genetics: text("genetics"),
  // indica, sativa, hybrid
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  // Enhanced product details for popup
  detailedDescription: text("detailed_description"),
  // Full description for popup
  thcContent: text("thc_content"),
  // THC percentage range
  cbdContent: text("cbd_content"),
  // CBD percentage range
  floweringTime: text("flowering_time"),
  // e.g., "8-10 weeks"
  yieldPotential: text("yield_potential"),
  // e.g., "400-600g/m²"
  difficultyLevel: text("difficulty_level"),
  // beginner, intermediate, advanced
  growingMedium: text("growing_medium"),
  // soil, hydroponic, coco
  climate: text("climate"),
  // indoor, outdoor, greenhouse
  effects: text("effects"),
  // e.g., "Euphoric, Creative, Relaxed"
  medicalBenefits: text("medical_benefits"),
  // e.g., "Pain relief, Anxiety, Sleep"
  careInstructions: text("care_instructions"),
  // Watering, nutrients, lighting
  additionalImages: text("additional_images"),
  // JSON array of image URLs
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address"),
  pickupLocation: text("pickup_location"),
  deliveryType: text("delivery_type").notNull(),
  // 'delivery' or 'pickup'
  total: real("total").notNull(),
  status: text("status").notNull().default("pending"),
  // pending, confirmed, delivered, cancelled
  items: text("items"),
  // JSON string for order items
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull()
});
var contacts = sqliteTable("contacts", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  orderType: text("order_type"),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var chatSessions = sqliteTable("chat_sessions", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  chatType: text("chat_type").notNull(),
  // 'ai' or 'admin'
  customerId: text("customer_id"),
  // Optional, for tracking returning customers
  status: text("status").default("active"),
  // active, ended, admin_active
  adminId: text("admin_id"),
  // When admin takes over
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`)
});
var chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  sessionId: text("session_id").notNull().references(() => chatSessions.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(),
  // 'customer', 'ai', 'admin'
  messageType: text("message_type").default("text"),
  // text, image, system
  imageUrl: text("image_url"),
  // For image messages
  metadata: text("metadata"),
  // JSON for additional data (AI confidence, search results, etc.)
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var knowledgeBase = sqliteTable("knowledge_base", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  problemType: text("problem_type").notNull(),
  // pest, disease, nutrient, environment
  symptoms: text("symptoms"),
  // JSON array of symptoms
  causes: text("causes"),
  // JSON array of causes
  solutions: text("solutions"),
  // JSON array of solutions
  prevention: text("prevention"),
  // Prevention tips
  imageUrls: text("image_urls"),
  // JSON array of image URLs
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  uploadedBy: text("uploaded_by").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var specialOrders = sqliteTable("special_orders", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  chatSessionId: text("chat_session_id").references(() => chatSessions.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  requestDetails: text("request_details").notNull(),
  requestedQuantity: integer("requested_quantity"),
  requestedStrain: text("requested_strain"),
  requestedDate: text("requested_date"),
  // ISO date string
  status: text("status").notNull().default("pending"),
  // pending, confirmed, rejected, completed
  adminNotes: text("admin_notes"),
  totalPrice: real("total_price"),
  adminId: text("admin_id").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var apiUsage = sqliteTable("api_usage", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  apiType: text("api_type").notNull(),
  // 'gemini', 'google_search'
  endpoint: text("endpoint").notNull(),
  tokensUsed: integer("tokens_used"),
  cost: real("cost"),
  date: text("date").notNull(),
  // YYYY-MM-DD format
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  // admin, super_admin
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  lastLogin: integer("last_login", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  key: text("key").notNull().unique(),
  // e.g., 'hero_title', 'about_text', 'contact_info'
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull().default("text"),
  // text, html, json
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  orderIndex: integer("order_index").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var images = sqliteTable("images", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  category: text("category"),
  // product, hero, gallery, etc.
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  uploadedBy: text("uploaded_by").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true
});
var insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true
});
var chatSessionsRelations = relations(chatSessions, ({ many }) => ({
  messages: many(chatMessages)
}));
var chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id]
  })
}));
var insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});
var insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true
});
var insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true
});
var insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSpecialOrderSchema = createInsertSchema(specialOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  createdAt: true
});

// server/db.ts
var sqlite = new Database("./ganjagarden.db");
var db = drizzle(sqlite, { schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getProducts() {
    return await db.select().from(products);
  }
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }
  async getProductsByCategory(category) {
    return await db.select().from(products).where(eq(products.category, category));
  }
  async createProduct(insertProduct) {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }
  async updateProductStock(id, stock) {
    const [product] = await db.update(products).set({ stock }).where(eq(products.id, id)).returning();
    return product;
  }
  async createOrder(insertOrder) {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }
  async getOrder(id) {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }
  async getOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  async updateOrderStatus(id, status) {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    return order;
  }
  async createOrderItem(insertOrderItem) {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }
  async getOrderItems(orderId) {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }
  async createContact(insertContact) {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  // Chat session operations
  async createChatSession(insertSession) {
    const [session] = await db.insert(chatSessions).values(insertSession).returning();
    return session;
  }
  async getChatSession(id) {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session;
  }
  async updateChatSessionStatus(id, status, adminId) {
    const [session] = await db.update(chatSessions).set({ status, adminId, updatedAt: /* @__PURE__ */ new Date() }).where(eq(chatSessions.id, id)).returning();
    return session;
  }
  async createChatMessage(insertMessage) {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }
  async getChatMessages(sessionId) {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt);
  }
  // Admin user operations
  async getAdminByUsername(username) {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }
  async createAdminUser(adminUser) {
    const [admin] = await db.insert(adminUsers).values(adminUser).returning();
    return admin;
  }
  async updateAdminLastLogin(id) {
    await db.update(adminUsers).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(adminUsers.id, id));
  }
  // Product management operations
  async updateProduct(id, product) {
    const [updatedProduct] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updatedProduct;
  }
  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, id));
  }
  // Site content operations
  async getAllSiteContent() {
    return await db.select().from(siteContent);
  }
  async getSiteContentByKey(key) {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }
  async createSiteContent(content) {
    const [newContent] = await db.insert(siteContent).values(content).returning();
    return newContent;
  }
  async updateSiteContent(id, content) {
    const [updatedContent] = await db.update(siteContent).set(content).where(eq(siteContent.id, id)).returning();
    return updatedContent;
  }
  // Image operations
  async getAllImages() {
    return await db.select().from(images);
  }
  async createImage(image) {
    const [newImage] = await db.insert(images).values(image).returning();
    return newImage;
  }
  async deleteImage(id) {
    await db.delete(images).where(eq(images.id, id));
  }
  // Order management operations
  async getAllOrders() {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
async function registerRoutes(app2) {
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin || !admin.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      await storage.updateAdminLastLogin(admin.id);
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );
      res.json({
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        }
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/products", authenticateAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.json({ product, message: "Product created successfully" });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(400).json({ message: "Failed to create product" });
    }
  });
  app2.put("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ product, message: "Product updated successfully" });
    } catch (error) {
      console.error("Product update error:", error);
      res.status(400).json({ message: "Failed to update product" });
    }
  });
  app2.delete("/api/admin/products/:id", authenticateAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Product deletion error:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  app2.get("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      const content = await storage.getAllSiteContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.post("/api/admin/content", authenticateAdmin, async (req, res) => {
    try {
      const contentData = insertSiteContentSchema.parse(req.body);
      const content = await storage.createSiteContent(contentData);
      res.json({ content, message: "Content created successfully" });
    } catch (error) {
      console.error("Content creation error:", error);
      res.status(400).json({ message: "Failed to create content" });
    }
  });
  app2.put("/api/admin/content/:id", authenticateAdmin, async (req, res) => {
    try {
      const contentData = insertSiteContentSchema.parse(req.body);
      const content = await storage.updateSiteContent(req.params.id, contentData);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json({ content, message: "Content updated successfully" });
    } catch (error) {
      console.error("Content update error:", error);
      res.status(400).json({ message: "Failed to update content" });
    }
  });
  app2.get("/api/admin/images", authenticateAdmin, async (req, res) => {
    try {
      const images2 = await storage.getAllImages();
      res.json(images2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch images" });
    }
  });
  app2.post("/api/admin/images", authenticateAdmin, async (req, res) => {
    try {
      const imageData = insertImageSchema.parse(req.body);
      const image = await storage.createImage(imageData);
      res.json({ image, message: "Image uploaded successfully" });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(400).json({ message: "Failed to upload image" });
    }
  });
  app2.delete("/api/admin/images/:id", authenticateAdmin, async (req, res) => {
    try {
      await storage.deleteImage(req.params.id);
      res.json({ message: "Image deleted successfully" });
    } catch (error) {
      console.error("Image deletion error:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });
  app2.get("/api/admin/orders", authenticateAdmin, async (req, res) => {
    try {
      const orders2 = await storage.getAllOrders();
      res.json(orders2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  app2.put("/api/admin/orders/:id/status", authenticateAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ order, message: "Order status updated successfully" });
    } catch (error) {
      console.error("Order status update error:", error);
      res.status(400).json({ message: "Failed to update order status" });
    }
  });
  app2.get("/api/content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContentByKey(req.params.key);
      if (!content || !content.isActive) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.get("/api/products/category/:category", async (req, res) => {
    try {
      const products2 = await storage.getProductsByCategory(req.params.category);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  app2.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body.order);
      const orderItems2 = req.body.items;
      const order = await storage.createOrder(orderData);
      for (const item of orderItems2) {
        const orderItemData = insertOrderItemSchema.parse({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        });
        await storage.createOrderItem(orderItemData);
        const product = await storage.getProduct(item.productId);
        if (product) {
          const newStock = product.stock - item.quantity;
          await storage.updateProductStock(item.productId, Math.max(0, newStock));
        }
      }
      res.json({ order, message: "Order placed successfully" });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const items = await storage.getOrderItems(order.id);
      res.json({ order, items });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ contact, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });
  app2.post("/api/chat/session", async (req, res) => {
    try {
      const session = await storage.createChatSession({
        status: "active"
      });
      res.json(session);
    } catch (error) {
      console.error("Error creating chat session:", error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });
  app2.get("/api/chat/messages/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });
  app2.post("/api/chat/message", async (req, res) => {
    try {
      const { sessionId, content, sender } = req.body;
      if (!sessionId || !content || !sender) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const customerMessage = await storage.createChatMessage({
        sessionId,
        content,
        sender,
        messageType: "text"
      });
      if (sender === "customer") {
        try {
          const aiResponse = await generateAIResponse(content);
          await storage.createChatMessage({
            sessionId,
            content: aiResponse,
            sender: "ai",
            messageType: "text"
          });
        } catch (aiError) {
          console.error("AI response error:", aiError);
          await storage.createChatMessage({
            sessionId,
            content: "Thanks for your message! I'm having trouble with my AI connection right now. Our team will respond shortly, or feel free to browse our products while you wait!",
            sender: "ai",
            messageType: "text"
          });
        }
      }
      res.json(customerMessage);
    } catch (error) {
      console.error("Error creating chat message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}
async function generateAIResponse(customerMessage) {
  const lowerMessage = customerMessage.toLowerCase();
  if (lowerMessage.includes("indica") || lowerMessage.includes("relaxing") || lowerMessage.includes("sleep")) {
    return "Great choice! Indica strains are perfect for relaxation and evening use. I'd recommend our Purple Kush cuttings - they have beautiful deep purple hues and provide excellent relaxing effects. Would you like to know more about our indica selection?";
  }
  if (lowerMessage.includes("sativa") || lowerMessage.includes("energy") || lowerMessage.includes("daytime")) {
    return "Sativa strains are excellent for daytime use! Our Green Crack cuttings are very popular - they provide clean, energizing effects perfect for staying active. Check out our sativa section for more energizing options!";
  }
  if (lowerMessage.includes("hybrid") || lowerMessage.includes("balanced")) {
    return "Hybrid strains offer the best of both worlds! Our Blue Dream seedlings are a customer favorite - they provide a nice balanced effect with a sweet berry aroma. Perfect for new growers too!";
  }
  if (lowerMessage.includes("beginner") || lowerMessage.includes("new") || lowerMessage.includes("first time")) {
    return "Welcome to cannabis cultivation! For beginners, I'd recommend starting with our hardy seedlings like Blue Dream or Northern Lights. They're forgiving plants and grow well in most conditions. Would you like some growing tips?";
  }
  if (lowerMessage.includes("growing") || lowerMessage.includes("tips") || lowerMessage.includes("how to")) {
    return "I'd be happy to share some growing tips! The key factors are proper lighting (18-24 hours for vegetative growth), good drainage, pH between 6.0-7.0, and consistent watering. What specific aspect of growing would you like to know more about?";
  }
  if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("expensive")) {
    return "Our prices are competitive and reflect the quality of our genetics! Cuttings range from $25-30 and seedlings from $15-20. We also offer safe delivery or pickup from our secure locations. What's your budget range?";
  }
  if (lowerMessage.includes("delivery") || lowerMessage.includes("pickup") || lowerMessage.includes("location")) {
    return "We offer both safe delivery and pickup options! For pickup, we have 6 secure locations including Downtown Mall, Riverside Park, and Metro Station. All meetings are at safe, public locations. Would you prefer delivery or pickup?";
  }
  return "Thanks for your question! I'm here to help with anything about our cannabis plants, strains, growing tips, or ordering. What specific information can I provide for you today?";
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  // base: '/ganjagarden-website/', // Temporarily commented out
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
