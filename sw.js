// ═══ LearnwithYashas — Service Worker ═══
// Site: https://yashaslearns.com
// Bump VERSION whenever you push updated content files
// Browser detects the change and re-downloads everything fresh

const VERSION = 'lwys-v1.0';
const CACHE = VERSION;

// All files to pre-cache on first install
// As we split QB into subject files, add them here
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
  // Future data files — add these as we create them:
  // '/data/qb_science.js',
  // '/data/qb_hs.js',
  // '/data/qb_english.js',
  // '/data/qb_sanskrit.js',
  // '/data/qb_painting.js',
  // '/data/sums.js',
  // '/data/chs.js'
];

// ─── Install: cache everything listed above ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: remove old version caches ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: cache-first, network fallback ───
// Cached files are served instantly even offline
// New files fetched from network are also saved for offline use
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // External APIs (Wikipedia for Volvo images, Google Fonts):
  // Network only — no caching (they change, and we don't need offline images)
  const externalDomains = [
    'en.wikipedia.org',
    'upload.wikimedia.org',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ];
  if (externalDomains.some(d => url.hostname.includes(d))) {
    return; // Let browser handle normally
  }

  // yashaslearns.com files: cache-first
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) {
          return cached; // Serve from cache (works offline)
        }

        // Not cached — fetch from network and save to cache
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            // Clone before consuming (stream can only be read once)
            const toCache = response.clone();
            caches.open(CACHE)
              .then(cache => cache.put(event.request, toCache));
            return response;
          })
          .catch(() => {
            // Completely offline and not cached
            // For page navigations, return index.html as fallback
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// ─── Message handler ───
// The site sends 'SKIP_WAITING' to activate new SW immediately
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
