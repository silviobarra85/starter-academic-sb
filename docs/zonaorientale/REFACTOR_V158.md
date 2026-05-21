# V158 - Mobile sezioni e rose scrollabili

Data: 2026-05-21
Branch: `feature/zonaorientale-competizioni-statiche`

## Obiettivo

Rifinitura esclusivamente mobile:

- nascondere i titoli principali delle sezioni (`Dashboard`, `Rose`, `Competizioni`, ecc.);
- rimuovere i tasti `Espandi/Riduci/Chiudi` dalla nuova schermata mobile a blocchi delle rose;
- rendere scrollabile orizzontalmente la tabella giocatori quando si apre una rosa.

## File coinvolti

```text
static/zonaorientale/index.html
static/zonaorientale/competition.html
static/zonaorientale/assets/css/mobile-hotfix-v158.css
```

## Note tecniche

La modifica è solo CSS, dentro media query mobile. La vista desktop non viene toccata.

Il blocco rosa resta cliccabile: toccando una squadra nella griglia si apre/chiude il dettaglio. Il pulsante separato viene nascosto per rendere la view più pulita.
