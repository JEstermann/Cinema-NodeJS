
export interface CreateMovieRequest {
    title: string;
    description?: string;
    durationInMinutes: number;
}

export interface ListMovieRequest {
    page?: number;
    size?: number;
    title?: string;
}

export interface UpdateMovieRequest {
    id: number;
    title?: string;
    description?: string;
    durationInMinutes?: number;
}