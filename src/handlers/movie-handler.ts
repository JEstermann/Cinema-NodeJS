import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { Movie } from "../database/entities/movie.js";
import { MovieUsecase } from "../usecases/movie-usecase.js";
import { ResourceConflictError } from "../usecases/error.js";
import { CreateMovieValidator, ListMovieValidator, UpdateMovieValidator } from "./validators/movie-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";
import Joi from "joi";

const MovieIdValidator = Joi.object({ id: Joi.number().min(1).required() });

export const CreateMovie = async (req: Request, res: Response) => {
    const validator = CreateMovieValidator.validate(req.body);
    if (validator.error) {
        return res.status(400).send(generateValidationErrorMessage(validator.error.details));
    }

    const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
    
    try {
        const movieCreated = await movieUsecase.createMovie(validator.value);
        return res.status(201).send(movieCreated); 
    } catch (error: unknown) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const ListMovies = async (req: Request, res: Response) => {
    const validation = ListMovieValidator.validate(req.query);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const listRequest = validation.value;
    const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
    
    const movies = await movieUsecase.listMovies(listRequest.page, listRequest.size, listRequest.title);
    return res.send(movies);
};

export const GetMovie = async (req: Request, res: Response) => {
    const validation = MovieIdValidator.validate(req.params);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
    const movie = await movieUsecase.getMovie(validation.value.id);

    if (!movie) {
        return res.status(404).send({ error: "Film introuvable" });
    }
    return res.send(movie);
};

export const UpdateMovie = async (req: Request, res: Response) => {
    const validation = UpdateMovieValidator.validate({ ...req.params, ...req.body });
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const { id, ...data } = validation.value;
    const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));

    try {
        const movieUpdated = await movieUsecase.updateMovie(id, data);
        if (!movieUpdated) {
            return res.status(404).send({ error: "Film introuvable" });
        }
        return res.send(movieUpdated);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const DeleteMovie = async (req: Request, res: Response) => {
    const validation = MovieIdValidator.validate(req.params);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const movieUsecase = new MovieUsecase(AppDataSource.getRepository(Movie));
    await movieUsecase.deleteMovie(validation.value.id);
    
    return res.status(200).send({ message: "Film supprimé avec succès" });
};