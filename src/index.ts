import express from "express";
import "reflect-metadata";
import { AppDataSource } from "./database/database.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json())

try {
    await AppDataSource.initialize();
} catch(error) {
    console.log(error)
    console.log("failed to initialized database conection")
    process.exit(1)
}

app.listen(PORT, () => {
    console.log("App is listening on port " + PORT)
})
