"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  userIcon: string | null;
  login: (token: string, icon: string) => void;
  logout: () => void;
  setUserIcon: (icon: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIcon, setUserIcon] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const icon = localStorage.getItem("userIcon");
    if (token) {
      setIsAuthenticated(true);
      setUserIcon(icon);
    }
  }, []);

  const login = (token: string, icon: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userIcon", icon);
    setIsAuthenticated(true);
    setUserIcon(icon);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userIcon");
    setIsAuthenticated(false);
    setUserIcon(null);
    router.push("/");
  };

  const updateUserIcon = (icon: string) => {
    localStorage.setItem("userIcon", icon);
    setUserIcon(icon);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userIcon, login, logout, setUserIcon: updateUserIcon }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
