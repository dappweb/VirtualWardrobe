import { Link } from "wouter";
import { type AssetWithBrand } from "@/types";
import VerifyBadge from "@/components/ui/verify-badge";

interface AssetCardProps {
  asset: AssetWithBrand;
  showDetails?: boolean;
}

export default function AssetCard({ asset, showDetails = true }: AssetCardProps) {
  return (
    <Link href={`/assets/${asset.id}`}>
      <div className="group relative cursor-pointer asset-card">
        <div className="w-full min-h-80 bg-neutral-100 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-90 lg:h-80 lg:aspect-none">
          <img 
            src={asset.imageUrl}
            alt={asset.name}
            className="w-full h-full object-center object-cover lg:w-full lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 asset-overlay flex flex-col justify-end p-4">
            <span className="text-white text-sm font-medium hover:underline">
              View Details
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-neutral-900 font-accent">
              {asset.name}
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              {asset.brand.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-accent-500">
              ¥{asset.price.toLocaleString()}
            </p>
            <div className="mt-1 flex items-center justify-end">
              <VerifyBadge size="sm" />
              <span className="text-xs text-neutral-500 ml-1">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
