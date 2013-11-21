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

gameIsWon : function() {
	this.gameWon = true;
	entityManager.haltGuys();
},

gameIsOver : function(score) {
	this.gameOver = true;
	var highscore = "" + score;
	localStorage.setItem(highscore, score);
	this.doRenderHighScore();
	this.renderHighScore = false;
	entityManager.haltGuys();
	//this.newGame();
},

loseLife : function () {
	this.lifeLost = true;
	var timeout = setTimeout (function() {GameEnd.lifeLost = false;}, 1500);
},

doRenderHighScore : function() {
	if(!this.renderHighScore) return;
	if(this.gameOver) $("#highscore").text("");
	var _highscores = [];
	for(var i in localStorage) {
		var item = localStorage.getItem(i);
   		_highscores[i] = item;
   	}
   	_highscores.sort();
   	_highscores.reverse();
   	var highscores = [];
   	for(var i = 0; i < _highscores.length; i++) {
   		if(_highscores[i] !== undefined) highscores.push(_highscores[i]);
   	}
   	for(var i = 0; i < 5; i++) {
   		if(highscores[i] !== undefined) $("#highscore").append('<li type="1">'+highscores[i]+'</li>');
   	}
},

doRenderScore : function(points) {
	this.renderScore = true;
	this.scoreUp = points;
},

newGame : function () {
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
	console.log("FINISHED RESETTING");
}

};
