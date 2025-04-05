import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import App from "./App";
import "./index.css";
import "./lib/i18n"; // 初始化i18n
import { Loader2 } from "lucide-react";

// 使用Suspense处理i18n的异步加载
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  }>
    <App />
  </Suspense>
);
