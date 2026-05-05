# Etape 5 - Billetterie (billets simples et super billets)

## Objectif

- Permettre l’achat d’un **billet simple** (une séance précise).
- Permettre l’achat d’un **super billet** utilisable pour **10 séances**.
- À chaque achat : **vérifier que le solde du wallet suffit** (débit via le même mécanisme que les retraits).

## Prix (variables d’environnement)

| Variable               | Défaut | Rôle                          |
|------------------------|--------|-------------------------------|
| `TICKET_SIMPLE_PRICE`  | `10`   | Prix d’un billet simple (€)   |
| `TICKET_SUPER_PRICE`   | `75`   | Prix d’un super billet (€)   |

## Modèle de données

### `Ticket` (`src/database/entities/ticket.ts`)

- `kind` : `SIMPLE` ou `SUPER`
- `screening` : renseigné pour un billet **simple** (la séance achetée) ; `null` pour un **super** billet
- `remainingCredits` : `1` après achat simple ; `10` après achat super ; diminue à chaque utilisation
- `pricePaid` : montant débité du wallet à l’achat

### `TicketUsage` (`src/database/entities/ticket-usage.ts`)

Chaque entrée à une séance avec un billet crée une ligne :

- lien vers le billet et la séance
- `usedAt` : date de l’utilisation

Tu peux ainsi répondre à « quel billet pour quelle séance » via cette table et `GET /tickets/:id`.

## Logique métier (`src/usecases/ticket-usecase.ts`)

1. **Achat billet simple**  
   - Vérifie que la séance existe.  
   - Refuse si l’utilisateur a déjà un billet simple **non utilisé** (`remainingCredits === 1`) pour cette même séance.  
   - Appelle `WalletUsecase.withdraw` : si solde insuffisant → erreur type « Solde insuffisant pour acheter ce billet ».  
   - Crée le `Ticket`.

2. **Achat super billet**  
   - Débite le prix du super billet via `withdraw`.  
   - Crée un `Ticket` avec `remainingCredits = 10` et sans séance liée.

3. **Utilisation** (`useTicket`)  
   - Vérifie billet appartenant à l’utilisateur, séance existante, `remainingCredits > 0`.  
   - **Simple** : la séance passée doit être **exactement** celle du billet.  
   - **Super** : n’importe quelle séance (une entrée consomme 1 crédit).  
   - Crée un `TicketUsage`, décrémente `remainingCredits`.

## API (JWT obligatoire, même schéma que le wallet)

| Méthode | Route               | Description                                      |
|---------|---------------------|--------------------------------------------------|
| GET     | `/tickets`          | Liste de mes billets                             |
| POST    | `/tickets/simple`   | Body `{ "screeningId": number }` — achat simple  |
| POST    | `/tickets/super`    | Achat super billet (pas de body)                 |
| POST    | `/tickets/use`      | Body `{ "ticketId", "screeningId" }` — entrée séance |
| GET     | `/tickets/:id`      | Détail + usages (`TicketUsage`)                   |

La documentation OpenAPI est dans `src/handlers/routes.ts` et les schémas dans `src/handlers/requests/ticket-request.ts`.

## Correction wallet

Le type `WalletTransaction.type` a été aligné sur les valeurs déjà utilisées par `WalletUsecase` : `DEPOSIT` et `WITHDRAW` (voir `src/database/entities/wallet-transaction.ts`).

## Scénario rapide de démo

1. Déposer de l’argent : `POST /wallet/deposit`  
2. Acheter un billet simple : `POST /tickets/simple` avec une `screeningId` valide  
3. Utiliser le billet : `POST /tickets/use` avec ce `ticketId` et la **même** `screeningId`  
4. Pour un super billet : `POST /tickets/super`, puis plusieurs fois `POST /tickets/use` avec différentes séances jusqu’à épuisement des 10 crédits  
