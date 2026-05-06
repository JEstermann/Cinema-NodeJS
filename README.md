# CinéScope

**Stack :** Node/TS, Express, TypeORM, MySQL, JWT (access 5 min + refresh en base), Docker Compose (API + MySQL + front).

**Fait :** auth (`/auth/*`), CRUD salles/films/séances (admin pour écriture), **consultation publique** `GET /movies`, `GET /movies/:id`, `GET /screenings`, `GET /screenings/:id` (sans JWT), wallet, billets simple/super + usages, Swagger `/docs`, image API sans TS en prod, front React build nginx.

**Pas fait / partiel :** planning par dates, maintenance→séances, même film multi‑salles, horaires 9h–20h, capacité séance & races, stats/admin users/transactions globales, bonus employés & CI/tests/obs.

## Ports (hôte → conteneur)

**api** | 3000 | 3000 | `http://localhost:3000` — Swagger `/docs` |
**web** | 9080 | 80 (nginx) | `http://localhost:9080` |
**phpmyadmin** | 8081 | 80 | `http://localhost:8081` 
**mysql-db** | *(non publié)* | 3306 | Accès interne Docker 
