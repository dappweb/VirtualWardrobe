import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrandDetails from "@/components/brands/BrandDetails";
import BrandAssetsList from "@/components/brands/BrandAssetsList";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, Asset } from "@/types";

export default function BrandDetailsPage() {
  const { id } = useParams();
  const brandId = parseInt(id);
  
  const { data, isLoading, error } = useQuery<{ 
    [key: string]: any, 
    assets: Asset[] 
  }>({
    queryKey: [`/api/brands/${brandId}`],
  });
  
  // Extract brand and assets from the response
  const brand: Brand | undefined = data ? {
    id: data.id,
    name: data.name,
    description: data.description,
    logoUrl: data.logoUrl,
    coverImageUrl: data.coverImageUrl,
    shortDescription: data.shortDescription,
    activeAssets: data.activeAssets,
    floorPrice: data.floorPrice,
    volume: data.volume
  } : undefined;
  
  const assets: Asset[] | undefined = data?.assets;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/brands">
              <Button variant="ghost" className="pl-0">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Brands
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-secondary-500" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load brand details. Please try again later.</p>
            </div>
          ) : !brand ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-neutral-900 mb-2">Brand not found</h3>
              <p className="text-neutral-500">The brand you're looking for doesn't exist or has been removed</p>
              <Link href="/brands">
                <Button className="mt-4">Browse All Brands</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              <BrandDetails brand={brand} />
              <BrandAssetsList brandId={brand.id} assets={assets} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
