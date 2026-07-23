# Overlay roadmap

## Corrente

- Sito/FantaEngine: V763.
- ioSudo: V766.
- Overlay: V777.
- Sorgente dati: Excel V150, cutoff 23/07/2026 14:00 CEST.
- Documentazione canonica per categoria.

## Completato fino a V768

- Catalogo unico di rose, listone e fonti informative.
- 1.198 persone distinte nella vista globale.
- 1.018 righe di rosa tecnica dopo la deduplica.
- Tutte le 663 righe del listone rappresentate una volta.
- 1.433 righe operative collegate a identità canoniche.
- Protezione strutturale `Akor Adams ≠ Che Adams`.
- ID storico `torino-akor-adams` reindirizzato a `venezia-akor-adams` senza coinvolgere Che Adams.
- Daniel Maldini e Riccardo Sottil deduplicati tramite ID Fantacalcio e righe EXTRA_LISTONE.
- Mergim Vojvoda, Alieu Fadera e Seydou Fini riconfermati come singole identità lungo il trasferimento.
- Zero ID Fantacalcio duplicati e zero nomi visualizzati duplicati.
- Ruolo autorevole dal listone.
- Indice per ID e indice sorgenti costruiti una sola volta.
- Apertura dettaglio senza scansioni globali e senza doppio rendering.
- Dati V146 integrati: 422 ufficialità, 225 trattative attive, 26 SOS, 106 amichevoli e 541 prestazioni.

## Prossimi controlli

1. Verificare su Android reale memoria e tempo di apertura dopo il deploy V757.
2. Integrare stabilmente il registro delle disambiguazioni nel generatore ordinario Excel → payload.
3. Aggiungere un test automatico che vieti fusioni basate sul solo cognome.
4. Continuare ad ampliare i nomi abbreviati soltanto tramite ID o fonti univoche documentate.

- V769/V758: corretta la semantica del badge sorgente; tutti i 663 giocatori del listone mostrano LISTONE e ANAGRAFICA resta interna.

- V770: Musah confermato Milan; Giovane disambiguato con i nomi completi Samuel Giovane e Giovane Santana do Nascimento.

## Completato in V771

- Fusione Excel V147 con le correzioni ioSudo V759.
- Che Adams inserito nella rosa Torino mantenendo l’ID listone.
- Yanis Massolin canonicalizzato anche nel workbook.
- Aggiornamento serale Kessié/Romagnoli.

## Completato in V776
- Integrato il workbook V150 con rinnovi ufficiali, trattative del 23 luglio e Roma-Trastevere.
- Sincronizzata la versione visibile dell'header a V765.
- Overlay autosufficiente e compatibile con l'applicatore GitHub Actions senza modificare `.github/workflows`.


## Completato in V777
- Corretto il ruolo visualizzato di Matteo Pessina: C del Monza.
- Impedito il collegamento debole con `Pessina Mas.`, record del listone relativo a Massimo Pessina, P del Bologna.
- Sincronizzato l'header visibile e tutti gli asset a ioSudo V766.


## Completato in V778
- Integrato Excel V151 fino alle 18:25 CEST.
- Consolidata la riga storica duplicata di Alessio Romagnoli senza creare una seconda scheda.
- Deduplicata l’identità Christian Comotto e aggiunto un audit permanente dei duplicati.
- Aggiornato l’header visibile a ioSudo V767.
