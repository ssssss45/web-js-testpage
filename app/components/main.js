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
			switchStaticLanguage();
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




