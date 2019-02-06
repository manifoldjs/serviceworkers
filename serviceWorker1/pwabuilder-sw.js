// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";
const offlinePage = "index.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("[PWA Builder] Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Cached offline page during install");
      return cache.add(offlinePage);
    })
  );
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  
  // The following validates that the request is for a navigation to a new document
  if (
    event.request.destination !== "document" ||
    event.request.mode !== "navigate"
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
      return caches.open(CACHE).then(function (cache) {
        return cache.match("offline.html");
      });
    })
  );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
  const offlinePageRequest = new Request(offlinePage);

  return fetch(offlinePage).then(function (response) {
    return caches.open(CACHE).then(function (cache) {
      console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
      return cache.put(offlinePageRequest, response);
    });
  });
});
