# 🛒 CodeAlpha Ecommerce Store

Boutique e-commerce full-stack moderne — HTML5 / CSS3 / JavaScript vanilla +
Node.js / Express + MongoDB (Mongoose) + JWT.

## 📁 Structure

```
CodeAlpha_EcommerceStore/
├── package.json
├── .env.example
├── backend/
│   ├── server.js
│   ├── seed.js              → peuple la base avec des produits de démo
│   ├── config/db.js
│   ├── models/ (Product.js, User.js, Order.js)
│   ├── middleware/auth.js   → JWT + vérification du rôle admin
│   └── routes/ (products.js, auth.js, orders.js)
└── frontend/
    ├── index.html            → accueil (hero, catégories, grille produits)
    ├── product.html          → détail produit + produits similaires
    ├── cart.html              → panier
    ├── login.html / register.html
    ├── checkout.html          → adresse de livraison + confirmation
    ├── images/                → tes vraies photos de produits (voir README dedans)
    ├── css/style.css
    └── js/ (common.js, main.js, product.js, cart.js, auth.js, checkout.js)
```

## ▶️ Installation

### 1. Créer une base MongoDB Atlas (gratuit, ~5 minutes)

1. Va sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) et crée un compte gratuit.
2. Crée un cluster **gratuit** (M0).
3. Dans **Database Access**, crée un utilisateur avec un mot de passe.
4. Dans **Network Access**, autorise ton IP (ou `0.0.0.0/0` pour autoriser tout accès — pratique pour un projet de démo).
5. Clique sur **Connect** → **Drivers** → copie l'URI de connexion, du style :
   ```
   mongodb+srv://<utilisateur>:<mot_de_passe>@cluster0.xxxxx.mongodb.net/codealpha-store
   ```

### 2. Configurer le projet

```bash
npm install
```

Copie `.env.example` en `.env` et remplis-le :

```env
PORT=5000
MONGODB_URI=mongodb+srv://ton-utilisateur:ton-mot-de-passe@cluster0.xxxxx.mongodb.net/codealpha-store
JWT_SECRET=une-longue-phrase-secrete-au-hasard
```

### 3. Ajouter tes vraies images de produits

Place tes photos dans `frontend/images/` — voir `frontend/images/README.md`
pour la liste exacte des noms de fichiers attendus.

### 4. Peupler la base de données

```bash
npm run seed
```

### 5. Lancer le serveur

```bash
npm run dev
```

Ouvre **http://localhost:5000**.

## ✅ Fonctionnalités

- Accueil avec hero, filtres par catégorie, recherche en direct
- Page détail produit avec sélecteur de quantité + produits similaires
- Panier persistant (`localStorage`) : ajout, quantité, suppression, sous-total
- Authentification complète (inscription / connexion) avec JWT + bcrypt
- Rôles utilisateur (`user` / `admin`) — les routes de gestion produits
  (créer/modifier/supprimer) sont protégées et réservées aux admins
- Commande complète avec adresse de livraison, vérification du stock,
  décrémentation automatique du stock après commande
- États de chargement, messages d'erreur, notifications, menu mobile responsive

## 🔌 Endpoints API

```
GET    /api/products              → liste (filtres ?category= & ?search=)
GET    /api/products/:id          → détail
POST   /api/products               → créer (admin)
PUT    /api/products/:id           → modifier (admin)
DELETE /api/products/:id           → supprimer (admin)

POST   /api/auth/register
POST   /api/auth/login

POST   /api/orders                 → passer commande (connecté)
GET    /api/orders                 → historique (connecté)
GET    /api/orders/:id             → détail commande (connecté)
```

## 👑 Créer un compte admin

Par défaut, tout nouveau compte a le rôle `user`. Pour tester les routes
admin (créer/modifier/supprimer un produit), va dans MongoDB Atlas → ta
base → collection `users` → ouvre ton utilisateur → change `role` de
`"user"` à `"admin"` manuellement, puis reconnecte-toi pour obtenir un
nouveau token avec ce rôle.
