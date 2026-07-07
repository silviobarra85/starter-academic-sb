# AI Assistant Handoff Current

Baseline corrente: V587.

## Stato funzionale
- ZonaOrientale e FantaPetilloMantraManager hanno Calciomercato disattivato.
- ZonaOrientale mantiene Svincola Giocatori attivo.
- Tabelle giocatori mobile consolidate dopo cleanup V584 e ritocchi successivi.
- Dashboard Presidente mobile compatta V585.
- Rose pubbliche senza filtri ruolo V586.
- Area Admin contiene ora l'editor rose statiche V587 per generare JSON e manifest da caricare su GitHub.

## Regole operative
- Non modificare `docs/zonaorientale/FUNZIONALITA'.md` salvo richiesta esplicita.
- Ogni overlay deve preservare Firebase, EmailJS, Admin, Presidente, Listone, Rose e routing.
- Gli overlay devono essere whole-site quando possibile.
