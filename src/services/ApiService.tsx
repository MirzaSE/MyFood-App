import axios from "axios";

const API_URL = "https://localhost:7124/api";

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth endpoints
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export const loginUser = async (data: LoginData) => {
  try {
    const response = await api.post(`${API_URL}/auth/login`, data);
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const registerUser = async (data: RegisterData) => {
  try {
    const response = await api.post(`${API_URL}/auth/register`, {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Food endpoints
export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  type: string;
}

export const getFoods = async (): Promise<FoodItem[]> => {
  try {
    const response = await api.get(`${API_URL}/foods`);
    return response.data;
  } catch (error) {
    console.error("Error fetching foods:", error);
    throw error;
  }
};

export const createFood = async (
  food: Omit<FoodItem, "id">
): Promise<FoodItem> => {
  try {
    const response = await api.post(`${API_URL}/foods`, food);
    return response.data;
  } catch (error) {
    console.error("Error creating food:", error);
    throw error;
  }
};
