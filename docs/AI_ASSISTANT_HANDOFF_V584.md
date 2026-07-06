# AI Assistant Handoff - V584

## Titolo
V584 - Cleanup tabelle giocatori mobile

## Scopo
Consolidare gli interventi sperimentali V567-V583 sulle tabelle giocatori mobile in un solo asset attivo e rimuovere i file inutili generati dai tentativi precedenti, inclusi i resize V570/V571.

## File runtime attivi
- `static/fanta-engine/css/player-tables-mobile-v584.css`
- `static/fanta-engine/js/ui/player-tables-mobile-v584.js`

## Cleanup
Dopo aver applicato l'overlay, eseguire:

```bash
bash static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh
```

Il cleanup rimuove asset CSS/JS/audit obsoleti V567-V583 relativi solo alle tabelle giocatori mobile e ai resize. Non rimuove la documentazione storica.

## Funzionalità preservate
- Calciomercato resta disattivato.
- Svincola Giocatori resta attivo su ZonaOrientale.
- Link giocatore verso pagina esterna preservati.
- Stili mobile delle tabelle giocatori mantenuti tramite V584.
- `FUNZIONALITA'.md` non modificato.

## Audit
```bash
node static/fanta-engine/tools/audit-player-tables-mobile-v584.mjs
```
