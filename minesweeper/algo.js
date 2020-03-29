//declaration of necessary variables
var difficulty = sessionStorage.getItem("difficulty");
var totalMines;
var side1;
var side2;
var scale;
//var scoreHolder = angular.module('minesweeper-score', []);

//this initializes necessary variables according to the difficulty
if(difficulty == "easy") {
	totalMines = 10;
	side1 = 9;
	side2 = 9;
	scale = "scale(1)";
}															//add more ifs for other difficulties
else if (difficulty == "medium") {
	totalMines = 40;
	side1 = 16;
	side2 = 16;
	scale = "scale(0.6)";
}
else if (difficulty == "expert") {
	totalMines = 99;
	side1 = 16;
	side2 = 30;
	scale = "scale(0.8, 0.6)";
}


//this function creates the board in the front-end according to side1 and side2
createBoard();
function createBoard() {
	$(".grid-container").append('<table class="main-table" cellspacing="5" oncontextmenu="return false;"></table>');
	for(var i = 0; i < side1; i++) {
		$(".main-table").append("<tr></tr>")
		for(var j = 0; j < side2; j++) {
			$("tr:eq(" + i + ")").append("<td>&nbsp;&nbsp;&nbsp;&nbsp;</td>");
		}
		$("tr:eq(" + i + ")").fadeTo(0, 0);
	}
	$(".main-table").css("transform", scale);
}

//the animation of the table appearing happens due to this function
tableAppear();
async function tableAppear() {
	//this hides loading screen
	$(".loading-container").css("display", "none");
	$(".loading-container").html("");
	for(var i = 0; i < side1; i++) {
		$("tr:eq(" + i + ")").fadeTo(700, 1);
		await new Promise(r => setTimeout(r, 130));
	}
}


//declaration of array which will store how many times a square has been right-clicked
var timesRightClicked = [];

//declaration of array which will store the mines and the adjacent mines number
//this array is mostly the back-end board for the game
//it will hold mines, denoted by -1 //remember this
//it will also later hold the revealed squares, denoted by -2 //remember this too
var minesAndNumbers = [];

//this stores number of squares that are safe (for scoring purposes)
var possibleMoves = (side1*side2) - totalMines;

//this will store total mines that you disarm (for scoring purposes) (disarm = mines marked as flag)
var minesDisarmed = 0;


var totalRevealed = 0;
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


//this function place mines randomly in the array minesAndNumbers
//mines are denoted with -1 //you still remember, right?
//invoked on first click
function placeMines(side1, side2, totalMines) {
	for(var i = 0; i < totalMines; ) {
		var random = Math.floor(Math.random() * (side1 * side2));
		var x = Math.floor(random / side2);
		var y = random % side2;
		if(this.minesAndNumbers[x][y] == 0) {
			this.minesAndNumbers[x][y] = -1;
			i++;
		}
	}
}

//this function counts the number of adjacent mines around each square and put that value in the minesAndNumbers array on the respective index
//invoked on first click
function countAdjacentMines() {	
	for(var i = 0; i < side1; i++) {
		for(var j = 0; j < side2; j++) {
			if(this.minesAndNumbers[i][j] != -1) {
				var minesAround = 0;
				//this check whether a row above the square exists or not
				if(typeof this.minesAndNumbers[i-1] != "undefined") {
					//this checks if NORTH WEST of the square exists or not
					if (typeof this.minesAndNumbers[i-1][j-1] != "undefined") {
						if (this.minesAndNumbers[i-1][j-1] == -1) {
							minesAround++;
						}
					}
					//if a row above exists, then NORTH of the square will definitely exist
					if (this.minesAndNumbers[i-1][j] == -1) {
						minesAround++;
					}
					//this checks if NORTH EAST of the square exists or not
					if (typeof this.minesAndNumbers[i-1][j+1] != "undefined") {
						if (this.minesAndNumbers[i-1][j+1] == -1) {
							minesAround++;
						}
					}
				}
				//this checks if WEST of the square exists or not
				if (typeof this.minesAndNumbers[i][j-1] != "undefined") {
					if (this.minesAndNumbers[i][j-1] == -1) {
						minesAround++;
					}
				}
				//this checks if EAST of the square exists or not
				if (typeof this.minesAndNumbers[i][j+1] != "undefined") {
					if (this.minesAndNumbers[i][j+1] == -1) {
						minesAround++;
					}
				}
				//this checks whether a row below the sqaure exists or not
				if(typeof this.minesAndNumbers[i+1] != "undefined") {
					//this checks if SOUTH WEST of the square exists or not
					if (typeof this.minesAndNumbers[i+1][j-1] != "undefined") {
						if (this.minesAndNumbers[i+1][j-1] == -1) {
							minesAround++;
						}
					}
					//if a row below exists, then SOUTH of the square will definitely exist
					if (this.minesAndNumbers[i+1][j] == -1) {
						minesAround++;
					}
					//this checks if SOUTH EAST of the square exists or not
					if (typeof this.minesAndNumbers[i+1][j+1] != "undefined") {
						if (this.minesAndNumbers[i+1][j+1] == -1) {
							minesAround++;
						}
					}
				}
				this.minesAndNumbers[i][j] = minesAround;
			}
		}
	}
}



//the following recursive function reveals all the squares which have no bombs around them
//if such a square is revealed in this process, then squares around it are revealed too
//this goes on until all the squares, without any bombs around, that touch each other are revealed
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
	//finally reveals the square itself
	setRevealCss(i, j);
}

//this function set mines (and also removes them later) around/on the first-clicked square so that the placeMines() function does not set actual mines around/on it.
function setFakeMines(i, j, parameter) {
	if(typeof this.minesAndNumbers[i-1] != "undefined") {
		//this checks if NORTH WEST of the square exists or not
		if (typeof this.minesAndNumbers[i-1][j-1] != "undefined") {
			this.minesAndNumbers[i-1][j-1] = parameter;
		}
		//if a row above exists, then NORTH of the square will definitely exist
		this.minesAndNumbers[i-1][j] = parameter;
		//this checks if NORTH EAST of the square exists or not
		if (typeof this.minesAndNumbers[i-1][j+1] != "undefined") {
			this.minesAndNumbers[i-1][j+1] = parameter;
		}
	}
	//this checks if WEST of the square exists or not
	if (typeof this.minesAndNumbers[i][j-1] != "undefined") {
		this.minesAndNumbers[i][j-1] = parameter;
	}
	//the square itself
	this.minesAndNumbers[i][j] = parameter;
	//this checks if EAST of the square exists or not
	if (typeof this.minesAndNumbers[i][j+1] != "undefined") {
		this.minesAndNumbers[i][j+1] = parameter;
	}
	//this checks whether a row below the sqaure exists or not
	if(typeof this.minesAndNumbers[i+1] != "undefined") {
		//this checks if SOUTH WEST of the square exists or not
		if (typeof this.minesAndNumbers[i+1][j-1] != "undefined") {
			this.minesAndNumbers[i+1][j-1] = parameter;
		}
		//if a row below exists, then SOUTH of the square will definitely exist
		this.minesAndNumbers[i+1][j] = parameter;
		//this checks if SOUTH EAST of the square exists or not
		if (typeof this.minesAndNumbers[i+1][j+1] != "undefined") {
			this.minesAndNumbers[i+1][j+1] = parameter;
		}
	}
}



//this function reveals blocks in the front-end
function setRevealCss(i, j) {
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("background-color", "#35363a");
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("color", "white");
	$("tr:eq(" + i + ") td:eq(" + j + ")").css("border-color", "black");
	possibleMoves--;
	totalRevealed++;
}


//runs if you click a square with a mine or you win the game
function gameOver(won) {
	$(".loading-container").append('<iframe src="gameOver.html" onload="this.style.height=(this.contentDocument.body.scrollHeight)' + " + " + "'px';" + '"' + ' scrolling="no"></iframe>')
	for(var i = 0; i < side1; i++) {
		for(var j = 0; j < side2; j++) {
			minesAndNumbers[i][j] = -2;
		}
	}
	sessionStorage.setItem("minesDisarmed", minesDisarmed);
	if(won) {
		sessionStorage.setItem("winOrLose", "You Won!");
		sessionStorage.setItem("boardScore", totalRevealed);
		sessionStorage.setItem("totalScore", totalRevealed + minesDisarmed);
	}
	else {
		sessionStorage.setItem("winOrLose", "Game Over");
		sessionStorage.setItem("boardScore", totalRevealed-1);
		sessionStorage.setItem("totalScore", (totalRevealed-1) + minesDisarmed);
	}
	$("iframe").css("display", "block");
	$(".loading-container").css("display", "flex");
}

//this ensures that the first click will always be safe
var firstClickFlag = true;


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
		//runs if square was right-clicked
		if (event.button == "2") {
			//this takes the value in the timesRightClicked array on the index of the right-clicked square
			var timesRightClicked = this.timesRightClicked[parentIndex][childIndex];
			if (timesRightClicked == 0) {
				$(event.target).css("background-color", "lightblue");
				$(event.target).css("color", "black");
				$(event.target).html("&#128681");
				this.timesRightClicked[parentIndex][childIndex]++;
				//if the flagged square is a mine, then increase minesDisarmed by 1
				if(this.minesAndNumbers[parentIndex][childIndex] == -1) {
					minesDisarmed++;
				}
			}
			else if (timesRightClicked == 1) {
				$(event.target).html("&#10067");
				this.timesRightClicked[parentIndex][childIndex]++;
				//if the flag is removed from a square which has a mine, then decrease minesDisarmed by 1
				if(this.minesAndNumbers[parentIndex][childIndex] == -1) {
					minesDisarmed--;
				}
			}
			else {
				$(event.target).css("background-color", "white");
				$(event.target).css("border-color", "#35363a");
				$(event.target).html("");
				this.timesRightClicked[parentIndex][childIndex] = 0;
			}
		}
		//runs if an unmarked square is left-clicked
		else if (event.button == "0" && this.timesRightClicked[parentIndex][childIndex] == 0) {
			//runs only on first click
			if(firstClickFlag) {
				//temporarily marks the clicked square and the squares around it as mines
				setFakeMines(parentIndex, childIndex, -1);
				//place actual mines on the board
				placeMines(side1, side2, totalMines);
				//removes the temporarily marked mines from the clicked square and the squares around it
				setFakeMines(parentIndex, childIndex, 0);
				//counts the mines adjacent to each square and places it in the array minesAndNumbers
				countAdjacentMines();
				//reveal the squares surrounding the clicked square
				revealAll(parentIndex, childIndex);
				//makes sure this 'if' only run once
				firstClickFlag = false;
			}
			//runs if clicked-square is empty
			else if (this.minesAndNumbers[parentIndex][childIndex] == 0) {
				revealAll(parentIndex, childIndex);
				if(possibleMoves == 0) {
					gameOver(true);
				}
			}
			//runs if clicked-square has a mine
			else if (this.minesAndNumbers[parentIndex][childIndex] == -1) {
				$(event.target).html("&#128163");
				setRevealCss(parentIndex, childIndex);
				this.minesAndNumbers[parentIndex][childIndex] = -2;
				gameOver(false);
			}
			//runs if the clicked square is a normal square with a number >0
			else {
				setRevealCss(parentIndex, childIndex);
				//this sets the html of the square as the number of mines around it
				$(event.target).html(this.minesAndNumbers[parentIndex][childIndex]);
				//the following sets -2 in the minesAndNumbers array on the index of the clicked square, thereby marking it as revealed and forgetting how many mines are around it
				this.minesAndNumbers[parentIndex][childIndex] = -2;
				if(possibleMoves == 0) {
					gameOver(true);
				}
			}
		}
	}
}