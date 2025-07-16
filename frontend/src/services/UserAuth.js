
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth'; // update if needed

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data; // usually contains token or user info
};

export const signupUser = async (name, email, password) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, {
    name,
    email,
    password,
  });
  return response.data;
};
