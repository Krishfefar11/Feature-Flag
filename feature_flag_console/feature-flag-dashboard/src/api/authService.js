import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

// Login
export async function login(email, password) {
  return axios.post(`${API_URL}/login`, { email, password });
}

// Register
export async function register(email, password, name) {
  return axios.post(`${API_URL}/register`, { email, password, name });
}

// Admin Fast-Login
export async function adminLogin() {
  return axios.post(`${API_URL}/admin-login`);
}

// Forgot Password
export async function forgotPassword(email) {
  return axios.post(`${API_URL}/forgot-password`, { email });
}

// Reset Password
export async function resetPassword(token, newPassword) {
  return axios.post(`${API_URL}/reset-password`, { token, newPassword });
}
