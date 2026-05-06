# CinéScope

**Stack :** Node/TS, Express, TypeORM, MySQL, JWT (access 5 min + refresh en base), Docker Compose (API + MySQL + front).

**Fait :** auth (`/auth/*`), CRUD salles/films/séances (admin pour écriture), **consultation publique** `GET /movies`, `GET /movies/:id`, `GET /screenings`, `GET /screenings/:id` (sans JWT), wallet, billets simple/super + usages, Swagger `/docs`, image API sans TS en prod, front React build nginx.

**Pas fait / partiel :** planning par dates, maintenance→séances, même film multi‑salles, horaires 9h–20h, capacité séance & races, stats/admin users/transactions globales, bonus employés & CI/tests/obs.

**Run :** `.env` → `docker compose up --build` → API `:3000`, doc `/docs`.

**Démo :** login → Bearer → CRUD admin → deposit → ticket → `/docs`.
