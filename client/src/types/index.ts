import type { User, Brand, Asset, AssetWithBrand, UserAsset, UserAssetWithDetails } from '@shared/schema';

export type { User, Brand, Asset, AssetWithBrand, UserAsset, UserAssetWithDetails };

export interface AssetFilterOptions {
  brandId?: number;
  category?: string;
  sortBy?: 'recentlyAdded' | 'priceLowToHigh' | 'priceHighToLow' | 'mostPopular';
}

export interface PurchaseTransactionDetails {
  assetId: number;
  userId: number;
  price: number;
  transactionHash: string;
}

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}
