import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertJunctionSchema, insertAiRecommendationSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received:', data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
    
    // Send initial data
    ws.send(JSON.stringify({ type: 'connected', message: 'WebSocket connected' }));
  });

  // Broadcast function for real-time updates
  const broadcast = (data: any) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  // Junction routes
  app.get("/api/junctions", async (req, res) => {
    try {
      const junctions = await storage.getAllJunctions();
      res.json(junctions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch junctions" });
    }
  });

  app.get("/api/junctions/:id", async (req, res) => {
    try {
      const junction = await storage.getJunction(req.params.id);
      if (!junction) {
        return res.status(404).json({ message: "Junction not found" });
      }
      res.json(junction);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch junction" });
    }
  });

  app.post("/api/junctions", async (req, res) => {
    try {
      const junctionData = insertJunctionSchema.parse(req.body);
      const junction = await storage.createJunction(junctionData);
      
      // Broadcast new junction to all clients
      broadcast({ type: 'junction_created', data: junction });
      
      res.json(junction);
    } catch (error) {
      res.status(400).json({ message: "Failed to create junction" });
    }
  });

  app.put("/api/junctions/:id", async (req, res) => {
    try {
      const updates = req.body;
      const junction = await storage.updateJunction(req.params.id, updates);
      
      if (!junction) {
        return res.status(404).json({ message: "Junction not found" });
      }
      
      // Broadcast junction update to all clients
      broadcast({ type: 'junction_updated', data: junction });
      
      res.json(junction);
    } catch (error) {
      res.status(400).json({ message: "Failed to update junction" });
    }
  });

  // Signal timing routes
  app.get("/api/signals/:junctionId", async (req, res) => {
    try {
      const signalTiming = await storage.getSignalTiming(req.params.junctionId);
      if (!signalTiming) {
        return res.status(404).json({ message: "Signal timing not found" });
      }
      res.json(signalTiming);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch signal timing" });
    }
  });

  app.put("/api/signals/:junctionId", async (req, res) => {
    try {
      const updates = req.body;
      const signalTiming = await storage.updateSignalTiming(req.params.junctionId, updates);
      
      if (!signalTiming) {
        return res.status(404).json({ message: "Signal timing not found" });
      }
      
      // Broadcast signal timing update to all clients
      broadcast({ type: 'signal_updated', data: signalTiming });
      
      res.json(signalTiming);
    } catch (error) {
      res.status(400).json({ message: "Failed to update signal timing" });
    }
  });

  // AI recommendations routes
  app.get("/api/ai/recommendations", async (req, res) => {
    try {
      const junctionId = req.query.junctionId as string;
      const recommendations = await storage.getAiRecommendations(junctionId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post("/api/ai/recommendations", async (req, res) => {
    try {
      const recommendationData = insertAiRecommendationSchema.parse(req.body);
      const recommendation = await storage.createAiRecommendation(recommendationData);
      
      // Broadcast new recommendation to all clients
      broadcast({ type: 'recommendation_created', data: recommendation });
      
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ message: "Failed to create recommendation" });
    }
  });

  app.put("/api/ai/recommendations/:id/apply", async (req, res) => {
    try {
      const recommendation = await storage.updateAiRecommendation(req.params.id, true);
      
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      // Broadcast recommendation applied to all clients
      broadcast({ type: 'recommendation_applied', data: recommendation });
      
      res.json(recommendation);
    } catch (error) {
      res.status(400).json({ message: "Failed to apply recommendation" });
    }
  });

  // Mock AI prediction endpoint
  app.post("/api/ai/predict", async (req, res) => {
    try {
      const { junctionId } = req.body;
      
      // Simulate AI prediction logic
      const junction = await storage.getJunction(junctionId);
      if (!junction) {
        return res.status(404).json({ message: "Junction not found" });
      }
      
      // Mock AI prediction based on current traffic conditions
      let prediction = "maintain";
      let confidenceScore = 0.85;
      
      if (junction.congestionLevel === "high") {
        prediction = junction.greenTime < 70 ? "extend_green" : "optimize_cycle";
        confidenceScore = 0.92;
      } else if (junction.congestionLevel === "medium") {
        prediction = "reduce_red";
        confidenceScore = 0.87;
      }
      
      res.json({
        junctionId,
        prediction,
        confidenceScore,
        recommendedGreenTime: prediction === "extend_green" ? junction.greenTime + 15 : junction.greenTime,
        recommendedRedTime: prediction === "reduce_red" ? junction.redTime - 10 : junction.redTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "AI prediction failed" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const analytics = await storage.getTrafficAnalytics(limit);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard stats endpoint
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const junctions = await storage.getAllJunctions();
      const analytics = await storage.getTrafficAnalytics(1);
      const recommendations = await storage.getAiRecommendations();
      
      const totalJunctions = junctions.length;
      const avgWaitTime = analytics[0]?.avgWaitTime || "0";
      const trafficFlow = junctions.filter(j => j.congestionLevel === "low").length > junctions.length / 2 ? "Good" : "Poor";
      const aiEfficiency = "+18%"; // Mock efficiency improvement
      
      res.json({
        totalJunctions,
        avgWaitTime: `${avgWaitTime}s`,
        trafficFlow,
        aiEfficiency,
        activeRecommendations: recommendations.filter(r => !r.applied).length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Simulate real-time data updates
  setInterval(() => {
    storage.getAllJunctions().then(junctions => {
      junctions.forEach(async (junction) => {
        // Simulate traffic fluctuations
        const vehicleCountChange = Math.floor(Math.random() * 10) - 5;
        const speedChange = (Math.random() * 4) - 2;
        
        const updatedJunction = await storage.updateJunction(junction.id, {
          vehicleCount: Math.max(0, junction.vehicleCount + vehicleCountChange),
          avgSpeed: parseFloat((Math.max(5, junction.avgSpeed + speedChange)).toFixed(2))
        });
        
        if (updatedJunction) {
          broadcast({ type: 'junction_updated', data: updatedJunction });
        }
      });
    });
  }, 30000); // Update every 30 seconds

  return httpServer;
}
