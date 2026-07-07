# RAF'YAM — Site e-commerce luxe

Site e-commerce complet pour la maison **RAF'YAM**, boutique de chaussures de luxe pour hommes à Ouagadougou, Burkina Faso.

> Stack : Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · Prisma · SQLite · Framer Motion · Zustand · Stripe ready · Mobile Money ready.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
# Éditer .env et remplir JWT_SECRET (32+ caractères aléatoires)

# 3. Initialiser la base de données + données démo
npx prisma db push
npm run db:seed

# 4. Lancer en développement
npm run dev
```

Le site est accessible sur **http://localhost:3000**.

### Comptes de démo

| Rôle    | Email                | Mot de passe |
|---------|----------------------|--------------|
| Admin   | admin@rafyam.bf      | Admin1234!   |
| Client  | client@rafyam.bf     | Client1234!  |

---

## 📦 Déploiement sur Vercel

1. **Push** le dépôt sur GitHub.
2. Sur **Vercel**, importer le projet.
3. Configurer les variables d'environnement (voir `.env.example`).
4. Pour la **production**, remplacer SQLite par **Postgres** :
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/rafyam"
   ```
5. Lancer `prisma db push` puis le seed sur la prod (ou utiliser un script d'import).
6. **Domaine custom** : ajouter `rafyam.bf` dans Vercel → Domains.

---

## 🗂️ Structure du projet

```
rafyam/
├── prisma/
│   ├── schema.prisma        # Modèles : User, Product, Order, Review, Blog, etc.
│   └── seed.ts              # Données démo (12 produits, 7 catégories, etc.)
├── public/
│   ├── favicon.svg
│   ├── og-image.svg
│   └── robots.txt
├── src/
│   ├── app/                 # App Router Next.js 15
│   │   ├── page.tsx                 # Accueil
│   │   ├── layout.tsx               # Layout racine + JSON-LD
│   │   ├── globals.css              # Design system (Tailwind)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── boutique/                # Catalogue + filtres
│   │   ├── produit/[slug]/          # Fiche produit (galerie, zoom, avis)
│   │   ├── panier/
│   │   ├── commande/                # Tunnel 3 étapes
│   │   ├── commande/confirmation/
│   │   ├── compte/                  # Auth + espace client
│   │   ├── admin/                   # Back-office
│   │   ├── a-propos/  contact/  faq/  blog/  cgv/  mentions-legales/
│   │   ├── politique-confidentialite/  livraison/  guide-des-tailles/  entretien/
│   │   ├── categories/  nouveautes/  meilleures-ventes/  promotions/
│   │   └── api/                     # Routes API
│   │       ├── auth/         # login, register, logout, forgot
│   │       ├── account/      # profil
│   │       ├── orders/       # création de commande
│   │       ├── search/       # recherche instantanée
│   │       ├── reviews/
│   │       ├── newsletter/
│   │       ├── contact/
│   │       └── admin/        # produits + promos
│   ├── components/
│   │   ├── layout/    Header, Footer, WhatsAppFloat, ThemeProvider
│   │   ├── product/   ProductCard, ProductGallery, ProductInfo, ProductFilters, ReviewsList
│   │   ├── cart/      CartDrawer, CartFull, CheckoutClient
│   │   ├── account/   AuthForm, ProfileForm
│   │   ├── admin/     ProductForm, PromoManager
│   │   ├── marketing/ Newsletter, ContactForm, FAQAccordion
│   │   └── seo/       JsonLd
│   └── lib/
│       ├── prisma.ts    # Client Prisma
│       ├── auth.ts      # JWT + bcrypt + cookies
│       ├── cart.ts      # Store Zustand persisté
│       ├── favorites.ts # Store Zustand persisté
│       ├── site.ts      # Constantes du site
│       ├── clsx.ts      # cn() utilitaire
│       └── utils.ts
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🎨 Design system

Couleurs (Tailwind `theme.extend.colors`) :
- `ink` — noirs profonds (`ink-950` = `#0b0b0e`)
- `bone` — blancs cassés (`bone-50` = `#fbfaf7`)
- `gold` — palette or (`gold-500` = `#cf9f43`)
- `anthracite` — gris secondaires
- `leather` — bruns cuir

Typographies (Google Fonts via `next/font`) :
- **Playfair Display** — titres (display)
- **Inter** — corps
- **JetBrains Mono** — références

Effets signature :
- Verre dépoli (`backdrop-filter`) sur header & drawers
- Gradient or pour CTAs
- Animations Framer Motion (fade-up, hover)
- Grain SVG en bruit de fond

---

## ✨ Fonctionnalités

### Boutique
- ✅ Catalogue avec 12 produits démo
- ✅ Filtres : catégorie, marque, prix, pointure
- ✅ Tri : récent, prix asc/desc, note
- ✅ Recherche instantanée (header)
- ✅ Pagination
- ✅ Pages dédiées : Nouveautés, Meilleures ventes, Promotions

### Produit
- ✅ Galerie HD avec zoom à la souris
- ✅ Sélecteur couleur + pointure
- ✅ Stock par variante
- ✅ Description détaillée + caractéristiques
- ✅ Guide des tailles
- ✅ Avis vérifiés + soumission
- ✅ Produits similaires

### Panier & commande
- ✅ Panier persistant (Zustand + localStorage)
- ✅ Drawer accessible depuis toutes les pages
- ✅ Tunnel 3 étapes : contact, livraison, paiement
- ✅ 6 modes de paiement : COD, Orange Money, Moov Money, Wave, Visa, Mastercard
- ✅ Confirmation de commande + email

### Espace client
- ✅ Inscription / Connexion / Mot de passe oublié
- ✅ Commandes avec suivi
- ✅ Favoris
- ✅ Adresses
- ✅ Profil éditable

### Back-office admin
- ✅ Tableau de bord (CA, stats, dernières commandes, stocks faibles)
- ✅ Gestion produits (CRUD complet)
- ✅ Gestion commandes + filtres statut
- ✅ Gestion clients
- ✅ Gestion codes promo
- ✅ Statistiques (CA, top produits, stock, note moyenne)
- ✅ Paramètres

### SEO & Performance
- ✅ Metadata dynamique (title, description, OG)
- ✅ JSON-LD Schema.org (Store, Product, BreadcrumbList)
- ✅ Sitemap.xml automatique
- ✅ robots.txt
- ✅ Lazy loading des images
- ✅ next/image pour optimisation
- ✅ Headers de sécurité (HSTS, CSP, X-Frame-Options)
- ✅ Compression activée
- ✅ Polices en `display: swap`

### Accessibilité (WCAG 2.2)
- ✅ Navigation clavier complète
- ✅ `aria-*` sur tous les composants interactifs
- ✅ Focus visible
- ✅ Skip-link "Aller au contenu"
- ✅ Contrastes AA minimum
- ✅ Landmarks ARIA

### Paiements
- ✅ **COD** (Paiement à la livraison) — fonctionnel par défaut
- 🟡 **Stripe** (Visa/MC) — structure prête, à connecter (`STRIPE_SECRET_KEY`)
- 🟡 **Orange Money** — structure prête (`.env` à compléter)
- 🟡 **Moov Money** — structure prête (`.env` à compléter)
- 🟡 **Wave** — structure prête (`.env` à compléter)

---

## 🖼️ Remplacement des visuels

Tous les visuels proviennent d'**Unsplash** (libres de droits). Pour passer à vos propres photos :

1. Ajouter vos images dans `public/images/produits/`
2. Mettre à jour `prisma/seed.ts` → champ `images` de chaque produit
3. Relancer `npm run db:seed`
4. Pour un produit déjà en base : via `/admin/produits/[id]` → section Images

Visuels à remplacer en priorité :
- Hero accueil
- Photos produits (galeries)
- Bannières éditoriales
- Photos d'ambiance boutique

---

## 🔐 Sécurité

- Mots de passe hashés bcrypt (cost 10)
- Sessions JWT signées (jose) avec expiration 7j
- Cookie httpOnly + secure en prod
- Headers sécurité (HSTS, X-Frame-Options, X-Content-Type-Options)
- Validation Zod sur toutes les routes API
- Pas de stockage de données bancaires (délégué à Stripe / opérateurs MM)

---

## 🌍 Internationalisation

Le site est livré en **français**. Pour ajouter une langue :
1. Créer `src/dictionaries/en.json`, `fr.json`, etc.
2. Wrapper le contenu avec un Context i18n
3. Adapter les routes si nécessaire

---

## 📞 Contact

- **Boutique** : derrière le siège de SIDWAYA, Ouagadougou
- **Téléphone** : +226 57 95 50 90
- **WhatsApp** : +226 57 95 50 90
- **Email** : contact@rafyam.bf

---

## 📝 Licence

Code propriétaire — © 2026 RAF'YAM. Tous droits réservés.// test webhook
