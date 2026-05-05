import Joi from "joi";
import { CreateScreeningRequest, ListScreeningRequest, ScreeningIdRequest, UpdateScreeningRequest } from "../requests/screening-request.js";

export const CreateScreeningValidator = Joi.object<CreateScreeningRequest>({
    roomId: Joi.number().integer().min(1).required(),
    movieId: Joi.number().integer().min(1).required(),
    startAt: Joi.string().isoDate().required()
}).options({ abortEarly: false });

export const UpdateScreeningValidator = Joi.object<UpdateScreeningRequest>({
    id: Joi.number().integer().min(1).required(),
    roomId: Joi.number().integer().min(1).optional(),
    movieId: Joi.number().integer().min(1).optional(),
    startAt: Joi.string().isoDate().optional()
}).options({ abortEarly: false });

export const ListScreeningValidator = Joi.object<ListScreeningRequest>({
    page: Joi.number().integer().min(1).optional(),
    size: Joi.number().integer().min(1).max(100).optional(),
    roomId: Joi.number().integer().min(1).optional(),
    movieId: Joi.number().integer().min(1).optional()
}).options({ abortEarly: false });

export const ScreeningIdValidator = Joi.object<ScreeningIdRequest>({
    id: Joi.number().integer().min(1).required()
}).options({ abortEarly: false });
