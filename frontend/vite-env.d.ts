/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT?: string;
  readonly VITE_API_URL: string;
  readonly VITE_PI_APP_URL?: string;
  readonly VITE_PI_APP_ID?: string;
  readonly VITE_PI_CLIENT_ID?: string;
  /**
   * true  = Testnet / Sandbox
   * false = Mainnet
   */
  readonly VITE_PI_SANDBOX?: string;
  readonly VITE_DEFAULT_PI_AMOUNT?: string;
  readonly VITE_MIN_PI_AMOUNT?: string;
  readonly VITE_MAX_PI_AMOUNT?: string;
  readonly VITE_PROXY_API_TARGET?: string;
  readonly VITE_STELLAR_HORIZON_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * Pi Browser SDK — typed loosely (any) so runtime SDK shape never blocks login.
 */
interface Window {
  __PI_BROWSER_REQUIRED_BLOCKED__?: boolean;
  Pi?: any;
  __PI_SDK_INITIALIZED__?: boolean;
  __PI_SDK_SANDBOX__?: boolean;
}
