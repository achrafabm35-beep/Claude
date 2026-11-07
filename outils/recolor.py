"""Change la teinte « bleue » d'une capture d'app en une autre teinte, sans toucher
aux rouges / verts / oranges (statuts, alertes).
Usage : python3 outils/recolor.py <teinte_cible_en_degres> fichier.jpg [...]
(les fichiers sont réécrits en place ; l'original reste dans l'historique git)"""
import sys
import numpy as np
from PIL import Image

target = float(sys.argv[1]) / 360.0
for f in sys.argv[2:]:
    im = Image.open(f).convert('RGB')
    hsv = np.asarray(im.convert('HSV')).astype(np.float32) / 255.0
    h, s = hsv[..., 0], hsv[..., 1]
    # bleu / indigo : 200° à 260°, avec un fondu doux sur les bords
    deg = h * 360
    w = np.clip(1 - np.maximum(0, np.abs(deg - 230) - 25) / 15, 0, 1) * np.clip((s - 0.06) / 0.08, 0, 1)
    shift = target - 230 / 360
    hsv[..., 0] = np.where(w > 0, (h + shift * w) % 1.0, h)
    out = Image.fromarray((hsv * 255).round().astype(np.uint8), 'HSV').convert('RGB')
    out.save(f, quality=86)
    print('✓', f)
