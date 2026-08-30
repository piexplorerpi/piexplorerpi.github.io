import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslate } from '../i18n/useTranslate'; // تغییر از useI18n به useTranslate
import { piHomeLoginTranslations } from '../i18n/translations/piHomeLogin';

declare global {
  interface Window {
    Pi?: any;
    __PI_SDK_INITIALIZED__?: boolean;
    __PI_SDK_SANDBOX__?: boolean;
  }
}

const parseBooleanEnv = (value: unknown, defaultValue = false): boolean => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return String(value).trim().toLowerCase() === 'true';
};

const PI_SANDBOX = parseBooleanEnv(import.meta.env.VITE_PI_SANDBOX, false);

const PiHomeLogin: React.FC = () => {
  const auth = useAuth();
  const { t } = useTranslate(); // استفاده از هوک جدید

  const [status, setStatus] = useState<string>(t(piHomeLoginTranslations.initializingPiSdk));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // تعیین لیبل شبکه بر اساس ترجمه
  const networkLabel = PI_SANDBOX 
    ? t(piHomeLoginTranslations.testnet) 
    : t(piHomeLoginTranslations.mainnet);

  useEffect(() => {
    if (!window.Pi) {
      setStatus(t(piHomeLoginTranslations.piSdkNotFound));
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

      setStatus(`${t(piHomeLoginTranslations.piSdkReady)} ${t(piHomeLoginTranslations.network)}: ${networkLabel}`);
    } catch (error: any) {
      console.error('Pi SDK init error:', error);
      setStatus('Pi SDK error: ' + (error?.message || String(error)));
    }
  }, [t, networkLabel]);

  const onIncompletePaymentFound = (payment: any) => {
    setStatus(t(piHomeLoginTranslations.incompletePaymentFound));
  };

  const handleLogin = async () => {
    if (!auth) {
      setStatus(t(piHomeLoginTranslations.authContextMissing));
      return;
    }

    if (!window.Pi) {
      setStatus(t(piHomeLoginTranslations.piSdkNotFound));
      return;
    }

    if (typeof window.Pi.authenticate !== 'function') {
      setStatus(t(piHomeLoginTranslations.piAuthenticateError));
      return;
    }

    try {
      setIsLoading(true);
      setStatus(t(piHomeLoginTranslations.authenticating));

      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        onIncompletePaymentFound
      );

      const piUserId =
        authResult?.user?.uid ||
        authResult?.user?.id ||
        authResult?.user?._id ||
        authResult?.uid ||
        authResult?.id;

      const username =
        authResult?.user?.username ||
        authResult?.username ||
        'Pi User';

      const accessToken =
        authResult?.accessToken ||
        authResult?.access_token ||
        authResult?.token;

      if (!piUserId) {
        throw new Error('Invalid Pi user data received. Missing user id.');
      }

      await auth.login(String(piUserId), String(username), accessToken);

      setStatus(`${t(piHomeLoginTranslations.loginSuccess)} @${username}`);
    } catch (error: any) {
      console.error('Pi login error:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Authentication failed';
      setStatus(`${t(piHomeLoginTranslations.loginFailed)} ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    auth?.logout();
    setStatus(`${t(piHomeLoginTranslations.piSdkReady)} ${t(piHomeLoginTranslations.network)}: ${networkLabel}`);
  };

  const isAuthenticated = auth?.isAuthenticated;
  const user = auth?.user;

  return (
    <section
      style={{
        margin: '20px auto',
        padding: '22px',
        maxWidth: '460px',
        borderRadius: '20px',
        background: '#ffffff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        border: '1px solid rgba(103,58,183,0.18)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ color: '#673ab7', marginBottom: '8px' }}>
        {t(piHomeLoginTranslations.piLoginTitle)}
      </h2>

      <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>
        {t(piHomeLoginTranslations.piLoginDescription)}
      </p>

      <div
        style={{
          display: 'inline-block',
          margin: '10px 0 18px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: PI_SANDBOX ? '#fff3e0' : '#e8f5e9',
          color: PI_SANDBOX ? '#ef6c00' : '#2e7d32',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        {t(piHomeLoginTranslations.network)}: {networkLabel}
      </div>

      {!isAuthenticated ? (
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            maxWidth: '260px',
            padding: '13px 22px',
            borderRadius: '28px',
            border: 'none',
            background: isLoading ? '#999' : '#673ab7',
            color: '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: 700,
          }}
        >
          {isLoading ? t(piHomeLoginTranslations.pleaseWait) : t(piHomeLoginTranslations.loginWithPi)}
        </button>
      ) : (
        <>
          <p style={{ color: '#333', marginTop: '10px' }}>
            {t(piHomeLoginTranslations.welcome)},{' '}
            <strong>@{user?.username || 'Pi User'}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              padding: '10px 18px',
              borderRadius: '22px',
              border: '1px solid #ff5252',
              background: '#fff',
              color: '#ff5252',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {t(piHomeLoginTranslations.logout)}
          </button>
        </>
      )}

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          borderRadius: '10px',
          background: '#f5f5f5',
          color: '#444',
          fontSize: '13px',
          wordBreak: 'break-word',
          lineHeight: 1.5,
        }}
      >
        {status}
      </div>
    </section>
  );
};

export default PiHomeLogin;
