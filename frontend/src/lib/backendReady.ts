/**
 * Bonto / serverless backends often cold-start.
 * First request may fail with Network Error; retry + warm-up fixes it.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://piexplorer.bonto.run/api'
).replace(/\/+$/, '');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

export function getHealthUrls(): string[] {
  const root = API_BASE_URL.replace(/\/api\/?$/, '');
  return [
    `${root}/health`,
    `${API_BASE_URL}/health`,
    `${root}/api/health`,
  ].filter((v, i, a) => a.indexOf(v) === i);
}

/** Fire-and-forget style warm-up with a few attempts */
export async function warmUpBackend(maxAttempts = 3): Promise<boolean> {
  const urls = getHealthUrls();
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    for (const url of urls) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 20000);
        const res = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (res.ok || res.status < 500) {
          console.log('Backend warm-up OK:', url, res.status);
          return true;
        }
      } catch (e) {
        console.warn(`Warm-up attempt ${attempt} failed for ${url}:`, e);
      }
    }
    if (attempt < maxAttempts) {
      await sleep(800 * attempt);
    }
  }
  return false;
}

export function isNetworkError(err: any): boolean {
  if (!err) return false;
  const msg = String(err?.message || err || '').toLowerCase();
  if (err?.code === 'ERR_NETWORK' || err?.code === 'ECONNABORTED') return true;
  if (msg.includes('network error')) return true;
  if (msg.includes('timeout')) return true;
  if (msg.includes('failed to fetch')) return true;
  if (msg.includes('networkerror')) return true;
  // Axios: no response = network-level
  if (err?.request && !err?.response) return true;
  return false;
}

/**
 * POST with path fallbacks + retries on network errors (cold start).
 */
export async function postWithRetry<T = any>(
  axiosClient: {
    post: (url: string, data?: any, config?: any) => Promise<{ data: T }>;
  },
  paths: string[],
  body: Record<string, unknown>,
  options?: { maxAttempts?: number; onRetry?: (attempt: number, err: any) => void }
): Promise<T> {
  const maxAttempts = options?.maxAttempts ?? 4;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // On first failures, wake the server
    if (attempt > 1) {
      options?.onRetry?.(attempt, lastError);
      await warmUpBackend(2);
      await sleep(600 * attempt);
    }

    for (const path of paths) {
      try {
        const response = await axiosClient.post(path, body, {
          timeout: 45000,
        });
        return response.data as T;
      } catch (err: any) {
        lastError = err;
        const status = err?.response?.status;
        const routeMissing =
          status === 404 &&
          typeof err?.response?.data?.message === 'string' &&
          /route not found/i.test(err.response.data.message);

        if (routeMissing) {
          // try next path
          continue;
        }

        if (isNetworkError(err)) {
          // break inner loop → retry whole attempt after warm-up
          break;
        }

        // Business / HTTP errors: do not retry forever
        throw err;
      }
    }
  }

  throw lastError || new Error('Network Error');
}

export const PI_LOGIN_PATHS = [
  '/auth/pi-login',
  '/api/auth/pi-login',
];
