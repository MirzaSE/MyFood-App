import axios from "axios";

import { UserRegister } from "../components/LoginPage";

export interface Login {
  username: string;
  password: string;
}
export interface Register {
  email: string;
  username: string;
  password: string;
}

const api = axios.create({
  baseURL: "https://localhost:7124/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const authApi = axios.create({
  baseURL: "https://localhost:7124/api/account",
});

export const getFoods = async () => {
  const response = await api.get("/foods");
  return response;
};

export const createFood = async (newFood: {
  name: string;
  calories: number;
}) => {
  const response = await api.post("/foods", newFood);
  return response.data;
};

export const loginUser = async (data: Login) => {
  try {
    const response = await authApi.post("/login", data);
    localStorage.setItem("accessToken", response.data.token);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const registerUser = async (data: Register) => {
  try {
    const response = await authApi.post("/register", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

export function registerTransformToServerData(data: UserRegister): Register {
  return {
    username: data.username,
    email: data.email,
    password: data.password,
  };
}
