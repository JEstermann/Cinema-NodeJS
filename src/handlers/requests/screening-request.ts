/**
 * @openapi
 * components:
 *   schemas:
 *     CreateScreeningRequest:
 *       type: object
 *       required:
 *         - roomId
 *         - movieId
 *         - startAt
 *       properties:
 *         roomId:
 *           type: integer
 *           example: 1
 *         movieId:
 *           type: integer
 *           example: 3
 *         startAt:
 *           type: string
 *           format: date-time
 *           example: "2026-05-10T18:00:00.000Z"
 *     UpdateScreeningRequest:
 *       type: object
 *       properties:
 *         roomId:
 *           type: integer
 *         movieId:
 *           type: integer
 *         startAt:
 *           type: string
 *           format: date-time
 *     ScreeningResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         startAt:
 *           type: string
 *           format: date-time
 *         endAt:
 *           type: string
 *           format: date-time
 *         room:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *         movie:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             title:
 *               type: string
 */
export interface CreateScreeningRequest {
    roomId: number;
    movieId: number;
    startAt: string;
}

export interface UpdateScreeningRequest {
    id: number;
    roomId?: number;
    movieId?: number;
    startAt?: string;
}

export interface ListScreeningRequest {
    page?: number;
    size?: number;
    roomId?: number;
    movieId?: number;
}

export interface ScreeningIdRequest {
    id: number;
}
