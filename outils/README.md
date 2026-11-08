# Outils

- `captures.cjs` : régénère les captures des sites et apps d'exemple (`site/asagency/img/shots/`). À relancer après toute modification d'un exemple.
- `peek.cjs` : capture rapide d'une page locale pour vérifier un rendu (`node outils/peek.cjs page.html sortie.png [largeur] [hauteur] [scrollY] [full]`).

Ensuite `node templates/presentation.cjs` produit la présentation PDF (`templates/06-presentation.pdf`).
Ajouter `?shot` à l'URL d'une page fige ses animations (utilisé pour les captures).
