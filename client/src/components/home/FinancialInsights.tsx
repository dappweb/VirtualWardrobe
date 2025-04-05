import { useTranslation } from "react-i18next";
import { 
  CreditCard, 
  LineChart, 
  PieChart, 
  BadgeDollarSign, 
  Coins, 
  Scale,
  TrendingUp,
  TrendingDown,
  Gem
} from "lucide-react";

export default function FinancialInsights() {
  const { t } = useTranslation();
  
  // 虚拟数据 - 仅用于展示
  const marketData = [
    { name: t('finance.luxuryAssets', '奢侈品资产'), value: 38.5 },
    { name: t('finance.streetwear', '潮流服饰'), value: 27.2 },
    { name: t('finance.limitedEdition', '限量版作品'), value: 22.6 },
    { name: t('finance.nftCollections', '数字收藏品'), value: 11.7 }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-primary-800 sm:text-4xl mb-4">
            {t('finance.sectionTitle', '资产金融洞察')}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-neutral-600">
            {t('finance.sectionSubtitle', '深入数据分析，把握市场趋势，优化投资组合，实现资产增值')}
          </p>
        </div>
        
        {/* 市场概览卡片 */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 shadow-sm mb-10">
          <div className="flex items-center mb-4">
            <LineChart className="h-7 w-7 text-primary-700 mr-3" />
            <h3 className="text-2xl font-bold text-primary-800">
              {t('finance.marketOverview', '市场概览')}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">{t('finance.totalVolume', '总交易量')}</span>
                <BadgeDollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold mt-2">¥42.6M</p>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12.4%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">{t('finance.activeAssets', '活跃资产')}</span>
                <Gem className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-2">1,245</p>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+5.8%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">{t('finance.avgAssetValue', '平均资产价值')}</span>
                <Scale className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold mt-2">¥34,250</p>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+8.2%</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">{t('finance.liquidity', '流动性')}</span>
                <Coins className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-2xl font-bold mt-2">72.5%</p>
              <div className="flex items-center mt-1 text-red-600 text-sm">
                <TrendingDown className="h-4 w-4 mr-1" />
                <span>-2.1%</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 中间图表与金融数据分析 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* 市场分布 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100">
            <div className="flex items-center mb-4">
              <PieChart className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-bold text-primary-800">
                {t('finance.marketDistribution', '市场分布')}
              </h3>
            </div>
            
            <div className="space-y-3 mt-6">
              {marketData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-neutral-600">{item.name}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-primary-500' : 
                        index === 1 ? 'bg-secondary-500' : 
                        index === 2 ? 'bg-accent-500' : 
                        'bg-emerald-500'
                      }`} 
                      style={{width: `${item.value}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 投资组合分析 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 col-span-2">
            <div className="flex items-center mb-6">
              <LineChart className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg font-bold text-primary-800">
                {t('finance.portfolioAnalysis', '投资组合分析')}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('finance.returnOnInvestment', '投资回报率 (ROI)')}
                  </h4>
                  <div className="flex items-end space-x-1">
                    <span className="text-3xl font-bold text-primary-800">18.7%</span>
                    <span className="text-sm text-green-600 font-medium pb-1">↑ 2.4%</span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    {t('finance.comparedToPrevious', '对比上一季度')}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('finance.performingAssets', '表现最佳资产类别')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-800 font-medium">
                        {t('finance.limitedEditionSneakers', '限量版球鞋')}
                      </span>
                      <span className="text-green-600 font-medium">+32.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-800 font-medium">
                        {t('finance.vintageArchiveClothing', '复古档案服装')}
                      </span>
                      <span className="text-green-600 font-medium">+24.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-800 font-medium">
                        {t('finance.designerCollaborations', '设计师合作系列')}
                      </span>
                      <span className="text-green-600 font-medium">+19.3%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('finance.marketSentiment', '市场情绪指数')}
                  </h4>
                  <div className="h-8 w-full bg-neutral-100 rounded-full">
                    <div 
                      className="h-8 rounded-full bg-gradient-to-r from-green-500 to-primary-500 flex items-center pl-4"
                      style={{width: '75%'}}
                    >
                      <span className="text-white text-sm font-medium">75 - {t('finance.bullish', '看涨')}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('finance.riskAssessment', '风险评估')}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <span className="text-xs text-neutral-600">{t('finance.low', '低')}</span>
                      <p className="text-green-700 font-bold">42%</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                      <span className="text-xs text-neutral-600">{t('finance.medium', '中')}</span>
                      <p className="text-amber-700 font-bold">35%</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <span className="text-xs text-neutral-600">{t('finance.high', '高')}</span>
                      <p className="text-red-700 font-bold">23%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-neutral-500 mb-2">
                    {t('finance.liquidityScore', '流动性评分')}
                  </h4>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-primary-700">8.4</div>
                    <div className="ml-4 flex-1">
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-primary-500 h-2 rounded-full" style={{width: '84%'}}></div>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">{t('finance.outOf', '满分 10 分')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部CTA */}
        <div className="bg-gradient-to-r from-secondary-500 to-primary-600 rounded-xl p-8 text-white text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-4">{t('finance.readyToInvest', '准备开始您的时尚资产投资旅程？')}</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            {t('finance.investCta', '立即注册，连接钱包，探索数字化时尚资产的无限可能')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-100 transition-colors">
              {t('finance.connectWallet', '连接钱包')}
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors">
              {t('finance.exploreAssets', '探索资产')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}