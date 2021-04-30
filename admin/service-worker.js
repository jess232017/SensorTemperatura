// service-worker.js
self.addEventListener('install', e => {
    // Instalar de inmediato
    if (self.skipWaiting) { self.skipWaiting(); }
    e.waitUntil(
        caches.open('cache02').then(function(cache) {
            return cache.addAll([
                './',
                //HTML
                './attendance.html',
                './index.html',
                './login.html',
                './student-info.html',
                './student.html',
                './temperature.html',
                //CSS
                './css/fixes.css',
                './css/style.css',
                '../css/style.css',
                //CDN CSS
                'https://cdn.jsdelivr.net/npm/bs-stepper/dist/css/bs-stepper.min.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css',
                'https://cdn.datatables.net/v/bs4/dt-1.10.20/datatables.min.css',
                'https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css',
                'https://unpkg.com/@coreui/coreui/dist/css/coreui.min.css',
                'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css',

                //No cachear en producion
                //'https://cdn.onesignal.com/sdks/OneSignalSDK.js',

                //JavaScript
                './js/min/main.min.js',
                //CDN JS
                'https://unpkg.com/dexie@latest/dist/dexie.js',
                'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
                'https://unpkg.com/@popperjs/core@2.9.2/dist/umd/popper.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js',
                'https://unpkg.com/@coreui/coreui/dist/js/coreui.min.js',
                'https://cdn.jsdelivr.net/npm/bs-stepper/dist/js/bs-stepper.min.js',
                'https://cdn.datatables.net/v/bs4/dt-1.10.20/datatables.min.js',
                'https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js',
                'https://cdn.jsdelivr.net/npm/chart.js@3.2.0/dist/chart.min.js',
                'https://bernii.github.io/gauge.js/dist/gauge.min.js',

                //ASSETS
                './img/profile.png',
                './assets/translate.json',
                './assets/svg-symbols.css',
                './assets/svg-symbols.svg',
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
var cacheWhitelist = ['cache02'];
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