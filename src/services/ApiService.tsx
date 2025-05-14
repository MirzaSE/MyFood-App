import axios from 'axios';


const api = axios.create({
    baseURL: 'https://localhost:7124/api',
  });
  
  export const getFoods = async () => {
    const response = await api.get('/foods');
    return response;
  };

  export const createFood = async (newFood: { name: string; calories: number }) => {
    const response = await api.post('/foods', newFood);
    return response.data;
  };

 export const loginUser = async (username: string, password: string) => {
  const response = await api.post('/authenticate/login', {
    username,
    password
  });
  return response.data;
};

  export const registerUser = async (username: string, password: string) => {
  const response = await api.post('/authenticate/register', {
    username,
    password
  });
  return response.data;
};

export const storeToken = (token: string) => {
  localStorage.setItem('authToken', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getToken = () => localStorage.getItem('authToken');

export const removeToken = () => {
  localStorage.removeItem('authToken');
  delete api.defaults.headers.common['Authorization'];
};

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

