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
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        imageUrl: "https://images.unsplash.com/photo-1502945015378-0e284ca1a5be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        imageUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
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
        imageUrl: "https://pixabay.com/get/gbaf38ee1ce96b5f55ed858685f8a843bb2355bbd94bc874520aa5f33c948e3147d4d69b45c60ee75b5ee8f20906d5ff81fee28dcce9dab6bf878298e7b2121d7_1280.jpg",
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
        imageUrl: "https://pixabay.com/get/g4cdf6685a189941354c2cf58e3118472561f3427ccddfa00c2e99a7d115a059aa7943eb5d94ced65cc1f77fb200edbe8243afcd0448f660ea1b3f2dd0e3dac44_1280.jpg",
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
        imageUrl: "https://pixabay.com/get/g69707d544690c961fe7b9d1b1f851ad486d7fb39be4d7553d922868f3f6a0d53a2197b79e79d9f26fa210ff5550768e8afaf29595d112e8842d51ffefc147ac7_1280.jpg",
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
        imageUrl: "https://pixabay.com/get/g956d2ff406c9ffecb151492f216720b04bc0b5558f5c5fe1afda5df1fb15709660c34d83f584d6f5d48ab7ef42c0cfbd666ea3d4e09031096ff642921a9142d0_1280.jpg",
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
