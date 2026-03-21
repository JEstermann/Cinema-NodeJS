import { Application } from "express";
import { CreateRoom } from "./room-handler.js";

export const initHandlers = (app: Application) => {
    app.post("/rooms", CreateRoom)
}