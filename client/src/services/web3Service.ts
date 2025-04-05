import Web3 from 'web3';
import TronWeb from 'tronweb';
import { ethers } from 'ethers';

// 定义钱包类型
export type WalletType = 'ethereum' | 'tron';

// 定义认证消息
const AUTH_MESSAGE = 'Sign this message to authenticate with FABRICVERSE platform';

// Web3服务接口
export interface IWeb3Service {
  isConnected: boolean;
  address: string | null;
  type: WalletType | null;
  connect(): Promise<string>;
  disconnect(): void;
  signMessage(message?: string): Promise<string>;
}

// 以太坊钱包服务实现
class EthereumWalletService implements IWeb3Service {
  private web3: Web3 | null = null;
  private provider: any;
  private _address: string | null = null;
  private _isConnected: boolean = false;

  constructor() {
    this.initProvider();
  }

  private initProvider() {
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      this.provider = window.ethereum;
      this.web3 = new Web3(window.ethereum);
      this.checkConnection();
    }
  }

  private async checkConnection() {
    try {
      // 检查当前连接状态
      if (this.provider && this.provider.selectedAddress) {
        this._address = this.provider.selectedAddress;
        this._isConnected = true;
      } else if (this.web3) {
        const accounts = await this.web3.eth.getAccounts();
        if (accounts && accounts.length > 0) {
          this._address = accounts[0];
          this._isConnected = true;
        }
      }
    } catch (error) {
      console.error('Error checking Ethereum connection:', error);
      this._isConnected = false;
      this._address = null;
    }
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get address(): string | null {
    return this._address;
  }

  get type(): WalletType | null {
    return this._isConnected ? 'ethereum' : null;
  }

  async connect(): Promise<string> {
    if (!this.web3 || !this.provider) {
      throw new Error('MetaMask is not installed or not accessible');
    }

    try {
      // 请求用户授权连接
      const accounts = await this.provider.request({ method: 'eth_requestAccounts' });

      // 更新连接状态
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        this._address = address;
        this._isConnected = true;
        return address; // 直接返回address而不是this._address
      } else {
        throw new Error('No accounts returned from wallet');
      }
    } catch (error: any) {
      // 处理用户拒绝连接的情况
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      } else {
        console.error('Error connecting to Ethereum wallet:', error);
        throw new Error('Failed to connect to wallet');
      }
    }
  }

  disconnect(): void {
    this._address = null;
    this._isConnected = false;
  }

  async signMessage(message: string = AUTH_MESSAGE): Promise<string> {
    if (!this.isConnected || !this.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // 使用web3.js进行消息签名
      if (this.web3) {
        const accounts = await this.web3.eth.getAccounts();
        const signature = await this.web3.eth.personal.sign(
          message,
          accounts[0],
          '' // 密码参数，可为空
        );
        return signature;
      }
      throw new Error('Web3 not initialized');
    } catch (error) {
      console.error('Error signing message:', error);
      throw new Error('Failed to sign message');
    }
  }
}

// 波场钱包服务实现
class TronWalletService implements IWeb3Service {
  private tronWeb: any;
  private _address: string | null = null;
  private _isConnected: boolean = false;

  constructor() {
    this.initProvider();
  }

  private initProvider() {
    if (typeof window !== 'undefined' && typeof window.tronWeb !== 'undefined') {
      this.tronWeb = window.tronWeb;
      this.checkConnection();
    }
  }

  private async checkConnection() {
    try {
      if (this.tronWeb && this.tronWeb.ready) {
        this._address = this.tronWeb.defaultAddress.base58;
        this._isConnected = true;
      }
    } catch (error) {
      console.error('Error checking TronWeb connection:', error);
      this._isConnected = false;
      this._address = null;
    }
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get address(): string | null {
    return this._address;
  }

  get type(): WalletType | null {
    return this._isConnected ? 'tron' : null;
  }

  async connect(): Promise<string> {
    if (!this.tronWeb) {
      throw new Error('TronLink is not installed or not accessible');
    }

    try {
      // TronLink需要用户在钱包中手动授权
      // 我们需要检查是否已准备好
      if (!this.tronWeb.ready) {
        throw new Error('Please unlock your TronLink wallet and authorize this site');
      }

      // 获取用户地址
      const address = this.tronWeb.defaultAddress.base58;
      if (!address) {
        throw new Error('No account accessible in TronLink');
      }

      // 更新连接状态
      this._address = address;
      this._isConnected = true;
      return address; // 直接返回address而不是this._address以避免类型错误
    } catch (error) {
      console.error('Error connecting to Tron wallet:', error);
      throw new Error('Failed to connect to wallet');
    }
  }

  disconnect(): void {
    this._address = null;
    this._isConnected = false;
  }

  async signMessage(message: string = AUTH_MESSAGE): Promise<string> {
    if (!this.isConnected || !this.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // 使用TronWeb进行消息签名
      const signature = await this.tronWeb.trx.sign(message);
      return signature;
    } catch (error) {
      console.error('Error signing message with TronWeb:', error);
      throw new Error('Failed to sign message');
    }
  }
}

// Web3服务工厂
class Web3ServiceFactory {
  private static ethereumService: EthereumWalletService | null = null;
  private static tronService: TronWalletService | null = null;

  static getService(type: WalletType): IWeb3Service {
    if (type === 'ethereum') {
      if (!this.ethereumService) {
        this.ethereumService = new EthereumWalletService();
      }
      return this.ethereumService;
    } else if (type === 'tron') {
      if (!this.tronService) {
        this.tronService = new TronWalletService();
      }
      return this.tronService;
    }
    throw new Error(`Unsupported wallet type: ${type}`);
  }

  static getAllServices(): IWeb3Service[] {
    const services: IWeb3Service[] = [];
    
    // 初始化以太坊服务
    if (!this.ethereumService) {
      this.ethereumService = new EthereumWalletService();
    }
    services.push(this.ethereumService);
    
    // 初始化波场服务
    if (!this.tronService) {
      this.tronService = new TronWalletService();
    }
    services.push(this.tronService);
    
    return services;
  }

  static getActiveService(): IWeb3Service | null {
    // 优先检查已连接的钱包
    const services = this.getAllServices();
    const connectedService = services.find(service => service.isConnected);
    
    if (connectedService) {
      return connectedService;
    }
    
    // 如果没有已连接的钱包，返回null
    return null;
  }
}

// 类型定义，用于全局window对象
declare global {
  interface Window {
    ethereum?: any;
    tronWeb?: any;
  }
}

export default Web3ServiceFactory;