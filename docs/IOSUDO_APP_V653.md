# ioSudo V653 - Giocatori solo rumor in GIOCATORI

## Obiettivo

Corregge una regressione introdotta con le ottimizzazioni V651/V652: la vista globale **GIOCATORI** era veloce, ma includeva solo giocatori reali/listone e giocatori solo-listone. I giocatori presenti esclusivamente in **RUMOR** o **UFFICIALITÀ** non entravano nella lista compatta.

Caso segnalato: **Alejandro Garnacho**, presente nei rumor Roma, non compariva in GIOCATORI.

## Modifiche

- Mantiene la lista GIOCATORI compatta e progressiva.
- Aggiunge giocatori virtuali creati dalle righe mercato quando non esiste già un giocatore reale/listone corrispondente.
- Evita righe aggregate o ambigue tipo `A / B` per non creare falsi giocatori.
- Mostra lo stato corretto `RUMOR` o `UFFICIALE` per i giocatori virtuali.
- Mostra la traiettoria mercato quando disponibile, ad esempio `Chelsea -> Roma`.
- Mantiene cache dettaglio giocatore e performance V652.

## Dati

Non modifica il dataset: usa i dati già presenti in `static/fanta-engine/data/sudatori/current/`.
