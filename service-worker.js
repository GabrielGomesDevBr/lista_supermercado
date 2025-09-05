const CACHE_NAME = 'shopping-list-cache-v5';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/env-config.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/favicon.ico',
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
                console.log('Cache aberto - versão 5 - Ícones atualizados');
                // Limpar cache de ícones antigos primeiro
                return Promise.all([
                    cache.delete('/icon-192.svg'),
                    cache.delete('/icon-512.svg')
                ]).then(() => {
                    // Então adicionar novos recursos
                    return cache.addAll(URLS_TO_CACHE);
                });
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

// Evento de ativação: limpa caches antigos e força refresh do PWA
self.addEventListener('activate', event => {
    console.log('Service Worker ativando - v5 com novos ícones');
    
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        Promise.all([
            // Força todos os clientes a usar o novo service worker
            self.clients.claim(),
            // Limpa todos os caches antigos
            caches.keys().then(cacheNames => {
                console.log('Caches encontrados:', cacheNames);
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheWhitelist.indexOf(cacheName) === -1) {
                            console.log('Removendo cache antigo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Força refresh da página para carregar novos recursos
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    console.log('Enviando mensagem de reload para cliente');
                    client.postMessage({
                        type: 'CACHE_UPDATED',
                        message: 'Ícones atualizados! Recarregando...'
                    });
                });
            })
        ])
    );
});
