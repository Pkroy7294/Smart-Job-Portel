import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/client";

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  token: "sjp_token",
  user: "sjp_user"
};

function readStoredUser() {
  const storedUser = localStorage.getItem(STORAGE_KEYS.user);
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.token));
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.token);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  async function login(credentials) {
    const data = await apiClient.post("/auth/login", credentials);
    setToken(data.token);
    setUser({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    });
    return data;
  }

  async function register(payload) {
    const data = await apiClient.post("/auth/register", payload);
    setToken(data.token);
    setUser({
      userId: data.userId,
      fullName: data.fullName,
      email: data.email,
      role: data.role
    });
    return data;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
