import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="pt-16 bg-white overflow-hidden">
      <div className="relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-bold text-neutral-900 sm:text-5xl md:text-6xl">
                  <span className="block font-display">Digital Fashion</span>
                  <span className="block text-accent-500 font-display mt-1">Real-World Assets</span>
                </h1>
                <p className="mt-3 text-base text-neutral-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0">
                  A revolutionary platform that bridges the gap between physical fashion and digital assets. Discover, collect, and own exclusive pieces from the world's most innovative fashion designers.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link href="/assets">
                      <Button className="w-full flex items-center justify-center px-8 py-3 text-base md:py-4 md:text-lg md:px-10">
                        Explore Collections
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link href="#how-it-works">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base md:py-4 md:text-lg md:px-10">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="hidden lg:block absolute right-0 inset-y-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
            alt="Fashion design abstract" 
            className="h-full w-auto object-cover" 
          />
        </div>
      </div>
    </div>
  );
}
