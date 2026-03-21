import { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/utils.js";
import { AppDataSource } from "../database/database.js";
import { QueryError } from "mysql2";
import { CreateRoomValidator, ListRoomValidator } from "./validators/room-validator.js";
import { Room } from "../database/entities/room.js";
import { RoomUsecase } from "../usecases/room-usecase.js";

export const CreateRoom = async (req: Request, res: Response) => {
    const validator = CreateRoomValidator.validate(req.body);

    if (validator.error) {
        return res.status(400).send(
            generateValidationErrorMessage(validator.error.details)
        );
    }

    const createRoomRequest = validator.value;

    const roomUsecase = new RoomUsecase(AppDataSource.getRepository(Room));

    try {
        const roomCreated = await roomUsecase.createRoom(createRoomRequest);

        return res.status(201).send({
            id: roomCreated.id,
            name: roomCreated.name,
            capacity: roomCreated.capacity,
            type: roomCreated.type
        });

    } catch (error: unknown) {
        if ((error as QueryError).code === "ER_DUP_ENTRY") {
            return res.status(400).send({
                error: "Une salle avec ce nom existe déjà."
            });
        }

        throw error;
    }
};

export const ListRooms = async (req: Request, res: Response) => {
    const validation = ListRoomValidator.validate(req.query);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const listRoomRequest = validation.value;

    const size = listRoomRequest.size ?? 10;
    const page = listRoomRequest.page ?? 1;

    const roomUsecase = new RoomUsecase(AppDataSource.getRepository(Room));

    const rooms = await roomUsecase.listRooms({
        page,
        size,
        name: listRoomRequest.name,
        capacityMax: listRoomRequest.capacityMax
    });

    return res.send(rooms);
};