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

  // Bonto/server cold start may take more than 10 seconds.
  timeout: 30000,
});

/**
 * Request Interceptor
 * Add JWT token to all authenticated requests.
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
 * Handle errors safely to avoid white screen.
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
        // If you use HashRouter, use hash navigation.
        const currentHash = window.location.hash || '#/';

        if (!currentHash.includes('/login')) {
          window.location.hash = '#/login';
        }
      } else if (status === 403) {
        console.error('Forbidden:', error.response.data);
      } else if (status === 404) {
        console.error('API route not found:', error.config?.url);
      } else if (status === 500) {
        console.error('Server Error:', error.response.data);
      } else {
        console.error('API Error:', {
          status,
          data: error.response.data,
          url: error.config?.url,
        });
      }
    } else if (error.request) {
      console.error(
        'Network Error: Cannot connect to the server. Please check VITE_API_URL, CORS, internet, or backend status.'
      );
    } else {
      console.error('Axios Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
