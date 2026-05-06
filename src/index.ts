import "reflect-metadata";
import express from "express";
import { initHandlers } from "./handlers/routes.js";
import { AppDataSource } from "./database/database.js";
import { swaggerDocs } from "./handlers/swagger/swagger.js";
import { getPublicApiBaseUrl } from "./config/public-api.js";

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.APP_PORT || 3000;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json())

initHandlers(app);

swaggerDocs(app, PORT)

try {
    await AppDataSource.initialize();
    console.log("Database initialized successfully");
    app.listen(PORT, () => {
        console.log("App is listening on port " + PORT);
        console.log("API publique (Swagger): " + getPublicApiBaseUrl());
    })
} catch(error) {
    console.log(error)
    console.log("failed to initialized database conection")
    process.exit(1)
}

