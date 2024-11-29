'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "f323cd8a22d80db8b93d9f5d6dd3db16",
"version.json": "70f68360a995e249340a06b027f0f22a",
"index.html": "7768cf4d074061509d0662b833a6b1cd",
"/": "7768cf4d074061509d0662b833a6b1cd",
"main.dart.js": "a202db46466ee946a29a5d82e0021998",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"favicon.png": "b1acea200b4e80365b43cb718c00ddc7",
"icons/Icon-192.png": "5c0276e44153f717c89f4f325d709f58",
"icons/Icon-maskable-192.png": "5c0276e44153f717c89f4f325d709f58",
"icons/Icon-maskable-512.png": "3f1b106f88444854f7d396a033589f2c",
"icons/Icon-512.png": "3f1b106f88444854f7d396a033589f2c",
"manifest.json": "35e60576c21149b8079dcc15f150d03c",
"assets/AssetManifest.json": "9a284036668fb10563c68064bd4fbf94",
"assets/NOTICES": "ae7d25a6b8b41199352a94cfaed9a021",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "74a5bfbacc1573d22971682dec79b933",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "89f54ea645339834b5c854065cc22fbe",
"assets/fonts/MaterialIcons-Regular.otf": "06418dc84e4c7956dac1c822398acead",
"assets/assets/images/banner_right.png": "3fc7abd20c08d7e7c6758011fb86bf16",
"assets/assets/images/background.png": "9a3513e593977a775f0af4ebda59b9fa",
"assets/assets/icons/vt_family.png": "850ae29f186db14943015d5b1600dec6",
"assets/assets/icons/ic_apple.svg": "b5e11436766b511e94c5ee12592cc153",
"assets/assets/icons/one_v.png": "d6aeef3c138b42f78ef9e53825b67c09",
"assets/assets/icons/one_v.svg": "aa0100a001ee67587012984b876ac46f",
"assets/assets/icons/v_office.png": "8e60a05a9ace1cbbe93a53855332558b",
"assets/assets/icons/ic_open_in_new_tab.svg": "20743fd9a2cdad8ac5336e39233611e6",
"assets/assets/icons/m_suite.png": "616f35439e782081cdd05ff2599b5e63",
"assets/assets/icons/vt_post.png": "c6f02d2a409497d10ba738deb55af7d6",
"assets/assets/icons/nbox.png": "48480d059a7a4367a7b29d03e2e24bcb",
"assets/assets/icons/netmind.png": "9a41fe4ee7ed987aac8faf76f8da0e23",
"assets/assets/icons/app_store.svg": "d24145d60c5b3a3aec7132d64c9e0e11",
"assets/assets/icons/dcim.svg": "a2d4b909b2180a2f7b876d2c459089c7",
"assets/assets/icons/play_store.svg": "a81ac155442633547d43dc0fe8176b73",
"assets/assets/icons/hot.png": "f141fe93fd5193abed3254549a76166e",
"assets/assets/icons/vops.svg": "36d1262f9ba2867b379365814e8aa0ef",
"assets/assets/icons/ic_android.svg": "0e8b442b1deecb49d739e8b8b360edbb",
"assets/assets/icons/ic_download.svg": "26d279522882341249811bcec57560db",
"assets/assets/icons/pctt.svg": "a0acf350bfed3ecc9de9666091a55294",
"assets/assets/files/service.json": "3a1c6a83f4d531d63e210402a425306d",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
