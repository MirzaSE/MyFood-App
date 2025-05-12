import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api/v1",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

//register
export const registerUser = async (user: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
 
    const response = await api.post("/account/register", user);
    return response.data;
  
};

export const loginUser = async (user: {
  email: string;
  password: string;
}) => {
  
    const response = await api.post("/account/login", user);
    const token = response.data.token;

    localStorage.setItem("token", token);

    return response.data; 
  
};
