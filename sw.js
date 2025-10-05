const cacheName = "my-app";
const assets = [
  '/',
  '/index.html',
  '/about.html',
  '/offline.html',
  '/404.html',
  '/css/style.css',
  '/css/bootstrap.css',
  '/js/bootstrap.js',
  '/js/jquery-3.6.0.min.js',
  '/js/popper.min.js',
  '/js/script.js',
  '/img/icons/Google_Earth_Icon.png',
  '/manifest.json',
  'https://fonts.googleapis.com/css?family=Roboto+Slab:400,700|Roboto:300,400,400i,500,700',
  'https://use.fontawesome.com/releases/v6.1.0/js/all.js'
];

// Install → نخزن الملفات الأساسية
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Activate → نمسح أي كاش قديم
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== cacheName).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // لو الـ request مش http/https .. تجاهليه
  if (!(event.request.url.startsWith("http"))) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status === 404) {
            return caches.match("/404.html");
          }

          // خزّن نسخة بس للـ http/https requests
          const responseClone = response.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return response;
        })
        .catch(() => {
          return caches.match("/offline.html");
        });
    })
  );
});
