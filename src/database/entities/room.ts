import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true, length: 255 })
    name: string;

    @Column("text", { nullable: true })
    description: string;

    @Column("json")
    images: string[] = [];

    @Column("varchar", { length: 100 })
    type: string;

    @Column("int")
    capacity: number;

    @Column("boolean", { default: false })
    isAccessible: boolean = false;

    @Column("boolean", { default: false })
    isMaintenance: boolean = false;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}