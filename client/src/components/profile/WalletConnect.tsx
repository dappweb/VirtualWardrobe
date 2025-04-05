import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Loader2 } from "lucide-react";
import { WalletType } from '@/services/web3Service';
import { User } from '@/types';

interface WalletConnectProps {
  user: User | null;
}

export default function WalletConnect({ user }: WalletConnectProps) {
  const { isConnected, address, walletType, connect, disconnect, login, isLoading, error } = useWeb3Auth();
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);

  // 处理连接钱包
  const handleConnect = async (type: WalletType) => {
    setSelectedWallet(type);
    try {
      await connect(type);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setSelectedWallet(null);
    }
  };

  // 处理登录
  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Failed to login with wallet:', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>区块链钱包连接</CardTitle>
        <CardDescription>
          连接您的区块链钱包以启用资产交易功能
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.walletAddress ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-md">
              <p className="text-sm font-medium">已连接钱包</p>
              <p className="text-xs text-muted-foreground break-all mt-1">{user.walletAddress}</p>
            </div>
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-md">
              <p className="text-sm font-medium">已连接钱包</p>
              <p className="text-xs text-muted-foreground break-all mt-1">{address}</p>
            </div>
            {!user?.walletAddress && (
              <Button 
                className="w-full" 
                onClick={handleLogin} 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    正在将钱包与账户关联...
                  </>
                ) : (
                  '关联钱包到当前账户'
                )}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => handleConnect('ethereum')}
              disabled={isLoading || selectedWallet === 'ethereum'}
            >
              {isLoading && selectedWallet === 'ethereum' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-5 w-5 mr-2" />
              )}
              连接 MetaMask
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              onClick={() => handleConnect('tron')}
              disabled={isLoading || selectedWallet === 'tron'}
            >
              {isLoading && selectedWallet === 'tron' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <img src="https://tronweb3.wiki/tronlink-logo.svg" alt="TronLink" className="h-5 w-5 mr-2" />
              )}
              连接 TronLink
            </Button>
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive mt-2">错误: {error}</p>
        )}
      </CardContent>
      {isConnected && (
        <CardFooter>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={disconnect}
          >
            断开钱包连接
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}