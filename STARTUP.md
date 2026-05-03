# Documentation de démarrage

## 🚀 Démarrage du projet

### Mode développement (sans Docker)

**Terminal 1 - Backend:**
```bash
cd /home/massinissa/Musique/Cinema-NodeJS
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /home/massinissa/Musique/Cinema-NodeJS/frontend
npm install
npm run dev
```

Puis ouvrir:
- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- Swagger API: http://localhost:3000/api-docs
- PhpMyAdmin: http://localhost:8080

### Mode Production (avec Docker)

```bash
# Build et démarrage
docker compose -f docker-compose.prod.yml up --build

# Ou juste démarrer
docker compose -f docker-compose.prod.yml up

# Arrêter
docker compose -f docker-compose.prod.yml down
```

Services disponibles:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PhpMyAdmin: http://localhost:8080

## 🔐 Variables d'environnement

Créer un fichier `.env` à la racine:
```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=cinema_user
DB_PASSWORD=cinema_password
DB_DATABASE=cinema_db
APP_PORT=3000
```

Pour le frontend, créer `frontend/.env`:
```
VITE_API_URL=http://localhost:3000
```

## 📦 Installation

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

## 🏗️ Build

```bash
# Backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🧪 Test

```bash
# Backend
npm run dev

# Frontend
cd frontend
npm run dev
```

## 📝 Notes

- Les données MySQL persistent dans le volume `mysql-data`
- JWT tokens sont stockés en localStorage (frontend)
- API docs disponible à `/api-docs`
