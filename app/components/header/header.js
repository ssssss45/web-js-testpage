$(function(){
	
	var $element = $('header');
	if( !$element.length ) return;

	$(document).on("main:ready", function(e,data){
		$(".header__menu", $element).click(function(){$('.menu-inner').addClass("menu-inner_visible")});
		$(".header__phone").attr("href", data.data.texts.phone_link);
		$(".header__phone").html(data.data.texts.phone);	
	});
});