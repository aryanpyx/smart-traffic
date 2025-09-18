import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("authority"),
});

export const junctions = pgTable("junctions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: jsonb("location").notNull(), // {lat: number, lng: number}
  vehicleCount: integer("vehicle_count").notNull().default(0),
  avgSpeed: decimal("avg_speed", { precision: 5, scale: 2 }).notNull().default("0"),
  greenTime: integer("green_time").notNull().default(45),
  redTime: integer("red_time").notNull().default(30),
  congestionLevel: text("congestion_level").notNull().default("low"), // low, medium, high
  status: text("status").notNull().default("active"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const signalTimings = pgTable("signal_timings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  junctionId: varchar("junction_id").references(() => junctions.id).notNull(),
  currentPhase: text("current_phase").notNull().default("green"), // green, red, yellow
  phaseStartTime: timestamp("phase_start_time").defaultNow(),
  phaseEndTime: timestamp("phase_end_time"),
  aiOptimized: boolean("ai_optimized").notNull().default(false),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  junctionId: varchar("junction_id").references(() => junctions.id).notNull(),
  recommendation: text("recommendation").notNull(),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).notNull(),
  applied: boolean("applied").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trafficAnalytics = pgTable("traffic_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").defaultNow(),
  avgWaitTime: decimal("avg_wait_time", { precision: 5, scale: 2 }).notNull(),
  avgCommuteTime: decimal("avg_commute_time", { precision: 5, scale: 2 }).notNull(),
  co2Emissions: decimal("co2_emissions", { precision: 8, scale: 2 }).notNull(),
  fuelConsumption: decimal("fuel_consumption", { precision: 8, scale: 2 }).notNull(),
  aiMode: boolean("ai_mode").notNull().default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  role: true,
});

export const insertJunctionSchema = createInsertSchema(junctions).omit({
  id: true,
  lastUpdated: true,
});

export const insertSignalTimingSchema = createInsertSchema(signalTimings).omit({
  id: true,
  phaseStartTime: true,
});

export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({
  id: true,
  createdAt: true,
});

export const insertTrafficAnalyticsSchema = createInsertSchema(trafficAnalytics).omit({
  id: true,
  date: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertJunction = z.infer<typeof insertJunctionSchema>;
export type Junction = typeof junctions.$inferSelect;
export type InsertSignalTiming = z.infer<typeof insertSignalTimingSchema>;
export type SignalTiming = typeof signalTimings.$inferSelect;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type InsertTrafficAnalytics = z.infer<typeof insertTrafficAnalyticsSchema>;
export type TrafficAnalytics = typeof trafficAnalytics.$inferSelect;
