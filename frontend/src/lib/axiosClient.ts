// frontend/src/lib/axiosClient.ts
import axios, { AxiosError } from 'axios';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || 'https://piexplorer.bonto.run/api').replace(
    /\/+$/,
    ''
  );

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT so payment approve/complete and protected routes work
axiosClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn('Unauthorized! Cleaning up session...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!window.location.hash.includes('/login')) {
          setTimeout(() => {
            window.location.hash = '#/login';
          }, 100);
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
