import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ApiResponse } from '@/shared/types/api.types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.cramly.app';

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor: attach token ──────────────────────────────
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: handle 401 refresh ───────────────────────
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });
          useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
          return instance(originalRequest);
        } catch {
          useAuthStore.getState().logout();
        }
      } else {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

// ── Typed API client methods ───────────────────────────────────────
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    instance.get(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    instance.post(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    instance.put(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    instance.patch(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    instance.delete(url, config).then((res) => res.data),

  upload: <T>(url: string, formData: FormData, onProgress?: (pct: number) => void): Promise<ApiResponse<T>> =>
    instance
      .post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      })
      .then((res) => res.data),
};
