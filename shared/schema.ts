import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { nanoid } from 'nanoid';

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("authority"),
});

export const junctions = sqliteTable("junctions", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  location: text("location").notNull(), // JSON string {lat: number, lng: number}
  vehicleCount: integer("vehicle_count").notNull().default(0),
  avgSpeed: real("avg_speed").notNull().default(0),
  greenTime: integer("green_time").notNull().default(45),
  redTime: integer("red_time").notNull().default(30),
  congestionLevel: text("congestion_level").notNull().default("low"), // low, medium, high
  status: text("status").notNull().default("active"),
  lastUpdated: integer("last_updated", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const signalTimings = sqliteTable("signal_timings", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  junctionId: text("junction_id").references(() => junctions.id).notNull(),
  currentPhase: text("current_phase").notNull().default("green"), // green, red, yellow
  phaseStartTime: integer("phase_start_time", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  phaseEndTime: integer("phase_end_time", { mode: "timestamp" }),
  aiOptimized: integer("ai_optimized", { mode: "boolean" }).notNull().default(false),
});

export const aiRecommendations = sqliteTable("ai_recommendations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  junctionId: text("junction_id").references(() => junctions.id).notNull(),
  recommendation: text("recommendation").notNull(),
  confidenceScore: real("confidence_score").notNull(),
  applied: integer("applied", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
});

export const trafficAnalytics = sqliteTable("traffic_analytics", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  date: integer("date", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`),
  avgWaitTime: real("avg_wait_time").notNull(),
  avgCommuteTime: real("avg_commute_time").notNull(),
  co2Emissions: real("co2_emissions").notNull(),
  fuelConsumption: real("fuel_consumption").notNull(),
  aiMode: integer("ai_mode", { mode: "boolean" }).notNull().default(true),
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
