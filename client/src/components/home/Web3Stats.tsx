import { useTranslation } from "react-i18next";
import { Coins, TrendingUp, BarChart3, ShieldCheck, Wallet, Share2 } from "lucide-react";

export default function Web3Stats() {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary-800 sm:text-4xl mb-4">
            {t('home.web3.title', '区块链授权·资产确权·价值传递')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-neutral-600">
            {t('home.web3.subtitle', '基于区块链技术的实体资产数字化平台，为服装产业提供高效透明的资产管理与交易方案')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mt-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900">
                {t('home.web3.tokenization', '资产通证化')}
              </h3>
            </div>
            <p className="text-neutral-600">
              {t('home.web3.tokenizationDesc', '将实体服装资产转化为区块链上的数字资产，确保每件藏品独一无二且可验证')}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900">
                {t('home.web3.marketStats', '市场流动性')}
              </h3>
            </div>
            <p className="text-neutral-600">
              {t('home.web3.marketStatsDesc', '平台月交易量超过¥5,000,000，年增长率达128%，资产流动性持续提升')}
            </p>
            <div className="mt-4 bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-neutral-500">{t('home.web3.tradingVolume', '交易量')}</span>
                <span className="text-sm font-medium text-green-600">+23.5%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mr-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary-900">
                {t('home.web3.security', '安全可信')}
              </h3>
            </div>
            <p className="text-neutral-600">
              {t('home.web3.securityDesc', '多链钱包支持，智能合约安全审计，确保交易透明且不可篡改')}
            </p>
            <div className="mt-4 flex space-x-2">
              <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-sm text-blue-700 font-medium">ETH</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                <p className="text-sm text-red-700 font-medium">TRON</p>
              </div>
              <div className="flex-1 bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-sm text-yellow-700 font-medium">BSC</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center mb-6">
              <Wallet className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">{t('home.web3.wallet', '数字钱包')}</h3>
            </div>
            <p className="mb-6 text-indigo-100">
              {t('home.web3.walletDesc', '连接钱包立即开始您的数字资产之旅，平台支持多种主流钱包')}
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                MetaMask
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                TronLink
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                WalletConnect
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                Coinbase
              </div>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <div>
                <p className="text-sm text-indigo-100">{t('home.web3.totalUsers', '总用户')}</p>
                <p className="text-2xl font-bold">25,800+</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100">{t('home.web3.activeWallets', '活跃钱包')}</p>
                <p className="text-2xl font-bold">8,500+</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-neutral-100">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-8 h-8 text-primary-600 mr-3" />
              <h3 className="text-2xl font-bold text-primary-800">{t('home.web3.marketTrends', '市场趋势')}</h3>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 font-medium">{t('home.web3.luxuryFashion', '奢侈品服装')}</span>
                  <span className="text-green-600 font-medium">+18.7%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '65%'}}></div>
                </div>
              </div>
              
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 font-medium">{t('home.web3.streetwear', '潮流街头')}</span>
                  <span className="text-green-600 font-medium">+32.4%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div className="border-b border-neutral-100 pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 font-medium">{t('home.web3.sustainableFashion', '可持续服装')}</span>
                  <span className="text-green-600 font-medium">+24.8%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between">
              <div className="text-center">
                <p className="text-sm text-neutral-500">{t('home.web3.lastMonth', '上月交易')}</p>
                <p className="text-xl font-bold text-neutral-800">¥320万</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500">{t('home.web3.todayVolume', '今日交易')}</p>
                <p className="text-xl font-bold text-neutral-800">¥42.5万</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-500">{t('home.web3.avgPrice', '平均价格')}</p>
                <p className="text-xl font-bold text-neutral-800">¥5,680</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}