import { Role } from './audit';

export interface AuthUser {
  username: string;
  email: string;
  role: Role;
  token: string | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role?: Role;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: Role;
}

export interface AuthErrorResponse {
  error: string;
}
