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

		//初始化函数
		this.init();
	}

	ICarousel.prototype = {
		init: function() {
			var me = this; //缓存当前this对象
			me.left     = me.settings.left === '' ? me.element.find('.left') : $(me.settings.left); //默认left方向按钮
			me.right    = me.settings.right === '' ? me.element.find('.right') : $(me.settings.right); //默认right方向按钮
			me.item     = me.element.find('.item'); //设置元素
			me.len      = me.itemLength(); //设置元素长度
			me.index    = 0; //缓存计时器
			me.interval = null; //缓存计时标识
			me.sliding  = true; //缓存自定义锁，防止多次操作 例如：轮播还未结束，再次点击造成BUG。

			//如果启用dots，则执行_initPaging函数
			if (me.settings.dots) {
				me._initPaging();
			}

			//如果启用插件，默认显示第一个元素
			me.item.eq(0).addClass('active').siblings().removeClass('active');

			//如果callback为true，调用apply方法传入当前元素索引值，并执行一次回调
			if (me.settings.callback && $.type(me.settings.callback) === 'function') {
				me.settings.callback.apply(me, [me.index]);
			}

			//调用主体事件函数
			me._initEvent();
		},
		/* 获取元素长度 */
		itemLength: function() {
			return this.item.length;
		},
		/* 动态生成dots */
		_initPaging: function() {
			var me = this;
			var indicators = $('<ol class="carousel-indicators"></ol>');
			for (var i = 0; i < me.len; i++) {
				indicators.append('<li class="indicator" data-slide-to=' + i + '></li>');
			}
			indicators.appendTo(me.element);
			me.indicator = me.element.find('.indicator');

			//默认激活第一个dots
			me._onDots(0);
		},
		/* 点击dots轮播函数 */
		_onDots: function(index) {
			var me = this;
			me.indicator.eq(index).addClass('active').siblings().removeClass('active');
		},
		/* 下一页轮播函数 */
		_next: function() {
			var me = this;
			$active = me.item.eq(me.index);
			me.index = me.index === me.len - 1 ? 0 : me.index + 1;
			$next = me.item.eq(me.index);

			me._scrollPage($next, 'left');
		},
		/* 上一页轮播函数 */
		_prev: function() {
			var me = this;
			$active = me.item.eq(me.index);
			me.index = me.index === 0 ? me.len - 1 : me.index - 1;
			$prev = me.item.eq(me.index);

			me._scrollPage($prev, 'right');
		},
		/* 元素轮播事件 */
		_scrollPage: function(page, pageClass) {
			var me = this;
			var sign = pageClass === 'left' ? '-' : '+';
			page.addClass(pageClass).animate({'left': 0}, me.settings.duration, me.settings.easing, function(){
				me.sliding = true; //解锁
				$(this).removeClass(pageClass).removeAttr('style').addClass('active');
				if (me.settings.callback && $.type(me.settings.callback) === 'function') {
					me.settings.callback.apply(me, [me.index]);
				}
			});
			$active.animate({'left': sign + '100%'}, me.settings.duration, me.settings.easing, function(){
				$(this).removeClass('active').removeAttr('style');
			});

			//如果dots为true，调用_onDots方法
			if (me.settings.dots) {
				me._onDots(me.index);
			}
		},
		/* 元素主体事件函数 */
		_initEvent: function() {
			var me = this;

			/* 清除计时器标识 */
			function resetTimer() {
				if (me.interval) {
					clearInterval(me.interval);
					me.interval = null;
				}
			}

			/* 设置计时器标识 */
			function restartTimer() {
				resetTimer();
				me.interval = setInterval(function(){ 
					me._next();
				}, me.settings.speed);
			}

			/* 向前轮播事件 */
			me.left.on('click', function(){
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false; //上锁
					resetTimer();      //清楚计时器标识
					me._prev();
				}
			});

			/* 向后轮播事件 */
			me.right.on('click', function(){
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false; //上锁
					resetTimer();      //清楚计时器标识
					me._next();
				}
			});

			/* 如果autoplay为true，则启用自动轮播事件 */
			if (me.settings.autoplay) {
				me.element.on({
					'mouseenter': resetTimer,
					'mouseleave': restartTimer
				}).trigger('mouseleave');
			}

			/* 如果dots为true，则启用dots点击轮播事件 */
			if (me.settings.dots) { 
				me.indicator.on('click', function(){
					var slideTo = $(this).data('slide-to');
					var pageClass = me.index < slideTo ? 'left' : 'right'; //点击dots时，判断轮播方向

					if (me.index == slideTo) return false; 

					$active = me.item.eq(me.index);
					$next = me.item.eq(slideTo);
					me.index = slideTo;

					me._scrollPage($next, pageClass);
				});
				
			}

			/* 如果keys为true，则启用keys点击轮播事件 （左右方向键） */
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

					/* 如果autoplay为true，则启用自动轮播事件 */
					if (me.settings.autoplay) restartTimer();
				});
			}

			/* 如果swipe为true，则启用swipe滑动轮播事件 （左右方向） */
			if (me.settings.swipe) {
				var startX, moveX, endX; //触摸起始位置、移动距离、结束位置
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

						/* 如果autoplay为true，则启用自动轮播事件 */
						if (me.settings.autoplay) restartTimer();
					}
				});
			}

			/* 如果wheel为true，则启用wheel鼠标滚轮轮播事件 （上下方向） */
			if (me.settings.wheel) {
				me.element.on('mousewheel DOMMouseScroll', function(event){
					event.preventDefault();
					var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
					if (delta<0) me.right.trigger('click');
					if (delta>0) me.left.trigger('click');

					/* 如果autoplay为true，则启用自动轮播事件 */
					if (me.settings.autoplay) restartTimer();
				});
			}

		} 
	};

	/* 缓存实例对象 */
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

	/* 设置可选参数 */
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