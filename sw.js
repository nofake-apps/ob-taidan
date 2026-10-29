// オフライン用：一度開いたら、通信なしでも動くように保存しておく
const CACHE = "ob-taidan-v12";
const FILES = ["./", "./index.html", "./manifest.json", "./logo.png", "./apple-touch-icon.png", "./DotGothic16-Regular.ttf"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;   // 通信（AIなど）はそのまま通す
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).catch(() => caches.match("./index.html"))));
});
