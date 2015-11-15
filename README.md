## iCarousel
* 轮播方向：水平方向、垂直方向
* [http://skyvow.github.io/iCarousel/demo/](http://skyvow.github.io/iCarousel/demo/)


## HTML


```html
<div class="jq-carousel">
	<div class="item"><img src="images/1.jpg" alt=""></div>
	<div class="item"><img src="images/2.jpg" alt=""></div>
	<div class="item"><img src="images/3.jpg" alt=""></div>
	<div class="item"><img src="images/4.jpg" alt=""></div>
	<a class="left carousel-control"><span class="glyphicon glyphicon-chevron-left"></span></a>
	<a class="right carousel-control"><span class="glyphicon glyphicon-chevron-right"></span></a>
</div>
```

## DATA
* data-icarousel、data-icarouse-speed、data-icarouse-swipe、data-icarouse-wheel
* data-icarousel启动插件及配置其他参数


```html
<div class="jq-carousel" data-icarousel data-icarouse-speed="3000" data-icarouse-swipe="true" data-icarouse-wheel="true">
	<div class="item"><img src="images/1.jpg" alt=""></div>
	<div class="item"><img src="images/2.jpg" alt=""></div>
	<div class="item"><img src="images/3.jpg" alt=""></div>
	<div class="item"><img src="images/4.jpg" alt=""></div>
	<a class="left carousel-control"><span class="glyphicon glyphicon-chevron-left"></span></a>
	<a class="right carousel-control"><span class="glyphicon glyphicon-chevron-right"></span></a>
</div>
```


## options


```js
$('.jq-carousel').iCarousel({
	direction: 0,	   //轮播方向,0表示水平方向,1表示垂直方向
	speed: 3000,       //自动轮播速度
	autoplay: true,    //是否启用自动轮播
	left: '',          //左按钮 可设置为'.jq-carousel .left'
	right: '',         //右按钮 可设置为'.jq-carousel .right'
	dots: true,        //是否启用标识
	keys: false,       //是否启用键盘
	swipe: false,      //是否启用手势
	wheel: false,      //是否启用鼠标滚轮
	callback: ''       //动画执行完毕后的回调函数，接受第一个参数为当前元素索引值
});
```