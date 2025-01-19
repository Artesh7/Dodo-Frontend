import React, { useState, createContext, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: Cookies.get("token") || null });

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  const login = async (credentials) => {
    try {
      const token = await authService.login(credentials);
      if (isTokenExpired(token)) {
        throw new Error("Token is expired");
      }
      Cookies.set("token", token, { expires: 7 });
      setAuth({ token });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setAuth({ token: null });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token && isTokenExpired(token)) {
      console.warn("Token is expired. Logging out...");
      logout();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
