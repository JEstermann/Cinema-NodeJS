import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";
import { CreateMovie, ListMovies, GetMovie, UpdateMovie, DeleteMovie } from "./movie-handler.js";
import { Signup, Login, Logout, RefreshToken } from "./auth-handler.js";
import { AuthMiddleware, RoleMiddleware } from "./middlewares/auth-middleware.js";
import { CreateScreening, DeleteScreening, GetScreening, ListScreenings, UpdateScreening } from "./screening-handler.js";

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

    /**
     * @openapi
     * /screenings:
     *   post:
     *     tags: [Seances]
     *     summary: Creer une seance (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateScreeningRequest'
     *     responses:
     *       201:
     *         description: Seance creee
     *       404:
     *         description: Salle ou film introuvable
     *       409:
     *         description: Chevauchement de seances
     */
    app.post("/screenings", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateScreening);

    /**
     * @openapi
     * /screenings:
     *   get:
     *     tags: [Seances]
     *     summary: Lister les seances
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *       - in: query
     *         name: roomId
     *         schema:
     *           type: integer
     *       - in: query
     *         name: movieId
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Liste des seances
     */
    app.get("/screenings", AuthMiddleware, ListScreenings);

    /**
     * @openapi
     * /screenings/{id}:
     *   get:
     *     tags: [Seances]
     *     summary: Recuperer une seance par ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Seance trouvee
     *       404:
     *         description: Seance introuvable
     */
    app.get("/screenings/:id", AuthMiddleware, GetScreening);

    /**
     * @openapi
     * /screenings/{id}:
     *   patch:
     *     tags: [Seances]
     *     summary: Modifier une seance (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateScreeningRequest'
     *     responses:
     *       200:
     *         description: Seance mise a jour
     *       404:
     *         description: Salle, film ou seance introuvable
     *       409:
     *         description: Chevauchement de seances
     */
    app.patch("/screenings/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), UpdateScreening);

    /**
     * @openapi
     * /screenings/{id}:
     *   delete:
     *     tags: [Seances]
     *     summary: Supprimer une seance (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Seance supprimee
     *       404:
     *         description: Seance introuvable
     */
    app.delete("/screenings/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), DeleteScreening);


}