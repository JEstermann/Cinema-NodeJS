import { DataSource } from "typeorm";
import { Room } from "./entities/room.js";

console.log(process.env.DB_HOST)

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: 3306,
    username: "root",
    password: "your_password",
    database: "your_database",
    synchronize: true,
    logging: true,
    entities: [Room]
})
