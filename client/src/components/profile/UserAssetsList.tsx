import { Link } from "wouter";
import { AssetWithBrand } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink } from "lucide-react";
import VerifyBadge from "@/components/ui/verify-badge";

interface UserAssetsListProps {
  assets: AssetWithBrand[];
}

export default function UserAssetsList({ assets }: UserAssetsListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Your Digital Fashion Assets</h2>
        <Badge variant="outline" className="text-secondary-700 border-secondary-200 bg-secondary-50">
          {assets.length} {assets.length === 1 ? 'Asset' : 'Assets'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="overflow-hidden">
            <div className="h-48 w-full overflow-hidden">
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{asset.name}</CardTitle>
                  <CardDescription>{asset.brand.name}</CardDescription>
                </div>
                <VerifyBadge />
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center text-sm text-neutral-500 mb-2">
                <Calendar className="mr-2 h-4 w-4" />
                Purchased on {new Date(asset.createdAt).toLocaleDateString()}
              </div>
              <p className="text-sm text-neutral-600 line-clamp-2">
                {asset.description}
              </p>
              {asset.limited && (
                <Badge className="mt-2" variant="secondary">
                  Limited Edition #{asset.editionNumber}/{asset.totalEditions}
                </Badge>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-accent-500 font-medium">¥{asset.price.toLocaleString()}</div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Blockchain
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/assets/${asset.id}`}>View</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
