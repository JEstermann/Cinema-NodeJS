import Joi from "joi";

export const CreateRoomValidator = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(10).required(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    type: Joi.string().min(2).required(),
    capacity: Joi.number().integer().min(15).max(30).required(),
    isAccessible: Joi.boolean().optional(),
    isMaintenance: Joi.boolean().optional(),
}).options({ abortEarly: false });