// src/i18n/types.ts
export type SupportedLang = 'en' | 'fa' | 'ar' | 'tr' | 'zh';

export type LocalizedString = {
  [key in SupportedLang]: string;
};
