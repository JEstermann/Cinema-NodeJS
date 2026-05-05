import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { Screening } from "../database/entities/screening.js";
import { Room } from "../database/entities/room.js";
import { Movie } from "../database/entities/movie.js";
import { ScreeningUsecase } from "../usecases/screening-usecase.js";
import { CreateScreeningValidator, ListScreeningValidator, ScreeningIdValidator, UpdateScreeningValidator } from "./validators/screening-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";
import { ResourceConflictError } from "../usecases/error.js";

const buildScreeningUsecase = () => {
    return new ScreeningUsecase(
        AppDataSource.getRepository(Screening),
        AppDataSource.getRepository(Room),
        AppDataSource.getRepository(Movie)
    );
};

export const CreateScreening = async (req: Request, res: Response) => {
    const validation = CreateScreeningValidator.validate(req.body);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const screeningUsecase = buildScreeningUsecase();

    try {
        const created = await screeningUsecase.createScreening(validation.value);
        return res.status(201).send(created);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        if (error instanceof Error && (error.message === "Salle introuvable" || error.message === "Film introuvable")) {
            return res.status(404).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const ListScreenings = async (req: Request, res: Response) => {
    const validation = ListScreeningValidator.validate(req.query);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const values = validation.value;
    const screeningUsecase = buildScreeningUsecase();
    const filter: { page: number; size: number; roomId?: number; movieId?: number } = {
        page: values.page ?? 1,
        size: values.size ?? 10
    };
    if (values.roomId !== undefined) {
        filter.roomId = values.roomId;
    }
    if (values.movieId !== undefined) {
        filter.movieId = values.movieId;
    }
    const result = await screeningUsecase.listScreenings({
        ...filter
    });

    return res.send(result);
};

export const GetScreening = async (req: Request, res: Response) => {
    const validation = ScreeningIdValidator.validate(req.params);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const screeningUsecase = buildScreeningUsecase();
    const screening = await screeningUsecase.getScreening(validation.value.id);
    if (!screening) {
        return res.status(404).send({ error: "Séance introuvable" });
    }

    return res.send(screening);
};

export const UpdateScreening = async (req: Request, res: Response) => {
    const validation = UpdateScreeningValidator.validate({ ...req.params, ...req.body });
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const { id, ...data } = validation.value;
    const screeningUsecase = buildScreeningUsecase();

    try {
        const updated = await screeningUsecase.updateScreening(id, data);
        if (!updated) {
            return res.status(404).send({ error: "Séance introuvable" });
        }
        return res.send(updated);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        if (error instanceof Error && (error.message === "Salle introuvable" || error.message === "Film introuvable")) {
            return res.status(404).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const DeleteScreening = async (req: Request, res: Response) => {
    const validation = ScreeningIdValidator.validate(req.params);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const screeningUsecase = buildScreeningUsecase();
    const deleted = await screeningUsecase.deleteScreening(validation.value.id);
    if (!deleted) {
        return res.status(404).send({ error: "Séance introuvable" });
    }

    return res.status(200).send({ message: "Séance supprimée avec succès" });
};
