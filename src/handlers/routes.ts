import { Application } from "express";
import { CreateRoom, ListRooms } from "./room-handler.js";

export const initHandlers = (app: Application) => {
    app.post("/rooms", CreateRoom)
    app.get("/rooms", ListRooms)
}