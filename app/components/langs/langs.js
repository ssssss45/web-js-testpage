$(function(){

var lang;

	var $element = $('.langs');
	if( !$element.length ) return;

	$(document).on("main:ready", function(e,data){
		langs = data.data.langs;
		lang = data.data.default_lang;
		$(".langs__current", $element).html(lang);
		$element.hover( function(){
			$(this).toggleClass("langs_active")
		});


		var $lang_items = $(".langs__items", $element);

		langs.forEach(function(e) {
			var $langSwitch = $('<li class="langs__item">' + e + '</li>').appendTo($lang_items)
			$langSwitch.data("lang",e)
			$langSwitch.click(
				function(){
					lang = $(this).data("lang");
					$(".langs__current", $element).html(lang);
					$(document).trigger("language:changed",{
						lang : lang
					});
				})
		});
	});

});