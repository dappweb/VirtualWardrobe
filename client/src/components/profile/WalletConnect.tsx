import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface WalletConnectProps {
  user: User | null;
}

// Mock web3 wallet functionality for MVP
const mockWeb3Wallet = {
  isConnected: false,
  connect: async (): Promise<string> => {
    // Simulate wallet connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random wallet address for demo
    const randomAddress = "0x" + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    return randomAddress;
  }
};

export default function WalletConnect({ user }: WalletConnectProps) {
  const { connectWalletMutation } = useAuth();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Call mock wallet connection
      const walletAddress = await mockWeb3Wallet.connect();
      
      // Update user profile with wallet address
      connectWalletMutation.mutate({ walletAddress });
    } catch (error) {
      toast({
        title: "Wallet Connection Failed",
        description: "Could not connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Wallet className="mr-2 h-5 w-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your crypto wallet to enable purchases
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.walletAddress ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            <div>
              <p className="font-medium">Wallet Connected</p>
              <p className="text-sm">{truncateAddress(user.walletAddress)}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-amber-50 text-amber-700 p-3 rounded-md flex items-center mb-4">
              <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
              <div>
                <p className="font-medium">No Wallet Connected</p>
                <p className="text-sm">Connect your wallet to purchase assets</p>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleConnectWallet}
              disabled={isConnecting || connectWalletMutation.isPending}
            >
              {isConnecting || connectWalletMutation.isPending ? (
                <>Connecting Wallet...</>
              ) : (
                <>Connect Wallet</>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
