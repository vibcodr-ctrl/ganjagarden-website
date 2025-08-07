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
  type InsertChatMessage
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  users, products, orders, orderItems, contacts, 
  chatSessions, chatMessages
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
    
    // Initialize with sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: Product[] = [
      // Cuttings
      {
        id: randomUUID(),
        name: "Purple Kush",
        description: "Premium indica cutting with deep purple hues and relaxing effects.",
        price: "25.00",
        stock: 12,
        category: "cutting",
        imageUrl: "https://images.pexels.com/photos/3536257/pexels-photo-3536257.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "Purple Kush",
        genetics: "indica"
      },
      {
        id: randomUUID(),
        name: "Green Crack",
        description: "Energizing sativa cutting perfect for daytime cultivation.",
        price: "30.00",
        stock: 8,
        category: "cutting",
        imageUrl: "https://images.pexels.com/photos/2731663/pexels-photo-2731663.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "Green Crack",
        genetics: "sativa"
      },
      {
        id: randomUUID(),
        name: "OG Kush",
        description: "Classic hybrid cutting with balanced effects and robust growth.",
        price: "28.00",
        stock: 15,
        category: "cutting",
        imageUrl: "https://images.pexels.com/photos/2731667/pexels-photo-2731667.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "OG Kush",
        genetics: "hybrid"
      },
      // Seedlings
      {
        id: randomUUID(),
        name: "Blue Dream",
        description: "Balanced hybrid with sweet berry aroma.",
        price: "15.00",
        stock: 20,
        category: "seedling",
        imageUrl: "https://images.pexels.com/photos/4543134/pexels-photo-4543134.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "Blue Dream",
        genetics: "hybrid"
      },
      {
        id: randomUUID(),
        name: "White Widow",
        description: "Classic strain with resinous white trichomes.",
        price: "18.00",
        stock: 14,
        category: "seedling",
        imageUrl: "https://images.pexels.com/photos/2753946/pexels-photo-2753946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "White Widow",
        genetics: "hybrid"
      },
      {
        id: randomUUID(),
        name: "Sour Diesel",
        description: "Energizing sativa with diesel aroma.",
        price: "20.00",
        stock: 9,
        category: "seedling",
        imageUrl: "https://images.pexels.com/photos/1466335/pexels-photo-1466335.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "Sour Diesel",
        genetics: "sativa"
      },
      {
        id: randomUUID(),
        name: "Northern Lights",
        description: "Pure indica with relaxing effects.",
        price: "16.00",
        stock: 25,
        category: "seedling",
        imageUrl: "https://images.pexels.com/photos/3676962/pexels-photo-3676962.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
        strain: "Northern Lights",
        genetics: "indica"
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
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
}

export const storage = new DatabaseStorage();

// Initialize sample products in database
async function initializeProducts() {
  try {
    const existingProducts = await storage.getProducts();
    if (existingProducts.length === 0) {
      // Sample cannabis products with actual cannabis images
      const sampleProducts = [
        {
          name: "Purple Kush Cutting",
          description: "Premium indica cutting with deep purple hues and relaxing effects.",
          price: "25.00",
          stock: 12,
          category: "cutting",
          imageUrl: "https://images.pexels.com/photos/3536257/pexels-photo-3536257.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "Purple Kush",
          genetics: "indica"
        },
        {
          name: "Green Crack Cutting", 
          description: "Energizing sativa cutting perfect for daytime cultivation.",
          price: "30.00",
          stock: 8,
          category: "cutting",
          imageUrl: "https://images.pexels.com/photos/2731663/pexels-photo-2731663.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "Green Crack",
          genetics: "sativa"
        },
        {
          name: "OG Kush Cutting",
          description: "Classic hybrid cutting with balanced effects and robust growth.",
          price: "28.00", 
          stock: 15,
          category: "cutting",
          imageUrl: "https://images.pexels.com/photos/2731667/pexels-photo-2731667.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "OG Kush",
          genetics: "hybrid"
        },
        {
          name: "Blue Dream Seedling",
          description: "Balanced hybrid with sweet berry aroma.",
          price: "15.00",
          stock: 20,
          category: "seedling",
          imageUrl: "https://images.pexels.com/photos/4543134/pexels-photo-4543134.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "Blue Dream", 
          genetics: "hybrid"
        },
        {
          name: "White Widow Seedling",
          description: "Classic strain with resinous white trichomes.",
          price: "18.00",
          stock: 14,
          category: "seedling",
          imageUrl: "https://images.pexels.com/photos/2753946/pexels-photo-2753946.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "White Widow",
          genetics: "hybrid"
        },
        {
          name: "Sour Diesel Seedling",
          description: "Energizing sativa with diesel aroma.",
          price: "20.00",
          stock: 9,
          category: "seedling", 
          imageUrl: "https://images.pexels.com/photos/1466335/pexels-photo-1466335.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "Sour Diesel",
          genetics: "sativa"
        },
        {
          name: "Northern Lights Seedling",
          description: "Pure indica with relaxing effects.",
          price: "16.00",
          stock: 25,
          category: "seedling",
          imageUrl: "https://images.pexels.com/photos/3676962/pexels-photo-3676962.jpeg?auto=compress&cs=tinysrgb&w=400&h=300",
          strain: "Northern Lights",
          genetics: "indica"
        }
      ];

      for (const product of sampleProducts) {
        await storage.createProduct(product);
      }
      console.log('Sample products initialized in database');
    }
  } catch (error) {
    console.error('Error initializing products:', error);
  }
}

// Initialize products when storage is created
initializeProducts();
