import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { AssetWithBrand } from "@/types";
import { 
  Shield, 
  Clock, 
  Hash, 
  User, 
  Star, 
  Zap,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VerifyBadge from "@/components/ui/verify-badge";
import { useToast } from "@/hooks/use-toast";

interface AssetDetailsProps {
  asset: AssetWithBrand;
}

export default function AssetDetails({ asset }: AssetDetailsProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(asset.imageUrl);
  
  // Mock different views for demo purposes
  const assetImages = [
    asset.imageUrl,
    "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
    "https://images.unsplash.com/photo-1549298916-b41d501d3772"
  ];
  
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      // Generate a mock transaction hash for demo
      const mockTransactionHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
      const res = await apiRequest(
        "POST", 
        `/api/assets/${asset.id}/purchase`, 
        { transactionHash: mockTransactionHash }
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/assets"] });
      toast({
        title: "Purchase Successful!",
        description: `You now own ${asset.name}. View it in your collection.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Purchase Failed",
        description: error.message || "Could not complete purchase",
        variant: "destructive",
      });
    }
  });
  
  const handlePurchase = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    purchaseMutation.mutate();
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="p-6 sm:flex sm:items-start">
        <div className="sm:flex-1">
          <div className="bg-neutral-100 rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={asset.name} 
              className="w-full h-auto object-cover" 
            />
          </div>
          
          <div className="mt-4 grid grid-cols-4 gap-2">
            {assetImages.map((img, index) => (
              <button 
                key={index}
                className="bg-neutral-100 rounded-md overflow-hidden h-20"
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img} 
                  alt={`${asset.name} - View ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 sm:mt-0 sm:ml-8 sm:flex-1">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold">
              {asset.brand.name.slice(0, 2).toUpperCase()}
            </div>
            <h3 className="ml-3 text-lg font-medium text-neutral-900">{asset.brand.name}</h3>
            <VerifyBadge className="ml-2" />
          </div>
          
          <h2 className="mt-4 text-2xl font-bold text-neutral-900 font-display">{asset.name}</h2>
          
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((star) => (
                <Star 
                  key={star}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
              <Star className="h-5 w-5 text-neutral-300" />
            </div>
            <p className="ml-2 text-sm text-neutral-500">4.0 (12 reviews)</p>
          </div>
          
          {asset.limited && (
            <p className="mt-4 text-sm text-neutral-500 font-medium">
              Limited Edition: #{asset.editionNumber} of {asset.totalEditions}
            </p>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-neutral-900">Description</h3>
            <p className="mt-2 text-neutral-500">
              {asset.description}
            </p>
            <div className="mt-4 space-y-2">
              <p className="flex items-center text-sm">
                <Shield className="h-5 w-5 text-neutral-400 mr-2" />
                Authentic RWA with physical counterpart
              </p>
              <p className="flex items-center text-sm">
                <FileText className="h-5 w-5 text-neutral-400 mr-2" />
                Includes digital certificate of authenticity
              </p>
              <p className="flex items-center text-sm">
                <Clock className="h-5 w-5 text-neutral-400 mr-2" />
                Creation Date: {new Date(asset.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">Ownership Details</h3>
              <a href="#" className="text-secondary-500 hover:text-secondary-700 text-sm font-medium">
                View on blockchain
              </a>
            </div>
            <div className="mt-4 bg-neutral-50 p-4 rounded-md">
              <p className="text-sm text-neutral-500 flex items-center">
                <Zap className="h-5 w-5 text-neutral-400 mr-2" />
                Blockchain: {asset.blockchain}
              </p>
              <p className="mt-2 text-sm text-neutral-500 flex items-center">
                <Hash className="h-5 w-5 text-neutral-400 mr-2" />
                Token ID: {asset.tokenId || "Not yet minted"}
              </p>
              <p className="mt-2 text-sm text-neutral-500 flex items-center">
                <User className="h-5 w-5 text-neutral-400 mr-2" />
                Created by: {asset.brand.name}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-8">
            <span className="text-2xl font-bold text-neutral-900">¥{asset.price.toLocaleString()}</span>
            <div className="flex space-x-3">
              <Button variant="outline" className="py-2 px-4 text-neutral-700">
                Add to Watchlist
              </Button>
              <Button 
                onClick={handlePurchase}
                disabled={purchaseMutation.isPending}
                className="py-2 px-6 bg-accent-500 hover:bg-accent-700"
              >
                {purchaseMutation.isPending ? "Processing..." : "Purchase Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
