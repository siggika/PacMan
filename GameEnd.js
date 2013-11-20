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

gameIsWon : function() {
	this.gameWon = true;
	entityManager.haltGuys();
},

gameIsOver : function() {
	this.gameOver = true;
	entityManager.haltGuys();
},

loseLife : function () {
	this.lifeLost = true;
},

doRenderScore : function(points) {
	this.renderScore = true;
	this.scoreUp = points;
},

};