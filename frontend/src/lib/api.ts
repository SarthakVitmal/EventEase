import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important when credentials mode is 'include'
});

// Interface for signup data
export interface SignupData {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  dateOfBirth: string;
}

// Signup function
export const signup = async (userData: SignupData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred during signup');
  }
};

export default api;