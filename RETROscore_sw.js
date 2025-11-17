self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('retroscore-v1').then(cache => {
      return cache.addAll([
        './RETROscore_index_v0_5.html',
        './RETROscore_manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
