# Handoff ioSudo e dati

## Versione corrente

- ioSudo: V753.
- Overlay complessivo: V764.
- Sorgente: Excel V140, cutoff 22/07/2026 14:30 CEST.
- Payload runtime: `static/fanta-engine/data/sudatori/current/sudatori-runtime.json`.
- Archivio tecnico: `static/fanta-engine/data/sudatori/current/sudatori-data.json`.

## Conteggi V753

- 1.053 giocatori.
- 397 operazioni ufficiali deduplicate.
- 27 rinnovi ufficiali reali.
- 228 rumor/trattative attivi.
- 15 rumor Transfermarkt attivi.
- 25 SOS/infortuni attivi.
- 99 amichevoli.
- 18 tabellini.
- 359 prestazioni individuali.

## Regole dati

1. Rose e alias vanno riconciliati usando squadra, ruolo e ID stabile.
2. Non fondere omonimi senza conferma; le disambiguazioni protette sono nel workbook.
3. Un rumor precedente o contemporaneo a un’ufficialità va chiuso.
4. Un rumor successivo all’ufficialità può restare attivo.
5. Le voci più vecchie di sette giorni vanno escluse dal payload attivo.
6. I primi contratti professionistici non sono rinnovi.
7. I rinnovi puri e i rinnovi con successivo prestito/uscita hanno badge `RINNOVO`.
8. Nella rosa di squadra l’ordine è P-D-C-A; dentro il ruolo si usa recenza e poi nome.
9. Ogni tabellino deve avere un `matchKey` presente nelle amichevoli.
10. Il service worker deve cambiare cache a ogni release.

## Deduplica V753

- `A. Sala` è canonicalizzato in `Alex Sala`, ID `lecce-alex-sala`.
- Il vecchio ID `lecce-a-sala` non è più presente.
- Andrea Oliveri è uscito dalla rosa Atalanta dopo il prestito ufficiale all’Ascoli.
- Duplicati esatti squadra-nome-ruolo: zero.
- ID duplicati: zero.
- Nessun nuovo candidato ambiguo richiede conferma.
