import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { User } from "../database/entities/user.js";
import { Token } from "../database/entities/token.js";
import { UserUsecase } from "../usecases/user-usecase.js";
import { AuthUsecase } from "../usecases/auth-usecase.js";
import { AuthValidator } from "./validators/user-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";

export const Signup = async (req: Request, res: Response) => {
    // Validation de l'email et du mot de passe
    const { error, value } = AuthValidator.validate(req.body);
    if (error) {
        return res.status(400).send(generateValidationErrorMessage(error.details));
    }

    const userUsecase = new UserUsecase(AppDataSource.getRepository(User));

    try {
        // Création de l'utilisateur (le mot de passe sera haché dans le usecase)
        const user = await userUsecase.signup(value);
        return res.status(201).send(user);
    } catch (err: any) {
        return res.status(400).send({ error: err.message });
    }
};

export const Login = async (req: Request, res: Response) => {
    // Validation des entrées
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