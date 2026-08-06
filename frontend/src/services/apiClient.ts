import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

/**
 * Configure Axios base instance for Venlix AI Backend.
 */
export const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('venlix_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Check if error is due to authentication / expiration
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        // Handle unauthorized token clearance (e.g. log out or redirect to login)
        console.warn('Session expired. Action required.');
        localStorage.removeItem('venlix_auth_token');
      } else if (status === 403) {
        console.error('Forbidden access requested.');
      } else if (status === 500) {
        console.error('Internal server error occurred.');
      }
    } else {
      // Network issues or timeout
      console.error('Network connectivity issues detected.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
