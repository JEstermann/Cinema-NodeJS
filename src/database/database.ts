import "dotenv/config";
import { DataSource } from "typeorm";
import { Room } from "./entities/room.js";
import { Movie } from "./entities/movie.js";
import { User } from "./entities/user.js"
import { Token } from "./entities/token.js"
import { Screening } from "./entities/screening.js";
import { WalletTransaction } from "./entities/wallet-transaction.js";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST as string, 
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
    
    synchronize: true, 
    logging:false,
    entities: [Room, Movie, User, Token, Screening, WalletTransaction]
});
