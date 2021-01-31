/**
 * skylark-poxp - A version of poxp that ported to running on skylarkjs
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-poxp/
 * @license MIT
 */
define(["./poxp","./Vector"],function(e,n){const t={VRReady:!1,isPresenting:!1,checkVR:function(){return new Promise((e,n)=>{navigator.xr?navigator.xr.isSessionSupported("immersive-vr",{optionalFeatures:["hand-tracking"]}).then(n=>{t.VRReady=n,e(n)}).catch(n=>{console.log(n),e(!1)}):e(!1)})},presentVR:function(e){return new Promise((n,r)=>{navigator.xr.requestSession("immersive-vr",{optionalFeatures:["hand-tracking"]}).then(n=>{t.session=n,t.isPresenting=!0,console.log("vr start"),n.updateRenderState({baseLayer:new XRWebGLLayer(n,e.wwg.gl,{framebufferScaleFactor:e.pixRatio})}),n.requestReferenceSpace("local").then(n=>{t.referenceSpace=n,t.session.requestAnimationFrame(t.loopf),e.callEvent("vrchange",1)}),n.addEventListener("end",n=>{t.session=null,t.isPresenting=!1,console.log("VR end"),e.callEvent("vrchange",0)})})})},closeVR:function(){console.log("vr closing"),t.isPresenting=!1,t.session.end()},animationFrame:function(e,n,r){if(t.loopf=n,t.isPresenting){if(!r)return;t.session.requestAnimationFrame(n),t.vrFrame=r,e.isVR=!0}else e.loop=window.requestAnimationFrame(n),e.isVR=!1},submitFrame:function(){t.VRReady},getFrameData:function(){if(t.vrFrame){let n=t.vrFrame.getViewerPose(t.referenceSpace);n.orientation=[n.transform.orientation.x,n.transform.orientation.y,n.transform.orientation.z,n.transform.orientation.w],n.position=[n.transform.position.x,n.transform.position.y,n.transform.position.z];let r={pose:n},i=t.session.renderState.baseLayer;t.webGLLayer=i;for(let t=0;t<=n.views.length-1;t++){const o=n.views[t];var e=i.getViewport(o);n.views[t].viewport=e,"right"==o.eye?(r.rightViewMatrix=o.transform.inverse.matrix,r.rightProjectionMatrix=o.projectionMatrix,r.rightViewport=e):"left"==o.eye&&(r.leftViewMatrix=o.transform.inverse.matrix,r.leftProjectionMatrix=o.projectionMatrix,r.leftViewport=e)}return t.views=n.views,t.viewport={leftViewport:r.leftViewport,rightViewport:r.rightViewport},r}},getViewport:function(e){return t.isPresenting?t.viewport:{leftViewport:{x:0,y:0,width:e.width/2,height:e.height},rightViewport:{x:e.width/2,y:0,width:e.width/2,height:e.height}}},setDepth:function(e){t.isPresenting&&t.session.updateRenderState({depthNear:e.camNear,depthFar:e.camFar})},getInput:function(){if(!t.isPresenting)return null;if(!t.session.inputSources)return null;let e={};for(let n of t.session.inputSources){if(null==n)continue;let r=t.vrFrame.getPose(n.gripSpace,t.referenceSpace),i=r?t.convTransform(r.transform):null;if(n.gamepad&&(e.gamepad||(e.gamepad={}),e.gamepad[n.handedness]={handedness:n.handedness,gamepad:n.gamepad,profiles:n.profiles,pose:i}),n.hand){e.hand||(e.hand={});let r=[];for(let e=0;e<25;e++)if(null!==n.hand[e]){let i=t.vrFrame.getJointPose(n.hand[e],t.referenceSpace);r[e]=null!=i?{radius:i.radius,transform:t.convTransform(i.transform)}:null}else r[e]=null;e.hand[n.handedness]={handedness:n.handedness,hand:r,profiles:n.profiles,pose:i}}}return e},convTransform:function(e){let t={};return e.position&&(t.position=new n(e.position.x,e.position.y,e.position.z)),e.orientation&&(t.orientation=new n(e.orientation.x,e.orientation.y,e.orientation.z,e.orientation.w)),e.matrix&&(t.matrix=new Mat4(e.matrix)),t}};return e.POXPDevice=t});
//# sourceMappingURL=sourcemaps/POXPDevice.js.map
