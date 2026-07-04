# Handoff V488 - Inventario dipendenze JS comuni

## Contesto

Dopo V485 e V487, dati comuni e CSS comuni sono centralizzati con fallback. Prima di centralizzare JavaScript e' necessario capire quali file sono autonomi e quali dipendono da import relativi, configurazione lega-specifica o Firebase.

## Cosa e' stato fatto

- Aggiunto `static/fanta-engine/data/shared-js-dependency-inventory-v488.json`.
- Aggiunto `static/fanta-engine/tools/audit-js-dependency-inventory-v488.mjs`.
- Aggiornato audit anti-contaminazione a V488.
- Aggiornati footer/cache-buster/config a V488.
- Aggiornata documentazione.

## Cosa NON e' stato fatto

- Nessun JS e' stato spostato nel motore centrale.
- Nessun tag `<script>` e' stato riscritto verso `fanta-engine/js`.
- Nessuna copia locale e' stata cancellata.
- Nessuna modifica a Firebase, EmailJS, Admin, Dashboard Presidente, Area Squadra, news, regolamenti, bilanci, listoni o calciomercato.

## Prossimo step consigliato

V489: centralizzazione prudente di un sottoinsieme ristretto di script classici/autonomi, con fallback locale e senza toccare i moduli ES con import relativi.
