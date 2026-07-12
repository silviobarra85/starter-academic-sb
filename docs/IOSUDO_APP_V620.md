# ioSudo App V620

V620 introduce le viste rapide globali sotto la ricerca.

## Tasti disponibili

- **SQUADRE**: mostra la griglia squadre.
- **SOS**: mostra tutti gli infortunati/problemi fisici.
- **RUMOR**: mostra tutte le trattative e rumors, in entrata e uscita, con fonti cliccabili.
- **UFFICIALITÀ**: mostra tutte le ufficialità, in entrata e uscita.
- **AMICHEVOLI**: mostra il calendario globale delle amichevoli.

## Ordinamento

- Le amichevoli sono ordinate dalla data più vicina alla più lontana.
- SOS, rumors e ufficialità sono ordinati dal più recente al meno recente.

## Ricerca

La ricerca filtra la vista aperta. Ad esempio, dentro **RUMOR** cercando `Napoli` vengono mostrate solo le voci collegate al Napoli o a testi che contengono Napoli.

## Cache PWA

Il service worker è aggiornato a `iosudo-shell-v620`. Non serve reinstallare l'app: dopo il deploy basta chiudere e riaprire ioSudo; in caso di cache vecchia, aprire dal browser e fare refresh.
