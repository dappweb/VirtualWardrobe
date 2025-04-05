import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AssetDetails from "@/components/assets/AssetDetails";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetWithBrand } from "@/types";

export default function AssetDetailsPage() {
  const { id } = useParams();
  const assetId = parseInt(id);
  
  const { data: asset, isLoading, error } = useQuery<AssetWithBrand>({
    queryKey: [`/api/assets/${assetId}`],
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/assets">
              <Button variant="ghost" className="pl-0">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Assets
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-secondary-500" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load asset details. Please try again later.</p>
            </div>
          ) : !asset ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-neutral-900 mb-2">Asset not found</h3>
              <p className="text-neutral-500">The asset you're looking for doesn't exist or has been removed</p>
              <Link href="/assets">
                <Button className="mt-4">Browse All Assets</Button>
              </Link>
            </div>
          ) : (
            <AssetDetails asset={asset} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
