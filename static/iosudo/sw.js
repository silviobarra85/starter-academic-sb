const IOSUDO_CACHE = 'iosudo-shell-v621';
const IOSUDO_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  '../fanta-engine/css/iosudo-app-v621.css?v=621',
  '../fanta-engine/js/apps/iosudo-app-v621.js?v=621'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(IOSUDO_CACHE).then(function (cache) {
    return cache.addAll(IOSUDO_SHELL);
  }).then(function () {
    return self.skipWaiting();
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (key) {
      return key.indexOf('iosudo-shell-') === 0 && key !== IOSUDO_CACHE;
    }).map(function (key) {
      return caches.delete(key);
    }));
  }).then(function () {
    return self.clients.claim();
  }));
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);
  if (url.pathname.indexOf('/fanta-engine/data/sudatori/current/') !== -1 || url.pathname.indexOf('/assets/rose/') !== -1) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(function () {
      return caches.match(event.request);
    }));
    return;
  }
  event.respondWith(caches.match(event.request).then(function (cached) {
    return cached || fetch(event.request);
  }));
});
