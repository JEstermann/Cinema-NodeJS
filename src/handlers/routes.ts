import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";

export const initHandlers = (app: Application) => {
    app.post("/rooms", CreateRoom)
    app.get("/rooms", ListRooms)
    app.get("/rooms/:id", GetRoom)
    app.patch("/rooms/:id", UpdateRoom)
    app.delete("/rooms/:id", DeleteRoom)
}