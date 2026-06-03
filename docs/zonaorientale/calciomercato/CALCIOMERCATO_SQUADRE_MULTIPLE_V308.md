# Calciomercato - Squadre multiple e stato trattativa V308

V308 estende la sezione pubblica `Calciomercato` senza introdurre recupero automatico da siti esterni e senza scritture Firebase.

## Campi articolo supportati

Oltre ai campi V305/V306 (`title`, `url`, `teamName`, `topic`, `sourceName`, `description`, `image`, `publishedAt`, `tags`, `players`), ogni articolo puo usare:

```json
{
  "teams": ["Napoli", "Inter"],
  "marketStatus": "Trattativa"
}
```

Alias supportati:

- squadre: `teams`, `teamNames`, `squadre`, `clubs`, piu i campi singoli `teamName`, `team`, `squadra`, `club`;
- stato: `marketStatus`, `status`, `stato`.

## Comportamento UI

- Le squadre coinvolte vengono mostrate come chip nella card articolo.
- Il filtro squadra include tutte le squadre dichiarate nell'articolo.
- La ricerca trova anche nomi squadra multipli e stato trattativa.
- Il campo `teamName` singolo resta compatibile.

## Funzionalita da preservare

Questa modifica non tocca e non deve scollegare:

- Fantamercato interno;
- Listone pubblico/Admin, filtro Modifiche, usciti storici ed export CSV solo Admin;
- Rose e pagina squadra;
- Dashboard Presidente;
- Admin Diagnostica/Richieste/Converti listone;
- Firebase/Auth/EmailJS;
- mobile bottom nav/menu Altro/pulsante Su;
- Dark mode unico.

## Test consigliati

1. Inserire temporaneamente in `assets/calciomercato/links.json` un articolo con `teams: ["Napoli", "Inter"]`.
2. Aprire `#calciomercato` e verificare entrambe le chip squadra.
3. Filtrare per ciascuna squadra e verificare che l'articolo resti visibile.
4. Inserire `marketStatus: "Trattativa"` e verificare il badge.
5. Controllare Fantamercato, Listone, Rose e Admin per assenza regressioni.
