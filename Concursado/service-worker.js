
const CACHE_NAME = "concursado-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// Instalação
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key =>
                        key.startsWith("concursado-") &&
                        key !== CACHE_NAME
                    )
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Atualização dos arquivos
self.addEventListener("fetch", event => {
    const request = event.request;
    const url = new URL(request.url);

    if (
        request.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);

            try {
                const response = await fetch(request, {
                    cache: "no-cache"
                });

                if (response.ok) {
                    await cache.put(
                        request,
                        response.clone()
                    );
                }

                return response;

            } catch (error) {
                const cached = await cache.match(request);

                if (cached) return cached;

                if (request.mode === "navigate") {
                    const fallback =
                        await cache.match("./index.html");

                    if (fallback) return fallback;
                }

                return Response.error();
            }
        })()
    );
});
