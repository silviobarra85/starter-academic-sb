# Handoff nuovo assistente V383

Stato corrente: V383 Soccer Data FBref batch-11 finale.

## Stato mapping

- Listone attivo: `2026-06-04`.
- Solo `statusCode: IN_LISTONE`.
- Giocatori attivi: 532.
- Asteriscati esclusi: 131.
- Mapping confermati: 531.
- Mapping rimanenti: 1.
- Ultimo batch completato: `batch-11` finale.
- Residuo volutamente in `needs-review`: `Balentien`, per assenza di profilo FBref stabile verificabile.

## Regole operative

- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Non fare scraping live dal browser verso FBref.
- Non scrivere su Firebase per Soccer Data.
- Ogni nuovo mapping deve essere verificato e motivato in `notes` quando ambiguo.
- Preservare tutte le funzionalita esistenti del sito.

## Prossimo passo

Prima di importare statistiche, rivalutare il singolo residuo `Balentien` solo se compare una pagina FBref stabile. In assenza di profilo, mantenere il record in `needs-review`.
