import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// 导入ThirdWeb的ConnectWallet组件
import { ConnectWallet } from "@thirdweb-dev/react";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Please enter your password" }),
});

// Register form schema
const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const { login } = useWeb3Auth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  function onLoginSubmit(values: LoginFormValues) {
    loginMutation.mutate(values);
  }
  
  function onRegisterSubmit(values: RegisterFormValues) {
    const { username, email, password } = values;
    registerMutation.mutate({ username, email, password });
  }
  
  // If already logged in, wait for redirect
  if (user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary-500" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Left side - Auth forms */}
            <div className="lg:w-1/2 p-8 lg:p-12">
              <h2 className="text-3xl font-display font-bold text-neutral-900">
                Welcome to 创思奇 (Chuangsiqi)
              </h2>
              <p className="mt-3 text-neutral-500">
                Connect to the future of fashion and digital asset ownership
              </p>
              
              <Tabs defaultValue="login" className="mt-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                {/* Login Form */}
                <TabsContent value="login" className="py-4">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <a href="#" className="text-secondary-600 hover:text-secondary-500">
                            Forgot your password?
                          </a>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign in"
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <ConnectWallet 
                        theme="light"
                        btnTitle="使用Web3钱包登录"
                        modalTitle="连接钱包"
                        modalSize="wide"
                        welcomeScreen={{
                          title: "选择钱包连接方式",
                          subtitle: "请选择您要连接的钱包，连接后将自动完成认证"
                        }}
                        className="w-full !py-2 !font-normal"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                {/* Register Form */}
                <TabsContent value="register" className="py-4">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="text-sm">
                        <p className="text-neutral-500">
                          By registering, you agree to our{" "}
                          <a href="#" className="text-secondary-600 hover:text-secondary-500">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-secondary-600 hover:text-secondary-500">
                            Privacy Policy
                          </a>
                        </p>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-neutral-500">Or register with</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <ConnectWallet 
                        theme="light"
                        btnTitle="使用Web3钱包注册"
                        modalTitle="连接钱包"
                        modalSize="wide"
                        welcomeScreen={{
                          title: "选择钱包连接方式",
                          subtitle: "请选择您要连接的钱包，连接后将自动完成注册"
                        }}
                        className="w-full !py-2 !font-normal"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right side - Hero section */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-primary-700 to-secondary-700 p-12 text-white flex flex-col justify-center">
              <div>
                <h1 className="text-4xl font-display font-bold">
                  创思<span className="text-accent-300">奇</span>
                </h1>
                <h2 className="mt-6 text-3xl font-display font-bold">
                  The Future of Fashion Assets
                </h2>
                <p className="mt-4 text-white/80 text-lg">
                  Connect, collect, and own authentic fashion assets from the world's most innovative designers and brands.
                </p>
                <div className="mt-10 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-white/80">
                      <span className="font-semibold text-white">Authentic RWA Assets</span> - Own digital tokens backed by real-world fashion pieces
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-white/80">
                      <span className="font-semibold text-white">Blockchain Verified</span> - Every asset comes with tamper-proof ownership records
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-accent-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-white/80">
                      <span className="font-semibold text-white">Exclusive Collections</span> - Access limited edition pieces from top fashion brands
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
