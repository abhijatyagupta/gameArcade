$(document).ready(function() {
	$("ul li:last-child").on("click", function() {
		$(".menu-container, .head-container p").animate({
			marginLeft: '200%'
		}, 1000);
	});
});