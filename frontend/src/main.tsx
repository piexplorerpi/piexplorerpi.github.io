// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n/I18nContext';

declare global {
  interface Window {
    __PI_BROWSER_REQUIRED_BLOCKED__?: boolean;
    Pi?: {
      init: (config: { version: string; sandbox: boolean }) => void;
      authenticate: any;
      createPayment: any;
    };
    __PI_SDK_INITIALIZED__?: boolean;
  }
}

/**
 * Initialize Pi SDK once.
 * Pi SDK is loaded in frontend/index.html:
 * <script src="https://sdk.minepi.com/pi-sdk.js"></script>
 */
function initializePiSdk() {
  if (window.__PI_SDK_INITIALIZED__) {
    return;
  }

  if (!window.Pi) {
    console.warn(
      'Pi SDK is not available on window.Pi. Make sure pi-sdk.js is loaded before React.'
    );
    return;
  }

  try {
    window.Pi.init({
      version: '2.0',

      /**
       * اگر اپلیکیشن را در Sandbox تست می‌کنی true بگذار.
       * اگر Production/Mainnet است false بماند.
       */
      sandbox: false,
    });

    window.__PI_SDK_INITIALIZED__ = true;

    console.log('Pi SDK initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Pi SDK:', error);
  }
}

// اگر صفحه روی tiraxturumuz1.github.io خارج از Pi Browser باز شده باشد،
// index.html پیام راهنما را نمایش می‌دهد و React نباید آن را جایگزین کند.
if (window.__PI_BROWSER_REQUIRED_BLOCKED__) {
  console.warn(
    'Pi Browser is required. React app rendering has been blocked outside Pi Browser.'
  );
} else {
  initializePiSdk();

  // پیدا کردن عنصر ریشه با استفاده از TypeScript برای جلوگیری از خطای null
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error(
      "Critical Error: Could not find the root element with id 'root'. Please check your index.html"
    );
  }

  // رندر کردن اپلیکیشن
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* I18nProvider برای چندزبانه کردن کل اپلیکیشن */}
      <I18nProvider>
        {/* AuthProvider برای دسترسی Router و تمام کامپوننت‌ها به احراز هویت */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}
