# AI Assistant handoff V514

Overlay correttivo whole-site dopo V513.

Regola operativa stabilita: ogni overlay deve essere consegnato come overlay unico per tutto il sito, con radici `static/` e `docs/`, copiabile una sola volta. Lo zip deve contenere solo i file effettivamente modificati.

Motivo: V513 era corretto nei contenuti ma le istruzioni applicavano solo `zonaorientale`; FantaMantraManager restava su `league-config-v443.js?v=512`.

V514 applica la stessa correzione a entrambe le leghe e riallinea cache-buster/entrypoint a V514.
