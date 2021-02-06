define([
    "./pox",
    "./Vector"
],function(pox,Vector){
	const Device = {
		VRReady:false,
		isPresenting:false,
		WebXR:false ,
		checkVR:function(poxp) {
			return new Promise( (resolve,reject)=>{
				// for WebXR
				if(navigator.xr) {
					navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
						Device.VRReady = supported 
						Device.WebXR = supported 
						resolve(supported)       	
					}).catch((err)=>{
						console.log(err)
						resolve(false)
					});
				} else
				// for WebVR
				if(navigator.getVRDisplays) {
					if(window.VRFrameData!=undefined) Device.vrFrame = new VRFrameData()
					navigator.getVRDisplays().then((displays)=> {
						console.log("VR init with WebVR")
						Device.vrDisplay = displays[displays.length - 1]
						console.log(Device.vrDisplay)
						Device.VRReady = true 
	//					poxp.vrDisplay = Device.vrDisplay
						window.addEventListener('vrdisplaypresentchange', ()=>{
							console.log("vr presenting= "+Device.vrDisplay.isPresenting)
							if(Device.vrDisplay.isPresenting) {
								poxp.callEvent("vrchange",1)
								Device.isPresenting = true 
							} else {
								poxp.resize() ;
								poxp.callEvent("vrchange",0)
								Device.isPresenting = false 
							}
						}, false);
						window.addEventListener('vrdisplayactivate', ()=>{
							console.log("vr active")
						}, false);
						window.addEventListener('vrdisplaydeactivate', ()=>{
							console.log("vr deactive")
						}, false);
						resolve(true)
					}).catch((err)=> {
						reject(err)
					})
				} else {
					resolve(false)
				}
			})
		},
		presentVR:function(poxp) {
			return new Promise( (resolve,reject)=>{
				// for WebXR
				if(Device.WebXR) {
					navigator.xr.requestSession("immersive-vr").then(function(xrSession) {
						Device.session=xrSession
						Device.isPresenting = true
						console.log("vr start")
						xrSession.updateRenderState({baseLayer: new XRWebGLLayer(xrSession,poxp.wwg.gl,{framebufferScaleFactor:poxp.pixRatio})});
						xrSession.requestReferenceSpace("local").then((xrReferenceSpace) => {
							Device.referenceSpace=xrReferenceSpace;
							Device.session.requestAnimationFrame(Device.loopf);
							poxp.callEvent("vrchange",1)
						});
						xrSession.addEventListener("end", (ev)=>{
								Device.session=null
								Device.isPresenting = false
								console.log("VR end")
	//							poxp.loop = window.requestAnimationFrame(Device.loopf) ;
								poxp.callEvent("vrchange",0)
						})
					});
				} else 
				// for WebVR
				if(Device.vrDisplay) {
					const p = { source: poxp.can,attributes:{} }
					if(poxp.pox.setting.highRefreshRate!==undefined) p.attributes.highRefreshRate = poxp.pox.setting.highRefreshRate
					if(poxp.pox.setting.foveationLevel!==undefined) p.attributes.foveationLevel = poxp.pox.setting.foveationLevel
					Device.vrDisplay.requestPresent([p]).then( () =>{
						console.log("present ok")
						const leftEye = Device.vrDisplay.getEyeParameters("left");
						const rightEye = Device.vrDisplay.getEyeParameters("right");
						poxp.can.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
						poxp.can.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
						if(Device.vrDisplay.displayName=="Oculus Go") {
							poxp.can.width = 2560
							poxp.can.height = 1280
						}
						poxp.can.width= poxp.can.width * poxp.pixRatio 
						poxp.can.height= poxp.can.height * poxp.pixRatio 
						poxp.pox.log(Device.vrDisplay.displayName)
						poxp.pox.log("vr canvas:"+poxp.can.width+" x "+poxp.can.height);
					}).catch((err)=> {
						console.log(err)
					})
				}
			})
		},
		closeVR:function(poxp) {
			// for WebXR
			if(Device.WebXR) {
				console.log("vr closing")
				Device.isPresenting = false
				Device.session.end()
			}
			// for WebVR
			if(Device.vrDisplay) {
				Device.vrDisplay.exitPresent().then( () =>{
					console.log("VR end")
				})
			}
		},
		animationFrame:function(poxp,loopf,vrframe) {
			Device.loopf = loopf 
			if(Device.isPresenting ) {
				if(!vrframe) return 
				// for WebXR
				if(Device.WebXR) {
					Device.session.requestAnimationFrame(loopf);
					Device.vrFrame = vrframe 
					poxp.isVR = true 
	//				console.log("vrframe")
				// for WebVR
				} else if(Device.vrDisplay && Device.vrDisplay.isPresenting) {
					poxp.loop = Device.vrDisplay.requestAnimationFrame(loopf)
					poxp.isVR = true 
				}
			} else {
	//			console.log("no vrframe")
				poxp.loop = window.requestAnimationFrame(loopf) ;
				poxp.isVR = false ;
			}
		},
		submitFrame:function(poxp) {
			// for WebXR
			if(Device.WebXR) {
			}
			// for WebVR
			if(Device.vrDisplay) {
				if(Device.vrDisplay.isPresenting) Device.vrDisplay.submitFrame()
			}
		},
		getFrameData:function(poxp) {
			// for WebXR
			if(Device.WebXR && Device.vrFrame) {
	//			console.log("getframe")
				let pose=Device.vrFrame.getViewerPose(Device.referenceSpace);
	//			console.log(pose)
				pose.orientation = [pose.transform.orientation.x,pose.transform.orientation.y,pose.transform.orientation.z,pose.transform.orientation.w]
				pose.position = [pose.transform.position.x,pose.transform.position.y,pose.transform.position.z]
				let frame = {pose:pose}
				let webGLLayer=Device.session.renderState.baseLayer;
	//			console.log(webGLLayer)
				Device.webGLLayer = webGLLayer
				for (let i=0;i<=pose.views.length-1;i++)
				{
					var viewport=webGLLayer.getViewport(pose.views[i]);
					if(i==1) {
						frame.rightViewMatrix = pose.views[i].transform.inverse.matrix
						frame.rightProjectionMatrix = pose.views[i].projectionMatrix
						frame.rightViewport = viewport 
					} else {
						frame.leftViewMatrix = pose.views[i].transform.inverse.matrix
						frame.leftProjectionMatrix = pose.views[i].projectionMatrix	
						frame.leftViewport = viewport 			
					}
				}
				Device.viewport = {leftViewport:frame.leftViewport,rightViewport:frame.rightViewport}
	//			console.log(frame)
				return frame 
			}
			// for WebVR
			if(Device.vrDisplay) {
				Device.vrDisplay.getFrameData(Device.vrFrame)
				return Device.vrFrame
			}
		},
		getViewport:function(can) {
			if(Device.WebXR && Device.isPresenting)
				return Device.viewport
			else 
				return {leftViewport:{x:0,y:0,width:can.width/2,height:can.height},
								rightViewport:{x:can.width/2,y:0,width:can.width/2,height:can.height}}
		},
		setDepth:function(camDepth) {
			// for WebXR
			if(!Device.isPresenting) return
			if(Device.WebXR) {
				Device.session.updateRenderState({depthNear:camDepth.camNear, depthFar:camDepth.camFar})
			}
			// for WebVR
			if(Device.vrDisplay) {
				Device.vrDisplay.depthNear = camDepth.camNear 
				Device.vrDisplay.depthFar = camDepth.camFar 
			}
		}
	}

	return pox.Device = Device;
});