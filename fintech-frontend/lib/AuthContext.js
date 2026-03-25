"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("fintech_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const saveUser = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("fintech_user", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fintech_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, saveUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
