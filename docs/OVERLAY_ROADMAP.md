# Overlay roadmap

## Corrente

- Sito/FantaEngine: V763.
- ioSudo: V756.
- Overlay: V767.
- Documentazione canonica per categoria.

## Completato fino a V767

- Catalogo unico di rose, listone e fonti informative.
- 1.182 giocatori distinti nella vista globale.
- Tutte le 663 righe del listone presenti.
- Giocatori presenti soltanto in trattative, ufficialità, SOS, formazioni o amichevoli inclusi.
- Deduplica delle identità lungo i trasferimenti.
- Omonimie reali disambiguate con nome completo.
- Massolin corretto in Yanis Massolin; Rabby Nzingoula mantenuto distinto.
- Ruolo autorevole dal listone.
- Indice per ID e indice sorgenti costruiti una sola volta.
- Apertura dettaglio senza scansioni globali.
- History API al posto della doppia renderizzazione via hash.
- Error boundary e protezione dal rientro nel rendering del dettaglio.
- Payload runtime compatto: le identità di rosa sono referenziate per ID nel catalogo.

## Prossimi controlli

1. Verificare su Android reale memoria e tempo di apertura dopo il deploy V756.
2. Integrare la costruzione di `playerDirectory` nel generatore ordinario dei dati Excel.
3. Aggiungere un test browser mobile automatizzato nell'ambiente CI del repository.
4. Continuare ad ampliare i nomi abbreviati solo tramite fonti univoche documentate.
