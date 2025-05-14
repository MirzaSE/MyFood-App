
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface AuthResponse {
  token: string;
  userId: string;
  username: string;
}

export interface RegisterParams {
  username: string;
  password: string;
}

export const register = async (userData: RegisterParams): Promise<void> => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const login = async (userData: RegisterParams): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject(error.response.data.message || 'An error occurred');
    }
    return Promise.reject('Network error - please check your connection');
  }
);