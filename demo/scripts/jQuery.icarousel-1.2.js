/**
 * .jq-carousel {
 *   position: relative;
 *   width: 100%;
 *   overflow: hidden;
 * }
 * .jq-carousel:before, .jq-carousel:after {
 *   content: "";
 *   display: table;
 * }
 * .jq-carousel:after {
 *   clear: both;
 * }
 * .jq-carousel .item {
 *   position: relative;
 *   display: none;
 *   width: 100%;
 * }
 * .jq-carousel .item.active {
 *   display: block;
 * }
 * .jq-carousel .item.left {
 *   position: absolute;
 *   display: block;
 *   top: 0;
 *   left: 100%;
 * }
 * .jq-carousel .item.right {
 *   position: absolute;
 *   display: block;
 *   top: 0;
 *   left: -100%;
 * }
 * .jq-carousel .item > img {
 *   display: block;
 *   width: 100%;
 * }
 * /

/**
 * <div class="container">
 * 	<div class="jq-carousel">
 * 		<div class="item"><img src="images/1.jpg" alt=""></div>
 * 		<div class="item"><img src="images/2.jpg" alt=""></div>
 * 		<div class="item"><img src="images/3.jpg" alt=""></div>
 * 		<div class="item"><img src="images/4.jpg" alt=""></div>
 * 		<a class="left carousel-control"><span class="glyphicon glyphicon-chevron-left"></span></a>
 * 		<a class="right carousel-control"><span class="glyphicon glyphicon-chevron-right"></span></a>
 * 	</div>
 * </div>
 */

/**
 * $('.jq-carousel').iCarousel({
 *		speed: 3000,
 *		autoplay: true,
 *		dots: true,
 *		keys: false,
 *		swipe: false,
 *		wheel: false,
 *		easing: 'swing',
 *		duration: 600,
 *		callback: ''
 *	});
 */

;(function($){

	function ICarousel(element, options) {
		this.settings = $.extend({}, $.fn.iCarousel.defaults, options);
		this.element = element;

		this.init();
	}

	ICarousel.prototype = {
		init: function() {
			var me = this;
			me.left     = me.settings.left === '' ? me.element.find('.left') : $(me.settings.left);
			me.right    = me.settings.right === '' ? me.element.find('.right') : $(me.settings.right);
			me.item     = me.element.find('.item');
			me.len      = me.itemLength();
			me.index    = 0;
			me.interval = null;
			me.sliding  = true;

			if (me.settings.dots) {
				me._initPaging();
			}

			me.item.eq(0).addClass('active').siblings().removeClass('active');

			me._initEvent();
		},
		itemLength: function() {
			return this.item.length;
		},
		_initPaging: function() {
			var me = this;
			var indicators = $('<ol class="carousel-indicators"></ol>');
			for (var i = 0; i < me.len; i++) {
				indicators.append('<li class="indicator" data-slide-to=' + i + '></li>');
			}
			indicators.appendTo(me.element);
			me.indicator = me.element.find('.indicator');
			me.indicator.eq(0).addClass('active').siblings().removeClass('active');
		},
		_next: function() {
			var me = this;
			$active = me.item.eq(me.index);
			me.index = me.index === me.len - 1 ? 0 : me.index + 1;
			$next = me.item.eq(me.index);

			me._scrollPage($next, 'left');
		},
		_prev: function() {
			var me = this;
			$active = me.item.eq(me.index);
			me.index = me.index === 0 ? me.len - 1 : me.index - 1;
			$prev = me.item.eq(me.index);

			me._scrollPage($prev, 'right');
		},
		_scrollPage: function(page, pageClass) {
			var me = this;
			var sign = pageClass === 'left' ? '-' : '+';
			page.addClass(pageClass).animate({'left': 0}, me.settings.duration, me.settings.easing, function(){
				me.sliding = true;
				$(this).removeClass(pageClass).removeAttr('style').addClass('active');
				if (me.settings.callback && $.type(me.settings.callback) === 'function') {
					me.settings.callback();
				}
			});
			$active.animate({'left': sign + '100%'}, me.settings.duration, me.settings.easing, function(){
				$(this).removeClass('active').removeAttr('style');
			});

			if (me.settings.dots) {
				me.indicator.eq(me.index).addClass('active').siblings().removeClass('active');
			}
		},
		_initEvent: function() {
			var me = this;

			function resetTimer() {
				if (me.interval) {
					clearInterval(me.interval);
					me.interval = null;
				}
			}

			function restartTimer() {
				resetTimer();
				me.interval = setInterval(function(){ 
					me._next();
				}, me.settings.speed);
			}

			me.left.on('click', function(){
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false;
					resetTimer();
					me._prev();
				}
			});

			me.right.on('click', function(){
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false;
					resetTimer();
					me._next();
				}
			});

			if (me.settings.autoplay) {
				me.element.on({
					'mouseenter': resetTimer,
					'mouseleave': restartTimer
				}).trigger('mouseleave');
			}

			if (me.settings.dots) { 
				me.indicator.on('click', function(){
					var slideTo = $(this).data('slide-to');
					var pageClass = me.index < slideTo ? 'left' : 'right';

					if (me.index == slideTo) return false;

					$active = me.item.eq(me.index);
					$next = me.item.eq(slideTo);
					me.index = slideTo;

					me._scrollPage($next, pageClass);
				});
				
			}

			if (me.settings.keys) {
				$(document).keydown(function(e) {
					switch(e.which) {
						case 37:
							me.left.trigger('click');
							break;
						case 39:
							me.right.trigger('click'); 
							break;
						case 27:
							resetTimer(); 
							break;
					}

					if (me.settings.autoplay) restartTimer();
				});
			}

			if (me.settings.swipe) {
				var startX, moveX, endX;
				me.element.on({
					'touchstart': function(event) {
						resetTimer();
						startX = event.originalEvent.changedTouches[0].clientX;
					},
					'touchmove': function(event) {
						event.preventDefault();
					},
					'touchend': function(event) {
						endX = event.originalEvent.changedTouches[0].clientX;
						moveX = startX - endX;

						if (moveX < -50) me.left.trigger('click');
						if (moveX > 50) me.right.trigger('click');

						if (me.settings.autoplay) restartTimer();
					}
				});
			}

			if (me.settings.wheel) {
				me.element.on('mousewheel DOMMouseScroll', function(event){
					event.preventDefault();
					var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
					if (delta<0) me.right.trigger('click');
					if (delta>0) me.left.trigger('click');

					if (me.settings.autoplay) restartTimer();
				});
			}

		} 
	};


	$.fn.iCarousel = function(options) {
		return this.each(function(){
			var me = $(this),
				instance = me.data('ICarousel');

			if (!instance) {
				instance = new ICarousel(me, options);
				me.data('ICarousel', instance);
			}

			if ($.type(options)==='string') return instance[options]();
		});
	};

	$.fn.iCarousel.defaults = {
		speed: 3000,
		autoplay: true,
		left: '',
		right: '',
		dots: true,
		keys: false,
		swipe: false,
		wheel: false,
		easing: 'swing',
		duration: 600,
		callback: ''
	};

})(jQuery);