// frontend/src/components/PiPaymentPanel.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../lib/axiosClient';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || 'https://piexplorer.bonto.run/api').replace(
    /\/+$/,
    ''
  );

const parseBooleanEnv = (value: unknown, defaultValue = false): boolean => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return String(value).trim().toLowerCase() === 'true';
};

/**
 * Mainnet by default.
 * For Sandbox/Testnet set:
 * VITE_PI_SANDBOX=true
 */
const PI_SANDBOX = parseBooleanEnv(import.meta.env.VITE_PI_SANDBOX, false);

const DEFAULT_AMOUNT = import.meta.env.VITE_DEFAULT_PI_AMOUNT || '0.01';
const MIN_AMOUNT = Number(import.meta.env.VITE_MIN_PI_AMOUNT || '0.001');
const MAX_AMOUNT = Number(import.meta.env.VITE_MAX_PI_AMOUNT || '100');

function getHealthUrl() {
  if (!API_BASE_URL) return '';
  return API_BASE_URL.replace(/\/api\/?$/, '') + '/health';
}

const PiPaymentPanel: React.FC = () => {
  const auth = useAuth();

  const [status, setStatus] = useState<string>('Initializing Pi SDK...');
  const [username, setUsername] = useState<string>('');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>(DEFAULT_AMOUNT);

  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const currentUsername = auth?.user?.username || username;

  const networkLabel = PI_SANDBOX ? 'Testnet' : 'Mainnet';
  const networkValue = PI_SANDBOX ? 'testnet' : 'mainnet';

  useEffect(() => {
    console.log('User Agent:', navigator.userAgent);
    console.log('window.Pi:', window.Pi);
    console.log('Current URL:', window.location.href);
    console.log('Current Origin:', window.location.origin);
    console.log('API_BASE_URL:', API_BASE_URL);
    console.log('PI_SANDBOX:', PI_SANDBOX);

    if (!window.Pi) {
      setStatus('Pi SDK not found. Please open this app inside Pi Browser.');
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

        console.log('Pi SDK initialized successfully.', {
          sandbox: PI_SANDBOX,
        });
      } else if (window.__PI_SDK_SANDBOX__ !== PI_SANDBOX) {
        console.warn('Pi SDK was already initialized with another sandbox value.', {
          initializedSandbox: window.__PI_SDK_SANDBOX__,
          currentSandbox: PI_SANDBOX,
        });
      }

      setStatus(`Pi SDK ready. Network: ${networkLabel}`);
    } catch (error: any) {
      console.error('Pi SDK init error:', error);
      setStatus('Pi SDK init error: ' + (error?.message || String(error)));
    }
  }, []);

  useEffect(() => {
    if (auth?.user?.username) {
      setUsername(auth.user.username);
    }
  }, [auth?.user?.username]);

  const onIncompletePaymentFound = (payment: any) => {
    console.log('Incomplete payment found:', payment);
    setStatus(
      'Incomplete payment found. Please complete or cancel it in Pi Browser.'
    );
  };

  const warmUpBackend = async () => {
    if (!API_BASE_URL) {
      throw new Error('VITE_API_URL is not set.');
    }

    const healthUrl = getHealthUrl();
    if (!healthUrl) return;

    console.log('Warming up backend:', healthUrl);
    setStatus('Warming up backend...');

    try {
      await fetch(healthUrl, { method: 'GET' });
    } catch (error) {
      console.warn('Backend warm-up failed:', error);
    }
  };

  const loginWithPi = async () => {
    if (!auth) {
      setStatus('Auth context is missing.');
      return;
    }

    if (!window.Pi) {
      setStatus('Pi SDK not found. Please open this app inside Pi Browser.');
      return;
    }

    if (typeof window.Pi.authenticate !== 'function') {
      setStatus('Pi authenticate function is not available.');
      return;
    }

    try {
      setIsLoggingIn(true);
      setStatus('Authenticating with Pi...');

      // Ensure SDK is initialized before authenticate
      if (!window.__PI_SDK_INITIALIZED__) {
        try {
          window.Pi.init({
            version: '2.0',
            sandbox: PI_SANDBOX,
          });
          window.__PI_SDK_INITIALIZED__ = true;
          window.__PI_SDK_SANDBOX__ = PI_SANDBOX;
        } catch (initErr) {
          console.warn('Pi init before login:', initErr);
        }
      }

      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        onIncompletePaymentFound
      );

      console.log('Pi auth result:', authResult);

      const piUserId =
        authResult?.user?.uid ||
        authResult?.user?.id ||
        authResult?.user?._id ||
        authResult?.uid ||
        authResult?.id;

      const piUsername =
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

      // Backend login via AuthContext (POST /auth/pi-login)
      await auth.login(String(piUserId), String(piUsername), accessToken);

      setUsername(String(piUsername));
      setStatus(`Login successful. Welcome @${piUsername}`);
    } catch (error: any) {
      console.error('Pi auth error:', error);

      setStatus(
        'Login failed: ' +
          (error?.response?.data?.message ||
            error?.message ||
            'User cancelled or authentication failed')
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    auth?.logout();
    setUsername('');
    setStatus(`Pi SDK ready. Network: ${networkLabel}`);
  };

  const validateAmount = () => {
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount)) {
      return {
        valid: false,
        value: 0,
        message: 'Please enter a valid payment amount.',
      };
    }

    if (parsedAmount < MIN_AMOUNT) {
      return {
        valid: false,
        value: parsedAmount,
        message: `Minimum payment amount is ${MIN_AMOUNT} Pi.`,
      };
    }

    if (parsedAmount > MAX_AMOUNT) {
      return {
        valid: false,
        value: parsedAmount,
        message: `Maximum payment amount is ${MAX_AMOUNT} Pi.`,
      };
    }

    return {
      valid: true,
      value: parsedAmount,
      message: '',
    };
  };


  const postWithFallback = async (paths: string[], body: Record<string, unknown>) => {
    let lastError: any = null;

    for (const path of paths) {
      try {
        console.log('POST', path, body);
        const response = await axiosClient.post(path, body);
        console.log('Response', path, response.status, response.data);

        if (response.data?.success === false) {
          throw new Error(response.data?.message || `Request failed: ${path}`);
        }

        return response.data;
      } catch (error: any) {
        lastError = error;
        const status = error?.response?.status;
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          String(error);

        console.warn(`Endpoint ${path} failed:`, status, msg);

        // try next path only on 404
        if (status === 404) {
          continue;
        }
        throw new Error(msg);
      }
    }

    throw new Error(
      lastError?.response?.data?.message ||
        lastError?.message ||
        'All payment endpoints failed'
    );
  };

  const approvePaymentOnServer = async (
    paymentId: string,
    orderId: string,
    paymentAmount: number
  ) => {
    return postWithFallback(
      ['/pi/approve', '/payment/approve', '/payments/approve'],
      {
        paymentId,
        orderId,
        amount: paymentAmount,
        network: networkValue,
        pageUrl: window.location.href,
        pageOrigin: window.location.origin,
      }
    );
  };

  const completePaymentOnServer = async (
    paymentId: string,
    txid: string,
    orderId: string,
    paymentAmount: number
  ) => {
    return postWithFallback(
      ['/pi/complete', '/payment/complete', '/payments/complete'],
      {
        paymentId,
        txid,
        orderId,
        amount: paymentAmount,
        network: networkValue,
        pageUrl: window.location.href,
        pageOrigin: window.location.origin,
      }
    );
  };


  const createPiPayment = async () => {
    if (!window.Pi) {
      setStatus('Pi SDK not found. Please open this app inside Pi Browser.');
      return;
    }

    if (typeof window.Pi.createPayment !== 'function') {
      setStatus('Pi createPayment function is not available.');
      return;
    }

    if (!isAuthenticated) {
      setStatus('Please login with Pi first.');
      return;
    }

    if (!API_BASE_URL) {
      setStatus('VITE_API_URL is not set. Backend URL is required.');
      return;
    }

    const amountValidation = validateAmount();

    if (!amountValidation.valid) {
      setStatus(amountValidation.message);
      return;
    }

    const paymentAmount = amountValidation.value;
    const orderId = (PI_SANDBOX ? 'test_order_' : 'main_order_') + Date.now();

    try {
      setIsPaying(true);

      // Warm backend first so approve is fast (payment expires in ~60s)
      try {
        await warmUpBackend();
      } catch (warmErr) {
        console.warn('Warm-up skipped:', warmErr);
      }

      setStatus(`Creating ${networkLabel} Pi payment...`);

      const paymentData = {
        amount: paymentAmount,
        memo: `PiExplorer payment - ${paymentAmount} Pi`,
        metadata: {
          type: PI_SANDBOX ? 'testnet_payment' : 'mainnet_payment',
          orderId,
          username: currentUsername || '',
          amount: paymentAmount,
          network: networkValue,
          pageOrigin: window.location.origin,
        },
      };

      /**
       * IMPORTANT for Pi SDK:
       * Callbacks must RETURN the Promise so the wallet waits for server approve/complete.
       * Using async without returning (or fire-and-forget) causes:
       * "Preparing for a payment... This payment will expire in XX second(s)."
       */
      const callbacks = {
        onReadyForServerApproval: function (paymentId: string) {
          console.log('Ready for server approval:', paymentId);
          setStatus('Approving payment on server...');

          return approvePaymentOnServer(paymentId, orderId, paymentAmount)
            .then(() => {
              setStatus('Approved. Confirm the payment in Pi Wallet...');
            })
            .catch((error: any) => {
              console.error('Server approval error:', error);
              setIsPaying(false);
              setStatus(
                'Server approval error: ' + (error?.message || String(error))
              );
              // Re-throw so Pi SDK knows approval failed
              throw error;
            });
        },

        onReadyForServerCompletion: function (paymentId: string, txid: string) {
          console.log('Ready for server completion:', paymentId, txid);
          setStatus('Completing payment on server...');

          return completePaymentOnServer(
            paymentId,
            txid,
            orderId,
            paymentAmount
          )
            .then(() => {
              setStatus('Payment completed successfully. TXID: ' + txid);
              setIsPaying(false);
            })
            .catch((error: any) => {
              console.error('Server completion error:', error);
              setIsPaying(false);
              setStatus(
                'Server completion error: ' + (error?.message || String(error))
              );
              throw error;
            });
        },

        onCancel: function (paymentId: string) {
          console.log('Payment cancelled:', paymentId);
          setIsPaying(false);
          setStatus('Payment cancelled by user.');
        },

        onError: function (error: any, payment: any) {
          console.error('Payment error:', error, payment);
          setIsPaying(false);
          setStatus('Payment error: ' + (error?.message || String(error)));
        },
      };

      // Fire createPayment — flow continues in callbacks
      window.Pi.createPayment(paymentData, callbacks);

      setStatus('Payment opened in Pi Wallet. Waiting for server approval...');
    } catch (error: any) {
      console.error('Create payment error:', error);
      setIsPaying(false);
      setStatus('Create payment error: ' + (error?.message || String(error)));
    }
  };

  return (
    <section
      style={{
        margin: '24px auto',
        padding: '20px',
        maxWidth: '430px',
        border: '1px solid rgba(103, 58, 183, 0.3)',
        borderRadius: '18px',
        textAlign: 'center',
        background: '#ffffff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ color: '#673ab7', marginBottom: '8px' }}>Pi Payment</h2>

      <p style={{ color: '#666', fontSize: '14px' }}>
        Login with Pi and create a variable amount payment.
      </p>

      <div
        style={{
          display: 'inline-block',
          marginBottom: '14px',
          padding: '6px 12px',
          borderRadius: '999px',
          background: PI_SANDBOX ? '#fff3e0' : '#e8f5e9',
          color: PI_SANDBOX ? '#ef6c00' : '#2e7d32',
          fontSize: '12px',
          fontWeight: 700,
        }}
      >
        Network: {networkLabel}
      </div>

      {!isAuthenticated ? (
        <button
          onClick={loginWithPi}
          disabled={isLoggingIn}
          style={{
            padding: '12px 22px',
            borderRadius: '24px',
            border: 'none',
            background: isLoggingIn ? '#999' : '#673ab7',
            color: '#fff',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            fontSize: '15px',
            fontWeight: 600,
          }}
        >
          {isLoggingIn ? 'Please wait...' : 'Login with Pi'}
        </button>
      ) : (
        <>
          <p style={{ marginTop: '15px', color: '#333' }}>
            Welcome <strong>@{currentUsername || 'Pi User'}</strong>
          </p>

          <button
            onClick={handleLogout}
            style={{
              marginBottom: '14px',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #ff5252',
              background: '#fff',
              color: '#ff5252',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
            }}
          >
            Logout
          </button>

          <div style={{ marginTop: '15px', marginBottom: '15px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '6px',
                color: '#333',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Payment Amount Pi
            </label>

            <input
              type="number"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPaying}
              style={{
                width: '100%',
                maxWidth: '220px',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                textAlign: 'center',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />

            <div
              style={{
                marginTop: '6px',
                fontSize: '11px',
                color: '#888',
              }}
            >
              Min: {MIN_AMOUNT} Pi / Max: {MAX_AMOUNT} Pi
            </div>
          </div>

          <button
            onClick={createPiPayment}
            disabled={isPaying}
            style={{
              padding: '12px 22px',
              borderRadius: '24px',
              border: 'none',
              background: isPaying ? '#999' : '#00c853',
              color: '#fff',
              cursor: isPaying ? 'not-allowed' : 'pointer',
              fontSize: '15px',
              fontWeight: 700,
            }}
          >
            {isPaying ? 'Processing...' : `Pay ${amount || '0'} Pi`}
          </button>
        </>
      )}

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#444',
          wordBreak: 'break-word',
          lineHeight: 1.5,
        }}
      >
        {status}
      </div>
    </section>
  );
};

export default PiPaymentPanel;
