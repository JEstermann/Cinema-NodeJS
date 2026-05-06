import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { User } from "./user.js";
import { Screening } from "./screening.js";

export type TicketKind = "SIMPLE" | "SUPER";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @Column({ type: "varchar", length: 20 })
    kind: TicketKind;

    @ManyToOne(() => Screening, { onDelete: "CASCADE", nullable: true })
    @JoinColumn({ name: "screeningId" })
    screening: Screening | null;

    @Column("int")
    remainingCredits: number;

    @Column("decimal", { precision: 10, scale: 2 })
    pricePaid: number;

    @CreateDateColumn()
    createdAt: Date;
}
