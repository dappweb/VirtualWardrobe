import { Link } from "wouter";
import { Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-700">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h2 className="text-2xl font-display font-bold text-white">
              Chuang<span className="text-accent-300">SiQi</span>
            </h2>
            <p className="mt-2 text-sm text-neutral-300">
              Bridging fashion's physical and digital worlds through blockchain-verified assets.
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white">
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase">Platform</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#how-it-works" className="text-base text-neutral-400 hover:text-white">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  For Brands
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Press
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-neutral-400 hover:text-white">
                  Licensing
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-neutral-700 pt-8">
          <p className="text-base text-neutral-400 text-center">
            &copy; {new Date().getFullYear()} 创思奇 (Chuangsiqi). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
