var bgmusicMuted;
var winMuted;
var revMuted;
var clkMuted;
var oopMuted;
var ylsMuted;
var arsMuted;

if(Boolean(sessionStorage.getItem("isSoundToggled"))) {
	unmuteAll();
}
else {
	muteAll();
}


function muteAll() {
	bgmusicMuted = true;
	winMuted = true;
	revMuted = true;
	clkMuted = true;
	oopMuted = true;
	ylsMuted = true;
	arsMuted = true;
}

function unmuteAll() {
	bgmusicMuted = false;
	winMuted = false;
	revMuted = false;
	clkMuted = false;
	oopMuted = false;
	ylsMuted = false;
	arsMuted = false;
}



var bgmusic;

function backgroundMusic() {
	bgmusic = new Audio;
	bgmusic.src = "music/track7.ogg";
	if(!bgmusicMuted){
		bgmusic.play();	
	}
	bgmusic.volume = 0.2;
	bgmusic.loop = true;
}


function playWinSound() {
	var win = new Audio;
	win.src = "music/achievement.wav";
	if(!winMuted) {
		win.play();
	}
	win.volume = 0.2;
	bgmusic.muted = true;
}


function revealSound() {
	var rev = new Audio;
	rev.src = "music/cuteAlert.wav";
	if(!revMuted){
		rev.play();
	}
	rev.volume = 0.3;
}

function clickSound() {
	var clk = new Audio;
	clk.src = "music/MessagePingX2.wav";
	if(!clkMuted) {
		clk.play();
	}
	clk.volume = 0.3;
}

function oopsie() {
	var oop = new Audio;
	oop.src = "music/error.wav";
	if(!oopMuted) {
		oop.play();
	}
	oop.volume = 0.3;
}

function youLostSound() {
	var yls = new Audio;
	yls.src = "music/soft-fail.wav";
	if(!ylsMuted) {
		yls.play();
	}
	yls.volume = 0.2;
	bgmusic.muted = true;
	
}

function allRevealSound() {
	var ars = new Audio;
	ars.src = "music/game-coin.wav";
	if(!arsMuted) {
		ars.play();
	}
	ars.volume = 0.3;
}
