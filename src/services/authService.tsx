import axios from "axios";

// Set up base URL for backend API (update with the correct port your backend is listening on)
const API_BASE_URL = "https://localhost:7124"; // Ensure you're using the correct protocol (https or http)

// Define endpoints for login and register, including the version (v1)
const LOGIN_URL = `${API_BASE_URL}/api/authenticate/login`; // Updated with v1
const REGISTER_URL = `${API_BASE_URL}/api/authenticate/register`; // Updated with v1

// Function to handle login
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(LOGIN_URL, {
      username,
      password,
    });
    return response.data; // Return the response data from the backend
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // You can handle errors in the frontend UI as needed
  }
};

// Function to handle register
export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(REGISTER_URL, {
      username,
      password,
    });
    return response.data; // Return the response data from the backend
  } catch (error) {
    console.error("Error registering:", error);
    throw error; // Handle errors in the frontend UI
  }
};
