import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";
import { CreateMovie, ListMovies, GetMovie, UpdateMovie, DeleteMovie } from "./movie-handler.js";
import { Signup, Login, Logout, RefreshToken } from "./auth-handler.js";
import { AuthMiddleware, RoleMiddleware } from "./middlewares/auth-middleware.js";
import { CreateScreening, DeleteScreening, GetScreening, ListScreenings, UpdateScreening } from "./screening-handler.js";
import { DepositMoney, GetMyBalance, ListMyTransactions, WithdrawMoney } from "./wallet-handler.js";
import {
    GetMyTicketDetail,
    ListMyTickets,
    PurchaseSimpleTicket,
    PurchaseSuperTicket,
    UseTicketForScreening
} from "./ticket-handler.js";

export const initHandlers = (app: Application) => {
    /**
     * @openapi
     * /auth/signup:
     *   post:
     *     tags: [Authentification]
     *     summary: Inscription et obtention des jetons
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AuthCredentialsRequest'
     *     responses:
     *       201:
     *         description: Compte cree
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthLoginResponse'
     *       400:
     *         description: Erreur de validation ou email deja utilise
     */
    app.post("/auth/signup", Signup);

    /**
     * @openapi
     * /auth/login:
     *   post:
     *     tags: [Authentification]
     *     summary: Connexion
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AuthCredentialsRequest'
     *     responses:
     *       200:
     *         description: Jetons d'acces
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthLoginResponse'
     *       401:
     *         description: Identifiants invalides
     */
    app.post("/auth/login", Login);

    /**
     * @openapi
     * /auth/logout:
     *   post:
     *     tags: [Authentification]
     *     summary: Deconnexion (invalidation du refresh token)
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RefreshTokenBody'
     *     responses:
     *       200:
     *         description: Deconnexion reussie
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthMessageResponse'
     *       400:
     *         description: Refresh token manquant
     */
    app.post("/auth/logout", Logout);

    /**
     * @openapi
     * /auth/refresh:
     *   post:
     *     tags: [Authentification]
     *     summary: Rafraichir le jeton d'acces
     *     security: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/RefreshTokenBody'
     *     responses:
     *       200:
     *         description: Nouveau jeton d'acces
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RefreshAccessResponse'
     *       400:
     *         description: Refresh token manquant
     *       401:
     *         description: Refresh token invalide ou expire
     */
    app.post("/auth/refresh", RefreshToken);

    /**
     * @openapi
     * /rooms:
     *   post:
     *     tags: [Salles]
     *     summary: Creer une salle (ADMIN)
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
     *         description: Salle creee
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/CreateRoomResponse'
     *       400:
     *         description: Validation ou nom deja utilise
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
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
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 100
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *       - in: query
     *         name: capacityMax
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Liste paginee des salles
     *       400:
     *         description: Parametres invalides
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Token invalide ou expire
     */
    app.get("/rooms", AuthMiddleware, ListRooms);

    /**
     * @openapi
     * /rooms/{id}:
     *   get:
     *     tags: [Salles]
     *     summary: Detail d'une salle
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
     *         description: Salle trouvee
     *       400:
     *         description: ID invalide
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Token invalide ou expire
     *       404:
     *         description: Salle introuvable
     */
    app.get("/rooms/:id", AuthMiddleware, GetRoom);

    /**
     * @openapi
     * /rooms/{id}:
     *   patch:
     *     tags: [Salles]
     *     summary: Modifier une salle (ADMIN)
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
     *             $ref: '#/components/schemas/UpdateRoomBody'
     *     responses:
     *       200:
     *         description: Salle mise a jour
     *       400:
     *         description: Validation echouee
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
     *       404:
     *         description: Salle introuvable
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
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Salle supprimee
     *       400:
     *         description: ID invalide
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
     *       404:
     *         description: Salle introuvable
     */
    app.delete("/rooms/:id", AuthMiddleware, RoleMiddleware(["ADMIN"]), DeleteRoom);

    /**
     * @openapi
     * /movies:
     *   post:
     *     tags: [Films]
     *     summary: Creer un film (ADMIN)
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
     *         description: Film cree
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MovieEntityResponse'
     *       400:
     *         description: Validation echouee
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
     *       409:
     *         description: Conflit (ex. titre duplique)
     */
    app.post("/movies", AuthMiddleware, RoleMiddleware(["ADMIN"]), CreateMovie);

    /**
     * @openapi
     * /movies:
     *   get:
     *     tags: [Films]
     *     summary: Lister les films (public)
     *     security: []
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
     *         name: title
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Liste des films
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 data:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/MovieEntityResponse'
     *                 page:
     *                   type: integer
     *                 pageSize:
     *                   type: integer
     *                 totalCount:
     *                   type: integer
     *                 totalPages:
     *                   type: integer
     *       400:
     *         description: Parametres invalides
     */
    app.get("/movies", ListMovies);

    /**
     * @openapi
     * /movies/{id}:
     *   get:
     *     tags: [Films]
     *     summary: Detail d'un film (public)
     *     security: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Film trouve
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MovieEntityResponse'
     *       400:
     *         description: ID invalide
     *       404:
     *         description: Film introuvable
     */
    app.get("/movies/:id", GetMovie);

    /**
     * @openapi
     * /movies/{id}:
     *   patch:
     *     tags: [Films]
     *     summary: Modifier un film (ADMIN)
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
     *             $ref: '#/components/schemas/UpdateMovieBody'
     *     responses:
     *       200:
     *         description: Film mis a jour
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/MovieEntityResponse'
     *       400:
     *         description: Validation echouee
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
     *       404:
     *         description: Film introuvable
     *       409:
     *         description: Conflit (ex. titre duplique)
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
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Film supprime
     *       400:
     *         description: ID invalide
     *       401:
     *         description: Non authentifie
     *       403:
     *         description: Droits insuffisants ou token invalide
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
     *     summary: Lister les seances (public)
     *     security: []
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
    app.get("/screenings", ListScreenings);

    /**
     * @openapi
     * /screenings/{id}:
     *   get:
     *     tags: [Seances]
     *     summary: Recuperer une seance par ID (public)
     *     security: []
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
    app.get("/screenings/:id", GetScreening);

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

    /**
     * @openapi
     * /wallet/balance:
     *   get:
     *     tags: [Wallet]
     *     summary: Voir son solde en euros
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Solde courant
     */
    app.get("/wallet/balance", AuthMiddleware, GetMyBalance);

    /**
     * @openapi
     * /wallet/deposit:
     *   post:
     *     tags: [Wallet]
     *     summary: Deposer de l'argent
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/WalletAmountRequest'
     *     responses:
     *       200:
     *         description: Nouveau solde
     */
    app.post("/wallet/deposit", AuthMiddleware, DepositMoney);

    /**
     * @openapi
     * /wallet/withdraw:
     *   post:
     *     tags: [Wallet]
     *     summary: Retirer de l'argent
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/WalletAmountRequest'
     *     responses:
     *       200:
     *         description: Nouveau solde
     *       409:
     *         description: Solde insuffisant
     */
    app.post("/wallet/withdraw", AuthMiddleware, WithdrawMoney);

    /**
     * @openapi
     * /wallet/transactions:
     *   get:
     *     tags: [Wallet]
     *     summary: Voir l'historique de ses transactions
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des transactions
     */
    app.get("/wallet/transactions", AuthMiddleware, ListMyTransactions);

    /**
     * @openapi
     * /tickets:
     *   get:
     *     tags: [Billets]
     *     summary: Mes billets
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des billets de l'utilisateur
     */
    app.get("/tickets", AuthMiddleware, ListMyTickets);

    /**
     * @openapi
     * /tickets/simple:
     *   post:
     *     tags: [Billets]
     *     summary: Acheter un billet simple pour une seance
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/BuySimpleTicketRequest'
     *     responses:
     *       201:
     *         description: Billet cree
     *       404:
     *         description: Seance introuvable
     *       409:
     *         description: Solde insuffisant ou billet deja present
     */
    app.post("/tickets/simple", AuthMiddleware, PurchaseSimpleTicket);

    /**
     * @openapi
     * /tickets/super:
     *   post:
     *     tags: [Billets]
     *     summary: Acheter un super billet (10 seances)
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       201:
     *         description: Super billet cree
     *       409:
     *         description: Solde insuffisant
     */
    app.post("/tickets/super", AuthMiddleware, PurchaseSuperTicket);

    /**
     * @openapi
     * /tickets/use:
     *   post:
     *     tags: [Billets]
     *     summary: Utiliser un billet pour entrer a une seance
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UseTicketRequest'
     *     responses:
     *       200:
     *         description: Utilisation enregistree
     *       404:
     *         description: Billet ou seance introuvable
     *       409:
     *         description: Billet epuise ou mauvaise seance
     */
    app.post("/tickets/use", AuthMiddleware, UseTicketForScreening);

    /**
     * @openapi
     * /tickets/{id}:
     *   get:
     *     tags: [Billets]
     *     summary: Detail d'un billet et historique d'utilisation
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
     *         description: Detail billet
     *       404:
     *         description: Billet introuvable
     */
    app.get("/tickets/:id", AuthMiddleware, GetMyTicketDetail);


}