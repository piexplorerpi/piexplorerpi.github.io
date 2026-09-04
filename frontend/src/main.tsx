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
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  return String(value).trim().toLowerCase() === 'true';
};

const PI_SANDBOX = parseBooleanEnv(import.meta.env.VITE_PI_SANDBOX, false);

/**
 * Initialize Pi SDK with enhanced error handling to prevent app crash.
 * This is the single source of truth for Pi SDK initialization.
 */
async function initializePiSdk() {
  if (window.__PI_SDK_INITIALIZED__) {
    return;
  }

  // If Pi is not available, we don't throw an error to avoid white screen.
  // We just log it and let the app run in "non-Pi" mode.
  if (!window.Pi) {
    console.warn('Pi SDK is not available yet. App will run without Pi features.');
    return;
  }

  try {
    if (typeof window.Pi.init === 'function') {
      window.Pi.init({
        version: '2.0',
        sandbox: PI_SANDBOX,
      });
      window.__PI_SDK_INITIALIZED__ = true;
      window.__PI_SDK_SANDBOX__ = PI_SANDBOX;
      console.log('Pi SDK initialized successfully from main.tsx.');
    }
  } catch (error) {
    console.error('Failed to initialize Pi SDK in main.tsx:', error);
    // We do NOT throw the error here so the React app can still mount.
  }
}

async function bootstrap() {
  if (window.__PI_BROWSER_REQUIRED_BLOCKED__) {
    console.warn('Pi Browser is required. Rendering blocked.');
    return;
  }

  // 1. Initialize SDK first
  await initializePiSdk();

  // 2. Find root element
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error("Critical Error: Could not find element with id 'root'.");
    return;
  }

  // 3. Render App
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <I18nProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </I18nProvider>
      </React.StrictMode>
    );
  } catch (renderError) {
    console.error('Fatal rendering error:', renderError);
    rootElement.innerHTML = `
      <div style="color:red; padding:20px; font-family:sans-serif;">
        <h2>Rendering Error</h2>
        <p>An error occurred while loading the application. Please refresh the page.</p>
      </div>
    `;
  }
}

bootstrap();
