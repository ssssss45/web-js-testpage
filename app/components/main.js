$(function(){

	var texts;
	var currentLang;
	var path = "../assets/data.json";
	var router;
	var first;
	var currentId;
	var default_lang;

	//считывание json и создание события готовности
	$.getJSON(path)
		.done(function(json)
		{
			$(document).trigger("main:ready",{
				data: json
			});

			texts = json.texts;
			currentLang = default_lang = json.default_lang;
			currentId = first = json.first_id;

			//первоначальаня установка текстов
			switchStaticLanguage();

			//первоначальная установка класса body
			setBodyClass();

			//установка слушателя на ресайз для изменения класса body
			$( window ).resize(setBodyClass);

			var menu = json.menu;
			router = new Navigo(null, true, '#!');
			var routerParams = {};

			router
			  .on({
			  	':lang/:page_name': function (params) {
			    	generateSwitchEvent(params.page_name, params.lang)
				},
				':page_name': function (params) {
			    	generateSwitchEvent(params.page_name, default_lang)
				}
			  })
			;

			//переключение на страницу по ссылке или на страницу по умолчанию если ссылка пуста
			if (!(router.resolve()))
			{
				generateSwitchEvent(first, currentLang);
			}
			
			//генерация события смены контента
			function generateSwitchEvent(id, lang)
			{
				currentId = id;
				//смена языка если пришёл новый язык
				if (currentLang != lang)
				{
					currentLang = lang
					switchStaticLanguage();
				}

				$(document).trigger("router:switch-content",{
						id : id,
						lang : lang
					})
				;
			}

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
			router.navigate(data.lang + '/' + currentId);
		});

		//слушатель на событие переключения  языка
		$(document).on("menu-inner:navigate", function(e,data){
			router.navigate(data.link);
		});

		//функция переключения языка
		function switchStaticLanguage()
		{
			var items = $("[data-trnslt]");

			for(var i = 0; i < items.length; i++)
			{
				var $item = $(items[i]);
				$item.empty().html(texts[$item.data("trnslt")][currentLang]);
			}
		}
});




