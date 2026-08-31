// frontend/src/components/LanguageSwitcher.tsx
import React from 'react';
import { Language, useI18n } from '../i18n/I18nContext';
import { languageSwitcherTranslations } from '../i18n/translations/languageSwitcher';

const LanguageSwitcher: React.FC = () => {
  const {
    lang,
    setLang,
    t,
    supportedLanguages,
    languageLabels,
  } = useI18n();

  const isRtl = lang === 'fa' || lang === 'ar';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        margin: '16px auto',
        fontFamily: 'inherit',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <label
        htmlFor="language-switcher"
        style={{
          fontSize: '13px',
          color: '#666',
          fontWeight: 600,
        }}
      >
        {t(languageSwitcherTranslations.label)}:
      </label>

      <select
        id="language-switcher"
        value={lang}
        onChange={(e) => setLang(e.target.value as Language)}
        // استفاده از شیء ترجمه برای aria-label جهت Type-safety
        aria-label={t(languageSwitcherTranslations.label)}
        style={{
          padding: '8px 12px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          background: '#fff',
          color: '#111827',
          cursor: 'pointer',
          fontWeight: 600,
          minWidth: '130px',
          outline: 'none',
        }}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {languageLabels[language] || language.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
