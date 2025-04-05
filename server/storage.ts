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
  
  // 虚拟钱包相关
  getUserTokenBalance(userId: number): Promise<number>; // 获取用户代币余额
  updateUserTokenBalance(userId: number, amount: number): Promise<User | undefined>; // 更新用户代币余额
  
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
  purchaseAsset(userId: number, assetId: number): Promise<{userAsset: UserAsset, user: User} | undefined>; // 购买资产
  
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
    // 创建演示账号
    
    // 1. 普通用户 - 买家角色
    const buyer = this.createUser({
      username: "buyer",
      email: "buyer@fabricverse.com",
      password: "$2b$10$3QIZiRxmGQ4k9qFG1U7QWOYtMgz37iRx6tpWqHWnZ4MbDjQnXpTHy", // 密码: buyerpass
      role: "buyer",
      verificationStatus: "verified",
      walletAddress: "0x12345...abcde",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
      displayName: "Fashion Buyer"
    });
    
    // 2. 租户用户 - 已认证的时尚品牌
    const tenant = this.createUser({
      username: "tenant",
      email: "tenant@fabricverse.com",
      password: "$2b$10$3QIZiRxmGQ4k9qFG1U7QWOYtMgz37iRx6tpWqHWnZ4MbDjQnXpTHy", // 密码: tenantpass
      role: "tenant",
      verificationStatus: "verified",
      walletAddress: "0x67890...fghij",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      displayName: "Brand Manager"
    });
    
    // 3. 管理员 - 平台管理员
    const admin = this.createUser({
      username: "admin",
      email: "admin@fabricverse.com",
      password: "$2b$10$3QIZiRxmGQ4k9qFG1U7QWOYtMgz37iRx6tpWqHWnZ4MbDjQnXpTHy", // 密码: adminpass
      role: "admin",
      verificationStatus: "verified",
      walletAddress: "0x24680...klmno",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
      displayName: "Platform Admin"
    });
    
    // Seed brands
    const csqBrand = this.createBrand({
      name: "创思奇 (CSQ)",
      description: "Pioneering the future of fashion through innovative designs and bold cultural statements. CSQ represents the cutting edge of fashion technology and artistic expression, blending Eastern and Western aesthetics into harmonious, forward-thinking collections.",
      shortDescription: "Fashion Innovation Pioneer",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
      activeAssets: 12,
      floorPrice: 2000,
      volume: 24500,
      tenantId: tenant.id // 将第一个品牌关联到租户账号
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
    
    const retrBrand = this.createBrand({
      name: "复古时光 (RetroTime)",
      description: "专注于重新诠释经典时尚元素，将复古风格与现代工艺相结合。复古时光从中国传统服饰和20世纪各个时代的时尚中汲取灵感，创造出富有历史韵味又不失时代感的精品。",
      shortDescription: "Reimagining Vintage Chinese Fashion",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1573227895320-87e12e19a92b",
      activeAssets: 9,
      floorPrice: 1500,
      volume: 12800
    });
    
    const urbanTrendsBrand = this.createBrand({
      name: "Urban Trends",
      description: "Capturing the essence of global street culture and urban lifestyle through bold designs and distinctive graphics. Urban Trends creates streetwear that speaks to the energy and diversity of city life, with influences from graffiti, urban music, and contemporary art.",
      shortDescription: "Global Street Culture Fashion",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1523398002808-094080895957",
      activeAssets: 15,
      floorPrice: 900,
      volume: 28000
    });
    
    const ecoChicBrand = this.createBrand({
      name: "EcoChic",
      description: "Leading the way in eco-conscious fashion with innovative sustainable materials and ethical production. EcoChic proves that fashion can be both environmentally responsible and stylish, creating versatile pieces from recycled, upcycled, and responsibly sourced materials.",
      shortDescription: "Sustainable Fashion Revolution",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f",
      activeAssets: 11,
      floorPrice: 1200,
      volume: 16500
    });
    
    const luxEleganceBrand = this.createBrand({
      name: "奢雅 (LuxElegance)",
      description: "在中国传统手工艺与现代奢侈品设计之间架起桥梁。奢雅每件作品都凝聚了世代相传的技艺，采用最优质的材料，展现东方美学的精髓与当代奢华的完美融合。",
      shortDescription: "Contemporary Chinese Luxury",
      logoUrl: "https://via.placeholder.com/100",
      coverImageUrl: "https://images.unsplash.com/photo-1588495752527-44ab116db881",
      activeAssets: 7,
      floorPrice: 5000,
      volume: 42000
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
    
    // RetroTime assets
    this.createAsset({
      name: "复古旗袍上衣",
      description: "融合了传统旗袍元素与现代剪裁的精致上衣，采用高品质真丝面料，手工绣制传统纹样，完美展现东方女性的优雅气质。每件作品均由经验丰富的工匠精心制作，代表着中国传统服饰文化的传承与创新。",
      price: 2500,
      imageUrl: "https://images.unsplash.com/photo-1609096458733-95b38583ac4e",
      brandId: 4,
      category: "Apparel",
      limited: true,
      editionNumber: 3,
      totalEditions: 12,
      tokenId: "0x8d7c...6b2e",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "70's Inspired Denim Jacket",
      description: "A perfect recreation of the iconic 70's denim jacket with authentic vintage details and wash techniques. This jacket features hand-distressed elements and original metal hardware, capturing the essence of an era that revolutionized fashion.",
      price: 1950,
      imageUrl: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531",
      brandId: 4,
      category: "Apparel",
      limited: false,
      tokenId: "0x9e4a...3c5d",
      blockchain: "Ethereum"
    });
    
    // Urban Trends assets
    this.createAsset({
      name: "Graffiti Bomber Jacket",
      description: "A canvas of urban expression, each Graffiti Bomber Jacket features unique hand-painted artwork by renowned street artists. The designs capture the raw energy and creative spirit of city streets, making each piece an authentic wearable art object.",
      price: 1200,
      imageUrl: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2",
      brandId: 5,
      category: "Apparel",
      limited: true,
      editionNumber: 5,
      totalEditions: 30,
      tokenId: "0x1f3b...8d2c",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "Street Culture Cap",
      description: "This premium cap represents the perfect fusion of street art and high-quality craftsmanship. Each cap features unique embroidery inspired by global street culture and comes with digital authentication of its limited-edition status.",
      price: 450,
      imageUrl: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
      brandId: 5,
      category: "Accessories",
      limited: true,
      editionNumber: 12,
      totalEditions: 50,
      tokenId: "0x2e9d...7a1f",
      blockchain: "Ethereum"
    });
    
    // EcoChic assets
    this.createAsset({
      name: "Recycled Ocean Tote",
      description: "Created from plastic recovered from the ocean, each Recycled Ocean Tote represents EcoChic's commitment to environmental responsibility. The innovative manufacturing process transforms harmful waste into a durable, stylish, and practical accessory with minimal environmental impact.",
      price: 980,
      imageUrl: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0",
      brandId: 6,
      category: "Accessories",
      limited: false,
      tokenId: "0x4b8e...9c2d",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "Sustainable Loungewear Set",
      description: "Crafted from bamboo and organic cotton, this loungewear set exemplifies comfort meeting responsibility. The fabric is biodegradable, hypoallergenic, and produced using closed-loop manufacturing processes that minimize water and energy usage.",
      price: 1500,
      imageUrl: "https://images.unsplash.com/photo-1604267764931-7c448bf9938c",
      brandId: 6,
      category: "Apparel",
      limited: false,
      tokenId: "0x5c7d...3e1b",
      blockchain: "Ethereum"
    });
    
    // LuxElegance assets
    this.createAsset({
      name: "龙凤呈祥手工刺绣丝巾",
      description: "这款丝巾融合了传统苏绣工艺与现代设计美学，由中国丝绸之府的顶级绣娘历时3个月精心制作。100%桑蚕丝材质，传统龙凤图案象征着吉祥与和谐，每一针一线都体现了非物质文化遗产的精髓与匠心。",
      price: 12000,
      imageUrl: "https://images.unsplash.com/photo-1583170658853-8b4713647e6f",
      brandId: 7,
      category: "Accessories",
      limited: true,
      editionNumber: 1,
      totalEditions: 8,
      tokenId: "0x6d9f...4e3a",
      blockchain: "Ethereum"
    });
    
    this.createAsset({
      name: "翡翠玉扣真丝外套",
      description: "采用最高级真丝面料定制，结合新中式设计理念，点缀以天然A货翡翠玉扣，将东方内敛美学与现代剪裁融为一体。每件作品均由技艺精湛的裁缝大师手工制作，彰显尊贵气质与文化底蕴。",
      price: 18500,
      imageUrl: "https://images.unsplash.com/photo-1608159477202-8a37e8832e5a",
      brandId: 7,
      category: "Apparel",
      limited: true,
      editionNumber: 2,
      totalEditions: 5,
      tokenId: "0x7e2a...5f4b",
      blockchain: "Ethereum"
    });
    
    // More CSQ assets
    this.createAsset({
      name: "Tech-Infused Crossbody Bag",
      description: "A revolutionary accessory that merges fashion with cutting-edge technology. This crossbody bag features integrated wireless charging, NFC authentication, and LED lighting elements that can be customized via smartphone app. The perfect embodiment of 创思奇's vision for the future of fashion.",
      price: 4200,
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
      brandId: 1,
      category: "Accessories",
      limited: true,
      editionNumber: 6,
      totalEditions: 15,
      tokenId: "0x8f3b...6g2c",
      blockchain: "Ethereum"
    });
    
    // More MODA Collective assets
    this.createAsset({
      name: "Biodegradable Weekender",
      description: "This innovative travel bag is crafted entirely from plant-based materials and natural dyes, making it 100% biodegradable at the end of its long life cycle. The sleek design and spacious compartments make it as functional as it is environmentally responsible.",
      price: 2200,
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
      brandId: 2,
      category: "Accessories",
      limited: false,
      tokenId: "0x9a4c...7h3d",
      blockchain: "Ethereum"
    });
    
    // More AVNT Studio assets
    this.createAsset({
      name: "Sculptural Dress",
      description: "Transcending conventional clothing concepts, this architectural wonder functions as both a dress and a sculptural art piece. The innovative design uses advanced thermoreactive fabrics that subtly change structure in response to body temperature and ambient conditions.",
      price: 8500,
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
      brandId: 3,
      category: "Apparel",
      limited: true,
      editionNumber: 1,
      totalEditions: 3,
      tokenId: "0x1b5d...8i4e",
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
  
  // 虚拟钱包相关方法
  async getUserTokenBalance(userId: number): Promise<number> {
    const user = this.users.get(userId);
    if (!user) return 0;
    return user.tokenBalance || 0;
  }
  
  async updateUserTokenBalance(userId: number, amount: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const currentBalance = user.tokenBalance || 0;
    const updatedUser = { 
      ...user, 
      tokenBalance: currentBalance + amount 
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
  
  // 资产购买方法
  async purchaseAsset(userId: number, assetId: number): Promise<{userAsset: UserAsset, user: User} | undefined> {
    // 检查用户是否存在
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // 检查资产是否存在
    const asset = this.assets.get(assetId);
    if (!asset) return undefined;
    
    // 检查用户余额是否足够
    const userBalance = user.tokenBalance || 0;
    if (userBalance < asset.price) {
      throw new Error('余额不足，请充值后再试');
    }
    
    // 更新用户余额
    const newBalance = userBalance - asset.price;
    const updatedUser = await this.updateUserTokenBalance(userId, -asset.price);
    if (!updatedUser) {
      throw new Error('更新用户余额失败');
    }
    
    // 创建用户资产
    const userAsset = await this.createUserAsset({
      userId,
      assetId,
      purchasePrice: asset.price,
      transactionHash: `vt-${Date.now()}-${Math.floor(Math.random() * 1000)}` // 创建虚拟交易哈希
    });
    
    // 更新品牌交易量
    const brand = this.brands.get(asset.brandId);
    if (brand) {
      brand.volume = (brand.volume || 0) + asset.price;
      this.brands.set(brand.id, brand);
    }
    
    return {
      userAsset,
      user: updatedUser
    };
  }
}

export const storage = new MemStorage();
