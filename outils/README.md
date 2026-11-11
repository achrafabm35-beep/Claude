# Outils

- `captures.cjs` : régénère les captures WebP des sites d'exemple, des apps de démo et des publicités (`site/asagency/img/shots/`). `node outils/captures.cjs [sites|apps|pubs]`. À relancer après toute modification d'un exemple.
- `pubs.html` : les publicités d'exemple (une `.ad[data-name]` par visuel), capturées par `captures.cjs pubs`.
- `logos.cjs` : génère les logos d'exemple en SVG vectorisé (`site/asagency/img/logos/`). Demande `opentype.js` et les polices `@fontsource/*` : `NODE_PATH=<dossier>/node_modules node outils/logos.cjs`.
- `peek.cjs` : capture rapide d'une page locale pour vérifier un rendu (`node outils/peek.cjs page.html sortie.png [largeur] [hauteur] [scrollY] [full]`).

Documents (dossier `templates/`) :

- `node templates/presentation.cjs` : brochure PDF (`templates/presentation.pdf`).
- `node templates/pack.cjs` : pack de bienvenue PDF (`templates/pack/`).
- `node templates/social.cjs` : visuels pour les réseaux sociaux (`templates/social/`).

Ajouter `?shot` à l'URL d'une page fige ses animations (utilisé pour les captures).
