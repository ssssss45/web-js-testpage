$(function(){
	
	var $element = $('header');
	if( !$element.length ) return;

	//слушатель на событие готовности
	$(document).on("main:ready", function(e,data){
		//генерация события по нажатия на кнопку открытия меню
		$(".header__menu", $element).click(function()
			{
				$(document).trigger("menu:open");
			});
		//установка текста и ссылки телефона
		$(".header__phone").attr("href", data.data.texts.phone_link);
		$(".header__phone").html(data.data.texts.phone);	
	});
});