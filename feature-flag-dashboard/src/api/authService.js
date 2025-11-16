import axios from "axios";

const API_URL = "http://localhost:5001/api"; // ✅ matches your backend

// Login
export async function login(email, password) {
  return axios.post(`${API_URL}/login`, { email, password });
}

// Register (optional, for testing)
export async function register(email, password) {
  return axios.post(`${API_URL}/register`, { email, password });
}
