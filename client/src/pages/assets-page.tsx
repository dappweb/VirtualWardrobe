import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AssetCard from "@/components/assets/AssetCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AssetWithBrand, AssetFilterOptions } from "@/types";

export default function AssetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AssetFilterOptions>({
    category: undefined,
    sortBy: "recentlyAdded",
  });
  
  const { data: assets, isLoading, error } = useQuery<AssetWithBrand[]>({
    queryKey: ["/api/assets"],
  });
  
  // Filter and sort assets
  const filteredAssets = assets?.filter(asset => {
    // Apply search filter
    if (searchTerm && !asset.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !asset.brand.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filters.category && asset.category !== filters.category) {
      return false;
    }
    
    return true;
  }) || [];
  
  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (filters.sortBy) {
      case "priceLowToHigh":
        return a.price - b.price;
      case "priceHighToLow":
        return b.price - a.price;
      case "mostPopular":
        // For demo, we'll use the asset ID as a proxy for popularity
        return b.id - a.id;
      default:
        // recentlyAdded - sort by ID as proxy for recency
        return b.id - a.id;
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900">Fashion Assets</h1>
              <p className="mt-2 text-neutral-500">
                Discover and collect authentic digital fashion assets
              </p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <div className="flex items-center space-x-2">
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
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <div className="w-full md:w-64 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  <Select 
                    value={filters.category || "all"}
                    onValueChange={(value) => setFilters({...filters, category: value === "all" ? undefined : value})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Apparel">Apparel</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                      <SelectItem value="Limited Edition">Limited Edition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium text-neutral-900 mb-3">Sort By</h3>
                <Select 
                  value={filters.sortBy || "recentlyAdded"}
                  onValueChange={(value) => setFilters({...filters, sortBy: value as any})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recentlyAdded">Recently Added</SelectItem>
                    <SelectItem value="priceLowToHigh">Price: Low to High</SelectItem>
                    <SelectItem value="priceHighToLow">Price: High to Low</SelectItem>
                    <SelectItem value="mostPopular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-10 w-10 animate-spin text-secondary-500" />
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-red-500">Failed to load assets. Please try again later.</p>
                </div>
              ) : sortedAssets.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">No assets found</h3>
                  <p className="text-neutral-500">Try adjusting your filters or search term</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {sortedAssets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
