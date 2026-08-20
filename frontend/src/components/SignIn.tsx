// frontend/src/components/SignIn.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const SignIn: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [status, setStatus] = useState<string>(t('initializingPiSdk'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const networkLabel = PI_SANDBOX ? t('testnet') : t('mainnet');

  useEffect(() => {
    console.log('SignIn User Agent:', navigator.userAgent);
    console.log('SignIn window.Pi:', window.Pi);
    console.log('SignIn Current URL:', window.location.href);
    console.log('SignIn Current Origin:', window.location.origin);
    console.log('SignIn PI_SANDBOX:', PI_SANDBOX);

    if (!window.Pi) {
      setStatus(t('piSdkNotFound'));
      return;
    }

    try {
      /**
       * جلوگیری از اجرای دوباره Pi.init در React StrictMode
       */
      if (!window.__PI_SDK_INITIALIZED__) {
        window.Pi.init({
          version: '2.0',
          sandbox: PI_SANDBOX,
        });

        window.__PI_SDK_INITIALIZED__ = true;
        window.__PI_SDK_SANDBOX__ = PI_SANDBOX;

        console.log('Pi SDK initialized from SignIn.', {
          sandbox: PI_SANDBOX,
        });
      } else if (window.__PI_SDK_SANDBOX__ !== PI_SANDBOX) {
        console.warn(
          'Pi SDK was already initialized with a different sandbox value.',
          {
            initializedSandbox: window.__PI_SDK_SANDBOX__,
            currentSandbox: PI_SANDBOX,
          }
        );
      }

      setStatus(`${t('piSdkReady')} ${t('network')}: ${networkLabel}`);
    } catch (error: any) {
      console.error('Pi SDK init error:', error);
      setStatus('Pi SDK init error: ' + (error?.message || String(error)));
    }
  }, [t, networkLabel]);

  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    setStatus(t('incompletePaymentFound'));
  };

  const handlePiLogin = async () => {
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

      setStatus(`${t('loginSuccess')} ${t('redirecting')}`);
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Pi login error:', error);

      setStatus(
        `${t('loginFailed')} ` +
          (
            error?.response?.data?.message ||
            error?.message ||
            'User cancelled or authentication failed'
          )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #311b92, #673ab7)',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '22px',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
        }}
      >
        <h1
          style={{
            color: '#673ab7',
            marginBottom: '8px',
            fontSize: '28px',
          }}
        >
          {t('signInTitle')}
        </h1>

        <p
          style={{
            color: '#666',
            marginBottom: '14px',
            fontSize: '15px',
            lineHeight: 1.6,
          }}
        >
          {t('signInDescription')}
        </p>

        <div
          style={{
            display: 'inline-block',
            marginBottom: '22px',
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

        <button
          onClick={handlePiLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px 20px',
            borderRadius: '30px',
            border: 'none',
            background: isLoading ? '#999' : '#673ab7',
            color: '#fff',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 700,
          }}
        >
          {isLoading ? t('pleaseWait') : t('loginWithPi')}
        </button>

        <div
          style={{
            marginTop: '20px',
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

        <p
          style={{
            marginTop: '16px',
            color: '#999',
            fontSize: '12px',
          }}
        >
          {t('pleaseUsePiBrowser')}
        </p>
      </div>
    </div>
  );
};

export default SignIn;
