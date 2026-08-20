// frontend/src/lib/axiosClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || 'https://pidao.bonto.run/api').replace(
    /\/+$/,
    ''
  );

const axiosClient = axios.create({
  // Production fallback must point to the real backend, not localhost.
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

  // Bonto/Render-like servers may be cold-started, so 10s can be too short.
  timeout: 30000,
});

/**
 * Request Interceptor
 * اضافه کردن توکن به تمام درخواست‌ها
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * مدیریت هوشمند خطاها برای جلوگیری از صفحه سفید
 */
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('Unauthorized! Cleaning up session...');

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // IMPORTANT:
        // اگر از HashRouter استفاده می‌کنی، باید hash عوض شود.
        const currentHash = window.location.hash || '#/';

        if (!currentHash.includes('/login')) {
          window.location.hash = '#/login';
        }
      } else if (status === 403) {
        console.error('Forbidden:', error.response.data);
      } else if (status === 404) {
        console.error('API route not found:', error.config?.url);
      } else if (status === 500) {
        console.error('Server Error: Something went wrong on the backend.');
      }
    } else if (error.request) {
      console.error(
        'Network Error: Cannot connect to the server. Please check VITE_API_URL, CORS, internet, or backend status.'
      );
    } else {
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
