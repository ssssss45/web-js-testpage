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

		//получение ссылки на шаблон контента
		template = Handlebars.templates['inner_part_template'];

		switchContent(data.data.first_id);
	});

	//слушатель на смену языка
	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		switchContent( currentId);
	});

	//слушатель на событие смены контента (происходит по нажатию на пункт меню, см. menu-inner)
	$(document).on("menu-inner:switch-content", function(event, data)
		{
			switchContent(data.id)
		});

	//функция смены контента
	function switchContent(data)
	{
		currentId = data; 
		var item = content[currentId];

		//заполнение шаблона содержимым
		var html = template({head: item.head[lang], content: item.text[lang], image: item.image});
		$(".inner-part").html(html);
	}
});