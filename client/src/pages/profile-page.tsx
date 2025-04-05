import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserAssetsList from "@/components/profile/UserAssetsList";
import WalletConnect from "@/components/profile/WalletConnect";
import { Loader2, User, Wallet, Package, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetWithBrand } from "@/types";

export default function ProfilePage() {
  const { user } = useAuth();
  
  const { data: userAssets, isLoading, error } = useQuery<AssetWithBrand[]>({
    queryKey: ["/api/user/assets"],
    enabled: !!user,
  });
  
  // Function to get user's initials for the avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    const names = user.username.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-neutral-900">My Collection</h1>
            <p className="mt-2 text-neutral-500">
              Manage your digital fashion assets and account settings
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile sidebar */}
            <div className="w-full md:w-64 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 flex items-center justify-center text-white text-xl font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-neutral-900">{user?.username}</h3>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    My Assets
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Button>
                </nav>
              </div>
              
              <WalletConnect user={user} />
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              <Tabs defaultValue="my-assets" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="my-assets">My Assets</TabsTrigger>
                  <TabsTrigger value="transaction-history">Transaction History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-assets" className="space-y-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-10 w-10 animate-spin text-secondary-500" />
                    </div>
                  ) : error ? (
                    <div className="text-center py-10">
                      <p className="text-red-500">Failed to load your assets. Please try again later.</p>
                    </div>
                  ) : userAssets?.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <Package className="h-12 w-12 mx-auto text-neutral-300" />
                      <h3 className="mt-4 text-xl font-medium text-neutral-900">No assets yet</h3>
                      <p className="mt-2 text-neutral-500">
                        Start building your collection by exploring available assets
                      </p>
                      <Button className="mt-6" asChild>
                        <a href="/assets">Browse Assets</a>
                      </Button>
                    </div>
                  ) : (
                    <UserAssetsList assets={userAssets} />
                  )}
                </TabsContent>
                
                <TabsContent value="transaction-history" className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <ArrowUpRight className="h-12 w-12 mx-auto text-neutral-300" />
                    <h3 className="mt-4 text-xl font-medium text-neutral-900">Transaction History</h3>
                    <p className="mt-2 text-neutral-500">
                      Track your purchase history and transactions
                    </p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Coming soon in the next platform update
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
