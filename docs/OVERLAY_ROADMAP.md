# Overlay roadmap

## Corrente

- Sito/FantaEngine: V763.
- ioSudo: V769.
- Overlay: V780.
- Sorgente dati: Excel V154, cutoff 24/07/2026 09:30 CEST.
- Header, HTML, JavaScript, CSS, manifest e cache PWA sincronizzati a V769.

## Completato

- Catalogo unico di rose, listone e fonti informative.
- Apertura dettaglio tramite indici per ID canonico.
- Ruoli del listone con protezioni permanenti delle omonimie.
- Controllo completo dei duplicati su ID, nome, ID Fantacalcio e alias.
- Matteo Pessina fissato come C del Monza; Massimo Pessina come P del Bologna.
- Correzione V769 del badge SOS: rimosso l'uso del semplice testo di stato come flag globale.
- I 34 badge SOS corrispondono alle 34 righe attive indicizzate.
- Audit bloccante per falsi positivi e falsi negativi SOS.

## Prossimi controlli

1. Integrare la costruzione del flag SOS nel generatore ordinario Excel → payload, usando esclusivamente le righe attive.
2. Continuare a controllare i duplicati a ogni nuova importazione.
3. Verificare su Android il refresh della PWA dopo ogni cambio di service worker.
4. Mantenere sincronizzato l'header visibile con la versione applicativa.
