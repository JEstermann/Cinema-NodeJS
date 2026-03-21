import { Repository } from "typeorm";
import { Room } from "../database/entities/room.js";

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
}