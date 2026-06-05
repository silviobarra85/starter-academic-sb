# Manual QA stability V363

## Scopo

Rendere usabile la checklist QA Admin dopo l'aggiunta del pannello simulatore target presidente V362.

## Interventi

### Layout

Il box trade simulator ora e' full width nella griglia QA:

```css
.manual-qa-card-v358.is-trade-simulator-v363 { grid-column: 1 / -1; }
```

Il select del destinatario usa una riga responsive e non sfora:

```css
.manual-qa-trade-v361__target-row { grid-template-columns: minmax(0, 1fr) auto; }
.manual-qa-trade-v361__target select { min-width: 0; max-width: 100%; }
```

### Stato UI

L'auto-refresh non ridisegna il pannello quando:

- il focus e' dentro la checklist;
- una `details` informativa e' aperta;
- il pannello e' espanso e l'utente sta interagendo.

### Compatibilita

La V363 non cambia storage key V362, per conservare eventuali simulazioni gia create:

- `zonaorientale.tradeSimulatorTargetPanel.v362.rows`
- `zonaorientale.tradeSimulatorTargetPanel.v362.selectedTarget`

## Rischio

Basso. La modifica e' solo UI Admin/localStorage.
