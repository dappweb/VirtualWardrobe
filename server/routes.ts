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

  // 查询用户代币余额
  app.get("/api/wallet/balance", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const balance = await storage.getUserTokenBalance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ error: "获取代币余额失败" });
    }
  });
  
  // 充值代币（演示用途）
  app.post("/api/wallet/recharge", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      const schema = z.object({
        amount: z.number().positive(),
      });
      
      const { amount } = schema.parse(req.body);
      const user = await storage.updateUserTokenBalance(userId, amount);
      
      if (!user) {
        return res.status(404).json({ error: "找不到用户" });
      }
      
      res.json({ 
        success: true, 
        balance: user.tokenBalance,
        message: `已成功充值 ${amount} 代币` 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "数据格式无效", details: error.errors });
      }
      res.status(500).json({ error: "充值失败" });
    }
  });
  
  // Purchase Asset API - 使用虚拟代币
  app.post("/api/assets/:id/purchase", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const assetId = parseInt(req.params.id);
      const userId = req.user!.id;
      
      // 确保用户是普通买家账户
      if (req.user!.role !== 'buyer') {
        return res.status(403).json({ error: "只有买家账户可以购买资产" });
      }
      
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
      
      // 使用虚拟代币购买资产
      try {
        const result = await storage.purchaseAsset(userId, assetId);
        if (!result) {
          return res.status(500).json({ error: "购买失败" });
        }
        
        const { userAsset, user } = result;
        
        res.status(201).json({ 
          success: true, 
          userAsset,
          balance: user.tokenBalance,
          message: `恭喜您成功购买了 ${asset.name}` 
        });
      } catch (e: any) {
        return res.status(400).json({ error: e.message || "购买资产失败" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "数据格式无效", details: error.errors });
      }
      res.status(500).json({ error: "Failed to purchase asset" });
    }
  });

  // ===== 租户用户API =====
  
  // 注册为租户用户
  app.post("/api/tenant/register", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      
      // 更新用户为租户角色
      const updateSchema = z.object({
        companyName: z.string(),
        contactPerson: z.string(),
        phoneNumber: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        website: z.string().url().optional(),
        contactInfo: z.string().optional(),
        businessLicense: z.string().optional(),
      });
      
      const validatedData = updateSchema.parse(req.body);
      
      const updatedUser = await storage.updateUser(userId, {
        role: 'tenant',
        verificationStatus: 'pending',
        contactInfo: validatedData.contactInfo || `${validatedData.contactPerson} - ${validatedData.phoneNumber || req.user!.email}`,
        metadata: {
          companyName: validatedData.companyName,
          contactPerson: validatedData.contactPerson,
          phoneNumber: validatedData.phoneNumber,
          address: validatedData.address,
          website: validatedData.website,
          businessLicense: validatedData.businessLicense,
        },
      });
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.status(201).json({ success: true, user: updatedUser });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "数据格式无效", details: error.errors });
      }
      res.status(500).json({ error: "租户注册失败" });
    }
  });
  
  // 租户创建品牌
  app.post("/api/tenant/brand", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      
      // 确保用户是已验证的租户
      if (req.user!.role !== 'tenant' || req.user!.verificationStatus !== 'verified') {
        return res.status(403).json({ error: "只有已验证的租户账户可以创建品牌" });
      }
      
      // 检查租户是否已有关联品牌
      const existingBrand = await storage.getBrandByTenant(userId);
      if (existingBrand) {
        return res.status(409).json({ error: "您已拥有一个关联品牌", brand: existingBrand });
      }
      
      // 验证并创建品牌
      const brandSchema = z.object({
        name: z.string(),
        description: z.string(),
        shortDescription: z.string().optional(),
        logoUrl: z.string().url().optional(),
        coverImageUrl: z.string().url().optional(),
      });
      
      const validatedData = brandSchema.parse(req.body);
      
      const brand = await storage.createBrand({
        ...validatedData,
        activeAssets: 0,
        floorPrice: 0,
        volume: 0,
      });
      
      // 更新用户关联品牌ID
      await storage.updateUser(userId, {
        brandId: brand.id,
      });
      
      res.status(201).json({ success: true, brand });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "数据格式无效", details: error.errors });
      }
      res.status(500).json({ error: "品牌创建失败" });
    }
  });
  
  // 租户发行资产
  app.post("/api/tenant/assets", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      const userId = req.user!.id;
      
      // 确保用户是已验证的租户
      if (req.user!.role !== 'tenant' || req.user!.verificationStatus !== 'verified') {
        return res.status(403).json({ error: "只有已验证的租户账户可以发行资产" });
      }
      
      // 获取租户关联的品牌
      const brand = await storage.getBrandByTenant(userId);
      if (!brand) {
        return res.status(404).json({ error: "找不到您的关联品牌，请先创建品牌" });
      }
      
      // 验证资产数据
      const assetSchema = z.object({
        name: z.string(),
        description: z.string(),
        price: z.number().positive(),
        imageUrl: z.string().url(),
        category: z.string().optional(),
        limited: z.boolean().optional(),
        editionNumber: z.number().positive().optional(),
        totalEditions: z.number().positive().optional(),
        tokenId: z.string().optional(),
        blockchain: z.string().optional(),
      });
      
      const validatedData = assetSchema.parse(req.body);
      
      // 创建资产
      const asset = await storage.createAsset({
        ...validatedData,
        brandId: brand.id,
      });
      
      res.status(201).json({ success: true, asset });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "数据格式无效", details: error.errors });
      }
      res.status(500).json({ error: "资产发行失败" });
    }
  });
  
  // ===== 管理员API =====
  
  // 获取所有用户 (需要管理员权限)
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      // 确保用户是管理员
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: "只有管理员账户可以访问此API" });
      }
      
      // 根据角色过滤用户
      const role = req.query.role as string | undefined;
      
      let users;
      if (role) {
        users = await storage.getUsersByRole(role);
      } else {
        users = Array.from((await storage.getUsersByRole('buyer')).concat(
          await storage.getUsersByRole('tenant'),
          await storage.getUsersByRole('admin')
        ));
      }
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "获取用户列表失败" });
    }
  });
  
  // 公开的演示账号列表 API，用于展示不同角色的账号
  app.get("/api/demo-accounts", async (req, res) => {
    try {
      // 获取所有角色的演示账号
      const buyers = await storage.getUsersByRole('buyer');
      const tenants = await storage.getUsersByRole('tenant');
      const admins = await storage.getUsersByRole('admin');
      
      // 过滤敏感信息，只保留必要字段
      const processDemoAccount = (user: any) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        displayName: user.displayName || user.username,
        avatar: user.avatar,
        verificationStatus: user.verificationStatus,
        walletAddress: user.walletAddress ? `${user.walletAddress.substring(0, 8)}...` : null,
        loginUrl: "/auth"
      });
      
      const demoAccounts = {
        buyer: buyers.length > 0 ? processDemoAccount(buyers[0]) : null,
        tenant: tenants.length > 0 ? processDemoAccount(tenants[0]) : null,
        admin: admins.length > 0 ? processDemoAccount(admins[0]) : null,
        note: "使用以下账号访问系统，所有账号共享密码: buyerpass/tenantpass/adminpass",
        loginUrl: "/auth"
      };
      
      res.json(demoAccounts);
    } catch (error) {
      res.status(500).json({ error: "获取演示账号信息失败" });
    }
  });
  
  // 验证租户
  app.put("/api/admin/tenant/:id/verify", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      // 确保用户是管理员
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: "只有管理员账户可以访问此API" });
      }
      
      const tenantId = parseInt(req.params.id);
      const { verificationStatus } = req.body;
      
      if (!['pending', 'verified', 'rejected'].includes(verificationStatus)) {
        return res.status(400).json({ error: "无效的验证状态" });
      }
      
      const tenant = await storage.verifyTenant(tenantId, verificationStatus);
      
      if (!tenant) {
        return res.status(404).json({ error: "找不到指定租户或不是租户账户" });
      }
      
      res.json({ success: true, tenant });
    } catch (error) {
      res.status(500).json({ error: "租户验证失败" });
    }
  });
  
  // 设置用户角色
  app.put("/api/admin/user/:id/role", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      // 确保用户是管理员
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ error: "只有管理员账户可以访问此API" });
      }
      
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!['buyer', 'tenant', 'admin'].includes(role)) {
        return res.status(400).json({ error: "无效的用户角色" });
      }
      
      const user = await storage.updateUserRole(userId, role);
      
      if (!user) {
        return res.status(404).json({ error: "找不到指定用户" });
      }
      
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "用户角色更新失败" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
