import { createContext } from "react";
import type { User, UserLoginData, UserSignupData } from "../types/User";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: UserLoginData) => Promise<void>;
  signup: (data: UserSignupData) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
