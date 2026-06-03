# V302 - Studio fattibilita sezione Calcio mercato

## Obiettivo proposto

Valutare una futura sezione `Calcio mercato` in cui raccogliere, per squadra di Serie A, link ad articoli di mercato provenienti da siti scelti dall'utente/admin, con anteprima, titolo, descrizione, immagine e categorizzazione.

## Fattibilita'

La feature e' fattibile, ma non conviene implementarla come semplice `fetch` dal browser verso siti esterni. Molti siti non espongono CORS permissivo, cambiano markup frequentemente o limitano scraping/bot. La strada piu' sicura e' usare una Netlify Function server-side che interroga fonti consentite e salva/ritorna un JSON normalizzato.

## Architettura consigliata

### Fase 1 - Manuale/statica

- Admin inserisce link articolo.
- Il sito salva o genera un JSON statico con:
  - squadra collegata;
  - titolo manuale o recuperato;
  - URL;
  - fonte;
  - immagine;
  - data;
  - topic.
- Pubblico vede card per squadra.

Rischio basso, nessuna API obbligatoria.

### Fase 2 - Recupero anteprime server-side

- Netlify Function riceve una URL o una query.
- Recupera HTML o API consentita.
- Estrae meta Open Graph quando disponibili:
  - `og:title`;
  - `og:description`;
  - `og:image`;
  - canonical URL.
- Normalizza in JSON.

### Fase 3 - Ricerca da fonti configurate

- Admin configura fonti/siti autorizzati.
- Per ogni squadra viene costruita una query tipo:

```text
Nome Squadra calciomercato site:fonte.it
```

- Il sistema usa API di ricerca o feed RSS dove disponibili.
- I risultati vengono deduplicati e categorizzati.

## Possibili fonti tecniche

- RSS ufficiali delle testate, se disponibili.
- API di ricerca, per esempio Google Programmable Search o alternative.
- Pagine HTML con meta Open Graph, solo se accessibili e consentite.

## Categorizzazione topic

Si puo' partire con regole semplici:

- `trattativa`, `offerta`, `interesse` -> Trattativa;
- `ufficiale`, `comunicato`, `ha firmato` -> Ufficiale;
- `prestito`, `diritto`, `obbligo` -> Formula;
- `infortunio`, `recupero`, `squalifica` -> Indisponibili;
- `fantacalcio`, `asta`, `consigli` -> Impatto fantacalcio.

## Funzionalita' da non perdere se verra' implementata

La futura sezione non deve staccare o modificare:

- News/comunicati gia' esistenti;
- link WhatsApp dinamici news;
- Listone e filtro `Modifiche`;
- Fantamercato presidente;
- Dashboard Presidente;
- Admin e snapshot pubblici;
- Netlify Function `news-share` esistente.

## Rischi principali

- CORS se si prova a leggere siti esterni dal browser.
- Termini d'uso delle fonti se si fa scraping non autorizzato.
- Immagini remote con hotlink bloccato.
- Duplicati tra testate.
- Query rumorose e articoli non pertinenti.
- Performance se si interrogano molte fonti a ogni visita.

## Raccomandazione

Non implementare subito la feature. Quando verra' ripresa, partire con una V dedicata e prudente:

```text
Calcio mercato V1: sezione statica/manuale con link e anteprime inserite dall'Admin.
```

Solo in seguito aggiungere ricerca automatica e recupero server-side delle anteprime.
