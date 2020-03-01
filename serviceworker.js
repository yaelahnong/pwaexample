var CACHE_NAME = 'my-site-cache-v1'; // NAMA CACHE
var urlsToCache = [
    '/',
    '/fallback.json',
    '/css/main.css',
    '/js/jquery.min.js',
    '/js/main.js',
    '/img/logo-as.svg'
];

// KETIKA DI INSTALL, MEMANGGIL FUNGSI WAIT UNTIL
self.addEventListener('install', function(event) {
  // Perform install steps
    event.waitUntil(
    // API CACHE STORAGE, METHOD OPEN
    caches.open(CACHE_NAME).then(function(cache) { // WAIT UNTIL MENJALANKAN KETIKA YANG DI DALAM NYA SUDAH DISELESAIKAN
        console.log('in install serviceworker... cache opened');
        // LALU DI RETURN DENGAN FUNGSI addAll
        // MEMASUKKAN DAFTAR URL YANG ADA DI VARIABEL urlsToCache
        return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    
    // url yang di akses
    var request = event.request
    var url     = new URL(request.url) //object url javascript
    
    // pisahkan request API dan Internal
    if(url.origin === location.origin) {

        event.respondWith(
        
            caches.match(request).then(function(response){
                return response || fetch(request)
            })

        );
    // ketika url tidak sama dengan url origin (API)
    } else {

        event.respondWith(
            caches.open('products-cache').then(function(cache){
                // fetch url ke network langsung
                return fetch(request).then(function(liveResponse){
                    // menyimpan data di cache
                            // nama url
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                }).catch(function(){
                    return caches.match(request).then(function(response){
                        if(response) return response
                        return caches.match('/fallback.json')
                    })
                })
            })
        )

    }

});


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName != CACHE_NAME
                }).map(function(cacheName){
                    return caches.delete(cacheName)
                })
            );
        })
    );
});