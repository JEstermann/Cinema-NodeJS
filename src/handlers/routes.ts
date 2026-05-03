import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";
import { CreateMovie, ListMovies, GetMovie, UpdateMovie, DeleteMovie } from "./movie-handler.js";
import { Signup, Login, Logout, RefreshToken } from "./auth-handler.js";
import { AuthMiddleware, RoleMiddleware } from "./middlewares/auth-middleware.js";

export const initHandlers = (app: Application) => {
    app.post("/auth/signup", Signup);

    app.post("/auth/login", Login);

    app.post("/auth/logout", Logout);

    app.post("/auth/refresh", RefreshToken);

    app.post("/rooms", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateRoom);

    app.get("/rooms", AuthMiddleware, ListRooms);

    app.get("/rooms/:id", AuthMiddleware, GetRoom);

    app.patch("/rooms/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), UpdateRoom);

    app.delete("/rooms/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), DeleteRoom);

    app.post("/movies", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateMovie);

    app.get("/movies", AuthMiddleware, ListMovies);

    app.get("/movies/:id", AuthMiddleware, GetMovie);

    app.patch("/movies/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), UpdateMovie);

    app.delete("/movies/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), DeleteMovie);


}