import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.js";
import { Screening } from "./screening.js";
import { TicketUsage } from "./ticket-usage.js";

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

    @OneToMany(() => TicketUsage, (usage) => usage.ticket)
    usages: TicketUsage[];

    @CreateDateColumn()
    createdAt: Date;
}
