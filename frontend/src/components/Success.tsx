// src/components/Success.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext';
import { successTranslations } from '../i18n/translations/success';

interface SuccessProps {
  transactionId?: string;
  onReset?: () => void;
}

const Success: React.FC<SuccessProps> = ({ transactionId, onReset }) => {
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const handleBackHome = () => {
    if (typeof onReset === 'function') {
      onReset();
      return;
    }
    navigate('/', { replace: true });
  };

  const styles = {
    container: {
      textAlign: 'center' as const,
      padding: '50px 20px',
      fontFamily: 'Tahoma, sans-serif',
      direction: lang === 'fa' || lang === 'ar' ? 'rtl' : 'ltr',
      minHeight: '100vh',
      background: '#f5f7fb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: '80px',
      color: '#28a745',
      marginBottom: '20px',
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '10px',
    },
    text: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px',
      lineHeight: 1.6,
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      maxWidth: '430px',
      width: '100%',
      margin: '0 auto',
    },
    txId: {
      fontSize: '14px',
      color: '#999',
      wordBreak: 'break-all' as const,
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '10px',
      lineHeight: 1.7,
    },
    button: {
      padding: '12px 30px',
      fontSize: '16px',
      backgroundColor: '#4A90E2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>

        <h2 style={styles.title}>
          {t(successTranslations.paymentSuccessful)}
        </h2>

        <p style={styles.text}>
          {t(successTranslations.transactionRegistered)}
        </p>

        <div style={styles.txId}>
          <strong>{t(successTranslations.transactionIdentifier)}:</strong>
          <br />
          {transactionId || t(successTranslations.processing)}
        </div>

        <button
          style={styles.button}
          onClick={handleBackHome}
        >
          {t(successTranslations.backToHome)}
        </button>
      </div>
    </div>
  );
};

export default Success;
