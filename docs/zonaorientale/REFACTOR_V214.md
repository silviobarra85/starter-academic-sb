# V214 - Hotfix refactor sicuro

## Obiettivo
Ripristinare il caricamento dati dopo il refactor V213 del workflow di pubblicazione admin.

## Problema
Dopo V213 alcuni ambienti potevano non mostrare i dati pubblici. Il problema era collegato al nuovo modulo estratto per Stato Firebase/JSON e Procedura guidata pubblicazione.

## Soluzione
V214 torna al wiring stabile precedente per la parte pubblicazione admin, mantenendo attivi i refactor gia consolidati:

- V209 live data / archivio
- V210 generatore comunicati
- V211 statistiche e confronta
- V212 dashboard presidente / rose

Il modulo V213 non e piu richiesto dal bootstrap del sito.

## Note
Non cambia il comportamento utente atteso. Lo scopo e stabilizzare prima di riprendere il refactor dei pannelli admin.
