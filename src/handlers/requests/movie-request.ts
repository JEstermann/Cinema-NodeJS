/**
 * @openapi
 * components:
 *   schemas:
 *     CreateMovieRequest:
 *       type: object
 *       required:
 *         - title
 *         - durationInMinutes
 *       properties:
 *         title:
 *           type: string
 *           description: Le titre du film
 *         description:
 *           type: string
 *           description: La description ou le synopsis
 *         durationInMinutes:
 *           type: integer
 *           description: La durée totale en minutes
 *     UpdateMovieRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         durationInMinutes:
 *           type: integer
 */
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