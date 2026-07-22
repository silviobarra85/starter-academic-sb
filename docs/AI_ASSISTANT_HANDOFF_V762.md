# AI Assistant Handoff V762 - ioSudo V752

## Scopo della release

V762 aggiorna esclusivamente il livello condiviso **FantaEngine/ioSudo** usando il workbook:

`v135_2026-07-22_fantacalcio_serie_a_2026_27_aggiornamento_globale_compattato_alias_v750(3).xlsx`

Cutoff dichiarato dal workbook: **22/07/2026 07:45 CEST**.

La versione dell'app/dataset è **V752**. La versione complessiva dell'overlay del repository è **V762**, successiva al correttivo sito V761.

## File runtime principali

- `static/fanta-engine/data/sudatori/current/sudatori-data.json`
- `static/fanta-engine/data/sudatori/current/sudatori-runtime.json`
- `static/fanta-engine/data/sudatori/current/manifest.json`
- `static/fanta-engine/js/apps/iosudo-app-v752.js`
- `static/fanta-engine/css/iosudo-app-v752.css`
- `static/fanta-engine/tools/audit-iosudo-v752.mjs`
- `static/iosudo/index.html`
- `static/iosudo/sw.js`

## Conteggi V752

- squadre: 20
- giocatori: 1054
- ufficialità attive: 402
- trattative attive: 444
- rumor Transfermarkt attivi: 15
- SOS/infortuni attivi: 27
- amichevoli attive: 98
- tabellini: 17
- righe giocatore nei tabellini: 336
- ID duplicati: 0
- duplicati esatti squadra+nome+ruolo: 0
- rumor attivi sovrapposti a ufficialità: 0

## Fusioni certe applicate

Sono state fuse otto identità duplicate nella sorgente Rose:

1. Atalanta - Ederson
2. Bologna - Pessina Mas.
3. Bologna - Benjamin Dominguez
4. Lazio - Luca Pellegrini
5. Lecce - Sadik Fofana
6. Napoli - Giovane (Napoli)
7. Parma - Nicolas Trabucchi
8. Roma - `Ndicka / N'Dicka` in **Evan Ndicka**, mantenendo `roma-ndicka`

Sono stati inoltre deduplicati due movimenti ufficiali ripetuti:

- Radu Dragusin alla Fiorentina
- Edoardo Zanaga al Milan

Non sono emersi nuovi candidati ambigui da sottoporre all'utente.

## Variazioni giocatori

Aggiunti come nuove identità:

- `inter-matteo-zamarian`
- `torino-luka-tomic`

Rimossi/fusi:

- `lazio-giacomo-giacomone` rimosso: il giocatore è rappresentato dal record Bologna con ruolo P;
- `roma-n-dicka` fuso in `roma-ndicka`.

## Precedenza ufficialità

Il payload attivo esclude una trattativa quando esiste una ufficialità della stessa squadra, identità e direzione con data uguale o successiva. In V752 sono state chiuse nel payload le sovrapposizioni:

- Jacopo Fazzini - Cagliari
- Luka Tomic - Torino

Le righe storiche possono rimanere nell'Excel, ma non devono riapparire tra i rumor attivi dell'app.

## SOS

I record attivi sono 27. Sono esclusi dal payload i nove record chiusi/rientrati, inclusi:

- Belahyane
- Spinazzola
- Alisson Santos
- Wesley
- De Gea
- Casale
- Politano
- Vergara
- il duplicato Khephren Thuram

Il badge SOS deve continuare a comparire anche negli XI quando il giocatore è probabile titolare.

## Amichevoli

- eliminate righe globali, controlli, eventi non-partita e aggregati;
- normalizzato `Aralanta U23` in `Atalanta U23`;
- una sola `Atalanta-Atalanta U23`;
- assente la riga aggregata `Basilea-Juventus / Bologna-Arminia / Atalanta-U23`;
- tutti i 17 tabellini hanno un `matchKey` presente nelle amichevoli;
- le amichevoli sono ordinate per data.

## Payload e cache

`manifest.json` punta a `sudatori-runtime.json`, che contiene solo le otto sezioni necessarie all'app. L'archivio completo resta in `sudatori-data.json`.

Il service worker usa la cache `iosudo-shell-v752` e precarica gli asset V752. I JSON dei dati restano network-first/no-store.

## Audit obbligatorio

```bash
node --check static/fanta-engine/js/apps/iosudo-app-v752.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v752.mjs .
```

Risultato atteso:

`Audit ioSudo V752 OK`

## Contratti da non rompere

- non fondere globalmente cognomi omonimi protetti;
- mantenere gli alias contestuali alla squadra;
- ufficialità attiva prevalente sul rumor;
- ID giocatore stabili quando l'identità è già presente;
- matchKey dei tabellini sempre collegato a una partita;
- aggiornare insieme dati, manifest, app, CSS, index e service worker;
- per ogni overlay consegnare sempre i comandi completi di copia, `git add`, commit e push.
