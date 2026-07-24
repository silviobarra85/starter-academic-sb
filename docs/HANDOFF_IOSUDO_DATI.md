# Handoff ioSudo e dati

## Versione corrente

- ioSudo: V769.
- Overlay complessivo: V780.
- Sorgente dati: `v154_2026-07-24_fantacalcio_serie_a_2026_27_iosudo_v767_aggiornato_0930(1).xlsx`.
- Cutoff delle notizie: 24/07/2026 09:30 CEST.
- Catalogo: 1230 persone; rose tecniche: 1018.
- SOS attivi: 34.

## Correzione V769: badge SOS

Nel payload V768 il campo `sosFantaFlag` era stato valorizzato a `true` per 981 giocatori su 1018. Il generatore aveva interpretato come segnalazione attiva la semplice presenza del testo di stato fisico, compresi valori neutrali come `Disponibile / nessuna segnalazione SOS recente`.

La release V769 applica queste regole:

- il badge SOS pubblico deriva dall'indice delle righe SOS/infortuni attive;
- `sosFlagActiveV769` e `sosFantaFlag` devono coincidere con l'appartenenza a quell'indice;
- gli stati `nessuna segnalazione`, `nessun infortunio`, `nessuna indisponibilità` e `monitoraggio chiuso` non sono segnali SOS;
- l'apertura del dettaglio usa le righe SOS già indicizzate per ID canonico;
- l'audit blocca la release se esistono falsi positivi o falsi negativi.

Risultato V769:

- 34 giocatori con badge SOS;
- 984 giocatori senza badge SOS;
- 947 falsi positivi rimossi;
- 0 falsi positivi residui;
- 0 falsi negativi.

## Regole identità permanenti

- Massimo Pessina: Bologna, ruolo P.
- Matteo Pessina: Monza, ruolo C.
- Akor Adams, Venezia, è distinto da Che Adams, Torino.
- Samuel Giovane, Atalanta, è distinto da Giovane Santana do Nascimento, Napoli.
- Yunus Musah resta associato al Milan.
- Yanis Massolin è distinto da Rabby Nzingoula.
- Filip Kostic è distinto da Andrej Kostić.
- Alessio Romagnoli ha una sola identità canonica.
- Ogni release deve rieseguire il controllo completo dei duplicati.
