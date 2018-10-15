$(function(){
	
	var $element = $('.menu-inner');
	if( !$element.length ) return;

	var menu;
	var lang;

	$(document).on("main:ready", function(e,data){

		//получение содержимого меню и текстов
		menu = data.data.menu;
		texts = data.data.texts;
		first = data.data.first_id;

		var $menu_items = $( ".menu-inner__items", $element );

		lang = data.data.default_lang;	

		//заполнение меню
		menu.forEach(function(e) {
			//добавление разделителей
			if (e.divider !== undefined){
				$("<li class='menu-inner__item menu-inner__item-line'></li>")
					.appendTo($menu_items)
				;
			}
			else
			{
				//добавление пунктов меню
				$('<li class="menu-inner__item" id="' + e.id + '">' + e.text[lang] + '</li>')
					.appendTo($menu_items)
					.click(function(){
						$(document).trigger("menu-inner:navigate",{
							link: lang + '/' + e.id,
							id: e.id
						});
					})
				;
			}
		});

		//событие на нажатие кнопки закрытия меню
		$(".menu-inner__button-close", $element)
			.click(function(){
				$('.menu-inner').removeClass("menu-inner_visible");
			})
		;
	});

	//слушатель на событие нажатия кнопки открытия меню
	$(document).on("menu:open", function(e,data){
		$element.addClass("menu-inner_visible")
	});

	//слушатель на событие переключения пункта меню
	$(document).on("router:switch-content", function(e,data){
		//убирание класса с предыдущей выделенной кнопки
		$('.menu-inner__item_choosed').removeClass('menu-inner__item_choosed');
		//установка класса на выделенную кнопку
		$('#' + data.id).addClass('menu-inner__item_choosed');
	});

	$(document).on("router:switch-content", function(e,data){
		if (lang != data.lang)
		{
			lang = data.lang;
			switchMenuLang();
		}
	});

	function switchMenuLang(data)
	{
		menu.forEach(function(e) {
		if (e.divider == undefined)
		{
			$("#" + e.id, $element).html(e.text[lang]);
		}
		});
	}
});