import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.js";

@Entity()
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 512, unique: true })
    token: string; 

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}