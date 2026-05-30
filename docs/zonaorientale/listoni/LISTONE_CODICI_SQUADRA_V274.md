# V274 - Codici squadra canonici nel Listone

## Obiettivo

I file Excel dei listoni possono contenere la squadra reale in due forme diverse:

- sigla storica a tre lettere, per esempio `ATA`, `BOL`, `INT`, `MIL`;
- nome esteso, per esempio `Atalanta`, `Bologna`, `Inter`, `Milan`.

Da V274 il sistema accetta entrambe le forme, ma salva e visualizza nel Listone la forma canonica a tre lettere.

## Regola

- Input accettato: sigla o nome esteso.
- Valore principale salvato/visualizzato: sigla a 3 lettere.
- Valore originale: conservato come `realTeamOriginal` quando arriva dal convertitore Excel.

Esempi:

| Input Excel | Valore canonico |
| --- | --- |
| Atalanta | ATA |
| ATA | ATA |
| Bologna | BOL |
| Inter | INT |
| Milan | MIL |
| Hellas Verona | VER |

## Effetti

La normalizzazione vale per:

- conversione Excel in JSON;
- confronto tra listone corrente e listone precedente;
- colonna `Modifica`;
- ricerca nel Listone;
- link esterni a Fantacalcio.it.

## Funzionalità preservate

Non cambia il comportamento di rose, movimenti, svincoli, storico listoni o ricerca storica. La modifica serve solo a evitare falsi cambi squadra e a mantenere una visualizzazione uniforme.
