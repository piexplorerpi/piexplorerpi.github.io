// frontend/src/i18n/useTranslate.ts
import { useI18n } from './I18nContext'; // فرض بر این است که Context را دارید
import { LocalizedString } from './types';

export const useTranslate = () => {
  const { lang } = useI18n(); // دریافت زبان فعلی (مثلاً 'fa')

  /**
   * تابع اصلی برای دریافت متن
   * @param localizedObj شیئی که شامل تمام زبان‌هاست (طبق الگوی LocalizedString)
   * @returns رشته متنی مربوط به زبان انتخاب شده
   */
  const t = (localizedObj: LocalizedString): string => {
    // اگر به هر دلیلی زبان انتخابی در شیء نبود، انگلیسی را به عنوان fallback برمی‌گرداند
    return localizedObj[lang] || localizedObj['en'];
  };

  return { t, currentLang: lang };
};
