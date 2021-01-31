define([
	"skylark-langx/skylark"
],function(skylark){
	const  POXP = {} ;
	function $(e){return document.getElementById(e)}

	POXP.$ = $;
	
	POXP.msg = (msg)=> {
		let dt = new Date 
		
		if( typeof msg == "string") {
			let p = location.protocol + "//" + location.host
			msg = msg.replace(new RegExp(p,"g"),"").replace(/data:[^:]+/,"module")
		}
		if($("msglog")) {
			$("msglog").value += dt.toTimeString().substr(0,8)+
				"."+("000"+dt.getMilliseconds()).substr(-3)+" "+msg +"\n"
	  	$("msglog").scrollTop = $("msglog").scrollHeight ;
		}
		if(!$("msgc")) {
			console.log(msg)
			return
		}

		const e = document.createElement("div")

		e.innerHTML =  msg

		$("msgc").appendChild(e) ;
		$("msg").scrollTop = $("msgc").offsetHeight ;
	}

	return skylark.attach("intg.poxp",POXP);
});