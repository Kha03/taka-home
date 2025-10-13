"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/auth";

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
    password: string,
    phone?: string
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
        const token = localStorage.getItem("accessToken");
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

      const response = await authService.login({ email, password });

      if (response.code === 200 && response.data) {
        const { accessToken, account } = response.data;

        // Transform API user to local User format
        const user: User = {
          id: account.user.id,
          email: account.email,
          name: account.user.fullName,
          avatar: account.user.avatarUrl || "/assets/imgs/avatar.png",
        };

        // Store token and user data
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", accessToken);
        document.cookie = `auth-token=${accessToken}; path=/; max-age=${
          7 * 24 * 60 * 60
        }`;

        setUser(user);
        afterAuthRedirect();
        return { success: true };
      }

      return {
        success: false,
        error: response.message || "Email hoặc mật khẩu không đúng",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Đã có lỗi xảy ra. Vui lòng thử lại.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);

      // Call register API
      const response = await authService.register({
        email,
        password,
        fullName: name,
        phone,
        roles: ["TENANT"], // Default role
      });

      if (response.code === 200) {
        // After successful registration, automatically login
        const loginResponse = await authService.login({ email, password });

        if (loginResponse.code === 200 && loginResponse.data) {
          const { accessToken, account } = loginResponse.data;

          // Transform API user to local User format
          const user: User = {
            id: account.id,
            email: account.email,
            name: account.user.fullName,
            avatar: account.user.avatarUrl || "/assets/imgs/avatar.png",
          };

          // Store token and user data
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("token", accessToken);
          document.cookie = `auth-token=${accessToken}; path=/; max-age=${
            7 * 24 * 60 * 60
          }`;

          setUser(user);
          afterAuthRedirect();
          return { success: true };
        }
      }

      return {
        success: false,
        error: response.message || "Đăng ký thất bại. Vui lòng thử lại.",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Đã có lỗi xảy ra. Vui lòng thử lại.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout API if available
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
      setUser(null);
      router.push("/signin");
    }
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
