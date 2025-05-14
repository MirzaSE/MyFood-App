import axios from 'axios';


const api = axios.create({
    baseURL: 'https://localhost:7124/api/v1',
  });
  
  export const getFoods = async () => {
    const response = await api.get('/foods');
    return response;
  };

  export const createFood = async (newFood: { name: string; calories: number }) => {
    const response = await api.post('/foods', newFood);
    return response.data;
  };
  