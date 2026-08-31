// frontend/src/components/SignIn.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';
import { signInTranslations } from '../i18n/translations/signin';

// افزایش تایپ‌های Window برای جلوگیری از خطاهای TypeScript
declare global {
  interface Window {
    Pi?: any;
    __PI_SDK_INITIALIZED__?: boolean;
    __PI_SDK_SANDBOX__?: boolean;
  }
}

const parseBooleanEnv = (value: unknown, defaultValue = false): boolean => {
  if (value === undefined || value === null || value === '') return defaultValue;
  return String(value).trim().toLowerCase() === 'true';
};

const PI_SANDBOX = parseBooleanEnv(import.meta.env.VITE_PI_SANDBOX, false);

const SignIn: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  // زبان شبکه را در یک متغیر مِموشده قرار می‌دهیم
  const networkLabel = useMemo(() => {
    return PI_SANDBOX ? t(signInTranslations.testnet) : t(signInTranslations.mainnet);
  }, [t]);

  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // مقداردهی وضعیت اولیه بر اساس زبان جاری
  useEffect(() => {
    setStatus(t(signInTranslations.initializingPiSdk));
  }, [t]);

  // مقداردهی اولیه SDK در یک چرخه امن
  useEffect(() => {
    if (!window.Pi) {
      setStatus(t(signInTranslations.piSdkNotFound));
      return;
    }

    try {
      if (!window.__PI_SDK_INITIALIZED__) {
        window.Pi.init({
          version: '2.0',
          sandbox: PI_SANDBOX,
        });
        window.__PI_SDK_INITIALIZED__ = true;
        window.__PI_SDK_SANDBOX__ = PI_SANDBOX;
      }
      setStatus(`${t(signInTranslations.piSdkReady)} ${t(signInTranslations.network)}: ${networkLabel}`);
    } catch (error: any) {
      setStatus(`Pi SDK init error: ${error?.message || String(error)}`);
    }
  }, [t, networkLabel]);

  const handlePiLogin = useCallback(async () => {
    if (!auth) {
      setStatus(t(signInTranslations.authContextMissing));
      return;
    }

    if (!window.Pi || typeof window.Pi.authenticate !== 'function') {
      setStatus(t(signInTranslations.piSdkNotFound));
      return;
    }

    try {
      setIsLoading(true);
      setStatus(t(signInTranslations.authenticating));

      const authResult = await window.Pi.authenticate(['username', 'payments'], (payment: any) => {
        console.log('Incomplete payment found:', payment);
        setStatus(t(signInTranslations.incompletePaymentFound));
      });

      const user = authResult?.user || {};
      const piUserId = user.uid || user.id || user._id || authResult?.uid || authResult?.id;
      const username = user.username || authResult?.username || 'Pi User';
      const accessToken = authResult?.accessToken || authResult?.access_token || authResult?.token;

      if (!piUserId) {
        throw new Error('Invalid Pi user data received. Missing user id.');
      }

      await auth.login(String(piUserId), String(username), accessToken);

      setStatus(`${t(signInTranslations.loginSuccess)} ${t(signInTranslations.redirecting)}`);
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Pi login error:', error);
      setStatus(
        `${t(signInTranslations.loginFailed)} ${error?.response?.data?.message || error?.message || 'User cancelled or authentication failed'}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [auth, navigate, t]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>{t(signInTranslations.signInTitle)}</h1>
        <p style={styles.description}>{t(signInTranslations.signInDescription)}</p>

        <div style={{ ...styles.badge, background: PI_SANDBOX ? '#fff3e0' : '#e8f5e9', color: PI_SANDBOX ? '#ef6c00' : '#2e7d32' }}>
          {t(signInTranslations.network)}: {networkLabel}
        </div>

        <button
          onClick={handlePiLogin}
          disabled={isLoading}
          style={{ ...styles.button, background: isLoading ? '#999' : '#673ab7' }}
        >
          {isLoading ? t(signInTranslations.pleaseWait) : t(signInTranslations.loginWithPi)}
        </button>

        <div style={styles.statusBox}>{status}</div>

        <p style={styles.footerText}>{t(signInTranslations.pleaseUsePiBrowser)}</p>
      </div>
    </div>
  );
};

// استایل‌ها جهت تمیزی کد به یک آبجکت منتقل شدند
const styles: Record<string, React.CSSProperties> = {
  pageContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #311b92, #673ab7)', padding: '20px', fontFamily: 'sans-serif' },
  card: { width: '100%', maxWidth: '420px', background: '#ffffff', borderRadius: '22px', padding: '32px 24px', textAlign: 'center', boxShadow: '0 20px 45px rgba(0,0,0,0.25)' },
  title: { color: '#673ab7', marginBottom: '8px', fontSize: '28px' },
  description: { color: '#666', marginBottom: '14px', fontSize: '15px', lineHeight: 1.6 },
  badge: { display: 'inline-block', marginBottom: '22px', padding: '6px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700 },
  button: { width: '100%', padding: '14px 20px', borderRadius: '30px', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '16px', fontWeight: 700 },
  statusBox: { marginTop: '20px', padding: '12px', borderRadius: '10px', background: '#f5f5f5', color: '#444', fontSize: '13px', wordBreak: 'break-word', lineHeight: 1.5 },
  footerText: { marginTop: '16px', color: '#999', fontSize: '12px' }
};

export default SignIn;
