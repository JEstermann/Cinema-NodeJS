/**
 * @openapi
 * components:
 *   schemas:
 *     CreateRoomRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - images
 *         - type
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         capacity:
 *           type: integer
 *         isAccessible:
 *           type: boolean
 *         isMaintenance:
 *           type: boolean
 *
 *     UpdateRoomRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         capacity:
 *           type: integer
 *         isAccessible:
 *           type: boolean
 *         isMaintenance:
 *           type: boolean
 *
 *     RoomResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: string
 *         capacity:
 *           type: integer
 *         isAccessible:
 *           type: boolean
 *         isMaintenance:
 *           type: boolean
 */

export interface CreateRoom {
    id: number,
    name: string,
    description: string,
    images: string[],
    type: string,
    capacity: number,
    isAccessible?: boolean,
    isMaintenance?: boolean,
}

export interface ListRoomRequest {
    page?: number
    size?: number
    name?: string
    capacityMax?: number
}

export interface RoomIdRequest {
    id: number
}

export interface UpdateRoomRequest {
    id: number,
    name?: string,
    description?: string,
    images?: string[],
    type?: string,
    capacity?: number,
    isAccessible?: boolean,
    isMaintenance?: boolean,
}
