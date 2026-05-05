# Etape 4 - Gestion de l'Argent (Wallet)

Ce document explique, de facon simple, ce qui a ete implemente pour la partie Wallet.

## Objectif de l'etape

Permettre a un utilisateur authentifie de:

- deposer de l'argent
- retirer de l'argent
- voir son solde
- voir son historique de transactions

## Ce qui a ete ajoute

## 1) Solde sur l'utilisateur

Fichier: `src/database/entities/user.ts`

Ajout du champ:

- `balance` (decimal, 2 chiffres apres la virgule, valeur par defaut `0`)

Le solde actuel de l'utilisateur est donc stocke directement dans la table `User`.

## 2) Table d'historique des transactions

Fichier: `src/database/entities/wallet-transaction.ts`

Chaque mouvement est enregistre avec:

- `id`
- `user` (l'utilisateur concerne)
- `type` (`DEPOSIT` ou `WITHDRAW`)
- `amount`
- `balanceAfter` (solde juste apres l'operation)
- `createdAt`

Cette table sert d'historique.

## 3) Activation dans TypeORM

Fichier: `src/database/database.ts`

Ajout de l'entite `WalletTransaction` dans `entities`.

## 4) Regles metier Wallet

Fichier: `src/usecases/wallet-usecase.ts`

Methodes implementees:

- `getBalance(userId)`
- `deposit(userId, amount)`
- `withdraw(userId, amount)`
- `listTransactions(userId)`

Regles appliquees:

- l'utilisateur doit exister
- montant positif obligatoire (validation cote handler)
- retrait interdit si solde insuffisant (`409`)
- arrondi propre sur 2 decimales
- chaque depot/retrait cree une ligne d'historique

## 5) Validation des entrees

Fichier: `src/handlers/validators/wallet-validator.ts`

Validation simple:

- `amount` obligatoire
- `amount > 0`
- precision 2 decimales max

## 6) API Wallet

Fichier: `src/handlers/wallet-handler.ts`

Endpoints:

- `GET /wallet/balance`
- `POST /wallet/deposit`
- `POST /wallet/withdraw`
- `GET /wallet/transactions`

Tous ces endpoints utilisent `AuthMiddleware`.
Le `userId` est recupere depuis le token JWT decode (`req.user.userId`).

## 7) Routes + OpenAPI

Fichier: `src/handlers/routes.ts`

Ajout des routes Wallet avec doc OpenAPI.

Schema OpenAPI du body Wallet:

- Fichier: `src/handlers/requests/wallet-request.ts`
- Schema: `WalletAmountRequest`

## Exemple d'utilisation

## 1) Voir le solde

`GET /wallet/balance`

Reponse exemple:

```json
{
  "balance": 0
}
```

## 2) Deposer 50 euros

`POST /wallet/deposit`

Body:

```json
{
  "amount": 50
}
```

Reponse exemple:

```json
{
  "balance": 50
}
```

## 3) Retirer 20 euros

`POST /wallet/withdraw`

Body:

```json
{
  "amount": 20
}
```

Reponse exemple:

```json
{
  "balance": 30
}
```

Si tu demandes plus que le solde:

- HTTP `409`
- message: `Solde insuffisant`

## 4) Voir l'historique

`GET /wallet/transactions`

Reponse exemple:

```json
[
  {
    "id": 2,
    "type": "WITHDRAW",
    "amount": 20,
    "balanceAfter": 30,
    "createdAt": "2026-05-05T20:00:00.000Z"
  },
  {
    "id": 1,
    "type": "DEPOSIT",
    "amount": 50,
    "balanceAfter": 50,
    "createdAt": "2026-05-05T19:59:00.000Z"
  }
]
```

## Pourquoi cette version est "simple"

- pas de systeme de categories de transactions complique
- pas de portefeuille multi-devise
- pas de logique externe de paiement
- juste ce qu'il faut pour valider le besoin du sujet

En resume:

- wallet en euros
- depot/retrait
- historique
- routes protegees JWT
