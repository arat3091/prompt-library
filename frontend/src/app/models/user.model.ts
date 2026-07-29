/**
 * User model interfaces for API communication
 */

export interface User {
  id: number;
  username: string;
  email?: string;
  apiKey: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterUserRequest {
  username: string;
  password: string;
  email?: string;
}

export interface LoginResponse {
  apiKey: string;
}

export interface UserResponse extends User {}
