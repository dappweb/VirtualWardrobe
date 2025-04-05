import { useState } from "react";
import { Link } from "wouter";
import { Asset, AssetWithBrand } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Filter, Search } from "lucide-react";
import AssetCard from "../assets/AssetCard";

interface BrandAssetsListProps {
  brandId: number;
  assets?: Asset[];
}

export default function BrandAssetsList({ brandId, assets = [] }: BrandAssetsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Convert Assets to AssetWithBrand format for AssetCard
  const assetsWithBrand: AssetWithBrand[] = assets.map(asset => {
    // We need to create the brand object based on the brand ID
    // For this demo, we'll create a minimal brand object
    const assetWithBrand: AssetWithBrand = {
      ...asset,
      brand: {
        id: brandId,
        name: asset.name.includes("CSQ") ? "创思奇 (CSQ)" : 
              asset.name.includes("MODA") ? "MODA Collective" : 
              asset.name.includes("AVNT") ? "AVNT Studio" : 
              "Brand Name",
        description: "",
        activeAssets: 0,
        floorPrice: 0,
        volume: 0
      }
    };
    return assetWithBrand;
  });
  
  // Filter assets based on search
  const filteredAssets = assetsWithBrand.filter(asset => {
    if (!searchTerm) return true;
    return asset.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-display font-bold text-neutral-900">Collection Assets</h2>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input 
              type="search"
              placeholder="Search assets" 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {assets.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-neutral-900 mb-2">No assets available</h3>
          <p className="text-neutral-500">This brand hasn't published any assets yet</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-neutral-900 mb-2">No matching assets</h3>
          <p className="text-neutral-500">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
      
      {filteredAssets.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Link href="/assets">
            <Button variant="outline" className="inline-flex items-center text-secondary-700 border-secondary-500">
              View All Assets
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
