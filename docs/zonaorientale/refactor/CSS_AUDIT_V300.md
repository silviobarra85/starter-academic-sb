# V300 - Audit CSS e pulizia controllata styles.css

## Obiettivo

V300 introduce un audit CSS non distruttivo per preparare la futura pulizia di `assets/styles.css` senza perdere funzionalita esistenti.

Questa release non rimuove regole CSS e non cambia UI intenzionalmente. Aggiunge solo lo script:

```text
static/zonaorientale/tools/audit-css-v300.sh
```

## Funzionalita a rischio da preservare

Prima di qualsiasi futura pulizia CSS bisogna verificare esplicitamente:

- Listone: colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV solo Admin.
- Rose e pagina squadra: prima colonna sticky, testo leggibile, righe mobile compatte.
- Dashboard Presidente: tabelle rosa, form e controlli mobile.
- Mobile: bottom navigation, menu `Altro`, pulsante globale `Su`.
- Tema: Dark mode unico introdotto in V289; Light mode sospesa e non caricata.
- Pagine standalone: `competition.html` e `player.html`.
- Admin: Diagnostica dati e Richieste presidenti non devono subire regressioni visive.

## Script aggiunto

Esecuzione standard:

```bash
static/zonaorientale/tools/audit-css-v300.sh
```

Esecuzione compatta:

```bash
static/zonaorientale/tools/audit-css-v300.sh --quiet
```

Lo script controlla:

- presenza di `assets/styles.css`;
- presenza dei CSS refactor stabili `mobile-controls.css`, `rosters-tables.css`, `theme-light-suspended.css`;
- import corretti negli HTML principali;
- assenza di import del CSS Light sospeso;
- residui dei vecchi CSS refactor versionati V291/V292;
- presenza di selettori critici nei CSS mobile/rose;
- possibili duplicati semplici in `styles.css`.

## Regola operativa

L'audit segnala candidati, ma non autorizza cancellazioni automatiche. Un blocco CSS puo essere rimosso solo se:

1. e' dimostrato duplicato o non piu importato;
2. non protegge una funzionalita elencata sopra;
3. i test manuali mobile e desktop sono passati;
4. la modifica e' documentata nel changelog/handoff.

## Test minimi dopo V300

```bash
static/zonaorientale/tools/check-zonaorientale.sh
static/zonaorientale/tools/audit-css-v300.sh
```

Controlli manuali consigliati:

- Home mobile.
- Listone pubblico e Admin.
- Pagina squadra -> Rosa.
- Dashboard Presidente.
- Bottom navigation, menu Altro e pulsante Su.
- `competition.html` e `player.html`.

## Esito atteso

V300 non deve produrre cambi visibili. Serve come base per una futura V301/V302 di pulizia CSS realmente applicata.
