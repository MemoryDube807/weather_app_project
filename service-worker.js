const CACHE_NAME = "weather-app-cache-v4"; // Increment the cache version
const urlsToCache = [
  "./",
  "./index.html",
  "./index.css",
  "./index.js",
  "https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache resources:", error);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass caching for API requests to the backend
  if (url.origin === "https://weather-app-project-7req.onrender.com") {
    event.respondWith(fetch(event.request)); // Directly fetch from the network
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
