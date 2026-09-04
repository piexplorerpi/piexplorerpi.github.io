import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n/I18nContext';

declare global {
  interface Window {
    __PI_BROWSER_REQUIRED_BLOCKED__?: boolean;
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

/**
 * وظیفه این تابع فقط مقداردهی اولیه است و نباید توسط جای دیگری فراخوانی شود.
 */
async function initializePiSdk(): Promise<void> {
  if (window.__PI_SDK_INITIALIZED__) return;

  // انتظار برای اطمینان از بارگذاری کامل اسکریپت Pi SDK
  if (!window.Pi) {
    console.warn('Pi SDK not found. Waiting for load...');
    return new Promise((resolve) => {
      window.addEventListener('load', () => resolve(initializePiSdk()));
    });
  }

  try {
    if (typeof window.Pi.init === 'function') {
      window.Pi.init({
        version: '2.0',
        sandbox: PI_SANDBOX,
      });
      window.__PI_SDK_INITIALIZED__ = true;
      window.__PI_SDK_SANDBOX__ = PI_SANDBOX;
      console.log('Pi SDK initialized successfully.');
    }
  } catch (error) {
    console.error('Failed to initialize Pi SDK:', error);
  }
}

// شروع فرآیند رندرینگ
async function startApp() {
  if (window.__PI_BROWSER_REQUIRED_BLOCKED__) {
    console.warn('Pi Browser required. Rendering blocked.');
    return;
  }

  await initializePiSdk();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Critical Error: Could not find the root element with id 'root'.");
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <I18nProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nProvider>
    </React.StrictMode>
  );
}

startApp();
