export type UserRole = 'USER' | 'ARTIST' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  balance: number;
}

export interface AuthResponse {
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  role: UserRole;
}
