import client from './client';
import { AuthResponse, Movie, Room, User, ListResponse } from '../types';

export const auth = {
  signup: (email: string, password: string) =>
    client.post<AuthResponse>('/auth/signup', { email, password }),
  login: (email: string, password: string) =>
    client.post<AuthResponse>('/auth/login', { email, password }),
  logout: () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return client.post('/auth/logout', { refreshToken });
  },
};

export const movies = {
  list: () => client.get<ListResponse<Movie>>('/movies'),
  get: (id: number) => client.get<Movie>(`/movies/${id}`),
  create: (data: Partial<Movie>) => client.post<Movie>('/movies', data),
  update: (id: number, data: Partial<Movie>) =>
    client.patch<Movie>(`/movies/${id}`, data),
  delete: (id: number) => client.delete(`/movies/${id}`),
};

export const rooms = {
  list: () => client.get<ListResponse<Room>>('/rooms'),
  get: (id: number) => client.get<Room>(`/rooms/${id}`),
  create: (data: Partial<Room>) => client.post<Room>('/rooms', data),
  update: (id: number, data: Partial<Room>) =>
    client.patch<Room>(`/rooms/${id}`, data),
  delete: (id: number) => client.delete(`/rooms/${id}`),
};
