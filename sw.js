/*
 * Laos Show Forecaster – Service Worker
 * -------------------------------------
 * Precaches the HTML, manifest, icons and the two CDN libraries
 * (Chart.js and SheetJS) so the app works fully offline after the
 * first successful load.
 *
 * Bump CACHE_VERSION whenever you change the app so users pick up
 * the new files on their next visit.
 */

const CACHE_VERSION = "laos-forecaster-v1";
const PRECACHE_URLS = [
  "./",
  "./laos_show_forecaster.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
];

// ---------- Install: precache core assets ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      // Use no-cors requests for cross-origin CDN so we can cache opaque responses
      return Promise.all(
        PRECACHE_URLS.map((url) => {
          const req = new Request(url, {
            mode: url.startsWith("http") ? "no-cors" : "same-origin",
          });
          return fetch(req)
            .then((resp) => cache.put(url, resp))
            .catch((err) => console.warn("Precache miss:", url, err));
        })
      );
    })
  );
  self.skipWaiting();
});

// ---------- Activate: clear old caches ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ---------- Fetch: cache-first with network fallback ----------
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((response) => {
          // Cache successful GETs on the fly (best-effort)
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            try { cache.put(req, copy); } catch (_) {}
          });
          return response;
        })
        .catch(() => {
          // Offline fallback: if navigating, return the main HTML
          if (req.mode === "navigate") {
            return caches.match("./laos_show_forecaster.html");
          }
        });
    })
  );
});
