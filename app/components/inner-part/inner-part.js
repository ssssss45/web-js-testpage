$(function(){
	var content;

	var $element = $('.inner-part');
	if( !$element.length ) return;

	$(document).on("main:ready", function(e,data){
		content = data.data.content;
		switchContent(undefined, content.first_id);
	});

	$(document).on("menu-inner:switch-content", switchContent)

	function switchContent(event,data)
	{
		var id = data.id;
		if (event == undefined)
		{
			id = data; 
		}

		$(".inner-part__title", $element).html(content[id].head)
		$(".inner-part__image > img", $element).attr('src', content[id].image);
		$(".inner-part-column", $element).html(content[id].text)
	}
});