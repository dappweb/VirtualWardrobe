import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedBrands from "@/components/home/FeaturedBrands";
import AssetCollection from "@/components/home/AssetCollection";
import HowItWorks from "@/components/home/HowItWorks";
import RegisterCTA from "@/components/home/RegisterCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedBrands />
        <AssetCollection />
        <HowItWorks />
        <RegisterCTA />
      </main>
      <Footer />
    </div>
  );
}
