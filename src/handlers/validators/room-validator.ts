import Joi from "joi";
import { ListRoomRequest, RoomIdRequest,UpdateRoomRequest } from "../requests/room-request.js";

export const CreateRoomValidator = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    type: Joi.string().min(2).required(),
    capacity: Joi.number().integer().min(15).max(30).required(),
    isAccessible: Joi.boolean().optional(),
    isMaintenance: Joi.boolean().optional(),
}).options({ abortEarly: false });

export const ListRoomValidator = Joi.object<ListRoomRequest>({
    page: Joi.number().min(1).optional(),
    size: Joi.number().min(1).max(100).optional(),
    name: Joi.string().min(3).max(255).optional(),
    capacityMax: Joi.number().integer().min(15).max(30).optional(),
}).options({abortEarly: false})

export const RoomIdValidator = Joi.object<RoomIdRequest>({
    id: Joi.number().min(1).required()
})

export const UpdateRoomValidator = Joi.object<UpdateRoomRequest>({
    id: Joi.number().min(1).required(),
    name: Joi.string().min(3).max(255).optional(),
    description: Joi.string().min(10).optional(),
    images: Joi.array().items(Joi.string().uri()).min(1).optional(),
    type: Joi.string().min(2).optional(),
    capacity: Joi.number().integer().min(15).max(30).optional(),
    isAccessible: Joi.boolean().optional(),
    isMaintenance: Joi.boolean().optional(),
})