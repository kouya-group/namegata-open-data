const CACHE_NAME = 'namegata-od-v1';
const BASE = '/namegata-open-data';

const PRECACHE_URLS = [
  `${BASE}/`,
  `${BASE}/favicon.svg`,
  `${BASE}/leaflet.js`,
  `${BASE}/leaflet.css`,
  `${BASE}/chart.min.js`,
];

const PRIORITY_DATA = [
  `${BASE}/data/raw/shelters.csv`,
  `${BASE}/data/raw/aed.csv`,
  `${BASE}/data/raw/fire-water.csv`,
  `${BASE}/data/processed/shelters.json`,
  `${BASE}/data/processed/aed.json`,
  `${BASE}/data/processed/fire-water.json`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll([...PRECACHE_URLS, ...PRIORITY_DATA]).catch(() => {
        return cache.addAll(PRECACHE_URLS);
      })
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.pathname.startsWith(BASE)) return;

  const isDataFile =
    url.pathname.includes('/data/') || url.pathname.endsWith('.json');
  const isPage =
    url.pathname.endsWith('/') || url.pathname.endsWith('.html');
  const isAsset =
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2');

  if (isAsset) {
    event.respondWith(cacheFirst(request));
  } else if (isDataFile || isPage) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}
