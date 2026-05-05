# Cinema-NodeJS - Etape 3: Gestion des Seances

## Objectif de l'etape

Mettre en place la gestion des seances en reliant une salle et un film, avec deux regles metier obligatoires:

- pas de chevauchement d'horaires dans une meme salle
- duree d'une seance = duree du film + 30 minutes

## Ce que j'ai ajoute

### 1) Nouvelle entite `Screening`

Fichier: `src/database/entities/screening.ts`

Champs:

- `id`
- `room` (relation vers `Room`)
- `movie` (relation vers `Movie`)
- `startAt`
- `endAt`
- `createdAt`
- `updatedAt`

La table est incluse dans TypeORM via `src/database/database.ts`.

### 2) Couche usecase (logique metier)

Fichier: `src/usecases/screening-usecase.ts`

Cette couche contient la logique principale:

- recupere la salle et le film
- calcule `endAt` automatiquement avec:
  - `endAt = startAt + (movie.durationInMinutes + 30 minutes)`
- verifie l'absence de chevauchement sur la meme salle:
  - condition SQL: `existing.startAt < newEndAt` ET `existing.endAt > newStartAt`
- CRUD minimal:
  - `createScreening`
  - `listScreenings`
  - `getScreening`
  - `updateScreening`
  - `deleteScreening`

Important: sur `update`, la regle est reappliquee et le chevauchement est verifie en excluant la seance modifiee.

### 3) Couche validation

Fichier: `src/handlers/validators/screening-validator.ts`

Validations Joi:

- creation:
  - `roomId` entier > 0
  - `movieId` entier > 0
  - `startAt` au format ISO date
- mise a jour:
  - `id` obligatoire + champs optionnels
- liste:
  - pagination + filtres `roomId`, `movieId`
- recuperation/suppression:
  - `id` obligatoire

### 4) Couche handler (API)

Fichier: `src/handlers/screening-handler.ts`

Endpoints geres:

- creation
- liste
- detail
- modification
- suppression

Codes retour principaux:

- `201` creation OK
- `200` lecture/modification/suppression OK
- `400` validation invalide
- `404` salle, film ou seance introuvable
- `409` chevauchement detecte
- `500` erreur serveur

### 5) Routes ajoutees

Fichier: `src/handlers/routes.ts`

Routes:

- `POST /screenings` (ADMIN)
- `GET /screenings` (authentifie)
- `GET /screenings/:id` (authentifie)
- `PATCH /screenings/:id` (ADMIN)
- `DELETE /screenings/:id` (ADMIN)

## Choix de simplicite

J'ai volontairement fait une version simple et claire:

- pas de logique de fuseau horaire avancee
- pas de contrainte "heures d'ouverture cinema" dans cette etape
- pas d'optimisation prematuree
- la logique est centralisee dans un seul usecase facile a expliquer en soutenance

## Comment tester rapidement

Pre-requis:

- avoir des utilisateurs auth (JWT)
- avoir au moins 1 salle et 1 film

### 1) Creation d'une seance

`POST /screenings`

Body exemple:

```json
{
  "roomId": 1,
  "movieId": 1,
  "startAt": "2026-05-06T18:00:00.000Z"
}
```

Resultat attendu:

- `201`
- `endAt` est calcule automatiquement

### 2) Test anti-chevauchement

Creer une 2e seance dans la meme salle qui commence avant la fin de la 1re.

Resultat attendu:

- `409`
- message de conflit de chevauchement

### 3) Test duree film + 30 min

Si un film dure 120 min:

- `startAt = 18:00`
- `endAt` attendu = `20:30`

### 4) Update d'une seance

`PATCH /screenings/:id` avec un nouveau `startAt` (ou `roomId`/`movieId`)

Resultat attendu:

- recalcul de `endAt`
- rejet en `409` si chevauchement

## Fichiers crees

- `src/database/entities/screening.ts`
- `src/usecases/screening-usecase.ts`
- `src/handlers/screening-handler.ts`
- `src/handlers/validators/screening-validator.ts`
- `src/handlers/requests/screening-request.ts`

## Fichiers modifies

- `src/database/database.ts`
- `src/handlers/routes.ts`

