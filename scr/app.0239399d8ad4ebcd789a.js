"use strict";(self.webpackChunksnapshot_annotation=self.webpackChunksnapshot_annotation||[]).push([[143],{164:(t,n,e)=>{e.d(n,{Z:()=>l});var r=e(81),o=e.n(r),i=e(645),a=e.n(i)()(o());a.push([t.id,".App {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    padding: 0;\n    margin: 0;\n    right: 0;\n    bottom: 0;\n}\n\n.App > * {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    height: 100%;\n    width: auto;\n}\n\n.App > canvas {\n    left: 0;\n    width: calc(100% - 320px);\n}\n\n.App > aside {\n    right: 0;\n    width: 320px;\n    background-color: var(--theme-color-frame);\n    color: var(--theme-color-on-frame);\n}\n",""]);const l=a},788:(t,n,e)=>{e.d(n,{Z:()=>l});var r=e(81),o=e.n(r),i=e(645),a=e.n(i)()(o());a.push([t.id,":root {\n    --theme-color-screen: hsl(212, 10%, 40%);\n    --theme-color-on-screen: #000;\n    --theme-color-frame: hsl(212, 10%, 60%);\n    --theme-color-on-frame: #000;\n    --theme-color-section: hsl(212, 10%, 80%);\n    --theme-color-on-section: #000;\n    --theme-color-input: hsl(212, 10%, 100%);\n    --theme-color-on-input: #000;\n    --theme-color-primary: hsl(212, 100%, 50%);\n    --theme-color-on-primary: #000;\n    --theme-color-accent: hsl(32, 100%, 50%);\n    --theme-color-on-accent: #000;\n}\n\nbody, html, #app {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    padding: 0;\n    overflow: hidden;\n    background-color: var(--theme-color-screen);\n    color: var(--theme-color-on-screen);\n    font-size: 16px;\n}    \n\nbutton.floating-button {\n    border: none;\n    background-color: var(--theme-color-accent);\n    color: var(--theme-color-on-accent);\n    display: grid;\n    place-items: center;\n    width: 2em;\n    height: 2em;\n    box-shadow: 0 .125em .25em #000;\n    overflow: hidden;\n    border-radius: 50%;\n    padding: 0;\n}\n\nbutton.floating-button > svg {\n    width: 1.5em;\n    height: 1.5em;\n    margin: 0;\n    padding: 0;\n}\n\nbutton {\n    font-size: 120%;\n    border: none;\n    cursor: pointer;\n    margin: .5em;\n    padding: 0 .5em;\n    line-height: 2em;\n    background: var(--theme-color-primary);\n    color: var(--theme-color-on-primary);\n    box-shadow: 0 .125em .25em #000;\n    font-variant: small-caps;\n    font-weight: bolder;\n}",""]);const l=a},217:(t,n,e)=>{e.d(n,{Z:()=>l});var r=e(81),o=e.n(r),i=e(645),a=e.n(i)()(o());a.push([t.id,".view-EditorView {}\n",""]);const l=a},507:(t,n,e)=>{e.d(n,{Z:()=>l});var r=e(81),o=e.n(r),i=e(645),a=e.n(i)()(o());a.push([t.id,".view-PolygonButtonView {\n    display: flex;\n    flex-direction: row;\n    justify-content: space-between;\n    align-items: center;\n    margin: .5em;\n}\n\n.view-PolygonButtonView.selected {\n    background-color: var(--theme-color-section);\n    color: var(--theme-color-on-section);\n    box-shadow: 0 .25em .5em #0009;\n}\n\n.view-PolygonButtonView > div {\n    flex: 1 1 auto;\n    line-height: 2em;\n    padding: 0 .5em;\n    background-color: transparent;\n    color: var(--theme-color-on-frame);\n}\n\n.view-PolygonButtonView > div.label:hover {\n    background-color: var(--theme-color-primary);\n    color: var(--theme-color-on-primary);\n    box-shadow: 0 .125em .25em #0009;\n    cursor: pointer;\n}\n\n.view-PolygonButtonView input {\n    border: none;\n    color: var(--theme-color-on-input);\n    background: var(--theme-color-input);\n    height: 2em;\n    padding: 0 .5em;\n    margin: .5em;\n    width: 100%;\n}",""]);const l=a},140:(t,n,e)=>{e.d(n,{Z:()=>l});var r=e(81),o=e.n(r),i=e(645),a=e.n(i)()(o());a.push([t.id,".view-PolygonsListView {}\n",""]);const l=a},949:(t,n,e)=>{var r=e(893),o=e(294),i=e(379),a=e.n(i),l=e(795),s=e.n(l),c=e(569),u=e.n(c),f=e(565),h=e.n(f),y=e(216),g=e.n(y),d=e(589),p=e.n(d),v=e(217),m={};function b(t){return(0,r.jsx)("canvas",{className:w(t),ref:function(n){n&&(t.painter.canvas=n)}})}function w(t){var n=["custom","view-EditorView"];return"string"==typeof t.className&&n.push(t.className),n.join(" ")}m.styleTagTransform=p(),m.setAttributes=h(),m.insert=u().bind(null,"head"),m.domAPI=s(),m.insertStyleElement=g(),a()(v.Z,m),v.Z&&v.Z.locals&&v.Z.locals;const x=e.p+"./img/image.003ee1ba447a846c139d.webp";const P=function(){function t(t){void 0===t&&(t="");var n=this;this.name=t,this.listeners=[],this.fire=function(t){var e,r;try{for(var o=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}(n.listeners),i=o.next();!i.done;i=o.next()){var a=i.value;try{a(t)}catch(e){console.error("[".concat(n.name,"] Error in a listener!")),console.error(">  ex.: ",e),console.error(">  arg.: ",t)}}}catch(t){e={error:t}}finally{try{i&&!i.done&&(r=o.return)&&r.call(o)}finally{if(e)throw e.error}}}}return Object.defineProperty(t.prototype,"length",{get:function(){return this.listeners.length},enumerable:!1,configurable:!0}),t.prototype.add=function(t){this.remove(t),this.listeners.push(t)},t.prototype.remove=function(t){this.listeners=this.listeners.filter((function(n){return n!==t}))},t.prototype.removeAll=function(){this.listeners.splice(0,this.listeners.length)},t}();function E(t,n){return{x:t.x-n.x,y:t.y-n.y}}function L(t,n){return t.x*n.x+t.y*n.y}function S(t,n){return t.x*n.y-t.y*n.x}function D(t,n){return t>0&&n>0||t<0&&n<0}var A=function(){function t(t,n){this.polygon=t,this.elements=n}return Object.defineProperty(t.prototype,"length",{get:function(){return this.elements.length},enumerable:!1,configurable:!0}),t.prototype.getPoint=function(t){var n=this.getElementIndex(t);return this.polygon.getPoint(n)},t.prototype.removePoint=function(n){var e=this.elements.filter((function(t,e){return e!==n}));return console.log("🚀 [sub-polygon] this.elements = ",this.elements),console.log("🚀 [sub-polygon] subElements = ",e),new t(this.polygon,e)},t.prototype.computeConvexity=function(t,n,e){var r=this.getElementIndex(t),o=this.getElementIndex(n),i=this.getElementIndex(e);return this.polygon.computeConvexity(r,o,i)},t.prototype.isEmptyTriangle=function(t,n,e){var r,o,i=this.getPoint(t),a=this.getPoint(n),l=this.getPoint(e),s=E(i,a),c=E(l,i),u=E(a,l);try{for(var f=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")}(this.polygon.points),h=f.next();!h.done;h=f.next()){var y=h.value,g=S(s,E(y,a));if(D(g,S(c,E(y,i)))&&D(S(u,E(y,l)),g))return!1}}catch(t){r={error:t}}finally{try{h&&!h.done&&(o=f.return)&&o.call(f)}finally{if(r)throw r.error}}return!0},t.prototype.getElementIndex=function(t){var n=this.elements.length;return t<0&&(t+=n*Math.ceil(-t/n)),this.elements[t%n]},t}();const C=A;var I=function(){return I=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},I.apply(this,arguments)};const j=function(){function t(t){void 0===t&&(t=[]),this.eventChange=new P,this._points=t}return t.prototype.reset=function(t){this._points=t.map((function(t){return I({},t)}))},Object.defineProperty(t.prototype,"points",{get:function(){return this._points},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"length",{get:function(){return this._points.length},enumerable:!1,configurable:!0}),t.prototype.getPoint=function(t){var n=this.length;if(0===n)throw Error("Polygon is empty!");return t<0&&(t+=n*Math.ceil(-t/n)),this._points[t%n]},t.prototype.getVector=function(t,n){var e=this.getPoint(t);return E(this.getPoint(n),e)},t.prototype.add=function(t,n){void 0===n&&(n=-1);try{n<0||n>this._points.length?this._points.push(t):this._points.splice(n,0,t)}finally{return this.fireChange(),n>-1?n:this.points.length-1}},t.prototype.remove=function(t){this._points.splice(t,1),this.fireChange()},t.prototype.findPoint=function(t){return this._points.findIndex((function(n){var e=t.x-n.x,r=t.y-n.y,o=e*e+r*r;return console.log(n,o),o<100}))},t.prototype.distFromEdge=function(t,n,e){var r,o=this.getPoint(n),i=t,a=E(this.getPoint(e),o),l=L(a,a);if(l<1e-9)return r=E(o,i),Math.sqrt(L(r,r));var s=E(i,o),c=L(s,s),u=L(s,a);return Math.sqrt(c-u*u/l)},Object.defineProperty(t.prototype,"elements",{get:function(){for(var t=Array(this.length),n=0;n<this.length;n++)t[n]=n;return t},enumerable:!1,configurable:!0}),t.prototype.computeConvexity=function(t,n,e){var r=this.getPoint(t),o=this.getPoint(n),i=this.getPoint(e);return S(E(r,o),E(i,o))},t.prototype.triangulate=function(){for(var t=new C(this,this.elements),n=[],e=0;e<this.length&&!(t.length<4);e++)t=_(t,n),console.log("🚀 [polygon] subPoly = ",t.length);return 3===t.length&&n.push([t.getElementIndex(0),t.getElementIndex(1),t.getElementIndex(2)]),console.log(JSON.stringify(n)),n},t.prototype.fireChange=function(){this.eventChange.fire()},t}();function _(t,n){for(var e=function(t){for(var n=0,e=Number.MAX_SAFE_INTEGER,r=0;r<t.length;r++){var o=t.getPoint(r).y;o<e&&(e=o,n=r)}var i=n,a=i-1,l=i+1,s=t.computeConvexity(a,i,l),c=new Set;for(r=0;r<t.length;r++)D(t.computeConvexity(r-1,r,r+1),s)&&c.add(r);return c}(t),r=0;r<t.length;r++)if(e.has(r)&&t.isEmptyTriangle(r-1,r,r+1))return n.push([t.getElementIndex(r-1),t.getElementIndex(r),t.getElementIndex(r+1)]),t.removePoint(r);throw Error("We are not supposed to get here!")}var T=function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a},B=function(t,n,e){if(e||2===arguments.length)for(var r,o=0,i=n.length;o<i;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return t.concat(r||Array.prototype.slice.call(n))};function O(t,n){var e=0;return function(){for(var r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new Promise((function(o){window.clearTimeout(e),e=window.setTimeout((function(){return o(t.apply(void 0,B([],T(r),!1)))}),n)}))}}const N=function(){function t(t){var n=this;this.handlers=t,this._element=null,this.timestamp=0,this.button="left",this.x=0,this.y=0,this.documentShiftX=0,this.documentShiftY=0,this.pointerIsDown=!1,this.isDragging=!1,this.handleElementPointerDown=function(t){var e=t.target.getBoundingClientRect(),r=e.left,o=e.top;switch(n.timestamp=t.timeStamp,n.x=t.clientX-r,n.y=t.clientY-o,t.button){case 0:n.button="left";break;case 1:n.button="middle";break;case 2:n.button="right"}n.pointerIsDown=!0},this.handleDocumentPointerDown=function(t){if(n.pointerIsDown){n.isDragging=!0,n.documentShiftX=n.x-t.clientX,n.documentShiftY=n.y-t.clientY;var e=n.handlers,r=e.onDown,o=e.onDragStart;r&&r({x:n.x,y:n.y,button:n.button}),o&&o({x:n.x,y:n.y,button:n.button,cancel:function(){return n.isDragging=!1}})}},this.handleDocumentPointerMove=function(t){if(n.pointerIsDown&&n.isDragging){var e=t.clientX+n.documentShiftX,r=t.clientY+n.documentShiftY,o=n.handlers.onDrag;o&&o({x:e,y:r,button:n.button})}},this.handleDocumentPointerUp=function(t){var e=t.clientX+n.documentShiftX,r=t.clientY+n.documentShiftY,o=n.handlers,i=o.onDragEnd,a=o.onUp,l=o.onTap;n.isDragging&&i&&i({x:e,y:r,button:n.button}),a&&a({x:e,y:r,button:n.button}),l&&t.timeStamp-n.timestamp<300&&l({x:e,y:r,button:n.button}),n.isDragging=!1,n.pointerIsDown=!1},this.handleContextMenu=function(t){t.stopPropagation(),t.preventDefault()}}return t.prototype.attach=function(t){this.detach(),this._element=t,t.addEventListener("pointerdown",this.handleElementPointerDown),t.addEventListener("contextmenu",this.handleContextMenu),document.addEventListener("pointerdown",this.handleDocumentPointerDown),document.addEventListener("pointermove",this.handleDocumentPointerMove),document.addEventListener("pointerup",this.handleDocumentPointerUp)},t.prototype.detach=function(){this._element&&(this._element.removeEventListener("pointerdown",this.handleElementPointerDown),this._element.removeEventListener("contextmenu",this.handleContextMenu),document.removeEventListener("pointerdown",this.handleDocumentPointerDown),document.removeEventListener("pointermove",this.handleDocumentPointerMove),document.removeEventListener("pointerup",this.handleDocumentPointerUp))},t}();var R=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")},k=function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a},F=function(){function t(t){var n=this;this.data=t,this.polygon=new j,this._image=new Image,this.scale=1,this.x=0,this.y=0,this.triangles=[],this.selectedPoint=-1,this.xRayMode=!1,this.handleKeyDown=function(t){" "===t.key&&(n.xRayMode=!0,n.paint())},this.handleKeyUp=function(t){" "===t.key&&(n.xRayMode=!1,n.paint())},this.handleDrag=function(t){var e=n.polygon;if(e&&!(n.selectedPoint<0)){var r=t.x/n.scale,o=t.y/n.scale,i=e.getPoint(n.selectedPoint);i.x=r,i.y=o,n.triangulate()}},this.handleDragEnd=function(t){var e=n.polygon;e&&e.fireChange()},this.handleDragStart=function(t){var e=t.x/n.scale,r=t.y/n.scale;"left"===t.button?n.addDot({x:e,y:r})?t.cancel():console.log("Dragging:",n.selectedPoint):"right"===t.button?(t.cancel(),n.removeDot(e,r)):(t.cancel(),n.triangulate())},this.triangulateLater=O((function(){n.triangulate()}),300),this.handleResize=function(){var t=n.canvas;t.width=t.clientWidth,t.height=t.clientHeight,n.paint()},this._canvas=document.createElement("canvas"),this.observer=new ResizeObserver(this.handleResize),this.watcher=new N({onDragStart:this.handleDragStart,onDrag:this.handleDrag,onDragEnd:this.handleDragEnd}),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp),this.polygon.eventChange.add(this.triangulateLater)}return t.prototype.resetPolygon=function(t){this.polygon.reset(t.points),this.triangulate()},Object.defineProperty(t.prototype,"canvas",{get:function(){return this._canvas},set:function(t){this._canvas&&(this.watcher.detach(),this.observer.unobserve(this._canvas)),this._canvas=t,this.watcher.attach(t),this.observer.observe(t),this.paint()},enumerable:!1,configurable:!0}),t.prototype.addDot=function(t){var n=this.polygon;if(!n)return!1;var e=n.findPoint(t);if(this.selectedPoint=e,n.length<3)return this.selectedPoint=n.add(t),this.triangulate(),!0;if(e>-1)return!1;for(var r=n.length,o=Number.MAX_SAFE_INTEGER,i=0;i<n.length;i++){var a=n.distFromEdge(t,i,i+1);console.log("[".concat(i,", ").concat(i+1,"]"),a),a<o&&(o=a,r=i+1)}return this.selectedPoint=n.add(t,r),this.triangulate(),!0},t.prototype.removeDot=function(t,n){var e=this.polygon;if(e){var r=e.findPoint({x:t,y:n});r>-1&&(e.remove(r),this.triangulate())}},t.prototype.triangulate=function(){var t=this.polygon;this.triangles=t.triangulate(),this.paint(),window.sessionStorage.setItem("polygon",JSON.stringify(t))},Object.defineProperty(t.prototype,"image",{get:function(){return this._image},set:function(t){this._image=t,this.paint()},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"ctx",{get:function(){var t=this.canvas.getContext("2d");if(!t)throw Error("Unable to create 2D context!");return t},enumerable:!1,configurable:!0}),t.prototype.paint=function(){var t=this;window.requestAnimationFrame((function(){var n=t,e=n.ctx,r=n.image;n.polygon,e.canvas.width=Math.ceil(e.canvas.clientWidth),e.canvas.height=Math.ceil(e.canvas.clientHeight);var o=e.canvas.width,i=e.canvas.height,a=Math.min(o/r.width,i/r.height);t.scale=a,e.clearRect(0,0,o,i),e.save(),e.scale(a,a),t.xRayMode?t.paintXRay(e):t.paintDefault(e)}))},t.prototype.paintDefault=function(t){var n,e,r,o,i,a,l,s,c=this,u=c.data,f=c.image,h=c.polygon;t.save(),t.globalAlpha=.5,t.drawImage(f,0,0),t.globalAlpha=1,t.save(),t.beginPath();try{for(var y=R(u.getPolygonList()),g=y.next();!g.done;g=y.next()){var d=g.value,p=k(d.points),v=p[0],m=v.x,b=v.y,w=p.slice(1);t.moveTo(m,b);try{for(var x=(r=void 0,R(w)),P=x.next();!P.done;P=x.next()){var E=P.value,L=E.x,S=E.y;t.lineTo(L,S)}}catch(t){r={error:t}}finally{try{P&&!P.done&&(o=x.return)&&o.call(x)}finally{if(r)throw r.error}}t.lineTo(m,b)}}catch(t){n={error:t}}finally{try{g&&!g.done&&(e=y.return)&&e.call(y)}finally{if(n)throw n.error}}t.clip(),t.drawImage(f,0,0),t.restore(),t.strokeStyle="#000",t.lineWidth=3,t.beginPath();var D=k(h.points),A=D[0],C=A.x,I=A.y,j=D.slice(1);t.moveTo(C,I);try{for(var _=R(j),T=_.next();!T.done;T=_.next()){var B=T.value,O=B.x,N=B.y;t.lineTo(O,N)}}catch(t){i={error:t}}finally{try{T&&!T.done&&(a=_.return)&&a.call(_)}finally{if(i)throw i.error}}t.closePath(),t.stroke(),t.font="bold ".concat(Math.ceil(15),"px sans-serif"),t.textBaseline="middle",t.textAlign="center";var F=0;try{for(var M=R(h.points),Z=M.next();!Z.done;Z=M.next()){var U=Z.value,V=U.x,Y=U.y;t.fillStyle="#000",t.beginPath(),t.ellipse(V,Y,10,10,0,0,2*Math.PI),t.fill(),t.fillStyle="#fff",t.fillText("".concat(F++),V,Y)}}catch(t){l={error:t}}finally{try{Z&&!Z.done&&(s=M.return)&&s.call(M)}finally{if(l)throw l.error}}t.restore()},t.prototype.paintXRay=function(t){var n,e,r=this.image,o=this.polygon;t.save(),t.globalAlpha=.1,t.drawImage(r,0,0),t.beginPath();var i=k(o.points),a=i[0],l=a.x,s=a.y,c=i.slice(1);t.moveTo(l,s);try{for(var u=R(c),f=u.next();!f.done;f=u.next()){var h=f.value,y=h.x,g=h.y;t.lineTo(y,g)}}catch(t){n={error:t}}finally{try{f&&!f.done&&(e=u.return)&&e.call(u)}finally{if(n)throw n.error}}t.closePath(),t.clip(),t.globalAlpha=1,t.drawImage(r,0,0),t.restore()},t}();const M=F;var Z=e(507),U={};U.styleTagTransform=p(),U.setAttributes=h(),U.insert=u().bind(null,"head"),U.domAPI=s(),U.insertStyleElement=g(),a()(Z.Z,U),Z.Z&&Z.Z.locals&&Z.Z.locals;var V=function(){return V=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},V.apply(this,arguments)};function Y(t){var n=function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a}(o.useState(t.value.name),2),e=n[0],i=n[1],a=t.value;return(0,r.jsxs)("div",V({className:W(t),title:"#".concat(a.id)},{children:[t.selected&&(0,r.jsx)("input",{value:e,autoFocus:!0,onChange:function(t){return i(t.target.value)}}),!t.selected&&(0,r.jsx)("div",V({className:"label",onClick:function(){return t.onSelect(a.id)}},{children:t.value.name})),!t.selected&&(0,r.jsx)("button",V({className:"floating-button",onClick:function(){return t.onDelete(a.id)}},{children:(0,r.jsx)("svg",V({viewBox:"0 0 24 24"},{children:(0,r.jsx)("path",{fill:"currentColor",d:"M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8.46,11.88L9.87,10.47L12,12.59L14.12,10.47L15.53,11.88L13.41,14L15.53,16.12L14.12,17.53L12,15.41L9.88,17.53L8.47,16.12L10.59,14L8.46,11.88M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z"})}))}))]}))}function W(t){var n=["custom","view-PolygonButtonView"];return"string"==typeof t.className&&n.push(t.className),t.selected&&n.push("selected"),n.join(" ")}var G=e(140),X={};X.styleTagTransform=p(),X.setAttributes=h(),X.insert=u().bind(null,"head"),X.domAPI=s(),X.insertStyleElement=g(),a()(G.Z,X),G.Z&&G.Z.locals&&G.Z.locals;var z=e(142),H=e.n(z);function K(t){return"number"==typeof t}function q(t){return Array.isArray(t)}function J(t){return!!t&&!Array.isArray(t)&&"object"==typeof t}var Q=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")};function $(t){var n,e;if(!J(t))return!1;if(!K(t.id))return!1;if(!function(t){return"string"==typeof t}(t.name))return!1;if(!q(t.points))return!1;try{for(var r=Q(t.points),o=r.next();!o.done;o=r.next())if(!tt(o.value))return!1}catch(t){n={error:t}}finally{try{o&&!o.done&&(e=r.return)&&e.call(r)}finally{if(n)throw n.error}}return!0}function tt(t){return!!J(t)&&!!K(t.x)&&!!K(t.y)}var nt="PolygonItems";var et=function(){return et=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},et.apply(this,arguments)},rt=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")};const ot=function(){function t(t){var n=this;if(this.storage=t,this.save=O((function(){!function(t,n){t.setItem(nt,H().stringify(n))}(n.storage,n.polygonList)}),500),this.eventPolygonListChange=new P,this.eventCurrentPolygonChange=new P,this.polygonList=function(t){try{var n=t.getItem(nt);if(null===n)return[{id:1,name:"Polygon_1",points:[]}];var e=H().parse(n);return function(t){var n,e;if(!q(t))return!1;try{for(var r=Q(t),o=r.next();!o.done;o=r.next())if(!$(o.value))return!1}catch(t){n={error:t}}finally{try{o&&!o.done&&(e=r.return)&&e.call(r)}finally{if(n)throw n.error}}return!0}(e)&&0!==e.length?e:[{id:1,name:"Polygon_1",points:[]}]}catch(t){return console.error("Unable to retrieve PolygonItems:",t),[{id:1,name:"Polygon_1",points:[]}]}}(t),0===this.polygonList.length)throw Error("PolygonItem list must never be empty!");this._currentPolygonId=this.polygonList[0].id}return t.getSingleton=function(){return t.instance||(t.instance=new t(window.localStorage)),t.instance},t.prototype.getPolygonList=function(){return this.polygonList.map((function(t){return et({},t)}))},t.prototype.firePolygonListChanged=function(){this.eventPolygonListChange.fire(function(t,n,e){if(e||2===arguments.length)for(var r,o=0,i=n.length;o<i;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return t.concat(r||Array.prototype.slice.call(n))}([],function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a}(this.polygonList),!1)),this.save()},Object.defineProperty(t.prototype,"currentPolygonId",{get:function(){return this._currentPolygonId},set:function(t){var n,e;try{for(var r=rt(this.polygonList),o=r.next();!o.done;o=r.next())if(o.value.id===t)return this._currentPolygonId=t,void this.eventCurrentPolygonChange.fire(t)}catch(t){n={error:t}}finally{try{o&&!o.done&&(e=r.return)&&e.call(r)}finally{if(n)throw n.error}}},enumerable:!1,configurable:!0}),t.prototype.updatePolygon=function(t){var n=this,e=t.name,r=t.points,o=this.polygonList.find((function(t){return t.id===n.currentPolygonId}));if(o){console.log("Try to update #".concat(o.id));var i=!1;r&&(o.points=r.map((function(t){return et({},t)})),i=!0),e&&(this.findPolygonByName(e)||(o.name=e,i=!0)),i&&(this.firePolygonListChanged(),this.save())}},t.prototype.addPolygonToList=function(){var t=this.getFirstFreeId(),n="Polygon_".concat(t);this.findPolygonByName(n)&&(n=this.makeNewPolygonName());var e={id:t,name:n,points:this.getCurrentPolygon().points.map((function(t){return et({},t)}))};return this.polygonList.push(e),this.currentPolygonId=t,this.firePolygonListChanged(),e},t.prototype.removePolygonFromList=function(t){if(t===this.currentPolygonId)return!1;var n=this.polygonList.findIndex((function(n){return n.id===t}));return!(n<0||(this.polygonList.splice(n,1),this.firePolygonListChanged(),0))},t.prototype.getCurrentPolygon=function(){var t=this,n=this.polygonList.find((function(n){return n.id===t.currentPolygonId}));if(n)return et({},n);if(console.error("There is no polygon with id #".concat(this.currentPolygonId,"!")),console.error("That means that the selected polygon has gone."),0===this.polygonList.length)throw Error("The polygon list is empty!");return this.currentPolygonId=this.polygonList[0].id,et({},this.polygonList[0])},t.prototype.makeNewPolygonName=function(){for(var t=0;t<9999;t++){var n="Polygon_".concat(t);if(!this.findPolygonByName(n))return n}return"Polygon_".concat(Date.now())},t.prototype.findPolygonByName=function(t){var n=t.trim().toLowerCase();return this.polygonList.find((function(t){return t.name.trim().toLowerCase()===n}))},t.prototype.getFirstFreeId=function(){var t,n,e=0;try{for(var r=rt(this.polygonList),o=r.next();!o.done;o=r.next()){var i=o.value;if(i.id-e>1)return i.id-1;e=i.id}}catch(n){t={error:n}}finally{try{o&&!o.done&&(n=r.return)&&n.call(r)}finally{if(t)throw t.error}}return e+1},t}(),it=o.createContext(ot.getSingleton());var at=function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a};function lt(){return o.useContext(it)}var st=function(){return st=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},st.apply(this,arguments)};function ct(t){var n=lt(),e=function(){var t=lt(),n=at(o.useState(t.getPolygonList()),2),e=n[0],r=n[1];return o.useEffect((function(){return t.eventPolygonListChange.add(r),function(){return t.eventPolygonListChange.remove(r)}}),[t]),e}(),i=function(){var t=lt(),n=at(o.useState(t.currentPolygonId),2),e=n[0],r=n[1];return o.useEffect((function(){return t.eventCurrentPolygonChange.add(r),function(){return t.eventCurrentPolygonChange.remove(r)}}),[t]),e}(),a=function(t){return n.removePolygonFromList(t)},l=function(e){n.currentPolygonId=e,t.onClick(n.getCurrentPolygon())};return(0,r.jsxs)("div",st({className:ut(t)},{children:[(0,r.jsx)("div",st({className:"list"},{children:e.map((function(t){return(0,r.jsx)(Y,{selected:t.id===i,value:t,onSelect:l,onDelete:a},t.id)}))})),(0,r.jsx)("button",st({onClick:function(){return n.addPolygonToList()}},{children:"Add new Polygon"}))]}))}function ut(t){var n=["custom","view-PolygonsListView"];return"string"==typeof t.className&&n.push(t.className),n.join(" ")}var ft=function(t,n){var e="function"==typeof Symbol&&t[Symbol.iterator];if(!e)return t;var r,o,i=e.call(t),a=[];try{for(;(void 0===n||n-- >0)&&!(r=i.next()).done;)a.push(r.value)}catch(t){o={error:t}}finally{try{r&&!r.done&&(e=i.return)&&e.call(i)}finally{if(o)throw o.error}}return a},ht=function(t,n,e){if(e||2===arguments.length)for(var r,o=0,i=n.length;o<i;o++)!r&&o in n||(r||(r=Array.prototype.slice.call(n,0,o)),r[o]=n[o]);return t.concat(r||Array.prototype.slice.call(n))},yt=function(t){var n="function"==typeof Symbol&&Symbol.iterator,e=n&&t[n],r=0;if(e)return e.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&r>=t.length&&(t=void 0),{value:t&&t[r++],done:!t}}};throw new TypeError(n?"Object is not iterable.":"Symbol.iterator is not defined.")};function gt(t,n){var e=t.getPolygonList(),r=function(t){var n,e,r,o,i=[],a=0;try{for(var l=yt(t.getPolygonList()),s=l.next();!s.done;s=l.next()){var c=s.value,u=[],f=new j(c.points).triangulate();try{for(var h=(r=void 0,yt(f)),y=h.next();!y.done;y=h.next()){var g=ft(y.value,3),d=g[0],p=g[1],v=g[2];u.push(a+d,a+p,a+v)}}catch(t){r={error:t}}finally{try{y&&!y.done&&(o=h.return)&&o.call(h)}finally{if(r)throw r.error}}i.push(u),a+=c.points.length}}catch(t){n={error:t}}finally{try{s&&!s.done&&(e=l.return)&&e.call(l)}finally{if(n)throw n.error}}return i}(t);return dt(["export default class ".concat("PolygonsData"," {"),ht(ht([],ft(pt(t)),!1),["","private readonly drawBuff: WebGLBuffer","private readonly elemBuff: WebGLBuffer","private readonly offsets = [".concat(vt(r),"]"),"private readonly sizes = ".concat(JSON.stringify(r.map((function(t){return t.length})))),"","constructor(private readonly gl: WebGL2RenderingContext) {",["this.elemBuff = this.createElemBuffer([",r.map((function(t,n){return"".concat(t.join(", "),",  // ").concat(e[n].name)})),"])","this.drawBuff = this.createDrawBuffer([",e.map((function(t,r){return"".concat(t.points.map((function(t){var e=t.x,r=t.y;return"".concat((e/n.width).toFixed(5),",").concat((r/n.height).toFixed(5))})).join(", "),",  // ").concat(e[r].name)})),"])"],"}","","bindBuffers() {",["const { gl } = this","gl.bindBuffer( gl.ARRAY_BUFFER, this.drawBuff )","gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.elemBuff )"],"}","","draw(index: number) {",["const { gl } = this","const offset = this.offsets[index]","const size = this.sizes[index]","gl.drawElements( gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset )"],"}","","private createDrawBuffer(data: number[]): WebGLBuffer {",["const { gl } = this","const buff = gl.createBuffer()",'if (!buff) throw Error("Unable to create a WebGLBuffer!")',"","gl.bindBuffer( gl.ARRAY_BUFFER, buff )","gl.bufferData(",["gl.ARRAY_BUFFER,","new Float32Array(data),","gl.STATIC_DRAW"],")","return buff"],"}","","private createElemBuffer(data: number[]): WebGLBuffer {",["const { gl } = this","const buff = gl.createBuffer()",'if (!buff) throw Error("Unable to create a WebGLBuffer!")',"","gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, buff )","gl.bufferData(",["gl.ELEMENT_ARRAY_BUFFER,","new Uint16Array(data),","gl.STATIC_DRAW"],")","return buff"],"}"],!1),"}"])}function dt(t,n){return void 0===n&&(n=""),t.map((function(t){return"string"==typeof t?"".concat(n).concat(t):dt(t,"".concat(n,"    "))})).join("\n")}function pt(t){return t.getPolygonList().map((function(t,n){return"static ".concat(t.name.toUpperCase()," = ").concat(n)}))}function vt(t){var n=0;return t.map((function(t){var e=n;return n+=t.length,e}))}var mt=e(164),bt={};bt.styleTagTransform=p(),bt.setAttributes=h(),bt.insert=u().bind(null,"head"),bt.domAPI=s(),bt.insertStyleElement=g(),a()(mt.Z,bt),mt.Z&&mt.Z.locals&&mt.Z.locals;var wt=function(){return wt=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},wt.apply(this,arguments)};function xt(t){var n=lt(),e=o.useRef(new M(n));return o.useEffect((function(){var t=new Image;t.src=x,t.onload=function(){e.current.image=t}}),[]),o.useEffect((function(){var t=e.current,r=function(){return n.updatePolygon({points:t.polygon.points})};return t.polygon.eventChange.add(r),t.resetPolygon(n.getCurrentPolygon()),function(){return t.polygon.eventChange.remove(r)}}),[n,e.current]),(0,r.jsxs)("div",wt({className:Pt(t)},{children:[(0,r.jsx)(b,{painter:e.current}),(0,r.jsxs)("aside",{children:[(0,r.jsx)("button",{children:"Load Image"}),(0,r.jsx)(ct,{onClick:function(t){e.current.resetPolygon(t)}}),(0,r.jsx)("button",wt({onClick:function(){var t=gt(n,e.current.image);console.log(t)}},{children:"Export Code"}))]})]}))}function Pt(t){var n=["custom","App"];return"string"==typeof t.className&&n.push(t.className),n.join(" ")}var Et=e(745),Lt=e(788),St={};St.styleTagTransform=p(),St.setAttributes=h(),St.insert=u().bind(null,"head"),St.domAPI=s(),St.insertStyleElement=g(),a()(Lt.Z,St),Lt.Z&&Lt.Z.locals&&Lt.Z.locals;var Dt=function(){return Dt=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},Dt.apply(this,arguments)};!function(){var t,n,e,o;t=this,n=void 0,o=function(){var t;return function(t,n){var e,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:l(0),throw:l(1),return:l(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function l(i){return function(l){return function(i){if(e)throw new TypeError("Generator is already executing.");for(;a;)try{if(e=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=n.call(t,a)}catch(t){i=[6,t],r=0}finally{e=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,l])}}}(this,(function(n){if(!(t=document.getElementById("app")))throw Error('No element with id "app"!');return(0,Et.s)(t).render((0,r.jsx)(it.Provider,Dt({value:ot.getSingleton()},{children:(0,r.jsx)(xt,{})}))),[2]}))},new((e=void 0)||(e=Promise))((function(r,i){function a(t){try{s(o.next(t))}catch(t){i(t)}}function l(t){try{s(o.throw(t))}catch(t){i(t)}}function s(t){var n;t.done?r(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(a,l)}s((o=o.apply(t,n||[])).next())}))}()}},t=>{t.O(0,[977],(()=>(949,t(t.s=949)))),t.O()}]);