# Aggiornamento V389 - Soccer Data assets cleanup + stats import base

- Runtime atteso: V389.
- Branch di lavoro: `refactor/260528-zonaorientale-next`.
- Soccer Data resta solo admin e continua a usare `assets/soccer-data/fbref-player-map.v383.json`.
- Asset pubblici Soccer Data ridotti a `manifest.json`, `fbref-player-map.v383.json` e `stats/manifest.json`.
- Storico mapping/review spostato in `docs/zonaorientale/archive/soccer-data/mapping-history/`.
- Aggiunta struttura stats import per futuri JSON statici offline; nessun dato statistico reale importato in V389.
- Nessuna scrittura Firebase, nessuno scraping live, nessuna modifica a `FUNZIONALITA'.md`.
- Audit principale: `node tools/audit-soccer-data-assets-cleanup-v389.mjs`.

---

# Aggiornamento V386 - Soccer Data solo admin

- Runtime atteso: V386.
- Branch di lavoro: `refactor/260528-zonaorientale-next`.
- Soccer Data e ora visibile/attivabile solo dagli admin.
- I link desktop e mobile `Soccer Data` usano `nav-link-admin hidden`; l'accesso diretto `#soccerdata` viene bloccato ai non-admin.
- Il manifest/mapping Soccer Data non viene caricato per utenti non-admin.
- I link giocatore FBref nella colonna `FBref / Giocatore` sono verdi (`var(--primary)`).
- Mapping invariato: `assets/soccer-data/fbref-player-map.v383.json`.
- La patch locale V385 resta disponibile per gli admin.
- Nessuna scrittura Firebase, nessuno scraping live, nessuna modifica a `FUNZIONALITA'.md`.
- Audit principale: `node tools/audit-soccer-data-admin-only-v386.mjs`.

# Aggiornamento V385 - Soccer Data associazione FBref locale

- Runtime atteso: V385.
- Soccer Data continua a usare `fbref-player-map.v383.json`.
- Mapping dati invariato: 531/532 confermati e 1 needs-review (`Balentien`).
- Per i giocatori da associare e stato aggiunto un mini flusso locale: cerca FBref, incolla link, nome opzionale, prepara mapping, copia/rimuovi patch.
- A livello sezione sono disponibili `Copia patch FBref` e `Scarica patch FBref`.
- La patch resta locale/export JSON; nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# Aggiornamento V384 - Soccer Data table cleanup

- Runtime atteso: V384.
- Soccer Data continua a usare `fbref-player-map.v383.json`.
- Mapping dati invariato: 531/532 confermati e 1 needs-review (`Balentien`).
- La tabella mostra `FBref / Giocatore` come prima colonna.
- Il nome listone resta un dettaglio secondario per tracciabilita.
- La colonna `Azione` e stata rimossa; `Cerca FBref` e `Copia riga` restano solo sui needs-review/non mappati.
- Nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# Aggiornamento V383 - Soccer Data FBref batch-11 finale

- Runtime atteso: V383.
- Soccer Data usa `fbref-player-map.v383.json`.
- Mapping confermati: 531/532.
- Batch completati: batch-01 ... batch-11 finale.
- Residuo needs-review: Balentien, senza profilo FBref stabile verificabile.
- Asteriscati esclusi: 131.
- Nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# Aggiornamento V382 - Soccer Data FBref batch-08

- Runtime atteso: V382.
- Soccer Data usa `fbref-player-map.v380.json`.
- Mapping confermati: 400/532.
- Batch completati: batch-01 ... batch-08.
- Asteriscati esclusi: 131.
- Nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# Aggiornamento V379 - Soccer Data FBref batch-07

- Runtime atteso: V379.
- Soccer Data usa `fbref-player-map.v379.json`.
- Mapping confermati: 350/532.
- Batch completati: batch-01 ... batch-07.
- Asteriscati esclusi: 131.
- Nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# Aggiornamento V378 - Soccer Data FBref batch-06

- Runtime atteso: V378.
- Soccer Data usa `fbref-player-map.v374.json`.
- Mapping confermati: 100/532.
- Batch completati: batch-01 e batch-06.
- Asteriscati esclusi: 131.
- Nessuna scrittura Firebase e nessuno scraping live browser.
- `FUNZIONALITA'.md` non modificato.

---

# AI handoff ZonaOrientale current - V373 Soccer Data FBref batch-01

## Stato

La repo contiene la release V372: Soccer Data mapping assistito.

## Non rompere

Preservare tutte le funzionalita esistenti: Admin, Area squadra, trattative, simulazioni, dashboard presidente, centro notifiche, listone, rose, competizioni, calciomercato, player page.

## Soccer Data

V371 ha creato la shell. V372 aggiunge mapping assistito per associare solo i giocatori a listone con FBref.

File chiave:

- `static/zonaorientale/assets/soccer-data/manifest.json`
- `static/zonaorientale/assets/soccer-data/fbref-player-map.v372.json`
- `static/zonaorientale/assets/soccer-data/fbref-player-map.v372.csv`
- `static/zonaorientale/assets/soccer-data/fbref-review-batch.v372.csv`
- `static/zonaorientale/tools/audit-soccer-data-mapping-v372.mjs`

## Prossimo passo

V373: procedere con primo batch di associazioni FBref confermate. Non importare statistiche finche il mapping non e affidabile.


## V373 Soccer Data FBref batch-01

- Aggiunti 50 mapping FBref confermati per il batch-01.
- Scope invariato: solo `IN_LISTONE`, nessuno scraping live, nessuna scrittura Firebase.
- Gate: `node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v373.mjs`.


## V382 Soccer Data FBref batch-09

- Mapping confermati: 450 su 532 giocatori IN_LISTONE.
- Nessuna scrittura Firebase e nessuno scraping live.
- Funzionalita esistenti preservate.


## V382 Soccer Data FBref batch-10

- Mapping confermati: 500 su 532 giocatori IN_LISTONE.
- Restano 32 mapping da completare.
- Nessuna scrittura Firebase e nessuno scraping live.
- Funzionalita esistenti preservate.
