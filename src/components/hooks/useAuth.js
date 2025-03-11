"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = Cookies.get("userData");
    const storedToken = Cookies.get("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    Cookies.set("userData", JSON.stringify(userData));
    Cookies.set("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("userData");
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
