# ZonaOrientale - Mockup mobile a blocchi V136

Ultimo aggiornamento: 2026-05-20

Obiettivo: ripensare la navigazione mobile come una home a blocchi, senza cambiare i contenuti disponibili. La logica consigliata e mostrare una schermata iniziale piu leggibile, dove ogni blocco porta a una funzionalita principale.

## Principi mobile

- Ogni blocco deve avere un solo obiettivo chiaro.
- Le informazioni piu usate devono stare in alto: prossime partite, comunicati, area squadra, fantamercato.
- Le tabelle devono restare accessibili, ma non essere la prima cosa visibile.
- I pulsanti devono essere grandi ma non invadenti.
- I dettagli lunghi devono aprirsi solo su richiesta.

## Mockup A - Home operativa a blocchi

Pensato per presidenti che devono fare azioni rapide.

```text
+------------------------------------------------+
| ZonaOrientale                                  |
| Ciao Presidente                                |
| [Aggiorna]                         [Menu]      |
+------------------------------------------------+
| PROSSIMA SCADENZA / PARTITA                    |
| Champion's League                              |
| Team A - Team B                                |
| 24/05/2026 · Serie A 38                        |
| [Apri competizione]                            |
+------------------------------------------------+
| AREA SQUADRA                 [Apri]            |
| Rosa: 28/30 · Saldo: 55 FM                     |
| Trattative ricevute: 2                         |
+------------------------------------------------+
| FANTAMERCATO                 [Vai]             |
| 12 giocatori trasferibili                      |
| Ultimo: Nome Giocatore - Squadra               |
+------------------------------------------------+
| COMUNICATI                   [Leggi]           |
| Ultimo comunicato della lega                   |
+------------------------------------------------+
| COMPETIZIONI                 [Apri]            |
| Classifiche, calendari e risultati             |
+------------------------------------------------+
| LISTONE                      [Apri]            |
| Cerca quotazioni e stato giocatori             |
+------------------------------------------------+
```

Pro: molto pratico, perfetto per uso quotidiano.
Contro: meno scenografico, piu gestionale.

## Mockup B - Dashboard visuale con card grandi

Pensato per dare piu impatto grafico.

```text
+------------------------------------------------+
| ZonaOrientale                                  |
| Stagione 2025-2026                             |
+------------------------------------------------+
| [ HERO CARD ]                                  |
| Prossime partite                               |
| Campionato · Giornata 12                       |
| 24/05/2026 · Serie A 38                        |
| [Dettagli]                                     |
+------------------------------------------------+
| +------------------+ +------------------+      |
| | Area squadra     | | Fantamercato     |      |
| | 28/30 giocatori  | | 12 trasferibili  |      |
| +------------------+ +------------------+      |
| +------------------+ +------------------+      |
| | Competizioni     | | News             |      |
| | 5 attive         | | 3 recenti        |      |
| +------------------+ +------------------+      |
+------------------------------------------------+
| Rose e Listone                                 |
| [Rose] [Listone] [Regolamento]                 |
+------------------------------------------------+
```

Pro: piu moderno e bello da smartphone.
Contro: richiede un po' piu CSS e icone/stati sintetici.

## Mockup C - Menu mobile a sezioni verticali

Pensato per massima leggibilita.

```text
+------------------------------------------------+
| ZonaOrientale                                  |
| [Dashboard] [Area squadra] [Mercato]           |
+------------------------------------------------+
| OGGI / PROSSIME                                |
| - Team A - Team B · 24/05 · Serie A 38         |
| - Team C - Team D · 25/05 · Serie A 38         |
+------------------------------------------------+
| LA MIA SQUADRA                                 |
| Rosa: 28/30                                    |
| Saldo: 55 FM                                   |
| [Gestisci rosa] [Trattative]                   |
+------------------------------------------------+
| MERCATO                                        |
| 12 trasferibili                                |
| [Vai al fantamercato]                          |
+------------------------------------------------+
| COMPETIZIONI                                   |
| [Classifiche] [Calendari]                      |
+------------------------------------------------+
| ALTRO                                          |
| [News] [Listone] [Albo] [Regolamento]          |
+------------------------------------------------+
```

Pro: il piu leggibile; ottimo per utenti non tecnici.
Contro: meno compatto, richiede piu scroll verticale.

## Raccomandazione

Partirei dal Mockup A, con piccoli elementi visuali del Mockup B.

Versione consigliata:

1. Hero card in alto con la prossima partita o avviso importante.
2. Quattro blocchi principali: Area squadra, Fantamercato, Competizioni, Comunicati.
3. Blocco secondario per Rose, Listone, Albo, Regolamento.
4. Tabelle e dettagli solo dopo tap su un blocco.

## Step di implementazione consigliato

- V137: solo CSS/HTML mobile per nuova home a blocchi, mantenendo le sezioni esistenti.
- V138: card dinamiche con contatori reali: trattative, trasferibili, prossime partite.
- V139: eventuale bottom navigation mobile persistente.

