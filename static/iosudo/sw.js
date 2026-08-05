const IOSUDO_CACHE = 'iosudo-maintenance-v787';
const IOSUDO_MAINTENANCE_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

async function safePrecache() {
  const cache = await caches.open(IOSUDO_CACHE);
  await Promise.all(IOSUDO_MAINTENANCE_SHELL.map(async function (url) {
    try {
      const response = await fetch(url, { cache: 'reload' });
      if (response && response.ok) await cache.put(url, response.clone());
    } catch (error) {
      // La pagina di manutenzione resta disponibile con gli asset gia' recuperati.
    }
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(safePrecache().then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      const isIosudoCache = key.indexOf('iosudo-shell-') === 0 || key.indexOf('iosudo-maintenance-') === 0;
      return isIosudoCache && key !== IOSUDO_CACHE;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate'
    || url.pathname.endsWith('/iosudo/')
    || url.pathname.endsWith('/iosudo/index.html');

  if (isNavigation) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then(function (response) {
      if (response && response.ok) {
        const copy = response.clone();
        caches.open(IOSUDO_CACHE).then(function (cache) { cache.put('./index.html', copy); });
      }
      return response;
    }).catch(function () {
      return caches.match('./index.html').then(function (cached) {
        return cached || caches.match('./');
      });
    }));
    return;
  }

  event.respondWith(fetch(event.request).then(function (response) {
    if (response && response.ok) {
      const copy = response.clone();
      caches.open(IOSUDO_CACHE).then(function (cache) { cache.put(event.request, copy); });
    }
    return response;
  }).catch(function () { return caches.match(event.request); }));
});

// V787: ioSudo disattivato; pubblicata esclusivamente la pagina di manutenzione.
