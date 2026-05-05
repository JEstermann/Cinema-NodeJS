# Front React — Cinéma (Studio Cinéma)

Application **React + TypeScript + Vite + Tailwind** très lisible, qui parle à ton API Node dans ce repo.

## Ce que le front couvre


| Zone             | Pages      | Ce que ça fait                                                                                     |
| ---------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| **Auth**         | `/login`   | Inscription + connexion ; tokens stockés dans `localStorage` ; déconnexion appelle `/auth/logout`. |
| **Salles**       | `/salles`  | Liste des salles ; formulaire **admin** pour créer / supprimer.                                    |
| **Films**        | `/movies`  | Liste ; formulaire **admin** créer / supprimer. (URL alignée sur l’API `GET /movies`.)             |
| **Séances**      | `/seances` | Liste du planning ; formulaire **admin** (salle + film + date/heure locale → ISO).                 |
| **Portefeuille** | `/wallet`  | Solde, dépôt, retrait, tableau d’historique.                                                       |
| **Billets**      | `/billets` | Achat billet simple (choix séance), super billet, utilisation billet + séance, liste, détail JSON. |


Les menus **admin** (création / suppression) s’affichent si le rôle dans le JWT est `ADMIN` ou `SUPER_ADMIN`.

## Arborescence utile (pour s’y retrouver)

```
frontend/
├── src/
│   ├── api/client.ts       → fetch + renouvellement automatique du access token (POST /auth/refresh)
│   ├── context/AuthContext.tsx → état des tokens + login/logout
│   ├── lib/jwt.ts          → lecture du payload JWT (rôle, userId)
│   ├── components/ui.tsx   → petits composants réutilisables (Button, Card, Field…)
│   ├── components/AppShell.tsx → layout avec navigation + Outlet
│   ├── pages/*.tsx         → une page = une fonctionnalité métier
│   ├── App.tsx             → routes React Router
│   └── main.tsx
├── .env.example
└── README.md (ce fichier)
```

## Prérequis

1. **API Node démarrée** (ex. port `3000` avec `APP_PORT` ou défaut).
2. Le backend expose bien **CORS** pour le navigateur (déjà ajouté dans `src/index.ts` à la racine du projet API).

## Installation

```bash
cd frontend
cp .env.example .env
npm install
```

## Lancer en développement

```bash
npm run dev
```

<<<<<<< HEAD
L'app sera disponible sur `http://localhost:5173`

## 📱 Fonctionnalités

### Pages
- **Login/Signup** - Authentification JWT
- **Dashboard** - Aperçu du système
- **Films** - Liste et gestion des films (ADMIN)
- **Salles** - Liste et gestion des salles (ADMIN)

### Fonctionnalités
- ✅ Authentification JWT avec refresh token
- ✅ Routes protégées
- ✅ CRUD Films (admin)
- ✅ CRUD Salles (admin)
- ✅ Interface Ant Design
- ✅ TypeScript

## 🔧 Structure

```
src/
├── api/              # Appels API avec axios
├── context/          # Auth context (JWT)
├── pages/            # Composants pages
├── types.ts          # Types TypeScript
├── App.tsx           # Main app avec routing
└── main.tsx          # Entry point
```

## 🔐 Authentification

- Tokens stockés en **localStorage**
- Interceptor pour ajouter le token aux requêtes
- Auto-refresh du token si expiré
- Déconnexion automatique si token invalide

## 🎨 Customisation

Modifier les couleurs dans `App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📝 Variables d'environnement

Créer `.env` à partir de `.env.example`:
```
VITE_API_URL=http://localhost:3000
```

## 🛠️ Build

```bash
npm run build
```

Fichiers générés dans `dist/`
=======
Ouvre l’URL affichée par Vite (souvent `http://localhost:5173`).

## Variable d’environnement


| Variable       | Rôle                                       |
| -------------- | ------------------------------------------ |
| `VITE_API_URL` | Base de l’API, ex. `http://localhost:3000` |


Sans `.env`, le front utilise déjà `http://localhost:3000` par défaut dans le code.

## Build production

```bash
npm run build
npm run preview   # pour tester le dossier dist/ en local
```

## Comportement technique (simple)

1. **Connexion** : `POST /auth/login` → on garde `accessToken` et `refreshToken` dans `localStorage`.
2. **Requêtes** : header `Authorization: Bearer <accessToken>`.
3. **401 / 403** : tentative de `POST /auth/refresh` avec le refresh token ; si OK, nouvelle requête avec le nouvel access token.
4. **Rôle admin** : décodage du JWT (partie payload, sans vérifier la signature côté front — suffisant pour l’UI ; la sécurité réelle reste côté API).

## Parcours conseillé pour une démo

1. Créer un compte client → se connecter.
2. (Option) Créer un compte **admin** en base ou passer un utilisateur en `ADMIN` pour utiliser les formulaires de création.
3. **Admin** : créer salle(s), film(s), puis séance(s).
4. **Wallet** : déposer de l’argent.
5. **Billets** : acheter un billet simple ou un super billet ; tester « Valider l’entrée » avec les IDs affichés.

## Limitations assumées (volontairement simples)

- Pas de gestion avancée des erreurs réseau hors messages API.
- Pas d’édition complète (PATCH) des salles / films / séances dans l’UI — uniquement ce qui permet une démo rapide (liste + création/suppression où prévu).
- Thème sombre unique, orienté « cinéma ».

Pour aller plus loin : ajouter des pages d’édition, pagination réelle, react-query, etc.
>>>>>>> 3989794 (front)
