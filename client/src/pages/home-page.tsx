import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import AssetCollection from "@/components/home/AssetCollection";
import HowItWorks from "@/components/home/HowItWorks";
import RegisterCTA from "@/components/home/RegisterCTA";
import Web3Stats from "@/components/home/Web3Stats";
import FinancialInsights from "@/components/home/FinancialInsights";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* 主要视觉部分 */}
        <div className="bg-gradient-to-b from-white to-neutral-50">
          <Hero />
          <Web3Stats />
        </div>
        
        {/* 资产与品牌展示部分 */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-50 to-white z-0"></div>
          <div className="relative z-10">
            <AssetCollection />
            <FeaturedBrands />
          </div>
        </div>
        
        {/* 金融与工作原理部分 */}
        <div className="bg-gradient-to-b from-white to-neutral-50">
          <FinancialInsights />
          <HowItWorks />
        </div>
        
        {/* 注册呼吁部分 */}
        <RegisterCTA />
      </main>
      <Footer />
    </div>
  );
}
