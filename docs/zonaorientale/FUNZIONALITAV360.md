# FUNZIONALITAV360 - Checklist QA Admin con informazioni test

Versione: V360  
Data: 2026-06-05

## Obiettivo

Rendere piu' comprensibile la Checklist QA Admin introdotta nelle versioni V357/V358, aggiungendo per ogni test una icona informativa `i` che spiega cosa controllare manualmente.

## Funzionalita aggiunte

- Ogni scheda della bottom area `Checklist QA Admin` mostra una `i` informativa.
- Cliccando/toccando la `i` si apre una descrizione breve e operativa del test.
- Le informazioni coprono tutte le aree QA:
  - Auth/Admin;
  - Auth/Presidente;
  - Admin Diagnostica;
  - Calciomercato feed, filtri, timeline, diagnostica giocatori, Solo Admin;
  - Listone;
  - Rose/player;
  - Competizioni;
  - Fantamercato reale;
  - simulatore trade;
  - mobile navigation;
  - News/share.
- L'export Markdown della QA include anche la colonna `Cosa controllare`.
- Aggiunto audit tecnico `tools/audit-manual-qa-info-v360.mjs`.

## Funzionalita preservate

- La checklist resta visibile solo Admin.
- I dati QA restano solo in `localStorage` con chiave `zonaorientale.manualQa.v356`.
- I pulsanti OK, Problema, Salta, Reset, OK area, Reset area, Auto-check, Copia riepilogo ed Esporta restano invariati.
- Nessuna scrittura Firebase.
- Nessuna modifica a Netlify Functions.
- Nessuna modifica a Calciomercato, Listone, Rose, Competizioni, Fantamercato reale, Admin reale o mobile navigation.

## Note di sicurezza

La V360 e' un miglioramento di usabilita' della checklist QA. Non cambia dati, permessi, feed, archivi o funzioni di business.

`docs/zonaorientale/FUNZIONALITA'.md` non e' stato modificato.
