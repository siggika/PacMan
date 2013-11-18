// ========
// GAME END
// ========

//handles gameover, gamewon, newgame..


var GameEnd = {

gameWon : false,
	
gameOver : false,

gameIsWon : function () {
	this.gameWon = true;
	entityManager.haltGuys();
},

gameIsOver : function () {
	this.gameOver = true;
	entityManager.haltGuys();
}

};