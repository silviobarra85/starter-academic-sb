# FantaMantraManager - Registro sezioni V480

## Obiettivo

La V480 trasforma la mappa delle sezioni in un registro strutturato, leggibile dal runtime e riutilizzabile dal futuro motore unico.

## Cosa cambia

Prima il file `assets/js/core/section-registry-v405.js` conteneva direttamente un oggetto locale con le pagine conosciute.

Ora il flusso e':

```text
static/fanta-engine/js/core/unified-section-registry-v480.js
  -> factory comune createUnifiedSectionRegistryV480
static/fantapetillomantramanager/assets/js/core/section-registry-v405.js
  -> wrapper FantaMantraManager con sezioni e metadata della lega
assets/app.js
  -> legge FantaLeagueSectionRegistryV480, con fallback agli alias storici
```

## Sezioni principali registrate

- Dashboard
- News
- Rose
- Bilanci squadre
- Fantamercato
- Calciomercato
- Listone
- Competizioni
- Albo d'Oro e FIFA Ranking
- Statistiche
- Archivio
- Confronta
- Sorteggio giornate
- Regolamento
- Admin
- Area squadra
- Proposte regolamento
- Scheda squadra

## Metadata aggiunti

Ogni sezione puo' dichiarare:

```text
id
label
visibility: public / president / admin
area: public / presidents / admin
source
nav.desktop
nav.mobileMore
nav.mobilePrimary
dashboardCard
status
```

Questa struttura permette di capire in modo centralizzato se una sezione deve apparire in navigazione desktop, menu mobile, bottom nav o dashboard presidente.

## Guardrail

- La cartella pubblica resta `fantapetillomantramanager` per non rompere URL, Netlify e share news.
- Gli alias storici `FantaPetilloSectionRegistryV401-V405` restano validi.
- La sezione `Proposte regolamento` resta registrata solo in FantaMantraManager, non in ZonaOrientale.
- Nessuna card o funzione presidente viene rimossa.

## Audit

```bash
cd static
node fanta-engine/tools/audit-unified-section-registry-v480.mjs
```

Esito verificato: `34 OK, 0 FAIL`.
