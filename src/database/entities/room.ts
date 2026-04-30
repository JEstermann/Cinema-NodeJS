import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255 })
    name: string;

    @Column("text", { nullable: true })
    description?: string;

    @Column("json", { default: [] })
    images: string[] = [];

    @Column({ length: 100 })
    type: string;

    @Column("int")
    capacity: number;

    @Column({ default: false })
    isAccessible: boolean = false;

    @Column({ default: false })
    isMaintenance: boolean = false;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}