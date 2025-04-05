import { Package, CreditCard, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-neutral-900">How It Works</h2>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-neutral-500">
            Discover how our platform connects fashion brands with digital collectors
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-600 mb-6">
                <Package className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">1. Discover Assets</h3>
              <p className="mt-4 text-neutral-600">
                Browse through our curated collection of fashion assets from innovative brands and designers. Each asset represents a real-world fashion item with verified authenticity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 text-accent-600 mb-6">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">2. Purchase with Confidence</h3>
              <p className="mt-4 text-neutral-600">
                Securely purchase digital assets with blockchain-verified ownership. Choose from fixed price options with transparent transaction details and no hidden fees.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                <Archive className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">3. Manage Your Collection</h3>
              <p className="mt-4 text-neutral-600">
                Build and showcase your personal collection of fashion assets. Track their authenticity, history, and value over time through our intuitive management interface.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Button className="inline-flex items-center px-8 py-3 shadow-sm">
            Read Our Full Guide
          </Button>
        </div>
      </div>
    </section>
  );
}
