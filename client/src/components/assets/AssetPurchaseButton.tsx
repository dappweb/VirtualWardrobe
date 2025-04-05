import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Check, AlertTriangle, Loader2 } from "lucide-react";
import { Asset } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AssetPurchaseButtonProps {
  asset: Asset;
  onPurchaseSuccess?: () => void;
}

export default function AssetPurchaseButton({ asset, onPurchaseSuccess }: AssetPurchaseButtonProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  // 资产购买
  const purchaseMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/assets/${asset.id}/purchase`, {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/assets"] });
      
      toast({
        title: t("purchase.success"),
        description: data.message,
      });
      
      setOpen(false);
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("purchase.failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // 如果用户未登录，显示登录按钮
  if (!user) {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4"
        onClick={() => window.location.href = "/auth"}
      >
        {t("purchase.loginToPurchase")}
      </Button>
    );
  }

  // 如果不是买家角色，显示提示
  if (user.role !== "buyer") {
    return (
      <Button 
        variant="outline" 
        className="w-full mt-4" 
        disabled
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        {t("purchase.onlyBuyers")}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t("purchase.buyNow")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("purchase.confirmPurchase")}</DialogTitle>
          <DialogDescription>
            {t("purchase.confirmDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{t("purchase.asset")}:</span>
                <span>{asset.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">{t("purchase.price")}:</span>
                <Badge variant="secondary" className="text-md">
                  {asset.price} {t("wallet.tokens")}
                </Badge>
              </div>
              {asset.limited && (
                <div className="flex justify-between">
                  <span className="font-medium">{t("purchase.edition")}:</span>
                  <span>
                    {asset.editionNumber} / {asset.totalEditions}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={purchaseMutation.isPending}
          >
            {t("purchase.cancel")}
          </Button>
          <Button 
            onClick={() => purchaseMutation.mutate()} 
            disabled={purchaseMutation.isPending}
          >
            {purchaseMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("purchase.processing")}
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t("purchase.confirm")}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}