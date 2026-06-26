# AS — Site vitrine

Site one-page pour la maison **AS** : prêt-à-porter homme & femme, accessoires et art de vivre (Maison).
Esthétique luxe minimaliste, animations propulsées par **GSAP** (skills officiels GreenSock).

## Lancer

Ouvrez simplement `index.html` dans un navigateur. Aucune dépendance réseau :
GSAP + ScrollTrigger sont embarqués dans `assets/`.

```bash
# ou via un petit serveur local
python3 -m http.server -d site 8000
# puis http://localhost:8000
```

## Structure

```
site/
├── index.html        # structure + contenu
├── styles.css        # design (palette ivoire/encre/sable, serif + sans)
├── main.js           # animations GSAP
└── assets/
    ├── gsap.min.js
    └── ScrollTrigger.min.js
```

## Sections

1. **Loader** — compteur 0→100 (timeline) puis enchaînement sur le hero
2. **Hero** — titre serif révélé mot par mot (masque + stagger)
3. **Marquee** — bandeau infini, vitesse réactive au scroll
4. **Story** — révélation de texte ligne par ligne
5. **Collections** — 4 univers (Femme, Homme, Accessoires, Maison), reveal en batch
6. **Éditorial** — parallax + panneau sombre
7. **Showcase** — scroll horizontal pinné (containerAnimation)
8. **Valeurs** — compteurs animés
9. **Newsletter + Footer**

## Techniques GSAP appliquées (d'après les skills)

- `gsap.registerPlugin(ScrollTrigger)` une seule fois
- `gsap.defaults()` pour des réglages globaux
- **Timelines** plutôt que des `delay` chaînés (loader, hero)
- **Transform aliases** (`x`, `y`, `yPercent`, `scale`) plutôt que `width`/`top`/`left`
- **`autoAlpha`** plutôt que `opacity` pour les fondus
- **`fromTo`** quand l'état final doit être explicite (titres révélés)
- **`ScrollTrigger.batch()`** pour révéler les cartes par lots
- **Parallax** via `scrub` sur des transforms uniquement
- **Scroll horizontal** avec `containerAnimation` + `ease: "none"` (mapping 1:1)
- **`gsap.matchMedia()`** pour respecter `prefers-reduced-motion` (accessibilité)
- `ScrollTrigger` placé sur les timelines de haut niveau uniquement

## Personnalisation rapide

- **Couleurs** : variables CSS en haut de `styles.css` (`:root`)
- **Visuels** : les médias sont des dégradés (`.card__media--*`, `.product__media--*`).
  Remplacez par `background-image: url(...)` pour vos photos.
- **Contenu** : tout est éditable directement dans `index.html`.
