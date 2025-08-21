import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  category: text("category").notNull(), // 'cutting' or 'seedling'
  imageUrl: text("image_url").notNull(),
  strain: text("strain"),
  genetics: text("genetics"), // indica, sativa, hybrid
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  
  // Enhanced product details for popup
  detailedDescription: text("detailed_description"), // Full description for popup
  thcContent: text("thc_content"), // THC percentage range
  cbdContent: text("cbd_content"), // CBD percentage range
  floweringTime: text("flowering_time"), // e.g., "8-10 weeks"
  yieldPotential: text("yield_potential"), // e.g., "400-600g/m²"
  difficultyLevel: text("difficulty_level"), // beginner, intermediate, advanced
  growingMedium: text("growing_medium"), // soil, hydroponic, coco
  climate: text("climate"), // indoor, outdoor, greenhouse
  effects: text("effects"), // e.g., "Euphoric, Creative, Relaxed"
  medicalBenefits: text("medical_benefits"), // e.g., "Pain relief, Anxiety, Sleep"
  careInstructions: text("care_instructions"), // Watering, nutrients, lighting
  additionalImages: text("additional_images"), // JSON array of image URLs
  
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  deliveryAddress: text("delivery_address"),
  pickupLocation: text("pickup_location"),
  deliveryType: text("delivery_type").notNull(), // 'delivery' or 'pickup'
  total: real("total").notNull(),
  status: text("status").notNull().default('pending'), // pending, confirmed, delivered, cancelled
  items: text("items"), // JSON string for order items
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  orderType: text("order_type"),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Chat sessions for the shop assistant
export const chatSessions = sqliteTable("chat_sessions", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  chatType: text("chat_type").notNull(), // 'ai' or 'admin'
  customerId: text("customer_id"), // Optional, for tracking returning customers
  status: text("status").default("active"), // active, ended, admin_active
  adminId: text("admin_id"), // When admin takes over
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

// Enhanced chat messages for shop assistant
export const chatMessages = sqliteTable("chat_messages", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  sessionId: text("session_id").notNull().references(() => chatSessions.id),
  content: text("content").notNull(),
  sender: text("sender").notNull(), // 'customer', 'ai', 'admin'
  messageType: text("message_type").default("text"), // text, image, system
  imageUrl: text("image_url"), // For image messages
  metadata: text("metadata"), // JSON for additional data (AI confidence, search results, etc.)
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Knowledge base for AI training
export const knowledgeBase = sqliteTable("knowledge_base", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  problemType: text("problem_type").notNull(), // pest, disease, nutrient, environment
  symptoms: text("symptoms"), // JSON array of symptoms
  causes: text("causes"), // JSON array of causes
  solutions: text("solutions"), // JSON array of solutions
  prevention: text("prevention"), // Prevention tips
  imageUrls: text("image_urls"), // JSON array of image URLs
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  uploadedBy: text("uploaded_by").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Special orders from chat
export const specialOrders = sqliteTable("special_orders", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  chatSessionId: text("chat_session_id").references(() => chatSessions.id),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  requestDetails: text("request_details").notNull(),
  requestedQuantity: integer("requested_quantity"),
  requestedStrain: text("requested_strain"),
  requestedDate: text("requested_date"), // ISO date string
  status: text("status").notNull().default('pending'), // pending, confirmed, rejected, completed
  adminNotes: text("admin_notes"),
  totalPrice: real("total_price"),
  adminId: text("admin_id").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// API usage tracking for cost management
export const apiUsage = sqliteTable("api_usage", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  apiType: text("api_type").notNull(), // 'gemini', 'google_search'
  endpoint: text("endpoint").notNull(),
  tokensUsed: integer("tokens_used"),
  cost: real("cost"),
  date: text("date").notNull(), // YYYY-MM-DD format
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Admin users table
export const adminUsers = sqliteTable("admin_users", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default('admin'), // admin, super_admin
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  lastLogin: integer("last_login", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Content management table for dynamic website content
export const siteContent = sqliteTable("site_content", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  key: text("key").notNull().unique(), // e.g., 'hero_title', 'about_text', 'contact_info'
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull().default('text'), // text, html, json
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  orderIndex: integer("order_index").default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Image management table
export const images = sqliteTable("images", {
  id: text("id").primaryKey().default(sql`(hex(randomblob(4)))`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  category: text("category"), // product, hero, gallery, etc.
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  uploadedBy: text("uploaded_by").references(() => adminUsers.id),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// Relations for chat system
export const chatSessionsRelations = relations(chatSessions, ({ many }) => ({
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  session: one(chatSessions, {
    fields: [chatMessages.sessionId],
    references: [chatSessions.id],
  }),
}));

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpecialOrderSchema = createInsertSchema(specialOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type SiteContent = typeof siteContent.$inferSelect;

export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;

export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;

export type InsertSpecialOrder = z.infer<typeof insertSpecialOrderSchema>;
export type SpecialOrder = typeof specialOrders.$inferSelect;

export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;
export type ApiUsage = typeof apiUsage.$inferSelect;
