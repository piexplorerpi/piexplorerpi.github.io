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
 * Single source of truth for the Pi Browser SDK surface used in this app.
 */
interface PiSDK {
  init?: (config: { version: string; sandbox: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: any) => void
  ) => Promise<any>;
  createPayment?: (
    paymentData: {
      amount: number;
      memo?: string;
      metadata?: Record<string, unknown>;
    },
    callbacks?: {
      onReadyForServerApproval?: (paymentId: string) => void | Promise<void>;
      onReadyForServerCompletion?: (paymentId: string, txid: string) => void | Promise<void>;
      onCancel?: (paymentId: string) => void;
      onError?: (error: any, payment?: any) => void;
    }
  ) => any;
  /** Legacy / alternative callback registration used by some code paths */
  onReadyForServerApproval?: (cb: (paymentId: string) => void | Promise<void>) => void;
  onReadyForServerCompletion?: (
    cb: (paymentId: string, txid: string) => void | Promise<void>
  ) => void;
  openShareDialog?: (title: string, message: string) => void;
  nativeFeaturesList?: () => Promise<string[]>;
}

interface Window {
  __PI_BROWSER_REQUIRED_BLOCKED__?: boolean;
  Pi?: PiSDK;
  __PI_SDK_INITIALIZED__?: boolean;
  __PI_SDK_SANDBOX__?: boolean;
}
