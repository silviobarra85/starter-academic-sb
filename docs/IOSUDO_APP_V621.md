# ioSudo V621 - Giocatori completi e dettaglio sempre apribile

## Obiettivo

Correggere la sezione Giocatori di ioSudo senza applicare l'overlay V620.

## Modifiche

- La home di ioSudo mostra ora anche la sezione **Giocatori** quando la ricerca e' vuota.
- La sezione mostra tutti i giocatori disponibili nel dataset Sudatori.
- Sono aggiunte card virtuali per i giocatori citati nelle **trattative in entrata** e nelle **ufficialita' in entrata** quando non sono gia' nella rosa reale della squadra di destinazione.
- Ogni card giocatore e' cliccabile e apre sempre il dettaglio del giocatore.
- Le card create da trattative in entrata mostrano la squadra di destinazione e il badge `RUMOR`.
- Le card create da ufficialita' in entrata mostrano la squadra di destinazione e il badge `NUOVO`.
- Le card di rosa reale continuano a usare i badge `NUOVO`, `RUMOR`, `CONFERMATO`, `SOS` e `XI`.

## Nota sulle rose live

La V621 mantiene la logica V618/V619: le assegnazioni fantacalcio vengono lette dai file live della sezione Rose (`assets/rose/manifest.json` e relativo file stagione), mentre mercato, infortuni, probabili formazioni e fonti continuano a venire dal JSON Sudatori.

## Cache PWA

Non serve reinstallare ioSudo. Dopo il deploy basta chiudere e riaprire l'app. In caso di cache persistente, aprire l'app dal browser e fare refresh.
