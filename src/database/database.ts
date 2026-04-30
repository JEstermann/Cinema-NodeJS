import "dotenv/config"; 
import { DataSource } from "typeorm";
import { Room } from "./entities/room.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"), 
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === "development", // True seulement si on est dév
    logging: process.env.NODE_ENV === "development",
    entities: [Room]
});