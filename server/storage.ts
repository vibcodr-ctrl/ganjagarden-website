import { 
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Contact,
  type InsertContact,
  type ChatSession,
  type InsertChatSession,
  type ChatMessage,
  type InsertChatMessage,
  type AdminUser,
  type InsertAdminUser,
  type SiteContent,
  type InsertSiteContent,
  type Image,
  type InsertImage
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  users, products, orders, orderItems, contacts, 
  chatSessions, chatMessages, adminUsers, siteContent, images
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: string, stock: number): Promise<Product | undefined>;
  
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Chat session operations
  createChatSession(insertSession: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  updateChatSessionStatus(id: string, status: string, adminId?: string): Promise<ChatSession>;

  // Chat message operations
  createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Admin user operations
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  updateAdminLastLogin(id: string): Promise<void>;
  
  // Product management operations
  updateProduct(id: string, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<void>;
  
  // Site content operations
  getAllSiteContent(): Promise<SiteContent[]>;
  getSiteContentByKey(key: string): Promise<SiteContent | undefined>;
  createSiteContent(content: InsertSiteContent): Promise<SiteContent>;
  updateSiteContent(id: string, content: InsertSiteContent): Promise<SiteContent | undefined>;
  
  // Image operations
  getAllImages(): Promise<Image[]>;
  createImage(image: InsertImage): Promise<Image>;
  deleteImage(id: string): Promise<void>;
  
  // Order management operations
  getAllOrders(): Promise<Order[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contacts = new Map();
    
    // No sample products - products will be added through admin interface
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProductStock(id: string, stock: number): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (product) {
      const updatedProduct = { ...product, stock };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Chat session operations
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      id: randomUUID(),
      ...insertSession,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // For MemStorage, we'll store in memory (in a real app this would use database)
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    // Placeholder implementation
    return undefined;
  }

  async updateChatSessionStatus(id: string, status: string, adminId?: string): Promise<ChatSession> {
    // Placeholder implementation
    throw new Error("Not implemented");
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const message: ChatMessage = {
      id: randomUUID(),
      ...insertMessage,
      createdAt: new Date(),
    };
    // For MemStorage, we'll store in memory (in a real app this would use database)
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    // Placeholder implementation
    return [];
  }

  // Admin user operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    ) as AdminUser | undefined;
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const id = randomUUID();
    const user: AdminUser = { ...adminUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() };
      this.users.set(id, updatedUser);
    }
  }

  // Product management operations
  async updateProduct(id: string, product: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (existingProduct) {
      const updatedProduct = { ...existingProduct, ...product };
      this.products.set(id, updatedProduct);
      return updatedProduct;
    }
    return undefined;
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Site content operations
  async getAllSiteContent(): Promise<SiteContent[]> {
    return Array.from(this.products.values()).map(product => ({
      id: product.id,
      key: product.name,
      value: product.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.name === key,
    ) as SiteContent | undefined;
  }

  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const id = randomUUID();
    const newContent: SiteContent = {
      id,
      ...content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, newContent as Product); // Store as Product for now
    return newContent;
  }

  async updateSiteContent(id: string, content: InsertSiteContent): Promise<SiteContent | undefined> {
    const existingContent = this.products.get(id);
    if (existingContent) {
      const updatedContent = { ...existingContent, ...content };
      this.products.set(id, updatedContent as Product); // Store as Product for now
      return updatedContent as SiteContent;
    }
    return undefined;
  }

  // Image operations
  async getAllImages(): Promise<Image[]> {
    return Array.from(this.products.values()).map(product => ({
      id: product.id,
      url: product.imageUrl,
      createdAt: new Date(),
    }));
  }

  async createImage(image: InsertImage): Promise<Image> {
    const id = randomUUID();
    const newImage: Image = {
      id,
      ...image,
      createdAt: new Date(),
    };
    this.products.set(id, newImage as Product); // Store as Product for now
    return newImage;
  }

  async deleteImage(id: string): Promise<void> {
    this.products.delete(id);
  }

  // Order management operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProductStock(id: string, stock: number): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set({ stock })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  // Chat session operations
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db.insert(chatSessions).values(insertSession).returning();
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session;
  }

  async updateChatSessionStatus(id: string, status: string, adminId?: string): Promise<ChatSession> {
    const [session] = await db.update(chatSessions)
      .set({ status, adminId, updatedAt: new Date() })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.createdAt);
  }

  // Admin user operations
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin;
  }

  async createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(adminUser).returning();
    return admin;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    await db.update(adminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(adminUsers.id, id));
  }

  // Product management operations
  async updateProduct(id: string, product: InsertProduct): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Site content operations
  async getAllSiteContent(): Promise<SiteContent[]> {
    return await db.select().from(siteContent);
  }

  async getSiteContentByKey(key: string): Promise<SiteContent | undefined> {
    const [content] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return content;
  }

  async createSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    const [newContent] = await db.insert(siteContent).values(content).returning();
    return newContent;
  }

  async updateSiteContent(id: string, content: InsertSiteContent): Promise<SiteContent | undefined> {
    const [updatedContent] = await db.update(siteContent)
      .set(content)
      .where(eq(siteContent.id, id))
      .returning();
    return updatedContent;
  }

  // Image operations
  async getAllImages(): Promise<Image[]> {
    return await db.select().from(images);
  }

  async createImage(image: InsertImage): Promise<Image> {
    const [newImage] = await db.insert(images).values(image).returning();
    return newImage;
  }

  async deleteImage(id: string): Promise<void> {
    await db.delete(images).where(eq(images.id, id));
  }

  // Order management operations
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
}

export const storage = new DatabaseStorage();

// No sample products initialization - products will be added through admin interface
