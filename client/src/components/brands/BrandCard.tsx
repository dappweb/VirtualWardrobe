import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/types";

interface BrandCardProps {
  brand: Brand;
}

export default function BrandCard({ brand }: BrandCardProps) {
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
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="h-48 w-full overflow-hidden">
        <img 
          src={brand.coverImageUrl} 
          alt={brand.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold">
              {getInitials(brand.name)}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-neutral-900 font-display">{brand.name}</h3>
            <p className="text-sm text-neutral-500">{brand.shortDescription}</p>
          </div>
        </div>
        <p className="mt-4 text-neutral-600">
          {brand.description.length > 120 
            ? `${brand.description.substring(0, 120)}...` 
            : brand.description}
        </p>
        <div className="mt-5 flex items-center">
          <div className="flex-1">
            <span className="text-xs font-medium text-neutral-500">Active Assets</span>
            <p className="text-lg font-medium text-neutral-900">{brand.activeAssets}</p>
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-neutral-500">Floor Price</span>
            <p className="text-lg font-medium text-neutral-900">¥{brand.floorPrice.toLocaleString()}</p>
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-neutral-500">Volume</span>
            <p className="text-lg font-medium text-neutral-900">¥{brand.volume.toLocaleString()}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link href={`/brands/${brand.id}`}>
            <a className="text-secondary-500 hover:text-secondary-700 font-medium flex items-center">
              Explore Brand 
              <ArrowRight className="h-5 w-5 ml-1" />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
