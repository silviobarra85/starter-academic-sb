# AI Assistant Handoff - ioSudo V748

Versione corrente: V748, generata da `v128_2026-07-21_fantacalcio_serie_a_2026_27_aggiornamento_globale_compattato_alias_v747.xlsx`.

## Stato
- Nessuna nuova ufficialità rispetto a V747.
- Rose invariate come appartenenza.
- SOS Napoli aggiornati: Alessandro Buongiorno intervento chirurgico necessario; Spinazzola e Alisson Santos in personalizzato.
- Trattative non ufficiali V128 integrate: Amondarain, Souttar, Dovbyk, Zirkzee, Rugani, Pinamonti, Lindstrom, Kumbulla, Mbaye, Luka Tomic, Akor Adams.
- Rafforzata fonte ufficiale Sassuolo per triangolare Trento-Parma del 25/07.

## Regole da mantenere
- I giocatori con ufficialità attiva non devono restare in rumor/trattative attive.
- Usare nome+cognome quando disponibile.
- Non fondere alias generici protetti: Carboni, Esposito, Thuram, Ferguson, Russo, Arena, Bonfanti, Rossi, Colombo, Marin, Moreno, Nicolas, Pedro, David, Kostic/Kostić, Bruno tra squadre diverse.
- Andrej Kostić Milan e Filip Kostic Juventus sono diversi.
- Kevin Bruno Sassuolo e Bruno Galassi Lazio sono diversi.
- Atalanta-Atalanta U23 va mantenuta una sola volta; correggere/filtrare eventuali typo Aralanta.

## Controlli
Eseguire sempre:
```bash
node --check static/fanta-engine/js/apps/iosudo-app-v748.js
node --check static/iosudo/sw.js
node static/fanta-engine/tools/audit-iosudo-v748.mjs
```
