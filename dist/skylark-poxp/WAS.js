/**
 * skylark-poxp - A version of poxp that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-poxp/
 * @license MIT
 */
define(["./poxp"],function(t){var e={synth:function(t){var e=window.AudioContext||window.webkitAudioContext;e?(this.ctx=new e,this.mg=this.ctx.createGain(),this.mg.gain.value=.2,this.outnode=this.mg,t&&t.analyse&&(this.analyser=this.ctx.createAnalyser(),this.analyser.connect(this.mg),this.outnode=this.analyser),t&&t.tone&&(this.bass=this.ctx.createBiquadFilter(),this.bass.type="lowshelf",this.bass.frequency.value=500,this.bass.gain.value=5,this.treble=this.ctx.createBiquadFilter(),this.treble.type="highshelf",this.treble.frequency.value=2e3,this.treble.gain.value=5,this.bass.connect(this.treble),this.treble.connect(this.outnode),this.outnode=this.bass),t&&t.comp&&(this.comp=this.ctx.createDynamicsCompressor(),this.comp.connect(this.outnode),this.outnode=this.comp),this.mg.connect(this.ctx.destination)):this.error=!0},ongen:function(t){this.synth=t,this.ctx=t.ctx}};return e.synth.prototype.close=function(){this.ctx.close()},e.synth.prototype.createongen=function(t){var i=new e.ongen(this);return i.init(t),i},e.synth.prototype.copyobj=function(t,e){for(var i in t)null!==t[i]&&"object"==typeof t[i]?(void 0===e[i]&&(e[i]={}),this.copyobj(t[i],e[i])):e[i]=t[i]},e.ongen.prototype.init=function(t){if(this.e1=this.ctx.createGain(),this.f1=this.ctx.createBiquadFilter(),this.o1=this.ctx.createOscillator(),"noise"==t.waveform){this.n1=this.ctx.createScriptProcessor(1024),this.n1.onaudioprocess=function(t){for(var e=t.outputBuffer.getChannelData(0),i=t.outputBuffer.getChannelData(1),s=0;s<1024;++s)e[s]=i[s]=Math.random()-.5},this.o1.connect(this.n1),this.n1.connect(this.f1)}else this.o1.connect(this.f1);this.f1.connect(this.e1),this.e1.connect(this.synth.outnode),this.f1.frequency.value=2e4,this.e1.gain.value=0,this.tune=440,this.sf=!1,t.lfo_osc&&(this.l1=this.ctx.createOscillator(),this.l1g=this.ctx.createGain(),this.l1.connect(this.l1g),this.l1g.connect(this.o1.frequency),this.l1.frequency.value=t.lfo_osc.frequency,this.l1.type=t.lfo_osc.waveform,this.l1g.gain.value=t.lfo_osc.level),t.lfo_flt&&(this.l2=this.ctx.createOscillator(),this.l2g=this.ctx.createGain(),this.l2.connect(this.l2g),this.l2g.connect(this.f1.frequency),this.l2.frequency.value=t.lfo_flt.frequency,this.l2.type=t.lfo_flt.waveform,this.l2g.gain.value=t.lfo_flt.level),t.lfo_amp&&(this.l3=this.ctx.createOscillator(),this.l3g=this.ctx.createGain(),this.lag=this.ctx.createGain(),this.l3.connect(this.l3g),this.l3g.connect(this.lag.gain),this.l3.frequency.value=t.lfo_amp.frequency,this.l3.type=t.lfo_amp.waveform,this.l3g.gain.value=t.lfo_amp.level,this.f1.connect(this.lag),this.lag.connect(this.e1)),this.opt={eg:{attack:.1,decay:.1,sustain:.5,release:1,maxvalue:1,minvalue:0}},this.setopt(t)},e.ongen.prototype.setopt=function(t){t&&this.synth.copyobj(t,this.opt),this.opt.waveform&&"noise"!=this.opt.waveform&&(this.o1.type=this.opt.waveform),this.opt.cutoff&&(this.f1.frequency.value=this.opt.cutoff),this.opt.resonance&&(this.f1.Q.value=this.opt.resonance),this.opt.ftype&&(this.f1.type=this.opt.ftype);var e=this;this.o1.onended=function(){"noise"==e.opt.waveform&&e.n1.disconnect(),e.opt.onended&&e.opt.onended.call(e)}},e.ongen.prototype.start=function(){this.sf||(this.o1.start(0),this.l1&&this.l1.start(0),this.l2&&this.l2.start(0),this.l3&&this.l3.start(0),this.sf=!0)},e.ongen.prototype.note=function(t,e,i){this.start(),void 0==i&&(i=0),"string"==typeof t&&(t=this.note2freq(t));var s=this.ctx.currentTime;this.endtime>s&&console.log("over"),this.e1.gain.cancelScheduledValues(0),this.o1.frequency.setValueAtTime(t,s),s=s+i+.01,this.endtime=this.setenv(this.e1.gain,s,e,this.opt.eg),this.opt.eg_osc&&(this.opt.eg.minvalue=t,this.opt.eg.maxvalue=this.opt.eg_osc.minvalue+100,this.setenv(this.o1.frequency,s,e,this.opt.eg_osc)),this.opt.continuous||this.o1.stop(this.endtime)},e.ongen.prototype.setenv=function(t,e,i,s){t.setValueAtTime(s.minvalue,e),t.linearRampToValueAtTime(s.maxvalue,e+s.attack);var n=(s.maxvalue-s.minvalue)*s.sustain+s.minvalue;return t.linearRampToValueAtTime(n,e+s.attack+s.decay),t.setValueAtTime(n,e+i),endtime=e+i+s.release,t.linearRampToValueAtTime(s.minvalue,endtime),endtime},e.ongen.prototype.note2freq=function(t){if(t.match(/([CDEFGAB])([#\+\-]*)([0-9]+)/i)){var e={c:0,d:2,e:4,f:5,g:7,a:9,b:11}[RegExp.$1.toLowerCase()],i=RegExp.$2,s=RegExp.$3;return"#"!=i&&"+"!=i||(e+=1),"-"==i&&(e-=1),e=12*s+e,Math.pow(2,(e-57)/12)*this.tune}return null},e.synth.prototype.showwave=function(t,e){(t=t.getContext("2d")).strokeStyle="#fff",t.fillStyle="#486";var s=t.canvas.width,n=s/2,o=t.canvas.height,a=new Uint8Array(512),h=this;setInterval(function(){for(h.analyser.getByteTimeDomainData(a),t.fillRect(0,0,s,o),t.beginPath(),t.moveTo(0,o/2),i=0;i<512;i++)t.lineTo(i*n/512,o-a[i]*o/256);h.analyser.getByteFrequencyData(a),t.moveTo(n,o);var e=0,c=512;for(i=0;i<512;i++)e<a[i]&&(e=a[i]),c>a[i]&&(c=a[i]),t.moveTo(i*n/512+n,o),t.lineTo(i*n/512+n,o-a[i]*o/256);t.stroke()},e)},t.WAS=e});
//# sourceMappingURL=sourcemaps/WAS.js.map
