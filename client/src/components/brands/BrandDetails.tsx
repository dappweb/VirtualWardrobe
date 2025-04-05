import { Link } from "wouter";
import { Brand } from "@/types";
import { Button } from "@/components/ui/button";
import { Globe, Twitter, Instagram, ArrowRight } from "lucide-react";
import VerifyBadge from "@/components/ui/verify-badge";

interface BrandDetailsProps {
  brand: Brand;
}

export default function BrandDetails({ brand }: BrandDetailsProps) {
  const getInitials = (name: string) => {
    // Get the first 2 characters or 1-2 characters from words
    const parts = name.split(/[\s\(\)]/);
    if (parts.length > 1) {
      // Multiple words, get first letter of first two important words
      const filtered = parts.filter(p => p.length > 0);
      if (filtered.length >= 2) {
        return (filtered[0][0] + filtered[1][0]).toUpperCase();
      }
    }
    // Just return first 1-2 chars
    return name.slice(0, 2).toUpperCase();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Image */}
      <div className="h-64 w-full overflow-hidden relative">
        <img 
          src={brand.coverImageUrl} 
          alt={`${brand.name} cover`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Brand Profile */}
      <div className="px-6 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-shrink-0 -mt-16 relative z-10 mb-4 sm:mb-0">
            <div className="h-24 w-24 rounded-xl bg-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {getInitials(brand.name)}
            </div>
          </div>
          <div className="sm:ml-6 flex-1">
            <div className="flex items-center">
              <h1 className="text-3xl font-display font-bold text-neutral-900">{brand.name}</h1>
              <VerifyBadge className="ml-2" size="lg" />
            </div>
            <p className="text-lg text-neutral-500 mt-1">{brand.shortDescription}</p>
          </div>
          <div className="hidden sm:flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Brand statistics */}
        <div className="grid grid-cols-3 gap-4 mt-8 border-y border-neutral-200 py-4">
          <div className="text-center">
            <span className="text-sm font-medium text-neutral-500">Active Assets</span>
            <p className="text-2xl font-bold text-neutral-900">{brand.activeAssets}</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-neutral-500">Floor Price</span>
            <p className="text-2xl font-bold text-neutral-900">¥{brand.floorPrice.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <span className="text-sm font-medium text-neutral-500">Volume</span>
            <p className="text-2xl font-bold text-neutral-900">¥{brand.volume.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Brand Description */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-neutral-900 mb-2">About {brand.name}</h2>
          <p className="text-neutral-600 whitespace-pre-line">{brand.description}</p>
        </div>
      </div>
    </div>
  );
}
