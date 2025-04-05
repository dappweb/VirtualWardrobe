import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { Bell, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import LanguageSwitcher from "./LanguageSwitcher";
import VirtualWallet from "@/components/user/VirtualWallet";

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Function to get user's initials
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    const names = user.username.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <h1 className="text-2xl font-display font-bold text-primary-700 cursor-pointer">
                  FABRIC<span className="text-accent-500">VERSE</span>
                </h1>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <div
                className={`${
                  isActive("/")
                    ? "border-accent-500 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                onClick={() => navigate('/')}
              >
                {t('nav.home')}
              </div>
              <div
                className={`${
                  isActive("/brands")
                    ? "border-accent-500 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
                onClick={() => navigate('/brands')}
              >
                {t('nav.brands')}
              </div>
              <div
                className={`${
                  isActive("/assets")
                    ? "border-accent-500 text-neutral-900"
                    : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}
                onClick={() => navigate('/assets')}
              >
                {t('nav.assets')}
              </div>
              <a
                href="#how-it-works"
                className="border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                {t('nav.about')}
              </a>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <LanguageSwitcher />
            <button 
              type="button" 
              className="bg-white p-1 rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            
            {user ? (
              <>
                {/* 虚拟钱包组件 - 仅对买家显示 */}
                {user.role === 'buyer' && <VirtualWallet />}
                
                <Link href="/profile">
                  <Button variant="secondary">{t('profile.title')}</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-white p-1 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-secondary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                      {getUserInitials()}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">{t('nav.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings">{t('common.settings')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      {t('auth.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="secondary">{t('profile.wallet.connectWallet')}</Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline">{t('nav.login')}</Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  type="button" 
                  className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary-500"
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h1 className="text-xl font-display font-bold text-primary-700">
                      FABRIC<span className="text-accent-500">VERSE</span>
                    </h1>
                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                  
                  <div className="space-y-3">
                    <SheetClose>
                      <Button 
                        variant={isActive("/") ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => navigate("/")}
                      >
                        {t('nav.home')}
                      </Button>
                    </SheetClose>
                    <SheetClose>
                      <Button 
                        variant={isActive("/brands") ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => navigate("/brands")}
                      >
                        {t('nav.brands')}
                      </Button>
                    </SheetClose>
                    <SheetClose>
                      <Button 
                        variant={isActive("/assets") ? "default" : "ghost"} 
                        className="w-full justify-start"
                        onClick={() => navigate("/assets")}
                      >
                        {t('nav.assets')}
                      </Button>
                    </SheetClose>
                    <Button variant="ghost" className="w-full justify-start">
                      {t('nav.about')}
                    </Button>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    {user ? (
                      <>
                        {/* 虚拟钱包组件 - 仅对买家显示 */}
                        {user.role === 'buyer' && (
                          <div className="mb-4">
                            <VirtualWallet />
                          </div>
                        )}
                      
                        <SheetClose>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate("/profile")}
                          >
                            {t('profile.title')}
                          </Button>
                        </SheetClose>
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={handleLogout}
                        >
                          {t('auth.logout')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <SheetClose>
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => navigate("/auth")}
                          >
                            {t('profile.wallet.connectWallet')}
                          </Button>
                        </SheetClose>
                        <SheetClose>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => navigate("/auth")}
                          >
                            {t('nav.login')}
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
