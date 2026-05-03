export interface User {
  id: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  durationInMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  type: string;
  capacity: number;
  images: string[];
  isAccessible: boolean;
  isMaintenance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
