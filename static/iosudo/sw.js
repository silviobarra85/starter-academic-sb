const IOSUDO_CACHE = 'iosudo-shell-v765';
const IOSUDO_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  '../fanta-engine/css/iosudo-app-v765.css?v=764',
  '../fanta-engine/js/apps/iosudo-app-v765.js?v=764'
];

async function safePrecache() {
  const cache = await caches.open(IOSUDO_CACHE);
  await Promise.all(IOSUDO_SHELL.map(async function (url) {
    try {
      const response = await fetch(url, { cache: 'reload' });
      if (response && response.ok) await cache.put(url, response.clone());
    } catch (error) {
      // V765: non blocca l'installazione se un asset opzionale non risponde su mobile.
    }
  }));
}

self.addEventListener('install', function (event) {
  event.waitUntil(safePrecache().then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key.indexOf('iosudo-shell-') === 0 && key !== IOSUDO_CACHE;
    }).map(function (key) { return caches.delete(key); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  if (url.pathname.indexOf('/fanta-engine/data/sudatori/current/') !== -1 || url.pathname.indexOf('/assets/rose/') !== -1 || url.pathname.indexOf('/fanta-engine/data/shared-assets/current/assets/listoni/') !== -1) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(function () { return caches.match(event.request); }));
    return;
  }
  if (event.request.mode === 'navigate' || url.pathname.endsWith('/iosudo/') || url.pathname.endsWith('/iosudo/index.html')) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).then(function (response) {
      const copy = response.clone();
      caches.open(IOSUDO_CACHE).then(function (cache) { cache.put('./index.html', copy); });
      return response;
    }).catch(function () {
      return caches.match('./index.html').then(function (cached) { return cached || caches.match(event.request); });
    }));
    return;
  }
  event.respondWith(fetch(event.request).then(function (response) {
    if (response && response.ok && event.request.method === 'GET') {
      const copy = response.clone();
      caches.open(IOSUDO_CACHE).then(function (cache) { cache.put(event.request, copy); });
    }
    return response;
  }).catch(function () { return caches.match(event.request); }));
});
