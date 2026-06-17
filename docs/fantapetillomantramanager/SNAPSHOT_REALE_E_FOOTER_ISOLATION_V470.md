# V470 - Snapshot reale Admin standard e isolamento footer

La V470 aggiorna il check FantaPetilloMantraManager per accettare snapshot `2026-2027` popolati dal flusso standard Admin.

Il check non richiede più che lo snapshot sia vuoto: se contiene squadre, rose, movimenti o competizioni generate dall'Admin standard, viene considerato valido.

La V470 aggiunge anche un audit sui footer HTML: il footer FantaPetilloMantraManager non deve citare ZonaOrientale.
