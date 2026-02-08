export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: Omit<IUser, 'password'>;
  token: string;
}
