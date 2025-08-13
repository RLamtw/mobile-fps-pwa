const CACHE='mobile-fps-v2.0.1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET' || u.origin!==location.origin) return;
  if(u.searchParams.get('debug')==='1'){
    e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(r=>r || fetch(e.request).then(net=>{
      const copy = net.clone(); caches.open(CACHE).then(c=>c.put(e.request, copy));
      return net;
    }).catch(()=>{ if(e.request.mode==='navigate') return caches.match('./index.html'); }))
  );
});