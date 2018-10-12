$(function(){
	var content;
	var lang;
	var currentId;
	var disappearTl;
	var appearTl;

	var head;
	var image;
	var text;

	var $element = $('.inner-part');
	if( !$element.length ) return;

	//слушатель на событие готовности
	$(document).on("main:ready", function(e,data){
		content = data.data.content;
		lang = data.data.default_lang;

		head = $(".inner-part__title", $element);
		image = $(".inner-part__image", $element);
		text = $(".inner-part-column", $element);
		//currentId = data.data.first_id;

		//получение ссылки на шаблон контента
		template = Handlebars.templates['inner_part_template'];

 		/*var duration = 0.3

		appearTl = new TimelineMax();

		appearTl.to($(".inner-part-column", $element), 0, {
					y:20,
					opacity:0})
				.to(image, 0, {
					x:30,
					opacity:0})
				.from(head, duration, {
					opacity:0,
					ease:Sine.easeOut})
				.to($(".inner-part-column", $element), duration, {
					opacity:1,
					y:0,
					ease: Sine.easeOut})
				.to(image, duration, {
					opacity:1,
					x:0,
					ease: Sine.easeOut});

		disappearTl = new TimelineMax({paused:true,
			onStart:function(){
				console.log("disappearTl.onStart", head );
			},
			onComplete:function(){
				console.log("disappearTl.onComplete");
				var item = content[currentId];
				var html = template({head: item.head[lang], content: item.text[lang], image: item.image});
				$element.html(html);
				
				appearTl.restart();
			}
		});

		console.log('>', head );
		disappearTl.to(head, duration, {
						opacity:0,
						ease: Sine.easeIn
					})
					.to(text, duration, {
						opacity:0,
						y:20,
						ease: Sine.easeIn
					})
					.to(image, duration, {
						opacity:0,
						ease: Sine.easeIn,
						x:30
					});*/
		switchContent(0.3, data.data.first_id);
		//timelineContentSwitch(data.data.first_id)
	});

	//слушатель на смену языка
	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		hideContent(0.3, currentId)
	});

	//слушатель на событие смены контента (происходит по нажатию на пункт меню, см. menu-inner)
	$(document).on("menu-inner:switch-content", function(event, data)
		{
			hideContent(0.3, data.id)
			//timelineContentSwitch(data.id)
		});

	function hideContent(duration, data)
	{
		TweenMax.to($(".inner-part__title", $element), duration, {
			opacity:0,
			ease: Sine.easeIn
		});

		TweenMax.to(text, duration, {
			delay: duration * .1,
			opacity:0,
			y:20,
			ease: Sine.easeIn
		});

		TweenMax.to(image, duration, {
			delay: duration * .1 * 2,
			opacity:0,
			ease: Sine.easeIn,
			x:30,
			onComplete:function(){
				switchContent(duration, data)
			}});
	}

	//функция смены контента
	function switchContent(duration, data)
	{
		currentId = data; 
		var item = content[currentId];

		var html = template({head: item.head[lang], content: item.text[lang], image: item.image});
		$element.html(html);

		head = $(".inner-part__title", $element);
		image = $(".inner-part__image", $element);
		text = $(".inner-part-column", $element);

		showContent(0.3);
	}

	function showContent(duration)
	{
		//установка прозрачности текста и картинки на 0 (иначе они появятся до анимации)
		TweenMax.to(text, 0, {
			y:20,
			 opacity:0});
		TweenMax.to(image, 0, {
			x:30,
			 opacity:0});

		//анимации появления элементов
		TweenMax.from(head, duration, {
			opacity:0,
			ease:Sine.easeOut});

		TweenMax.to(text, duration, {
			delay: duration * .1,
			opacity:1,
			y:0,
			ease: Sine.easeOut});

		TweenMax.to(image, duration, {
			delay: duration * .1 * 2,
			opacity:1,
			x:0,
			ease: Sine.easeOut});
	}

	function timelineContentSwitch(data)
	{
		currentId = data; 
		disappearTl.restart();
	}

});