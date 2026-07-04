# FantaMantraManager — Presentation engine V481

## Obiettivo

V481 avvia il secondo passo verso il motore unico: sposta la presentazione runtime comune in `static/fanta-engine/js/core/league-presentation-v481.js`.

Il motore comune applica:

- metadata e canonical URL da `assets/league-config.json`;
- testi brand della dashboard;
- footer parametrico da config;
- aggiornamento del menu mobile “Altro”, con fallback alla config e compatibilita con il registry V480.

## Guardrail

- Nessuna modifica a Firebase, auth, Admin, dashboard presidente o flussi EmailJS.
- Nessuna modifica a dati statici, listoni, rose, bilanci, news o regolamento.
- Le funzioni locali V445 restano come fallback se il motore comune non si carica.
- La cartella/URL rimane `fantapetillomantramanager`.

## Verifica manuale

Controllare home, News, Rose/Listone, Competizioni, Regolamento, Area squadra e Admin. Verificare che il footer mostri `FantaMantraManager · V481 · Ultimo aggiornamento 24/06/2026` e che non compaiano riferimenti a ZonaOrientale.
