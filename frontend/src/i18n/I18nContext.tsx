import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SupportedLang } from './types'; // همان فایل تایپ‌هایی که قبلاً ساختیم

interface I18nContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  // زبان پیش‌فرض (مثلاً انگلیسی)
  const [lang, setLang] = useState<SupportedLang>('en');

  return (
    <I18nContext.Provider value={{ lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
