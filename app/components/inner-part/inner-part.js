$(function(){
	var content;
	var lang;
	var currentId;

	var $element = $('.inner-part');
	if( !$element.length ) return;

	$(document).on("main:ready", function(e,data){
		content = data.data.content;
		lang = data.data.default_lang;
		switchContent(undefined, data.data.first_id);
	});

	$(document).on("language:changed", function(e,data){
		lang = data.lang;
		switchContent(undefined, currentId);
	});

	$(document).on("menu-inner:switch-content", switchContent)

	function switchContent(event,data)
	{
		currentId = data.id;
		if (event == undefined)
		{
			currentId = data; 
		}

		var item = content[currentId];

		$(".inner-part__title", $element).html(item[lang].head)
		$(".inner-part__image > img", $element).attr('src', item.image);
		$(".inner-part-column", $element).html(item[lang].text)
	}
});