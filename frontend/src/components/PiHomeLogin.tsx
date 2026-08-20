// frontend/src/components/PiHomeLogin.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../i18n/I18nContext';

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

/**
 * Mainnet by default.
 * برای Sandbox/Testnet در env بگذار:
 * VITE_PI_SANDBOX=true
 */
const PI_SANDBOX = parseBooleanEnv(import.meta.env.VITE_PI_SANDBOX, false);

const PiHomeLogin: React.FC = () => {
  const auth = useAuth();
  const { t } = useI18n();

  const [status, setStatus] = useState<string>(t('initializingPiSdk'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const networkLabel = PI_SANDBOX ? t('testnet') : t('mainnet');

  useEffect(() => {
    console.log('PiHomeLogin User Agent:', navigator.userAgent);
    console.log('PiHomeLogin window.Pi:', window.Pi);
    console.log('PiHomeLogin Current URL:', window.location.href);
    console.log('PiHomeLogin Current Origin:', window.location.origin);
    console.log('PiHomeLogin PI_SANDBOX:', PI_SANDBOX);

    if (!window.Pi) {
      setStatus(t('piSdkNotFound'));
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

        console.log('Pi SDK initialized from PiHomeLogin.', {
          sandbox: PI_SANDBOX,
        });
      } else if (window.__PI_SDK_SANDBOX__ !== PI_SANDBOX) {
        console.warn('Pi SDK already initialized with a different sandbox value.', {
          initializedSandbox: window.__PI_SDK_SANDBOX__,
          currentSandbox: PI_SANDBOX,
        });
      }

      setStatus(`${t('piSdkReady')} ${t('network')}: ${networkLabel}`);
    } catch (error: any) {
      console.error('Pi SDK init error:', error);
      setStatus('Pi SDK error: ' + (error?.message || String(error)));
    }
  }, [t, networkLabel]);

  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    setStatus(t('incompletePaymentFound'));
  };

  const handleLogin = async () => {
    if (!auth) {
      setStatus(t('authContextMissing'));
      return;
    }

    if (!window.Pi) {
      setStatus(t('piSdkNotFound'));
      return;
    }

    if (typeof window.Pi.authenticate !== 'function') {
      setStatus('Pi authenticate function is not available.');
      return;
    }

    try {
      setIsLoading(true);
      setStatus(t('authenticating'));

      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        onIncompletePaymentFound
      );

      console.log('Pi authentication result:', authResult);

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

      setStatus(`${t('loginSuccess')} @${username}`);
    } catch (error: any) {
      console.error('Pi login error:', error);

      setStatus(
        `${t('loginFailed')} ` +
          (
            error?.response?.data?.message ||
            error?.message ||
            'Authentication failed'
          )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    auth?.logout();
    setStatus(`${t('piSdkReady')} ${t('network')}: ${networkLabel}`);
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
        {t('piLoginTitle')}
      </h2>

      <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.7 }}>
        {t('piLoginDescription')}
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
        {t('network')}: {networkLabel}
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
          {isLoading ? t('pleaseWait') : t('loginWithPi')}
        </button>
      ) : (
        <>
          <p style={{ color: '#333', marginTop: '10px' }}>
            {t('welcome')},{' '}
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
            {t('logout')}
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
