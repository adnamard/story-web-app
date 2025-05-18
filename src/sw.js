import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then((cached) => {
        return cached || fetch(event.request);
      })
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.message || 'Notifikasi baru dari Story App!',
    icon: '/add-x512.png',
    badge: '/add-x512.png',
  };
  event.waitUntil(
    self.registration.showNotification('Story App', options)
  );
});
