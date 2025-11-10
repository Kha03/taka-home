"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/auth";
import { User } from "@/lib/api";
import { setCookie, deleteCookie, getCookie } from "@/lib/utils/cookie-utils";
import { useAuthSync } from "@/hooks/use-auth-sync";

/**
 * Check if JWT token is expired
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
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
    phone?: string,
    role?: "TENANT" | "LANDLORD"
  ) => Promise<{ success: boolean; error?: string }>;
  setAuthFromToken: (
    token: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Sync tokens to cookies when refresh token happens automatically
  useAuthSync();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        console.log("🔍 Auth check - savedUser:", savedUser, "token:", token?.substring(0, 20), "refreshToken:", refreshToken?.substring(0, 20));
        
        // If no localStorage but has cookies, try to get from cookies
        if (!token && !refreshToken) {
          const cookieToken = getCookie("accessToken");
          const cookieRefreshToken = getCookie("refreshToken");
          
          console.log("🍪 Checking cookies - token:", cookieToken?.substring(0, 20), "refreshToken:", cookieRefreshToken?.substring(0, 20));
          
          if (cookieToken || cookieRefreshToken) {
            console.log("🔄 Found tokens in cookies but not in localStorage, syncing...");
            
            if (cookieToken) {
              localStorage.setItem("accessToken", cookieToken);
            }
            if (cookieRefreshToken) {
              localStorage.setItem("refreshToken", cookieRefreshToken);
            }
            
            // If we have token, try to decode and get user info
            if (cookieToken && !isTokenExpired(cookieToken)) {
              try {
                const payload = JSON.parse(atob(cookieToken.split(".")[1]));
                const user: User = {
                  id: payload.sub,
                  email: payload.email,
                  fullName: payload.fullName || payload.name || payload.email,
                  avatarUrl: "/assets/imgs/avatar.png",
                  status: "ACTIVE",
                  CCCD: "",
                  roles: payload.roles || [],
                };
                
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                console.log("✅ Restored user from cookie token");
                return;
              } catch (error) {
                console.error("❌ Failed to decode token from cookie:", error);
              }
            } else if (cookieRefreshToken) {
              // Token expired but we have refresh token, continue to refresh logic below
              console.log("🔄 Token in cookie expired, will try refresh...");
            }
          }
        }
        
        if (savedUser && token) {
          // Check if token is expired
          const isExpired = isTokenExpired(token);
          
          console.log("🔍 Token expired?", isExpired);
          
          if (isExpired && refreshToken) {
            // Token expired but we have refresh token, try to refresh
            console.log("🔄 Attempting to refresh token...");
            try {
              const response = await authService.refreshToken(refreshToken);
              
              console.log("✅ Refresh token response:", response);
              
              if (response.code === 200 && response.data) {
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                
                console.log("💾 Saving new tokens...");
                
                // Update tokens in localStorage
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                  localStorage.setItem("refreshToken", newRefreshToken);
                }
                
                // Update cookies
                setCookie("accessToken", accessToken, {
                  expires: 1,
                  path: "/",
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "lax",
                });
                
                if (newRefreshToken) {
                  setCookie("refreshToken", newRefreshToken, {
                    expires: 7,
                    path: "/",
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                  });
                }
                
                // Keep existing user data (already in localStorage)
                const userObj = JSON.parse(savedUser);
                console.log("👤 Setting user:", userObj);
                setUser(userObj);
                
                console.log("✅ Auth check completed successfully");
              } else {
                console.error("❌ Refresh response invalid:", response);
                throw new Error("Refresh token failed");
              }
            } catch (error) {
              // Refresh failed, clear all auth data
              console.error("❌ Failed to refresh token on init:", error);
              localStorage.removeItem("user");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              deleteCookie("accessToken", { path: "/" });
              deleteCookie("refreshToken", { path: "/" });
              setUser(null);
            }
          } else if (!isExpired) {
            // Token is still valid, use it
            console.log("✅ Token still valid, using saved user");
            setUser(JSON.parse(savedUser));
            
            // Sync cookies
            setCookie("accessToken", token, {
              expires: 1,
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            });
            
            if (refreshToken) {
              setCookie("refreshToken", refreshToken, {
                expires: 7,
                path: "/",
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
            }
          } else {
            // Token expired and no refresh token
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            deleteCookie("accessToken", { path: "/" });
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        deleteCookie("accessToken", { path: "/" });
        deleteCookie("refreshToken", { path: "/" });
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
        const { accessToken, refreshToken, account } = response.data;

        // Transform API user to local User format
        const user: User = {
          id: account.user.id,
          email: account.email,
          fullName: account.user.fullName,
          avatarUrl: account.user.avatarUrl || "/assets/imgs/avatar.png",
          status: account.user.status,
          CCCD: account.user.CCCD || "",
          roles: account.roles || [],
        };

        // Store token and user data
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        
        // Lưu tokens vào cookies
        setCookie("accessToken", accessToken, {
          expires: 1, // 1 day
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        
        setCookie("refreshToken", refreshToken, {
          expires: 7, // 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

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
    phone?: string,
    role: "TENANT" | "LANDLORD" = "TENANT"
  ) => {
    try {
      setIsLoading(true);

      // Call register API
      const response = await authService.register({
        email,
        password,
        fullName: name,
        phone,
        roles: role, // Send role as string, not array
      });

      if (response.code === 200) {
        // After successful registration, automatically login
        const loginResponse = await authService.login({ email, password });

        if (loginResponse.code === 200 && loginResponse.data) {
          const { accessToken, refreshToken, account } = loginResponse.data;

          // Transform API user to local User format
          const user: User = {
            id: account.user.id,
            email: account.email,
            fullName: account.user.fullName,
            avatarUrl: account.user.avatarUrl || "/assets/imgs/avatar.png",
            status: account.user.status,
            roles: account.roles || [],
          };

          // Store token and user data
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          
          // Lưu tokens vào cookies
          setCookie("accessToken", accessToken, {
            expires: 1, // 1 day
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });
          
          setCookie("refreshToken", refreshToken, {
            expires: 7, // 7 days
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
          });

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
      // Call logout API trước (kèm accessToken trong header)
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local logout even if API fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Xóa cookies
      deleteCookie("accessToken", { path: "/" });
      deleteCookie("refreshToken", { path: "/" });
      
      setUser(null);
      router.push("/signin");
    }
  };

  const setAuthFromToken = async (token: string) => {
    try {
      // Không set loading = true để tránh ảnh hưởng UI khác

      // Decode JWT token to get user info
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));

      // Create user object from token payload
      const user: User = {
        id: tokenPayload.sub,
        email: tokenPayload.email,
        fullName:
          tokenPayload.fullName || tokenPayload.name || tokenPayload.email,
        avatarUrl: tokenPayload.picture || "/assets/imgs/avatar.png",
        status: "ACTIVE",
        CCCD: "",
        roles: tokenPayload.roles || [], // Lấy roles từ token
      };

      // Store token and user data (using same keys as normal login)
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", token); // For compatibility
      
      // Lưu token vào cookie
      setCookie("accessToken", token, {
        expires: 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      setUser(user);
      return { success: true };
    } catch (error) {
      console.error("Set auth from token error:", error);
      return {
        success: false,
        error: "Không thể xử lý token xác thực",
      };
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    setAuthFromToken,
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
