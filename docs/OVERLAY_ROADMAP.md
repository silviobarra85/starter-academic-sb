# Overlay roadmap

## Stato corrente

V570 - Strumento resize colonne tabelle giocatori completato.

## Ultima decisione

La V559 ha introdotto il preloader multi-lega, ma poteva chiudersi quando i tasti non erano ancora pronti. La V560 sposta la chiusura su un readiness piu' tardivo: render app, `window.load`, controlli DOM essenziali e quiet frame del main thread. Ruota solo l'anello della rotellina, non il numero.

## Overlay previsti

0 overlay previsti.

Da qui procedere solo con bugfix mirati o nuova roadmap esplicita.

## Guardrail permanenti

- Overlay unico whole-site.
- Solo file modificati.
- Aggiornare docs e handoff a ogni overlay.
- Non modificare FUNZIONALITA'.md senza richiesta esplicita.
- Preservare Firebase, EmailJS, Admin, Presidente.
- Preservare asset condivisi Listoni/Calciomercato in fanta-engine.
- Non reintrodurre i layer runtime pesanti rimossi/disattivati in V558 senza prova misurata.

## V561 - Calciomercato disattivato e feed articoli bloccato

Stato: completato.

- Rimossa la sezione Calciomercato dalle due leghe.
- Bloccato il recupero articoli live/statico e resa no-op la Netlify Function `calciomercato-feed`.
- Preservati News/comunicati interni, Admin, Presidente, Listone, Rose, Fantamercato e preloader V560.
- Audit: `node static/fanta-engine/tools/audit-calciomercato-disabled-v561.mjs`.


## V562 - Svincola Giocatori ZonaOrientale

Stato: completato.

- Riattivata la card presidente `Svincola Giocatori` su ZonaOrientale tramite feature registry.
- Allineata la config ZonaOrientale a V562 e alla stagione corrente `2026-2027`.
- Preservata la disattivazione Calciomercato V561: nessuna sezione e nessun recupero articoli.
- Audit: `node static/fanta-engine/tools/audit-zona-release-players-v562.mjs`.

## V563 - Svincola Giocatori ZonaOrientale runtime fix
- Corregge la riattivazione V562: il pannello Svincola Giocatori viene abilitato gia nel bootstrap del registry card V497 e riagganciato dopo i render dell'Area Presidente.
- Mantiene Calciomercato disattivato come da V561.
- Non modifica FantaPetilloMantraManager.

## V564 - Header Svincola Giocatori allineato

Stato: completato.

- Patch solo presentazionale su ZonaOrientale.
- Titolo/descrizione del pannello Svincola Giocatori a sinistra.
- Pulsante `Apri`/`Riduci` a destra.
- Runtime V563, EmailJS, permessi Presidente e Calciomercato disattivato preservati.
- Audit: `node static/fanta-engine/tools/audit-zona-release-header-v564.mjs`.

## V565 - Logo account presidente coerente con stagione

Stato: completato.

- Patch runtime solo su ZonaOrientale.
- Il pulsante account presidente in alto risolve il logo dal `seasonTeam` della stagione selezionata.
- Se il presidente passa da `2026-2027` a `2025-2026`, il logo torna quello storico e resta visibile la label `Pres. <cognome>`.
- V561, V563 e V564 preservate.
- Audit: `node static/fanta-engine/tools/audit-president-account-season-logo-v565.mjs`.


## V566 - Footer ZonaOrientale da config allineato

Stato: completato.

- Corregge il disallineamento per cui l'HTML di `index.html` riportava V565 ma il runtime sovrascriveva il footer con V563 leggendo `assets/league-config.json`.
- Allinea `currentVersion`, fallback `league-config-v443.js`, cache-buster e footer di `index.html`, `competition.html` e `player.html` a V566.
- Preserva Calciomercato disattivato V561, Svincola Giocatori V563, layout V564 e logo account presidente V565.
- Audit: `node static/fanta-engine/tools/audit-zona-footer-config-v566.mjs`.

## V567 - Prima colonna Rose/Area Squadra opaca da mobile

Stato: completato.

- Patch CSS comune mobile-only per entrambe le leghe.
- La prima colonna sticky delle tabelle Rose e Area Squadra usa sfondi opachi, evitando la sovrapposizione visiva dei testi durante lo scroll orizzontale.
- Nessuna modifica a dati, Firebase, EmailJS, permessi, snapshot o funzioni Netlify.
- Audit: `node static/fanta-engine/tools/audit-roster-sticky-first-col-v567.mjs`.

## V568 - Tabelle giocatori mobile adattive e separate

Stato: completato.

- Patch CSS comune mobile-only per entrambe le leghe.
- Regole separate per Area Squadra, Rose espanse e Listone, cosi' ogni tabella puo' essere rifinita senza influenzare le altre.
- La prima colonna della rosa in Area Squadra mantiene sfondo sticky/opaco e non tronca piu' il nome giocatore.
- Tutte le celle delle tabelle giocatori sono allineate a sinistra, incluse celle numeriche e pulsanti sort.
- Le colonne usano layout automatico e larghezza guidata dal contenuto piu' lungo, con scroll orizzontale mobile.
- V567 resta caricata per preservare la prima colonna opaca.
- Audit: `node static/fanta-engine/tools/audit-roster-mobile-column-fit-v568.mjs`.


## V569 - Prima colonna rosa Area Squadra mobile compatta

Stato: completato.

- Patch CSS comune mobile-only per entrambe le leghe.
- Riduce la prima colonna sticky della rosa in Area Squadra / profilo squadra a `clamp(6.25rem, 30vw, 9rem)`, circa 70% piu compatta rispetto all'espansione libera di V568.
- Mantiene sfondo opaco/sticky e consente al nome giocatore di andare a capo senza ellissi.
- Scope isolato: non modifica direttamente Rose espanse e Listone, che restano gestiti da V568.
- Audit: `node static/fanta-engine/tools/audit-teamarea-roster-first-col-v569.mjs`.

## V570 - Strumento resize colonne tabelle giocatori

Stato: completato.

- Aggiunge un tool opt-in per ridimensionare colonne in Area Squadra, Rose e Listone.
- Attivazione: `?resizeTabelle=1`.
- Le misure vengono stampate in DevTools Console con snippet CSS copiabile.
- Lo strumento e' disattivato di default e non modifica la navigazione ordinaria.
- Audit: `node static/fanta-engine/tools/audit-table-column-resizer-v570.mjs`.

## V571 - Indicatori resize colonne mobile

Stato: completato.

- Migliora il tool opt-in V570 con maniglie visibili `<>` sulle intestazioni delle colonne.
- Maniglie piu grandi e touch-friendly da mobile.
- Badge live con larghezza corrente durante il trascinamento.
- La Console DevTools stampa ancora misure e CSS al rilascio.
- Scope invariato: Area Squadra, Rose espanse e Listone; nessun impatto in navigazione normale.
- Audit: `node static/fanta-engine/tools/audit-table-column-resizer-v571.mjs`.
