# Handoff nuovo assistente - V357

## Stato

La V357 aggiunge una checklist QA grafica solo Admin in basso nel sito. Non rimuove file e non cambia flussi funzionali.

## Vincoli

- Preservare tutte le funzionalita esistenti.
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` senza richiesta esplicita.
- Consegnare sempre uno zip unico con `zonaorientale/` e `docs/`.
- L'utente applica gli zip da Download gia decompressi.

## Nuovo componente

Runtime marker:

```js
window.ZonaOrientaleManualQaPanelV357
```

Il pannello usa il tracker V356 come archivio locale. La visibilita dipende da `state.isAdmin`.

## Rischi

Bassi. L'unica attenzione e che il pannello e fixed-bottom; se in futuro interferisce con mobile, ridurne altezza o bottom offset. Il pannello resta nascosto per utenti non admin.
