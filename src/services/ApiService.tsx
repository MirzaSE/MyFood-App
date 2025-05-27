import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7124/api",
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

export const loginUser = async (username: string, password: string) => {
  const response = await api.post("/authenticate/login", {
    username,
    password,
  });
  return response.data;
};

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await api.post(
      "/authenticate/register",
      { username, password },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "1.0",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Server error response:", error.response.data);
      // Log all errors if array exists
      if (error.response.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
      const serverError =
        error.response.data?.errors?.join(", ") || // Join all errors in array
        error.response.data?.message ||
        "Registration failed";
      throw new Error(serverError);
    }
    throw new Error("Network error during registration");
  }
};
export const storeToken = (token: string) => {
  localStorage.setItem("authToken", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getToken = () => localStorage.getItem("authToken");

export const removeToken = () => {
  localStorage.removeItem("authToken");
  delete api.defaults.headers.common["Authorization"];
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
