import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.js";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255 })
    token: string;

    @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}