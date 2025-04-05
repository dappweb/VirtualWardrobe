import { 
  Package, 
  CreditCard, 
  Archive, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function HowItWorks() {
  const { t } = useTranslation();
  
  return (
    <section id="how-it-works" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNCQkJCQkIiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center">
          <span className="bg-accent-50 text-accent-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
            {t('home.howItWorks.badge', '简单三步')}
          </span>
          
          <h2 className="text-4xl font-display font-bold text-primary-900 text-center max-w-3xl">
            {t('home.howItWorks.title')}
          </h2>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600 text-center">
            {t('home.howItWorks.description', '了解我们的平台如何连接时尚品牌与数字收藏家，创造全新的价值交换模式')}
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 relative">
            {/* 连接线条 - 仅在大屏幕显示 */}
            <div className="hidden md:block absolute top-24 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gradient-to-r from-secondary-200 via-accent-200 to-primary-200"></div>
            
            {/* 步骤1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 h-full transition-all hover:shadow-xl hover:border-secondary-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg">
                    <span className="text-lg font-bold">1</span>
                  </div>
                </div>
                
                <div className="pt-6 text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-secondary-50 text-secondary-600 mb-4">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {t('home.howItWorks.step1.title')}
                  </h3>
                </div>
                
                <p className="text-neutral-600 text-center">
                  {t('home.howItWorks.step1.longDescription', 
                    '浏览我们精心策划的时尚资产集合，来自创新品牌和设计师。每项资产代表一件经过验证的真实时尚单品。')}
                </p>
                
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-secondary-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.verification', '区块链验证')}</span>
                    </div>
                    <div className="flex items-center text-secondary-700">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.exclusivity', '独家资产')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 步骤2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 h-full transition-all hover:shadow-xl hover:border-accent-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-lg">
                    <span className="text-lg font-bold">2</span>
                  </div>
                </div>
                
                <div className="pt-6 text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-accent-50 text-accent-600 mb-4">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {t('home.howItWorks.step2.title')}
                  </h3>
                </div>
                
                <p className="text-neutral-600 text-center">
                  {t('home.howItWorks.step2.longDescription', 
                    '安全购买具有区块链验证所有权的数字资产。选择透明交易详情和无隐藏费用的固定价格选项。')}
                </p>
                
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-accent-700">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.payment', '安全支付')}</span>
                    </div>
                    <div className="flex items-center text-accent-700">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.ownership', '所有权证明')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 步骤3 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-neutral-100 p-8 h-full transition-all hover:shadow-xl hover:border-primary-200">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg">
                    <span className="text-lg font-bold">3</span>
                  </div>
                </div>
                
                <div className="pt-6 text-center mb-6">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-lg bg-primary-50 text-primary-600 mb-4">
                    <Archive className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {t('home.howItWorks.step3.title')}
                  </h3>
                </div>
                
                <p className="text-neutral-600 text-center">
                  {t('home.howItWorks.step3.longDescription', 
                    '构建并展示您的个人时尚资产收藏。通过我们直观的管理界面跟踪它们的真实性、历史和价值变化。')}
                </p>
                
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-primary-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.portfolio', '资产组合')}</span>
                    </div>
                    <div className="flex items-center text-primary-700">
                      <Sparkles className="h-4 w-4 mr-1" />
                      <span>{t('home.howItWorks.valueGrowth', '价值增长')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button 
            className="inline-flex items-center px-8 py-3 shadow-sm rounded-full hover:shadow-lg transition-all"
            onClick={() => window.location.href = "/guide"}
          >
            {t('home.howItWorks.readGuide', '阅读完整指南')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
