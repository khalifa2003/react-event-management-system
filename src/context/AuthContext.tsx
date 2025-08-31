import React, { createContext, useState, useEffect, ReactNode } from "react";
import jwtDecode from "jwt-decode";
import { loginUser, registerUser } from "../services/authAPI";

// Define user type (from JWT payload)
interface User {
  id: string;
  email: string;
  role: "admin" | "user";
  exp?: number;
  iat?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  register: (userInfo: RegisterData) => Promise<any>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check token on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const data = await loginUser(credentials);
    if (data.token) {
      localStorage.setItem("token", data.token);
      const decoded = jwtDecode<User>(data.token);
      setUser(decoded);
    }
    return data;
  };

  const register = async (userInfo: RegisterData) => {
    const data = await registerUser(userInfo);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
