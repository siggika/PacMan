var output = document.getElementById('output');

//ef við viljum setja texta úr js
var p1 = document.createElement("p");
var node = "text";
var textNode = document.createTextNode(node);
p1.appendChild(textNode);
//output.appendChild(p1); 

function updateSideText(score) {
	var scoreText = "Score: " + score;
	$("#score").text(scoreText);
}