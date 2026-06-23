const CACHE = 'qaahira-static-v5';
const STATIC_ASSETS = [
  '/Dental/assets/css/style.css',
  '/Dental/assets/js/main.js',
  '/Dental/assets/images/Navbarlogo.png',
  '/Dental/assets/images/tablogo.jpeg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const isPage =
    e.request.mode === 'navigate' ||
    url.pathname.endsWith('.php') ||
    url.pathname === '/Dental' ||
    url.pathname === '/Dental/';

  // Always fetch fresh HTML/PHP pages (never serve stale navbar/footer)
  if (isPage) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache static assets only
  if (url.pathname.includes('/assets/')) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(e.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  e.respondWith(fetch(e.request));
});
