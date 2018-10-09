$(function(){
	
	var $element = $('.menu-inner');
	if( !$element.length ) return;

	var content;
	var menu;

	$(document).on("main:ready", function(e,data){
		content = data.data.content;
		menu = data.data.menu;
		var $menu_items = $( ".menu-inner__items", $element );

		menu.forEach(function(e) {
			if (e.divider !== undefined){
				$("<li class='menu-inner__item menu-inner__item-line'></li>")
					.appendTo($menu_items)
				;
			}else{
				$('<li class="menu-inner__item" id="' + e.id + '">' + e.text + '</li>')
					.appendTo($menu_items)
				;
			}
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
		
	});
});