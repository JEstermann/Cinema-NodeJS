import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Ticket } from "./ticket.js";
import { Screening } from "./screening.js";

@Entity()
export class TicketUsage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Ticket, { onDelete: "CASCADE" })
    @JoinColumn({ name: "ticketId" })
    ticket: Ticket;

    @ManyToOne(() => Screening, { onDelete: "CASCADE" })
    @JoinColumn({ name: "screeningId" })
    screening: Screening;

    @CreateDateColumn()
    usedAt: Date;
}
