// ─── Model: User ────────────────────────────────────────────────────────────

export type Role = 'CLIENT' | 'SELLER';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: Role;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
}
