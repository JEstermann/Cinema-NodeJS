# Frontend Cinema React + Ant Design

Interface web pour gérer le cinéma (films, salles, authentification).

## 📦 Installation

```bash
cd frontend
npm install
```

## 🚀 Démarrage

```bash
npm run dev
```

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
