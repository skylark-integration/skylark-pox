/**
 * skylark-pox - A version of pox that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-pox/
 * @license MIT
 */
define(["skylark-langx/skylark"],function(e){const t={};function o(e){return document.getElementById(e)}return t.$=o,t.RAD=Math.PI/180,t.msg=(e=>{let t=new Date;if("string"==typeof e){let t=location.protocol+"//"+location.host;e=e.replace(new RegExp(t,"g"),"").replace(/data:[^:]+/,"module")}if(o("msglog")&&(o("msglog").value+=t.toTimeString().substr(0,8)+"."+("000"+t.getMilliseconds()).substr(-3)+" "+e+"\n",o("msglog").scrollTop=o("msglog").scrollHeight),!o("msgc"))return void console.log(e);const l=document.createElement("div");l.innerHTML=e,o("msgc").appendChild(l),o("msg").scrollTop=o("msgc").offsetHeight}),e.attach("intg.pox",t)});
//# sourceMappingURL=sourcemaps/pox.js.map
