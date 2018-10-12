$(function(){

	var texts;
	var lang;
	var path = "../assets/data.json";
	//считывание json и создание события готовности
	$.getJSON(path)
		.done(function(json)
		{
			$(document).trigger("main:ready",{
				data: json
			});

			texts = json.texts;
			lang = json.default_lang;

			//первоначальаня установка текстов
			switchStaticLanguage();

			//первоначальная установка класса body
			setBodyClass();

			//установка слушателя на ресайз для изменения класса body
			$( window ).resize(setBodyClass);

			function setBodyClass()
			{
				var width = window.innerWidth;
				
				$("body")
					.toggleClass("is_phone", width < 768 )
					.toggleClass("is_tablet", width >= 768 && width < 1024 )
					.toggleClass("is_desktop", width >= 1024 )
				;
				
			}
		});	

		//слушатель на событие переключения  языка
		$(document).on("language:changed", function(e,data){
			lang = data.lang;
			switchStaticLanguage();
		});

		//функция переключения языка
		function switchStaticLanguage()
		{
			var items = $("[data-trnslt]");

			for(var i = 0; i < items.length; i++)
			{
				var $item = $(items[i]);
				$item.empty().html(texts[$item.data("trnslt")][lang]);
			}
		}


});




