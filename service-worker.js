const CACHE_NAME = 'shopping-list-cache-v3';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/env-config.js',
    '/manifest.json',
    '/icon-192.svg',
    '/icon-512.svg',
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js'
];

// Evento de instalação: pré-cache dos arquivos da aplicação
self.addEventListener('install', event => {
    // Força a ativação imediata do novo service worker
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto - versão 3');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Evento de fetch: serve arquivos do cache primeiro, com fallback para a rede
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Se o recurso estiver no cache, retorna ele
                if (response) {
                    return response;
                }
                // Senão, busca na rede
                return fetch(event.request);
            })
    );
});

// Evento de ativação: limpa caches antigos
self.addEventListener('activate', event => {
    // Força todos os clientes a usar o novo service worker
    event.waitUntil(self.clients.claim());
    
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            console.log('Limpando caches antigos...', cacheNames);
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Removendo cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
