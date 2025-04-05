import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function RegisterCTA() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, registerMutation } = useAuth();
  
  // Form schema with translations
  const formSchema = z.object({
    email: z.string().email({ message: t('validation.email', 'Please enter a valid email address') }),
    password: z.string().min(8, { message: t('validation.password.minLength', 'Password must be at least 8 characters') }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine(val => val === true, {
      message: t('validation.acceptTerms', 'You must accept the terms and conditions'),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.password.match', 'Passwords don\'t match'),
    path: ["confirmPassword"],
  });

  type FormValues = z.infer<typeof formSchema>;
  
  // If the user is already logged in, don't show the register form
  if (user) {
    return null;
  }
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });
  
  function onSubmit(values: FormValues) {
    navigate("/auth");
  }
  
  return (
    <section className="relative overflow-hidden py-20">
      {/* 背景图案 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90"></div>
        <svg
          className="absolute inset-0 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-primary-800/20">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect width="100%" height="100%" strokeWidth={0} fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* 左侧内容 */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6">
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {t('home.registerCTA.badge', '开放测试中')}
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white font-display mb-6">
              {t('home.registerCTA.title', '加入FABRICVERSE')}
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-lg lg:mx-0 mx-auto">
              {t('home.registerCTA.subtitle', '连接您的数字钱包，开始您的时尚资产交易之旅')}
            </p>
            
            <div className="hidden lg:block">
              <div className="flex items-center space-x-8 mb-8">
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit1', '区块链安全验证')}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit2', '多钱包支持')}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-2 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit3', '零平台费用')}</span>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  className="rounded-full px-8 py-6 text-base font-semibold bg-white text-primary-900 hover:bg-white/90"
                  onClick={() => window.location.href = "/auth"}
                >
                  {t('home.registerCTA.button', '立即注册')}
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full px-8 py-6 text-base font-semibold text-white border-white/30 bg-white/10 hover:bg-white/20"
                  onClick={() => window.location.href = "/assets"}
                >
                  {t('home.registerCTA.explore', '探索资产')}
                </Button>
              </div>
              
              <div className="mt-10">
                <p className="text-white/60 text-sm mb-4">{t('home.registerCTA.walletSupport', '支持的钱包')}</p>
                <div className="flex items-center space-x-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">MetaMask</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">TronLink</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">WalletConnect</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧注册表单 */}
          <div className="bg-white shadow-2xl rounded-2xl p-8 relative">
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-accent-500 to-primary-500 text-white text-xs font-bold px-4 py-1 rounded-full">
              {t('home.registerCTA.formBadge', 'Web3认证')}
            </div>
            
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 font-display">
              {t('auth.register.title', '创建账户')}
            </h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">{t('auth.register.email', '电子邮箱')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('home.registerCTA.emailPlaceholder', '输入您的邮箱地址')} 
                          className="rounded-lg py-6" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">{t('auth.register.password', '密码')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="rounded-lg py-6" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-700">{t('auth.register.confirmPassword', '确认密码')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="rounded-lg py-6" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-neutral-600 font-normal">
                          {t('auth.register.acceptTerms', '我同意')} 
                          <a href="#" className="text-primary-600 hover:text-primary-500 mx-1">{t('footer.links.terms', '服务条款')}</a> 
                          {t('common.and', '和')} 
                          <a href="#" className="text-primary-600 hover:text-primary-500 mx-1">{t('footer.links.privacy', '隐私政策')}</a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full py-6 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transition-all"
                >
                  {t('home.registerCTA.button', '立即注册')}
                </Button>
              </form>
            </Form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-neutral-500">
                    {t('auth.register.continueWith', '或使用以下方式')}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6 rounded-lg border-neutral-200 hover:bg-neutral-50"
                  onClick={() => window.location.href = "/auth"}
                >
                  <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                  Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center py-6 rounded-lg border-neutral-200 hover:bg-neutral-50"
                  onClick={() => window.location.href = "/auth"}
                >
                  <svg className="h-5 w-5 mr-2 text-neutral-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm">
              <p className="text-neutral-600">
                {t('auth.register.hasAccount', '已有账户？')}{" "}
                <button 
                  className="font-medium text-primary-600 hover:text-primary-500"
                  onClick={() => window.location.href = "/auth"}
                >
                  {t('auth.register.login', '立即登录')}
                </button>
              </p>
            </div>
          </div>
          
          {/* 移动端优势说明 */}
          <div className="lg:hidden mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="text-white text-lg font-medium mb-4">
                {t('home.registerCTA.benefitsTitle', '注册账户的优势')}
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit1', '区块链安全验证')}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit2', '多钱包支持')}</span>
                </div>
                <div className="flex items-center text-white/90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 mr-3 text-green-400" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{t('home.registerCTA.benefit3', '零平台费用')}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-white/60 text-sm mb-3">{t('home.registerCTA.walletSupport', '支持的钱包')}</p>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">MetaMask</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">TronLink</div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs">WalletConnect</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
