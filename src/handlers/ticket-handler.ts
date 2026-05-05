import { Request, Response } from "express";
import { AppDataSource } from "../database/database.js";
import { Ticket } from "../database/entities/ticket.js";
import { TicketUsage } from "../database/entities/ticket-usage.js";
import { Screening } from "../database/entities/screening.js";
import { User } from "../database/entities/user.js";
import { WalletTransaction } from "../database/entities/wallet-transaction.js";
import { TicketUsecase } from "../usecases/ticket-usecase.js";
import { BuySimpleTicketValidator, TicketIdParamValidator, UseTicketValidator } from "./validators/ticket-validator.js";
import { generateValidationErrorMessage } from "./validators/utils.js";
import { ResourceConflictError } from "../usecases/error.js";

interface AuthenticatedRequest extends Request {
    user?: {
        userId: number;
        role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
    };
}

const getUserId = (req: AuthenticatedRequest): number | null => req.user?.userId ?? null;

const buildTicketUsecase = () =>
    new TicketUsecase(
        AppDataSource.getRepository(Ticket),
        AppDataSource.getRepository(TicketUsage),
        AppDataSource.getRepository(Screening),
        AppDataSource.getRepository(User),
        AppDataSource.getRepository(WalletTransaction)
    );

export const PurchaseSimpleTicket = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifie" });
    }

    const validation = BuySimpleTicketValidator.validate(req.body);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    try {
        const ticket = await buildTicketUsecase().purchaseSimpleTicket(userId, validation.value.screeningId);
        return res.status(201).send(ticket);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        if (
            error instanceof Error &&
            (error.message === "Seance introuvable" || error.message === "Utilisateur introuvable")
        ) {
            return res.status(404).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const PurchaseSuperTicket = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifie" });
    }

    try {
        const ticket = await buildTicketUsecase().purchaseSuperTicket(userId);
        return res.status(201).send(ticket);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        if (error instanceof Error && error.message === "Utilisateur introuvable") {
            return res.status(404).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const UseTicketForScreening = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifie" });
    }

    const validation = UseTicketValidator.validate(req.body);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const { ticketId, screeningId } = validation.value;

    try {
        const usage = await buildTicketUsecase().useTicket(userId, ticketId, screeningId);
        return res.status(200).send(usage);
    } catch (error) {
        if (error instanceof ResourceConflictError) {
            return res.status(409).send({ error: error.message });
        }
        if (error instanceof Error && (error.message === "Seance introuvable" || error.message === "Billet introuvable")) {
            return res.status(404).send({ error: error.message });
        }
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const ListMyTickets = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifie" });
    }

    try {
        const tickets = await buildTicketUsecase().listMyTickets(userId);
        return res.send(tickets);
    } catch {
        return res.status(500).send({ error: "Erreur interne du serveur" });
    }
};

export const GetMyTicketDetail = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    if (!userId) {
        return res.status(401).send({ error: "Utilisateur non authentifie" });
    }

    const validation = TicketIdParamValidator.validate(req.params);
    if (validation.error) {
        return res.status(400).send(generateValidationErrorMessage(validation.error.details));
    }

    const ticket = await buildTicketUsecase().getTicketWithUsages(userId, validation.value.id);
    if (!ticket) {
        return res.status(404).send({ error: "Billet introuvable" });
    }

    return res.send(ticket);
};
