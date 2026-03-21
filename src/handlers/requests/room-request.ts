export interface CreateRoom {
    id: number,
    name: string,
    description: string,
    images: string[],
    type: string,
    capacity: number,
    createdAt: Date,
    updatedAt: Date,
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
