import { useTranslation } from "react-i18next";
import { TrendingUp, BarChart3, DollarSign, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinancialInsights() {
  const { t } = useTranslation();
  
  // 顶级资产数据
  const topAssets = [
    { 
      id: 1, 
      name: "限量设计师夹克", 
      brand: "创思奇CSQ",
      price: 1250, 
      change: 12.4, 
      positive: true,
      imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
    },
    { 
      id: 2, 
      name: "定制高级西装", 
      brand: "优雅翔ELEGX",
      price: 2340, 
      change: 8.2, 
      positive: true,
      imageUrl: "https://images.unsplash.com/photo-1598808503746-f34cfbb3f1b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
    },
    { 
      id: 3, 
      name: "可持续面料连衣裙", 
      brand: "绿色梦想",
      price: 890, 
      change: -2.1, 
      positive: false,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
    },
    { 
      id: 4, 
      name: "数字艺术T恤", 
      brand: "未来视觉",
      price: 450, 
      change: 5.7, 
      positive: true,
      imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80" 
    }
  ];
  
  // 市场洞察数据
  const insights = [
    {
      id: 1,
      title: t('home.financial.insight1Title', '限量版设计资产价值增长'),
      content: t('home.financial.insight1Content', '限量版设计师资产在过去90天内平均增值超过25%，远高于传统投资渠道。'),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-green-50 text-green-700'
    },
    {
      id: 2,
      title: t('home.financial.insight2Title', '可持续时尚资产受追捧'),
      content: t('home.financial.insight2Content', '使用可持续材料创作的时尚资产在二级市场上的交易量增长了40%。'),
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      id: 3,
      title: t('home.financial.insight3Title', '数字收藏品流动性提高'),
      content: t('home.financial.insight3Content', '区块链技术的应用使得时尚数字收藏品的市场流动性提高了63%。'),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-purple-50 text-purple-700'
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 左侧 - 表现最好的资产 */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-900 font-display mb-2">
                {t('home.financial.topAssetsTitle', '表现最佳数字资产')}
              </h2>
              <p className="text-neutral-600">
                {t('home.financial.topAssetsSubtitle', '基于过去30天的价值增长')}
              </p>
            </div>
            
            <div className="space-y-4">
              {topAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="flex items-center p-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={asset.imageUrl} 
                        alt={asset.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-500 mb-1">{asset.brand}</p>
                      <h3 className="text-lg font-semibold text-neutral-900 truncate">
                        {asset.name}
                      </h3>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold text-neutral-900">
                        ¥{asset.price.toLocaleString()}
                      </div>
                      <div className={`flex items-center text-sm ${asset.positive ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.positive ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {asset.positive ? '+' : ''}{asset.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "/assets"}
              >
                {t('home.financial.viewAllAssets', '查看所有资产')}
              </Button>
            </div>
            
            {/* 市场总计 */}
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary-900">
                  {t('home.financial.marketSummary', '市场概况')}
                </h3>
                <span className="text-xs bg-white text-primary-700 rounded-full px-3 py-1">
                  {t('home.financial.liveData', '实时数据')}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">{t('home.financial.totalVolume', '总交易量')}</p>
                  <p className="text-xl font-bold text-neutral-900">¥1.24M</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +18.4%
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">{t('home.financial.avgPrice', '平均价格')}</p>
                  <p className="text-xl font-bold text-neutral-900">¥1,843</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +5.2%
                  </p>
                </div>
                
                <div className="bg-white bg-opacity-60 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-sm text-neutral-600 mb-1">{t('home.financial.holders', '持有者')}</p>
                  <p className="text-xl font-bold text-neutral-900">5,247</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12.7%
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧 - 市场洞察和趋势 */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-primary-900 font-display mb-2">
                {t('home.financial.insightsTitle', '市场洞察与趋势')}
              </h2>
              <p className="text-neutral-600">
                {t('home.financial.insightsSubtitle', '了解最新的时尚数字资产市场动态')}
              </p>
            </div>
            
            {/* 市场洞察部分 */}
            <div className="space-y-6 mb-10">
              {insights.map((insight) => (
                <div key={insight.id} className={`rounded-xl p-5 ${insight.color} bg-opacity-10`}>
                  <div className="flex items-start">
                    <div className={`${insight.color} bg-opacity-20 rounded-full p-2 mr-4`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {insight.title}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {insight.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 荣誉展示部分 */}
            <div className="bg-gradient-to-br from-accent-50 to-secondary-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-6 w-6 text-accent-600" />
                <h3 className="text-lg font-bold text-neutral-900">
                  {t('home.financial.recognitionTitle', '认可与荣誉')}
                </h3>
              </div>
              
              <ul className="space-y-3">
                <li className="flex items-center text-neutral-800">
                  <div className="h-2 w-2 rounded-full bg-secondary-500 mr-3"></div>
                  {t('home.financial.recognition1', '2024中国区块链创新应用奖')}
                </li>
                <li className="flex items-center text-neutral-800">
                  <div className="h-2 w-2 rounded-full bg-secondary-500 mr-3"></div>
                  {t('home.financial.recognition2', '亚洲时尚科技50强')}
                </li>
                <li className="flex items-center text-neutral-800">
                  <div className="h-2 w-2 rounded-full bg-secondary-500 mr-3"></div>
                  {t('home.financial.recognition3', '全球Web3时尚创新平台Top10')}
                </li>
              </ul>
            </div>
            
            {/* 注册区域 */}
            <div className="mt-8 bg-primary-900 text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-2">
                {t('home.financial.joinTitle', '加入FABRICVERSE，开启数字资产投资')}
              </h3>
              <p className="text-white/80 mb-4">
                {t('home.financial.joinSubtitle', '无论您是设计师、品牌方还是收藏家，都能从数字化资产中获益')}
              </p>
              <Button 
                className="w-full bg-white hover:bg-neutral-100 text-primary-900"
                onClick={() => window.location.href = "/auth"}
              >
                {t('home.financial.registerNow', '立即注册')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}