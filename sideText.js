// ========
// GAME END
// ========

//updates sideText on screen

var sideText = {

updateScoreText : function (score) {
	var scoreText = "Score: " + score;
	$("#score").text(scoreText);
},

updateLivesText : function (lives) {
	var livesText = "Lives: " + lives;
	$("#lives").text(livesText);
},

updateSideText : function (){
	var areSoundsOn = g_soundOn ? "on" : "off";
	var soundText = "Sound effects are " + areSoundsOn + ".";
	$("#sounds").text(soundText);
},

initScoreBoard : function () {
	GameEnd.doRenderHighScore();
}

};
