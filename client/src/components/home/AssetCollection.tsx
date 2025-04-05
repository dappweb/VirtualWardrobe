import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AssetCard from "../assets/AssetCard";
import type { AssetWithBrand } from "@/types";

export default function AssetCollection() {
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recentlyAdded");
  
  const { data: assets, isLoading, error } = useQuery<AssetWithBrand[]>({
    queryKey: ["/api/assets"],
  });
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-display font-bold text-neutral-900">Featured Assets</h2>
            <p className="mt-2 text-lg text-neutral-500">
              Discover the most sought-after fashion assets on the platform
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Select 
              value={category} 
              onValueChange={setCategory}
            >
              <SelectTrigger className="w-[180px]">
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
            
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[180px]">
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

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative">
                  <Skeleton className="w-full h-80 rounded-md" />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24 mt-1" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-16 ml-auto" />
                      <Skeleton className="h-4 w-20 mt-1 ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load assets. Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {assets?.slice(0, 4).map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link href="/assets">
            <Button variant="outline" className="inline-flex items-center px-6 py-3 text-secondary-700 border-secondary-500">
              View All Assets
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
