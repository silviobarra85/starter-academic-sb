# V292 - Pulizia CSS Light sospeso

## Scopo

V292 prosegue il refactor CSS iniziato in V291 senza cambiare comportamento visibile. La modalita Light resta disattivata come da V289; le regole Light recenti V285-V288 vengono quindi tolte dai CSS attivi e conservate in un file separato non importato.

## File CSS attivi dopo V292

```text
assets/css/refactor/mobile-controls-v292.css
assets/css/refactor/rosters-tables-v292.css
```

## File CSS conservato ma non caricato

```text
assets/css/refactor/theme-light-suspended-v292.css
```

Questo file mantiene le patch Light V285-V288 per un possibile ripristino futuro, ma non deve essere importato finche la Light mode non viene ricostruita e testata.

## Funzionalita a rischio e come sono state preservate

### Listone

Rischi: perdere colonna `Modifica`, filtro `Modifiche`, usciti storici, export CSV o leggibilita mobile.

Preservazione: nessuna logica JS o JSON e' stata toccata. Le regole mobile generali restano attive in `mobile-controls-v292.css`. Le sole regole Light, non usate perche il sito forza Dark, sono parcheggiate.

### Rose e pagina squadra

Rischi: perdere prima colonna sticky leggibile, righe compatte, allineamento verticale nelle rose da mobile.

Preservazione: le regole Dark V289 restano caricate in `rosters-tables-v292.css`. Le vecchie patch Light V286/V288 sono conservate nel file sospeso.

### Dashboard Presidente

Rischi: peggiorare tabelle rosa, controlli touch e form.

Preservazione: la rifinitura mobile generale V287 resta attiva in `mobile-controls-v292.css`.

### Navigazione mobile

Rischi: regressioni su bottom navigation, menu Altro, pulsante Su, safe-area.

Preservazione: non sono state rimosse le regole generali V287; `mobile-chrome-v223.css` e gli helper runtime non sono stati toccati.

### Tema Dark unico

Rischi: riattivare accidentalmente Light mode o far ricomparire il toggle tema.

Preservazione: V289 resta attiva: il sito forza `data-theme="dark"`, il toggle tema resta nascosto e il file Light sospeso non viene importato.

## Cosa non e' stato fatto

- Nessun refactor di `assets/app.js`.
- Nessuna rimozione di funzioni storiche Vxxx.
- Nessun cambio dati JSON.
- Nessun cambio Firebase o EmailJS.
- Nessuna riattivazione della modalita Light.

## Test obbligatori

```bash
static/zonaorientale/tools/check-zonaorientale.sh
```

Test manuali minimi:

```text
Home mobile
Listone mobile: filtri, Modifiche, export CSV
Pagina squadra -> Rosa mobile
Dashboard Presidente
Bottom nav e menu Altro
competition.html mobile
player.html mobile
Header: toggle tema assente
```

## Nota per ripristino futuro Light mode

Quando si riprendera la Light mode, partire da:

```text
assets/css/refactor/theme-light-suspended-v292.css
```

Non importarlo direttamente in produzione senza audit, perche alcune regole erano fix puntuali sovrapposti alle versioni V285-V288 e vanno riorganizzate in un tema Light coerente.
