import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Brand, Asset } from "@shared/schema";
import { ProtectedRoute } from "@/lib/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  ExternalLink,
  AlertTriangle,
  Building,
  Image,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// 租户注册表单验证模式
const tenantRegistrationSchema = z.object({
  companyName: z.string().min(2, "公司名称至少需要2个字符"),
  contactPerson: z.string().min(2, "联系人姓名至少需要2个字符"),
  phoneNumber: z.string().optional(),
  email: z.string().email("请输入有效的电子邮箱").optional(),
  address: z.string().optional(),
  website: z.string().url("请输入有效的网址").optional(),
  businessLicense: z.string().optional(),
});

// 品牌创建表单验证模式
const brandCreationSchema = z.object({
  name: z.string().min(2, "品牌名称至少需要2个字符"),
  description: z.string().min(10, "品牌描述至少需要10个字符"),
  shortDescription: z.string().max(50, "简短描述不能超过50个字符").optional(),
  logoUrl: z.string().url("请输入有效的Logo URL").optional(),
  coverImageUrl: z.string().url("请输入有效的封面图片URL").optional(),
});

// 资产发行表单验证模式
const assetCreationSchema = z.object({
  name: z.string().min(2, "资产名称至少需要2个字符"),
  description: z.string().min(10, "资产描述至少需要10个字符"),
  price: z.number().min(1, "价格必须大于0"),
  imageUrl: z.string().url("请输入有效的图片URL"),
  category: z.string().optional(),
  limited: z.boolean().default(false),
  editionNumber: z.number().optional(),
  totalEditions: z.number().optional(),
  tokenId: z.string().optional(),
  blockchain: z.string().default("Ethereum"),
});

type TenantRegistrationValues = z.infer<typeof tenantRegistrationSchema>;
type BrandCreationValues = z.infer<typeof brandCreationSchema>;
type AssetCreationValues = z.infer<typeof assetCreationSchema>;

function TenantPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("registration");
  
  // 租户信息查询
  const { data: tenantInfo, isLoading: isLoadingTenant } = useQuery({
    queryKey: ["/api/user"],
    queryFn: getQueryFn(),
    enabled: !!user,
  });
  
  // 租户关联品牌查询
  const { data: tenantBrand, isLoading: isLoadingBrand } = useQuery({
    queryKey: ["/api/tenant/brand"],
    queryFn: getQueryFn(),
    enabled: user?.role === "tenant" && user?.verificationStatus === "verified",
    retry: false,
  });
  
  // 品牌资产查询
  const { data: brandAssets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ["/api/tenant/assets"],
    queryFn: getQueryFn(),
    enabled: !!tenantBrand,
    retry: false,
  });
  
  // 租户注册表单
  const registrationForm = useForm<TenantRegistrationValues>({
    resolver: zodResolver(tenantRegistrationSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      phoneNumber: "",
      email: user?.email || "",
      address: "",
      website: "",
      businessLicense: "",
    },
  });
  
  // 品牌创建表单
  const brandForm = useForm<BrandCreationValues>({
    resolver: zodResolver(brandCreationSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      logoUrl: "",
      coverImageUrl: "",
    },
  });
  
  // 资产发行表单
  const assetForm = useForm<AssetCreationValues>({
    resolver: zodResolver(assetCreationSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      imageUrl: "",
      category: "Apparel",
      limited: true,
      editionNumber: 1,
      totalEditions: 100,
      tokenId: "",
      blockchain: "Ethereum",
    },
  });
  
  // 租户注册mutation
  const tenantRegistrationMutation = useMutation({
    mutationFn: async (data: TenantRegistrationValues) => {
      const res = await apiRequest("POST", "/api/tenant/register", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "申请提交成功",
        description: "您的租户申请已提交，请等待管理员审核",
      });
      setActiveTab("verification");
    },
    onError: (error: Error) => {
      toast({
        title: "申请提交失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // 品牌创建mutation
  const brandCreationMutation = useMutation({
    mutationFn: async (data: BrandCreationValues) => {
      const res = await apiRequest("POST", "/api/tenant/brand", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant/brand"] });
      toast({
        title: "品牌创建成功",
        description: "您的品牌已创建成功",
      });
      brandForm.reset();
      setActiveTab("assets");
    },
    onError: (error: Error) => {
      toast({
        title: "品牌创建失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // 资产发行mutation
  const assetCreationMutation = useMutation({
    mutationFn: async (data: AssetCreationValues) => {
      const res = await apiRequest("POST", "/api/tenant/assets", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenant/assets"] });
      toast({
        title: "资产发行成功",
        description: "您的数字资产已成功发行",
      });
      assetForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "资产发行失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // 处理租户注册表单提交
  const onSubmitRegistration = (values: TenantRegistrationValues) => {
    tenantRegistrationMutation.mutate(values);
  };
  
  // 处理品牌创建表单提交
  const onSubmitBrand = (values: BrandCreationValues) => {
    brandCreationMutation.mutate(values);
  };
  
  // 处理资产发行表单提交
  const onSubmitAsset = (values: AssetCreationValues) => {
    assetCreationMutation.mutate(values);
  };
  
  // 获取租户验证状态徽章
  const getVerificationStatusBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return (
          <Alert className="bg-green-50 border-green-200 mb-4">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">已验证</AlertTitle>
            <AlertDescription className="text-green-600">
              您的租户身份已通过验证，可以创建品牌和发行资产。
            </AlertDescription>
          </Alert>
        );
      case "rejected":
        return (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>已拒绝</AlertTitle>
            <AlertDescription>
              很抱歉，您的租户申请被拒绝。请联系平台管理员了解详情。
            </AlertDescription>
          </Alert>
        );
      case "pending":
        return (
          <Alert className="bg-yellow-50 border-yellow-200 mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertTitle className="text-yellow-700">审核中</AlertTitle>
            <AlertDescription className="text-yellow-600">
              您的租户申请正在审核中，请耐心等待。审核通过后，您将可以创建品牌和发行资产。
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };
  
  // 渲染租户注册表单
  const renderRegistrationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>租户注册</CardTitle>
        <CardDescription>
          填写以下信息申请成为FABRICVERSE平台的租户
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...registrationForm}>
          <form onSubmit={registrationForm.handleSubmit(onSubmitRegistration)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={registrationForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>公司名称</FormLabel>
                    <FormControl>
                      <Input placeholder="输入您的公司名称" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系人</FormLabel>
                    <FormControl>
                      <Input placeholder="输入联系人姓名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={registrationForm.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电话号码</FormLabel>
                    <FormControl>
                      <Input placeholder="输入联系电话" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registrationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电子邮箱</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={registrationForm.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公司地址</FormLabel>
                  <FormControl>
                    <Input placeholder="输入公司地址" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registrationForm.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>公司网站</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registrationForm.control}
              name="businessLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>营业执照编号</FormLabel>
                  <FormControl>
                    <Input placeholder="输入营业执照编号" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={tenantRegistrationMutation.isPending}
            >
              {tenantRegistrationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              提交租户申请
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
  
  // 渲染验证状态页面
  const renderVerificationStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle>验证状态</CardTitle>
        <CardDescription>
          查看您的租户验证状态
        </CardDescription>
      </CardHeader>
      <CardContent>
        {getVerificationStatusBadge(tenantInfo?.verificationStatus)}
        
        <div className="mt-6">
          <h3 className="text-lg font-medium">申请信息</h3>
          <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">公司名称</dt>
              <dd className="mt-1 text-sm">
                {tenantInfo?.metadata?.companyName || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">联系人</dt>
              <dd className="mt-1 text-sm">
                {tenantInfo?.metadata?.contactPerson || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">联系方式</dt>
              <dd className="mt-1 text-sm">
                {tenantInfo?.contactInfo || tenantInfo?.email || "-"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">网站</dt>
              <dd className="mt-1 text-sm">
                {tenantInfo?.metadata?.website ? (
                  <a
                    href={tenantInfo.metadata.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary flex items-center"
                  >
                    {tenantInfo.metadata.website}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                ) : (
                  "-"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
  
  // 渲染品牌创建表单
  const renderBrandForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>创建品牌</CardTitle>
        <CardDescription>
          创建您的时尚品牌，开始发行数字资产
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...brandForm}>
          <form onSubmit={brandForm.handleSubmit(onSubmitBrand)} className="space-y-6">
            <FormField
              control={brandForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品牌名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入品牌名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={brandForm.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>简短描述</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="一句话描述您的品牌特色 (最多50字)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    简洁地描述您品牌的核心价值与特点
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={brandForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品牌详细描述</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="详细描述您的品牌故事、理念与价值" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={brandForm.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>品牌Logo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/logo.png" {...field} />
                    </FormControl>
                    <FormDescription>
                      提供您品牌logo的图片链接
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={brandForm.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>品牌封面图片 URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/cover.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      提供您品牌封面的图片链接
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={brandCreationMutation.isPending}
            >
              {brandCreationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              创建品牌
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
  
  // 渲染资产发行表单
  const renderAssetForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>发行数字资产</CardTitle>
        <CardDescription>
          为您的品牌 {tenantBrand?.name} 发行数字资产
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...assetForm}>
          <form onSubmit={assetForm.handleSubmit(onSubmitAsset)} className="space-y-6">
            <FormField
              control={assetForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资产名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入资产名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={assetForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资产描述</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="描述这个数字资产的特点与价值" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={assetForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>价格 (RMB)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="输入资产价格"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={assetForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>类别</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || "Apparel"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择资产类别" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Apparel">服装</SelectItem>
                        <SelectItem value="Accessories">配饰</SelectItem>
                        <SelectItem value="Footwear">鞋履</SelectItem>
                        <SelectItem value="Jewelry">珠宝</SelectItem>
                        <SelectItem value="Bags">包袋</SelectItem>
                        <SelectItem value="Other">其他</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={assetForm.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图片 URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/asset.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    提供资产图片的URL链接
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={assetForm.control}
              name="limited"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">限量发行</FormLabel>
                    <FormDescription>
                      是否将此资产设为限量发行
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {assetForm.watch("limited") && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={assetForm.control}
                  name="editionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>版号</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="例如: 1"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={assetForm.control}
                  name="totalEditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>总版数</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="例如: 100"
                          {...field}
                          onChange={(e) => {
                            field.onChange(parseInt(e.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={assetForm.control}
                name="tokenId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token ID</FormLabel>
                    <FormControl>
                      <Input placeholder="0x..." {...field} />
                    </FormControl>
                    <FormDescription>
                      可选，区块链上的Token ID
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={assetForm.control}
                name="blockchain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>区块链</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择区块链" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Ethereum">以太坊</SelectItem>
                        <SelectItem value="Binance">币安链</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                        <SelectItem value="Tron">波场</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={assetCreationMutation.isPending}
            >
              {assetCreationMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              发行资产
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
  
  // 渲染品牌资产列表
  const renderBrandAssets = () => (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">已发行资产</h2>
        <Button onClick={() => window.scrollTo(0, 0)}>
          <Plus className="mr-2 h-4 w-4" />
          发行新资产
        </Button>
      </div>
      
      {isLoadingAssets ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : brandAssets && brandAssets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandAssets.map((asset: Asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={asset.imageUrl} 
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                {asset.limited && (
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    {asset.editionNumber} / {asset.totalEditions}
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle>{asset.name}</CardTitle>
                <CardDescription>
                  {asset.category} · ¥{asset.price}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {asset.description}
                </p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-xs text-gray-500 w-full flex justify-between">
                  <span>创建于 {new Date(asset.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center">
                    {asset.blockchain}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-gray-50">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无资产</h3>
          <p className="mt-1 text-sm text-gray-500">
            开始创建您的第一个数字资产
          </p>
          <div className="mt-6">
            <Button onClick={() => window.scrollTo(0, 0)}>
              <Plus className="mr-2 h-4 w-4" />
              发行新资产
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  // 渲染已创建的品牌
  const renderExistingBrand = () => (
    <>
      <Card className="mb-10">
        <div className="aspect-[3/1] relative overflow-hidden">
          <img 
            src={tenantBrand.coverImageUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3"} 
            alt={tenantBrand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold">{tenantBrand.name}</h1>
            <p className="text-lg opacity-90">{tenantBrand.shortDescription}</p>
          </div>
          {tenantBrand.logoUrl && (
            <div className="absolute top-6 right-6 w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
              <img 
                src={tenantBrand.logoUrl} 
                alt={`${tenantBrand.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{tenantBrand.activeAssets || 0}</div>
                <div className="text-sm text-gray-500">资产数量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">¥{tenantBrand.floorPrice || 0}</div>
                <div className="text-sm text-gray-500">最低价格</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">¥{tenantBrand.volume || 0}</div>
                <div className="text-sm text-gray-500">交易量</div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">品牌描述</h3>
            <p className="text-gray-700">
              {tenantBrand.description}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {renderAssetForm()}
      
      {renderBrandAssets()}
    </>
  );
  
  // 根据租户状态和品牌状态决定显示的内容
  const renderContent = () => {
    if (isLoadingTenant) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    
    // 如果用户还不是租户，显示注册表单
    if (user?.role !== "tenant") {
      return (
        <div className="space-y-10">
          <Alert>
            <Building className="h-4 w-4" />
            <AlertTitle>成为租户</AlertTitle>
            <AlertDescription>
              申请成为FABRICVERSE的租户，创建您自己的品牌，发行数字时尚资产。
            </AlertDescription>
          </Alert>
          
          {renderRegistrationForm()}
        </div>
      );
    }
    
    // 如果是租户但未验证
    if (user?.verificationStatus !== "verified") {
      return renderVerificationStatus();
    }
    
    // 如果是已验证租户，检查是否有品牌
    if (isLoadingBrand) {
      return (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    
    // 如果没有品牌，显示创建品牌表单
    if (!tenantBrand) {
      return (
        <div className="space-y-10">
          <Alert>
            <AlertTitle>创建您的品牌</AlertTitle>
            <AlertDescription>
              您的租户账户已验证。现在您可以创建自己的时尚品牌，开始发行数字资产。
            </AlertDescription>
          </Alert>
          
          {renderBrandForm()}
        </div>
      );
    }
    
    // 如果已有品牌，显示品牌和资产发行
    return renderExistingBrand();
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">租户中心</h1>
      
      {renderContent()}
    </div>
  );
}

export default function TenantPageWithAuth() {
  return (
    <ProtectedRoute 
      path="/tenant" 
      component={TenantPage}
    />
  );
}