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