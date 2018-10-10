$(function(){

	var path = "../assets/data.json";
	//считывание json и создание события готовности
	$.getJSON(path)
		.done(function(json)
		{
			$(document).trigger("main:ready",{
				data: json
			});
		});	
});




