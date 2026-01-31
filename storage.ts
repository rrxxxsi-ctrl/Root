import { db } from "./db";
import {
  users,
  products,
  plans,
  orders,
  type User,
  type ProductWithPlans,
  type CreateOrderRequest,
  type Order
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(username: string, email?: string): Promise<User>;
  getProducts(): Promise<ProductWithPlans[]>;
  getProduct(id: number): Promise<ProductWithPlans | undefined>;
  createOrder(userId: number, order: CreateOrderRequest): Promise<Order>;
  getUserOrders(userId: number): Promise<(Order & { product: any, plan: any })[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(username: string, email?: string): Promise<User> {
    const [user] = await db.insert(users).values({ username, email }).returning();
    return user;
  }

  async getProducts(): Promise<ProductWithPlans[]> {
    const allProducts = await db.query.products.findMany({
      with: {
        plans: true
      },
      orderBy: desc(products.createdAt)
    });
    return allProducts;
  }

  async getProduct(id: number): Promise<ProductWithPlans | undefined> {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        plans: true
      }
    });
  }

  async createOrder(userId: number, order: CreateOrderRequest): Promise<Order> {
    const [newOrder] = await db.insert(orders).values({
      userId,
      productId: order.productId,
      planId: order.planId,
      userEmail: order.userEmail,
      status: "pending"
    }).returning();
    return newOrder;
  }

  async getUserOrders(userId: number): Promise<(Order & { product: any, plan: any })[]> {
    return await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      with: {
        product: true,
        plan: true
      },
      orderBy: desc(orders.createdAt)
    });
  }
}

export const storage = new DatabaseStorage();