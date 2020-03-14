//declaration of necessary variables
var difficulty = "easy";
var totalMines;
var side1;
var side2;

//this initializes necessary variables according to the difficulty
if(difficulty = "easy") {
	totalMines = 10;
	side1 = 9;
	side2 = 9;
}															//add more ifs for other difficulties

//declaration of array which will store how many times a square has been right-clicked
var timesRightClicked = [];

//global declaration of array which will store the mines and the adjacent mines number
//this array is mostly the back-end board for the game
var minesAndNumbers = [];

//the following loop:
//1. initializes the timesRightClicked array with 0 because none of the squares would be right-clicked initially
//2. initializes minesAndNumbers array with 0 because there are no mines placed currently
//3. set event listener on each square for right-click and left-click
for (var i = 0; i < side1; i++) {
	timesRightClicked[i] = [];
	minesAndNumbers[i] = [];
	for(var j = 0; j < side2; j++) {
		timesRightClicked[i][j] = 0;
		minesAndNumbers[i][j] = 0;
		$("tr:eq(" + i + ") td:eq(" + j + ")").attr("oncontextmenu", "mouseclick(event);return false;");
		$("tr:eq(" + i + ") td:eq(" + j + ")").attr("onclick", "mouseclick(event);");
	}
}

//this loop places mines randomly in the array minesAndNumbers
//mines are denoted with -1
for(var i = 0; i < totalMines; ) {
	var random = Math.floor(Math.random() * (side1 * side2));
	var x = Math.floor(random / side1);
	var y = random % side2;
	if(minesAndNumbers[x][y] == 0) {
		minesAndNumbers[x][y] = -1;
		i++;
	}
}

//this loop counts the number of adjacent mines around each square and put that value in the minesAndNumbers array on the respective index
for(var i = 0; i < side1; i++) {
	for(var j = 0; j < side2; j++) {
		if(minesAndNumbers[i][j] != -1) {
			var minesAround = 0;
			//this check whether a row above the square exists or not
			if(typeof minesAndNumbers[i-1] != "undefined") {
				//this checks if NORTH WEST of the square exists or not
				if (typeof minesAndNumbers[i-1][j-1] != "undefined") {
					if (minesAndNumbers[i-1][j-1] == -1) {
						minesAround++;
					}
				}
				//if a row above exists, then NORTH of the square will definitely exist
				if (minesAndNumbers[i-1][j] == -1) {
					minesAround++;
				}
				//this checks if NORTH EAST of the square exists or not
				if (typeof minesAndNumbers[i-1][j+1] != "undefined") {
					if (minesAndNumbers[i-1][j+1] == -1) {
						minesAround++;
					}
				}
			}
			//this checks if WEST of the square exists or not
			if (typeof minesAndNumbers[i][j-1] != "undefined") {
				if (minesAndNumbers[i][j-1] == -1) {
					minesAround++;
				}
			}
			//this checks if EAST of the square exists or not
			if (typeof minesAndNumbers[i][j+1] != "undefined") {
				if (minesAndNumbers[i][j+1] == -1) {
					minesAround++;
				}
			}
			//this checks whether a row below the sqaure exists or not
			if(typeof minesAndNumbers[i+1] != "undefined") {
				//this checks if SOUTH WEST of the square exists or not
				if (typeof minesAndNumbers[i+1][j-1] != "undefined") {
					if (minesAndNumbers[i+1][j-1] == -1) {
						minesAround++;
					}
				}
				//if a row below exists, then SOUTH of the square will definitely exist
				if (minesAndNumbers[i+1][j] == -1) {
					minesAround++;
				}
				//this checks if SOUTH EAST of the square exists or not
				if (typeof minesAndNumbers[i+1][j+1] != "undefined") {
					if (minesAndNumbers[i+1][j+1] == -1) {
						minesAround++;
					}
				}
			}
			minesAndNumbers[i][j] = minesAround;
		}
	}
}

//this hides loading screen
$(".loading-container").css("display", "none");


//the following recursive function reveals all the squares which have no bombs around them
//if such a square is revealed in this process, then squares around it are revealed too
//this goes on untill all the squares, without any bombs around, that touch each other are revealed
//this is invoked only when such a square is clicked
function revealAll(i, j) {
	this.minesAndNumbers[i][j] = -2;
	//this check whether a row above the square exists or not
	if(typeof this.minesAndNumbers[i-1] != "undefined") {
		//this checks if NORTH WEST of the square exists or not
		if (typeof this.minesAndNumbers[i-1][j-1] != "undefined") {
			//runs only if the square on this index is not revealed
			if(this.minesAndNumbers[i-1][j-1] != -2) {
				if (this.minesAndNumbers[i-1][j-1] == 0) {
					revealAll((i-1), (j-1));
				}
				else {
					$("tr:eq(" + (i-1) + ") td:eq(" + (j-1) + ")").html(this.minesAndNumbers[i-1][j-1]);
					setRevealCss(i-1, j-1);
					this.minesAndNumbers[i-1][j-1] = -2;
				}
			}
		}
		//if a row above exists, then NORTH of the square will definitely exist
		if(this.minesAndNumbers[i-1][j] != -2) {
			if (this.minesAndNumbers[i-1][j] == 0) {
				revealAll((i-1), (j));
			}
			else {
				$("tr:eq(" + (i-1) + ") td:eq(" + j + ")").html(this.minesAndNumbers[i-1][j]);
				setRevealCss(i-1, j);
				this.minesAndNumbers[i-1][j] = -2;
			}
		}
		//this checks if NORTH EAST of the square exists or not
		if (typeof this.minesAndNumbers[i-1][j+1] != "undefined") {
			//runs only if the square on this index is not revealed
			if(this.minesAndNumbers[i-1][j+1] != -2) {
				if (this.minesAndNumbers[i-1][j+1] == 0) {
					revealAll((i-1), (j+1));
				}
				else {
					$("tr:eq(" + (i-1) + ") td:eq(" + (j+1) + ")").html(this.minesAndNumbers[i-1][j+1]);
					setRevealCss(i-1, j+1);
					this.minesAndNumbers[i-1][j+1] = -2;
				}
			}
		}
	}
	//this checks if WEST of the square exists or not
	if(typeof this.minesAndNumbers[i][j-1] != "undefined") {
		//runs only if the square on this index is not revealed
		if(this.minesAndNumbers[i][j-1] != -2) {
			if (this.minesAndNumbers[i][j-1] == 0) {
				revealAll((i), (j-1));
			}
			else {
				$("tr:eq(" + i + ") td:eq(" + (j-1) + ")").html(this.minesAndNumbers[i][j-1]);
				setRevealCss(i, j-1);
				this.minesAndNumbers[i][j-1] = -2;
			}
		}
	}
	//this checks if EAST of the square exists or not
	if(typeof this.minesAndNumbers[i][j+1] != "undefined") {
		//runs only if the square on this index is not revealed
		if(this.minesAndNumbers[i][j+1] != -2) {
			if (this.minesAndNumbers[i][j+1] == 0) {
				revealAll((i), (j+1));
			}
			else {
				$("tr:eq(" + i + ") td:eq(" + (j+1) + ")").html(this.minesAndNumbers[i][j+1]);
				setRevealCss(i, j+1);
				this.minesAndNumbers[i][j+1] = -2;
			}
		}
	}
	//this check whether a row below the square exists or not
	if(typeof this.minesAndNumbers[i+1] != "undefined") {
		//this checks if SOUTH WEST of the square exists or not
		if (typeof this.minesAndNumbers[i+1][j-1] != "undefined") {
			//runs only if the square on this index is not revealed
			if(this.minesAndNumbers[i+1][j-1] != -2) {
				if (this.minesAndNumbers[i+1][j-1] == 0) {
					revealAll((i+1), (j-1));
				}
				else {
					$("tr:eq(" + (i+1) + ") td:eq(" + (j-1) + ")").html(this.minesAndNumbers[i+1][j-1]);
					setRevealCss(i+1, j-1);
					this.minesAndNumbers[i+1][j-1] = -2;
				}
			}
		}
		//if a row below exists, then SOUTH of the square will definitely exist
		if(this.minesAndNumbers[i+1][j] != -2) {
			if (this.minesAndNumbers[i+1][j] == 0) {
				revealAll((i+1), (j));
			}
			else {
				$("tr:eq(" + (i+1) + ") td:eq(" + j + ")").html(this.minesAndNumbers[i+1][j]);
				setRevealCss(i+1, j);
				this.minesAndNumbers[i+1][j] = -2;
			}
		}
		//this checks if SOUTH EAST of the square exists or not
		if (typeof this.minesAndNumbers[i+1][j+1] != "undefined") {
			//runs only if the square on this index is not revealed
			if(this.minesAndNumbers[i+1][j+1] != -2) {
				if (this.minesAndNumbers[i+1][j+1] == 0) {
					revealAll((i+1), (j+1));
				}
				else {
					$("tr:eq(" + (i+1) + ") td:eq(" + (j+1) + ")").html(this.minesAndNumbers[i+1][j+1]);
					setRevealCss(i+1, j+1);
					this.minesAndNumbers[i+1][j+1] = -2;
				}
			}
		}
	}
//	$("tr:eq(" + i + ") td:eq(" + j + ")").css("background-color", "rgb(30, 31, 33)");
//	$("tr:eq(" + i + ") td:eq(" + j + ")").css("color", "white");
//	$("tr:eq(" + i + ") td:eq(" + j + ")").css("border-color", "black");
	setRevealCss(i, j);
}



//this function reveals blocks in the front-end
function setRevealCss(i, j) {
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("background-color", "#35363a");
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("color", "white");
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("border-color", "black");
}


//runs if you click a square with a mine
function gameOver() {
	$(".loading-container p").html("GAME OVER<br><br><h5>Press Enter to restart</h5>");
	$(".loading-container").css("display", "flex");
	$(document).keydown(function(e) {
		if(e.keyCode == 13) {
			$(".loading-container p").html("LOADING");
			location.reload(true);
		}
	});
}


/*-------------------------------------------------------------------------
THE DRIVER FUNCTION
-------------------------------------------------------------------------*/
//this performs right-click and left-click functions on a square
function mouseclick(event) {
	//these take the index of (right/left)-clicked square
	var parentIndex = $(event.target).parent().index();
	var childIndex = $(event.target).index();
	//only runs if the clicked square is not already revealed
	if(this.minesAndNumbers[parentIndex][childIndex] != -2) {
		//runs on right-click
		if (event.button == "2") {
			//this takes the value in the timesRightClicked array on the index of the right-clicked square
			var timesRightClicked = this.timesRightClicked[parentIndex][childIndex];
			if (timesRightClicked == 0) {
				$(event.target).css("background-color", "lightblue");
				$(event.target).css("color", "black");
				$(event.target).html("&#128681");
				this.timesRightClicked[parentIndex][childIndex]++;
			}
			else if (timesRightClicked == 1) {
				$(event.target).html("&#10067");
				this.timesRightClicked[parentIndex][childIndex]++;
			}
			else {
				$(event.target).css("background-color", "white");
				$(event.target).css("border-color", "#35363a");
				$(event.target).html("");
				this.timesRightClicked[parentIndex][childIndex] = 0;
			}
		}
		//runs on left-click but only on an unmarked square
		else if (event.button == "0" && this.timesRightClicked[parentIndex][childIndex] == 0) {
			if (this.minesAndNumbers[parentIndex][childIndex] == 0) {
				revealAll(parentIndex, childIndex);
			}
			else if (this.minesAndNumbers[parentIndex][childIndex] == -1) {
				$(event.target).html("&#128163");
				setRevealCss(parentIndex, childIndex);
				this.minesAndNumbers[parentIndex][childIndex] = -2;
				gameOver();
			}
			//this sets the html of the square as the number of mines around it
			else {
				$(event.target).html(this.minesAndNumbers[parentIndex][childIndex]);
				setRevealCss(parentIndex, childIndex);
				//this sets -2 in the minesAndNumbers array on the index of the clicked square, thereby forgetting how many mines are around it.
				this.minesAndNumbers[parentIndex][childIndex] = -2;
			}
		}
	}
}