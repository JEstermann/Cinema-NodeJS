import { Repository } from "typeorm";
import { Room } from "../database/entities/room.js";
import { ListRoomRequest } from "../handlers/requests/room-request.js";
import { ResourceConflictError } from "./error.js";

export interface ListResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface ListRoomFilter {
    page: number,
    size: number,
    name?: string | undefined
    capacityMax?: number | undefined
}

export class RoomUsecase {
    constructor(
        private roomRepository: Repository<Room>
    ) {}

    async createRoom(data: {
        name: string;
        description: string;
        images: string[];
        type: string;
        capacity: number;
        isAccessible?: boolean;
        isMaintenance?: boolean;
    }): Promise<Room> {

        const room = this.roomRepository.create({
            name: data.name,
            description: data.description,
            images: data.images,
            type: data.type,
            capacity: data.capacity,
            isAccessible: data.isAccessible ?? false,
            isMaintenance: data.isMaintenance ?? false
        });

        return await this.roomRepository.save(room);
    }

    async listRooms({ page, size, name, capacityMax }: ListRoomFilter): Promise<ListResponse<Room>> {
        const query = this.roomRepository.createQueryBuilder("room");

        if (name !== undefined) {
            query.andWhere("room.name = :name", { name });
        }

        if (capacityMax !== undefined) {
            query.andWhere("room.capacity <= :capacityMax", { capacityMax });
        }

        query.skip((page - 1) * size);
        query.take(size);

        const [rooms, totalCount] = await query.getManyAndCount();

        return {
            data: rooms,
            page,
            pageSize: size,
            totalCount,
            totalPages: Math.ceil(totalCount / size)
        };
    }

    async getRoom(id: number): Promise<Room | null> {
        return await this.roomRepository.findOneBy({
            id
        });
    }

   async updateRoom(id: number, data: Partial<Room>): Promise<Room | null> {
    const room = await this.getRoom(id);
    if (!room) return null;

    // Object.assign copie toutes les propriétés définies de 'data' vers 'room'
    Object.assign(room, data);

    try {
        return await this.roomRepository.save(room);
    } catch (error) {
        if ((error as any).code === "ER_DUP_ENTRY" || (error as any).errno === 1062) {
            throw new ResourceConflictError("This room name is already taken");
        }
        throw error;
    }
}

    async deleteRoom(id: number): Promise<Room | null> {
        const room = await this.getRoom(id);
        if (room === null) {
            return null;
        }
        await this.roomRepository.softRemove(room);

        return room
    }
}