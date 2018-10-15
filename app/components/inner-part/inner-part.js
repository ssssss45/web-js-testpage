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

		//получение ссылки на шаблон контента
		template = Handlebars.templates['inner_part_template'];
	});

	//слушатель на событие смены контента (происходит по нажатию на пункт меню, см. menu-inner)
	$(document).on("router:switch-content", function(event, data)
		{
			if (lang != data.lang)
			{
				lang = data.lang;	
			}
			
			hideContent(0.3, data.id)
		});

	function hideContent(duration, data)
	{
		//проверка на наличие объектов для анимации (при открытии страницы)
		if (head.length != 0)
		{
			TweenMax.to(head, duration, {
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
		else
		{
			switchContent(duration, data);
		}
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
});