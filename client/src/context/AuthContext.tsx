import { useState, useEffect } from "react";
import api from "../services/api";
import type { User, UserLoginData, UserSignupData } from "../types/User";
import { AuthContext } from "./AuthContextValue";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get<User>("/api/auth/user");
      setUser(data);
    } catch (error) {
      console.warn("Token invalid or expired. Clearing storage.");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: UserLoginData) => {
    const { data } = await api.post("/api/auth/login", credentials);
    localStorage.setItem("token", data.token);
    await fetchUser();
  };

  const signup = async (userData: UserSignupData) => {
    const { data } = await api.post("/api/auth/signup", userData);
    localStorage.setItem("token", data.token);
    await fetchUser();
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        fetchCurrentUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
