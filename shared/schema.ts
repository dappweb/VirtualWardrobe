import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 定义用户角色类型
export type UserRole = 'buyer' | 'tenant' | 'admin';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  profileImage: text("profile_image"),
  role: text("role").notNull().default('buyer'), // 默认为普通用户(buyer)
  // 租户用户(tenant)特有字段
  brandId: integer("brand_id"), // 关联的品牌ID（如果是租户用户）
  verifiedAt: timestamp("verified_at"), // 租户验证时间
  verificationStatus: text("verification_status").default('pending'), // 验证状态：pending, verified, rejected
  // 额外信息字段（如企业信息）
  contactInfo: text("contact_info"),
  metadata: json("metadata").$type<{
    companyName?: string; 
    businessLicense?: string;
    contactPerson?: string;
    phoneNumber?: string;
    address?: string;
    website?: string;
  }>(),
});

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url"),
  coverImageUrl: text("cover_image_url"),
  shortDescription: text("short_description"),
  activeAssets: integer("active_assets").default(0),
  floorPrice: integer("floor_price").default(0),
  volume: integer("volume").default(0),
});

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  brandId: integer("brand_id").notNull(),
  category: text("category"),
  limited: boolean("limited").default(false),
  editionNumber: integer("edition_number"),
  totalEditions: integer("total_editions"),
  tokenId: text("token_id"),
  blockchain: text("blockchain").default("Ethereum"),
  createdAt: timestamp("created_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

export const userAssets = pgTable("user_assets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assetId: integer("asset_id").notNull(),
  purchasedAt: timestamp("purchased_at").defaultNow(),
  purchasePrice: integer("purchase_price").notNull(),
  transactionHash: text("transaction_hash"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  walletAddress: true,
  profileImage: true,
  role: true,
  brandId: true,
  contactInfo: true,
  metadata: true,
});

export const insertBrandSchema = createInsertSchema(brands).pick({
  name: true,
  description: true,
  logoUrl: true,
  coverImageUrl: true,
  shortDescription: true,
  activeAssets: true,
  floorPrice: true,
  volume: true,
});

export const insertAssetSchema = createInsertSchema(assets).pick({
  name: true,
  description: true,
  price: true,
  imageUrl: true,
  brandId: true,
  category: true,
  limited: true,
  editionNumber: true,
  totalEditions: true,
  tokenId: true,
  blockchain: true,
});

export const insertUserAssetSchema = createInsertSchema(userAssets).pick({
  userId: true,
  assetId: true,
  purchasePrice: true,
  transactionHash: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Asset = typeof assets.$inferSelect;

export type InsertUserAsset = z.infer<typeof insertUserAssetSchema>;
export type UserAsset = typeof userAssets.$inferSelect;

// Extended types for frontend
export type AssetWithBrand = Asset & {
  brand: Brand;
};

export type UserAssetWithDetails = UserAsset & {
  asset: AssetWithBrand;
};
