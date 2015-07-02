jQuery(function($){


var eventBridge = $('<ul />');
var eventDictionary = {
	global : {
		RESIZE : 'resize',
		 ROTATE : 'rotate',
		 SCROLL : 'scroll'
	 }
};
function scrollTop(){
	return $(window).scrollTop();
}

function calcTop(elem){
	var offset = elem.offset();
	return offset.top
}
/**
  Function to throttle speed of events
  @function throttle
 **/
var throttle = (function () {
	return function (fn, delay) {
		delay || (delay = 100);
		var last = (function () {
				return +new Date();
			})(),
		timeoutId = null;

		return function () {
			var args = arguments;
			if (timeoutId) {
				clearTimeout(timeoutId);
				timeoutId = null;
			}

			var now = (function () {
				return +new Date();
			})();
			if (now - last > delay) {
				fn.apply(this, args);
				last = now;
			} else {
				timeoutId = setTimeout(function () {
					fn.apply(this, args);
				}, delay);
			}
		};
	};
})();
var ticking = false,
	fireScroll = false,
	fireResize = false;

function requestTick(ev) {
	if (!ticking) {
		window.webkitRequestAnimationFrame(function () {
			if (fireScroll) {
				eventBridge.trigger(jQuery.Event(eventDictionary.global.SCROLL)/*, ss.metrics*/);
				fireScroll = false;
			}
			if (fireResize) {
				eventBridge.trigger(jQuery.Event(eventDictionary.global.RESIZE)/*, ss.metrics*/);
				fireResize = false;
			}
			ticking = false;
		});
		ticking = true;
	}
}
(function($){
	$.LazyLoadImages = function(){
		return {
			lazy : [],
			init : function(){
				var self = this;
				//Lazy loaded images
				self.lazy = $('.lazy');
				self.lazy.attr('data-lazy-loaded', 'false');
				self.scan();
				self.bindEvents();
			},
			scan : function(){
				var len = this.lazy.length;
				for(var i=0;i<len;i++){
					var $elem = $(this.lazy[i]);
					if($elem.attr('data-lazy-loaded') !== 'true' && this.isInView($elem)){
						$elem.attr('data-lazy-loaded', 'true');
						$elem.animate({'opacity':1});
						$elem.removeClass('lazy');
					}
				}
			},
			isInView : function(elem){
				if(!elem.is(':visible')){
					return false;	
				}
				var elemTop = calcTop(elem),
					scrollBottom = $(window).height()+scrollTop(),
					threshold = 0;
				if(elemTop < scrollBottom+threshold){
					return true;
				}
				return false;
		   	},
			bindEvents : function(){
				var self = this;
				eventBridge.on(eventDictionary.global.SCROLL, function(e){
					self.scan();
				});
				$(window).hover('scroll', throttle(function (e) {
					fireScroll = true;
					if (typeof window.webkitRequestAnimationFrame !== 'undefined') {
						requestTick();
					} else {
						eventBridge.trigger(jQuery.Event(eventDictionary.global.SCROLL)/*, metrics*/);
					}
				}, 250));
			}
		};
	};
}(jQuery));
$(document).ready(function(){
	new $.LazyLoadImages().init();
});

});