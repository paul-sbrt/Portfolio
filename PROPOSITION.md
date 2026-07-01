# PROPOSITION — Refonte du portfolio de Paul Sabourault

> **Document de décision** (aucun code à ce stade).
> **Cadrage** : le portfolio est une **VITRINE de qui Paul EST** — un **builder polyvalent** qui **conçoit, développe et déploie de vrais produits** (mobile + web), avec **IA** et **Microsoft/Power Platform**, **à parité, sans hiérarchie artificielle**. Fil rouge : *« je construis de vrais trucs et j'apprends »*. **Ce n'est PAS un outil de candidature** : l'angle **produit / alternance est porté par le CV**, et n'apparaît ici que comme une **touche légère** (une ligne « en recherche d'alternance »), jamais un fil structurant. → On n'écrit **nulle part** « Product Manager ».
> **Zéro fabrication** : toute donnée manquante est notée `[[À COMPLÉTER]]` et listée en questions à la fin.

## Pool de projets (verrouillé)

- **Niveau 1 — VEDETTE (cas détaillés)** : DUMP · STOW · EXTRALIMO · Site solutions Microsoft.
- **Niveau 2 — SECONDAIRE (grille)** : les projets actuels du site (≈19, surtout des exercices dev).
- **Niveau 3** : lien GitHub (« voir plus »).
- **EXCLUS** : freelance Microsoft (IPMS, Experium, colvert…), TripIA (idée sans code).

---

## 1. POSITIONNEMENT

**Idée-force** : *un **builder polyvalent** qui **conçoit, développe ET déploie de vrais produits** — mobile et web — en mobilisant l'**IA** et l'écosystème **Microsoft/Power Platform**, et qui **apprend en construisant**.* Ce n'est pas un junior qui empile des exercices : les **4 projets vedette le prouvent déjà** — une app **publiée sur iOS et Android** (STOW), une app **TestFlight boostée à l'IA** avec un **vrai modèle freemium** (DUMP), une **plateforme web en ligne** (EXTRALIMO) et un **site de vente** d'une offre Microsoft chiffrée (paulsabourault.fr).

Le portfolio est une **vitrine de ce savoir-faire**, **pas une candidature** : il montre **ce que Paul fait et sait faire**, point.

Trois piliers **à parité** :
1. **Dev** — applications mobiles (Flutter, Swift/SwiftUI) et web (Laravel, Next.js, React, Symfony, WordPress), de la conception au déploiement.
2. **IA** — intégration de modèles dans de vrais produits (Claude, Whisper) via proxys/services (Cloudflare Workers).
3. **Microsoft & Power Platform** — Power Apps, Power BI, Power Automate, SharePoint ; 2 ans chez Avanade.

**Touche d'orientation (légère, pas un fil structurant)** : **une seule ligne** du type *« en recherche d'une alternance »*, posée discrètement (hero/about) — **pas plus**. L'angle produit/alternance est **détaillé dans le CV**, pas dans le portfolio. La **sensibilité produit se démontre** par la façon de raconter les projets (problème → pour qui → solution → résultat), **jamais par un titre** — on n'écrit pas « Product Manager ».

---

## 2. STRUCTURE DES SECTIONS (ordre)

1. **Hero** — nom + headline hybride (dev/IA/Microsoft) + **une ligne légère** « en recherche d'alternance » + CTA (Projets, CV, Contact).
2. **À propos** — parcours (origine **restauration** → reconversion → dev → Avanade/Microsoft), angle **builder polyvalent qui construit et apprend** (le cap produit reste une simple mention, non un thème).
3. **Expériences** — timeline pro (**Avanade** en tête ; restauration condensée en fin).
4. **Projets vedette** — 4 **cas détaillés** (DUMP, STOW, EXTRALIMO, Site Microsoft) au format problème → pour qui → solution → stack → résultat.
5. **Autres réalisations** — grille des projets du site (niveau 2), filtrable/condensée.
6. **Skills** — 3 groupes **à parité** : **Dev** · **IA** · **Microsoft & Power Platform** (pas de groupe « Produit » dédié — la sensibilité produit se lit dans les cas projet, pas dans un bloc de skills).
7. **Certifications** — PL-900 (+ PL-300 en préparation).
8. **Contact** — email + formulaire + LinkedIn/GitHub.

> Note SEO/robustesse : les cas vedette devront exister en **HTML statique** (pas seulement injectés en JS) — tranché au **Chantier 4** (rendu progressif + sort du Swiper).

---

## 3. CAS VEDETTE — gabarits pré-remplis

> Rempli au maximum depuis le code/READMEs observés. `[[À COMPLÉTER]]` = à confirmer par Paul (surtout impact chiffré).

### 3.1 DUMP — « deuxième cerveau » mobile augmenté par l'IA
> *Source : `Dump_Build_Plan.md` + `Dump/worker/README.md`.*
- **Problème** : on **capture une idée / note / vocal en vrac** mais on la **perd** ou on ne la **retrouve pas structurée**. DUMP est un **assistant cognitif** : l'utilisateur **parle ou écrit en vrac, et l'IA trie automatiquement** — le « deuxième cerveau » doit être crédible dès le jour 1.
- **Pour qui** : les gens qui **débordent d'idées en vrac** et veulent que ce soit **capturé, trié et rappelé**, avec des **suggestions de connexions** entre notes — un « second cerveau » pour **y voir plus clair**. Particulièrement utile pour **les profils qui se dispersent (TDAH inclus)** — mais présenté comme **outil d'organisation, jamais comme outil médical/thérapeutique**. **Angle authentique** : Paul l'a d'abord **construit pour lui-même**.
- **Solution** : app **iOS native** qui transforme un flux brut en notes triées :
  - **Capture texte + voix** ; **transcription Whisper** des vocaux.
  - **Classification IA (Claude)** en catégories **ACTION / INFO / IDÉE / VRAC** (+ **catégories custom** suggérées et apprises) et **niveaux d'urgence** (feu / important / secondaire / aucune).
  - **Suggestions de connexions** entre notes + **extraction d'entités** (personnes, lieux, dates → anonymisées avant envoi), **rappels/notifications** datés, **buffer d'impulsivité**, **apprentissage des corrections** de l'utilisateur.
  - Fonctions IA additionnelles côté proxy : **recherche** sémantique, **« brain »**, **nettoyage OCR**.
  - **Onboarding zéro friction** (pas de compte, pas d'email, app utilisable à la 1re seconde), **widgets** d'accueil et **extension de partage**.
- **Modèle éco** : **freemium / premium** — **gratuit jusqu'à 25 classifications IA / semaine**, **premium** déverrouillant l'illimité via **StoreKit 2** (achat in-app).
- **Stack** : Swift/SwiftUI · **SwiftData** (iOS 17+) · **Cloudflare Worker** (`dump-api-proxy`, clés IA côté serveur) · **Claude API** (Anthropic) · **OpenAI Whisper** · site testeurs PHP/MySQL (O2switch).
- **Résultat / statut** : **sur TestFlight** (build 2), projet le plus actif (503 commits, maj juin 2026), design system v2, widgets « production ready ». `[[À COMPLÉTER: nb de testeurs, retours, date de sortie App Store visée]]`
- **Visuels** : screenshots simulateur dispo. **Lien** : `[[À COMPLÉTER: lien TestFlight public ? page testeurs ?]]`

### 3.2 STOW — « le coffre-fort de vos voyages en groupe »
> *Source : site marketing `Stow Site Marketing/index.html`.*
- **Problème** : en **voyage de groupe**, les documents (billets, réservations, photos de passeport) sont **éparpillés dans WhatsApp** et **introuvables au mauvais moment** (« un PDF perdu entre un meme et un vocal de 4 minutes »), **sans accès hors ligne** à la douane / à l'arrivée. « **Voyagez serein** » = transformer le stress du départ en zénitude.
- **Pour qui** : **voyageurs en groupe** (bandes d'amis qui partent ensemble — chacun contribue ses documents).
- **Solution** : app mobile, **un coffre-fort de documents de voyage partagé** :
  - **Voyage partagé** : on crée un voyage, on **invite ses amis**, **chacun ajoute ses documents** (PDF, captures, photos de passeport).
  - **Accès hors ligne** : documents importants accessibles **même sans réseau** (douane, sous-sol d'aéroport…).
  - **Organisation** : chaque document a sa place (fini le mélange avec les memes du chat de groupe).
  - **Simplicité** : **login rapide Apple ou Google**, fichiers disponibles en deux clics.
- **Stack** : **Flutter/Dart** (FlutterFlow) · **Firebase/Firestore** · site marketing HTML/CSS/Tailwind/JS.
- **Modèle éco** : **gratuit** (site marketing : offre à 0 €).
- **Résultat / statut** : **publié sur iOS ET Android** — *« Stow — Voyagez serein »* (v1.2), disponible sur l'**App Store** et le **Google Play Store**. `[[À COMPLÉTER: nb téléchargements, note stores]]`
- **Visuels** : screenshots + pubs vidéo (IA). **Lien** : App Store `apps.apple.com/us/app/stow-voyagez-serein/id6758451337`.

### 3.3 EXTRALIMO — mise en relation à intermédiation humaine (hôtellerie-restauration)
> *Source : `EXTRALIMO/CLAUDE.md`.* — Slogan : **« On trouve, vous brillez. »**
- **Problème** : l'**hôtellerie-restauration** peine à trouver les bons **candidats / extras** ; les candidats manquent de visibilité. EXTRALIMO les relie — mais **ce n'est PAS un job board en libre-service** : la valeur, c'est l'**intermédiation humaine**, une petite équipe d'admins qui **sélectionne, propose et accompagne** (souvent depuis un simple coup de fil).
- **Pour qui** : **candidats** (extras / saisonniers HCR) **et entreprises** HCR (hôtels, restaurants, bars, traiteurs).
- **Solution** : plateforme web articulée autour de **3 rôles** (candidat / entreprise / admin) et d'un objet central, le **« match »** (statuts : *suggéré → en cours → contact débloqué → placé / abandonné*) :
  - **Confidentialité by design** : les coordonnées des deux parties **restent masquées** tant qu'un admin n'a pas passé le match en « contact débloqué » (avant : prénom + initiale côté candidat, nom commercial + ville côté entreprise).
  - **Matchs créés manuellement** par les admins (l'offre est **optionnelle** : un match peut naître d'un appel téléphonique), **placement selon le type de contrat et l'affinité de poste**, suivi du canal de contact et des notes, déblocage du contact, mise en relation.
  - Inscriptions publiques **mobile-first** (formulaires partagés sur Instagram), consentement **RGPD**.
- **Stack** : **Laravel** (LTS) + **Blade** + **MySQL/MariaDB**, auth **Laravel Breeze**, un peu d'**Alpine.js** · déploiement **O2switch** (assets compilés en local).
- **Modèle éco** : **commission au contrat** — un **pourcentage prélevé sur le placement** réalisé.
- **Équipe** : projet mené **avec ses associés** (petite équipe, pas un projet solo).
- **Résultat / statut** : **en ligne** → `extralimo.portfolio-sbrt.com` (52 commits, maj juin 2026). `[[À COMPLÉTER: nb d'inscrits, de mises en relation, retours terrain]]`
- **Atout récit** : son **vécu en restauration** (cuisinier, livreur…) rend ce produit crédible. **Lien** : `https://extralimo.portfolio-sbrt.com`.

### 3.4 Site solutions Microsoft — vitrine « Solutions IT sur mesure pour PME »
> *Source : `SITE SOLUTION MICROSOFT/` (`src/data/site.ts`, `solutions.ts`, `layout.tsx`).* — Positionnement : **« Solutions IT sur mesure pour PME »** (Paul Sabourault, **auto-entrepreneur**, Tours).
- **Problème** (3 angles affichés) : les PME ont des **outils Microsoft 365 sous-exploités** (la Power Platform est déjà dans leur licence), des **process manuels** (emails, Excel, relances) et **aucune visibilité** (pas de dashboard / KPI).
- **Pour qui** : **dirigeants / PME** qui veulent digitaliser des process (apps métier, automatisations, dashboards) **sans nouvel outil à apprendre**.
- **Solution** : **site vitrine orienté vente** d'une offre **Power Platform**, avec prise de contact (**Formspree**). **Offre phare mise en avant : « Ticketing IT »** — *« Votre support IT, simplifié »* : système de ticketing **intégré à Microsoft 365** (portail utilisateur en 30 s, dashboard admin, **SLA temps réel**, notifications **email + Teams**, **reporting Power BI**, gestion **multi-clients**, rôles, pièces jointes). **Déployé en ½ journée, formation incluse.**
  - **2 packs** : **Pack Essentiel à 2 000 €** · **Pack Complet à 3 500 €** (recommandé, +Power BI 4 pages + multi-clients). **Investissement unique, pas d'abonnement** ; maintenance **optionnelle dès 39 €/mois**. Données hébergées **chez le client (SharePoint, France)**.
  - **Process** affiché : Échange → Démo → Déploiement → Formation. Autres solutions = emplacements *« coming soon »* (seul **Ticketing IT** est `available`).
- **Stack** : **Next.js 14** (App Router, TS) · **Tailwind** · Framer Motion · **Formspree**. Brique métier vendue = **SharePoint, Power Apps, Power Automate, Power BI, Teams**.
- **Résultat / statut** : **en ligne**, URL de prod confirmée dans le code (`layout.tsx` / `sitemap.ts` / `robots.ts`). `[[À COMPLÉTER: leads / clients générés — non présents dans le repo]]`
- **Lien** : **`https://paulsabourault.fr`**.

---

## 4. HEADLINE + ABOUT (2 variantes chacun)

> Esprit : le **savoir-faire en vitrine** d'abord ; le mot « alternance » apparaît **une seule fois**, en sous-ligne discrète. Aucune des variantes n'écrit « Product Manager ».

### Headlines (hero)
**Variante A — orientée preuve/action**
> **Je conçois, développe et déploie de vrais produits — mobile, web, IA et Microsoft.**
> *Builder polyvalent qui construit et apprend · en recherche d'alternance*

**Variante B — orientée hybride/positionnement**
> **Du besoin métier à l'app livrée — mobile, web, IA & Power Platform.**
> *Je construis de vrais trucs et j'apprends · ouvert à une alternance*

### About (2 variantes)
**Variante A — concise**
> Développeur passé par une **reconversion** (CEFIM, CDA & DWWM) puis **2 ans d'alternance chez Avanade** sur les technologies **Microsoft / Power Platform**. Je conçois et **déploie de vrais produits, de A à Z** : une app de voyage **publiée sur iOS et Android** (STOW, le coffre-fort des voyages en groupe), un « deuxième cerveau » **iOS boosté à l'IA** avec un modèle **freemium** (DUMP — Claude + Whisper), une **plateforme de mise en relation à intermédiation humaine** pour l'hôtellerie-restauration (EXTRALIMO), un **site de vente** d'une offre Microsoft chiffrée (Ticketing IT, dès 2 000 €). Mon truc : partir d'un **problème concret** et aller **jusqu'à la mise en ligne** — et apprendre une techno de plus à chaque projet. *En recherche d'alternance.*

**Variante B — narrative**
> Je viens de la **restauration**, et c'est en voulant **résoudre des problèmes réels** que je suis devenu développeur. Depuis, je construis des produits de bout en bout : **mobile** (Flutter, Swift/SwiftUI), **web** (Laravel, Next.js, React) et **Microsoft/Power Platform**, en intégrant de l'**IA** quand elle apporte vraiment de la valeur (DUMP : transcription Whisper + classification Claude). Mon fil rouge : **comprendre l'utilisateur, livrer, itérer — et apprendre en construisant**. Après **2 ans chez Avanade**, je continue à empiler les vrais projets. *Ouvert à une alternance.*

> Les deux variantes restent factuelles ; aucun chiffre inventé. **Aucun détail d'alternance sur le portfolio** (rythme/dates/secteur = affaire du **CV**) — juste la ligne « en recherche d'alternance ».

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

## QUESTIONS À COMPLÉTER — à demander à Paul

> Après extraction du contenu factuel des repos (DUMP, STOW, EXTRALIMO, site Microsoft), voici **tout ce qui reste introuvable dans le code/docs** et qu'il faut demander à Paul. Tout le reste des fiches ci-dessus est sourcé du repo correspondant.

> Mis à jour avec les infos fournies par Paul. Ne restent que les **preuves chiffrées** (introuvables dans le code) et 2 choix éditoriaux.

**DUMP**
- **Chiffres & preuves** : nb de testeurs TestFlight, retours, **date de sortie App Store** visée.
- **Lien public** : lien TestFlight public et/ou page testeurs à afficher ?

**STOW**
- **Chiffres** : nb de téléchargements, notes App Store / Google Play.

**EXTRALIMO**
- **Chiffres** : nb d'inscrits (talents + entreprises), nb de placements, retours terrain.

**Site solutions Microsoft**
- **Traction commerciale** : leads / clients générés — non présents dans le repo.

**Éditorial**
- Choix des **variantes** headline (A/B) et about (A/B).
- **Skills IA / Mobile à ajouter** (Flutter, Swift/SwiftUI, intégration LLM/Claude, Whisper…) + niveaux.

> **Résolu cette session** (plus de question) : cible DUMP · STOW iOS+Android · modèle éco EXTRALIMO (commission au contrat) · Acteo retiré des XP · alternance = portée par le CV · origine restauration confirmée (touche légère).
