// Pack de bienvenue AS Marketing Agency : six PDF A4 (guide, offres, devis, contrat, facture, brief).
// Usage : node templates/pack.cjs   → templates/pack/*.pdf
// PDF vectoriels (texte sélectionnable) : mise en page à plat, sans ombre, flou ni transparence.
// Les zones entre crochets sont à compléter. Aucun prix n'est imprimé.
const { execFileSync } = require('child_process');
const L = require('./lib.cjs');
const { path, fs, url } = L;

const OUT = path.join(__dirname, 'pack');
fs.mkdirSync(OUT, { recursive: true });
const TMP = L.tmpDir('pack');

// Images sans transparence (JPEG) pour un PDF léger et fiable. jobs : [src, dst, largeur, fond]
const flat = (jobs) => execFileSync('python3', ['-c', `
import sys, json
from PIL import Image
for src, dst, w, bg in json.loads(sys.argv[1]):
    im = Image.open(src).convert('RGBA')
    if w and im.size[0] > w: im = im.resize((w, round(im.size[1] * w / im.size[0])), Image.LANCZOS)
    out = Image.new('RGB', im.size, bg); out.paste(im, mask=im.split()[3])
    out.save(dst, 'JPEG', quality=88)
`, JSON.stringify(jobs)]);
const I = (n) => url(path.join(TMP, n));

const EMET = `<b>AS Marketing Agency</b><br><span class="fill">[Adresse — Code postal Ville]</span><br>as.agency.off@gmail.com · <span class="fill">[Téléphone]</span><br>SIRET <span class="fill">[000 000 000 00000]</span> · <span class="fill">[N° TVA ou « TVA non applicable, art. 293 B du CGI »]</span>`;
const CLIENT = `<span class="fill">[Nom / Société]</span><br><span class="fill">[Adresse — Code postal Ville]</span><br><span class="fill">[Interlocuteur]</span><br><span class="fill">[E-mail] · [Téléphone]</span>`;

const CSS = `
@page{size:A4;margin:0}
*{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
:root{--ink:#121117;--mute:#5f5c69;--line:#e2dfe8;--soft:#f5f3f8;--aqua:#0d9488;--pale:#e3f6f3;--dark:#0a0a0f;--sans:"Inter Tight",Arial,sans-serif;--serif:"Instrument Serif",Georgia,serif}
body{font:400 10pt/1.5 var(--sans);color:var(--ink)}
.page{position:relative;width:210mm;height:297mm;padding:19mm 18mm 22mm;overflow:hidden;page-break-after:always;background:#fff}
.page:last-child{page-break-after:auto}
.page::before{content:"";position:absolute;left:0;top:0;right:0;height:2.6mm;background:linear-gradient(90deg,#1fc6b6,#8fb0f0 52%,#eaa6e6)}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:9mm}
.top img{height:13mm;width:auto}
.top div{text-align:right;font-size:9pt;color:var(--mute);line-height:1.45}
.top b.t{display:block;font:600 8pt/1 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--aqua);margin-bottom:2mm}
h1{font:600 27pt/1 var(--sans);letter-spacing:-.035em;word-spacing:.04em}
h1 em,h2 em,.em{font-family:var(--serif);font-style:italic;font-weight:400;letter-spacing:-.01em;color:var(--aqua)}
h1 em{font-size:1.06em}
h2{font:600 16pt/1.1 var(--sans);letter-spacing:-.03em;margin:8mm 0 3.5mm}
h3{font:600 11.6pt/1.2 var(--sans);letter-spacing:-.02em}
.lead{margin-top:4mm;color:var(--mute);font-size:11.5pt;line-height:1.45;max-width:140mm}
.eyebrow{font:600 8pt/1 var(--sans);letter-spacing:.22em;text-transform:uppercase;color:var(--aqua);margin-bottom:4mm}
.fill{color:#8a8794}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;padding-top:3mm;border-top:1px solid var(--line);font-size:7.6pt;color:#8a8794}
.two{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.three{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.four{display:grid;grid-template-columns:repeat(4,1fr);gap:3.5mm}.four .box{padding:4.5mm 4.5mm}.four h3{font-size:10.4pt}.four p{font-size:9pt}
.box{padding:6mm 6.5mm;border:1px solid var(--line);border-radius:3.5mm}
.box.soft{background:var(--soft);border-color:var(--soft)}
.box.pale{background:var(--pale);border-color:var(--pale)}
.box h3{margin-bottom:1.5mm}
.box p,.box li{font-size:10pt;color:var(--mute);line-height:1.45}
.lab{display:block;font:600 7.4pt/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;color:var(--aqua);margin-bottom:2.2mm}
ul.ok{list-style:none}
ul.ok li{position:relative;padding:1.5mm 0 1.5mm 5.5mm}
ul.ok li::before{content:"";position:absolute;left:0;top:3.3mm;width:2.2mm;height:2.2mm;border-radius:50%;background:var(--aqua)}
ul.cb li::before{border-radius:.6mm;background:#fff;border:1px solid #9b98a6;width:2.8mm;height:2.8mm;top:2.9mm}
ul.cb li{padding-left:6.5mm}

/* couverture */
.cover{padding:0;background:var(--dark);color:#fff}
.cover::before{display:none}
.cover__img{position:absolute;left:0;bottom:0;width:210mm;height:150mm;display:block}
.cover__in{position:absolute;left:20mm;right:20mm;top:22mm}
.cover__in img{height:19mm;width:auto;display:block;margin-bottom:26mm}
.cover h1{font-size:58pt;line-height:.94;letter-spacing:-.045em}
.cover h1 em{display:block;color:#5fe0d3}
.cover p{margin-top:8mm;font-size:13pt;color:#c9c8d6;max-width:120mm;line-height:1.4}
.cover__tag{position:absolute;left:20mm;right:20mm;bottom:14mm;display:flex;justify-content:space-between;font:600 9pt/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:#fff}

/* étapes */
.steps{margin-top:8mm}
.st{display:grid;grid-template-columns:13mm 1fr 46mm;gap:5mm;align-items:start;padding:5mm 0;border-top:1px solid var(--line)}
.st:last-child{border-bottom:1px solid var(--line)}
.st i{display:grid;place-items:center;width:11mm;height:11mm;border-radius:50%;background:var(--dark);color:#fff;font:600 11pt/1 var(--sans);font-style:normal}
.st.free i{background:var(--aqua)}
.st h3{font-size:14.5pt;letter-spacing:-.025em}
.st p{margin-top:1.4mm;color:var(--mute);font-size:10.6pt}
.st small{display:block;padding:2.6mm 3.4mm;border-radius:2.5mm;background:var(--soft);font-size:9.2pt;line-height:1.4;color:var(--ink)}
.st small b{display:block;font:600 7pt/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:var(--aqua);margin-bottom:1.2mm}
.tag{display:inline-block;margin-left:2mm;padding:.9mm 2.4mm;border-radius:99px;background:var(--pale);color:var(--aqua);font:600 7pt/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;vertical-align:middle}
.big4{display:grid;grid-template-columns:repeat(4,1fr);gap:4mm;margin-top:7mm}
.big4 div{padding:6.5mm 5mm;border-radius:3.5mm;background:var(--dark);color:#fff}
.big4 b{display:block;font:600 25pt/1 var(--sans);letter-spacing:-.04em;color:#5fe0d3}
.big4 span{display:block;margin-top:2.4mm;font-size:9.2pt;line-height:1.35;color:#c9c8d6}
.qa{padding:4.8mm 0;border-top:1px solid var(--line)}
.qa h3{font-size:13pt}
.qa p{margin-top:1.4mm;color:var(--mute);font-size:10.6pt}
.contact{display:grid;grid-template-columns:1fr 34mm;gap:8mm;align-items:center;margin-top:9mm;padding:7mm 8mm;border-radius:4mm;background:var(--dark);color:#fff}
.contact h3{font:600 17pt/1.05 var(--sans);letter-spacing:-.035em}
.contact h3 em{font-family:var(--serif);font-style:italic;font-weight:400;color:#5fe0d3}
.contact p{margin-top:3mm;font-size:10pt;color:#c9c8d6;line-height:1.6}
.contact p b{color:#fff}
.contact img{display:block;width:34mm;height:34mm}

/* offres */
.offer{margin-top:7mm}
.offer__head{display:grid;grid-template-columns:1fr 56mm;gap:6mm;align-items:end;margin-bottom:4.5mm}
.offer__head h2{margin:0;font-size:22pt}
.offer__head p{color:var(--mute);font-size:10.6pt;margin-top:2mm}
.offer__head img{display:block;width:56mm;height:31mm;object-fit:cover;object-position:0 0;border-radius:2.5mm;border:1px solid var(--line)}
.plan{padding:5.5mm 5.5mm 5mm;border:1px solid var(--line);border-radius:3.5mm}
.plan.star{border:1.5px solid var(--aqua);background:#f3fbfa}
.plan .lab{margin-bottom:1.6mm}
.plan h3{font-size:13.5pt}
.plan p{margin:1.2mm 0 3mm;font-size:9.6pt;color:var(--mute);line-height:1.35;min-height:9mm}
.plan li{font-size:9.6pt;line-height:1.35;padding:1mm 0 1mm 4.6mm}
.plan ul.ok li::before{top:2.6mm;width:1.8mm;height:1.8mm}
.note{margin-top:8mm;padding:5.5mm 6.5mm;border-radius:3.5mm;background:var(--pale);font-size:10.6pt;line-height:1.45}
.note b{color:var(--aqua)}

/* devis / facture */
.parties{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:2mm}
.parties .box{font-size:9.3pt;line-height:1.55}
.obj{margin-top:5mm;padding:3.5mm 5.5mm;border-radius:3mm;background:var(--soft);font-size:9.6pt}
table{width:100%;border-collapse:collapse;margin-top:5mm;font-size:9.4pt}
th{padding:2.6mm 3mm;background:var(--dark);color:#fff;font:600 7.6pt/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;text-align:left}
th.r,td.r{text-align:right}
td{height:9.4mm;padding:0 3mm;border-bottom:1px solid var(--line);vertical-align:middle}
.tot{display:grid;grid-template-columns:1fr 72mm;gap:8mm;margin-top:5mm}
.tot table{margin:0}
.tot td{height:8mm}
.tot tr:last-child td{border:0;background:var(--dark);color:#fff;font-weight:600;font-size:10.5pt}
.small{font-size:8.6pt;color:var(--mute);line-height:1.5}
.small b{color:var(--ink)}
.sign{display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:6mm}
.sign .box{height:27mm;font-size:8.6pt;color:var(--mute)}
.sign .box b{display:block;color:var(--ink);font-size:9.4pt;margin-bottom:.6mm}

/* contrat */
.art{margin-top:5.6mm}
.art h3{font-size:11.2pt;margin-bottom:1mm}
.art h3 span{color:var(--aqua);margin-right:1.6mm}
.art p{font-size:10.1pt;line-height:1.55;color:#33313b;text-align:justify}

/* brief */
.q{margin-top:5.2mm}
.q h3{font-size:10.6pt}
.q h3 span{color:var(--aqua);margin-right:1.6mm}
.q p{font-size:8.8pt;color:var(--mute)}
.lines i{display:block;height:8.2mm;border-bottom:1px solid #cfccd8}
.inline{display:grid;grid-template-columns:1fr 1fr;gap:0 8mm}
.inline label{display:block;margin-top:3.6mm;font-size:8.6pt;color:var(--mute)}
.inline label i{display:block;height:7mm;border-bottom:1px solid #cfccd8}
.checks{display:flex;flex-wrap:wrap;gap:1.5mm 7mm;margin-top:2.4mm;list-style:none;font-size:9.6pt}
.checks li{display:flex;align-items:center;gap:2mm}
.checks li::before{content:"";width:3.2mm;height:3.2mm;border:1px solid #9b98a6;border-radius:.7mm}
`;

const top = (t, sub) => `<header class="top"><img src="${I('logo-blanc.jpg')}"><div><b class="t">${t}</b>${sub}</div></header>`;
const foot = (name, n, tot) => `<div class="foot"><span>AS Marketing Agency · as.agency.off@gmail.com · asagency.store</span><span>${name} · ${n}/${tot}</span></div>`;
const doc = (name, pages) => pages.map((p, i) => `<section class="page${p.cls ? ' ' + p.cls : ''}">${p.html}${p.cls === 'cover' ? '' : foot(name, i + 1, pages.length)}</section>`).join('\n');
const lines = (n) => `<div class="lines">${'<i></i>'.repeat(n)}</div>`;
const art = (n, t, p) => `<div class="art"><h3><span>Article ${n}</span>${t}</h3><p>${p}</p></div>`;

/* ---------- 1. Guide de bienvenue ---------- */
const bienvenue = doc('Guide de bienvenue', [
  { cls: 'cover', html: `<img class="cover__img" src="${I('cover.jpg')}">
    <div class="cover__in"><img src="${I('logo-noir.jpg')}"><h1>Bienvenue.<em>On s’occupe de tout.</em></h1><p>Tout ce qu’il faut savoir pour démarrer votre projet avec nous, en quatre pages.</p></div>
    <div class="cover__tag"><span>Guide de bienvenue</span><span>asagency.store</span></div>` },
  { html: `${top('Guide de bienvenue', 'Le déroulement de votre projet')}
    <h1>Comment ça <em>se passe.</em></h1><p class="lead">Notre règle est simple : on le fait, vous l’aimez, ensuite on parle. Vous ne payez rien tant que vous n’avez pas vu votre projet.</p>
    <div class="steps">
      <div class="st"><i>1</i><div><h3>On échange</h3><p>Vingt minutes au téléphone ou en visio. Vous racontez votre activité et ce qui vous fait perdre du temps. Pas de cahier des charges à écrire.</p></div><small><b>Votre rôle</b>Nous raconter votre quotidien.</small></div>
      <div class="st free"><i>2</i><div><h3>On réalise une première version<span class="tag">Offert</span></h3><p>Sous 72 h, vous recevez un lien : une vraie première version de votre application, de votre site ou de votre identité. Pas une maquette figée.</p></div><small><b>Votre rôle</b>Rien. On travaille.</small></div>
      <div class="st"><i>3</i><div><h3>Vous réagissez</h3><p>Vous testez, vous montrez à votre équipe, vous nous dites ce qui vous plaît et ce qu’il faut changer. On ajuste.</p></div><small><b>Votre rôle</b>Tester et donner votre avis.</small></div>
      <div class="st"><i>4</i><div><h3>Vous décidez</h3><p>Le projet vous plaît : vous recevez un devis clair et un contrat simple. Il ne vous plaît pas : on s’arrête là, vous ne nous devez rien.</p></div><small><b>Votre rôle</b>Dire oui, ou non.</small></div>
      <div class="st"><i>5</i><div><h3>On lance ensemble</h3><p>Finitions, mise en ligne, prise en main avec votre équipe. Ensuite, on reste disponibles pour les évolutions.</p></div><small><b>Votre rôle</b>Valider la version finale.</small></div>
    </div>
    <div class="big4"><div><b>0 €</b><span>avant d’avoir vu votre projet</span></div><div><b>72 h</b><span>pour une première version</span></div><div><b>24 h</b><span>pour vous répondre</span></div><div><b>100 %</b><span>sur mesure</span></div></div>` },
  { html: `${top('Guide de bienvenue', 'Pour bien démarrer')}
    <h1>Ce qu’il nous faut, <em>ce que vous recevez.</em></h1>
    <div class="two" style="margin-top:8mm">
      <div class="box soft"><span class="lab">De votre côté</span><h3>Le strict minimum</h3><ul class="ok cb" style="margin-top:2mm">
        <li>Un interlocuteur, disponible pour valider</li><li>Votre logo et vos couleurs, si vous en avez</li><li>Vos fichiers actuels (Excel, modèles, exports)</li><li>Quelques photos et textes pour un site</li><li>Deux ou trois exemples que vous aimez</li><li>Vos accès existants : nom de domaine, réseaux</li></ul></div>
      <div class="box pale"><span class="lab">De notre côté</span><h3>Tout le reste</h3><ul class="ok" style="margin-top:2mm">
        <li>La conception et le design</li><li>Le développement et les tests</li><li>La reprise de vos données existantes</li><li>La mise en ligne et l’hébergement</li><li>La prise en main avec votre équipe</li><li>Un guide d’utilisation simple</li></ul></div>
    </div>
    <h2>Nos engagements</h2>
    <div class="two">
      <div class="box"><h3>Vous voyez avant de payer</h3><p>La première version est offerte. Aucun acompte, aucune signature avant qu’elle vous plaise.</p></div>
      <div class="box"><h3>Une réponse sous 24 h</h3><p>Du lundi au vendredi, chaque message reçoit une réponse le jour ouvré suivant au plus tard.</p></div>
      <div class="box"><h3>Un seul interlocuteur</h3><p>Vous parlez toujours à la personne qui réalise votre projet. Pas de standard, pas de ticket.</p></div>
      <div class="box"><h3>Votre projet vous appartient</h3><p>Une fois réglés, les livrables sont à vous : fichiers, contenus, nom de domaine et accès.</p></div>
    </div>
    <h2>Pendant le projet</h2>
    <div class="three">
      <div class="box soft"><h3>Un lien, toujours à jour</h3><p>Vous suivez l’avancement sur un lien privé, à ouvrir quand vous voulez.</p></div>
      <div class="box soft"><h3>Des retours simples</h3><p>Un message, une capture d’écran ou un appel : comme cela vous arrange.</p></div>
      <div class="box soft"><h3>Un point par semaine</h3><p>Un court message chaque semaine : ce qui est fait, ce qui arrive.</p></div>
    </div>` },
  { html: `${top('Guide de bienvenue', 'Vos questions')}
    <h1>Les questions <em>qu’on nous pose.</em></h1>
    <div style="margin-top:7mm">
      <div class="qa"><h3>La première version est-elle vraiment gratuite ?</h3><p>Oui. Elle ne vous engage à rien. Si elle ne vous convainc pas, on s’arrête là et vous ne recevez aucune facture.</p></div>
      <div class="qa"><h3>Combien de temps dure un projet ?</h3><p>Une première version arrive sous 72 h. La version finale suit en quelques jours à quelques semaines selon l’ampleur : le délai exact figure dans votre devis.</p></div>
      <div class="qa"><h3>Faut-il des connaissances techniques ?</h3><p>Aucune. Vous décrivez votre besoin avec vos mots, on s’occupe du reste et on vous forme à l’utilisation.</p></div>
      <div class="qa"><h3>Peut-on faire évoluer le projet ensuite ?</h3><p>Oui. Une application ou un site vit avec votre activité : on ajoute des fonctions, des pages ou des visuels au fil de vos besoins.</p></div>
      <div class="qa"><h3>Mes données sont-elles protégées ?</h3><p>Vos données restent les vôtres. Elles sont hébergées de façon sécurisée, sauvegardées, et jamais partagées ni revendues.</p></div>
      <div class="qa" style="border-bottom:1px solid var(--line)"><h3>Comment se passe le paiement ?</h3><p>Le montant et l’échéancier sont écrits dans votre devis, que vous recevez après avoir vu la première version. Aucune surprise ensuite.</p></div>
    </div>
    <div class="contact"><div><h3>Une question, une idée ? <em>Écrivez-nous.</em></h3><p><b>as.agency.off@gmail.com</b><br><b>asagency.store</b><br>Réponse sous 24 h, du lundi au vendredi.</p></div><img src="${I('qr.jpg')}"></div>` },
]);

/* ---------- 2. Nos offres ---------- */
const plan = (lab, t, p, li, star) => `<div class="plan${star ? ' star' : ''}"><span class="lab">${lab}</span><h3>${t}</h3><p>${p}</p><ul class="ok">${li.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
const offer = (t, p, im, plans) => `<div class="offer"><div class="offer__head"><div><h2>${t}</h2><p>${p}</p></div><img src="${I(im)}"></div><div class="three">${plans.join('')}</div></div>`;
const offres = doc('Nos offres', [
  { html: `${top('Nos offres', 'Applications · Sites web · Logos · Publicités')}
    <h1>Quatre savoir-faire, <em>une seule équipe.</em></h1><p class="lead">Chaque projet est sur mesure. Ces formules donnent un repère : on les ajuste à votre besoin.</p>
    ${offer('Applications <em>métier</em>', 'Remplacez vos fichiers Excel par un outil pensé pour votre quotidien.', 'o-app.jpg', [
      plan('Formule 1', 'Outil ciblé', 'Un besoin précis, une application simple.', ['Un module : suivi, réservations, stock…', 'Tableau de bord', 'Exports Excel et PDF', 'Mise en ligne et prise en main']),
      plan('Formule 2', 'Application métier', 'Votre activité de bout en bout.', ['Plusieurs modules reliés', 'Un accès par rôle', 'Alertes et relances automatiques', 'Reprise de vos fichiers existants', 'Formation de l’équipe'], true),
      plan('Formule 3', 'Plateforme sur mesure', 'Plusieurs équipes, plusieurs sites.', ['Tout le contenu de la formule 2', 'Connexion à vos outils actuels', 'Espace clients ou fournisseurs', 'Accompagnement mensuel']),
    ])}
    <h2>Toujours compris</h2>
    <div class="four">
      <div class="box soft"><h3>Première version offerte</h3><p>Vous jugez sur pièce, avant tout devis.</p></div>
      <div class="box soft"><h3>Design sur mesure</h3><p>À vos couleurs, avec votre vocabulaire.</p></div>
      <div class="box soft"><h3>Mise en ligne</h3><p>On s’occupe de tout, jusqu’au dernier réglage.</p></div>
      <div class="box soft"><h3>Prise en main</h3><p>Votre équipe est formée, avec un guide simple.</p></div>
    </div>
    <p class="note"><b>Et le tarif ?</b> Il est précisé dans votre devis, après la première version. Vous savez donc exactement ce que vous achetez avant de vous engager.</p>` },
  { html: `${top('Nos offres', 'Applications · Sites web · Logos · Publicités')}
    ${offer('Sites <em>web</em>', 'Un site rapide, animé et pensé pour le mobile, qui donne envie de vous contacter.', 'o-site.jpg', [
      plan('Formule 1', 'Site une page', 'L’essentiel, bien présenté.', ['Design sur mesure', 'Formulaire de contact', 'Adapté au mobile', 'Référencement de base']),
      plan('Formule 2', 'Site complet', 'Toute votre activité en ligne.', ['Plusieurs pages', 'Réservation ou prise de rendez-vous', 'Animations au défilement', 'Textes et images optimisés', 'Vous modifiez vos contenus'], true),
      plan('Formule 3', 'Boutique en ligne', 'Vendez en ligne, simplement.', ['Catalogue et fiches produits', 'Paiement sécurisé', 'Gestion des stocks', 'E-mails de commande']),
    ])}
    ${offer('Logos <em>&amp; identité</em>', 'Une marque qu’on reconnaît de loin, sur tous vos supports.', 'o-logo.jpg', [
      plan('Formule 1', 'Logo', 'Votre signature.', ['Trois pistes au choix', 'Deux séries de retouches', 'Fichiers pour l’écran et l’impression']),
      plan('Formule 2', 'Identité complète', 'Tout pour être cohérent partout.', ['Logo et ses déclinaisons', 'Couleurs et typographies', 'Icône et photo de profil', 'Carte de visite', 'Guide d’utilisation'], true),
      plan('Formule 3', 'Refonte de marque', 'Vous existez déjà, on vous modernise.', ['Analyse de l’existant', 'Nouvelle identité complète', 'Mise à jour de vos supports']),
    ])}
` },
  { html: `${top('Nos offres', 'Applications · Sites web · Logos · Publicités')}
    ${offer('Publicités <em>&amp; réseaux sociaux</em>', 'Des visuels qui arrêtent le pouce, prêts à publier.', 'o-pub.jpg', [
      plan('Formule 1', 'Pack de visuels', 'Pour une campagne ou un lancement.', ['Stories, posts et bannières', 'Aux couleurs de votre marque', 'Formats adaptés à chaque réseau']),
      plan('Formule 2', 'Animation mensuelle', 'Une présence régulière, sans y penser.', ['Calendrier de publications', 'Visuels et textes chaque mois', 'Publication programmée', 'Bilan mensuel'], true),
      plan('Formule 3', 'Campagne complète', 'De l’idée aux résultats.', ['Concept et messages', 'Visuels et page d’arrivée', 'Suivi des performances']),
    ])}
    <h2>Et après la mise en ligne ?</h2>
    <div class="three">
      <div class="box soft"><h3>Hébergement &amp; sauvegardes</h3><p>Votre outil reste en ligne, rapide et sauvegardé chaque jour.</p></div>
      <div class="box soft"><h3>Évolutions</h3><p>Une nouvelle fonction, une page en plus : on fait évoluer le projet avec vous.</p></div>
      <div class="box soft"><h3>Assistance</h3><p>Une question, un imprévu : une réponse sous 24 h.</p></div>
    </div>
    <div class="contact"><div><h3>Votre besoin n’entre dans aucune case ? <em>Tant mieux.</em></h3><p>Décrivez-le en quelques mots : <b>as.agency.off@gmail.com</b> · <b>asagency.store</b></p></div><img src="${I('qr.jpg')}"></div>` },
]);

/* ---------- 3. Devis / 5. Facture ---------- */
const rows = (n) => `<tr><td class="fill">[Désignation de la prestation]</td><td class="r"></td><td class="r"></td><td class="r"></td></tr>` + '<tr><td></td><td></td><td></td><td></td></tr>'.repeat(n - 1);
const table = (n) => `<table><thead><tr><th style="width:52%">Désignation</th><th class="r">Quantité</th><th class="r">Prix unitaire HT</th><th class="r">Total HT</th></tr></thead><tbody>${rows(n)}</tbody></table>`;
const totals = (left) => `<div class="tot"><div class="small">${left}</div><table><tbody><tr><td>Total HT</td><td class="r"></td></tr><tr><td>TVA <span class="fill">[ % ]</span></td><td class="r"></td></tr><tr><td>Total TTC</td><td class="r"></td></tr></tbody></table></div>`;
const devis = doc('Devis', [
  { html: `${top('Devis', 'N° <b class="fill">[D-2026-001]</b><br>Date : <span class="fill">[JJ/MM/AAAA]</span><br>Valable 30 jours')}
    <h1>Votre <em>devis.</em></h1>
    <div class="parties"><div class="box soft"><span class="lab">Prestataire</span>${EMET}</div><div class="box"><span class="lab">Client</span>${CLIENT}</div></div>
    <p class="obj"><b>Objet :</b> <span class="fill">[Ex. : application de suivi de chantiers — finalisation, mise en ligne et prise en main]</span></p>
    ${table(7)}
    ${totals('<b>Délai de réalisation :</b> <span class="fill">[ … ]</span> à compter de l’accord.<br><b>Paiement :</b> acompte de <span class="fill">[ … %]</span> à la commande, solde à la livraison, par virement.<br><b>Compris :</b> la première version déjà présentée, les retouches prévues, la mise en ligne et la prise en main.')}
    <div class="sign"><div class="box"><b>Pour AS Marketing Agency</b>Date et signature</div><div class="box"><b>Bon pour accord — le Client</b>Date, signature et mention « Bon pour accord »</div></div>
    <p class="small" style="margin-top:5mm">Ce devis fait suite à la première version réalisée sans frais et présentée au Client. Son acceptation vaut commande et entraîne l’application du contrat de prestation joint.</p>` },
]);
const facture = doc('Facture', [
  { html: `${top('Facture', 'N° <b class="fill">[F-2026-001]</b><br>Date : <span class="fill">[JJ/MM/AAAA]</span><br>Échéance : <span class="fill">[JJ/MM/AAAA]</span>')}
    <h1>Votre <em>facture.</em></h1>
    <div class="parties"><div class="box soft"><span class="lab">Prestataire</span>${EMET}</div><div class="box"><span class="lab">Client</span>${CLIENT}</div></div>
    <p class="obj"><b>Objet :</b> <span class="fill">[Prestation réalisée — référence du devis D-2026-001]</span></p>
    ${table(7)}
    ${totals('<b>Règlement par virement</b><br>Titulaire : <span class="fill">[Nom du titulaire]</span><br>IBAN : <span class="fill">[FR76 0000 0000 0000 0000 0000 000]</span><br>BIC : <span class="fill">[XXXXXXXX]</span><br>Acompte déjà versé : <span class="fill">[ … ]</span>')}
    <div class="box soft" style="margin-top:7mm"><p style="font-size:8.6pt">Paiement à réception, au plus tard à la date d’échéance. Pas d’escompte pour paiement anticipé. En cas de retard, des pénalités sont exigibles au taux de <span class="fill">[trois fois le taux d’intérêt légal]</span>, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € pour les clients professionnels (articles L441-10 et D441-5 du Code de commerce).</p></div>
    <p style="margin-top:9mm;font:600 14pt/1.2 var(--sans);letter-spacing:-.03em">Merci pour votre confiance. <span class="em" style="font-size:1.1em">À très vite pour la suite.</span></p>` },
]);

/* ---------- 4. Contrat ---------- */
const contrat = doc('Contrat de prestation', [
  { html: `${top('Contrat', 'Contrat de prestation de services<br>Réf. <b class="fill">[CT-2026-001]</b> · <span class="fill">[JJ/MM/AAAA]</span>')}
    <h1>Contrat de <em>prestation.</em></h1>
    <h2 style="margin-top:6mm">Entre les soussignés</h2>
    <div class="parties"><div class="box soft"><span class="lab">Le Prestataire</span>${EMET}</div><div class="box"><span class="lab">Le Client</span>${CLIENT}</div></div>
    ${art(1, 'Objet', 'Le présent contrat fixe les conditions dans lesquelles le Prestataire réalise pour le Client les prestations décrites à l’article 3 et détaillées dans le devis n° <span class="fill">[D-2026-001]</span>, annexé au présent contrat dont il fait partie intégrante.')}
    ${art(2, 'Première version offerte', 'Avant la signature du présent contrat, le Prestataire a réalisé et présenté au Client une première version du projet, sans frais et sans engagement. Le Client reconnaît en avoir pris connaissance. Le présent contrat porte sur la finalisation de cette réalisation, sa mise en ligne et, le cas échéant, son suivi.')}
    ${art(3, 'Prestations et livrables', '<span class="fill">[Décrire les prestations : application, site web, identité visuelle, visuels publicitaires. Préciser le périmètre, les fonctions attendues et les livrables remis.]</span> Toute demande sortant de ce périmètre fait l’objet d’un devis complémentaire accepté par le Client avant réalisation.')}
    ${art(4, 'Déroulement et délais', 'Les prestations débutent le <span class="fill">[JJ/MM/AAAA]</span> pour une livraison prévue le <span class="fill">[JJ/MM/AAAA]</span>. Le prix comprend <span class="fill">[deux]</span> séries de retours du Client. Les délais sont suspendus pendant l’attente des éléments ou des validations dus par le Client.')}
    ${art(5, 'Validation', 'À chaque livraison, le Client dispose de <span class="fill">[dix]</span> jours ouvrés pour formuler ses remarques par écrit. Passé ce délai, et sans remarque de sa part, le livrable est réputé validé.')}` },
  { html: `${top('Contrat', 'Contrat de prestation de services<br>Réf. <b class="fill">[CT-2026-001]</b>')}
    ${art(6, 'Prix et paiement', 'Le prix des prestations est celui du devis annexé. Un acompte de <span class="fill">[ … %]</span> est versé à la signature, le solde à la livraison de la version finale. Les factures sont payables par virement à <span class="fill">[trente]</span> jours au plus. Tout retard de paiement entraîne des pénalités au taux de <span class="fill">[trois fois le taux d’intérêt légal]</span> et, pour un client professionnel, une indemnité forfaitaire de 40 € pour frais de recouvrement.')}
    ${art(7, 'Engagements du Prestataire', 'Le Prestataire réalise les prestations avec soin, selon les règles de l’art et dans les délais convenus. Il est tenu d’une obligation de moyens. Il informe le Client de toute difficulté susceptible d’affecter le projet et répond à ses messages sous un jour ouvré.')}
    ${art(8, 'Engagements du Client', 'Le Client désigne un interlocuteur habilité à valider. Il fournit en temps utile les contenus, accès et informations nécessaires, et garantit détenir les droits sur les éléments qu’il transmet (textes, images, marques, données).')}
    ${art(9, 'Propriété intellectuelle', 'Après paiement complet du prix, le Prestataire cède au Client les droits d’exploitation des livrables créés spécialement pour lui, pour tous supports, pour le monde entier et pour la durée légale de protection. Les outils, bibliothèques et composants génériques du Prestataire ou de tiers restent la propriété de leurs titulaires ; le Client en reçoit un droit d’usage dans le cadre du projet. Sauf demande écrite contraire, le Prestataire peut citer la réalisation parmi ses références.')}
    ${art(10, 'Hébergement, maintenance et évolutions', 'Lorsque le devis le prévoit, le Prestataire assure l’hébergement, les sauvegardes, les mises à jour et l’assistance, aux conditions et pour la durée indiquées au devis. Les évolutions fonctionnelles font l’objet de devis distincts.')}
    ${art(11, 'Confidentialité et données personnelles', 'Chaque partie garde confidentielles les informations reçues de l’autre, pendant le contrat et trois ans après son terme. Lorsque le Prestataire traite des données personnelles pour le compte du Client, il agit sur ses seules instructions, en assure la sécurité et la confidentialité, ne les utilise à aucune autre fin et les restitue ou les supprime à la fin du contrat, conformément au RGPD.')}
    ${art(12, 'Responsabilité', 'Le Prestataire ne répond que des dommages directs résultant d’une faute prouvée de sa part. Sa responsabilité est limitée au montant effectivement payé par le Client au titre du présent contrat. Il n’est pas responsable des contenus fournis par le Client, ni des interruptions imputables à des tiers (hébergeurs, opérateurs, éditeurs).')}` },
  { html: `${top('Contrat', 'Contrat de prestation de services<br>Réf. <b class="fill">[CT-2026-001]</b>')}
    ${art(13, 'Durée et résiliation', 'Le contrat prend effet à sa signature et se termine à la livraison de la version finale, ou au terme de la période de suivi prévue au devis. En cas de manquement grave non réparé dans les <span class="fill">[quinze]</span> jours suivant une mise en demeure écrite, l’autre partie peut résilier le contrat de plein droit. Les prestations déjà réalisées restent dues.')}
    ${art(14, 'Force majeure', 'Aucune partie n’est responsable d’un retard ou d’une inexécution causés par un événement de force majeure au sens de l’article 1218 du Code civil.')}
    ${art(15, 'Droit applicable et litiges', 'Le contrat est soumis au droit français. Les parties recherchent d’abord une solution amiable. À défaut d’accord dans un délai de trente jours, le litige est porté devant les tribunaux compétents de <span class="fill">[ville]</span>.')}
    <p class="small" style="margin-top:7mm">Fait en deux exemplaires, à <span class="fill">[ville]</span>, le <span class="fill">[JJ/MM/AAAA]</span>. Annexe : devis n° <span class="fill">[D-2026-001]</span>.</p>
    <div class="sign"><div class="box" style="height:42mm"><b>Le Prestataire — AS Marketing Agency</b>Nom, date et signature</div><div class="box" style="height:42mm"><b>Le Client</b>Nom, qualité, date et signature, précédés de la mention « Lu et approuvé »</div></div>
    <div class="note" style="margin-top:9mm"><b>En résumé.</b> Vous avez vu votre projet avant de signer. Le prix est celui du devis. Une fois réglés, les livrables vous appartiennent. Vos données restent les vôtres.</div>` },
]);

/* ---------- 6. Brief de démarrage ---------- */
const q = (n, t, p, l) => `<div class="q"><h3><span>${n}</span>${t}</h3>${p ? `<p>${p}</p>` : ''}${lines(l)}</div>`;
const brief = doc('Brief de démarrage', [
  { html: `${top('Brief de démarrage', 'Dix minutes pour tout nous dire')}
    <h1>Parlez-nous de <em>votre projet.</em></h1><p class="lead">Répondez avec vos mots, sans chercher à être complet. On s’occupe de transformer vos réponses en première version.</p>
    <div class="inline" style="margin-top:4mm"><label>Entreprise<i></i></label><label>Votre nom<i></i></label><label>E-mail<i></i></label><label>Téléphone<i></i></label></div>
    <div class="q"><h3><span>1</span>Votre projet</h3><ul class="checks"><li>Application métier</li><li>Site web</li><li>Logo &amp; identité</li><li>Publicités &amp; réseaux sociaux</li><li>Je ne sais pas encore</li></ul></div>
    ${q(2, 'Votre activité, en deux phrases', 'Ce que vous faites, pour qui, avec combien de personnes.', 3)}
    ${q(3, 'Ce qui vous fait perdre du temps aujourd’hui', 'Les fichiers, les ressaisies, les oublis, les appels : racontez une journée type.', 3)}
    ${q(4, 'Ce que vous aimeriez pouvoir faire', 'Le résultat idéal, même s’il vous paraît ambitieux.', 3)}
    ${q(5, 'Les outils que vous utilisez déjà', 'Excel, logiciel de caisse, agenda, messagerie, site actuel…', 2)}` },
  { html: `${top('Brief de démarrage', 'Dix minutes pour tout nous dire')}
    ${q(6, 'Qui va s’en servir ?', 'Vous, votre équipe, vos clients ? Sur ordinateur, sur tablette, sur téléphone ?', 2)}
    ${q(7, 'Des exemples que vous aimez', 'Un site, une application ou une marque qui vous plaît, et pourquoi.', 2)}
    <div class="q"><h3><span>8</span>Votre image</h3><ul class="checks"><li>J’ai déjà un logo</li><li>J’ai des couleurs à respecter</li><li>J’ai des photos</li><li>Tout est à créer</li></ul>${lines(2)}</div>
    ${q(9, 'Ce qu’il ne faut surtout pas', 'Les couleurs, les styles ou les fonctions dont vous ne voulez pas.', 2)}
    <div class="q"><h3><span>10</span>Votre calendrier</h3><ul class="checks"><li>Dès que possible</li><li>Dans le mois</li><li>Dans le trimestre</li><li>Pas d’urgence</li></ul><div class="inline"><label>Date importante à respecter<i></i></label><label>Meilleur moment pour vous joindre<i></i></label></div></div>
    ${q(11, 'Autre chose à nous dire ?', '', 2)}
    <div class="contact"><div><h3>C’est tout. <em>On s’y met.</em></h3><p>Renvoyez ce document à <b>as.agency.off@gmail.com</b>, ou décrivez votre projet sur <b>asagency.store</b>. Première version sous 72 h.</p></div><img src="${I('qr.jpg')}"></div>` },
]);

const DOCS = [['01-guide-de-bienvenue', bienvenue], ['02-nos-offres', offres], ['03-devis', devis], ['04-contrat-de-prestation', contrat], ['05-facture', facture], ['06-brief-de-demarrage', brief]];

(async () => {
  const browser = await L.chromium.launch();
  // visuel de couverture : le mur du site, fondu vers le haut
  const P = await L.pieces(browser, TMP, [{ name: 'cover', w: 1050, h: 750, css: '.hero__title,.hero__cue{display:none!important}.hero__veil{background:linear-gradient(180deg,#0a0a0f 0%,rgba(10,10,15,.72) 26%,rgba(10,10,15,.05) 62%,rgba(10,10,15,.75) 100%)!important}.hero__sticky{background:#0a0a0f!important}' }]);
  const S = (n) => path.join(L.SITE, 'img', n);
  flat([
    [P.cover.replace('file://', ''), path.join(TMP, 'cover.jpg'), 1800, '#0a0a0f'],
    [S('logo-mark.webp'), path.join(TMP, 'logo-blanc.jpg'), 600, '#ffffff'],
    [S('logo-mark-light.webp'), path.join(TMP, 'logo-noir.jpg'), 600, '#0a0a0f'],
    [S('shots/app-projets-dash.webp'), path.join(TMP, 'o-app.jpg'), 700, '#ffffff'],
    [S('shots/site-brume.webp'), path.join(TMP, 'o-site.jpg'), 700, '#ffffff'],
    [S('shots/ad-solstice-carre.webp'), path.join(TMP, 'o-pub.jpg'), 700, '#ffffff'],
  ]);
  // QR code et planche de logos rendus en image (pas de SVG transparent dans le PDF)
  const mini = `<!doctype html><meta charset="utf-8"><style>*{margin:0;box-sizing:border-box}body{width:900px;background:#0a0a0f}
    .qr{width:400px;height:400px;padding:34px;background:#fff;border-radius:40px}.qr img{display:block;width:100%}
    .lg{display:grid;grid-template-columns:1fr 1fr;width:700px;height:392px}.lg div{display:grid;place-items:center}.lg img{max-width:62%;max-height:44%}</style>
    <div class="shot qr" data-name="qr"><img src="${L.img('qr-asagency.svg')}"></div>
    <div class="shot lg" data-name="o-logo">${L.LOGOS.filter((l) => ['brume', 'orbe', 'lenoir', 'pepin'].includes(l.slug)).map((l) => `<div style="background:${l.bg}"><img src="${L.img(`logos/${l.slug}.svg`)}"></div>`).join('')}</div>`;
  await L.raster(browser, TMP, mini, { sel: '.shot', w: 900, h: 900, scale: 2, quality: 92 });
  // le QR est posé sur fond sombre : coins arrondis fondus dans la couleur du bloc
  for (const [name, body] of DOCS) {
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>AS Marketing Agency — ${name}</title><link href="${L.FONTS}" rel="stylesheet"><style>${CSS}</style></head><body>${body}</body></html>`;
    const out = path.join(OUT, name + '.pdf');
    await L.htmlToPdf(browser, TMP, name, html, out);
    console.log('✓', path.relative(L.ROOT, out), Math.round(fs.statSync(out).size / 1024), 'Ko');
  }
  await browser.close();
})();
