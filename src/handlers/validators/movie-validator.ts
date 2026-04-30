import Joi from "joi";
import { ListMovieRequest, UpdateMovieRequest } from "../requests/movie-request.js";

export const CreateMovieValidator = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().allow("").optional(), // Autorise une description vide
    durationInMinutes: Joi.number().integer().min(1).required(), // Un film doit durer au moins 1 minute !
}).options({ abortEarly: false });

export const ListMovieValidator = Joi.object<ListMovieRequest>({
    page: Joi.number().min(1).optional(),
    size: Joi.number().min(1).max(100).optional(),
    title: Joi.string().optional(),
}).options({ abortEarly: false });

export const UpdateMovieValidator = Joi.object<UpdateMovieRequest>({
    id: Joi.number().min(1).required(),
    title: Joi.string().min(2).max(255).optional(),
    description: Joi.string().allow("").optional(),
    durationInMinutes: Joi.number().integer().min(1).optional(),
});