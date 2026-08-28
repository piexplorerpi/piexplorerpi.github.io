// frontend/src/i18n/types.ts

export type SupportedLang = 'en' | 'fa' | 'ar' | 'tr' | 'zh';

// این تایپ تضمین می‌کند که هر خط ترجمه حتماً باید تمام زبان‌ها را داشته باشد
export type LocalizedString = {
  [key in SupportedLang]: string;
};
