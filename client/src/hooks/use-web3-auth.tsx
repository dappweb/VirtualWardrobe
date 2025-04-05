import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Web3ServiceFactory, { IWeb3Service, WalletType } from '@/services/web3Service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

// Web3认证状态接口
interface Web3AuthState {
  isConnected: boolean;
  address: string | null;
  walletType: WalletType | null;
  isLoading: boolean;
  error: string | null;
}

// Web3认证上下文接口
interface Web3AuthContextType extends Web3AuthState {
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  login: () => Promise<void>;
  getActiveWallet: () => IWeb3Service | null;
}

// 创建上下文
const Web3AuthContext = createContext<Web3AuthContextType | null>(null);

// Web3认证提供者组件
export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { connectWalletMutation } = useAuth();
  
  // 状态
  const [state, setState] = useState<Web3AuthState>({
    isConnected: false,
    address: null,
    walletType: null,
    isLoading: false,
    error: null,
  });

  // 初始化时检查是否已有连接的钱包
  useEffect(() => {
    const checkActiveWallet = async () => {
      try {
        const activeService = Web3ServiceFactory.getActiveService();
        if (activeService && activeService.isConnected && activeService.address) {
          setState({
            isConnected: true,
            address: activeService.address,
            walletType: activeService.type,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking active wallet:', error);
      }
    };

    checkActiveWallet();
  }, []);

  // 连接钱包
  const connect = async (walletType: WalletType) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const service = Web3ServiceFactory.getService(walletType);
      const address = await service.connect();
      
      setState({
        isConnected: true,
        address,
        walletType,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: '钱包已连接',
        description: `成功连接到您的${walletType === 'ethereum' ? '以太坊' : '波场'}钱包`,
      });
      
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setState(prev => ({
        ...prev,
        isConnected: false,
        address: null,
        walletType: null,
        isLoading: false,
        error: error.message || '连接钱包失败',
      }));
      
      toast({
        title: '连接失败',
        description: error.message || '无法连接到您的钱包',
        variant: 'destructive',
      });
    }
  };

  // 断开钱包连接
  const disconnect = () => {
    try {
      if (state.walletType) {
        const service = Web3ServiceFactory.getService(state.walletType);
        service.disconnect();
      }
      
      setState({
        isConnected: false,
        address: null,
        walletType: null,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: '已断开连接',
        description: '您的钱包已断开连接',
      });
    } catch (error: any) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: '断开连接失败',
        description: error.message || '无法断开钱包连接',
        variant: 'destructive',
      });
    }
  };

  // 使用钱包登录
  const login = async () => {
    if (!state.isConnected || !state.address || !state.walletType) {
      toast({
        title: '未连接钱包',
        description: '请先连接您的钱包',
        variant: 'destructive',
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const service = Web3ServiceFactory.getService(state.walletType);
      
      // 获取签名作为身份验证
      // const signature = await service.signMessage();
      
      // 直接使用钱包地址作为身份验证（简化版）
      const walletAddress = state.address;
      
      // 调用后端API更新用户档案
      await connectWalletMutation.mutateAsync({ walletAddress });
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: '登录成功',
        description: '您已使用区块链钱包成功登录',
      });
    } catch (error: any) {
      console.error('Failed to login with wallet:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || '钱包登录失败',
      }));
      
      toast({
        title: '登录失败',
        description: error.message || '使用钱包登录失败',
        variant: 'destructive',
      });
    }
  };

  // 获取当前激活的钱包服务
  const getActiveWallet = (): IWeb3Service | null => {
    if (!state.isConnected || !state.walletType) {
      return null;
    }
    return Web3ServiceFactory.getService(state.walletType);
  };

  const value: Web3AuthContextType = {
    ...state,
    connect,
    disconnect,
    login,
    getActiveWallet,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}

// 自定义Hook，用于访问Web3认证上下文
export function useWeb3Auth() {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
}