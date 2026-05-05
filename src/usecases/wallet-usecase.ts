import { Repository } from "typeorm";
import { User } from "../database/entities/user.js";
import { WalletTransaction } from "../database/entities/wallet-transaction.js";
import { ResourceConflictError } from "./error.js";

export class WalletUsecase {
    constructor(
        private userRepository: Repository<User>,
        private walletTransactionRepository: Repository<WalletTransaction>
    ) {}

    private toMoney(value: number): number {
        return Number(value.toFixed(2));
    }

    async getBalance(userId: number): Promise<number> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }
        return Number(user.balance);
    }

    async deposit(userId: number, amount: number): Promise<{ balance: number }> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        const nextBalance = this.toMoney(Number(user.balance) + amount);
        user.balance = nextBalance;
        await this.userRepository.save(user);

        await this.walletTransactionRepository.save(
            this.walletTransactionRepository.create({
                user,
                type: "DEPOSIT",
                amount: this.toMoney(amount),
                balanceAfter: nextBalance
            })
        );

        return { balance: nextBalance };
    }

    async withdraw(userId: number, amount: number): Promise<{ balance: number }> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        const currentBalance = Number(user.balance);
        if (currentBalance < amount) {
            throw new ResourceConflictError("Solde insuffisant");
        }

        const nextBalance = this.toMoney(currentBalance - amount);
        user.balance = nextBalance;
        await this.userRepository.save(user);

        await this.walletTransactionRepository.save(
            this.walletTransactionRepository.create({
                user,
                type: "WITHDRAW",
                amount: this.toMoney(amount),
                balanceAfter: nextBalance
            })
        );

        return { balance: nextBalance };
    }

    async listTransactions(userId: number): Promise<WalletTransaction[]> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Utilisateur introuvable");
        }

        return await this.walletTransactionRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: "DESC" }
        });
    }
}
