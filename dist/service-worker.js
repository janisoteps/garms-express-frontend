"use strict";var precacheConfig=[["147035719892507bc312bd616f49b184.png","147035719892507bc312bd616f49b184"],["1c6ca9ca6bc9d358c3b08c1b9fdc6bcd.svg","1c6ca9ca6bc9d358c3b08c1b9fdc6bcd"],["5dcf597dd1ac44f16b96ed62cbbd1124.png","5dcf597dd1ac44f16b96ed62cbbd1124"],["61955d8424203cc359e8070f890e1be1.svg","61955d8424203cc359e8070f890e1be1"],["6faddf1e3a81cd5f82763be97e3a2294.jpg","6faddf1e3a81cd5f82763be97e3a2294"],["8b72716af476b0d20c13169ec1af335b.jpg","8b72716af476b0d20c13169ec1af335b"],["9546435ab85f17d329ed8558d03ef892.jpg","9546435ab85f17d329ed8558d03ef892"],["9d2243d089dda8c786fa099b0b323e98.png","9d2243d089dda8c786fa099b0b323e98"],["b34112cf9783abbb7c4b85aed2d356bb.png","b34112cf9783abbb7c4b85aed2d356bb"],["ea3a11ed7851cf618c5a4d671b955cfc.png","ea3a11ed7851cf618c5a4d671b955cfc"],["fe8dc4412c0ab87d97983c500ae45e62.png","fe8dc4412c0ab87d97983c500ae45e62"],["main.css","93cc7c781d2a09c7575454ea390ff5db"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,n,t,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),a.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],r=new URL(n,self.location),a=createCacheKey(r,hashParamName,t,/\.\w{8}\./);return[r.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var r=new Request(t,{credentials:"same-origin"});return fetch(r).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,"index.html"),n=urlsToCacheKeys.has(t));!n&&"navigate"===e.request.mode&&isPathWhitelisted([],e.request.url)&&(t=new URL("/index.html",self.location).toString(),n=urlsToCacheKeys.has(t)),n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});