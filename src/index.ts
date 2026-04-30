import express from "express";
import "reflect-metadata";
import { initHandlers } from "./handlers/routes.js";
import { AppDataSource } from "./database/database.js";
import { swaggerDocs } from "./handlers/swagger/swagger.js";

const app = express();
const PORT = process.env.APP_PORT || 3000;
app.use(express.json())

initHandlers(app);

swaggerDocs(app, PORT)

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
