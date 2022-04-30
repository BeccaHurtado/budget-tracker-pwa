const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE = "datacache-"+VERSION;

const FILES_TO_CACHE = [
    "/",
    "../index.html",
    "../css/styles.css",
    "../icons/icon-72x72.png",
    "../icons/icon-96x96.png",
    "../icons/icon-128x128.png",
    "../icons/icon-144x144.png",
    "../icons/icon-152x152.png",
    "../icons/icon-192x192.png",
    "../icons/icon-384x384.png",
    "../icons/icon-512x512.png",
    "../js/index.js",
    "../js/manifest.json",

    
];

// we use self because service workers run before the window object
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('fetch', function(e) {
    if (e.request.url.includes('/api/') ){
        e.respondWith(
            caches.open(DATA_CACHE)
            .then(cachedData =>{
                return fetch(e.request).then(result => {
                    if(result.status == 200){
                        cachedData.put(e.request.url, result.clone())
                    }
                    return result
                })
            }).catch(err =>{
                return cachedData.match(e.result);
            })
        )
        return; 
    }
    e.respondWith(fetch(e.request).catch(function(){
        return caches.match(e.request).then(function(response) {
            if(response) {
                return response;
            } else if (e.request.headers.get('accept').includes('text/html')){
                return caches.match('/')
            }      

        })
    }))
})
