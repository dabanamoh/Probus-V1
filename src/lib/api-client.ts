/**
 * Unified API Client for Production
 * This provides a centralized HTTP client for all backend API calls
 * with built-in error handling, request/response interceptors, and retry logic
 */

// Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Request interceptor type
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>;

// Response interceptor type
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(config: typeof API_CONFIG) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
  }

  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // Build full URL
  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  // Apply response interceptors
  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  // Core request method with retry logic
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...options.headers,
    };

    // Build request config
    let config: RequestInit = {
      ...options,
      headers,
    };

    // Apply request interceptors
    config = await this.applyRequestInterceptors(config);

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // Make request
      let response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Apply response interceptors
      response = await this.applyResponseInterceptors(response);

      // Handle non-200 responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || response.statusText,
          status: response.status,
          code: errorData.code,
          details: errorData,
        } as ApiError;
      }

      // Parse response
      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      // Retry logic for network errors
      if (retryCount < API_CONFIG.retryAttempts && this.shouldRetry(error)) {
        await this.delay(API_CONFIG.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      // Handle errors
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Determine if request should be retried
  private shouldRetry(error: any): boolean {
    // Retry on network errors or 5xx server errors
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      (error.status && error.status >= 500)
    );
  }

  // Delay helper for retry logic
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.request<T>(endpoint + queryString, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient(API_CONFIG);

// Add default request interceptor for authentication
apiClient.addRequestInterceptor((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Add default response interceptor for logging
apiClient.addResponseInterceptor((response) => {
  if (import.meta.env.DEV) {
    console.log(`API Response [${response.status}]:`, response.url);
  }
  return response;
});

export default apiClient;
