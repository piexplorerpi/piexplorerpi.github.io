import React, { createContext, useContext, useState, ReactNode } from 'react';

// ایمپورت فایل‌های ترجمه
import en from '../translations/en.json';
import fa from '../translations/fa.json';
import ar from '../translations/ar.json';
import tr from '../translations/tr.json';
import zh from '../translations/zh.json';

type Language = 'en' | 'fa' | 'ar' | 'tr' | 'zh';
const translations: Record<Language, any> = { en, fa, ar, tr, zh };

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (keyPath: string) => any;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => 
    (localStorage.getItem('lang') as Language) || 'en'
  );

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  // تابع ساده برای دسترسی به ترجمه با رشته (مثلاً "roadmap.header.title")
  const t = (keyPath: string) => {
    return keyPath.split('.').reduce((obj, key) => obj?.[key], translations[lang]);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
