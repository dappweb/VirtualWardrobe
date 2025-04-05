import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, CheckCircle, Wallet } from "lucide-react";

export default function Web3Stats() {
  const { t } = useTranslation();
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  
  // 模拟数据增长动画效果
  useEffect(() => {
    const target1 = 250000; // 交易总量目标值
    const target2 = 10000; // 用户总数目标值
    const target3 = 500; // 品牌总数目标值
    const duration = 2000; // 动画持续时间（毫秒）
    const steps = 50; // 动画步数
    const step1 = target1 / steps;
    const step2 = target2 / steps;
    const step3 = target3 / steps;
    const interval = duration / steps;
    
    let current1 = 0;
    let current2 = 0;
    let current3 = 0;
    
    const timer = setInterval(() => {
      current1 += step1;
      current2 += step2;
      current3 += step3;
      
      if (current1 >= target1) {
        current1 = target1;
      }
      
      if (current2 >= target2) {
        current2 = target2;
      }
      
      if (current3 >= target3) {
        current3 = target3;
      }
      
      setCounter1(Math.floor(current1));
      setCounter2(Math.floor(current2));
      setCounter3(Math.floor(current3));
      
      if (current1 >= target1 && current2 >= target2 && current3 >= target3) {
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num.toString();
  };
  
  return (
    <section className="py-16 bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-900 font-display">
            {t('home.web3Stats.title', '区块链时尚经济')}
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
            {t('home.web3Stats.subtitle', 'FABRICVERSE利用区块链技术重新定义时尚产业，建立透明可信的数字资产交易平台')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 交易量统计卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100 relative overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full -mt-8 -mr-8 flex items-end justify-start opacity-50"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary-50 text-primary-600 mb-6">
                <TrendingUp className="h-7 w-7" />
              </div>
              
              <h3 className="text-5xl font-bold text-primary-900 mb-2">
                {formatNumber(counter1)}
              </h3>
              
              <p className="text-lg text-neutral-600 font-medium">
                {t('home.web3Stats.transactionVolume', '交易总量')}
              </p>
              
              <p className="mt-4 text-sm text-neutral-500">
                {t('home.web3Stats.transactionDesc', '基于区块链验证的安全交易记录')}
              </p>
              
              <div className="mt-4 inline-flex items-center text-sm text-green-600 font-medium">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
                  </svg>
                  +23.6% {t('home.web3Stats.fromLastMonth', '较上月')}
                </span>
              </div>
            </div>
          </div>
          
          {/* 用户统计卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100 relative overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-50 rounded-bl-full -mt-8 -mr-8 flex items-end justify-start opacity-50"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-secondary-50 text-secondary-600 mb-6">
                <Wallet className="h-7 w-7" />
              </div>
              
              <h3 className="text-5xl font-bold text-primary-900 mb-2">
                {formatNumber(counter2)}
              </h3>
              
              <p className="text-lg text-neutral-600 font-medium">
                {t('home.web3Stats.totalUsers', '用户总数')}
              </p>
              
              <p className="mt-4 text-sm text-neutral-500">
                {t('home.web3Stats.usersDesc', '全球时尚爱好者和收藏家社区')}
              </p>
              
              <div className="mt-4 inline-flex items-center text-sm text-green-600 font-medium">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
                  </svg>
                  +18.2% {t('home.web3Stats.fromLastMonth', '较上月')}
                </span>
              </div>
            </div>
          </div>
          
          {/* 品牌统计卡片 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-neutral-100 relative overflow-hidden transition-all hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-bl-full -mt-8 -mr-8 flex items-end justify-start opacity-50"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-accent-50 text-accent-600 mb-6">
                <CheckCircle className="h-7 w-7" />
              </div>
              
              <h3 className="text-5xl font-bold text-primary-900 mb-2">
                {formatNumber(counter3)}
              </h3>
              
              <p className="text-lg text-neutral-600 font-medium">
                {t('home.web3Stats.verifiedBrands', '认证品牌')}
              </p>
              
              <p className="mt-4 text-sm text-neutral-500">
                {t('home.web3Stats.brandsDesc', '独特设计作品的知名时尚品牌')}
              </p>
              
              <div className="mt-4 inline-flex items-center text-sm text-green-600 font-medium">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L7 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
                  </svg>
                  +15.7% {t('home.web3Stats.fromLastMonth', '较上月')}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 底部指标图表 */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-neutral-100">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-primary-900">
              {t('home.web3Stats.marketTrends', '市场趋势指标')}
            </h3>
            <div className="flex space-x-4">
              <button className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                {t('home.web3Stats.daily', '日')}
              </button>
              <button className="text-sm font-medium text-neutral-600 hover:text-primary-600 px-3 py-1 rounded-full">
                {t('home.web3Stats.weekly', '周')}
              </button>
              <button className="text-sm font-medium text-neutral-600 hover:text-primary-600 px-3 py-1 rounded-full">
                {t('home.web3Stats.monthly', '月')}
              </button>
            </div>
          </div>
          
          {/* 简化图表 - 使用CSS创建柱状图 */}
          <div className="h-64 w-full">
            <div className="flex items-end justify-between h-full px-2">
              {[35, 55, 45, 75, 65, 85, 90, 65, 75, 80, 95, 60].map((height, index) => (
                <div key={index} className="w-full mx-1 flex flex-col items-center">
                  <div 
                    className={`w-full rounded-t-md ${
                      index === 6 ? 'bg-primary-500' : 'bg-primary-200'
                    } transition-all duration-500 ease-in-out hover:bg-primary-400 animate-grow-up`}
                    style={{ 
                      height: `${height}%`,
                      animationDelay: `${index * 0.1}s` 
                    }}
                  ></div>
                  <div className="text-xs text-neutral-500 mt-2">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 border-t border-neutral-100 pt-6 flex justify-between text-sm text-neutral-500">
            <div>
              {t('home.web3Stats.dataSource', '数据来源')}: {t('home.web3Stats.platform', 'FABRICVERSE平台')}
            </div>
            <div>
              {t('home.web3Stats.lastUpdated', '最后更新')}: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}