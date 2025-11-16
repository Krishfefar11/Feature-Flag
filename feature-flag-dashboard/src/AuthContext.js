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
    const token = res.data.token;

    localStorage.setItem("token", token);
    setToken(token);

    const decoded = jwtDecode(token);

    const userObj = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userObj);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
