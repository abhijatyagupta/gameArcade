sessionStorage.setItem("firstLoadMinesweeper", "true");
$(".selectedGame").eq(1).css("visibility", "hidden");


$(document).ready(function() {
	$(document).keydown(function(e) {
		if(e.keyCode == 38 || e.keyCode == 40) {
			if($(".selectedGame").eq(1).css("visibility") == "hidden") {
				$(".selectedGame").eq(0).css("visibility", "hidden");
				$(".selectedGame").eq(1).css("visibility", "visible");
			}
			else {
				$(".selectedGame").eq(1).css("visibility", "hidden");
				$(".selectedGame").eq(0).css("visibility", "visible");
			}
		}
		else if (e.keyCode == 13) {
			if($(".selectedGame").eq(0).css("visibility") == "visible") {
				//window.open(LUDO HTML URL GOES HERE);
			}
			else {
				window.open("minesweeper/algoUI.html");
			}
		}
	});
});