import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { User } from "../database/entities/user.js";
import { Token } from "../database/entities/token.js";
import { UserUsecase } from "../usecases/user-usecase.js";
import { AuthUsecase } from "../usecases/auth-usecase.js";
import { AuthValidator } from "./validators/user-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";

export const Signup = async (req: Request, res: Response) => {
    const { error, value } = AuthValidator.validate(req.body);
    if (error) {
        return res.status(400).send(generateValidationErrorMessage(error.details));
    }

    const userUsecase = new UserUsecase(AppDataSource.getRepository(User));
    const authUsecase = new AuthUsecase(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Token)
    );

    try {
        await userUsecase.signup(value);
        const result = await authUsecase.login(value.email, value.password);
        return res.status(201).send(result);
    } catch (err: any) {
        return res.status(400).send({ error: err.message });
    }
};

export const Login = async (req: Request, res: Response) => {
    const { error, value } = AuthValidator.validate(req.body);
    if (error) {
        return res.status(400).send(generateValidationErrorMessage(error.details));
    }

    const authUsecase = new AuthUsecase(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Token)
    );

    try {
        const result = await authUsecase.login(value.email, value.password);
        
        return res.status(200).send(result);
    } catch (err: any) {
    
        return res.status(401).send({ error: "Identifiants invalides" });
    }
};

export const Logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).send({ error: "Refresh token manquant" });

    const authUsecase = new AuthUsecase(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Token)
    );

    await authUsecase.logout(refreshToken);
    return res.status(200).send({ message: "Déconnexion réussie" });
};

export const RefreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).send({ error: "Refresh token manquant" });

    const authUsecase = new AuthUsecase(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(Token)
    );

    try {
        const result = await authUsecase.refresh(refreshToken);
        return res.status(200).send(result);
    } catch (err: any) {
        return res.status(401).send({ error: err.message });
    }
};