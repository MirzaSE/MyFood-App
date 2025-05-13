// src/ApiServices.tsx
import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://localhost:7124/api',  // no /v1 here — AccountController is registered under /api/[controller]
})

// Food calls (still under /api/v1)
export const getFoods = () =>
  api.get('/v1/foods').then(res => res.data)

export const createFood = (newFood: { name: string; calories: number }) =>
  api.post('/v1/foods', newFood).then(res => res.data)

// Auth calls against AccountController
export const registerUser = async (
  email: string,
  password: string
): Promise<void> => {
  // your RegisterDto has Email, Password, ConfirmPassword
  await api.post('/Account/register', {
    email,
    password,
    confirmPassword: password,   // mirror the password in ConfirmPassword
  })
}

export const loginUser = async (
  username: string,
  password: string
): Promise<{ token: string; expiration: string; roles: string[] }> => {
  // your LoginDto most likely has Username and Password
  const res = await api.post('/Account/login', {
    username,
    password,
  })
  return res.data
}
