/**
 * skylark-poxp - A version of poxp that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-poxp/
 * @license MIT
 */
define(["./poxp"],function(o){return o.PoxProfile=class{constructor(o){this.poxp=o}log(...o){for(let t of o)this.poxp.pox.log(t)}lognow(){let o=new Date;this.poxp.pox.log("["+o.toLocaleTimeString()+"."+("00"+o.getUTCMilliseconds().toString()).substr(-3)+"]")}dumpobj(o,t=1){let i=o;if(0==t)return i;if(Array.isArray(o))i="["+o.join(",")+"]";else if("object"==typeof o){i="{";for(let e in o)i+=e+":"+this.dumpobj(o[e],t-1)+",";i+="}"}return i}logobj(o,t=1){this.log(this.dumpobj(o,t))}dumpModels(){this.lognow();const o=this.poxp.render.data.model;for(let t of o)this.log("id:"+t.id,"  name:"+t.name,"  mode:"+t.geo.mode,"  vtx:"+t.geo.vtx.length/t.obuf.tl),t.geo.idx&&this.log("  idx:"+t.geo.idx&&t.geo.idx.length),t.inst&&this.log("  inst:"+t.inst.count)}dumpModelUni(o){const t=this.poxp.pox.getModelData(o);if(t){this.lognow(),this.log("vs_uni");for(let o in t.vs_uni)this.log("  "+o+" = "+t.vs_uni[o]);this.log("fs_uni");for(let o in t.fs_uni)this.log("  "+o+" = "+t.fs_uni[o])}}}});
//# sourceMappingURL=sourcemaps/PoxProfile.js.map
