import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.js";

export type WalletTransactionType = "DEPOT" | "RETRAIT";

@Entity()
export class WalletTransaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.walletTransactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column("decimal", { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: "varchar", length: 20 })
    type: WalletTransactionType;

    @Column("decimal", { precision: 10, scale: 2 })
    balanceAfter: number;

    @CreateDateColumn()
    createdAt: Date;
}
