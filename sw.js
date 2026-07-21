// ═══ YashasLearns — Service Worker ═══
// Site: https://yashaslearns.com
// Bump VERSION whenever you push updated content files

const VERSION = 'lwys-v1.1';
const CACHE = VERSION;

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

// ─── Install ───
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate: remove old caches ───
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// ─── Fetch: cache-first with strict filtering ───
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // ── IGNORE these completely ──
  // 1. Non-GET requests
  if (event.request.method !== 'GET') return;

  // 2. Chrome extensions — cannot be cached, causes the error you saw
  if (url.startsWith('chrome-extension://')) return;
  if (url.startsWith('chrome://')) return;
  if (url.startsWith('moz-extension://')) return;

  // 3. External APIs — Wikipedia (Volvo images), Firebase, Google Fonts
  //    Let browser handle these normally
  const externalDomains = [
    'en.wikipedia.org',
    'upload.wikimedia.org',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'firestore.googleapis.com',
    'firebase.googleapis.com',
    'identitytoolkit.googleapis.com',
    'securetoken.googleapis.com',
    'www.gstatic.com'
  ];
  try {
    const parsedUrl = new URL(url);
    if (externalDomains.some(d => parsedUrl.hostname.includes(d))) return;
    // Only cache yashaslearns.com files
    if (parsedUrl.hostname !== 'yashaslearns.com' &&
        parsedUrl.hostname !== 'www.yashaslearns.com') return;
  } catch(e) {
    return; // Unparseable URL — ignore
  }

  // ── Cache-first for yashaslearns.com files ──
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            // Only cache valid same-origin responses
            if (!response ||
                response.status !== 200 ||
                response.type !== 'basic') {
              return response;
            }
            const toCache = response.clone();
            caches.open(CACHE)
              .then(cache => cache.put(event.request, toCache))
              .catch(() => {}); // Silently ignore cache write errors
            return response;
          })
          .catch(() => {
            // Offline fallback for page navigations
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// ─── Message handler ───
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
