import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Token } from "./token.js";
import { WalletTransaction } from "./wallet-transaction.js";

export type UserRole = "CLIENT" | "ADMIN" | "SUPER_ADMIN";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column("varchar", { length: 255 })
    password: string; 

    
    @Column({ type: "varchar", length: 50, default: "CLIENT" })
    role: UserRole;

    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    balance: number;

    @OneToMany(() => WalletTransaction, (transaction) => transaction.user)
    walletTransactions: WalletTransaction[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}