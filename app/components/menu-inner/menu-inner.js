$(function(){
	
	var $element = $('.menu-inner');
	if( !$element.length ) return;

	var menu;
	var lang;

	$(document).on("main:ready", function(e,data){

		//получение содержимого меню и текстов
		menu = data.data.menu;
		texts = data.data.texts;
		var $menu_items = $( ".menu-inner__items", $element );
		lang = data.data.default_lang;

		//заполнение меню
		menu.forEach(function(e) {
			//добавление пунктов меню
			if (e.divider !== undefined){
				$("<li class='menu-inner__item menu-inner__item-line'></li>")
					.appendTo($menu_items)
				;
			}else{
				//	обавление разделителей
				$('<li class="menu-inner__item" id="' + e.id + '">' + e[lang] + '</li>')
					.appendTo($menu_items)
				;
			}
		});

		//событие на нажатие кнопки закрытия меню
		$(".menu-inner__button-close", $element)
			.click(function(){
				$('.menu-inner').removeClass("menu-inner_visible");
			})
		;

		//слушатель нажатия на пункт меню
		$menu_items.click(function(event)
		{
			var page_id = event.target.id;
			if( !page_id ) return;

			//убирание класса с предыдущей выделенной кнопки
			$('.menu-inner__item_choosed', $element).removeClass('menu-inner__item_choosed');
			//установка класса на выделенную кнопку
			$('#' + page_id, $element).addClass('menu-inner__item_choosed');

			//событие нажатия на пункт меню (ловится в inner-part для смены контента)
			$(document).trigger("menu-inner:switch-content",{
				id : page_id
			});
		});
		switchBottomTexts();
	});

	//слушатель на событие нажатия кнопки открытия меню
	$(document).on("menu:open", function(e,data){
		$element.addClass("menu-inner_visible")
	});

	//слушатель на событие смены языка
	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		menu.forEach(function(e) {
			$("#" + e.id, $element).html(e[lang]);
		});

		switchBottomTexts();
	});

	//функция смены текстов (подписи ссылки на скачивание и копирайта)
	function switchBottomTexts()
	{
		$(".menu-inner__footer-text", $element).html(texts.copyright[lang]);
		$(".menu-inner__download-button-text", $element).html(texts.download_link_text[lang])
	}
});