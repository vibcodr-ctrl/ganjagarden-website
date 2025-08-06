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
  type InsertContact
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export const storage = new MemStorage();
