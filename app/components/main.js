$(function(){

	var path = "../assets/data.json";

	$.getJSON(path)
		.done(function(json)
		{
			$(document).trigger("main:ready",{
				data: json
			});
		});	
});




