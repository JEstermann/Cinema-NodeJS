import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { unique: true, length: 255 })
    name: string;

    @Column("text")
    description: string;

    @Column("json")
    images: string[];

    @Column("varchar", { length: 100 })
    type: string;

    @Column("int")
    capacity: number;

    @Column({ type: "boolean", default: false })
    isAccessible: boolean;

    @Column({ type: "boolean", default: false })
    isMaintenance: boolean; 
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date

    constructor(
        id: number,
        name: string,
        description: string,
        images: string[],
        type: string,
        capacity: number,
        createdAt: Date,
        updatedAt: Date,
        deletedAt: Date,
        isAccessible?: boolean,
        isMaintenance?: boolean,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.images = images;
        this.type = type;
        this.capacity = capacity;
        this.isAccessible = isAccessible ?? false;
        this.isMaintenance = isMaintenance ?? false;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
}