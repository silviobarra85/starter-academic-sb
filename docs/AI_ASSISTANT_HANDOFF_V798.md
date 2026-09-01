# V798 - Competition runtime TDZ fix

- Corretto `Cannot access 'readyPromiseV443' before initialization`.
- `league-config-v443.js` non usa più top-level await prima dell'inizializzazione del runtime.
- `readyPromiseV443` viene inizializzata prima del caricamento asincrono del presentation engine.
- `competition.html` importa il loader una sola volta.
- Tutti i moduli ZonaOrientale che dipendono da `league-config-v443.js` usano `?v=798`, evitando istanze V795/V797 concorrenti.
- Calendari, Battle Royale, risultati Admin, rose e listone non vengono modificati.
