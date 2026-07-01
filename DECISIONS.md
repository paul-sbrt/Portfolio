# DECISIONS.md — Refonte du portfolio Paul Sabourault

> **Source de vérité** des décisions de refonte. À lire en début de chaque session.
> Dernière mise à jour : **2026-06-30**.
>
> **Légende** : 🔒 **FIGÉ** (décidé, ne pas rediscuter sans raison) · ⏳ **EN ATTENTE** (à trancher / à fournir par Paul).
>
> **Règle de travail** : *audit avant chaque chantier · décision actée sur ce doc avant tout code.*
>
> **Ordre des chantiers** : 0 (✅ fait) → 1 (décidé) → 2 (décidé) → 3 (décidé) → **4 implémentation** → **5 déploiement** O2switch (`portfolio-sbrt.com`).

---

## Changelog

- **2026-07-01** — **Tri de contenu (skills / expériences / studies) appliqué** sur `refonte`, 4 commits atomiques (aucune vraie compétence retirée — on range ; la hiérarchisation fine phares/détail = passe design). **Expériences** : ajout **IPMS — Lead SI** (Freelance, depuis avril 2026, actuel, description générique : refonte back-office, tableaux de bord, gestion de projets) en tête ; **Avanade** 2e ; **cluster resto/jobs condensé** en une ligne « Parcours restauration & jobs étudiants — 2019-2023 » ; **Acteo retiré définitivement** (il traînait encore dans `experience.json`). `displayExperience` : image + description optionnelles (carte block lisible provisoire). **Skills** : **HTML+CSS → « HTML/CSS »**, **Cloudflare Workers** IA→Web, nouveau groupe **« Design & Outils »** (Figma + Photoshop) ; **tout le reste gardé** (WordPress, Symfony, Excel, JS, PHP, SQL…) ; niveaux déjà retirés. **Studies** : **2 CEFIM fusionnés** en « CEFIM — CDA & DWWM » (2023-2025) en tête ; Kaplan / CAP cuisine / Bac S en mentions secondaires. Design & bilingue non touchés.
- **2026-07-01** — **Chantier 4 — CONTENU ÉDITORIAL final intégré** sur `refonte`, 3 commits atomiques. **Hero** : nouvelle headline dans la voix de Paul (« J'aime construire, penser, et donner vie à mes idées. » + sous-ligne « Développeur — solo comme en entreprise… l'IA pour aller plus loin »). **About** : variante narrative B (origine restauration → dev pour résoudre des problèmes réels → 4 projets réels STOW/DUMP/EXTRALIMO/Ticketing IT), titre « À propos », clôture par une **ligne discrète « En recherche d'une alternance. »** (jamais « Product Manager »). **Skills** : restructurés en **4 groupes à parité** (Mobile · Web · IA · Microsoft & Power Platform), **niveaux Intermediate/Basic retirés**, ajout des skills IA/Mobile manquants (Flutter/Dart, Swift/SwiftUI, Firebase, Laravel, Next.js, LLM/Claude, Whisper, Cloudflare Workers) ; icône optionnelle (skills sans visuel = puce texte). ⚠️ **Icônes manquantes** pour les 8 nouveaux skills + placements à confirmer (Figma/Photoshop→Web, Python→IA, Excel/Azure DevOps→Microsoft). Design/visuels = passe suivante.
- **2026-07-01** — **Feuille de route DESIGN consignée** (nouvelle section sous le Chantier 3, ⏳ EN ATTENTE — à traiter à la passe visuelle, rien implémenté). 9 pistes : affiner **palette light** ; **charte par projet vedette** (ambiance produit dans le cadre constant du portfolio → extension `--hat` vers une couleur **par projet**, futur champ `brand{}`) ; **alléger le layout** des pages détail (encore le contenu migré des ex-pages MS) ; **galerie** à revoir ; **header** (garder scroll, changer la photo = celle de l'about) ; **purge CSS `ms-*` orphelin** ; **harmoniser boutons/cartes** ; **desktop atypique** (anim scroll/hover, mobile clean — skill `frontend-design`) ; **couleurs de casquette** accordées à la DA (fil chromatique discret carte→filtre→page).
- **2026-07-01** — **Chantier 4 — CONTENU (partie B) — projets** implémenté sur `refonte`, 2 commits. **4 vedette créées** dans `projects.json` (`featured:true`, contenu 100 % sourcé de `PROPOSITION.md`, zéro invention) : **DUMP** `hats:[App,IA]` · **STOW** `hats:[App]` · **EXTRALIMO** `hats:[Web]` · **Site solutions Microsoft** `hats:[Microsoft]` — summary, `tags[]` (stack), `type`, `detail{impact,status,links}`, `externalUrl` réels ; pages détail générées. **19 projets web classés** `hats:[Web]` (factuel : WordPress/React/Symfony/HTML-CSS-JS), restent `featured:false`. Template enrichi : **boutons live-link** (masqués si URL `[[À COMPLÉTER]]`) + **galerie optionnelle** (masquée si pas de visuels). Filtres grille désormais : **All / App / IA / Web / Microsoft**. ⚠️ **Visuels manquants** (cover + galerie des 4 vedette) = `placeholder.svg` en attendant les screenshots réels. ⏳ Restent : **preuves chiffrées** (testeurs DUMP, téléchargements STOW, inscrits EXTRALIMO, leads MS), **lien Google Play STOW**, **lien TestFlight public DUMP**, et les **choix éditoriaux** (headline/about, skills) — non traités volontairement.
- **2026-07-01** — **Chantier 4 — PLOMBERIE (partie A) implémentée** sur `refonte`, 6 commits atomiques. **Schéma unifié** : `projects.json` unique (superset `slug`, `image`, `images[]`, `summary`, `hats[]`, `tags[]`, `type`, `year`, `featured`, `externalUrl` XOR `detail{impact,status,video,gallery}`, `openInSameTab`) ; 19 projets plats + 3 sous-cas Microsoft migrés ; `ms-projects.json` supprimé. **Moteur unique** : `display.js` (createElement, pas d'`innerHTML` non échappé) ; `microsoft-page.js` et le **hub `power-platform.html` supprimés** (fondu dans la grille) ; helper certif factorisé ; `lightbox.js` réécrit en config générique. **Template détail** : `build_detail.py` génère 1 HTML/projet `featured` sous `projects/<slug>.html` (hero + galerie variable + vidéo optionnelle + CTA + `<title>`/OG/canonical corrects) ; les 3 pages MS migrées ; préfixes CSS `suez-/mscd-/vg-` collapsés en `detail-` ; **teinte par casquette** (`--hat`/`--hat-text` via `[data-hat]`). **Grille filtrable** (filtres = `hats[]`) remplace le Swiper (dépendance retirée). **301** `.htaccess` + **sitemap** repointé vers `/projects/`. ⏳ Reste : **partie B** (contenu vedette, `hats[]` des 19, choix éditoriaux) et un peu de **CSS `ms-*` orphelin** (kpi/card/cert du hub) non bloquant. Rendu local servi pour validation.
- **2026-07-01** — **Fiches projets `PROPOSITION.md` mises à jour** avec les infos réelles de Paul. Décisions actées : **Acteo retiré** des expériences (mission d'1 j, trop faible) ; **détails d'alternance = CV uniquement** (portfolio garde une seule ligne « en recherche d'alternance ») ; **origine restauration** = touche légère dans l'about. Fiches : **DUMP** cible = personnes débordant d'idées en vrac / qui se dispersent (TDAH inclus) — cadré **outil d'organisation, pas médical** ; angle « construit pour lui-même » ; **STOW** = **iOS + Android** (corrigé) ; **EXTRALIMO** = **commission au contrat** (%), placement selon contrat + affinité, fait avec ses associés. Restent en attente : quelques **chiffres/preuves** + 2 choix éditoriaux (variantes headline/about, skills IA/Mobile).
- **2026-06-30** — **Chantier 4 (design — fondations) implémenté** sur `refonte`, 6 commits atomiques : nettoyage (code mort, `clip-path`) · **tokenisation** CSS (couleurs/espacements/radius en `:root`) · **Poppins** importée + **échelle typo** + hiérarchie `h1>h2` · **Dark/Light** + **toggle header** (mémorisé, no-flash, `prefers-color-scheme`) · marges fragiles corrigées · fix visibilité/placement du toggle + contrastes light. ⏳ **Palette du mode light à affiner plus tard** (jugée « pas optimale » niveau couleurs — reportée, non bloquante). Hors-périmètre (contenu, fusion JSON, template détail, responsive complet) non touché.
- **2026-06-30** — **Recentrage de positionnement.** Le portfolio est acté comme une **VITRINE de qui Paul est** (builder polyvalent qui construit / cherche / apprend), **pas un outil de candidature** : l'angle Product/alternance est désormais **porté par le CV**. Le **cap produit** rétrograde de *thème transverse structurant* à **simple touche légère** (une ligne « en recherche d'alternance », pas plus) ; récit central = **polyvalence + « je construis de vrais trucs et j'apprends »**. Reste des décisions **inchangé** (multi-pages, `hats[]`, data-driven…). **Nouvelle décision design** (Chantier 3) : direction visuelle **soignée et atypique**, **desktop travaillé** avec animations pertinentes (scroll/hover) faisant du site **une démo du savoir-faire**, **mobile clean/simple**.
- **2026-06-30** — Création du document. Chantier **0** (hygiène, 10 commits) acté **FAIT** ; chantiers **1** (positionnement & structure), **2** (système de contenu) et **3** (design) actés **DÉCIDÉS**. Faits marquants : pool de projets verrouillé (vedettes DUMP/STOW/EXTRALIMO/site Microsoft), **modèle B unifié data-driven** retenu, DA dark **à tokeniser** (paires Dark/Light + toggle). Travail mené sur la branche `refonte` (main = prod).

---

## Cadrage transverse (s'applique à tous les chantiers)

- 🔒 **Nature du portfolio = VITRINE, pas outil de candidature.** Le portfolio montre **qui Paul EST** : un **builder polyvalent qui touche à tout** — il construit, cherche, apprend (mobile, web, IA, Microsoft). Ce n'est **pas** une lettre de motivation déguisée. **L'angle Product / alternance est porté par le CV**, pas par le portfolio.
- 🔒 **Récit central = polyvalence + « je construis de vrais trucs et j'apprends ».** C'est le fil rouge structurant. Tout le reste (sections, projets, skills) sert ce récit.
- 🔒 **Socle = ce que Paul EST aujourd'hui** : développeur (mobile + web), IA, technologies Microsoft / Power Platform — **à parité, sans hiérarchie artificielle**.
- 🔒 **Cap produit = TOUCHE LÉGÈRE, plus un thème transverse structurant.** Une seule **ligne assumée** (du type « en recherche d'alternance »), **pas plus** — ni section, ni filtre, ni titre. **Ne jamais écrire « Product Manager »** ni présenter une expérience PM. La sensibilité produit transparaît dans la façon de raconter les projets (problème → pour qui → solution → résultat), jamais comme un axe affiché.
- 🔒 **Récit unifié** : une seule personne, pas des silos par casquette.
- 🔒 **Zéro fabrication** : toute donnée manquante = `[[À COMPLÉTER]]` + question listée.

---

## CHANTIER 0 — Hygiène ✅ FAIT

🔒 **10 commits atomiques** livrés sur `main` (non poussés) : `.gitignore` + dé-tracking `.DS_Store`/`.vscode` ; renommage du CV (faute « mirosoft » corrigée) ; **images → WebP + kebab-case + lazy-load** (~38 Mo → 5 Mo) + 4 orphelines supprimées ; **favicon SVG** ; **SEO** (meta description, Open Graph/Twitter, `robots.txt`, `sitemap.xml`) ; sémantique (1 `<h1>`/page, `<header>`/`<main>`, ancres) ; **labels formulaire** ; retrait téléphone + Facebook perso ; `defer` sur scripts.

⏳ **URL de production** : placeholder `YOUR-DOMAIN.com` dans OG/sitemap/robots → à remplacer par l'URL réelle (voir Chantier 5).

---

## CHANTIER 1 — Positionnement & structure ✅ DÉCIDÉ

🔒 **Positionnement** : **vitrine d'un builder polyvalent** qui **conçoit, développe ET déploie de vraies applis** (mobile + web), avec **IA** et **Microsoft/Power Platform**, à parité — *« je construis de vrais trucs et j'apprends »*. **Cap produit = une seule ligne légère** (du type « en recherche d'alternance »), **pas plus** ; l'angle produit/alternance est porté par le **CV**, pas par le portfolio.

🔒 **Architecture MULTI-PAGES** : home curée + **1 page détail par projet vedette**.

🔒 **Pool de projets VERROUILLÉ** (on n'en cherche plus d'autres) :
- **Niveau 1 — Vedette** : **DUMP** (iOS + IA), **STOW** (Flutter), **EXTRALIMO** (Laravel), **site solutions Microsoft** (Next.js).
- **Niveau 2 — Grille** : les **~19 projets** actuels du site (surtout exercices dev).
- **Niveau 3** : lien **GitHub** (« voir plus »).
- **EXCLUS** : freelance Microsoft (IPMS, Experium, colvert…), **TripIA** (idée sans code).

⏳ **Sort des 2 exercices Codecademy** (Excursion, Tea Cozy, les plus faibles) : à retirer de la grille ? — à confirmer.

---

## CHANTIER 2 — Système de contenu ✅ DÉCIDÉ

🔒 **Modèle B unifié, data-driven** :
- **1 fichier de données par type** : projets, skills, certifs, xp.
- **1 seul moteur de rendu** (`display.js`) ; **`microsoft-page.js` supprimé** ; les **2 schémas projet fusionnés** (`projects.json` + `ms-projects.json` → un seul schéma enrichi).
- **Casquette = champ `hats[]` multi-valeurs** (`App` / `IA` / `Microsoft`) → sert de **filtres**, **jamais** d'espace dédié. (Ex. DUMP = `["App","IA"]` apparaît dans 2 filtres depuis 1 entrée.)
- **Produit = champ `product{}` transverse** (problème / impact utilisateur), **jamais un filtre** ni un espace.
- **`featured` + `slug`** → la **page détail** est **auto-générée** par un template commun.

🔒 **Espace Microsoft : consolidé puis fondu** (ne pas jeter) :
- SUEZ, MSCD, Video Game Sales → **pages projet standard**, `hats:["Microsoft"]`, `featured`.
- `power-platform.html` rétrogradé d'« espace maître » à **vue filtrée Microsoft**.
- **URLs existantes préservées** (redirection **301** si le slug change — vrais actifs SEO).

🔒 **Ajout = 1 entrée de données, 0 HTML** (le template génère les pages featured).

🔒 **Pas de back-end maison** (sur-engineering à éviter). Site statique.

⏳ **CMS Git (Decap) sans serveur** : option de confort éventuelle **plus tard**, à évaluer seulement si besoin.

⏳ **Bilingue FR/EN** : le contenu devra être **bilingue dans les données** (champ à intégrer au schéma, ex. `{ "fr": …, "en": … }`) + **2e toggle** dans le header (langue). À intégrer à la conception du schéma au Chantier 4.

### Schéma cible (référence — détaillé dans `PROPOSITION.md`)
- **Projet** : `slug, title, image, hats[], featured, level (1|2), year, tech[], context, impact[], status, product{problem,userImpact}, media{video,screenshots[]}, links{}` (+ bilingue à prévoir).
- **Skill** : `name, image, level, category`.
- **Certif** : `code, name, issuer, date, skills[], officialUrl`.
- **XP** : `position, company, location, dates, image, category?`.

---

## CHANTIER 3 — Design ✅ DÉCIDÉ

> Principe : **garder et élever** la DA existante, pas la remplacer. (Audit complet de l'existant : couleurs en dur, Poppins non importée, dark-only, desktop-first — voir historique.)

🔒 **DIRECTION VISUELLE** : portfolio **soigné et atypique**. Le **desktop est travaillé** avec des **animations PERTINENTES** (scroll, hover) qui font du **site lui-même une démo du savoir-faire** de Paul (le portfolio prouve ce qu'il sait faire). En **mobile**, on reste **clean et simple** — les animations ne doivent jamais nuire à la lisibilité ni aux perfs sur petit écran. (Cohérent avec le récit « builder polyvalent qui construit de vrais trucs ».)

🔒 **Garder** : DA **dark**, esprit **plat / graphique**, **bichromie** rose **`#ff004f`** (marque) / or **`#f7c948`** (Microsoft) ; transitions uniformes `0.2s ease`.

🔒 **Tokeniser** : variables CSS, **chaque couleur en PAIRE** pour gérer **Dark + Light** avec un **toggle** (aujourd'hui dark-only).

🔒 **Typographie** : **importer enfin Poppins** (jamais importée → fallback système actuel), poser une **échelle typo cohérente**, **corriger la hiérarchie (`h1` > `h2`)** (actuellement `.sub-title` 60px > `h1` 35px).

🔒 **Responsive** : passer en **mobile-first**, breakpoints propres (actuel : desktop-first, home 2 bp, Microsoft 6 bp en désordre).

🔒 **Header** : **garder l'effet de scroll**, **changer l'image** de fond (réutiliser la **photo de l'about**).

🔒 **Harmoniser** les composants divergents (boutons / cartes : portfolio vs Microsoft — radius & padding différents).

🔒 **Couleurs de casquette** : prévoir le **mécanisme** (une teinte discrète par casquette, **sur les tags/filtres uniquement**).
⏳ **Teintes exactes** par casquette : **à définir plus tard**.

---

## 🎨 Feuille de route DESIGN (phase à venir) — ⏳ EN ATTENTE

> À traiter à la **passe visuelle** (après la plomberie + le contenu du Chantier 4). **Décisions / pistes à consigner, pas à implémenter maintenant.** Utiliser le **skill `frontend-design`** (installé) pour cette passe.

1. ⏳ **Palette mode light** — affiner contrastes et teintes (jugés « pas encore optimaux »).
2. ⏳ **Charte par projet vedette** — chaque page vedette (DUMP, STOW, EXTRALIMO, Site MS) reprend la **charte du produit** (accents de couleur + ambiance propres à l'app/au site), **MAIS dans le cadre CONSTANT du portfolio** : structure, typo et composants restent les miens. Objectif : **un fil rouge sous les variations, pas un patchwork**. Techniquement = **extension du mécanisme `--hat`** déjà en place, vers une **couleur par PROJET** (plus fine que par casquette). → à terme : **champ `brand{}` par projet vedette** dans les données.
3. ⏳ **Layout des pages détail** — repenser / **alléger**, ne garder que le pertinent (les pages actuelles portent encore le **contenu migré des anciennes pages MS**).
4. ⏳ **Galerie** — revoir disposition et rendu.
5. ⏳ **Header** — **garder l'effet de scroll**, **changer la photo** (réutiliser la **photo de l'about**). *(déjà acté Chantier 3 ; rappelé ici comme tâche de la passe design.)*
6. ⏳ **Purge CSS `ms-*` orphelin** restant (résidus du hub supprimé : kpi / card / cert / demo…).
7. ⏳ **Harmoniser les composants divergents** (boutons / cartes).
8. ⏳ **Direction « desktop atypique »** — animations **pertinentes** au scroll/hover faisant du site une **démo du savoir-faire** ; **mobile clean/simple**. *(cf. direction visuelle Chantier 3 ; skill `frontend-design`.)*
9. ⏳ **Couleurs de casquette** (Web / App / IA / Microsoft) **accordées à la DA** (rose/or) : **fil chromatique** carte → filtre → page + hover. **Teintes discrètes, pas d'arc-en-ciel.**

---

## ⏳ EN ATTENTE GLOBAL — à fournir par Paul avant l'implémentation (Chantier 4)

1. **Alternance produit** : angle exact + rythme + dates + secteur visé.
2. **DUMP** : problème/déclencheur exact, cible, chiffres (testeurs, sortie App Store), lien public.
3. **STOW** : pain point voyageur exact + 2-3 fonctionnalités phares + chiffres (téléchargements, note, Android ?).
4. **EXTRALIMO** : **modèle économique** (gratuit / commission / abonnement) + chiffres (inscrits, mises en relation).
5. **Site solutions Microsoft** : **URL de prod** confirmée (paulsabourault.fr ?) + offres/pages clés.
6. **Expérience IPMS** : description **générique** (client en cours).
7. **Clarifier « Acteo » vs « IPMS »** dans les expériences.
8. **Confirmer le récit « origine restauration »**.
9. **Skills à ajouter** : IA & Mobile (Flutter, Swift/SwiftUI, intégration LLM/Claude, Whisper…) + niveaux.
10. **Headline + About** : choix des variantes (A/B) — cf. `PROPOSITION.md`.

---

## CHANTIER 4 — Implémentation (À VENIR)
Fusion des JSON projet + schéma enrichi (hats/featured/product/bilingue) · suppression `microsoft-page.js` · moteur unique `display.js` · template de page détail · tokenisation CSS + toggle Dark/Light + import Poppins + échelle typo · mobile-first · 301 sur les URLs Microsoft.
**Pré-requis** : EN ATTENTE GLOBAL renseigné.

## CHANTIER 5 — Déploiement (À VENIR)
Mise en ligne sur **O2switch** → domaine cible **`portfolio-sbrt.com`** ; remplacer le placeholder `YOUR-DOMAIN.com` (OG/sitemap/robots) par l'URL réelle.

---

## Documents liés
- `PROPOSITION.md` — positionnement détaillé, gabarits des 4 cas vedette, headlines/about, schéma `projects.json`.
- (Audits Chantiers 1-3 : réalisés en session, synthèses intégrées ci-dessus.)
