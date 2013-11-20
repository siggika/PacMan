var output = document.getElementById('output');

//ef við viljum setja texta úr js
var p1 = document.createElement("p");
var node = "text";
var textNode = document.createTextNode(node);
p1.appendChild(textNode);
//output.appendChild(p1); 

function updateScoreText(score) {
	var scoreText = "Score: " + score;
	$("#score").text(scoreText);
}

function updateLivesText(lives) {
	var livesText = "Lives: " + lives;
	$("#lives").text(livesText);
}

function updateSideText() {
	var areSoundsOn = g_soundOn ? "on" : "off";
	var soundText = "Sound effects are " + areSoundsOn + ".";
	$("#sounds").text(soundText);
}