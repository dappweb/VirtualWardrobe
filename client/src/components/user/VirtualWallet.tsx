import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Coins, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VirtualWallet() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(100);
  const [open, setOpen] = useState(false);

  // 获取钱包余额
  const { data: balanceData, isLoading } = useQuery({
    queryKey: ["/api/wallet/balance"],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!user,
    refetchInterval: 10000, // 10秒自动刷新一次
  });

  // 充值钱包
  const rechargeMutation = useMutation({
    mutationFn: async (rechargeAmount: number) => {
      const res = await apiRequest("POST", "/api/wallet/recharge", { amount: rechargeAmount });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet/balance"] });
      toast({
        title: t("wallet.rechargeSuccess"),
        description: data.message,
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: t("wallet.rechargeFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRecharge = () => {
    if (amount <= 0) {
      toast({
        title: t("wallet.invalidAmount"),
        description: t("wallet.enterPositiveAmount"),
        variant: "destructive",
      });
      return;
    }
    rechargeMutation.mutate(amount);
  };

  if (!user) return null;

  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-dashed">
            <Wallet className="h-4 w-4" />
            <span className="font-semibold">
              {isLoading ? "..." : balanceData?.balance || 0} {t("wallet.tokens")}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none flex items-center gap-2">
                <Coins className="h-4 w-4" /> {t("wallet.yourBalance")}
              </h4>
              <div className="text-3xl font-bold text-primary">
                {isLoading ? "..." : balanceData?.balance || 0} <span className="text-sm text-muted-foreground">{t("wallet.tokens")}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("wallet.description")}
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("wallet.recharge")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("wallet.rechargeWallet")}</DialogTitle>
                  <DialogDescription>
                    {t("wallet.rechargeDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">{t("wallet.amount")}</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    onClick={handleRecharge} 
                    disabled={rechargeMutation.isPending}
                  >
                    {rechargeMutation.isPending ? t("wallet.processing") : t("wallet.confirm")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}