## iCarousel
* [http://skyvow.github.io/demo/](http://skyvow.github.io/demo/)


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


## options


```js
$('.jq-carousel').iCarousel({
	speed: 3000,       //自动轮播速度
	autoplay: true,    //是否启用自动轮播
	left: '',          //左按钮 可设置为'.jq-carousel .left'
	right: '',         //右按钮 可设置为'.jq-carousel .right'
	dots: true,        //是否启用标识
	keys: false,       //是否启用键盘
	swipe: false,      //是否启用手势
	wheel: false,      //是否启用鼠标滚轮
	easing: 'swing',   //动画曲线，可选用jquery.easing.min.js类库
	duration: 600,     //动画延迟
	callback: ''       //动画执行完毕后的回调函数
});
```