import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import * as authService from "./api/authService";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const userObj = {
        _id: decoded._id,
        email: decoded.email,
        role: decoded.role,
      };

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userObj);
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decoded = jwtDecode(newToken);

    const userObj = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setUser(userObj);
  };

  const adminLogin = async () => {
    const res = await authService.adminLogin();
    const newToken = res.data.token;

    localStorage.setItem("token", newToken);
    setToken(newToken);

    const decoded = jwtDecode(newToken);

    const userObj = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setUser(userObj);
  };

  const register = async (email, password, name) => {
    await authService.register(email, password, name);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, adminLogin, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
