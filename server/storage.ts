import { type User, type InsertUser, type Junction, type InsertJunction, type SignalTiming, type InsertSignalTiming, type AiRecommendation, type InsertAiRecommendation, type TrafficAnalytics, type InsertTrafficAnalytics, users, junctions, signalTimings, aiRecommendations, trafficAnalytics } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Junction methods
  getAllJunctions(): Promise<Junction[]>;
  getJunction(id: string): Promise<Junction | undefined>;
  createJunction(junction: InsertJunction): Promise<Junction>;
  updateJunction(id: string, updates: Partial<Junction>): Promise<Junction | undefined>;
  
  // Signal timing methods
  getSignalTiming(junctionId: string): Promise<SignalTiming | undefined>;
  createSignalTiming(timing: InsertSignalTiming): Promise<SignalTiming>;
  updateSignalTiming(junctionId: string, updates: Partial<SignalTiming>): Promise<SignalTiming | undefined>;
  
  // AI recommendation methods
  getAiRecommendations(junctionId?: string): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  updateAiRecommendation(id: string, applied: boolean): Promise<AiRecommendation | undefined>;
  
  // Analytics methods
  getTrafficAnalytics(limit?: number): Promise<TrafficAnalytics[]>;
  createTrafficAnalytics(analytics: InsertTrafficAnalytics): Promise<TrafficAnalytics>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample data on first run
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    try {
      // Check if admin user already exists
      const existingAdmin = await this.getUserByUsername("admin");
      if (existingAdmin) {
        return; // Data already initialized
      }

      console.log("Initializing database with sample data...");

      // Create admin user
      const adminUser = await this.createUser({
        username: "admin",
        password: "admin123", // In production, this should be hashed
      });

      // Create sample junctions
      const sampleJunctionsData = [
        {
          name: "Main St & Broadway",
          location: JSON.stringify({ lat: 40.7589, lng: -73.9851 }),
          vehicleCount: 42,
          avgSpeed: 35.0,
          greenTime: 45,
          redTime: 30,
          congestionLevel: "low",
          status: "active",
        },
        {
          name: "5th Ave & Park St", 
          location: JSON.stringify({ lat: 40.7614, lng: -73.9776 }),
          vehicleCount: 68,
          avgSpeed: 22.0,
          greenTime: 60,
          redTime: 25,
          congestionLevel: "medium",
          status: "active",
        },
        {
          name: "Oak St & Elm Ave",
          location: JSON.stringify({ lat: 40.7505, lng: -73.9934 }),
          vehicleCount: 95,
          avgSpeed: 12.0,
          greenTime: 75,
          redTime: 20,
          congestionLevel: "high",
          status: "active",
        },
        {
          name: "Center St & 1st Ave",
          location: JSON.stringify({ lat: 40.7282, lng: -73.9942 }),
          vehicleCount: 28,
          avgSpeed: 45.0,
          greenTime: 40,
          redTime: 35,
          congestionLevel: "low",
          status: "active",
        }
      ];

      const createdJunctions = [];
      for (const junctionData of sampleJunctionsData) {
        const junction = await this.createJunction(junctionData);
        createdJunctions.push(junction);

        // Create signal timing for each junction
        await this.createSignalTiming({
          junctionId: junction.id,
          currentPhase: "green",
          phaseEndTime: new Date(Date.now() + junction.greenTime * 1000),
          aiOptimized: true
        });
      }

      // Create sample AI recommendations
      if (createdJunctions.length >= 2) {
        await this.createAiRecommendation({
          junctionId: createdJunctions[2].id, // High congestion junction
          recommendation: "Extend green by 15s",
          confidenceScore: 0.94,
          applied: false
        });

        await this.createAiRecommendation({
          junctionId: createdJunctions[1].id, // Medium congestion junction
          recommendation: "Reduce red by 10s",
          confidenceScore: 0.87,
          applied: false
        });
      }

      // Create sample analytics data
      await this.createTrafficAnalytics({
        avgWaitTime: 45.0,
        avgCommuteTime: 9.8,
        co2Emissions: 1800.0,
        fuelConsumption: 645.0,
        aiMode: true
      });

      console.log("Database initialized successfully with sample data");
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Junction methods
  async getAllJunctions(): Promise<Junction[]> {
    return await db.select().from(junctions);
  }

  async getJunction(id: string): Promise<Junction | undefined> {
    const [junction] = await db.select().from(junctions).where(eq(junctions.id, id));
    return junction || undefined;
  }

  async createJunction(insertJunction: InsertJunction): Promise<Junction> {
    const [junction] = await db.insert(junctions).values(insertJunction).returning();
    return junction;
  }

  async updateJunction(id: string, updates: Partial<Junction>): Promise<Junction | undefined> {
    const [junction] = await db
      .update(junctions)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(junctions.id, id))
      .returning();
    return junction || undefined;
  }

  // Signal timing methods
  async getSignalTiming(junctionId: string): Promise<SignalTiming | undefined> {
    const [timing] = await db.select().from(signalTimings).where(eq(signalTimings.junctionId, junctionId));
    return timing || undefined;
  }

  async createSignalTiming(insertTiming: InsertSignalTiming): Promise<SignalTiming> {
    const [timing] = await db.insert(signalTimings).values(insertTiming).returning();
    return timing;
  }

  async updateSignalTiming(junctionId: string, updates: Partial<SignalTiming>): Promise<SignalTiming | undefined> {
    const [timing] = await db
      .update(signalTimings)
      .set(updates)
      .where(eq(signalTimings.junctionId, junctionId))
      .returning();
    return timing || undefined;
  }

  // AI recommendation methods
  async getAiRecommendations(junctionId?: string): Promise<AiRecommendation[]> {
    if (junctionId) {
      return await db.select().from(aiRecommendations).where(eq(aiRecommendations.junctionId, junctionId));
    } else {
      return await db.select().from(aiRecommendations);
    }
  }

  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const [recommendation] = await db.insert(aiRecommendations).values(insertRecommendation).returning();
    return recommendation;
  }

  async updateAiRecommendation(id: string, applied: boolean): Promise<AiRecommendation | undefined> {
    const [recommendation] = await db
      .update(aiRecommendations)
      .set({ applied })
      .where(eq(aiRecommendations.id, id))
      .returning();
    return recommendation || undefined;
  }

  // Analytics methods
  async getTrafficAnalytics(limit: number = 30): Promise<TrafficAnalytics[]> {
    return await db
      .select()
      .from(trafficAnalytics)
      .orderBy(desc(trafficAnalytics.date))
      .limit(limit);
  }

  async createTrafficAnalytics(insertAnalytics: InsertTrafficAnalytics): Promise<TrafficAnalytics> {
    const [analytics] = await db.insert(trafficAnalytics).values(insertAnalytics).returning();
    return analytics;
  }
}

export const storage = new DatabaseStorage();
