# PROPOSITION — Refonte du portfolio de Paul Sabourault

> **Document de décision** (aucun code à ce stade).
> **Cadrage** : la base est **ce que Paul EST aujourd'hui — développeur (mobile + web), IA, technologies Microsoft/Power Platform**, présenté **à parité, sans hiérarchie artificielle**. Le **Product Management est un OBJECTIF** (recherche d'**alternance produit**), affiché comme une **direction assumée**, **jamais comme un titre acquis**. → On n'écrit nulle part « Product Manager ».
> **Zéro fabrication** : toute donnée manquante est notée `[[À COMPLÉTER]]` et listée en questions à la fin.

## Pool de projets (verrouillé)

- **Niveau 1 — VEDETTE (cas détaillés)** : DUMP · STOW · EXTRALIMO · Site solutions Microsoft.
- **Niveau 2 — SECONDAIRE (grille)** : les projets actuels du site (≈19, surtout des exercices dev).
- **Niveau 3** : lien GitHub (« voir plus »).
- **EXCLUS** : freelance Microsoft (IPMS, Experium, colvert…), TripIA (idée sans code).

---

## 1. POSITIONNEMENT

**Idée-force** : *un profil qui **conçoit, développe ET déploie de vraies applications** — mobile et web — en mobilisant l'**IA** et l'écosystème **Microsoft/Power Platform**.* Ce n'est pas un junior qui empile des exercices : les **4 projets vedette le prouvent déjà** (une app sur l'App Store, une app sur TestFlight avec IA, deux apps web en production).

Trois piliers **à parité** :
1. **Dev** — applications mobiles (Flutter, Swift/SwiftUI) et web (Laravel, Next.js, React, Symfony, WordPress), de la conception au déploiement.
2. **IA** — intégration de modèles dans de vrais produits (Claude, Whisper) via proxys/services (Cloudflare Workers).
3. **Microsoft & Power Platform** — Power Apps, Power BI, Power Automate, SharePoint ; 2 ans chez Avanade + freelance.

**Couche d'orientation (direction, pas titre)** : une ligne assumée du type *« En route vers le produit — en recherche d'une alternance en Product Management »*, posée dans le hero et rappelée dans l'About. La **sensibilité produit se démontre** par la façon de raconter les projets (problème → pour qui → solution → résultat), **pas** par un titre.

---

## 2. STRUCTURE DES SECTIONS (ordre)

1. **Hero** — nom + headline hybride (dev/IA/Microsoft) + ligne « cap produit / alternance » + CTA (Projets, CV, Contact).
2. **À propos** — parcours (reconversion → dev → Avanade/Microsoft → freelance), angle hybride + objectif produit.
3. **Expériences** — timeline pro (Acteo, Avanade en tête ; restauration condensée en fin).
4. **Projets vedette** — 4 **cas détaillés** (DUMP, STOW, EXTRALIMO, Site Microsoft) au format problème → pour qui → solution → stack → résultat.
5. **Autres réalisations** — grille des projets du site (niveau 2), filtrable/condensée.
6. **Skills** — 4 groupes **à parité** : **Dev** · **IA** · **Microsoft & Power Platform** · **Produit**.
7. **Certifications** — PL-900 (+ PL-300 en préparation).
8. **Contact** — email + formulaire + LinkedIn/GitHub.

> Note SEO/robustesse : les cas vedette devront exister en **HTML statique** (pas seulement injectés en JS) — tranché au **Chantier 4** (rendu progressif + sort du Swiper).

---

## 3. CAS VEDETTE — gabarits pré-remplis

> Rempli au maximum depuis le code/READMEs observés. `[[À COMPLÉTER]]` = à confirmer par Paul (surtout impact chiffré).

### 3.1 DUMP — « deuxième cerveau » mobile augmenté par l'IA
> *Source : `Dump_Build_Plan.md` + `Dump/worker/README.md`.*
- **Problème** : on **capture une idée / note / vocal en vrac** mais on la **perd** ou on ne la **retrouve pas structurée**. DUMP est un **assistant cognitif** : l'utilisateur **parle ou écrit en vrac, et l'IA trie automatiquement** — le « deuxième cerveau » doit être crédible dès le jour 1.
- **Pour qui** : `[[À COMPLÉTER: cible/persona non précisée dans la doc produit — toi d'abord ? étudiants ? créatifs ? pro débordés ?]]`
- **Solution** : app **iOS native** qui transforme un flux brut en notes triées :
  - **Capture texte + voix** ; **transcription Whisper** des vocaux.
  - **Classification IA (Claude)** en catégories **ACTION / INFO / IDÉE / VRAC** (+ **catégories custom** suggérées et apprises) et **niveaux d'urgence** (feu / important / secondaire / aucune).
  - **Extraction d'entités** (personnes, lieux, dates → anonymisées avant envoi), **rappels/notifications** datés, **buffer d'impulsivité**, **apprentissage des corrections** de l'utilisateur.
  - Fonctions IA additionnelles côté proxy : **recherche** sémantique, **« brain »**, **nettoyage OCR**.
  - **Onboarding zéro friction** (pas de compte, pas d'email, app utilisable à la 1re seconde), **widgets** d'accueil et **extension de partage**.
- **Modèle éco** : **freemium / premium** — **gratuit jusqu'à 25 classifications IA / semaine**, **premium** déverrouillant l'illimité via **StoreKit 2** (achat in-app).
- **Stack** : Swift/SwiftUI · **SwiftData** (iOS 17+) · **Cloudflare Worker** (`dump-api-proxy`, clés IA côté serveur) · **Claude API** (Anthropic) · **OpenAI Whisper** · site testeurs PHP/MySQL (O2switch).
- **Résultat / statut** : **sur TestFlight** (build 2), projet le plus actif (503 commits, maj juin 2026), design system v2, widgets « production ready ». `[[À COMPLÉTER: nb de testeurs, retours, date de sortie App Store visée]]`
- **Visuels** : screenshots simulateur dispo. **Lien** : `[[À COMPLÉTER: lien TestFlight public ? page testeurs ?]]`

### 3.2 STOW — app de voyage publiée
- **Problème** : `[[À COMPLÉTER: le pain point voyageur exact — “voyagez serein” = quoi concrètement ? organisation ? stress ? checklist ?]]`
- **Pour qui** : voyageurs (grand public). `[[À COMPLÉTER: segment précis]]`
- **Solution** : app **mobile multiplateforme** (iOS/Android) avec backend temps réel. `[[À COMPLÉTER: 2-3 fonctionnalités phares]]`
- **Stack** : **Flutter/Dart** (FlutterFlow) · **Firebase/Firestore** · site marketing HTML/CSS/JS.
- **Résultat / statut** : **publié sur l'App Store** — *« Stow — Voyagez serein »* (v1.2). `[[À COMPLÉTER: nb téléchargements, note, dispo Android ?]]`
- **Visuels** : screenshots + pubs vidéo (IA). **Lien** : App Store `apps.apple.com/us/app/stow-voyagez-serein/id6758451337`.

### 3.3 EXTRALIMO — marketplace de mise en relation (restauration)
- **Problème** : la restauration/hôtellerie peine à trouver des **extras** rapidement ; les candidats manquent de visibilité. Mise en relation avec **intermédiation humaine**.
- **Pour qui** : établissements HCR **et** candidats (extras/saisonniers).
- **Solution** : plateforme web — profils, recherche, **déblocage de contact / « mise en relation »**, intermédiation humaine. `[[À COMPLÉTER: modèle éco — gratuit ? commission ? abonnement ?]]`
- **Stack** : **Laravel + Blade + MySQL** (PHP) · déploiement O2switch (assets compilés en local).
- **Résultat / statut** : **en ligne** → `extralimo.portfolio-sbrt.com` (52 commits, maj juin 2026). `[[À COMPLÉTER: nb d'inscrits, de mises en relation, retours terrain]]`
- **Atout récit** : ton **vécu en restauration** (cuisinier, livreur…) rend ce produit crédible. **Lien** : `https://extralimo.portfolio-sbrt.com`.

### 3.4 Site solutions Microsoft — vitrine orientée vente
- **Problème** : les **PME** ont besoin de solutions sur mesure (Power Platform) mais manquent d'une offre lisible et d'un interlocuteur.
- **Pour qui** : dirigeants/PME cherchant à digitaliser des process (apps métier, dashboards, automatisations).
- **Solution** : **site vitrine orienté vente** présentant l'offre Power Platform + prise de contact (Formspree). `[[À COMPLÉTER: pages/offres clés mises en avant]]`
- **Stack** : **Next.js 14** (App Router, TS) · **Tailwind** · Framer Motion.
- **Résultat / statut** : `[[À COMPLÉTER: réellement en ligne sur paulsabourault.fr ? leads générés ?]]`
- **Lien** : `[[À COMPLÉTER: URL de prod confirmée]]`.

---

## 4. HEADLINE + ABOUT (2 variantes chacun)

### Headlines (hero)
**Variante A — orientée preuve/action**
> **Je conçois, développe et déploie de vraies applications — mobile, web, IA et Microsoft.**
> *Développeur en route vers le produit · en recherche d'une alternance Product `[[À COMPLÉTER: rythme + dates de l'alternance]]`*

**Variante B — orientée hybride/positionnement**
> **Développeur applicatif & Power Platform — du besoin métier à l'app livrée (iOS, web, IA).**
> *Cap sur le Product Management · ouvert à une alternance `[[À COMPLÉTER: dates / type d'entreprise visée]]`*

### About (2 variantes)
**Variante A — concise**
> Développeur passé par une **reconversion** (CEFIM, CDA & DWWM) puis **2 ans d'alternance chez Avanade** sur les technologies **Microsoft / Power Platform**, aujourd'hui **freelance** (Acteo). Je conçois et **déploie de vrais produits** : une app de voyage **publiée sur l'App Store** (STOW), un « second cerveau » **iOS boosté à l'IA** (DUMP, Claude + Whisper), une **marketplace** pour la restauration (EXTRALIMO), un **site de vente** de solutions Microsoft. J'aime partir d'un **problème concret** et aller jusqu'à la mise en ligne — c'est ce qui me pousse aujourd'hui **vers le produit**, et je cherche une **alternance en Product Management** `[[À COMPLÉTER: rythme/dates/secteur visé]]`.

**Variante B — narrative**
> Je viens de la **restauration**, et c'est en voulant **résoudre des problèmes réels** que je suis devenu développeur. Depuis, je construis des applis de bout en bout : **mobile** (Flutter, Swift/SwiftUI), **web** (Laravel, Next.js, React) et **Microsoft/Power Platform**, en intégrant de l'**IA** quand elle apporte vraiment de la valeur. Mon fil rouge : **comprendre l'utilisateur, livrer, itérer**. Après **2 ans chez Avanade** et une activité **freelance**, je veux pousser cette **logique produit** plus loin et vise une **alternance en Product Management** `[[À COMPLÉTER: détails de l'alternance]]`.

> Les deux variantes restent factuelles ; aucun chiffre inventé. `[[À COMPLÉTER]]` = angle produit précis + détails alternance.

---

## 5. SCHÉMA `projects.json` ENRICHI

Objectif : enrichir **sans casser** le rendu actuel. Le `display.js` du Swiper ne lit que `title`, `image`, `description`, `link` → on **garde ces 4 clés** (rétrocompatibilité), et on **ajoute** des champs **optionnels**. Le sort du Swiper sera tranché au **Chantier 4**.

```jsonc
{
  "title": "DUMP",
  "image": "./images/dump.webp",
  "link": "https://...",                 // existant (Swiper)
  "description": "Second cerveau iOS ...", // existant (Swiper) — résumé court

  // --- nouveaux champs (optionnels, ignorés par l'ancien Swiper) ---
  "featured": true,                       // true = cas vedette (niveau 1)
  "category": "ia",                       // "mobile" | "web" | "ia" | "microsoft" | "exercice"
  "stack": ["Swift", "SwiftUI", "Claude API", "Whisper", "Cloudflare"],
  "problem": "Capturer une idée avant de la perdre, puis la retrouver structurée.",
  "role": "Conception, dev iOS, intégration IA, déploiement TestFlight",
  "result": "[[À COMPLÉTER: testeurs / retours]]",
  "status": "TestFlight",                 // "App Store" | "En ligne" | "TestFlight" | "Démo"
  "year": 2026
}
```

**Règles** :
- `featured: true` → rendu en **cas détaillé** (section 4 de la page) ; `false`/absent → grille « autres réalisations ».
- `category` permet le **filtrage** (Dev / IA / Microsoft) et alimente la parité des skills.
- Un projet **sans** les nouveaux champs continue de s'afficher comme avant → **migration progressive possible** (on enrichit d'abord les 4 vedette).
- Les cas vedette pourront être **sortis** du carrousel pour éviter le doublon (décision Chantier 4).

---

## QUESTIONS À COMPLÉTER (récap)

Voir la liste numérotée renvoyée dans le chat. Chaque `[[À COMPLÉTER]]` ci-dessus y correspond.
