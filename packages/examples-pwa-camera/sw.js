const cacheName = "examples-pwa-camera-caches"
const contentToCache = [
  "app.js",
  "favicon.ico",
  "index.html",
  "pwa-register.js",
  "sw.js",
  "assets/style.css",
  "assets/icon/add_a_photo.svg",
  "assets/icon/crop_free.svg",
  "assets/icon/delete.svg",
  "assets/icon/flip_camera_android.svg",
  "assets/icon/icon.png",
  "assets/js/camera.js",
  "assets/js/controls.js",
  "assets/js/logger.js",
  "assets/js/settings.js",
]

self.addEventListener("install", (event) => {
  console.log("[Service Worker] Install")
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      console.log("[Service Worker] Caching all: app shell and content")
      // for (const content of contentToCache) {
      //   console.log(`[Service Worker] add ${content}`);
      // }
      await cache.addAll(contentToCache)
    })()
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      console.log(`[Service Worker] Fetching resource: ${event.request.url}`)
      const chached = await caches.match(event.request)
      if (chached) return chached

      const response = await fetch(event.request)
      const cache = await caches.open(cacheName)
      console.log(`[Service Worker] Caching new resource: ${event.request.url}`)
      cache.put(event.request, response.clone())

      return response
    })()
  )
})

self.addEventListener("push", (event) => {
  console.log("[Service Worker] Push")
  const payload = event.data ? event.data.text() : "no payload"
  console.log("[Service Worker] Push payload:", payload)
})
