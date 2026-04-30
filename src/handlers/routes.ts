import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";
import { CreateMovie, ListMovies, GetMovie, UpdateMovie, DeleteMovie } from "./movie-handler.js";

export const initHandlers = (app: Application) => {
    // ==========================================
    // ROUTES POUR LES SALLES (ROOMS)
    // ==========================================

    /**
     * @openapi
     * /rooms:
     *   post:
     *     tags:
     *       - Salles
     *     summary: Créer une nouvelle salle
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRoomRequest'
     *     responses:
     *       201:
     *         description: Salle créée avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RoomResponse'
     *       400:
     *         description: Erreur de validation
     *       409:
     *         description: Ce nom de salle est déjà utilisé
     */
    app.post("/rooms", CreateRoom)

    /**
     * @openapi
     * /rooms:
     *   get:
     *     tags:
     *       - Salles
     *     summary: Lister les salles avec pagination et filtres
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Numéro de la page
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *         description: Nombre d'éléments par page
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *         description: Filtrer par nom de salle
     *       - in: query
     *         name: capacityMax
     *         schema:
     *           type: integer
     *         description: Capacité maximale recherchée
     *     responses:
     *       200:
     *         description: Liste des salles récupérée avec succès
     */
    app.get("/rooms", ListRooms)

    /**
     * @openapi
     * /rooms/{id}:
     *   get:
     *     tags:
     *       - Salles
     *     summary: Récupérer une salle par son ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID unique de la salle
     *     responses:
     *       200:
     *         description: Salle trouvée
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RoomResponse'
     *       404:
     *         description: Salle introuvable
     */
    app.get("/rooms/:id", GetRoom)

    /**
     * @openapi
     * /rooms/{id}:
     *   patch:
     *     tags:
     *       - Salles
     *     summary: Mettre à jour une salle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la salle à modifier
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRoomRequest'
     *     responses:
     *       200:
     *         description: Salle mise à jour avec succès
     *       404:
     *         description: Salle introuvable
     *       409:
     *         description: Le nouveau nom est déjà utilisé par une autre salle
     */
    app.patch("/rooms/:id", UpdateRoom)

    /**
     * @openapi
     * /rooms/{id}:
     *   delete:
     *     tags:
     *       - Salles
     *     summary: Supprimer une salle
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la salle à supprimer
     *     responses:
     *       200:
     *         description: Salle supprimée avec succès
     *       404:
     *         description: Salle introuvable
     */
    app.delete("/rooms/:id", DeleteRoom)

    // ==========================================
    // ROUTES POUR LES FILMS (MOVIES)
    // ==========================================

    /**
     * @openapi
     * /movies:
     *   post:
     *     tags:
     *       - Films
     *     summary: Créer un nouveau film
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateMovieRequest'
     *     responses:
     *       201:
     *         description: Film créé avec succès
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MovieResponse'
     *       400:
     *         description: Données invalides
     */
    app.post("/movies", CreateMovie);

    /**
     * @openapi
     * /movies:
     *   get:
     *     tags:
     *       - Films
     *     summary: Lister les films avec pagination et recherche
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *         description: Numéro de la page
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *         description: Nombre de films par page
     *       - in: query
     *         name: title
     *         schema:
     *           type: string
     *         description: Rechercher un film par son titre
     *     responses:
     *       200:
     *         description: Liste des films récupérée avec succès
     */
    app.get("/movies", ListMovies);

    /**
     * @openapi
     * /movies/{id}:
     *   get:
     *     tags:
     *       - Films
     *     summary: Récupérer un film par son ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID unique du film
     *     responses:
     *       200:
     *         description: Film trouvé
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MovieResponse'
     *       404:
     *         description: Film introuvable
     */
    app.get("/movies/:id", GetMovie);

    /**
     * @openapi
     * /movies/{id}:
     *   patch:
     *     tags:
     *       - Films
     *     summary: Mettre à jour un film
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du film à modifier
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateMovieRequest'
     *     responses:
     *       200:
     *         description: Film mis à jour avec succès
     *       404:
     *         description: Film introuvable
     */
    app.patch("/movies/:id", UpdateMovie);

    /**
     * @openapi
     * /movies/{id}:
     *   delete:
     *     tags:
     *       - Films
     *     summary: Supprimer un film
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID du film à supprimer
     *     responses:
     *       200:
     *         description: Film supprimé avec succès
     *       404:
     *         description: Film introuvable
     */
    app.delete("/movies/:id", DeleteMovie);
}