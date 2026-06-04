# Calciomercato - Card pulite V324

## Obiettivo

Rendere le card articolo piu' leggibili e meno rumorose dopo il riconoscimento automatico V320.

## Modifiche

- La sottoscheda visuale `Giocatori/Allenatori` non viene piu' renderizzata nelle card articolo.
- Il riconoscimento automatico di giocatori, allenatori e squadre resta disponibile nei dati articolo e nella ricerca.
- L'anteprima descrittiva desktop usa tutta la larghezza del blocco testo: il precedente limite `72ch` poteva causare a capo anticipati anche quando lo spazio orizzontale era disponibile.

## Funzionalita' preservate

- Feed RSS automatico Calciomercato.
- Fallback statico `assets/calciomercato/links.json`.
- Download JSON, se presente nella UI corrente.
- Filtri Squadre / Topic / Fonti.
- Ricerca libera.
- Range temporale Da/A.
- Caricamento articoli piu' vecchi.
- Layout mobile compatto V319.
- Riconoscimento automatico V320, mantenuto nei dati e non rimosso.
- Fantamercato interno, Listone, Rose, Admin, Dashboard Presidente, Firebase ed EmailJS non toccati.

## Test manuali

1. Aprire Calciomercato da desktop e mobile.
2. Verificare che il riquadro `Giocatori/Allenatori` non compaia piu' nelle card.
3. Verificare che titolo, descrizione, fonte, data/ora e pulsante `Apri articolo` restino visibili.
4. Verificare che la descrizione desktop sfrutti tutta la larghezza disponibile del testo.
5. Verificare filtri, ricerca, range e caricamento articoli piu' vecchi.
6. Verificare che Fantamercato interno, Listone, Rose e Admin siano invariati.
