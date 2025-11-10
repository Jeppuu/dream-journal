export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserSignupData extends UserLoginData {
  username: string;
  confirmPassword: string;
}
