import { apiFetch, readError } from "./client";
import type { AuthResponse, Movie, Room, ListResponse } from "../types";

async function parseBody<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(await readError(res));
    return res.json() as Promise<T>;
}

async function getJson<T>(path: string): Promise<{ data: T }> {
    const res = await apiFetch(path);
    const data = await parseBody<T>(res);
    return { data };
}

async function postJson<T>(path: string, body?: unknown): Promise<{ data: T }> {
    const res = await apiFetch(path, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined
    });
    const data = await parseBody<T>(res);
    return { data };
}

async function patchJson<T>(path: string, body: unknown): Promise<{ data: T }> {
    const res = await apiFetch(path, {
        method: "PATCH",
        body: JSON.stringify(body)
    });
    const data = await parseBody<T>(res);
    return { data };
}

async function deleteJson(path: string): Promise<void> {
    const res = await apiFetch(path, { method: "DELETE" });
    if (!res.ok) throw new Error(await readError(res));
}

export const auth = {
    signup: (email: string, password: string) =>
        postJson<AuthResponse>("/auth/signup", { email, password }),
    login: (email: string, password: string) =>
        postJson<AuthResponse>("/auth/login", { email, password }),
    logout: () => {
        const refreshToken = localStorage.getItem("refreshToken");
        return postJson<unknown>("/auth/logout", { refreshToken });
    }
};

export const movies = {
    list: () => getJson<ListResponse<Movie>>("/movies"),
    get: (id: number) => getJson<Movie>(`/movies/${id}`),
    create: (data: Partial<Movie>) => postJson<Movie>("/movies", data),
    update: (id: number, data: Partial<Movie>) => patchJson<Movie>(`/movies/${id}`, data),
    delete: (id: number) => deleteJson(`/movies/${id}`)
};

export const rooms = {
    list: () => getJson<ListResponse<Room>>("/rooms"),
    get: (id: number) => getJson<Room>(`/rooms/${id}`),
    create: (data: Partial<Room>) => postJson<Room>("/rooms", data),
    update: (id: number, data: Partial<Room>) => patchJson<Room>(`/rooms/${id}`, data),
    delete: (id: number) => deleteJson(`/rooms/${id}`)
};
