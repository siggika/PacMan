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

resetDone : false,

level : 1,

levelWon : 1,

level2 : false,

gameIsWon : function() {
	this.gameWon = true;
	entityManager.haltGuys();
},

gameIsOver : function() {
	this.gameOver = true;
	entityManager.haltGuys();
	//this.newGame();
},

loseLife : function () {
	this.lifeLost = true;
	var timeout = setTimeout (function() {GameEnd.lifeLost = false;}, 1500);
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