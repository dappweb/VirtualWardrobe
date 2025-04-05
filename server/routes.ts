import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Update user (for wallet connection)
  app.put("/api/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const updateSchema = z.object({
        walletAddress: z.string(),
      });
      
      const validatedData = updateSchema.parse(req.body);
      const updatedUser = await storage.updateUser(userId, {
        walletAddress: validatedData.walletAddress
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data format", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Brands API
  app.get("/api/brands", async (req, res) => {
    try {
      const brands = await storage.getBrands();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brands" });
    }
  });

  app.get("/api/brands/:id", async (req, res) => {
    try {
      const brandId = parseInt(req.params.id);
      const brand = await storage.getBrand(brandId);
      
      if (!brand) {
        return res.status(404).json({ error: "Brand not found" });
      }
      
      // Get assets for this brand
      const assets = await storage.getAssetsByBrand(brandId);
      
      res.json({ ...brand, assets });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch brand" });
    }
  });

  // Assets API
  app.get("/api/assets", async (req, res) => {
    try {
      const brandId = req.query.brandId ? parseInt(req.query.brandId as string) : undefined;
      const category = req.query.category as string | undefined;
      
      const filters: { brandId?: number, category?: string } = {};
      if (brandId) filters.brandId = brandId;
      if (category) filters.category = category;
      
      const assets = await storage.getAssets(filters);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assets" });
    }
  });

  app.get("/api/assets/:id", async (req, res) => {
    try {
      const assetId = parseInt(req.params.id);
      const asset = await storage.getAsset(assetId);
      
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      res.json(asset);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch asset" });
    }
  });

  // User Assets API
  app.get("/api/user/assets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const assets = await storage.getUserAssetDetails(userId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user assets" });
    }
  });

  // Purchase Asset API
  app.post("/api/assets/:id/purchase", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const assetId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      const asset = await storage.getAsset(assetId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      
      // Check if user already owns this asset
      const userAssets = await storage.getUserAssets(userId);
      const alreadyOwned = userAssets.some(ua => ua.assetId === assetId);
      
      if (alreadyOwned) {
        return res.status(400).json({ error: "You already own this asset" });
      }
      
      // Process transaction (simplified for MVP)
      const { transactionHash } = req.body;
      
      const userAsset = await storage.createUserAsset({
        userId,
        assetId,
        purchasePrice: asset.price,
        transactionHash,
      });
      
      res.status(201).json({ success: true, userAsset });
    } catch (error) {
      res.status(500).json({ error: "Failed to purchase asset" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
