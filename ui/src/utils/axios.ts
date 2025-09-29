import axios from 'axios';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';

import { getToken, clearToken } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_HOST || 'http://localhost:8000',
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      return {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
