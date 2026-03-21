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
