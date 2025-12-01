self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

let authToken = null;

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SET_AUTH_TOKEN') {
    authToken = data.token || null;
  } else if (data.type === 'GET_AUTH_TOKEN') {
    const port = event.ports && event.ports[0];
    port && port.postMessage({ token: authToken });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (!url.pathname.startsWith('/api/admin/stream/')) return;

  event.respondWith((async () => {
    try {
      const headers = new Headers(event.request.headers);
      if (authToken && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
      const init = {
        method: event.request.method,
        headers,
        mode: event.request.mode,
        credentials: event.request.credentials,
        cache: event.request.cache,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        integrity: event.request.integrity
      };
      if (event.request.method !== 'GET' && event.request.method !== 'HEAD') {
        init.body = await event.request.clone().blob();
      }
      const authorizedRequest = new Request(event.request.url, init);
      return fetch(authorizedRequest);
    } catch (_e) {
      return fetch(event.request);
    }
  })());
});


