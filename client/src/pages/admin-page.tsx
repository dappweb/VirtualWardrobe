import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { ProtectedRoute } from "@/lib/protected-route";

function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>("all");

  // 获取所有用户
  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users", selectedRole !== "all" ? selectedRole : undefined],
    queryFn: getQueryFn(),
    enabled: user?.role === "admin", // 只有管理员可以查询
  });

  // 验证租户的mutation
  const verifyTenantMutation = useMutation({
    mutationFn: async ({
      tenantId,
      status,
    }: {
      tenantId: number;
      status: string;
    }) => {
      const res = await apiRequest("PUT", `/api/admin/tenant/${tenantId}/verify`, {
        verificationStatus: status,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "操作成功",
        description: "租户验证状态已更新",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 更改用户角色的mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      const res = await apiRequest("PUT", `/api/admin/user/${userId}/role`, {
        role,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "操作成功",
        description: "用户角色已更新",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "操作失败",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 根据验证状态获取徽章颜色和图标
  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-4 h-4 mr-1" /> 已验证
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="w-4 h-4 mr-1" /> 已拒绝
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            <AlertTriangle className="w-4 h-4 mr-1" /> 待审核
          </Badge>
        );
      default:
        return null;
    }
  };

  // 处理角色过滤变化
  const handleRoleFilterChange = (value: string) => {
    setSelectedRole(value);
    if (value === "all") {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    } else {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users", value] });
    }
  };

  // 处理租户验证
  const handleVerifyTenant = (tenantId: number, status: string) => {
    verifyTenantMutation.mutate({ tenantId, status });
  };

  // 处理更新用户角色
  const handleUpdateRole = (userId: number, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  // 角色过滤器
  const roleFilter = (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-medium">按角色筛选:</span>
      <Select value={selectedRole} onValueChange={handleRoleFilterChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="所有角色" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">所有角色</SelectItem>
          <SelectItem value="buyer">买家</SelectItem>
          <SelectItem value="tenant">租户</SelectItem>
          <SelectItem value="admin">管理员</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  // 用户列表
  const usersList = (
    <Card>
      <CardHeader>
        <CardTitle>用户管理</CardTitle>
        <CardDescription>管理所有平台用户和角色</CardDescription>
      </CardHeader>
      <CardContent>
        {roleFilter}
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableCaption>用户列表</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>钱包地址</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.walletAddress ? (
                        <span className="text-xs font-mono">
                          {user.walletAddress.substring(0, 6)}...
                          {user.walletAddress.substring(
                            user.walletAddress.length - 4
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">未连接</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role || "buyer"}
                        onValueChange={(value) => handleUpdateRole(user.id, value)}
                        disabled={updateRoleMutation.isPending}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">买家</SelectItem>
                          <SelectItem value="tenant">租户</SelectItem>
                          <SelectItem value="admin">管理员</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.role === "tenant" && getVerificationBadge(user.verificationStatus)}
                    </TableCell>
                    <TableCell>
                      {user.role === "tenant" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={user.verificationStatus === "verified" ? "outline" : "default"}
                            onClick={() => handleVerifyTenant(user.id, "verified")}
                            disabled={
                              verifyTenantMutation.isPending ||
                              user.verificationStatus === "verified"
                            }
                          >
                            验证
                          </Button>
                          <Button
                            size="sm"
                            variant={user.verificationStatus === "rejected" ? "outline" : "destructive"}
                            onClick={() => handleVerifyTenant(user.id, "rejected")}
                            disabled={
                              verifyTenantMutation.isPending ||
                              user.verificationStatus === "rejected"
                            }
                          >
                            拒绝
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    暂无用户数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  // 租户审核页面
  const tenantVerification = (
    <Card>
      <CardHeader>
        <CardTitle>租户审核</CardTitle>
        <CardDescription>审核待验证的租户申请</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableCaption>待审核租户列表</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>公司名称</TableHead>
                <TableHead>联系人</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>审核状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.filter((u: User) => u.role === "tenant" && u.verificationStatus === "pending").length > 0 ? (
                users
                  .filter((u: User) => u.role === "tenant" && u.verificationStatus === "pending")
                  .map((tenant: User) => (
                    <TableRow key={tenant.id}>
                      <TableCell>{tenant.id}</TableCell>
                      <TableCell>{tenant.username}</TableCell>
                      <TableCell>
                        {tenant.metadata?.companyName || <span className="text-muted-foreground">未提供</span>}
                      </TableCell>
                      <TableCell>
                        {tenant.metadata?.contactPerson || <span className="text-muted-foreground">未提供</span>}
                      </TableCell>
                      <TableCell>{tenant.contactInfo || tenant.email}</TableCell>
                      <TableCell>{getVerificationBadge(tenant.verificationStatus)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleVerifyTenant(tenant.id, "verified")}
                            disabled={verifyTenantMutation.isPending}
                          >
                            验证
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleVerifyTenant(tenant.id, "rejected")}
                            disabled={verifyTenantMutation.isPending}
                          >
                            拒绝
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    暂无待审核的租户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );

  // 统计概览
  const statsOverview = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {users?.filter((u: User) => u.role === "buyer").length || 0}
          </CardTitle>
          <CardDescription>买家用户</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {users?.filter((u: User) => u.role === "tenant").length || 0}
          </CardTitle>
          <CardDescription>租户用户</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl">
            {users?.filter((u: User) => u.role === "tenant" && u.verificationStatus === "pending").length || 0}
          </CardTitle>
          <CardDescription>待审核租户</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  // 主要内容
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">管理员控制台</h1>
      
      {statsOverview}
      
      <Tabs defaultValue="verification" className="mb-10">
        <TabsList className="mb-4">
          <TabsTrigger value="verification">租户审核</TabsTrigger>
          <TabsTrigger value="users">用户管理</TabsTrigger>
        </TabsList>
        <TabsContent value="verification">{tenantVerification}</TabsContent>
        <TabsContent value="users">{usersList}</TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPageWithAuth() {
  return (
    <ProtectedRoute 
      path="/admin" 
      component={AdminPage} 
      allowedRoles={["admin"]}
    />
  );
}