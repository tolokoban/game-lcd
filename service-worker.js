if(!self.define){let e,d={};const i=(i,r)=>(i=new URL(i+".js",r).href,d[i]||new Promise((d=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=d,document.head.appendChild(e)}else e=i,importScripts(i),d()})).then((()=>{let e=d[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,t)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(d[s])return;let o={};const a=e=>i(e,s),n={module:{uri:s},exports:o,require:a};d[s]=Promise.all(r.map((e=>n[e]||a(e)))).then((e=>(t(...e),o)))}}define(["./workbox-ad8011fb"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"../dist/editor/app/app.d.ts",revision:"61b8ef9bdf94765b6212596dddc9c8f7"},{url:"../dist/editor/app/exporter/exporter.d.ts",revision:"0df9719d21e9e685a20f6f5c39588820"},{url:"../dist/editor/app/index.d.ts",revision:"ff4fdeee6ac7e1ebdbefc68559826e66"},{url:"../dist/editor/app/keyboard-shortcuts.d.ts",revision:"20258fff20a2655834c963b522d41f7b"},{url:"../dist/editor/app/painter/index.d.ts",revision:"93c0e07aa6471ae6cf24104509ddc6d7"},{url:"../dist/editor/app/painter/painter.d.ts",revision:"a12b517d639684ef34227da6a23b2f1c"},{url:"../dist/editor/app/painter/polygon.d.ts",revision:"148c909d1c321e1e5a5b17d7f3995ff9"},{url:"../dist/editor/app/painter/sub-polygon.d.ts",revision:"4f89031db4e39632ec3f1180d0aa7d9b"},{url:"../dist/editor/app/selection.d.ts",revision:"9266db2d6b79d86344d606b1543c8768"},{url:"../dist/editor/data/data.d.ts",revision:"1d99381331d84fa1084a19b5827f059d"},{url:"../dist/editor/data/hooks.d.ts",revision:"82dfd31cf780dc1e519f7b541eda6dc0"},{url:"../dist/editor/data/index.d.ts",revision:"3bbaaebb0d2557e8a3e6ee6156b8266d"},{url:"../dist/editor/data/provider.d.ts",revision:"851f0df9114d4f7444acf082e992ee76"},{url:"../dist/editor/data/storage.d.ts",revision:"55f5f2f9e08ec37492ff175d1735ac30"},{url:"../dist/editor/data/types.d.ts",revision:"bd1f9f63788ae9564348d4c56e9397d2"},{url:"../dist/editor/editor.d.ts",revision:"f6109eb858a8efd22493ba473a9a0df2"},{url:"../dist/editor/index.d.ts",revision:"cd4af3563e922f065c10e3dc75148a45"},{url:"../dist/editor/tool/async.d.ts",revision:"46ed67f5a5b34ac602c8a4e3a0c41291"},{url:"../dist/editor/tool/calc.d.ts",revision:"0a46a4611aa485d8c07a55a51045370f"},{url:"../dist/editor/tool/generic-event.d.ts",revision:"4925f8d86f714669c8b47fbe26bdf5b1"},{url:"../dist/editor/tool/guards.d.ts",revision:"8fdbc540dae03e5af8ef250ce3dc889c"},{url:"../dist/editor/tool/pointer-watcher.d.ts",revision:"a2f2a0cc1e89e6848cda94bdb119293e"},{url:"../dist/editor/tool/triangulate.d.ts",revision:"70987651e21db53db8d8f841724065eb"},{url:"../dist/editor/view/editor/editor-view.d.ts",revision:"5458516b1de9e833db2a07b2af0354be"},{url:"../dist/editor/view/editor/index.d.ts",revision:"b5627a43c0b15c9d2c3dc43be22e5fbf"},{url:"../dist/editor/view/polygon-button/index.d.ts",revision:"0c19af58168ee20e41a706b00337a4d9"},{url:"../dist/editor/view/polygon-button/polygon-button-view.d.ts",revision:"555d020653805eabfa368d4b6750e3e8"},{url:"../dist/editor/view/polygons-list/index.d.ts",revision:"f4fa5720352bf024a63abd461dfbb265"},{url:"../dist/editor/view/polygons-list/polygons-list-view.d.ts",revision:"2fae3205e64753ecae9ed85e805debd1"},{url:"../dist/game/base-painter.d.ts",revision:"714dd365b09436c5263ee076d5538400"},{url:"../dist/game/game.d.ts",revision:"d9fae546d7dde41bda291a47c6842495"},{url:"../dist/game/logic/index.d.ts",revision:"074c7111828d9c245d848cc4b9bf757a"},{url:"../dist/game/logic/logic.d.ts",revision:"efe223717b9c6c34d9735b23c8a46b09"},{url:"../dist/game/logic/make-sprites.d.ts",revision:"a35fd8f68863fa7cfa578a4aac0cdffd"},{url:"../dist/game/logic/user-input.d.ts",revision:"024e963e8ca35b7f53ac975798fef204"},{url:"../dist/game/logic/waves.d.ts",revision:"0634698f1f4bfef570ab18168fb1f9e5"},{url:"../dist/game/painter.d.ts",revision:"4e56a4e6da1f895f119d5817ac8d9a0c"},{url:"../dist/game/sprites.d.ts",revision:"30137d7a5b9ba9803d5e38c91f0dabc7"},{url:"../dist/game/tiles-painter.d.ts",revision:"d5e2320638c3593439e16b80477aea63"},{url:"../dist/index.d.ts",revision:"0884b76b9b8bd3d2776e1840cd54d79b"},{url:"../dist/wave/index.d.ts",revision:"7c390189900e590beb05a3cb5301dca7"},{url:"../dist/wave/wave.d.ts",revision:"6c6ffff34de8f769d9d41ec1890bd237"},{url:"./img/background.4e2e13c4372e9ef697ad.webp",revision:null},{url:"./img/button-red.596c2e150989d08b0439.webp",revision:null},{url:"./img/frame-texture.34f8df6136d6622504d5.jpg",revision:null},{url:"./img/frame.108bd4bbee931109f4c7.webp",revision:null},{url:"./img/sprites.27d25f8da9171c32e346.webp",revision:null},{url:"./scr/app.9ce70030d46e2ea542ea.js",revision:null},{url:"./scr/libs.6832dc7d389016060bd6.js",revision:null},{url:"./scr/libs.6832dc7d389016060bd6.js.LICENSE.txt",revision:"b114cc85da504a772f040e3f40f8e46a"},{url:"./scr/runtime.5cb72daac017785c3d7c.js",revision:null},{url:"favicon.ico",revision:"9a976aa1a79bce53684a8e4d70234719"},{url:"index.html",revision:"f054359a1a32fef3e47cdf1d51588c3c"},{url:"logo192.png",revision:"951c78af37858869aa3b595afd1f9a87"},{url:"logo512.png",revision:"3b2b8144243bd59f1b3db9d5b3ba8e4b"},{url:"manifest.json",revision:"bcff90bb45342cac5187e07b8c71063e"},{url:"robots.txt",revision:"fa1ded1ed7c11438a9b0385b1e112850"}],{})}));
