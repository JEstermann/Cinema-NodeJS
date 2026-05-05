import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { User } from "../database/entities/user.js";
import { WalletTransaction } from "../database/entities/wallet-transaction.js";
import { WalletUsecase } from "../usecases/wallet-usecase.js";
import { WalletAmountValidator } from "./validators/wallet-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";
import { ResourceConflictError } from "../usecases/error.js";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
    };
}

const buildWalletUsecase = () => {
    return new WalletUsecase(
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(WalletTransaction)
    );
};

const getUserIdFromRequest = (req: AuthenticatedRequest): number | null => {
    if (!req.user?.userId) {
        return null;
    }
    return req.user.userId;
};

export const GetMyBalance = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifié" });
    }

    try {
        const walletUsecase = buildWalletUsecase();
        const balance = await walletUsecase.getBalance(userId);
        return res.send({ balance });
    } catch (error) {
        return res.status(404).send({ error: "Utilisateur introuvable" });
    }
};

export const DepositMoney = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifié" });
    }

    const validation = WalletAmountValidator.validate(req.body);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    try {
        const walletUsecase = buildWalletUsecase();
        const result = await walletUsecase.deposit(userId, validation.value.amount);
        return res.status(200).send(result);
    } catch (error) {
        return res.status(404).send({ error: "Utilisateur introuvable" });
    }
};

export const WithdrawMoney = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifié" });
    }

    const validation = WalletAmountValidator.validate(req.body);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    try {
        const walletUsecase = buildWalletUsecase();
        const result = await walletUsecase.withdraw(userId, validation.value.amount);
        return res.status(200).send(result);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        return res.status(404).send({ error: "Utilisateur introuvable" });
    }
};

export const ListMyTransactions = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifié" });
    }

    try {
        const walletUsecase = buildWalletUsecase();
        const transactions = await walletUsecase.listTransactions(userId);
        return res.send(transactions);
    } catch (error) {
        return res.status(404).send({ error: "Utilisateur introuvable" });
    }
};
