import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SupportedLang, LocalizedString } from './types';

/** Alias used by some components */
export type Language = SupportedLang;

export const SUPPORTED_LANGUAGES: SupportedLang[] = ['en', 'fa', 'ar', 'tr', 'zh'];

export const LANGUAGE_LABELS: Record<SupportedLang, string> = {
  en: 'English',
  fa: 'فارسی',
  ar: 'العربية',
  tr: 'Türkçe',
  zh: '中文',
};

function isLocalizedString(value: unknown): value is LocalizedString {
  return (
    typeof value === 'object' &&
    value !== null &&
    'en' in (value as object) &&
    typeof (value as LocalizedString).en === 'string'
  );
}

interface I18nContextType {
  lang: SupportedLang;
  currentLang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  /**
   * Translate helper:
   * - If given a LocalizedString object → returns the string for current lang
   * - If given a plain string → returns it as-is (legacy / already-translated text)
   */
  t: (input: LocalizedString | string) => string;
  supportedLanguages: SupportedLang[];
  languageLabels: Record<SupportedLang, string>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function detectInitialLang(): SupportedLang {
  try {
    const stored = localStorage.getItem('piexplorer_lang');
    if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLang)) {
      return stored as SupportedLang;
    }
  } catch {
    // ignore
  }
  return 'en';
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<SupportedLang>(detectInitialLang);

  const setLang = useCallback((next: SupportedLang) => {
    setLangState(next);
    try {
      localStorage.setItem('piexplorer_lang', next);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'fa' || next === 'ar' ? 'rtl' : 'ltr';
    }
  }, []);

  const t = useCallback(
    (input: LocalizedString | string): string => {
      if (typeof input === 'string') {
        return input;
      }
      if (isLocalizedString(input)) {
        return input[lang] || input.en || '';
      }
      return String(input ?? '');
    },
    [lang]
  );

  const value: I18nContextType = {
    lang,
    currentLang: lang,
    setLang,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
    languageLabels: LANGUAGE_LABELS,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
