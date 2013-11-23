// ========
// GAME END
// ========

//handles gameover, gamewon, newgame..


var GameEnd = {

gameWon : false,
	
gameOver : false,

lifeLost : false,

scoreUp : false,

renderScore : false,

renderHighScore : true,

resetDone : false,

level : 1,

levelWon : 1,

level2 : false,

quit : false,

gameIsWon : function(score) {
	if (this.gameOver) return;
	this.gameWon = true;
	var highscore = "" + score;
	localStorage.setItem(highscore, score);
	this.doRenderHighScore();
	this.renderHighScore = false;
	entityManager.haltGuys();
	
	$("#newGame").show();
},

gameIsOver : function(score) {
	if (this.gameOver) return;

	this.gameOver = true;
	var highscore = "" + score;
	localStorage.setItem(highscore, score);
	this.doRenderHighScore();
	this.renderHighScore = false;
	entityManager.haltGuys();
	
	$("#newGame").show();
	$("#quit").show();
},

loseLife : function () {
	this.lifeLost = true;
	var timeout = setTimeout (function() {GameEnd.lifeLost = false;}, 1500);
},

doRenderHighScore : function() {
	function sortNumber(a,b) {
    		return a - b;
	}
	if(!this.renderHighScore) return;
	if(this.gameOver || this.gameWon) $("#highscore").text("");
	var _highscores = [];
	for(var i in localStorage) {
		var item = localStorage.getItem(i);
   		_highscores[i] = item;
   	}
   	_highscores.sort(sortNumber);
   	_highscores.reverse();
   	var highscores = [];
   	for(var i = 0; i < _highscores.length; i++) {
   		if(_highscores[i] !== undefined && _highscores[i] !== "undefined" &&
   			_highscores[i] !== true && _highscores[i] !== "true" && _highscores[i] !== false
   			&& _highscores[i] !== "false") {
   			highscores.push(_highscores[i]);
   		}
   	}
   	highscores.sort(sortNumber);
   	highscores.reverse();
   	for(var i = 0; i < 5; i++) {
   		if(highscores[i] !== undefined && highscores[i] !== "undefined" &&
   			highscores[i] !== true && highscores[i] !== "true" && highscores[i] !== false
   			&& highscores[i] !== "false") {
   			$("#highscore").append('<li type="1">'+highscores[i]+'</li>');
   		}
   	}
},

doRenderScore : function(points) {
	this.renderScore = true;
	this.scoreUp = points;
},

newGame : function () {
	this.gameWon = false;
	entityManager.restartGuys();
	entityManager.resetTimers();
	entityManager.initTimeouts();
	entityManager.resetMaze();
	this.resetDone = true;
	this.gameOver = false;
	this.level = 1;
},

nextLevel : function () {
	if (this.level === 1) {
		this.level = 2;
		this.level2 = true;
		var timeout = setTimeout(function() {GameEnd.level2 = false;}, 2000);
	}
	entityManager.guysSetNewLevel();
	entityManager.resetTimers();
	entityManager.initTimeouts();
	entityManager.resetMaze();
	this.resetDone = true;
},

quitGame : function () {
	this.quit = true;
	$("#newGame").hide();
	$("#quit").hide();
	$("#backToStart").show();
	
	main.gameOver();
}

};

// buttons 

$("#newGame").click(function() {
	$("#newGame").hide();
	$("#quit").hide();
	GameEnd.newGame();
});

$("#quit").click(function() {
	$("#newGame").hide();
	$("#quit").hide();
	GameEnd.quitGame();
});

$("#newGame").hover( function() {
	$( this ).css({
		"border-width" : "10px",
		"margin-left" : "9.5%",
		"margin-top" : "19.5%"
	});} , function() {
	$( this ).css({
		"border-width" : "5px",
		"margin-left" : "10%",
		"margin-top" : "20%"
	});}	
);

$("#quit").hover( function() {
	$( this ).css({
		"border-width" : "10px",
		"margin-left" : "9.5%",
		"margin-top" : "29.5%"
	});} , function() {
	$( this ).css({
		"border-width" : "5px",
		"margin-left" : "10%",
		"margin-top" : "30%"
	});}	
);
	
	
$("#startGame").click(function() {
	$("#startPage").hide();
	requestPreloads();
});

$("#startGame").hover( function() {
	$( this ).css({
		"border-width" : "10px",
		"margin-left" : "9.5%",
		"margin-top" : "19.5%"
	});} , function() {
	$( this ).css({
		"border-width" : "5px",
		"margin-left" : "10%",
		"margin-top" : "20%"
	});}	
);

$("#info").click(function() {
	$("#startPage").hide();
	$("#infoPage").show();
});

$("#info").hover( function() {
	$( this ).css({
		"border-width" : "10px",
		"margin-left" : "9.5%",
		"margin-top" : "29.5%"
	});} , function() {
	$( this ).css({
		"border-width" : "5px",
		"margin-left" : "10%",
		"margin-top" : "30%"
	});}	
);

$("#back").click(function() {
	$("#startPage").show();
	$("#infoPage").hide();
});

$("#back").hover( function() {
	$( this ).css({
		"border-width" : "10px",
		"margin-left" : "6.5%",
		"margin-top" : "13.5%"
	});} , function() {
	$( this ).css({
		"border-width" : "5px",
		"margin-left" : "7%",
		"margin-top" : "14%"
	});}	
);
