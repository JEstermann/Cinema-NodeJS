import { Repository } from "typeorm";
import { Ticket } from "../database/entities/ticket.js";
import { TicketUsage } from "../database/entities/ticket-usage.js";
import { Screening } from "../database/entities/screening.js";
import { User } from "../database/entities/user.js";
import { WalletTransaction } from "../database/entities/wallet-transaction.js";
import { ResourceConflictError } from "./error.js";
import { WalletUsecase } from "./wallet-usecase.js";

const SUPER_CREDITS = 10;

export class TicketUsecase {
    private walletUsecase: WalletUsecase;

    constructor(
        private ticketRepository: Repository<Ticket>,
        private ticketUsageRepository: Repository<TicketUsage>,
        private screeningRepository: Repository<Screening>,
        private userRepository: Repository<User>,
        walletTransactionRepository: Repository<WalletTransaction>
    ) {
        this.walletUsecase = new WalletUsecase(this.userRepository, walletTransactionRepository);
    }

    private simplePrice(): number {
        const raw = process.env.TICKET_SIMPLE_PRICE ?? "10";
        return Number(Number(raw).toFixed(2));
    }

    private superPrice(): number {
        const raw = process.env.TICKET_SUPER_PRICE ?? "75";
        return Number(Number(raw).toFixed(2));
    }

    async purchaseSimpleTicket(userId: number, screeningId: number): Promise<Ticket> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        const screening = await this.screeningRepository.findOneBy({ id: screeningId });
        if (!screening) {
            throw new Error("Seance introuvable");
        }

        const price = this.simplePrice();

        const existing = await this.ticketRepository.findOne({
            where: {
                user: { id: userId },
                kind: "SIMPLE",
                screening: { id: screeningId },
                remainingCredits: 1
            },
            relations: ["screening"]
        });
        if (existing) {
            throw new ResourceConflictError("Vous avez deja un billet simple non utilise pour cette seance");
        }

        try {
            await this.walletUsecase.withdraw(userId, price);
        } catch (e) {
            if (e instanceof ResourceConflictError) {
                throw new ResourceConflictError("Solde insuffisant pour acheter ce billet");
            }
            throw e;
        }

        const ticket = this.ticketRepository.create({
            user,
            kind: "SIMPLE",
            screening,
            remainingCredits: 1,
            pricePaid: price
        });

        return await this.ticketRepository.save(ticket);
    }

    async purchaseSuperTicket(userId: number): Promise<Ticket> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        const price = this.superPrice();

        try {
            await this.walletUsecase.withdraw(userId, price);
        } catch (e) {
            if (e instanceof ResourceConflictError) {
                throw new ResourceConflictError("Solde insuffisant pour acheter un super billet");
            }
            throw e;
        }

        const ticket = this.ticketRepository.create({
            user,
            kind: "SUPER",
            screening: null,
            remainingCredits: SUPER_CREDITS,
            pricePaid: price
        });

        return await this.ticketRepository.save(ticket);
    }

    async useTicket(userId: number, ticketId: number, screeningId: number): Promise<TicketUsage> {
        const screening = await this.screeningRepository.findOneBy({ id: screeningId });
        if (!screening) {
            throw new Error("Seance introuvable");
        }

        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, user: { id: userId } },
            relations: ["screening", "user"]
        });

        if (!ticket) {
            throw new Error("Billet introuvable");
        }

        if (ticket.remainingCredits <= 0) {
            throw new ResourceConflictError("Ce billet ne peut plus etre utilise");
        }

        if (ticket.kind === "SIMPLE") {
            if (!ticket.screening || ticket.screening.id !== screeningId) {
                throw new ResourceConflictError("Ce billet simple n'est pas valable pour cette seance");
            }
        }

        ticket.remainingCredits -= 1;
        await this.ticketRepository.save(ticket);

        const usage = this.ticketUsageRepository.create({
            ticket,
            screening
        });
        return await this.ticketUsageRepository.save(usage);
    }

    async listMyTickets(userId: number): Promise<Ticket[]> {
        return await this.ticketRepository.find({
            where: { user: { id: userId } },
            relations: ["screening", "screening.movie", "screening.room"],
            order: { createdAt: "DESC" }
        });
    }

    async getTicketWithUsages(userId: number, ticketId: number): Promise<(Ticket & { usages: TicketUsage[] }) | null> {
        const ticket = await this.ticketRepository.findOne({
            where: { id: ticketId, user: { id: userId } },
            relations: ["screening", "screening.movie"]
        });
        if (!ticket) {
            return null;
        }
        const usages = await this.ticketUsageRepository.find({
            where: { ticket: { id: ticketId } },
            relations: ["screening", "screening.movie"],
            order: { usedAt: "DESC" }
        });
        return Object.assign(ticket, { usages });
    }
}
