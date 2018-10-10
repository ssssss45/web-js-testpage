$(function(){
	var content;
	var lang;
	var currentId;

	var $element = $('.inner-part');
	if( !$element.length ) return;

	//слушатель на событие готовности
	$(document).on("main:ready", function(e,data){
		content = data.data.content;
		lang = data.data.default_lang;
		switchContent(undefined, data.data.first_id);
	});

	//слушатель на смену языка
	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		switchContent(undefined, currentId);
	});

	//слушатель на событие смены контента (происходит по нажатию на пункт меню, см. menu-inner)
	$(document).on("menu-inner:switch-content", switchContent)

	//функция смены контента
	function switchContent(event, data)
	{
		//проверка на то что смена произошла событием (а не при готовности или смене языка)
		currentId = data.id;
		if (event == undefined)
		{
			currentId = data; 
		}

		var item = content[currentId];

		$(".inner-part__title", $element).html(item.head[lang])
		$(".inner-part__image > img", $element).attr('src', item.image);
		$(".inner-part-column", $element).html(item.text[lang])
	}
});