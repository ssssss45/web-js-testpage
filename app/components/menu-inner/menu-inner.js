$(function(){
	
	var $element = $('.menu-inner');
	if( !$element.length ) return;

	var content;
	var menu;
	var lang;

	$(document).on("main:ready", function(e,data){

		content = data.data.content;
		menu = data.data.menu;
		texts = data.data.texts;
		var $menu_items = $( ".menu-inner__items", $element );
		lang = data.data.default_lang;

		menu.forEach(function(e) {
			if (e.divider !== undefined){
				$("<li class='menu-inner__item menu-inner__item-line'></li>")
					.appendTo($menu_items)
				;
			}else{
				$('<li class="menu-inner__item" id="' + e.id + '">' + e[lang] + '</li>')
					.appendTo($menu_items)
				;
			}

			$(".menu-inner__button-close", $element)
				.click(function(){
					$('.menu-inner').removeClass("menu-inner_visible");
				})
			;

		});

		$menu_items.click(function(event)
		{
			var page_id = event.target.id;
			if( !page_id ) return;

			$('.menu-inner__item_choosed', $element).removeClass('menu-inner__item_choosed');
			$('#' + page_id, $element).addClass('menu-inner__item_choosed');

			$(document).trigger("menu-inner:switch-content",{
				id : page_id
			});
		});
		switchBottomTexts();
	});

	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		menu.forEach(function(e) {
			if (e.divider == undefined)
			{
				$("#" + e.id, $element).html(e[lang]);
			}
		});

		switchBottomTexts();
	});

	function switchBottomTexts()
	{
		$(".menu-inner__footer-text", $element).html(texts[lang].copyright);
		$(".menu-inner__download-button-text", $element).html(texts[lang].download_link_text)
	}
});