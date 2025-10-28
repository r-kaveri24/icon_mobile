import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '@icon/config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // For GET requests, avoid sending Content-Type to prevent unnecessary CORS preflight
        if (String(config.method).toLowerCase() === 'get') {
          if (config.headers) {
            // Axios may store headers in different shapes depending on adapter/version
            // Normalize then remove Content-Type for GET
            const h: any = config.headers as any;
            delete h['Content-Type'];
            delete h['content-type'];
          }
        }
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[API] Response error:', error.response?.data || error.message);
        
        // Handle common error cases
        if (error.response?.status === 401) {
          // Handle unauthorized - could trigger logout
          this.handleUnauthorized();
        }
        
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    // This would typically come from secure storage
    // For now, return null - implement based on your auth strategy
    return null;
  }

  private handleUnauthorized() {
    // Handle unauthorized access - clear token, redirect to login, etc.
    console.log('[API] Unauthorized access detected');
  }

  // HTTP methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Update base URL (useful for switching between mock and real API)
  setBaseURL(baseURL: string) {
    this.client.defaults.baseURL = baseURL;
  }

  // Set auth token
  setAuthToken(token: string) {
    this.client.defaults.headers.Authorization = `Bearer ${token}`;
  }

  // Clear auth token
  clearAuthToken() {
    delete this.client.defaults.headers.Authorization;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();