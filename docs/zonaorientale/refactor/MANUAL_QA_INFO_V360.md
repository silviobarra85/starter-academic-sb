# Manual QA Info V360

## Contesto

Dopo V357/V358 la checklist QA era utilizzabile da interfaccia, ma alcuni test non erano abbastanza chiari. La V360 aggiunge una spiegazione per ogni test direttamente nella card.

## Implementazione

Le descrizioni sono aggiunte ai check del tracker QA come campo `info`. Il pannello Admin renderizza il campo con un elemento `details/summary`:

```html
<details class="manual-qa-card-v358__info">
  <summary>i</summary>
  <p>...</p>
</details>
```

Questo evita nuovo stato JavaScript e mantiene accessibilita' base da tastiera/browser.

## Compatibilita'

- API pubblica invariata: `window.ZonaOrientaleManualQaPanelV358`.
- Storage invariato: `zonaorientale.manualQa.v356`.
- Nessun cambio su stato checklist gia' salvato.
- Export Markdown arricchito con la colonna `Cosa controllare`.

## Rischi mitigati

- Nessuna chiamata Firebase.
- Nessuna modifica a funzioni reali.
- Nessuna modifica a feed o JSON.
- Nessuna rimozione file.
