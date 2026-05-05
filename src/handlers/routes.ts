import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";
import { CreateMovie, ListMovies, GetMovie, UpdateMovie, DeleteMovie } from "./movie-handler.js";
import { Signup, Login, Logout, RefreshToken } from "./auth-handler.js";
import { AuthMiddleware, RoleMiddleware } from "./middlewares/auth-middleware.js";
import { CreateScreening, DeleteScreening, GetScreening, ListScreenings, UpdateScreening } from "./screening-handler.js";

export const initHandlers = (app: Application) => {
    // ==========================================
    // ROUTES D'AUTHENTIFICATION (PUBLIQUES)
    // ==========================================

    /**
     * @openapi
     * /auth/signup:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Créer un nouveau compte utilisateur
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AuthRequest'
     *     responses:
     *       201:
     *         description: Utilisateur créé
     */
    app.post("/auth/signup", Signup);

    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Se connecter pour obtenir des tokens
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AuthRequest'
     *     responses:
     *       200:
     *         description: Connexion réussie, renvoie les tokens
     */
    app.post("/auth/login", Login);

    /**
     * @openapi
     * /auth/logout:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Déconnecter l'utilisateur (Stateful)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *     responses:
     *       200:
     *         description: Déconnexion réussie
     */
    app.post("/auth/logout", Logout);

    /**
     * @openapi
     * /auth/refresh:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Rafraîchir l'Access Token (5 min)
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *     responses:
     *       200:
     *         description: Nouveau token généré
     *       401:
     *         description: Session expirée ou invalide
     */
    app.post("/auth/refresh", RefreshToken);

    // ==========================================
    // ROUTES POUR LES SALLES (ROOMS)
    // ==========================================

    /**
     * @openapi
     * /rooms:
     *   post:
     *     tags: [Salles]
     *     summary: Créer une nouvelle salle (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRoomRequest'
     *     responses:
     *       201:
     *         description: Salle créée
     *       403:
     *         description: Accès refusé
     */
    app.post("/rooms", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateRoom);

    /**
     * @openapi
     * /rooms:
     *   get:
     *     tags: [Salles]
     *     summary: Lister les salles
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des salles
     */
    app.get("/rooms", AuthMiddleware, ListRooms);

    /**
     * @openapi
     * /rooms/{id}:
     *   get:
     *     tags: [Salles]
     *     summary: Récupérer une salle par son ID
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
     *         description: Salle trouvée
     */
    app.get("/rooms/:id", AuthMiddleware, GetRoom);

    /**
     * @openapi
     * /rooms/{id}:
     *   patch:
     *     tags: [Salles]
     *     summary: Mettre à jour une salle (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRoomRequest'
     *     responses:
     *       200:
     *         description: Salle mise à jour
     */
    app.patch("/rooms/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), UpdateRoom);

    /**
     * @openapi
     * /rooms/{id}:
     *   delete:
     *     tags: [Salles]
     *     summary: Supprimer une salle (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Salle supprimée
     */
    app.delete("/rooms/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), DeleteRoom);

    // ==========================================
    // ROUTES POUR LES FILMS (MOVIES)
    // ==========================================

    /**
     * @openapi
     * /movies:
     *   post:
     *     tags: [Films]
     *     summary: Créer un nouveau film (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateMovieRequest'
     *     responses:
     *       201:
     *         description: Film créé
     */
    app.post("/movies", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateMovie);

    /**
     * @openapi
     * /movies:
     *   get:
     *     tags: [Films]
     *     summary: Lister les films
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des films
     */
    app.get("/movies", AuthMiddleware, ListMovies);

    /**
     * @openapi
     * /movies/{id}:
     *   get:
     *     tags: [Films]
     *     summary: Récupérer un film par son ID
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Film trouvé
     */
    app.get("/movies/:id", AuthMiddleware, GetMovie);

    /**
     * @openapi
     * /movies/{id}:
     *   patch:
     *     tags: [Films]
     *     summary: Mettre à jour un film (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateMovieRequest'
     *     responses:
     *       200:
     *         description: Film mis à jour
     */
    app.patch("/movies/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), UpdateMovie);

    /**
     * @openapi
     * /movies/{id}:
     *   delete:
     *     tags: [Films]
     *     summary: Supprimer un film (ADMIN)
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Film supprimé
     */
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