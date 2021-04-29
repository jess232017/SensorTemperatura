// service-worker.js
self.addEventListener('install', function(event) {
    // Instalar de inmediato
    if (self.skipWaiting) { self.skipWaiting(); }
    event.waitUntil(
        caches.open('cache01').then(function(cache) {
            return cache.addAll([
                './',
                //HTML
                'attendance.html',
                'index.html',
                'login.js',
                'student-info.html',
                'student.html',
                'temperature.html',
                //JavaScript
                './js/main.js',
                './js/firebase.js',
                //CSS
                './css/style.css',
                './css/login.css',
                './css/style.css',
                './css/student.css',
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

// Elimina archivos de cache viejos
var cacheWhitelist = ['cache01'];
caches.keys().then(function(cacheNames) {
    return Promise.all(
        cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName);
            }
        })
    );
});

caches.keys().then(function(cacheKeys) {
    // Muestra en la consola la cache instalada 
    console.log('Versión SW: ' + cacheKeys);
});

self.addEventListener("activate", event => {
    //console.log('Activate!');
});