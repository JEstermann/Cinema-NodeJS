import "dotenv/config";
import { DataSource } from "typeorm";
import { Room } from "./entities/room.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost", 
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "cpZTMQ760?ZTLoB8j*5WW~1hT,4*H",
    database: process.env.DB_DATABASE || "cinema_db",
    
    synchronize: process.env.NODE_ENV === "development", 
    logging: process.env.NODE_ENV === "development",
    entities: [Room]
});