import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BrandCard from "@/components/brands/BrandCard";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Brand } from "@/types";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: brands, isLoading, error } = useQuery<Brand[]>({
    queryKey: ["/api/brands"],
  });
  
  // Filter brands based on search term
  const filteredBrands = brands?.filter(brand => {
    if (!searchTerm) return true;
    
    return (
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.shortDescription && brand.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-neutral-900">Fashion Brands</h1>
              <p className="mt-2 text-neutral-500">
                Explore innovative fashion brands with digital RWA collections
              </p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input 
                    type="search"
                    placeholder="Search brands" 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                  <div className="h-48 w-full bg-neutral-200 mb-6 rounded-md"></div>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-neutral-200"></div>
                    <div className="ml-4 space-y-2">
                      <div className="h-5 w-40 bg-neutral-200 rounded"></div>
                      <div className="h-4 w-24 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-4 w-full mt-4 bg-neutral-200 rounded"></div>
                  <div className="h-4 w-2/3 mt-2 bg-neutral-200 rounded"></div>
                  <div className="mt-5 flex items-center">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex-1 space-y-2">
                        <div className="h-3 w-16 bg-neutral-200 rounded"></div>
                        <div className="h-5 w-12 bg-neutral-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Failed to load brands. Please try again later.</p>
            </div>
          ) : filteredBrands?.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-neutral-900 mb-2">No brands found</h3>
              <p className="text-neutral-500">Try adjusting your search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBrands?.map((brand) => (
                <BrandCard key={brand.id} brand={brand} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
