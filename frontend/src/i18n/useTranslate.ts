// frontend/src/i18n/useTranslate.ts
import { useI18n } from './I18nContext';
import { LocalizedString } from './types';

export const useTranslate = () => {
  const { t, lang, currentLang, setLang, supportedLanguages, languageLabels } = useI18n();

  return {
    t: t as (localizedObj: LocalizedString | string) => string,
    lang,
    currentLang,
    setLang,
    supportedLanguages,
    languageLabels,
  };
};
