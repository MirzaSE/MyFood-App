import axios from 'axios';
import {UserRegister} from "../components/LoginPage";

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
    baseURL: 'https://localhost:7124/api/',
  });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

  export const getFoods = async () => {
    const response = await api.get('/v1/foods');
    return response;
  };

  export const createFood = async (newFood: { name: string; calories: number }) => {
    const response = await api.post('/v1/foods', newFood);
    return response.data;
  };


export const loginUser = async (data: Login) => {
  try {
    const response = await api.post('/account/login', data);
    localStorage.setItem('accessToken', response.data.token);
    return response.data;
  } catch (error) {
    return error
  }
}

export const registerUser = async (data: Register) => {
  try {
    const response = await api.post('/account/register', data);
    return response.data;
  } catch (error) {
    return error
  }
}

  export function registerTransformToServerData(data: UserRegister) : Register {
    return  {
      username: data.username,
      email: data.email,
      password: data.password,
    }
  }