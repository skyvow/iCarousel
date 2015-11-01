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
 *		callback: ''
 *	});
 */
+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

!function($){

	function ICarousel(element, options) {
		this.settings = $.extend({}, $.fn.iCarousel.defaults, options);
		this.element = element;

		//初始化函数
		this.init();
	}

	ICarousel.prototype = {
		init: function() {
			var me = this; //缓存当前this对象
			me.item     = me.element.find('.item'); //设置元素
			me.len      = me.itemLength(); //设置元素长度
			me.interval = null; //缓存计时标识
			me.sliding  = true; //缓存自定义锁，防止多次操作 例如：轮播还未结束，再次点击造成BUG。

			if (me.settings.left !== '') me.left = $(me.settings.left); //若left不为空，则缓存$(left)
			if (me.settings.right !== '') me.right = $(me.settings.right); //若right不为空，则缓存$(right)

			//如果启用dots，则执行_initPaging函数
			me.settings.dots && me._initPaging();

			//如果启用插件，默认显示第一个元素
			me.item.eq(0).addClass('active').siblings().removeClass('active');

			//如果callback为true，调用apply方法传入当前元素索引值，并执行一次回调
			(me.settings.callback && $.type(me.settings.callback) === 'function') && me.settings.callback.apply(me, [0, me]);

			//调用主体事件函数
			me._initEvent();
			return this;
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
			return this;
		},
		/* 点击dots轮播函数 */
		_onDots: function(index) {
			return this.indicator.eq(index).addClass('active').siblings().removeClass('active');
		},
		/* 下一页轮播函数 */
		_next: function() {
			return this._scrollPage('next')
		},
		/* 上一页轮播函数 */
		_prev: function() {
			return this._scrollPage('prev')
		},
		/* 获取元素索引值 */
		_getItemIndex: function (item) {
			this.item = item.parent().children('.item')
			return this.item.index(item)
		},
		/* 判断轮播方向，返回下一个元素 */
		_getItemForDirection: function(direction, active) {
			var activeIndex = this._getItemIndex(active),
		    	delta 		= direction == 'prev' ? -1 : 1,
		    	itemIndex 	= (activeIndex + delta) % this.len;
		    return this.item.eq(itemIndex);
		},
		/* 元素轮播事件 */
		_scrollPage: function(type, next) {
			var me 		  = this;
			var $active   = me.element.find('.item.active');
			var $next 	  = next || me._getItemForDirection(type, $active);
			var direction = type == 'next' ? 'left' : 'right';

			var relatedTarget = $next[0];
			var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction });
			var index = me._getItemIndex($next);

			me.settings.dots && me._onDots(index);

			if ($.support.transition) {
				$next.addClass(type);
				$next[0].offsetWidth;
				$next.add($active).addClass(direction);

				$active.one('bsTransitionEnd', function () {
					me.sliding = true; //解锁
					$next.removeClass([type, direction].join(' ')).addClass('active');
					$active.removeClass(['active', direction].join(' '));
					(me.settings.callback && $.type(me.settings.callback) === 'function') && me.settings.callback.apply(me, [index, me]);
					setTimeout(function () {
						me.element.trigger(slidEvent);
					}, 0);
				}).emulateTransitionEnd(600);
			} else {
				me.sliding = true; //解锁
				$next.addClass('active');
				$active.removeClass('active');
				(me.settings.callback && $.type(me.settings.callback) === 'function') && me.settings.callback.apply(me, [index, me]);
				me.element.trigger(slidEvent);
			}
			return this;
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
				}, me.element.data("icarousel-speed") || me.settings.speed);
			}

			/* 向前轮播函数 */
			function prev() {
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false; //上锁
					resetTimer();      //清楚计时器标识
					me._prev();
				}
			}

			/* 向后轮播函数 */
			function next() {
				if(me.item.is(":animated")) return false;
				if (me.sliding) {
					me.sliding = false; //上锁
					resetTimer();      //清楚计时器标识
					me._next();
				}
			}


			/* dots点击轮播事件 */
			function dots(){
				me.indicator.on('click', function(){
					var slideTo 	  = $(this).data('slide-to'), //获取点击dots索引值
						activeSlideTo = me.element.find('.indicator.active').index(), //获取当前dots索引值
						direction 	  = slideTo > activeSlideTo ? 'next' : 'prev', //判断轮播方向
						next          = me.item.eq(slideTo);
					
					if(slideTo==activeSlideTo) return false;

					if (me.sliding) {
						me.sliding = false;
						(slideTo !== activeSlideTo) && me._scrollPage(direction, next);
					}
				});
			}


			/* keys点击轮播事件 */
			function keydownFn() {
				$(document).keydown(function(event) {
					if (/input|textarea/i.test(event.target.tagName)) return;

					switch(event.which) {
						case 37:
							prev(); 
							break;
						case 39:
							next(); 
							break;
						case 27:
							resetTimer(); 
							break;
					}

					/* 如果autoplay为true，则启用自动轮播事件 */
					me.settings.autoplay && restartTimer();
				});
			}

			/* swipe滑动轮播事件 */
			function swipeFn() {
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

						(moveX < -80) && prev();
						(moveX > 80) && next();

						/* 如果autoplay为true，则启用自动轮播事件 */
						me.settings.autoplay && restartTimer();
					}
				});
			}

			/* wheel鼠标滚轮轮播事件 */
			function wheelFn() {
				me.element.on('mousewheel DOMMouseScroll', function(event){
					event.preventDefault();
					var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
					(delta<0) && next();
					(delta>0) && prev();

					/* 如果autoplay为true，则启用自动轮播事件 */
					me.settings.autoplay && restartTimer();
				});
			}

			/* left存在时，注册向前轮播点击事件 */
			(me.settings.left !== '') && me.left.on('click', prev);

			/* right存在时，注册向后轮播点击事件 */
			(me.settings.right !== '') && me.right.on('click', next);

			/* 如果autoplay为true，则启用自动轮播事件 */
			me.settings.autoplay && me.element.on({'mouseenter': resetTimer, 'mouseleave': restartTimer}).trigger('mouseleave');

			/* 如果dots为true，则启用dots点击轮播事件 */
			me.settings.dots && me.indicator.on('click', dots);
				
			/* 如果keys为true，则启用keys点击轮播事件 （左右方向键） */
			me.settings.keys && keydownFn();

			/* 如果swipe为true，则启用swipe滑动轮播事件 （左右方向） */
			(me.element.data("icarousel-swipe") || me.settings.swipe) && swipeFn();

			/* 如果wheel为true，则启用wheel鼠标滚轮轮播事件 （上下方向） */
			(me.element.data("icarousel-wheel") || me.settings.wheel) && wheelFn();

			return this;	
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
		speed: 3000,       //自动轮播速度
		autoplay: true,    //是否启用自动轮播
		left: '',          //左按钮 可设置为'.jq-carousel .left'
		right: '',         //右按钮 可设置为'.jq-carousel .right'
		dots: true,        //是否启用标识
		keys: false,       //是否启用键盘
		swipe: false,      //是否启用手势
		wheel: false,      //是否启用鼠标滚轮
		callback: ''       //动画执行完毕后的回调函数，接受第一个参数为当前元素索引值，第二个参数为当前对象
	};

}(jQuery);

$(function(){
	$("[data-icarousel]").iCarousel();
});