let e,t,o;import{c6 as s,b6 as a,c7 as r,c8 as n,c9 as i,bY as l,br as d,ca as c,b9 as p,ba as m,cb as u,aD as h,cc as g,cd as v,bS as y,ce as b,bZ as f,cf as w,cg as $,c1 as C,be as T,_ as P,ch as E,ci as S,cj as x,ck as I,cl as j,cm as N,bU as k,$ as A,bc as R,cn as B,co as D}from"./index.js";import{g as M,a as O}from"./acorn-CEWv35nm.js";import"./lib/engine262.mjs";var q,U,V,L,F,K,H,_,z,J,W,G='/** front_end/ui/components/suggestion_input/suggestionInput.css */\n/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  font-size: inherit;\n  margin: 0;\n  padding: 0;\n}\n\n:host {\n  position: relative;\n}\n\ndevtools-editable-content {\n  background: transparent;\n  border: none;\n  color: var(--override-color-recorder-input, var(--sys-color-on-surface));\n  cursor: text;\n  display: inline-block;\n  line-height: 18px;\n  min-height: 18px;\n  min-width: 0.5em;\n  outline: none;\n  overflow-wrap: anywhere;\n}\n\ndevtools-editable-content:hover,\ndevtools-editable-content:focus {\n  box-shadow: 0 0 0 1px var(--sys-color-divider);\n  border-radius: 2px;\n}\n\ndevtools-editable-content[placeholder]:empty::before {\n  content: attr(placeholder);\n  color: var(--sys-color-on-surface);\n  opacity: 50%;\n}\n\ndevtools-editable-content[placeholder]:empty:focus::before {\n  content: "";\n}\n\ndevtools-suggestion-box {\n  position: absolute;\n  display: none;\n}\n\ndevtools-editable-content:focus ~ devtools-suggestion-box {\n  display: block;\n}\n\n.suggestions {\n  background-color: var(--sys-color-cdt-base-container);\n  box-shadow: var(--drop-shadow);\n  min-height: 1em;\n  min-width: 150px;\n  overflow: hidden auto;\n  position: relative;\n  z-index: 100;\n  max-height: 350px;\n}\n\n.suggestions > li {\n  padding: 1px;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  font-family: var(--source-code-font-family);\n  font-size: var(--source-code-font-size);\n  color: var(--sys-color-on-surface);\n}\n\n.suggestions > li:hover {\n  background-color: var(--sys-color-state-hover-on-subtle);\n}\n\n.suggestions > li.selected {\n  background-color: var(--sys-color-primary);\n  color: var(--sys-color-cdt-base-container);\n}\n\n.strikethrough {\n  text-decoration: line-through;\n}\n';function Y(e,t,o,s){return(Y=function(){function e(e,t){return function(s){(function(e,t){if(e.v)throw Error("attempted to call "+t+" after decoration was finished")})(t,"addInitializer"),o(s,"An initializer"),e.push(s)}}function t(t,o,s,a,r,n,i,l,d){switch(r){case 1:c="accessor";break;case 2:c="method";break;case 3:c="getter";break;case 4:c="setter";break;default:c="field"}var c,p,m,u={kind:c,name:i?"#"+o:o,static:n,private:i,metadata:l},h={v:!1};u.addInitializer=e(a,h),0===r?i?(p=s.get,m=s.set):(p=function(){return this[o]},m=function(e){this[o]=e}):2===r?p=function(){return s.value}:((1===r||3===r)&&(p=function(){return s.get.call(this)}),(1===r||4===r)&&(m=function(e){s.set.call(this,e)})),u.access=p&&m?{get:p,set:m}:p?{get:p}:{set:m};try{return t(d,u)}finally{h.v=!0}}function o(e,t){if("function"!=typeof e)throw TypeError(t+" must be a function")}function s(e,t){var s=typeof t;if(1===e){if("object"!==s||null===t)throw TypeError("accessor decorators must return an object with get, set, or init properties or void 0");void 0!==t.get&&o(t.get,"accessor.get"),void 0!==t.set&&o(t.set,"accessor.set"),void 0!==t.init&&o(t.init,"accessor.init")}else if("function"!==s)throw TypeError((0===e?"field":10===e?"class":"method")+" decorators must return a function or void 0")}function a(e,t){t&&e.push(function(e){for(var o=0;o<t.length;o++)t[o].call(e);return e})}function r(e,t){return Object.defineProperty(e,Symbol.metadata||Symbol.for("Symbol.metadata"),{configurable:!0,enumerable:!0,value:t})}return function(o,n,i,l){if(void 0!==l)var d=l[Symbol.metadata||Symbol.for("Symbol.metadata")];var c=Object.create(void 0===d?null:d),p=function(e,o,r){for(var n=[],i=new Map,l=new Map,d=0;d<o.length;d++){var c,p,m,u,h=o[d];if(Array.isArray(h)){var g=h[1],v=h[2],y=h.length>3,b=g>=5;if(b?(m=e,g-=5,u=p=p||[]):(m=e.prototype,u=c=c||[]),0!==g&&!y){var f=b?l:i,w=f.get(v)||0;if(!0===w||3===w&&4!==g||4===w&&3!==g)throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: "+v);!w&&g>2?f.set(v,g):f.set(v,!0)}!function(e,o,a,r,n,i,l,d,c){var p,m,u,h,g,v,y=a[0];if(l?p=0===n||1===n?{get:a[3],set:a[4]}:3===n?{get:a[3]}:4===n?{set:a[3]}:{value:a[3]}:0!==n&&(p=Object.getOwnPropertyDescriptor(o,r)),1===n?u={get:p.get,set:p.set}:2===n?u=p.value:3===n?u=p.get:4===n&&(u=p.set),"function"==typeof y)void 0!==(h=t(y,r,p,d,n,i,l,c,u))&&(s(n,h),0===n?m=h:1===n?(m=h.init,u={get:g=h.get||u.get,set:h.set||u.set}):u=h);else for(var b=y.length-1;b>=0;b--)void 0!==(h=t(y[b],r,p,d,n,i,l,c,u))&&(s(n,h),0===n?v=h:1===n?(v=h.init,u={get:g=h.get||u.get,set:h.set||u.set}):u=h,void 0!==v&&(void 0===m?m=v:"function"==typeof m?m=[m,v]:m.push(v)));if(0===n||1===n){if(void 0===m)m=function(e,t){return t};else if("function"!=typeof m){var f=m;m=function(e,t){for(var o=t,s=0;s<f.length;s++)o=f[s].call(e,o);return o}}else{var w=m;m=function(e,t){return w.call(e,t)}}e.push(m)}0!==n&&(1===n?(p.get=u.get,p.set=u.set):2===n?p.value=u:3===n?p.get=u:4===n&&(p.set=u),l?1===n?(e.push(function(e,t){return u.get.call(e,t)}),e.push(function(e,t){return u.set.call(e,t)})):2===n?e.push(u):e.push(function(e,t){return u.call(e,t)}):Object.defineProperty(o,r,p))}(n,m,h,v,g,b,y,u,r)}}return a(n,c),a(n,p),n}(o,n,c);return i.length||r(o,c),{e:p,get c(){return function(t,o,a){if(o.length>0){for(var n=[],i=t,l=t.name,d=o.length-1;d>=0;d--){var c={v:!1};try{var p=o[d](i,{kind:"class",name:l,addInitializer:e(n,c),metadata:a})}finally{c.v=!0}void 0!==p&&(s(10,p),i=p)}return[r(i,a),function(){for(var e=0;e<n.length;e++)n[e].call(i)}]}}(o,i,c)}}}}())(e,t,o,s)}function Z(e){return e}function Q(e,t="Assertion failed!"){if(!e)throw Error(t)}let{html:X,Decorators:ee,Directives:et,LitElement:eo}=a,{customElement:es}=ee,{classMap:ea}=et;V=es("devtools-editable-content"),new class extends Z{constructor(){super(e),L()}static{class t extends(F=HTMLElement){static{({c:[e,L]}=Y(this,[],[V],F))}static get observedAttributes(){return["disabled","placeholder"]}set disabled(e){this.contentEditable=String(!e)}get disabled(){return"true"!==this.contentEditable}set value(e){this.innerText=e,this.#e()}get value(){return this.innerText}set mimeType(e){this.#t=e,this.#e()}get mimeType(){return this.#t}#t="";constructor(){super(),this.contentEditable="true",this.tabIndex=0,this.addEventListener("focus",()=>{this.innerHTML=this.innerText}),this.addEventListener("blur",this.#e.bind(this))}#e(){this.#t&&s(this,this.#t)}attributeChangedCallback(e,t,o){"disabled"===e&&(this.disabled=null!==o)}}}};class er extends Event{static eventName="suggest";constructor(e){super(er.eventName),this.suggestion=e}}class en extends Event{static eventName="suggestioninit";listeners;constructor(e){super(en.eventName),this.listeners=e}}K=es("devtools-suggestion-box");class ei extends(_=eo){static{({c:[t,H]}=Y(this,[],[K],_))}constructor(){super(),this.options=[],this.expression="",this.cursor=0}#o=[];#s=e=>{if(Q(e instanceof KeyboardEvent,"Bound to the wrong event."),this.#o.length>0)switch(e.key){case"ArrowDown":e.stopPropagation(),e.preventDefault(),this.#a(1);break;case"ArrowUp":e.stopPropagation(),e.preventDefault(),this.#a(-1)}"Enter"===e.key&&(this.#o[this.cursor]&&this.#r(this.#o[this.cursor]),e.preventDefault())};#a(e){let t;this.cursor=((this.cursor+e)%(t=this.#o.length)+t)%t}#r(e){this.dispatchEvent(new er(e))}connectedCallback(){super.connectedCallback(),this.dispatchEvent(new en([["keydown",this.#s]]))}willUpdate(e){e.has("options")&&(this.options=Object.freeze([...this.options].sort())),(e.has("expression")||e.has("options"))&&(this.cursor=0,this.#o=this.options.filter(e=>(this.suggestionFilter||((e,t)=>e.toLowerCase().startsWith(t.toLowerCase())))(e,this.expression)))}render(){if(0!==this.#o.length)return X`<style>${G}</style><ul class="suggestions">
      ${this.#o.map((e,t)=>X`
        <li class=${ea({selected:t===this.cursor})}
            @mousedown=${this.#r.bind(this,e)}
            jslog=${r("suggestion").track({click:!0,resize:!0})}>
          ${e}
        </li>`)}
    </ul>`}static{H()}}z=es("devtools-suggestion-input"),new class extends Z{constructor(){super(o),J()}static{class e extends(W=eo){static{({c:[o,J]}=Y(this,[],[z],W))}static shadowRootOptions={...eo.shadowRootOptions,delegatesFocus:!0};constructor(){super(),this.options=[],this.expression="",this.placeholder="",this.value="",this.disabled=!1,this.strikethrough=!0,this.mimeType="",this.autocomplete=!0,this.addEventListener("blur",this.#n);let e=n().track({keydown:"ArrowUp|ArrowDown|Enter",change:!0,click:!0});this.jslogContext&&(e=e.context(this.jslogContext)),this.setAttribute("jslog",e.toString())}#i;get #l(){if(this.#i)return this.#i;let e=this.renderRoot.querySelector("devtools-editable-content");if(!e)throw Error("Attempted to query node before rendering.");return this.#i=e,e}#n=()=>{window.getSelection()?.removeAllRanges(),this.value=this.#l.value,this.expression=this.#l.value};#d=e=>{Q(e.target instanceof Node);let t=document.createRange();t.selectNodeContents(e.target);let o=window.getSelection();o.removeAllRanges(),o.addRange(t)};#s=e=>{"Enter"===e.key&&e.preventDefault()};#c=e=>{this.expression=e.target.value};#p=e=>{for(let[t,o]of e.listeners)this.addEventListener(t,o)};#m=e=>{this.#l.value=e.suggestion,setTimeout(this.blur.bind(this),0)};willUpdate(e){e.has("value")&&(this.expression=this.value)}render(){return X`<style>${G}</style>
      <style>${i}</style>
      <devtools-editable-content
        ?disabled=${this.disabled}
        class=${ea({strikethrough:!this.strikethrough})}
        .enterKeyHint=${"done"}
        .value=${this.value}
        .mimeType=${this.mimeType}
        @focus=${this.#d}
        @input=${this.#c}
        @keydown=${this.#s}
        autocapitalize="off"
        inputmode="text"
        placeholder=${this.placeholder}
        spellcheck="false"
      ></devtools-editable-content>
      <devtools-suggestion-box
        @suggestioninit=${this.#p}
        @suggest=${this.#m}
        .options=${this.options}
        .suggestionFilter=${this.suggestionFilter}
        .expression=${this.autocomplete?this.expression:""}
      ></devtools-suggestion-box>`}}}};let{html:el,render:ed,Directives:ec,nothing:ep}=a,{live:em,classMap:eu,repeat:eh}=ec,eg={deleteParameter:"Delete parameter",addParameter:"Add a parameter",resetDefaultValue:"Reset to default value",addCustomProperty:"Add custom property",sendCommandCtrlEnter:"Send command - Ctrl+Enter",sendCommandCmdEnter:"Send command - ⌘+Enter",copyCommand:"Copy command",selectTarget:"Select a target"},ev=O("panels/protocol_monitor/JSONEditor.ts",eg),ey=M.bind(void 0,ev);var eb=((q={}).STRING="string",q.NUMBER="number",q.BOOLEAN="boolean",q.ARRAY="array",q.OBJECT="object",q);let ef=new Map([["string",""],["number",0],["boolean",!1]]),ew="dummy",e$="<empty_string>";function eC(e,t){return e.toLowerCase().includes(t.toLowerCase())}var eT=((U={}).SUBMIT_EDITOR="submiteditor",U);class eP extends p(m){#u=new Map;#h=new Map;#g=new Map;#v=[];#y=[];#b="";#f;#w;#$;constructor(e,t=ex){super(e,{useShadowDom:!0}),this.#$=t,this.registerRequiredCSS("/** front_end/panels/protocol_monitor/JSONEditor.css */\n/*\n * Copyright 2023 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n\n* {\n  box-sizing: border-box;\n  padding: 0;\n  margin: 0;\n  font-size: inherit;\n}\n\n:host {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.target-selector {\n  max-width: var(--sys-size-21);\n}\n\n.warning-icon {\n  margin-left: -18px;\n  margin-right: 4px;\n}\n\n.row {\n  flex-wrap: wrap;\n}\n\n.row,\n.row-icons {\n  display: flex;\n  flex-direction: row;\n  color: var(--sys-color-token-property-special);\n  font-family: var(--monospace-font-family);\n  font-size: var(--monospace-font-size);\n  align-items: center;\n  line-height: 18px;\n  margin-top: 3px;\n}\n\n.separator {\n  margin-right: 0.5em;\n  color: var(--sys-color-on-surface);\n}\n\nul {\n  padding-left: 2em;\n}\n\n.optional-parameter {\n  color: var(--sys-color-token-attribute-value);\n\n  --override-color-recorder-input: var(--sys-color-on-surface);\n}\n\n.undefined-parameter {\n  color: var(--sys-color-state-disabled);\n}\n\n.wrapper {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.editor-wrapper {\n  padding-left: 1em;\n  overflow-x: hidden;\n  flex-grow: 1;\n  padding-bottom: 50px;\n  padding-top: 0.5em;\n}\n\n.clear-button,\n.add-button,\n.delete-button {\n  opacity: 0%;\n  transition: opacity 0.3s ease-in-out;\n}\n\n.clear-button,\n.delete-button {\n  margin-left: 5px;\n}\n\n.row:focus-within .delete-button,\n.row:focus-within .add-button,\n.row:focus-within .clear-button,\n.row:hover .delete-button,\n.row:hover .add-button,\n.row:hover .clear-button {\n  opacity: 100%;\n}\n\n.protocol-monitor-sidebar-toolbar {\n  border-top: 1px solid var(--sys-color-divider);\n}\n")}get metadataByCommand(){return this.#u}set metadataByCommand(e){this.#u=e,this.requestUpdate()}get typesByName(){return this.#h}set typesByName(e){this.#h=e,this.requestUpdate()}get enumsByName(){return this.#g}set enumsByName(e){this.#g=e,this.requestUpdate()}get parameters(){return this.#v}set parameters(e){this.#v=e,this.requestUpdate()}get targets(){return this.#y}set targets(e){this.#y=e,this.requestUpdate()}get command(){return this.#b}set command(e){this.#b!==e&&(this.#b=e,this.requestUpdate())}get targetId(){return this.#f}set targetId(e){this.#f!==e&&(this.#f=e,this.requestUpdate())}wasShown(){super.wasShown(),this.#w=new u(this.contentElement,e=>this.#C(e),"protocol-monitor.hint"),this.#w.setDisableOnClick(!0),this.#w.setTimeout(300),h.instance().addEventListener(g.AVAILABLE_TARGETS_CHANGED,this.#T,this),this.#T(),this.requestUpdate()}willHide(){super.willHide(),this.#w?.hidePopover(),this.#w?.dispose(),h.instance().removeEventListener(g.AVAILABLE_TARGETS_CHANGED,this.#T,this)}#T(){this.targets=h.instance().targets(),this.targets.length&&void 0===this.targetId&&(this.targetId=this.targets[0].id())}getParameters(){let e=t=>{if(void 0!==t.value)switch(t.type){case"number":return Number(t.value);case"boolean":return!!t.value;case"object":{let o={};for(let s of t.value)void 0!==e(s)&&(o[s.name]=e(s));if(0===Object.keys(o).length)return;return o}case"array":{let o=[];for(let s of t.value)o.push(e(s));return 0===o.length?[]:o}default:return t.value}},t={};for(let o of this.parameters)t[o.name]=e(o);return e({type:"object",value:this.parameters})}displayCommand(e,t,o){this.targetId=o,this.command=e;let s=this.metadataByCommand.get(this.command);if(!s?.parameters)return;this.populateParametersForCommandWithDefaultValues();let a=this.#P("",t,{typeRef:ew,type:"object",name:"",description:"",optional:!0,value:[]},s.parameters).value,r=new Map(this.parameters.map(e=>[e.name,e]));for(let e of a){let t=r.get(e.name);t&&(t.value=e.value)}this.requestUpdate()}#P(e,t,o,s){let a=o?.type||typeof t,r=o?.description??"",n=o?.optional??!0;switch(a){case"string":case"boolean":case"number":return this.#E(e,t,o);case"object":return this.#S(e,t,o,s);case"array":return this.#x(e,t,o)}return{type:a,name:e,optional:n,typeRef:o?.typeRef,value:t,description:r}}#E(e,t,o){let s=o?.type||typeof t,a=o?.description??"";return{type:s,name:e,optional:o?.optional??!0,typeRef:o?.typeRef,value:t,description:a,isCorrectType:!o||this.#I(o,String(t))}}#S(e,t,o,s){let a=o?.description??"";if("object"!=typeof t||null===t)throw Error("The value is not an object");let r=o?.typeRef;if(!r)throw Error("Every object parameters should have a type ref");let n=r===ew?s:this.typesByName.get(r);if(!n)throw Error("No nested type for keys were found");let i=[];for(let e of Object.keys(t)){let o=n.find(t=>t.name===e);i.push(this.#P(e,t[e],o))}return{type:"object",name:e,optional:o.optional,typeRef:o.typeRef,value:i,description:a,isCorrectType:!0}}#x(e,t,o){let s=o?.description??"",a=o?.optional??!0,r=o?.typeRef;if(!r)throw Error("Every array parameters should have a type ref");if(!Array.isArray(t))throw Error("The value is not an array");let n=eE(r)?void 0:{optional:!0,type:"object",value:[],typeRef:r,description:"",name:""},i=[];for(let e=0;e<t.length;e++){let o=this.#P(`${e}`,t[e],n);i.push(o)}return{type:"array",name:e,optional:a,typeRef:o?.typeRef,value:i,description:s,isCorrectType:!0}}#C(e){let t=e.composedPath()[0],o=this.#j(t);if(!o?.description)return null;let[s,a]=(e=>{if(e.length>150){let[t,o]=e.split(".");return[t,o]}return[e,""]})(o.description),r=o.type,n=o.replyArgs,i="";return i=n&&n.length>0?a+`Returns: ${n}<br>`:r?a+`<br>Type: ${r}<br>`:a,{box:t.boxInWindow(),show:async e=>{let t=new v({getMessage:()=>`<span>${s}</span>`,getPossibleFixMessage:()=>i,getLearnMoreLink:()=>`https://chromedevtools.github.io/devtools-protocol/tot/${this.command.split(".")[0]}/`});return e.contentElement.appendChild(t),!0}}}#j(e){if(e.matches(".command")){let e=this.metadataByCommand.get(this.command);if(e)return{description:e.description,replyArgs:e.replyArgs}}if(e.matches(".parameter")){let t=e.dataset.paramid;if(!t)return;let o=t.split("."),{parameter:s}=this.#N(o);if(!s.description)return;return{description:s.description,type:s.type}}}getCommandJson(){return""!==this.command?JSON.stringify({command:this.command,parameters:this.getParameters()}):""}#k(){let e=this.getCommandJson();y.copyText(e)}#A(){this.dispatchEventToListeners("submiteditor",{command:this.command,parameters:this.getParameters(),targetId:this.targetId})}populateParametersForCommandWithDefaultValues(){let e=this.metadataByCommand.get(this.command)?.parameters;e&&(this.parameters=e.map(e=>this.#R(e)))}#R(e){if("object"===e.type){let t=e.typeRef;t||(t=ew);let o=(this.typesByName.get(t)??[]).map(e=>this.#R(e));return{...e,value:e.optional?void 0:o,isCorrectType:!0}}return"array"===e.type?{...e,value:e?.optional?void 0:e.value?.map(e=>this.#R(e))||[],isCorrectType:!0}:{...e,value:e.optional?void 0:ef.get(e.type),isCorrectType:!0}}#N(e){let t,o=this.parameters;for(let s=0;s<e.length;s++){let a=e[s],r=o.find(e=>e.name===a);if(s===e.length-1)return{parameter:r,parentParameter:t};if(r?.type==="array"||r?.type==="object")r.value&&(o=r.value);else throw Error("Parameter on the path in not an object or an array");t=r}throw Error("Not found")}#I(e,t){if("number"===e.type&&isNaN(Number(t)))return!1;let o=this.#B(e);return 0===o.length||!!o.includes(t)}#D=e=>{let t;if(!(e.target instanceof o))return;if(e instanceof KeyboardEvent){let o=e.target.renderRoot.querySelector("devtools-editable-content");if(!o)return;t=o.innerText}else t=e.target.value;let s=e.target.getAttribute("data-paramid");if(!s)return;let a=s.split("."),r=this.#N(a).parameter;""===t?r.value=ef.get(r.type):(r.value=t,r.isCorrectType=this.#I(r,t)),this.requestUpdate()};#M=e=>{if(!(e.target instanceof o))return;let t=e.target.value,s=e.target.getAttribute("data-paramid");if(!s)return;let a=s.split("."),{parameter:r}=this.#N(a);r.name=t,this.requestUpdate()};#O=e=>{e.target instanceof o&&"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&this.#D(e)};#q(e){if(!(e.target instanceof o))return;let t=e.target.getAttribute("data-paramid");if(!t)return;let s=t.split(".");this.#N(s).parameter.isCorrectType=!0,this.requestUpdate()}#U=async e=>{e.target instanceof o&&(this.command=e.target.value),this.populateParametersForCommandWithDefaultValues();let t=e.target;await this.updateComplete,this.#V(t)};#V(e){let t=this.contentElement.querySelectorAll("devtools-suggestion-input,.add-button"),o=[...t].findIndex(t=>t===e.shadowRoot?.host);o>=0&&o+1<t.length?t[o+1].focus():this.contentElement.querySelector('devtools-button[jslogcontext="protocol-monitor.send-command"]')?.focus()}#L(e,t){if("object"===e.type){let o=e.typeRef;o||(o=ew);let s=(this.typesByName.get(o)??[]).map(e=>this.#L(e,e.name));return{type:"object",name:t,optional:e.optional,typeRef:o,value:s,isCorrectType:!0,description:e.description}}return{type:e.type,name:t,optional:e.optional,isCorrectType:!0,typeRef:e.typeRef,value:e.optional?void 0:ef.get(e.type),description:e.description}}#F(e){let t=e.split("."),{parameter:o,parentParameter:s}=this.#N(t);if(o){switch(o.type){case"array":{let e=o.typeRef;if(!e)throw Error("Every array parameter must have a typeRef");let t=this.typesByName.get(e)??[],s=t.map(e=>this.#L(e,e.name)),a=eE(e)?e:"object";0===t.length&&this.enumsByName.get(e)&&(a="string"),o.value||(o.value=[]),o.value.push({type:a,name:String(o.value.length),optional:!0,typeRef:e,value:0!==s.length?s:"",description:"",isCorrectType:!0});break}case"object":{let e=o.typeRef;if(e||(e=ew),o.value||(o.value=[]),!this.typesByName.get(e)){o.value.push({type:"string",name:"",optional:!0,value:"",isCorrectType:!0,description:"",isKeyEditable:!0});break}let t=this.typesByName.get(e)??[],a=t.map(e=>this.#L(e,e.name)),r=t.map(e=>this.#R(e));s?o.value.push({type:"object",name:"",optional:!0,typeRef:e,value:a,isCorrectType:!0,description:""}):o.value=r;break}default:o.value=ef.get(o.type)}this.requestUpdate()}}#K(e,t){if(e?.value!==void 0){switch(e.type){case"object":if(e.optional&&!t){e.value=void 0;break}e.typeRef&&this.typesByName.get(e.typeRef)?e.value.forEach(e=>this.#K(e,t)):e.value=[];break;case"array":e.value=e.optional?void 0:[];break;default:e.value=e.optional?void 0:ef.get(e.type),e.isCorrectType=!0}this.requestUpdate()}}#H(e,t){if(e&&Array.isArray(t.value)){if(t.value.splice(t.value.findIndex(t=>t===e),1),"array"===t.type)for(let e=0;e<t.value.length;e++)t.value[e].name=String(e);this.requestUpdate()}}#_(e){e.target instanceof HTMLSelectElement&&(this.targetId=e.target.value),this.requestUpdate()}#B(e){return"string"===e.type?Object.values(this.enumsByName.get(`${e.typeRef}`)??{}):"boolean"===e.type?["true","false"]:[]}performUpdate(){let e={onParameterValueBlur:e=>{this.#D(e)},onParameterKeydown:e=>{this.#O(e)},onParameterFocus:e=>{this.#q(e)},onParameterKeyBlur:e=>{this.#M(e)},onKeydown:e=>{"Enter"===e.key&&(e.ctrlKey||e.metaKey)&&(this.#O(e),this.#A())},parameters:this.parameters,metadataByCommand:this.metadataByCommand,command:this.command,typesByName:this.typesByName,onCommandInputBlur:e=>this.#U(e),onCommandSend:()=>this.#A(),onCopyToClipboard:()=>this.#k(),targets:this.targets,targetId:this.targetId,onAddParameter:e=>{this.#F(e)},onClearParameter:(e,t)=>{this.#K(e,t)},onDeleteParameter:(e,t)=>{this.#H(e,t)},onTargetSelected:e=>{this.#_(e)},computeDropdownValues:e=>this.#B(e)};this.#$(e,{},this.contentElement)}}function eE(e){return"string"===e||"boolean"===e||"number"===e}function eS(e){return el`
          <devtools-button
            title=${e.title}
            .size=${f.SMALL}
            .iconName=${e.iconName}
            .variant=${l.ICON}
            class=${eu(e.classMap)}
            @click=${e.onClick}
            .jslogContext=${e.jslogContext}
          ></devtools-button>
      `}let ex=(e,t,o)=>{ed(el`
    <div class="wrapper" @keydown=${e.onKeydown} jslog=${d("command-editor").track({resize:!0})}>
      <div class="editor-wrapper">
        ${el`
  <div class="row attribute padded">
    <div>target<span class="separator">:</span></div>
    <select class="target-selector"
            title=${ey(eg.selectTarget)}
            jslog=${b("target-selector").track({change:!0})}
            @change=${e.onTargetSelected}>
      ${e.targets.map(t=>el`
        <option jslog=${r("target").track({click:!0,resize:!0})}
                value=${t.id()} ?selected=${t.id()===e.targetId}>
          ${t.name()} (${t.inspectedURL()})
        </option>`)}
    </select>
  </div>
`}
        <div class="row attribute padded">
          <div class="command">command<span class="separator">:</span></div>
          <devtools-suggestion-input
            .options=${[...e.metadataByCommand.keys()]}
            .value=${e.command}
            .placeholder=${"Enter your command…"}
            .suggestionFilter=${eC}
            .jslogContext=${"command"}
            @blur=${e.onCommandInputBlur}
            class=${eu({"json-input":!0})}
          ></devtools-suggestion-input>
        </div>
        ${e.parameters.length?el`
        <div class="row attribute padded">
          <div>parameters<span class="separator">:</span></div>
        </div>
          ${function e(t,o,s,a,r){return o.sort((e,t)=>Number(e.optional)-Number(t.optional)),el`
    <ul>
      ${eh(o,o=>{let n=a?`${r}.${o.name}`:o.name,i="array"===o.type||"object"===o.type?o.value??[]:[],l=eE(o.type),d="array"===o.type,c=a&&"array"===a.type,p=a&&"object"===a.type,m="object"===o.type,u=void 0===o.value,h=o.optional,g=m&&o.typeRef&&void 0!==t.typesByName.get(o.typeRef),v=o.isKeyEditable,y="string"===o.type||"boolean"===o.type,b=d&&!u&&o.value?.length!==0||m&&!u,f={"optional-parameter":o.optional,parameter:!0,"undefined-parameter":void 0===o.value&&o.optional};return el`
              <li class="row">
                <div class="row-icons">
                    ${!o.isCorrectType?el`${el`<devtools-icon name='warning-filled' class='warning-icon small'>
  </devtools-icon>`}`:ep}

                    <!-- If an object parameter has no predefined keys, show an input to enter the key, otherwise show the name of the parameter -->
                    <div class=${eu(f)} data-paramId=${n}>
                        ${v?el`<devtools-suggestion-input
                            data-paramId=${n}
                            .isKey=${!0}
                            .isCorrectInput=${em(o.isCorrectType)}
                            .options=${y?t.computeDropdownValues(o):[]}
                            .autocomplete=${!1}
                            .value=${em(o.name??"")}
                            .placeholder=${""===o.value?e$:`<${ef.get(o.type)}>`}
                            @blur=${t.onParameterKeyBlur}
                            @focus=${t.onParameterFocus}
                            @keydown=${t.onParameterKeydown}
                          ></devtools-suggestion-input>`:el`${o.name}`} <span class="separator">:</span>
                    </div>

                    <!-- Render button to add values inside an array parameter -->
                    ${d?el`
                      ${eS({title:ey(eg.addParameter),iconName:"plus",onClick:()=>t.onAddParameter(n),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}
                    `:ep}

                    <!-- Render button to complete reset an array parameter or an object parameter-->
                    ${b?eS({title:ey(eg.resetDefaultValue),iconName:"clear",onClick:()=>t.onClearParameter(o,c),classMap:{"clear-button":!0},jslogContext:"protocol-monitor.reset-to-default-value"}):ep}

                    <!-- Render the buttons to change the value from undefined to empty string for optional primitive parameters -->
                    ${l&&!c&&h&&u?el`  ${eS({title:ey(eg.addParameter),iconName:"plus",onClick:()=>t.onAddParameter(n),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}`:ep}

                    <!-- Render the buttons to change the value from undefined to populate the values inside object with their default values -->
                    ${m&&h&&u&&g?el`  ${eS({title:ey(eg.addParameter),iconName:"plus",onClick:()=>t.onAddParameter(n),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-parameter"})}`:ep}
                </div>

                <div class="row-icons">
                    <!-- If an object has no predefined keys, show an input to enter the value, and a delete icon to delete the whole key/value pair -->
                    ${v&&p?el`
                    <!-- @ts-ignore -->
                    <devtools-suggestion-input
                        data-paramId=${n}
                        .isCorrectInput=${em(o.isCorrectType)}
                        .options=${y?t.computeDropdownValues(o):[]}
                        .autocomplete=${!1}
                        .value=${em(o.value??"")}
                        .placeholder=${""===o.value?e$:`<${ef.get(o.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${t.onParameterValueBlur}
                        @focus=${t.onParameterFocus}
                        @keydown=${t.onParameterKeydown}
                      ></devtools-suggestion-input>

                      ${eS({title:ey(eg.deleteParameter),iconName:"bin",onClick:()=>t.onDeleteParameter(o,a),classMap:{deleteButton:!0,deleteIcon:!0},jslogContext:"protocol-monitor.delete-parameter"})}`:ep}

                  <!-- In case  the parameter is not optional or its value is not undefined render the input -->
                  ${l&&!v&&(!u||!h)&&!c?el`
                      <!-- @ts-ignore -->
                      <devtools-suggestion-input
                        data-paramId=${n}
                        .strikethrough=${em(o.isCorrectType)}
                        .options=${y?t.computeDropdownValues(o):[]}
                        .autocomplete=${!1}
                        .value=${em(o.value??"")}
                        .placeholder=${""===o.value?e$:`<${ef.get(o.type)}>`}
                        .jslogContext=${"parameter-value"}
                        @blur=${t.onParameterValueBlur}
                        @focus=${t.onParameterFocus}
                        @keydown=${t.onParameterKeydown}
                      ></devtools-suggestion-input>`:ep}

                  <!-- Render the buttons to change the value from empty string to undefined for optional primitive parameters -->
                  ${l&&!v&&!c&&h&&!u?el`  ${eS({title:ey(eg.resetDefaultValue),iconName:"clear",onClick:()=>t.onClearParameter(o),classMap:{"clear-button":!0},jslogContext:"protocol-monitor.reset-to-default-value"})}`:ep}

                  <!-- If the parameter is an object with no predefined keys, renders a button to add key/value pairs to it's value -->
                  ${m&&!g?el`
                    ${eS({title:ey(eg.addCustomProperty),iconName:"plus",onClick:()=>t.onAddParameter(n),classMap:{"add-button":!0},jslogContext:"protocol-monitor.add-custom-property"})}
                  `:ep}

                  <!-- In case the parameter is nested inside an array we render the input field as well as a delete button -->
                  ${c?el`
                  <!-- If the parameter is an object we don't want to display the input field we just want the delete button-->
                  ${!m?el`
                  <!-- @ts-ignore -->
                  <devtools-suggestion-input
                    data-paramId=${n}
                    .options=${y?t.computeDropdownValues(o):[]}
                    .autocomplete=${!1}
                    .value=${em(o.value??"")}
                    .placeholder=${""===o.value?e$:`<${ef.get(o.type)}>`}
                    .jslogContext=${"parameter"}
                    @blur=${t.onParameterValueBlur}
                    @keydown=${t.onParameterKeydown}
                    class=${eu({"json-input":!0})}
                  ></devtools-suggestion-input>`:ep}

                  ${eS({title:ey(eg.deleteParameter),iconName:"bin",onClick:()=>t.onDeleteParameter(o,a),classMap:{"delete-button":!0},jslogContext:"protocol-monitor.delete-parameter"})}`:ep}
                </div>
              </li>
              ${e(t,i,s,o,n)}
            `})}
    </ul>
  `}(e,e.parameters)}
        `:ep}
      </div>
      <devtools-toolbar class="protocol-monitor-sidebar-toolbar">
        <devtools-button title=${ey(eg.copyCommand)}
                        .iconName=${"copy"}
                        .jslogContext=${"protocol-monitor.copy-command"}
                        .variant=${l.TOOLBAR}
                        @click=${e.onCopyToClipboard}></devtools-button>
          <div class=toolbar-spacer></div>
        <devtools-button title=${c()?ey(eg.sendCommandCmdEnter):ey(eg.sendCommandCtrlEnter)}
                        .iconName=${"send"}
                        jslogContext="protocol-monitor.send-command"
                        .variant=${l.PRIMARY_TOOLBAR}
                        @click=${e.onCommandSend}></devtools-button>
      </devtools-toolbar>
    </div>`,o)};var eI=Object.freeze({__proto__:null,DEFAULT_VIEW:ex,Events:eT,JSONEditor:eP,ParameterType:eb,suggestionFilter:eC});let{styleMap:ej}=A,{widget:eN,widgetRef:ek}=k,eA={method:"Method",type:"Type",request:"Request",response:"Response",timestamp:"Timestamp",elapsedTime:"Elapsed time",target:"Target",record:"Record",clearAll:"Clear all",filter:"Filter",documentation:"Documentation",editAndResend:"Edit and resend",sMs:"{PH1} ms",noMessageSelected:"No message selected",selectAMessageToView:"Select a message to see its details",save:"Save",session:"Session",sendRawCDPCommand:"Send a raw `CDP` command",sendRawCDPCommandExplanation:"Format: `'Domain.commandName'` for a command without parameters, or `'{\"command\":\"Domain.commandName\", \"parameters\": {...}}'` as a JSON object for a command with parameters. `'cmd'`/`'method'` and `'args'`/`'params'`/`'arguments'` are also supported as alternative keys for the `JSON` object.",selectTarget:"Select a target",showCDPCommandEditor:"Show CDP command editor",hideCDPCommandEditor:"Hide  CDP command editor"},eR=O("panels/protocol_monitor/ProtocolMonitor.ts",eA),eB=M.bind(void 0,eR),eD=e=>{let t=new Map;for(let o of e)for(let e of Object.keys(o.metadata))t.set(e,o.metadata[e]);return t},eM=eD(E.agentPrototypes.values()),eO=E.typeMap,eq=E.enumMap,eU=(e,t,o)=>{w(P`
        <style>${$}</style>
        <style>${"/** front_end/panels/protocol_monitor/protocolMonitor.css */\n/*\n * Copyright 2021 The Chromium Authors\n * Use of this source code is governed by a BSD-style license that can be\n * found in the LICENSE file.\n */\n@scope to (devtools-widget > *) {\n  .protocol-monitor-toolbar {\n    border-bottom: 1px solid var(--sys-color-divider);\n  }\n\n  .protocol-monitor-bottom-toolbar {\n    border-top: 1px solid var(--sys-color-divider);\n  }\n\n  .target-selector {\n    max-width: 120px;\n  }\n\n  .protocol-monitor-main {\n    /* allows the main area to grow automatically */\n    flex-grow: 1;\n  }\n}\n"}</style>
        <devtools-split-view name="protocol-monitor-split-container"
                             direction="column"
                             sidebar-initial-size="400"
                             sidebar-visibility=${e.sidebarVisible?"visible":"hidden"}
                             @change=${t=>e.onSplitChange("OnlyMain"===t.detail)}>
          <div slot="main" class="vbox protocol-monitor-main">
            <devtools-toolbar class="protocol-monitor-toolbar"
                               jslog=${T("top")}>
               <devtools-button title=${eB(eA.record)}
                                .iconName=${"record-start"}
                                .toggledIconName=${"record-stop"}
                                .jslogContext=${"protocol-monitor.toggle-recording"}
                                .variant=${l.ICON_TOGGLE}
                                .toggleType=${C.RED}
                                .toggled=${!0}
                                @click=${t=>e.onRecord(t.target.toggled)}>
               </devtools-button>
              <devtools-button title=${eB(eA.clearAll)}
                               .iconName=${"clear"}
                               .variant=${l.TOOLBAR}
                               .jslogContext=${"protocol-monitor.clear-all"}
                               @click=${()=>e.onClear()}></devtools-button>
              <devtools-button title=${eB(eA.save)}
                               .iconName=${"download"}
                               .variant=${l.TOOLBAR}
                               .jslogContext=${"protocol-monitor.save"}
                               @click=${()=>e.onSave()}></devtools-button>
              <devtools-toolbar-input type="filter"
                                      list="filter-suggestions"
                                      style="flex-grow: 1"
                                      value=${e.filter}
                                      @change=${t=>e.onFilterChanged(t.detail)}>
                <datalist id="filter-suggestions">
                  ${e.filterKeys.map(e=>P`
                        <option value=${e+":"}></option>
                        <option value=${"-"+e+":"}></option>`)}
                </datalist>
              </devtools-toolbar-input>
            </devtools-toolbar>
            <devtools-split-view direction="column" sidebar-position="second"
                                 name="protocol-monitor-panel-split" sidebar-initial-size="250">
              <devtools-data-grid
                  striped
                  slot="main"
                  .filters=${e.parseFilter(e.filter)}>
                <table>
                    <tr>
                      <th id="type" sortable style="text-align: center" hideable weight="1">
                        ${eB(eA.type)}
                      </th>
                      <th id="method" weight="5">
                        ${eB(eA.method)}
                      </th>
                      <th id="request" hideable weight="5">
                        ${eB(eA.request)}
                      </th>
                      <th id="response" hideable weight="5">
                        ${eB(eA.response)}
                      </th>
                      <th id="elapsed-time" sortable hideable weight="2">
                        ${eB(eA.elapsedTime)}
                      </th>
                      <th id="timestamp" sortable hideable weight="5">
                        ${eB(eA.timestamp)}
                      </th>
                      <th id="target" sortable hideable weight="5">
                        ${eB(eA.target)}
                      </th>
                      <th id="session" sortable hideable weight="5">
                        ${eB(eA.session)}
                      </th>
                    </tr>
                    ${e.messages.map(t=>{var o;return P`
                      <tr @select=${()=>e.onSelect(t)}
                          @contextmenu=${o=>e.onContextMenu(t,o.detail)}
                          style="--override-data-grid-row-background-color: var(--sys-color-surface3)">
                        ${"id"in t?P`
                          <td title="sent">
                            <devtools-icon name="arrow-up-down" class="medium" style="color: var(--icon-request-response);">
                            </devtools-icon>
                          </td>`:P`
                          <td title="received">
                            <devtools-icon name="arrow-down" class="medium" style="color: var(--icon-request);">
                            </devtools-icon>
                          </td>`}
                        <td>${t.method}</td>
                        <td>${t.params?P`<code>${JSON.stringify(t.params)}</code>`:""}</td>
                        <td>
                          ${t.result?P`<code>${JSON.stringify(t.result)}</code>`:t.error?P`<code>${JSON.stringify(t.error)}</code>`:"id"in t?"(pending)":""}
                        </td>
                        <td data-value=${t.elapsedTime||0}>
                          ${!("id"in t)?"":t.elapsedTime?eB(eA.sMs,{PH1:String(t.elapsedTime)}):"(pending)"}
                        </td>
                        <td data-value=${t.requestTime}>${eB(eA.sMs,{PH1:String(t.requestTime)})}</td>
                        <td>${(o=t.target)?o.decorateLabel(`${o.name()} ${o===h.instance().rootTarget()?"":o.id()}`):""}</td>
                        <td>${t.sessionId||""}</td>
                      </tr>`})}
                  </table>
              </devtools-data-grid>
              <devtools-widget ${eN(eK,{request:e.selectedMessage?.params,response:e.selectedMessage?.result||e.selectedMessage?.error,type:e.selectedMessage?"id"in e?.selectedMessage?"sent":"received":void 0})}
                  class="protocol-monitor-info"
                  slot="sidebar"></devtools-widget>
            </devtools-split-view>
            <devtools-toolbar class="protocol-monitor-bottom-toolbar"
               jslog=${T("bottom")}>
              <devtools-button .title=${e.sidebarVisible?eB(eA.hideCDPCommandEditor):eB(eA.showCDPCommandEditor)}
                               .iconName=${e.sidebarVisible?"left-panel-close":"left-panel-open"}
                               .variant=${l.TOOLBAR}
                               .jslogContext=${"protocol-monitor.toggle-command-editor"}
                               @click=${()=>e.onToggleSidebar()}></devtools-button>
              </devtools-button>
              <devtools-toolbar-input id="command-input"
                                      style=${ej({"flex-grow":1,display:e.sidebarVisible?"none":"flex"})}
                                      value=${e.command}
                                      list="command-input-suggestions"
                                      placeholder=${eB(eA.sendRawCDPCommand)}
                                      title=${eB(eA.sendRawCDPCommandExplanation)}
                                      @change=${t=>e.onCommandChange(t.detail)}
                                      @submit=${t=>e.onCommandSubmitted(t.detail)}>
                <datalist id="command-input-suggestions">
                  ${e.commandSuggestions.map(e=>P`<option value=${e}></option>`)}
                </datalist>
              </devtools-toolbar-input>
              <select class="target-selector"
                      title=${eB(eA.selectTarget)}
                      style=${ej({display:e.sidebarVisible?"none":"flex"})}
                      jslog=${b("target-selector").track({change:!0})}
                      @change=${t=>e.onTargetChange(t.target.value)}>
                ${e.targets.map(t=>P`
                  <option jslog=${r("target").track({click:!0})}
                          value=${t.id()} ?selected=${t.id()===e.selectedTargetId}>
                    ${t.name()} (${t.inspectedURL()})
                  </option>`)}
              </select>
            </devtools-toolbar>
          </div>
          <devtools-widget slot="sidebar"
              ${eN(eP,{metadataByCommand:eM,typesByName:eO,enumsByName:eq})}
              ${ek(eP,e=>{t.editorWidget=e})}>
          </devtools-widget>
        </devtools-split-view>`,o)};class eV extends S{started;startTime;messageForId=new Map;filterParser;#z=["method","request","response","target","session"];#J=new eL;#W;#b="";#G=!1;#$;#Y=[];#Z;#Q="";#X;#ee=new Map;constructor(e=eU){super("protocol-monitor",!0),this.#$=e,this.started=!1,this.startTime=0,this.#z=["method","request","response","type","target","session"],this.filterParser=new x(this.#z),this.#W="main",this.performUpdate(),this.#X.addEventListener(eT.SUBMIT_EDITOR,e=>{this.onCommandSend(e.data.command,e.data.parameters,e.data.targetId)}),h.instance().addEventListener(g.AVAILABLE_TARGETS_CHANGED,()=>{this.requestUpdate()}),h.instance().observeTargets(this)}targetAdded(e){this.#ee.set(e.sessionId,e)}targetRemoved(e){this.#ee.delete(e.sessionId)}#et(){let e=this.#X.getCommandJson(),t=this.#X.targetId;t&&(this.#W=t),e&&(this.#b=e,this.requestUpdate())}performUpdate(){let e={messages:this.#Y,selectedMessage:this.#Z,sidebarVisible:this.#G,command:this.#b,commandSuggestions:this.#J.allSuggestions(),filterKeys:this.#z,filter:this.#Q,parseFilter:this.filterParser.parse.bind(this.filterParser),onSplitChange:e=>{if(e)this.#et(),this.#G=!1;else{let{command:e,parameters:t}=eH(this.#b);this.#X.displayCommand(e,t,this.#W),this.#G=!0}this.requestUpdate()},onRecord:e=>{this.setRecording(e)},onClear:()=>{this.#Y=[],this.messageForId.clear(),this.requestUpdate()},onSave:()=>{this.saveAsFile()},onSelect:e=>{this.#Z=e,this.requestUpdate()},onContextMenu:this.#eo.bind(this),onCommandChange:e=>{this.#b=e},onCommandSubmitted:e=>{this.#J.addEntry(e);let{command:t,parameters:o}=eH(e);this.onCommandSend(t,o,this.#W)},onFilterChanged:e=>{this.#Q=e,this.requestUpdate()},onTargetChange:e=>{this.#W=e},onToggleSidebar:()=>{this.#G=!this.#G,this.requestUpdate()},targets:h.instance().targets(),selectedTargetId:this.#W},t=this;this.#$(e,{set editorWidget(value){t.#X=value}},this.contentElement)}#eo(e,t){t.editSection().appendItem(eB(eA.editAndResend),()=>{if(!this.#Z)return;let t=this.#Z.params,o=this.#Z.target?.id()||"",s=e.method;this.#b=JSON.stringify({command:s,parameters:t}),this.#G?this.#X.displayCommand(s,t,o):(this.#G=!0,this.requestUpdate())},{jslogContext:"edit-and-resend",disabled:!("id"in e)}),t.editSection().appendItem(eB(eA.filter),()=>{this.#Q=`method:${e.method}`,this.requestUpdate()},{jslogContext:"filter"}),t.footerSection().appendItem(eB(eA.documentation),()=>{let[t,o]=e.method.split("."),s="id"in e?"method":"event";y.openInNewTab(`https://chromedevtools.github.io/devtools-protocol/tot/${t}#${s}-${o}`)},{jslogContext:"documentation"})}onCommandSend(e,t,o){let s=h.instance(),a=o?s.targetById(o):null,r=a?a.sessionId:"";I.sendRawMessage(e,t,()=>{},r)}wasShown(){super.wasShown(),this.started||(this.started=!0,this.startTime=Date.now(),this.setRecording(!0))}setRecording(e){e?(I.onMessageSent=this.messageSent.bind(this),I.onMessageReceived=this.messageReceived.bind(this)):(I.onMessageSent=null,I.onMessageReceived=null)}messageReceived(e){if("id"in e&&e.id){let t=this.messageForId.get(e.id);if(!t)return;t.result=e.result,t.error=e.error,t.elapsedTime=Date.now()-this.startTime-t.requestTime,this.messageForId.delete(e.id),this.requestUpdate();return}let t=void 0!==e.sessionId?this.#ee.get(e.sessionId):void 0;this.#Y.push({method:e.method,sessionId:e.sessionId,target:t,requestTime:Date.now()-this.startTime,result:e.params}),this.requestUpdate()}messageSent(e){let t=void 0!==e.sessionId?this.#ee.get(e.sessionId):void 0,o={method:e.method,params:e.params,id:e.id,sessionId:e.sessionId,target:t,requestTime:Date.now()-this.startTime};this.#Y.push(o),this.requestUpdate(),this.messageForId.set(e.id,o)}async saveAsFile(){let e="ProtocolMonitor-"+j(new Date)+".json",t=new N;if(!await t.open(e))return;let o=this.#Y.map(e=>({...e,target:e.target?.id()}));t.write(JSON.stringify(o,null,"  ")),t.close()}}class eL{#es=200;#ea=new Set;constructor(e){void 0!==e&&(this.#es=e)}allSuggestions(){let e=[...this.#ea].reverse();return e.push(...eM.keys()),e}buildTextPromptCompletions=async(e,t,o)=>t||o||!e?this.allSuggestions().filter(e=>e.startsWith(t)).map(e=>({text:e})):[];addEntry(e){if(this.#ea.has(e)&&this.#ea.delete(e),this.#ea.add(e),this.#ea.size>this.#es){let e=this.#ea.values().next().value;this.#ea.delete(e)}}}let eF=(e,t,o)=>{w(eN(R,{tabs:[{id:"request",title:eB(eA.request),view:void 0===e.type?new B(eB(eA.noMessageSelected),eB(eA.selectAMessageToView)):D.createViewSync(e.request||null),enabled:"sent"===e.type,selected:"request"===e.selectedTab},{id:"response",title:eB(eA.response),view:void 0===e.type?new B(eB(eA.noMessageSelected),eB(eA.selectAMessageToView)):D.createViewSync(e.response||null),selected:"response"===e.selectedTab}]}),o)};class eK extends m{#$;request;response;type;constructor(e,t=eF){super(e),this.#$=t,this.requestUpdate()}performUpdate(){this.#$({request:this.request,response:this.response,type:this.type,selectedTab:"sent"!==this.type?"response":void 0},void 0,this.contentElement)}}function eH(e){let t=null;try{t=JSON.parse(e)}catch{}return{command:t?t.command||t.method||t.cmd||"":e,parameters:t?.parameters||t?.params||t?.args||t?.arguments||{}}}var e_=Object.freeze({__proto__:null,CommandAutocompleteSuggestionProvider:eL,DEFAULT_VIEW:eU,InfoWidget:eK,ProtocolMonitorImpl:eV,buildProtocolMetadata:eD,parseCommandInput:eH});export{eI as JSONEditor,e_ as ProtocolMonitor};
