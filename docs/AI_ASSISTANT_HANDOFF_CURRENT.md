# AI Assistant Handoff Current

## Versione corrente
V566 - Footer ZonaOrientale da config allineato

## Stato sintetico
- V566 riallinea footer/cache-buster/config ZonaOrientale: il footer visibile viene generato a runtime da `league-config.json` e non solo dal testo hard-coded in `index.html`.
- ZonaOrientale: stagione corrente `2026-2027`.
- Calciomercato: disattivato come da V561.
- Svincola Giocatori: attivo in Area Presidente ZonaOrientale con selezione giocatori, anteprima email e invio EmailJS al presidente di lega.
- V564 conserva il layout del pannello Svincola Giocatori: titolo a sinistra e pulsante `Apri`/`Riduci` a destra.
- V565 corregge il pulsante account presidente in alto: quando il presidente cambia stagione dal selettore, il logo viene risolto dal `seasonTeam` della stagione selezionata e la label `Pres. <cognome>` resta visibile.
- FantaPetilloMantraManager: non modificato da V565.

## Guardrail
- Non reintrodurre fetch/loader Calciomercato.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Conservare mobile UX, Admin, Presidente, Firebase, EmailJS, Listone, Rose, Bilanci, Competizioni.
- La modifica V565 non cambia permessi, login, teamUsers, EmailJS o dati Firebase: corregge solo la risoluzione visuale del logo account in base alla stagione selezionata.

## Audit V566
```bash
node static/fanta-engine/tools/audit-zona-footer-config-v566.mjs
```
