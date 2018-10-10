$(function(){

var lang;

	var $element = $('.langs');
	if( !$element.length ) return;

	//слушатель на событие готовности
	$(document).on("main:ready", function(e,data){
		langs = data.data.langs;
		lang = data.data.default_lang;

		//установка отображения текущего языка
		$(".langs__current", $element).html(lang);

		//установка слушателя для открытия меню языков
		$element.hover( function(){
			$(this).toggleClass("langs_active");
		});

		var $lang_items = $(".langs__items", $element);

		//заполнение меню языков
		langs.forEach(function(e) {
			var $langSwitch = $('<li class="langs__item">' + e + '</li>').appendTo($lang_items);
			$langSwitch.data("lang",e);
			//слушатель на нажатие на язык в меню языков
			$langSwitch.click(
				function(){
					lang = $(this).data("lang");
					$(".langs__current", $element).html(lang);
					//генерация события переключения языка
					$(document).trigger("language:changed",{
						lang : lang
					});
				})
		});
	});

});