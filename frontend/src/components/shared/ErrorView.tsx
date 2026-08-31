// frontend/src/components/shared/ErrorView.tsx
import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { errorTranslations } from '../../i18n/translations/error';

interface ErrorViewProps {
  onReload: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ onReload }) => {
  const { t, lang } = useI18n();

  const styles: Record<string, React.CSSProperties> = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      direction: lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr',
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
    },
    icon: {
      fontSize: '48px',
      marginBottom: '15px',
      display: 'block',
    },
    title: {
      color: '#d32f2f',
      margin: '0 0 10px 0',
      fontSize: '22px',
    },
    message: {
      color: '#555',
      marginBottom: '25px',
      fontSize: '16px',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#d32f2f',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px',
      transition: 'background 0.2s',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <span style={styles.icon}>⚠️</span>
        <h1 style={styles.title}>{t(errorTranslations.title)}</h1>
        <p style={styles.message}>{t(errorTranslations.message)}</p>
        <button style={styles.button} onClick={onReload}>
          {t(errorTranslations.reload)}
        </button>
      </div>
    </div>
  );
};
