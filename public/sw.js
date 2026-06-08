self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple pass-through fetch to satisfy PWA requirements
  // You can add offline caching logic here in the future
  event.respondWith(fetch(event.request));
});
