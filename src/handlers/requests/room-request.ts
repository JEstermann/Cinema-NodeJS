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
 *           minLength: 3
 *           maxLength: 255
 *         description:
 *           type: string
 *           minLength: 10
 *         images:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *             format: uri
 *         type:
 *           type: string
 *           minLength: 2
 *         capacity:
 *           type: integer
 *           minimum: 15
 *           maximum: 30
 *         isAccessible:
 *           type: boolean
 *         isMaintenance:
 *           type: boolean
 *     UpdateRoomBody:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 3
 *           maxLength: 255
 *         description:
 *           type: string
 *           minLength: 10
 *         images:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: string
 *             format: uri
 *         type:
 *           type: string
 *           minLength: 2
 *         capacity:
 *           type: integer
 *           minimum: 15
 *           maximum: 30
 *         isAccessible:
 *           type: boolean
 *         isMaintenance:
 *           type: boolean
 *     CreateRoomResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         capacity:
 *           type: integer
 *         type:
 *           type: string
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
