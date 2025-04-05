import {
  users,
  brands,
  assets,
  userAssets,
  type User,
  type InsertUser,
  type Brand,
  type InsertBrand,
  type Asset,
  type InsertAsset,
  type UserAsset,
  type InsertUserAsset,
  type AssetWithBrand
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // 用户角色相关
  getUsersByRole(role: string): Promise<User[]>; // 按角色获取用户
  updateUserRole(userId: number, role: string): Promise<User | undefined>; // 更新用户角色
  verifyTenant(userId: number, verificationStatus: string): Promise<User | undefined>; // 验证租户
  
  // Brands
  getBrands(): Promise<Brand[]>;
  getBrand(id: number): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  getBrandByTenant(userId: number): Promise<Brand | undefined>; // 根据租户ID获取品牌
  
  // Assets
  getAssets(filters?: Partial<{ brandId: number, category: string }>): Promise<AssetWithBrand[]>;
  getAsset(id: number): Promise<AssetWithBrand | undefined>;
  getAssetsByBrand(brandId: number): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: number, asset: Partial<InsertAsset>): Promise<Asset | undefined>;
  
  // User Assets
  getUserAssets(userId: number): Promise<UserAsset[]>;
  getUserAssetDetails(userId: number): Promise<AssetWithBrand[]>;
  createUserAsset(userAsset: InsertUserAsset): Promise<UserAsset>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private brands: Map<number, Brand>;
  private assets: Map<number, Asset>;
  private userAssets: Map<number, UserAsset>;
  
  currentUserId: number;
  currentBrandId: number;
  currentAssetId: number;
  currentUserAssetId: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.brands = new Map();
    this.assets = new Map();
    this.userAssets = new Map();
    
    this.currentUserId = 1;
    this.currentBrandId = 1;
    this.currentAssetId = 1;
    this.currentUserAssetId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed some initial brands and assets
    this.seedData();
  }

  private seedData() {
    // Seed brands
    const csqBrand = this.createBrand({
      name: "创思奇 (CSQ)",
      description: "Pioneering the future of fashion through innovative designs and bold cultural statements. CSQ represents the cutting edge of fashion technology and artistic expression, blending Eastern and Western aesthetics into harmonious, forward-thinking collections.",
      shortDescription: "Fashion Innovation Pioneer",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      activeAssets: 12,
      floorPrice: 2000,
      volume: 24500
    });
    
    const modaBrand = this.createBrand({
      name: "MODA Collective",
      description: "Combining sustainable practices with luxury aesthetics to create timeless fashion assets. MODA Collective works exclusively with eco-friendly materials and ethical production methods, creating luxury items that are as kind to the planet as they are beautiful to wear.",
      shortDescription: "Sustainable Luxury Fashion",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
      activeAssets: 8,
      floorPrice: 1800,
      volume: 15200
    });
    
    const avntBrand = this.createBrand({
      name: "AVNT Studio",
      description: "Pushing boundaries with experimental designs that blend fashion, art and digital innovation. AVNT Studio consistently challenges conventional fashion norms, creating avant-garde pieces that function as wearable art and collectible cultural artifacts.",
      shortDescription: "Avant-garde Fashion Art",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1537832816519-689ad163238b",
      activeAssets: 5,
      floorPrice: 3500,
      volume: 10500
    });
    
    // Seed assets
    this.createAsset({
      name: "Modern Minimalist Jacket",
      description: "A masterpiece of modern minimalist design, this jacket represents 创思奇's signature blend of Eastern and Western aesthetics. The clean lines and subtle detailing create a versatile piece that transcends seasons and trends. Each jacket is individually numbered and comes with a certificate of authenticity.",
      price: 3200,
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      brandId: 1,
      category: "Apparel",
      limited: true,
      editionNumber: 4,
      totalEditions: 20,
      tokenId: "0x3a2b...7d9e",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "Echo Handbag",
      description: "The Echo Handbag exemplifies MODA Collective's commitment to sustainable luxury. Crafted from innovative eco-friendly materials, this versatile accessory features clean lines and thoughtful compartments. Its distinctive silhouette makes it both a practical everyday item and a statement piece.",
      price: 1800,
      imageUrl: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
      brandId: 2,
      category: "Accessories",
      limited: true,
      editionNumber: 7,
      totalEditions: 15,
      tokenId: "0x4c8d...2f4a",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "Avant Boots",
      description: "A true expression of AVNT Studio's boundary-pushing aesthetic, these statement boots blend architectural elements with functional design. The striking silhouette features unexpected textures and innovative materials, creating footwear that transcends mere fashion to become wearable art.",
      price: 4500,
      imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
      brandId: 3,
      category: "Footwear",
      limited: true,
      editionNumber: 2,
      totalEditions: 10,
      tokenId: "0x7f1e...9c3b",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "Urban Sneakers",
      description: "CSQ's Urban Sneakers represent the perfect fusion of streetwear influence and high-fashion execution. These limited-edition sneakers feature premium materials, distinctive colorways, and subtle branding elements that make them instantly recognizable to fashion connoisseurs.",
      price: 2800,
      imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
      brandId: 1,
      category: "Footwear",
      limited: true,
      editionNumber: 9,
      totalEditions: 25,
      tokenId: "0x5e2f...8a7c",
      blockchain: "Ethereum"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // 用户角色相关的方法
  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.role === role,
    );
  }
  
  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, role };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async verifyTenant(userId: number, verificationStatus: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // 只有租户类型的用户可以被验证
    if (user.role !== 'tenant') return undefined;
    
    const updatedUser = { 
      ...user, 
      verificationStatus,
      verifiedAt: verificationStatus === 'verified' ? new Date() : null
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Brand methods
  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }
  
  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }
  
  async createBrand(insertBrand: InsertBrand): Promise<Brand> {
    const id = this.currentBrandId++;
    const brand: Brand = { ...insertBrand, id };
    this.brands.set(id, brand);
    return brand;
  }
  
  async updateBrand(id: number, brandData: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existingBrand = this.brands.get(id);
    if (!existingBrand) return undefined;
    
    const updatedBrand = { ...existingBrand, ...brandData };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }
  
  async getBrandByTenant(userId: number): Promise<Brand | undefined> {
    // 获取租户用户
    const tenant = this.users.get(userId);
    if (!tenant || tenant.role !== 'tenant') return undefined;
    
    // 如果租户已有关联的品牌ID，直接返回
    if (tenant.brandId) {
      return this.brands.get(tenant.brandId);
    }
    
    return undefined;
  }
  
  // Asset methods
  async getAssets(filters?: Partial<{ brandId: number, category: string }>): Promise<AssetWithBrand[]> {
    let assetList = Array.from(this.assets.values());
    
    if (filters) {
      if (filters.brandId) {
        assetList = assetList.filter(asset => asset.brandId === filters.brandId);
      }
      
      if (filters.category) {
        assetList = assetList.filter(asset => asset.category === filters.category);
      }
    }
    
    // Add brand data to each asset
    return assetList.map(asset => {
      const brand = this.brands.get(asset.brandId);
      return { ...asset, brand: brand! };
    });
  }
  
  async getAsset(id: number): Promise<AssetWithBrand | undefined> {
    const asset = this.assets.get(id);
    if (!asset) return undefined;
    
    const brand = this.brands.get(asset.brandId);
    if (!brand) return undefined;
    
    return { ...asset, brand };
  }
  
  async getAssetsByBrand(brandId: number): Promise<Asset[]> {
    return Array.from(this.assets.values()).filter(
      (asset) => asset.brandId === brandId,
    );
  }
  
  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.currentAssetId++;
    const asset: Asset = { 
      ...insertAsset, 
      id, 
      createdAt: new Date(),
      verifiedAt: new Date() // Auto-verify for demo
    };
    this.assets.set(id, asset);
    
    // Update brand active assets count
    const brand = this.brands.get(asset.brandId);
    if (brand) {
      brand.activeAssets = (brand.activeAssets || 0) + 1;
      this.brands.set(brand.id, brand);
    }
    
    return asset;
  }
  
  async updateAsset(id: number, assetData: Partial<InsertAsset>): Promise<Asset | undefined> {
    const existingAsset = this.assets.get(id);
    if (!existingAsset) return undefined;
    
    const updatedAsset = { ...existingAsset, ...assetData };
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }
  
  // User Asset methods
  async getUserAssets(userId: number): Promise<UserAsset[]> {
    return Array.from(this.userAssets.values()).filter(
      (userAsset) => userAsset.userId === userId,
    );
  }
  
  async getUserAssetDetails(userId: number): Promise<AssetWithBrand[]> {
    const userAssets = await this.getUserAssets(userId);
    const assetIds = userAssets.map(ua => ua.assetId);
    
    const assetDetails: AssetWithBrand[] = [];
    for (const id of assetIds) {
      const assetWithBrand = await this.getAsset(id);
      if (assetWithBrand) {
        assetDetails.push(assetWithBrand);
      }
    }
    
    return assetDetails;
  }
  
  async createUserAsset(insertUserAsset: InsertUserAsset): Promise<UserAsset> {
    const id = this.currentUserAssetId++;
    const userAsset: UserAsset = { 
      ...insertUserAsset, 
      id, 
      purchasedAt: new Date() 
    };
    this.userAssets.set(id, userAsset);
    return userAsset;
  }
}

export const storage = new MemStorage();
