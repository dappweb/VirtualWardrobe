/**
 * FABRICVERSE - 数据库初始化脚本
 * 
 * 此脚本用于在部署平台时初始化测试数据
 * 可在开发或测试环境中使用
 */

const users = [
  {
    username: "buyer",
    email: "buyer@example.com",
    password: "buyerpass", // 实际应用中密码会被哈希处理
    role: "buyer",
    tokenBalance: 10000,
    verified: true
  },
  {
    username: "tenant",
    email: "tenant@example.com",
    password: "tenantpass",
    role: "tenant",
    verified: true,
    verificationStatus: "approved",
    companyName: "Fashion Future Co.",
    companyRegistrationNumber: "REG123456789",
    companyAddress: "123 Fashion Street, Design District",
    contactPerson: "设计师A",
    contactPhone: "+86 123 4567 8900"
  },
  {
    username: "admin",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
    verified: true
  }
];

const brands = [
  {
    name: "Future Fashion",
    description: "未来时尚品牌，专注于可持续和数字化时装设计",
    logoUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    website: "https://example.com/futurefashion",
    tenantId: 2, // 关联到tenant用户
    verified: true,
    socialMedia: {
      instagram: "@futurefashion",
      twitter: "@futurefashion",
      facebook: "futurefashionofficial"
    }
  }
];

const assets = [
  {
    name: "数字化限量版夹克",
    description: "独特的数字资产，对应实体限量版夹克，采用未来主义设计",
    imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3",
    price: 2500,
    brandId: 1,
    category: "外套",
    blockchain: "以太坊",
    limited: true,
    editionNumber: 1,
    totalEditions: 10,
    available: true,
    metadata: {
      material: "再生聚酯纤维",
      designer: "王设计师",
      releaseDate: "2025-03-15"
    }
  },
  {
    name: "元宇宙高级定制裙装",
    description: "可在元宇宙空间穿着的高级定制裙装，同时对应实物版本",
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c",
    price: 3800,
    brandId: 1,
    category: "裙装",
    blockchain: "波场",
    limited: true,
    editionNumber: 1,
    totalEditions: 5,
    available: true,
    metadata: {
      material: "高级丝绸",
      designer: "李设计师",
      releaseDate: "2025-04-01"
    }
  },
  {
    name: "未来主义运动套装",
    description: "结合智能织物技术的运动套装，数字与实体双重存在",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    price: 1800,
    brandId: 1,
    category: "运动装",
    blockchain: "以太坊",
    limited: false,
    available: true,
    metadata: {
      material: "智能响应面料",
      designer: "张设计师",
      releaseDate: "2025-02-20"
    }
  }
];

// 导出初始化数据供API使用
module.exports = {
  users,
  brands,
  assets
};

// 如果直接运行此脚本，则打印初始化数据
if (require.main === module) {
  console.log("FABRICVERSE 数据库初始化脚本");
  console.log("===========================");
  console.log("\n预设用户数据:");
  console.table(users);
  console.log("\n预设品牌数据:");
  console.table(brands);
  console.log("\n预设资产数据:");
  console.table(assets);
}
