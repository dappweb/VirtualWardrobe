import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { Web3AuthProvider } from "./hooks/use-web3-auth";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import AssetsPage from "@/pages/assets-page";
import AssetDetailsPage from "@/pages/asset-details-page";
import BrandsPage from "@/pages/brands-page";
import BrandDetailsPage from "@/pages/brand-details-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

// Thirdweb 相关导入
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Ethereum, Goerli } from "@thirdweb-dev/chains";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/assets" component={AssetsPage} />
      <Route path="/assets/:id" component={AssetDetailsPage} />
      <Route path="/brands" component={BrandsPage} />
      <Route path="/brands/:id" component={BrandDetailsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // 实际应用中可能需要从环境变量读取
  const thirdwebClientId = "your-client-id"; // 在生产环境中应从环境变量获取
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider 
        activeChain={Ethereum}
        supportedChains={[Ethereum, Goerli]}
        clientId={thirdwebClientId}
      >
        <AuthProvider>
          <Web3AuthProvider>
            <Router />
            <Toaster />
          </Web3AuthProvider>
        </AuthProvider>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}

export default App;
