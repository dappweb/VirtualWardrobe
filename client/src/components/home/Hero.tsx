import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();
  
  return (
    <div className="relative overflow-hidden bg-white pt-14 pb-12 sm:pt-20 sm:pb-16 lg:pb-20">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-y-0 -left-96 transform translate-x-1/4 blur-3xl opacity-30">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary-200 to-accent-300 opacity-30"></div>
        </div>
        <div className="absolute -top-56 -right-96 w-[50rem] transform rotate-[30deg] blur-3xl">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-secondary-200 to-primary-300 opacity-30"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 items-center">
            {/* 左侧内容区域 */}
            <div className="mx-auto max-w-2xl lg:mx-0 relative z-10">
              <div className="inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-1 text-sm font-medium text-primary-700 ring-1 ring-inset ring-primary-700/10 mb-6">
                <span>{t('home.hero.tagline', '区块链驱动')}</span>
                <span className="inline-flex items-center space-x-1 rounded-full bg-white px-2 py-0.5 ml-2 text-xs font-semibold text-primary-700">
                  Beta
                </span>
              </div>
            
              <h1 className="text-5xl font-bold tracking-tight text-neutral-900 sm:text-6xl font-display">
                <span className="block">{t('home.hero.title')}</span>
                <span className="block text-accent-500 mt-2">{t('home.hero.subtitle')}</span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-neutral-600">
                {t('home.hero.description', '革命性平台，连接实体时尚与数字资产。探索、收藏并拥有来自全球最具创新性设计师的独家作品。')}
              </p>
              
              <div className="mt-10 flex items-center gap-x-6">
                <Button 
                  className="rounded-full px-8 py-3 text-base font-semibold shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:shadow-primary-500/40"
                  onClick={() => window.location.href = "/assets"}
                >
                  {t('home.hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="rounded-full border-neutral-300 bg-white px-8 py-3 text-base font-semibold text-neutral-900 hover:bg-neutral-50"
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('home.learnMore', '了解更多')}
                </Button>
              </div>
              
              <div className="mt-10 flex items-center">
                <div className="flex -space-x-2 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`inline-block h-10 w-10 rounded-full ring-2 ring-white bg-gradient-to-br ${
                      i === 1 ? 'from-pink-500 to-rose-500' :
                      i === 2 ? 'from-blue-500 to-indigo-500' :
                      i === 3 ? 'from-green-500 to-emerald-500' :
                      i === 4 ? 'from-amber-500 to-orange-500' :
                      'from-purple-500 to-violet-500'
                    }`}></div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-700">
                    {t('home.hero.userCount', '25,000+ 用户已加入')}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {t('home.hero.userTag', '时尚设计师、收藏家和爱好者')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 右侧图像区域 */}
            <div className="relative mt-8 h-96 lg:mt-0 lg:h-auto overflow-hidden rounded-xl shadow-2xl lg:shadow-xl">
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
                  alt={t('home.hero.imageAlt', '数字时尚资产')} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 to-transparent mix-blend-multiply"></div>
              </div>
              
              <div className="absolute left-4 right-4 bottom-4 rounded-lg bg-primary-800/80 backdrop-blur-sm p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                      CSQ
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t('home.hero.featuredAsset', '精选资产')}</p>
                    <p className="text-xs text-neutral-200">{t('home.hero.assetDesc', '限量版数字化服装，区块链验证')}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-md bg-green-700 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-green-500/30">
                      + 128% {t('home.hero.value', '价值增长')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
