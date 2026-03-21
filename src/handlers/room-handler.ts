import { Request, Response } from "express";
import { generateValidationErrorMessage } from "./validators/utils.js";
import { AppDataSource } from "../database/database.js";
import { QueryError } from "mysql2";
import { CreateRoomValidator } from "./validators/room-validator.js";
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