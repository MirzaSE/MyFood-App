import axios from "axios";
import { UserRegister } from "../components/LoginPage";

export interface Login {
  username: string;
  password: string;
}

export interface Register {
  username: string;
  password: string;

}

const api = axios.create({
  baseURL: "https://localhost:7124/api/v1",
});

// Auth API with correct base URL and headers
const authApi = axios.create({
  baseURL: "https://localhost:7124/api/authenticate",
  headers: {
    "Content-Type": "application/json-patch+json; x-api-version=1.0",
    "x-api-version": "1.0"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export const getFoods = async () => {
  const response = await api.get("/foods");
  return response;
};

export const createFood = async (newFood: { name: string; calories: number }) => {
  const response = await api.post("/foods", newFood);
  return response.data;
};

export const loginUser = async (data: Login) => {
  try {
    const response = await authApi.post("/login", data);
    const responseData = response.data as { token: string };
    localStorage.setItem("accessToken", responseData.token);
    return responseData;
  } catch (error) {
    throw error; 
  }
};

export const registerUser = async (data: Register) => {
  try {
    const response = await authApi.post("/register", data);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export function registerTransformToServerData(data: UserRegister): Register {
  return {
    username: data.username,
    password: data.password,
  };
}