import { useAuth } from "@/hooks/use-auth";
import { AlertCircle, Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: {
  path: string;
  component: () => React.JSX.Element;
  allowedRoles?: string[];
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-secondary-500" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // 检查用户角色权限
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Route path={path}>
        <div className="container py-20">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>访问被拒绝</AlertTitle>
            <AlertDescription>
              您没有访问此页面的权限。此页面仅对 {allowedRoles.join(', ')} 角色开放。
            </AlertDescription>
          </Alert>
          <div className="flex justify-center mt-6">
            <Redirect to="/" />
          </div>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
