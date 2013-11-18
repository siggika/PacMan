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

losingLife : function() {	//�etta virka�i inn� fallinu en svo fyrir utan var enn�� this.lifeLost = true, DON'T KNOW
	this.lifeLost = false;
},

loseLife : function () {
	this.lifeLost = true;
},

doRenderScore : function(points) {
	this.renderScore = true;
	this.scoreUp = points;
},

noRenderScore : function() {
	this.renderScore = true;
}

};