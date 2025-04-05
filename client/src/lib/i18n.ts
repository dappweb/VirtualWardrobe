import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // 使用http后端加载翻译文件
  .use(Backend)
  // 检测用户语言
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化配置
  .init({
    fallbackLng: 'zh', // 默认语言为中文
    debug: false, // 在生产环境中禁用调试
    
    // 支持的语言
    supportedLngs: ['zh', 'en', 'ja', 'ko'],
    
    // 检测语言的配置
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // 名称空间
    ns: ['common'],
    defaultNS: 'common',
    
    // 如果需要，可以在此处添加插值配置
    interpolation: {
      escapeValue: false, // 不转义HTML (React已经处理了)
    },
    
    // 后端配置
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: true,
    },
  });

export default i18n;

// 可用的语言及其显示名称
export const languages = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어'
};