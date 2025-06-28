import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useErrorStore } from '@/store/error';
import { useAuthStore } from '@/store/auth';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        
        // Don't retry on client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry server errors up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry mutations on client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // Retry server errors once
        return failureCount < 1;
      },
      onError: (error: any) => {
        // Handle global mutation errors
        const { addError } = useErrorStore.getState();
        
        addError({
          code: error?.code || 'MUTATION_ERROR',
          message: error?.message || 'An error occurred during the operation',
          details: error,
        });
      },
    },
  },
});

// Global error handler for queries
queryClient.setMutationDefaults(['*'], {
  onError: (error: any) => {
    const { addError } = useErrorStore.getState();
    
    // Handle authentication errors
    if (error?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      return;
    }
    
    // Handle other errors
    addError({
      code: error?.code || 'QUERY_ERROR',
      message: error?.message || 'Failed to fetch data',
      details: error,
    });
  },
});

// Network status handler
if (typeof window !== 'undefined') {
  // Handle online/offline status
  window.addEventListener('online', () => {
    queryClient.resumePausedMutations();
    queryClient.invalidateQueries();
  });
  
  window.addEventListener('offline', () => {
    queryClient.pauseMutations();
  });
}

// API client configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = {
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const { sessionId } = useAuthStore.getState();
    
    const url = `${this.config.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.config.headers,
        ...(sessionId && { Authorization: `Bearer ${sessionId}` }),
        ...options.headers,
      },
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(response.status, errorData.message || response.statusText, errorData);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout', { originalError: error });
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(0, 'Network error', { originalError: error });
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Error class for API errors
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Export the API client instance
export const apiClient = new ApiClient();

// Query keys factory
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  user: (id: string) => [...queryKeys.auth, 'user', id] as const,
  
  // Partners
  partners: ['partners'] as const,
  partner: (id: string) => [...queryKeys.partners, id] as const,
  partnerAnalytics: (id: string) => [...queryKeys.partner(id), 'analytics'] as const,
  
  // API Keys
  apiKeys: (partnerId: string) => [...queryKeys.partner(partnerId), 'apiKeys'] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  analyticsOverview: (partnerId: string) => [...queryKeys.analytics, 'overview', partnerId] as const,
  analyticsUsage: (partnerId: string, period: string) => [...queryKeys.analytics, 'usage', partnerId, period] as const,
  
  // Support
  support: ['support'] as const,
  tickets: (partnerId: string) => [...queryKeys.support, 'tickets', partnerId] as const,
  ticket: (id: string) => [...queryKeys.support, 'ticket', id] as const,
  
  // Self-Healing
  health: ['health'] as const,
  healthStatus: () => [...queryKeys.health, 'status'] as const,
  healthMetrics: (service: string) => [...queryKeys.health, 'metrics', service] as const,
  
  // Billing
  billing: ['billing'] as const,
  billingInfo: (partnerId: string) => [...queryKeys.billing, partnerId] as const,
  billingUsage: (partnerId: string) => [...queryKeys.billing, 'usage', partnerId] as const,
} as const;

// React Query Provider Component
import React from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}