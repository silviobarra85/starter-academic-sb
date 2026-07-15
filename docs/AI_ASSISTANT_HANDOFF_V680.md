# AI Assistant Handoff V680

Overlay solo sito, basato sulla linea V676/V679.

Non tocca ioSudo, dataset, rose JSON, listoni JSON o Sudatori.

Punti chiave:
- il Listone mobile resta fuori dalla tabella legacy;
- il Listone mostra una sola box Costo tramite helper `getListonePlayerRosterCostV663` con fallback a `rosterCost/cost/costInRoster/purchaseCost/auctionCost`;
- le card Rose non mostrano più box Mercato/Stato;
- Stato delle Rose solo in alto a destra;
- Rose senza caricamento progressivo, perché le rose sono piccole;
- footer forzato a V680.
