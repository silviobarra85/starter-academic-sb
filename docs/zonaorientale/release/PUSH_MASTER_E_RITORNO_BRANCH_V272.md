# Push su master e ritorno al branch - V272

Branch di lavoro:

```text
refactor/260528-zonaorientale-next
```

## 1. Prima di tutto: commit del branch corrente

```bash
cd starter-academic-sb
git branch --show-current
git status
```

Se ci sono modifiche V272 non committate, aggiungerle e committarle.

## 2. Verifica branch pulito

```bash
git status
```

Atteso:

```text
nothing to commit, working tree clean
```

## 3. Aggiorna il branch remoto

```bash
git pull origin refactor/260528-zonaorientale-next
```

## 4. Passa a master e aggiorna

```bash
git checkout master
git pull origin master
```

## 5. Merge del branch su master

```bash
git merge --no-ff refactor/260528-zonaorientale-next -m "merge: integra aggiornamenti zonaorientale v258-v272"
```

## 6. Push su master

```bash
git push origin master
```

## 7. Torna sul branch attuale

```bash
git checkout refactor/260528-zonaorientale-next
```

Opzionale, per riallineare anche il branch con il merge commit di master:

```bash
git merge master
git push origin refactor/260528-zonaorientale-next
```

## 8. Dopo il deploy Netlify

Controllare:

```text
Footer: V272 handoff e verifica pre-merge
Home preview generica
News link WhatsApp /zonaorientale/share/news/<id>
Listone con colonna Modifica
Admin -> Converti listone Excel
Dashboard Presidente -> comunicati e Svincola Giocatori
```

## 9. Firebase Rules

Il push su master non pubblica automaticamente le Firebase Rules, salvo pipeline dedicata. Le rules V257 vanno pubblicate da Firebase Console o CLI se non sono gia attive.
