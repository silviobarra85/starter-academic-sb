# Overlay V756 - Fix mobile boot preloader

Corregge il blocco del sito mobile sul loader percentuale.

## File principali
- `static/zonaorientale/index.html`
- `static/zonaorientale/assets/app.js`
- `static/fanta-engine/js/ui/boot-preloader-v756.js`
- `static/fanta-engine/css/boot-preloader-v756.css`
- `static/zonaorientale/assets/league-config.json`

## Applicazione
```bash
cp -R ~/Downloads/overlay_site_v756_mobile_boot_hardfix/static/* static/
cp -R ~/Downloads/overlay_site_v756_mobile_boot_hardfix/docs/* docs/
```

## Verifica
```bash
grep -n "boot-preloader-v756" static/zonaorientale/index.html
grep -n "app.js?v=756" static/zonaorientale/index.html
node --check static/zonaorientale/assets/app.js
node --check static/fanta-engine/js/ui/boot-preloader-v756.js
```

Da browser mobile/desktop:
```js
document.querySelector('script[src*="boot-preloader"]')?.src
document.querySelector('script[src*="app.js"]')?.src
window.ZonaOrientaleBootPreloaderV756
window.ZonaOrientaleMobileBootHardfixV756
```
