# Test Soccer Data FBref batch-09 V381

1. Verificare footer `V381`.
2. Aprire `Soccer Data`.
3. Filtrare su `Mappati`.
4. Verificare che i mapping confermati siano 450.
5. Aprire link FBref campione: Suslov, Rugani, Rovella, Estupinan, Faye, Pessina Mas., Gollini.
6. Verificare che il filtro `Da associare` mostri ancora i rimanenti.
7. Verificare Admin, Area squadra, Listone, Competizioni e Scheda giocatore.
8. Eseguire:

```bash
node static/zonaorientale/tools/audit-soccer-data-fbref-batch-v381.mjs
bash static/zonaorientale/tools/check-zonaorientale.sh
```
