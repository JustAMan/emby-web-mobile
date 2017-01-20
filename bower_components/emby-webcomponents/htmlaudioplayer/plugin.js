define(["events","browser","pluginManager","apphost","appSettings"],function(events,browser,pluginManager,appHost,appSettings){"use strict";return function(){function getSavedVolume(){return appSettings.get("volume")||1}function saveVolume(value){value&&appSettings.set("volume",value)}function playWithPromise(elem){try{var promise=elem.play();return promise&&promise.then?promise.catch(function(e){var errorName=(e.name||"").toLowerCase();return"notallowederror"===errorName||"aborterror"===errorName?Promise.resolve():Promise.reject()}):Promise.resolve()}catch(err){return console.log("error calling video.play: "+err),Promise.reject()}}function getCrossOriginValue(mediaSource){return"anonymous"}function supportsFade(){return!browser.tv}function fade(elem,startingVolume){var newVolume=Math.max(0,startingVolume-.15);return console.log("fading volume to "+newVolume),elem.volume=newVolume,newVolume<=0?Promise.resolve():new Promise(function(resolve,reject){cancelFadeTimeout(),fadeTimeout=setTimeout(function(){fade(elem,newVolume).then(resolve,reject)},100)})}function cancelFadeTimeout(){var timeout=fadeTimeout;timeout&&(clearTimeout(timeout),fadeTimeout=null)}function onEnded(){var stopInfo={src:currentSrc};events.trigger(self,"stopped",[stopInfo]),_currentTime=null,currentSrc=null}function onTimeUpdate(){var time=this.currentTime;_currentTime=time,events.trigger(self,"timeupdate")}function onVolumeChange(){fadeTimeout||(saveVolume(this.volume),events.trigger(self,"volumechange"))}function onPlaying(){events.trigger(self,"playing")}function onPause(){events.trigger(self,"pause")}function onError(){var errorCode=this.error?this.error.code:"";errorCode=(errorCode||"").toString(),console.log("Media element error code: "+errorCode);var type;switch(errorCode){case 1:return;case 2:type="network";break;case 3:break;case 4:}}function createMediaElement(){var elem=document.querySelector(".mediaPlayerAudio");return elem||(elem=document.createElement("audio"),elem.classList.add("mediaPlayerAudio"),elem.classList.add("hide"),document.body.appendChild(elem),elem.volume=getSavedVolume(),elem.addEventListener("timeupdate",onTimeUpdate),elem.addEventListener("ended",onEnded),elem.addEventListener("volumechange",onVolumeChange),elem.addEventListener("pause",onPause),elem.addEventListener("playing",onPlaying),elem.addEventListener("error",onError)),mediaElement=elem,elem}function onDocumentClick(){document.removeEventListener("click",onDocumentClick);var elem=document.createElement("audio");elem.classList.add("mediaPlayerAudio"),elem.classList.add("hide"),document.body.appendChild(elem),elem.src=pluginManager.mapPath(self,"blank.mp3"),elem.play(),setTimeout(function(){elem.src="",elem.removeAttribute("src")},1e3)}var self=this;self.name="Html Audio Player",self.type="mediaplayer",self.id="htmlaudioplayer",self.priority=1;var mediaElement,currentSrc;self.canPlayMediaType=function(mediaType){return"audio"===(mediaType||"").toLowerCase()},self.getDeviceProfile=function(){return new Promise(function(resolve,reject){require(["browserdeviceprofile"],function(profileBuilder){var profile=profileBuilder({});resolve(profile)})})},self.currentSrc=function(){return currentSrc},self.play=function(options){_currentTime=null;var elem=createMediaElement(),val=options.url;return elem.crossOrigin=getCrossOriginValue(options.mediaSource),elem.title=options.title,options.mimeType&&browser.operaTv?(elem.currentSrc&&(elem.src="",elem.removeAttribute("src")),elem.innerHTML='<source src="'+val+'" type="'+options.mimeType+'">'):elem.src=val,currentSrc=val,playWithPromise(elem)};var _currentTime;self.currentTime=function(val){if(mediaElement)return null!=val?void(mediaElement.currentTime=val/1e3):_currentTime?1e3*_currentTime:1e3*(mediaElement.currentTime||0)},self.duration=function(val){if(mediaElement){var duration=mediaElement.duration;if(duration&&!isNaN(duration)&&duration!==Number.POSITIVE_INFINITY&&duration!==Number.NEGATIVE_INFINITY)return 1e3*duration}return null},self.stop=function(destroyPlayer){cancelFadeTimeout();var elem=mediaElement,src=currentSrc;if(elem&&src){if(!destroyPlayer||!supportsFade())return elem.paused||elem.pause(),elem.src="",elem.innerHTML="",elem.removeAttribute("src"),onEnded(),Promise.resolve();var originalVolume=elem.volume;return fade(elem,elem.volume).then(function(){elem.paused||elem.pause(),elem.src="",elem.innerHTML="",elem.removeAttribute("src"),elem.volume=originalVolume,onEnded()})}return Promise.resolve()},self.destroy=function(){};var fadeTimeout;self.pause=function(){mediaElement&&mediaElement.pause()},self.resume=function(){mediaElement&&mediaElement.play()},self.unpause=function(){mediaElement&&mediaElement.play()},self.paused=function(){return!!mediaElement&&mediaElement.paused},self.setVolume=function(val){mediaElement&&(mediaElement.volume=val/100)},self.getVolume=function(){if(mediaElement)return 100*mediaElement.volume},self.volumeUp=function(){self.setVolume(Math.min(self.getVolume()+2,100))},self.volumeDown=function(){self.setVolume(Math.max(self.getVolume()-2,0))},self.setMute=function(mute){mediaElement&&(mediaElement.muted=mute)},self.isMuted=function(){return!!mediaElement&&mediaElement.muted},appHost.supports("htmlaudioautoplay")||document.addEventListener("click",onDocumentClick)}});