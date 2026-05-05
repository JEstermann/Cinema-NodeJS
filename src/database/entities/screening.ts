import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Room } from "./room.js";
import { Movie } from "./movie.js";

@Entity()
export class Screening {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, { onDelete: "CASCADE" })
    @JoinColumn({ name: "roomId" })
    room: Room;

    @ManyToOne(() => Movie, { onDelete: "CASCADE" })
    @JoinColumn({ name: "movieId" })
    movie: Movie;

    @Column("datetime")
    startAt: Date;

    @Column("datetime")
    endAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
