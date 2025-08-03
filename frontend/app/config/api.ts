// Centralized API configuration for microservices
export const API_CONFIG = {
  // Service URLs - ensure these match your backend service ports
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:8081',
  ITEM_SERVICE: process.env.NEXT_PUBLIC_ITEM_SERVICE_URL || 'http://localhost:9091',
  ORDER_SERVICE: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || 'http://localhost:9092',
  REVIEW_SERVICE: process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL || 'http://localhost:9095',
  SUPPORT_SERVICE: process.env.NEXT_PUBLIC_SUPPORT_SERVICE_URL || 'http://localhost:9093',

  // API Endpoints
  ENDPOINTS: {
    // Auth Service
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VALIDATE_TOKEN: '/auth/validate',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',

    // Item Service
    ITEMS: '/items',
    ITEM_BY_ID: (id: string) => `/items/${id}`,
    USER_ITEMS: (email: string) => `/items/user/${email}`,
    BOOK_ITEM: (id: string) => `/items/${id}/book`,

    // Order Service
    ORDERS: '/orders',
    ORDERS_USER: '/orders/user',
    ORDER_BY_ID: (id: string) => `/orders/${id}`,
    CONFIRM_ORDER: '/orders/confirm-with-details',
    CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,
    CREATE_ORDER: '/orders',
    CREATE_RENTAL_ORDER: '/orders/rental',
    CREATE_PAYMENT_ORDER: '/api/payment/create-order',

    // Review Service
    REVIEWS: '/api/reviews',
    REVIEWS_BY_ITEM: (itemId: string) => `/api/reviews/item/${itemId}`,
    AVERAGE_RATING: (itemId: string) => `/api/reviews/item/${itemId}/average-rating`,

    // Support Service
    SUPPORT_CHAT: '/api/support/chat',
  }
};

// Define only valid service keys (excluding ENDPOINTS)
type ServiceKeys = 'AUTH_SERVICE' | 'ITEM_SERVICE' | 'ORDER_SERVICE' | 'REVIEW_SERVICE' | 'SUPPORT_SERVICE';

// Helper function to build full URLs
export const buildUrl = (service: ServiceKeys, endpoint: string): string => {
  return `${API_CONFIG[service]}${endpoint}`;
};

// API client with common configuration and better error handling
export const apiClient = {
  get: async (url: string, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          ...headers,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GET ${url} failed:`, errorText);
        throw new Error(`GET ${url} failed: ${response.status} ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in GET ${url}:`, error);
      throw error;
    }
  },

  post: async (url: string, data: any, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`POST ${url} failed:`, errorText);
        throw new Error(`POST ${url} failed: ${response.status} ${errorText}`);
      }

      // Handle both JSON and text responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      console.error(`Error in POST ${url}:`, error);
      throw error;
    }
  },

  put: async (url: string, data: any, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`PUT ${url} failed:`, errorText);
        throw new Error(`PUT ${url} failed: ${response.status} ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in PUT ${url}:`, error);
      throw error;
    }
  },

  patch: async (url: string, data: any, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`PATCH ${url} failed:`, errorText);
        throw new Error(`PATCH ${url} failed: ${response.status} ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in PATCH ${url}:`, error);
      throw error;
    }
  },

  delete: async (url: string, headers?: Record<string, string>) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`DELETE ${url} failed:`, errorText);
        throw new Error(`DELETE ${url} failed: ${response.status} ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in DELETE ${url}:`, error);
      throw error;
    }
  },
};
