# Portfolio — Yaw Okyere Darko

Portfolio de design et de création web de Yaw Okyere Darko. Site statique en HTML, CSS et JavaScript, sans build ni dépendance à installer : on l'ouvre dans un navigateur.

## Ce que fait le site

- **Accueil** — titre « PORTFOLIO », carrousel infini des six projets (glisser, molette ou clic pour ouvrir un projet) et un bouton **EXPLORE** qui bascule vers une grille de visuels. Au survol d'une carte de la grille, elle grossit légèrement.
- **Intro** — un écran d'intro s'affiche au premier chargement d'une session, puis la page se révèle en cascade. Les cartes du carrousel montent depuis le bas.
- **Pages projet** — chaque projet a sa page avec animations au scroll (GSAP + ScrollTrigger) et une galerie d'images en lightbox.
- **Transitions** — fondu entre les pages.
- **Défilement fluide** — la molette est lissée sur toutes les pages (Lenis) et reste synchronisée avec les animations au scroll. Le scroll tactile reste natif, et l'option « réduire les animations » du système désactive le lissage.
- **Responsive** — jusqu'à 1024 px de large, l'accueil affiche directement la grille (pas de carrousel ni d'EXPLORE) et le défilement épinglé des pages projet est désactivé.

## Projets présentés

| Projet | Page | Description |
| --- | --- | --- |
| Guggenheim × Frank Lloyd Wright | [guggenhiem/](guggenhiem/guggenheime.html) | Projet scolaire : site, livre, boîte, affiche et objet inspirés de l'architecte. |
| AgroVida × Uddan IT | [agro-vida/](agro-vida/agro_vida.html) | Stage : logo, site web et supports de présentation d'une plateforme mobile pour agriculteurs. |
| Ian Campo | [ian-campo/](ian-campo/ian_campo.html) | Photographe d'architecture brutaliste (page vers son site). |
| Control × Remedy Entertainment | [control/](control/control.html) | Projet scolaire (SIPS5) : maquette de site, pictogrammes, packaging/CD et motion autour du jeu. |
| BISH.OP | [Bish.op/](Bish.op/bish_op.html) | Réalisateur et photographe : galerie et maquette de site. |
| Messi 15.1 × adidas | [messi/](messi/messi.html) | Analyse du jeu de Messi et de son influence sur la chaussure adidas Messi 15.1. |

Le bouton « visite site » de chaque page ouvre soit une maquette hébergée dans le dépôt (sous-dossiers de chaque projet, certaines en three.js / WebGL avec GSAP ScrollSmoother), soit le site réel (AgroVida, Ian Campo).

## Stack

- HTML5, CSS3, JavaScript sans framework
- [GSAP](https://gsap.com/) 3.12.5 et ScrollTrigger, chargés depuis cdnjs sur les pages projet
- [Lenis](https://lenis.darkroom.engineering/) 1.3.26 pour le défilement fluide, en fichier local (`shared/lenis.min.js`) : il garde le scroll natif, donc ScrollTrigger et les pins fonctionnent sans changement
- three.js dans certaines maquettes de projet (fichiers inclus dans le dépôt)
- Polices : Inter et Sofia Sans Condensed (Google Fonts), Druk Trial et Impact (cdnfonts), Neue Haas Display (onlinewebfonts)

## Lancer en local

```bash
git clone https://github.com/chamolou/portfolio.git
cd portfolio
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>. L'extension VS Code Live Server fonctionne aussi (port 5503 déjà configuré dans `.vscode/settings.json`).

L'intro ne s'affiche qu'une fois par session de navigateur : pour la revoir, ouvrir le site dans un nouvel onglet ou en navigation privée.

## Structure

```
.
├── index.html, index.css, index.js   Accueil : intro, carrousel, grille EXPLORE
├── about/                            Page À propos
├── project/                          Galerie de visuels (lightbox)
├── guggenhiem/  agro-vida/  ian-campo/
│   control/  Bish.op/  messi/        Une page par projet + maquettes associées
├── shared/                           CSS/JS communs : transitions de page, intro,
│                                     responsive, lightbox, défilement fluide (Lenis),
│                                     défilement des pages projet
├── assets/explore/                   Visuels de la grille EXPLORE
└── docs/                             One-pager de présentation
```

## Crédits

Les marques, jeux et artistes cités (adidas, Remedy Entertainment, Ian Campo, BISH.OP, Frank Lloyd Wright, etc.) appartiennent à leurs propriétaires respectifs ; les projets présentés sont des travaux scolaires ou personnels.
