import axios from 'axios';
import { Transaction, Category } from '@/lib/types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - server might be down');
    } else {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for better error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

const handleApiError = async (promise: Promise<any>) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const transactionApi = {
  getAll: () => handleApiError(api.get<Transaction[]>('/transactions')),
  create: (data: Omit<Transaction, 'id'>) => 
    handleApiError(api.post<Transaction>('/transactions', data)),
  update: (id: string, data: Partial<Transaction>) =>
    handleApiError(api.put<Transaction>(`/transactions/${id}`, data)),
  delete: (id: string) => handleApiError(api.delete(`/transactions/${id}`)),
};

export const categoryApi = {
  getAll: () => handleApiError(api.get<Category[]>('/categories')),
  create: (data: Omit<Category, 'id'>) => 
    handleApiError(api.post<Category>('/categories', data)),
  update: (id: string, data: Partial<Category>) =>
    handleApiError(api.put<Category>(`/categories/${id}`, data)),
  delete: (id: string) => handleApiError(api.delete(`/categories/${id}`)),
};