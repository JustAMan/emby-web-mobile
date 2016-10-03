define([],function(){"use strict";function parentWithAttribute(elem,name,value){for(;value?elem.getAttribute(name)!==value:!elem.getAttribute(name);)if(elem=elem.parentNode,!elem||!elem.getAttribute)return null;return elem}function parentWithTag(elem,tagNames){for(Array.isArray(tagNames)||(tagNames=[tagNames]);tagNames.indexOf(elem.tagName||"")===-1;)if(elem=elem.parentNode,!elem)return null;return elem}function parentWithClass(elem,className){for(;!elem.classList||!elem.classList.contains(className);)if(elem=elem.parentNode,!elem)return null;return elem}function addEventListenerWithOptions(target,type,handler,options){var optionsOrCapture=options;supportsCaptureOption||(optionsOrCapture=options.capture),target.addEventListener(type,handler,optionsOrCapture)}function removeEventListenerWithOptions(target,type,handler,options){var optionsOrCapture=options;supportsCaptureOption||(optionsOrCapture=options.capture),target.removeEventListener(type,handler,optionsOrCapture)}function clearWindowSize(){windowSize=null}function getWindowSize(){return windowSize||(windowSize={innerHeight:window.innerHeight,innerWidth:window.innerWidth},windowSizeEventsBound||(windowSizeEventsBound=!0,addEventListenerWithOptions(window,"orientationchange",clearWindowSize,{passive:!0}),addEventListenerWithOptions(window,"resize",clearWindowSize,{passive:!0}))),windowSize}var supportsCaptureOption=!1;try{var opts=Object.defineProperty({},"capture",{get:function(){supportsCaptureOption=!0}});window.addEventListener("test",null,opts)}catch(e){}var windowSize,windowSizeEventsBound;return{parentWithAttribute:parentWithAttribute,parentWithClass:parentWithClass,parentWithTag:parentWithTag,addEventListener:addEventListenerWithOptions,removeEventListener:removeEventListenerWithOptions,getWindowSize:getWindowSize}});