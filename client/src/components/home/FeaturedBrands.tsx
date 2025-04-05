import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BrandCard from "../brands/BrandCard";
import type { Brand } from "@/types";
import { useTranslation } from "react-i18next";

export default function FeaturedBrands() {
  const { t } = useTranslation();
  const { data: brands, isLoading, error } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });

  return (
    <section className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-neutral-900">
            {t('home.featuredBrands.title')}
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-neutral-500">
            {t('home.featuredBrands.description', 'Explore curated collections from the most innovative fashion brands in the industry.')}
          </p>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <Skeleton className="h-48 w-full mb-6" />
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="ml-4 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                  <div className="mt-5 flex items-center">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{t('common.error')}: {t('brands.loadError', 'Failed to load brands. Please try again later.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {brands?.slice(0, 3).map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/brands">
            <Button className="inline-flex items-center px-6 py-3 shadow-sm">
              {t('home.featuredBrands.viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
