const CACHE_NAME = 'my-cache-v1';
const urlsToCache = [
    '/',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/WIINTER.png',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/winter.mp3',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/hydrangea%20haze.png',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/hydrangea%20haze.mp3',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/%E9%9D%92%E5%B2%9A.png',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/mp3/%E9%9D%92%E5%B2%9A.mp3',
    'https://w3svwsauq3bn5lj.oss-cn-beijing.aliyuncs.com/img/bg.jpg',
    './style.css',
    './script.js',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
