# FABRICVERSE - 服装产业元宇宙RWA交易平台

FABRICVERSE是一个创新的服装产业元宇宙平台，专注于实物资产（RWA）的数字化和交易。该平台允许时尚品牌将实体服装产品通过区块链技术进行数字化，并创建可交易的数字资产，为设计师和收藏家提供一个安全、透明的交易生态系统。

## 项目特点

- **多角色支持**：买家、品牌租户和平台管理员
- **Web3钱包集成**：支持以太坊和波场(TRON)区块链
- **多语言支持**：中文、英文、日文和韩文
- **虚拟代币系统**：用于平台内资产交易
- **品牌验证机制**：确保平台上的品牌真实可信
- **RWA资产数字化**：实物资产与数字通证的绑定

## 技术栈

- **前端**：React + TypeScript + Vite
- **样式**：Tailwind CSS + ShadcnUI
- **状态管理**：React Query
- **Web3集成**：thirdweb SDK, ethers.js, TronWeb
- **路由**：wouter
- **表单处理**：React Hook Form + Zod
- **国际化**：i18next

## 部署指南

### 环境要求

- Node.js 20.x 或更高版本
- npm 10.x 或更高版本

### 安装步骤

1. **克隆项目代码**

```bash
git clone <repository-url>
cd fabricverse
```

2. **安装依赖**

```bash
npm install
```

3. **设置环境变量**

创建`.env`文件并配置以下环境变量：

```
# 会话密钥 (必需)
SESSION_SECRET=your_strong_session_secret

# 区块链相关配置 (可选)
CHAIN_ID=1
RPC_URL=https://mainnet.infura.io/v3/your_infura_key

# 虚拟代币兑换比率 (可选，默认值为1)
TOKEN_EXCHANGE_RATE=100
```

4. **启动开发服务器**

```bash
npm run dev
```

5. **构建生产版本**

```bash
npm run build
```

6. **启动生产服务器**

```bash
npm start
```

## 数据结构

项目使用内存存储数据，数据模型如下：

### 用户(Users)

```typescript
{
  id: number;              // 用户ID
  username: string;        // 用户名
  email: string;           // 电子邮箱
  password: string;        // 密码(哈希存储)
  role: 'buyer' | 'tenant' | 'admin';  // 用户角色
  walletAddress?: string;  // 区块链钱包地址
  walletType?: 'ethereum' | 'tron';  // 钱包类型
  tokenBalance: number;    // 平台代币余额
  createdAt: Date;         // 创建时间
  verified: boolean;       // 是否验证
  verificationStatus?: 'pending' | 'approved' | 'rejected';  // 租户验证状态
  companyName?: string;    // 公司名称(租户)
  companyRegistrationNumber?: string;  // 公司注册号(租户)
  companyAddress?: string; // 公司地址(租户)
  contactPerson?: string;  // 联系人(租户)
  contactPhone?: string;   // 联系电话(租户)
}
```

### 品牌(Brands)

```typescript
{
  id: number;              // 品牌ID
  name: string;            // 品牌名称
  description: string;     // 品牌描述
  logoUrl: string;         // 品牌logo URL
  website?: string;        // 品牌网站
  tenantId: number;        // 关联租户ID
  verified: boolean;       // 是否验证
  createdAt: Date;         // 创建时间
  socialMedia?: {          // 社交媒体信息
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
}
```

### 资产(Assets)

```typescript
{
  id: number;              // 资产ID
  name: string;            // 资产名称
  description: string;     // 资产描述
  imageUrl: string;        // 资产图片URL
  price: number;           // 资产价格
  brandId: number;         // 关联品牌ID
  category: string;        // 资产类别
  blockchain: string;      // 区块链网络
  tokenId?: string;        // 区块链Token ID
  limited: boolean;        // 是否限量版
  editionNumber?: number;  // 版号
  totalEditions?: number;  // 总版数
  available: boolean;      // 是否可购买
  createdAt: Date;         // 创建时间
  metadata?: any;          // 额外元数据
}
```

### 用户资产(UserAssets)

```typescript
{
  id: number;              // 用户资产ID
  userId: number;          // 用户ID
  assetId: number;         // 资产ID
  purchaseDate: Date;      // 购买日期
  purchasePrice: number;   // 购买价格
  transactionHash?: string; // 交易哈希
}
```

## 测试账户

平台预设了三种角色的测试账户，可用于功能测试：

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 买家 | buyer@example.com | buyerpass | 普通用户账户，可浏览和购买资产 |
| 租户 | tenant@example.com | tenantpass | 品牌租户账户，可创建品牌和资产 |
| 管理员 | admin@example.com | adminpass | 管理员账户，可管理所有用户和内容 |

## 虚拟钱包使用说明

1. 买家用户登录后，导航栏会显示虚拟钱包余额
2. 点击余额可打开充值面板，增加代币余额
3. 浏览资产时，可使用虚拟代币购买喜欢的数字资产
4. 所有交易记录将在用户个人资料页面中可见

## 品牌租户使用指南

1. 使用租户账户登录系统
2. 完善公司资料并提交验证申请
3. 等待管理员审核通过
4. 创建品牌信息
5. 为品牌添加数字资产

## 常见问题

### 如何连接Web3钱包？
在登录后，点击右上角的"连接钱包"按钮，选择钱包类型(以太坊或波场)并按照提示完成连接。

### 如何申请成为品牌租户？
注册普通账户后，在设置页面申请角色升级，填写必要的公司信息并提交审核。

### 如何查看已购买的资产？
在个人资料页面的"我的收藏"标签中可以查看所有已购买的数字资产。

## 开发扩展

### 添加新的区块链支持

在`client/src/services/web3Service.ts`中添加新的区块链钱包服务类，实现`IWeb3Service`接口：

```typescript
class NewBlockchainService implements IWeb3Service {
  // 实现接口方法
}

// 在Web3ServiceFactory中注册
static getService(type: WalletType): IWeb3Service {
  // 添加新的钱包类型支持
}
```

### 自定义品牌页面

修改`client/src/pages/brand-details-page.tsx`文件，添加新的品牌展示组件和功能。

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 提交Pull Request

## 许可证

[MIT License](LICENSE)