import "dotenv/config";
import { DataSource } from "typeorm";
import { Room } from "./entities/room.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST as string, 
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    
    synchronize: process.env.NODE_ENV === "development", 
    logging: process.env.NODE_ENV === "development",
    entities: [Room]
});
