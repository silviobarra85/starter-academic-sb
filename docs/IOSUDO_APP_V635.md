# ioSudo V635

V635 corregge la vista globale **GIOCATORI**:

- recupera il ruolo dal listone piu recente quando il giocatore e presente in `fanta-engine/data/shared-assets/current/assets/listoni`;
- usa anche le righe aggregate di ufficialita/trattative come fallback;
- mostra come squadra reale la squadra attuale da ufficialita in uscita, anche se non e di Serie A;
- se l'ufficialita e uno svincolo, mostra `Svincolato`;
- mantiene cliccabile ogni card giocatore e apre il dettaglio con fonti, ufficialita, rumor e SOS.

Esempi verificati:

| Giocatore | Ruolo corretto | Squadra attuale |
|---|---:|---|
| Freuler | C | Svincolato |
| Ehizibue | D | Pec Zwolle |

Correzioni dataset V635:

- righe mercato con ruolo corretto: 105;
- da listone: 91;
- da righe aggregate/nested: 14;
- ufficialita in uscita con squadra attuale risolta: 135.
