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
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *         durationInMinutes:
 *           type: integer
 *           minimum: 1
 *     UpdateMovieBody:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *         durationInMinutes:
 *           type: integer
 *           minimum: 1
 *     MovieEntityResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         durationInMinutes:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
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