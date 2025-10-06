"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
          // Cookie cho middleware
          document.cookie = `auth-token=${token}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`;
        }
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        document.cookie =
          "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const afterAuthRedirect = () => {
    // lấy ?from=... trên URL hiện tại nếu có
    const url =
      typeof window !== "undefined" ? new URL(window.location.href) : null;
    const from = url?.searchParams.get("from") || "/";
    router.push(from);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      if (email === "admin@takaHome.com" && password === "123456") {
        const mockUser: User = {
          id: "1",
          email,
          name: "Admin User",
          avatar: "/assets/imgs/avatar.png",
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", "mock-jwt-token");
        document.cookie = `auth-token=mock-jwt-token; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;

        setUser(mockUser);
        afterAuthRedirect();
        return { success: true };
      }
      return { success: false, error: "Email hoặc mật khẩu không đúng" };
    } catch {
      return { success: false, error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 1000));

      if (email && password && name) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          avatar: "/assets/imgs/avatar.png",
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("token", "mock-jwt-token");
        document.cookie = `auth-token=mock-jwt-token; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;

        setUser(mockUser);
        afterAuthRedirect();
        return { success: true };
      }
      return { success: false, error: "Vui lòng điền đầy đủ thông tin" };
    } catch {
      return { success: false, error: "Đã có lỗi xảy ra. Vui lòng thử lại." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    setUser(null);
    router.push("/signin");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
