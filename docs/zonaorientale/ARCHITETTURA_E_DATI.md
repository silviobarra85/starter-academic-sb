# Architettura e dati ZonaOrientale

Stato: V219.

## Tipo applicazione

ZonaOrientale e' una webapp statica:

- HTML/CSS/JS puro;
- nessun build system;
- Firebase usato lato browser;
- dati pubblici pesanti serviti soprattutto da JSON statici.

Percorso in repo:

```text
static/zonaorientale/
```

## Entry point e pagine

```text
index.html          pagina principale / SPA con hash route
competition.html    pagina singola competizione
player.html         scheda giocatore
news.html           pagina comunicati/news
assets/app.js       bundle principale
assets/styles.css   CSS principale
```

## CSS principali

```text
assets/styles.css
assets/css/components-v130.css
assets/css/admin-v130.css
assets/css/transfer-market-v130.css
assets/css/competition-detail-v130.css
assets/css/mobile-suite-v168.css
assets/css/mobile-hotfix-v166.css
assets/css/mobile-hotfix-v167.css
```

La UI mobile e' stata stratificata da molte versioni: prima di cambiare un componente mobile controllare sia `styles.css` sia `mobile-suite-v168.css`.

## Moduli JavaScript principali

Core:

```text
assets/js/core/state.js
assets/js/core/dom.js
assets/js/core/utils.js
assets/js/core/formatters.js
assets/js/core/ui.js
assets/js/core/constants.js
```

Data:

```text
assets/js/data/firestore-service.js
assets/js/data/static-files-service.js
```

Domain:

```text
assets/js/domain/competitions.js
assets/js/domain/entities.js
assets/js/domain/fm-movements.js
assets/js/domain/labels.js
assets/js/domain/listone.js
assets/js/domain/matches.js
assets/js/domain/news.js
assets/js/domain/rosters.js
assets/js/domain/team-logos.js
```

Admin:

```text
assets/js/admin/admin-competitions.js
assets/js/admin/admin-users.js
assets/js/admin/listone-converter.js
assets/js/admin/public-snapshots.js
```

Mobile:

```text
assets/js/mobile/mobile-viewport.js
assets/js/mobile/mobile-scrollbar.js
assets/js/mobile/mobile-tables.js
assets/js/mobile/mobile-rosters.js
```

Refactor recenti:

```text
assets/js/refactor/live-data-archive-v209.js
assets/js/refactor/admin-communication-generator-v210.js
assets/js/refactor/historical-stats-compare-v211.js
assets/js/refactor/president-dashboard-rosters-v212.js
assets/js/refactor/admin-publication-workflow-v213.js
```

## Ordine di lettura dati pubblici

All'avvio pubblico il sito prova prima a leggere i file statici:

```text
1. assets/public/config.json
2. assets/snapshots/seasons/manifest.json
3. assets/snapshots/seasons/<stagione>.json
4. assets/snapshots/honor.json
5. assets/listoni/manifest.json + file listone
6. assets/rose/manifest.json + file rose
7. assets/competitions/manifest.json + competizioni statiche
```

Queste sono letture HTTP, quindi non consumano letture Firebase.

Se un JSON statico manca o non e' valido, il sito puo usare Firebase come fallback.

## `assets/public/config.json`

Contiene:

```text
- stagione corrente
- stagioni disponibili
- impostazioni pubbliche base
```

Se esiste ed e' valido, evita letture Firebase per `leagueSettings` e `seasons`.

## Snapshot stagione

Percorsi:

```text
assets/snapshots/seasons/manifest.json
assets/snapshots/seasons/2025-2026.json
```

Contengono dati pubblici della stagione:

```text
squadre
presidenti
stadi
competizioni
partite
risultati
rose
movimenti FM
news pubbliche
```

Fallback Firebase:

```text
publicSeasonSnapshots/{seasonId}
```

## Honor / Albo / Palmares / FIFA

Percorso statico:

```text
assets/snapshots/honor.json
```

Fallback Firebase:

```text
publicSnapshots/honor
```

## Listone

Percorsi:

```text
assets/listoni/manifest.json
assets/listoni/<file>.json
```

E' pensato come dato statico.

## Rose

Percorsi:

```text
assets/rose/manifest.json
assets/rose/<file>.json
```

Le rose pubbliche sono statiche. Dopo import Excel bisogna aggiornare anche gli snapshot stagione se i dati pubblici devono riflettere le nuove rose.

## Competizioni statiche

Percorsi:

```text
assets/competitions/manifest.json
assets/competitions/<stagione>/<competizione>.json
```

Usate per calendario/dettaglio competizioni quando disponibili.

## Firebase live/lazy

Firebase resta necessario per:

- comunicati/news live;
- trasferibili e trattative mercato;
- richieste e utenti presidente;
- admin completo;
- fallback snapshot quando manca JSON statico.

Il caricamento admin completo non deve partire per i visitatori pubblici: va avviato solo da Admin tramite `Carica dati amministrazione`.

## Classifica competizione di campionato

Formato visuale richiesto:

```text
POS, SQUADRA, PUNTI, PG, V, N, P, GF, GS, DR, FPT
```

Campi canonici consigliati:

```text
position
teamId
teamName
points
played
wins
draws
losses
goalsFor
goalsAgainst
goalDifference
fantapoints
```

La resa pubblica deve supportare alias legacy per evitare regressioni su vecchi snapshot.

Da mobile la tabella non deve perdere colonne: usare scroll orizzontale, non conversione a card che nasconde dati.

## Hash route importanti

Questi hash sono pagine statiche/route note e non slug squadra:

```text
#stats
#archive
#compare
#competitions
#listone
#rosters
#admin
#market
```

In V218/V219 sono stati aggiunti `stats`, `archive`, `compare` alla logica degli hash statici.

## Catene di compatibilita da non rompere

Archivio:

```text
V193 helper stagioni
V196 helper archivio base
V204 snapshot stagione selezionata
V209 modulo live-data/archive
V218 renderAll richiama Archivio
V219 ripristino helper mancanti
```

Statistiche/Confronta:

```text
V193/V195 helper storici
V211 modulo historical-stats-compare
V218 installazione effettiva nel bootstrap
```

Dashboard Presidente/Rose:

```text
V192/V201 logiche storiche
V212 modulo president-dashboard-rosters
```

Admin pubblicazione:

```text
V190/V191/V203 logiche storiche inline
V213 modulo estratto ma disattivato in V214
```
