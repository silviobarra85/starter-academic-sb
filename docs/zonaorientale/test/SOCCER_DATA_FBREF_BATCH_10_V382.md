# Test Soccer Data FBref batch-10 V382

1. Verificare footer `V382`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che i mapping confermati siano 500.
5. Aprire link FBref campione: Iling Junior, Sala A., Fofana Sa., Jean, Nicolas, Scuffet, Padelli.
6. Verificare che il filtro `Da associare` mostri ancora 32 rimanenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
8. Eseguire:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v382.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
