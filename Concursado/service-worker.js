const CACHE_NAME = "calibre-v4";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        )).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    const url = new URL(event.request.url);
    // Não interferir nas requisições externas (Supabase, Google, Hotmart etc.).
    if (url.origin !== self.location.origin) return;

    // Apenas arquivos do aplicativo e navegação: rede primeiro, cache se offline.
    const isAppFile = FILES_TO_CACHE.some(path =>
        url.pathname === new URL(path, self.registration.scope).pathname
    );
    if (event.request.mode !== "navigate" && !isAppFile) return;

    event.respondWith((async () => {
        try {
            const response = await fetch(event.request);
            if (response.ok && response.type === "basic") {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(event.request, response.clone());
            }
            return response;
        } catch (error) {
            const cached = await caches.match(event.request);
            if (cached) return cached;
            if (event.request.mode === "navigate") {
                const fallback = await caches.match(new URL("./index.html", self.registration.scope));
                if (fallback) return fallback;
            }
            return Response.error();
        }
    })());
});