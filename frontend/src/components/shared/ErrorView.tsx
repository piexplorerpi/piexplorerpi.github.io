import React from 'react';
import { useTranslate } from '../../i18n/useTranslate';
import { errorTranslations } from '../../i18n/translations/error';

export const ErrorView = ({ onReload }: { onReload: () => void }) => {
  const { t } = useTranslate();

  return (
    <div style={{ /* استایل‌های قبلی شما */ display: 'flex', flexDirection: 'column', ... }}>
      <div style={{ /* استایل باکس */ }}>
        <h1>{t(errorTranslations.title)}</h1>
        <p>{t(errorTranslations.message)}</p>
        <button onClick={onReload}>{t(errorTranslations.reload)}</button>
      </div>
    </div>
  );
};
