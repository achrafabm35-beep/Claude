const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/user/Claude/templates';
const IMG = '/home/user/Claude/site/asagency/img';
const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64');
const LOGO_MARK = b64(path.join(IMG, 'logo-mark.png'));
const LOGO_FULL = b64(path.join(IMG, 'logo-full.png'));

const CSS = `
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  :root{ --ink:#141318; --muted:#6b6976; --line:#e6e5ea; --aqua:#1fc6b6; --pink:#e7a6e6;
         --grad:linear-gradient(100deg,#1fc6b6,#8fb0f0 55%,#eaa6e6); }
  body{ font-family: Arial,'Helvetica Neue',Helvetica,sans-serif; color:var(--ink); font-size:11pt; line-height:1.5; }
  .page{ position:relative; width:210mm; min-height:297mm; padding:16mm 15mm 22mm; page-break-after:always; overflow:hidden; }
  .page:last-child{ page-break-after:auto; }
  .grad{ background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .bar{ height:5px; background:var(--grad); border-radius:5px; }
  .doc-head{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10mm; }
  .doc-head img{ height:20mm; }
  .doc-type{ text-align:right; }
  .doc-type h1{ font-size:26pt; letter-spacing:-0.5px; line-height:1; }
  .doc-type .meta{ margin-top:3mm; color:var(--muted); font-size:9.5pt; }
  .doc-type .meta b{ color:var(--ink); }
  .parties{ display:flex; gap:8mm; margin:8mm 0; }
  .party{ flex:1; border:1px solid var(--line); border-radius:10px; padding:5mm; }
  .party h3{ font-size:8pt; letter-spacing:1.5px; text-transform:uppercase; color:var(--aqua); margin-bottom:2.5mm; }
  .party p{ font-size:10pt; color:#333; }
  table.items{ width:100%; border-collapse:collapse; margin-top:4mm; font-size:10pt; }
  table.items th{ text-align:left; background:#faf9fb; border-bottom:2px solid var(--line); padding:3mm; font-size:8.5pt; letter-spacing:.5px; text-transform:uppercase; color:var(--muted); }
  table.items th.r, table.items td.r{ text-align:right; }
  table.items td{ padding:3mm; border-bottom:1px solid var(--line); }
  .totals{ margin-left:auto; margin-top:5mm; width:72mm; font-size:10.5pt; }
  .totals .row{ display:flex; justify-content:space-between; padding:2mm 0; }
  .totals .grand{ border-top:2px solid var(--ink); margin-top:1mm; padding-top:3mm; font-size:13pt; font-weight:bold; }
  .totals .grand span:last-child{ background:var(--grad); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .note{ margin-top:8mm; font-size:9pt; color:var(--muted); }
  .note b{ color:var(--ink); }
  .sign{ display:flex; gap:8mm; margin-top:12mm; }
  .sign .box{ flex:1; border:1px dashed #c9c8d0; border-radius:10px; padding:5mm; height:34mm; }
  .sign .box small{ color:var(--muted); font-size:8.5pt; }
  .foot{ position:absolute; left:15mm; right:15mm; bottom:10mm; border-top:1px solid var(--line); padding-top:3mm;
         display:flex; justify-content:space-between; font-size:8pt; color:var(--muted); }
  h2.sec{ font-size:13pt; margin:7mm 0 3mm; }
  .article{ margin:5mm 0; }
  .article h3{ font-size:11pt; margin-bottom:1.5mm; }
  .article p{ font-size:10pt; color:#333; }
  .fill{ color:#9a98a5; }
  ul.clean{ list-style:none; } ul.clean li{ padding:2mm 0 2mm 7mm; position:relative; font-size:10pt; }
  ul.clean li:before{ content:"✓"; position:absolute; left:0; color:var(--aqua); font-weight:bold; }
`;

const EMET = `AS Marketing Agency<br>[Adresse — rue, CP, ville]<br>as.agency.off@gmail.com · [Téléphone]<br>SIRET [000 000 000 00000] · [TVA intracom]`;
const foot = 'AS Marketing Agency · as.agency.off@gmail.com · asagency.store';

const head = (type, metaRows) => `
  <div class="doc-head">
    <img src="${LOGO_MARK}" alt="AS">
    <div class="doc-type"><h1 class="grad">${type}</h1><div class="meta">${metaRows}</div></div>
  </div><div class="bar"></div>`;

const parties = (clientTitle='Client') => `
  <div class="parties">
    <div class="party"><h3>Émetteur</h3><p>${EMET}</p></div>
    <div class="party"><h3>${clientTitle}</h3><p class="fill">[Nom du client]<br>[Société]<br>[Adresse]<br>[Email] · [Téléphone]</p></div>
  </div>`;

const itemsTable = () => `
  <table class="items">
    <thead><tr><th>Description</th><th class="r">Qté</th><th class="r">Prix unit. HT</th><th class="r">Total HT</th></tr></thead>
    <tbody>
      <tr><td>[Prestation 1 — ex. Gestion réseaux sociaux (forfait Pro)]</td><td class="r">1</td><td class="r">[249,00 €]</td><td class="r">[249,00 €]</td></tr>
      <tr><td>[Prestation 2 — ex. Création de logo &amp; identité]</td><td class="r">1</td><td class="r">[110,00 €]</td><td class="r">[110,00 €]</td></tr>
      <tr><td>[Prestation 3 — ex. Site vitrine one-page]</td><td class="r">1</td><td class="r">[110,00 €]</td><td class="r">[110,00 €]</td></tr>
      <tr><td class="fill">[…]</td><td class="r fill">—</td><td class="r fill">—</td><td class="r fill">—</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Total HT</span><span>[469,00 €]</span></div>
    <div class="row"><span>TVA (20%)</span><span>[93,80 €]</span></div>
    <div class="row grand"><span>Total TTC</span><span>[562,80 €]</span></div>
  </div>`;

// ---------- 1. DEVIS ----------
const devis = `
${head('DEVIS', 'N° <b>[DEV-2026-001]</b><br>Date : <b>[JJ/MM/AAAA]</b><br>Validité : <b>[30 jours]</b>')}
${parties()}
${itemsTable()}
<div class="note">
  <p><b>Conditions :</b> Acompte de [30%] à la commande, solde à la livraison. Devis valable [30 jours] à compter de sa date d'émission.</p>
  <p style="margin-top:2mm"><b>Règlement :</b> Virement bancaire — IBAN [FR76 0000 0000 0000 0000 0000 000] · BIC [XXXXXXXX].</p>
  <p style="margin-top:2mm" class="fill">[TVA non applicable, art. 293 B du CGI — à supprimer si assujetti à la TVA]</p>
</div>
<div class="sign">
  <div class="box"><small>Le prestataire — AS Marketing Agency</small></div>
  <div class="box"><small>Bon pour accord — Le client (date + signature + « Bon pour accord »)</small></div>
</div>
<div class="foot"><span>${foot}</span><span>Devis</span></div>`;

// ---------- 2. FACTURE ----------
const facture = `
${head('FACTURE', 'N° <b>[FAC-2026-001]</b><br>Date : <b>[JJ/MM/AAAA]</b><br>Échéance : <b>[JJ/MM/AAAA]</b>')}
${parties()}
${itemsTable()}
<div class="note">
  <p><b>Règlement à réception</b> par virement — IBAN [FR76 0000 0000 0000 0000 0000 000] · BIC [XXXXXXXX].</p>
  <p style="margin-top:2mm">En cas de retard : pénalités au taux légal + indemnité forfaitaire de recouvrement de 40 € (art. L441-10 C. com.). Pas d'escompte pour paiement anticipé.</p>
  <p style="margin-top:2mm" class="fill">[TVA non applicable, art. 293 B du CGI — à supprimer si assujetti à la TVA]</p>
</div>
<div class="foot"><span>${foot}</span><span>Facture</span></div>`;

// ---------- 3. CONTRAT ----------
const art = (t, c) => `<div class="article"><h3>${t}</h3><p>${c}</p></div>`;
const contrat = `
${head('CONTRAT', 'Contrat de prestation de services<br>Réf. <b>[CT-2026-001]</b> · Date : <b>[JJ/MM/AAAA]</b>')}
<h2 class="sec">Entre les soussignés</h2>
<div class="parties">
  <div class="party"><h3>Le Prestataire</h3><p>${EMET}</p></div>
  <div class="party"><h3>Le Client</h3><p class="fill">[Nom / Société]<br>[Adresse]<br>[Représentant légal]<br>[Email] · [Téléphone]</p></div>
</div>
${art('Article 1 — Objet','Le présent contrat définit les conditions dans lesquelles le Prestataire réalise pour le Client les prestations décrites à l’article 2.')}
${art('Article 2 — Prestations','<span class="fill">[Détail des prestations : réseaux sociaux, branding, site web, automatisations, etc. Livrables, quantités, périmètre.]</span>')}
${art('Article 3 — Durée','Le contrat prend effet le [JJ/MM/AAAA] pour une durée de [ … ] / pour la durée de la mission. Renouvellement [par tacite reconduction / non].')}
${art('Article 4 — Prix et modalités de paiement','Montant : [ … € HT]. Acompte de [30%] à la signature, solde selon échéancier. Paiement par virement sous [30] jours.')}
${art('Article 5 — Obligations du prestataire','Le Prestataire s’engage à réaliser les prestations avec soin et dans les délais convenus (obligation de moyens).')}
${art('Article 6 — Obligations du client','Le Client fournit en temps utile tous les éléments (contenus, accès, validations) nécessaires à la bonne exécution.')}
${art('Article 7 — Propriété intellectuelle','Les livrables validés et intégralement payés sont cédés au Client. Le Prestataire conserve le droit de citer la réalisation dans ses références sauf demande contraire.')}
<div class="foot"><span>${foot}</span><span>Contrat — page 1/2</span></div>
</div>
<div class="page">
${art('Article 8 — Confidentialité','Chaque partie s’engage à garder confidentielles les informations échangées pendant et après la mission.')}
${art('Article 9 — Résiliation','En cas de manquement non réparé sous [15] jours après mise en demeure, le contrat peut être résilié de plein droit. Les prestations réalisées restent dues.')}
${art('Article 10 — Droit applicable & litiges','Le présent contrat est soumis au droit français. À défaut d’accord amiable, compétence est attribuée aux tribunaux de [ville].')}
<div class="sign">
  <div class="box"><small>Le Prestataire — AS Marketing Agency<br>Date + signature + cachet</small></div>
  <div class="box"><small>Le Client<br>Date + signature + « Lu et approuvé »</small></div>
</div>
<div class="foot"><span>${foot}</span><span>Contrat — page 2/2</span></div>`;

// ---------- 4. PLAQUETTE ----------
const service = (t, d) => `<div class="party" style="border-radius:12px"><h3 style="color:var(--ink);font-size:11pt;letter-spacing:0;text-transform:none">${t}</h3><p style="color:var(--muted);font-size:9.5pt;margin-top:1mm">${d}</p></div>`;
const plaquette = `
<div style="position:absolute;inset:0;background:linear-gradient(160deg,#f2fbfa,#f7f0fb)"></div>
<div style="position:relative;text-align:center;padding-top:35mm">
  <img src="${LOGO_FULL}" style="width:120mm;display:block;margin:0 auto">
  <p style="font-size:16pt;margin-top:6mm" class="grad">Votre présence digitale, boostée.</p>
  <p style="color:var(--muted);max-width:130mm;margin:6mm auto 0;font-size:11pt">Agence marketing &amp; création : réseaux sociaux, branding, sites web, automatisations, apps et email marketing — tout pour exister en ligne et convertir.</p>
</div>
<div class="foot"><span>${foot}</span><span>Plaquette de présentation</span></div>
</div>
<div class="page">
${head('SERVICES', 'Ce que nous faisons pour vous')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm;margin-top:8mm">
  ${service('Réseaux sociaux','Stratégie, création et gestion de vos comptes. Des contenus qui captent l’attention.')}
  ${service('Branding &amp; identité','Logo, charte graphique, templates et éléments visuels cohérents.')}
  ${service('Création de sites web','Vitrines, landing pages et e-commerce, optimisés SEO et pensés pour convertir.')}
  ${service('Automatisations','Des workflows sur mesure qui vous font gagner des heures chaque semaine.')}
  ${service('Développement d’apps','Outils internes, SaaS, portails clients et dashboards sur mesure.')}
  ${service('Email marketing','Newsletters, séquences automatisées et campagnes qui convertissent.')}
</div>
<h2 class="sec" style="margin-top:10mm">Pourquoi AS ?</h2>
<div style="display:flex;gap:6mm;margin-top:3mm">
  <div style="flex:1;text-align:center"><div style="font-size:24pt;font-weight:bold" class="grad">+340%</div><small style="color:var(--muted)">engagement Instagram</small></div>
  <div style="flex:1;text-align:center"><div style="font-size:24pt;font-weight:bold" class="grad">72h</div><small style="color:var(--muted)">pour livrer un site</small></div>
  <div style="flex:1;text-align:center"><div style="font-size:24pt;font-weight:bold" class="grad">24h</div><small style="color:var(--muted)">pour une proposition</small></div>
</div>
<p style="text-align:center;margin-top:12mm;font-size:12pt">Parlons de votre projet → <b>as.agency.off@gmail.com</b> · <b>asagency.store</b></p>
<div class="foot"><span>${foot}</span><span>Plaquette de présentation</span></div>`;

// ---------- 5. MEDIA KIT / TARIFS ----------
const tarifs = `
${head('OFFRE &amp; TARIFS', 'Abonnements &amp; prestations à la demande<br><b>−50% offre de lancement</b>')}
<h2 class="sec" style="margin-top:6mm">Abonnements mensuels</h2>
<div style="display:flex;gap:6mm;margin-top:3mm">
  <div class="party" style="flex:1;border-radius:14px">
    <h3 style="color:var(--ink);font-size:14pt;letter-spacing:0;text-transform:none">Starter</h3>
    <p style="margin:2mm 0"><s style="color:var(--muted)">199€</s> <b style="font-size:20pt">99€</b><span style="color:var(--muted)">/mois</span></p>
    <ul class="clean"><li>1 réseau social</li><li>8 posts / mois</li><li>Création visuels + textes</li><li>Reporting mensuel</li></ul>
  </div>
  <div class="party" style="flex:1;border-radius:14px;border-color:var(--aqua);background:linear-gradient(160deg,#effcfa,#fbeffb)">
    <h3 style="color:var(--ink);font-size:14pt;letter-spacing:0;text-transform:none">Pro <span class="grad" style="font-size:9pt">★ le plus choisi</span></h3>
    <p style="margin:2mm 0"><s style="color:var(--muted)">499€</s> <b style="font-size:20pt">249€</b><span style="color:var(--muted)">/mois</span></p>
    <ul class="clean"><li>3 réseaux sociaux</li><li>20 posts / mois</li><li>Stratégie + calendrier éditorial</li><li>Automatisations incluses</li><li>Support prioritaire</li></ul>
  </div>
</div>
<h2 class="sec" style="margin-top:9mm">À la demande — prix fixes</h2>
<table class="items"><tbody>
  <tr><td>Logo &amp; identité</td><td class="r"><b>110€</b></td></tr>
  <tr><td>Site one-page</td><td class="r"><b>110€</b></td></tr>
  <tr><td>Site multi-pages</td><td class="r"><b>230€</b></td></tr>
  <tr><td>Automatisation sur mesure</td><td class="r"><b>290€</b></td></tr>
  <tr><td class="fill">[Autre prestation — à préciser]</td><td class="r fill">[ … €]</td></tr>
</tbody></table>
<p style="text-align:center;margin-top:12mm;font-size:12pt">Une question ? → <b>as.agency.off@gmail.com</b> · <b>asagency.store</b></p>
<div class="foot"><span>${foot}</span><span>Offre &amp; tarifs</span></div>`;

const docs = [
  ['01-devis',    devis],
  ['02-facture',  facture],
  ['03-contrat',  contrat],
  ['04-plaquette',plaquette],
  ['05-offre-tarifs', tarifs],
];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();
  for (const [name, body] of docs) {
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="page">${body}</div></body></html>`;
    fs.writeFileSync(path.join(OUT, name + '.html'), html);
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({ path: path.join(OUT, name + '.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log('PDF:', name + '.pdf');
  }
  await browser.close();
})();
