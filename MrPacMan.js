// ==========
// MrPacMan
// ==========


// A generic contructor which accepts an arbitrary descriptor object
function Pacman(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Pacman;
    
    this.init();
    
};

Pacman.prototype = new Entity();

Pacman.prototype.KEY_UP    = 'W'.charCodeAt(0);
Pacman.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Pacman.prototype.KEY_LEFT  = 'A'.charCodeAt(0);
Pacman.prototype.KEY_RIGHT = 'D'.charCodeAt(0);

// Initial, inheritable, default values

//Movement and positions
Pacman.prototype.radius = 12;
Pacman.prototype.velX = (0.8*2);
Pacman.prototype.velY = (0.8*2);
Pacman.prototype.nextTurn = false;

Pacman.prototype.score = 0;
Pacman.prototype.cakesEaten = 0;
Pacman.prototype.lives = 3;

Pacman.prototype.numSubSteps = 2;
Pacman.prototype.directions;
Pacman.prototype.color = "yellow";
Pacman.prototype.mode = "scatter";
Pacman.prototype.lastMode = "scatter";
Pacman.prototype.timer;
Pacman.prototype.blinkTimer;

Pacman.prototype.init = function() {

	this.directions = {
		left : false,
		right : false,
		up : false, 
		down : false
	};
	this.nextTurn = false;
	this.newGameSound.play();
};

// HACKED-IN AUDIO (no preloading)
Pacman.prototype.diesSound = new Audio("sounds/pacmandies.mp3");
Pacman.prototype.cherrySound = new Audio("sounds/pacmaneatingcherry.mp3");
Pacman.prototype.eatGhostSound = new Audio("sounds/pacmaneatingghost.mp3");
Pacman.prototype.newGameSound = new Audio("sounds/pacmanopeningsong.mp3");
Pacman.prototype.wakaSound = new Audio("sounds/pacmanwaka.mp3");
Pacman.prototype.interSound = new Audio("sounds/pacmanintermission.mp3");

//Functions
Pacman.prototype.update = function (du) {    
    
	spatialManager.unregister(this);          
	
	this.updateDirections(du);
	
	var steps = this.numSubSteps;
	var dStep = du / steps;	
	for (var i = 0; i < steps; ++i) {
		this.Move(dStep);
	}
	
	this.updateScore();
	this.updateLives();
	
	var ghost = this.findHitEntity();
    if (ghost) {
		this.handleCollision(ghost);
	}
	
	spatialManager.register(this);
};

Pacman.prototype.updateDirections = function(du){
		
	if (eatKey(this.KEY_UP)) 
		this.nextTurn = "up";		
	if (eatKey(this.KEY_DOWN)) 
		this.nextTurn = "down";    	     
    if (eatKey(this.KEY_LEFT)) 
    	this.nextTurn = "left";
    if (eatKey(this.KEY_RIGHT)) 
    	this.nextTurn = "right"; 		   

	var nextPos = this.getNextPos(du);
	
	if(this.nextTurn === "up")
	{
		nextTile = entityManager.getTile(nextPos.nextXup, nextPos.nextYup, this.radius, this.nextTurn);	
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXup, nextPos.nextYup);
		
		if (wallColliding.up) {
			this.isColliding_up = true;
			return;
		}
		else
		{
			this.isColliding_up = false;
			this.setDirectionUp();	        
		}
	}
	if(this.nextTurn === "down")
	{
		nextTile = entityManager.getTile(nextPos.nextXdown, nextPos.nextYdown, this.radius, this.nextTurn);		
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXdown, nextPos.nextYdown);
		
		if (wallColliding.down) {
			this.isColliding_down = true;
			return;
		}
    	else
		{
			this.isColliding_down = false;
			this.setDirectionDown();       
		}
	}
    if(this.nextTurn === "left")
	{
		nextTile = entityManager.getTile(nextPos.nextXleft, nextPos.nextYleft, this.radius, this.nextTurn);
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXleft, nextPos.nextYleft);
		
		if (wallColliding.left) {
			this.isColliding_left = true;
			return;
		}
    	else
		{
			this.isColliding_left = false;
    		this.setDirectionLeft();
		}    
		
    }
    if(this.nextTurn === "right")
	{
		nextTile = entityManager.getTile(nextPos.nextXright, nextPos.nextYright, this.radius, this.nextTurn);
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXright, nextPos.nextYright);
		
		if (wallColliding.right) {
			this.isColliding_right = true;
			return;
		}
    	else
		{
			this.isColliding_right = false;
    		this.setDirectionRight();	    
		}
    }	   
};

Pacman.prototype.isWallColliding = function (nextTile, nextX, nextY) {
	
	var startingGhostTile = entityManager.getTile(230,200,3);
	var startingGhostTile2 = entityManager.getTile(220,200,3);	
	var left, right, up, down = false;
	
	if (nextTile)
	{	
		//the ghost box
		if (nextTile === startingGhostTile || nextTile === startingGhostTile2) {
			down = true;
		}
	
		if (nextTile.type == "1") 
		{
			var nextTileX = nextTile.cx + (nextTile.width/2);
			var nextTileY = nextTile.cy + (nextTile.height/2);
			var limit = this.radius + (nextTile.width/2);
			
			//right
			if ((this.directions.right || this.nextTurn === "right") && (nextTileX - nextX) <= limit)
			{
				right = true;
			}
			
			//left
			if ((this.directions.left || this.nextTurn === "left") && (nextX - nextTileX) <= limit) 
			{
				left = true;
			}
			
			//up
			if ((this.directions.up || this.nextTurn === "up") && (nextY - nextTileY) <= limit) 
			{
				up = true;
			}
			
			//down
			if ((this.directions.down || this.nextTurn === "down") && (nextTileY - nextY) <= limit) 
			{
				down = true;
			}
		}
		else if (nextTile.hasCake)
		{
			if(g_soundOn) {
				this.wakaSound.play();
			}
			nextTile.hasCake = false;
			this.score += 10;
			this.cakesEaten++;
		}
		else if (nextTile.hasFruit)
		{
			if(g_soundOn) {
				this.cherrySound.play();
			}
			if (nextTile.Fruit === "cherry") {
				this.score += 100;
				this.renderScore("100");
			}
			if (nextTile.Fruit === "strawberry") {
				this.score += 300;
				this.renderScore("300");
			}
			nextTile.hasFruit = false;
		}
		else if (nextTile.hasPill) {
			nextTile.hasPill = false;
			this.score += 50;
			this.renderScore("50");
			
			var lastMode = this.lastMode;
			
			// renew frightened mode
			if (this.mode === "frightened") {
				this.timer.pause();
				this.blinkTimer.pause();
				entityManager.blink = false;
			}
			entityManager.setMode("frightened");
			this.blinkTimer = new Timer (setBlink, 7000);
			
			function setBlink() {
				entityManager.blink = true;
			}
			
			entityManager.timeout.pause();
			
			function resumeTime() {
				entityManager.setMode(lastMode);
				entityManager.blink = false;
				entityManager.timeout.resume();
			}
			
			//set frightened mode for 10 seconds
			this.timer = new Timer(resumeTime, 10000);
				
		}
		
	}
	return {
			left: left, 
			right: right,
			up: up,
			down: down
			};
};

Pacman.prototype.pauseTimers = function () {
	if (!this.timer || !this.blinkTimer) return;
	
	this.timer.pause();
	this.blinkTimer.pause();
	entityManager.blink = false;
};

Pacman.prototype.updateScore = function (score) {
	sideText.updateScoreText(this.score);
	
	if (this.cakesEaten === 70 || this.cakesEaten === 170) {
		var tile = entityManager.getTile(215,280,3);
		tile.putFruit(this.cakesEaten, tile);
	}
	if (this.cakesEaten === 0) {
		entityManager.setFree("red");
		entityManager.setFree("pink");
	}
	if (this.cakesEaten === 30) {
		entityManager.setFree("blue");
	}	
	if (this.cakesEaten === 80) {
		entityManager.setFree("orange");
	}
	if (this.cakesEaten === 222) {
		entityManager.releaseElroy();
	}
	if (this.cakesEaten >= 242) {		// all cakes
		this.maybeWin();
	}
};

Pacman.prototype.updateLives = function () {
	sideText.updateLivesText(this.lives);
	if (this.lives <= 0) {
		GameEnd.gameIsOver(this.score);
	}
};

Pacman.prototype.setChaseMode = function () {
	this.mode = "chase";
	this.speedDown();
};

Pacman.prototype.setScatterMode = function () {
	this.mode = "scatter";
	this.speedDown();
};

Pacman.prototype.setFrightenedMode = function () {
	this.mode = "frightened";
	this.speedUp();
};

Pacman.prototype.setCagedMode = function () {
};

Pacman.prototype.setDeadMode = function () {
};

Pacman.prototype.handleCollision = function (ghost) {
	if ((ghost.mode === "scatter" || ghost.mode === "chase") && ghost.mode != "dead") {	
		this.loseLife(ghost);
	}
	else if (ghost.mode === "frightened") {
		this.eatGhost(ghost);
	}
};
Pacman.prototype.loseLife = function (ghost) {
	if(g_soundOn) {
		this.diesSound.play();
	}
	entityManager.resetGuys();
	this.lives--;
	GameEnd.loseLife();
};

Pacman.prototype.eatGhost = function (ghost) {
	if(g_soundOn) {
		this.eatGhostSound.play();
	}

	ghost.setDeadMode();
	ghost.setLastMode();
	this.score += 200;
	this.renderScore("200");
};

Pacman.prototype.renderScore = function (points) {
	GameEnd.doRenderScore(points);
	var timeout = setTimeout (function() {GameEnd.renderScore = false;}, 1500);
};

Pacman.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.radius = this.reset_radius;
	this.mode = this.lastMode;
	this.resetDirections();
	this.nextTurn = false;
};

Pacman.prototype.restart = function () {
    this.reset();
	this.resetLives();
	this.resetScore();
	this.resetCakesEaten();
	this.velX = (0.8*2);
	this.velY = (0.8*2);
};

Pacman.prototype.setNewLevel = function () {
	this.reset();
	this.resetCakesEaten();
	if (GameEnd.level === 2) {
		this.velX = (0.9*2);
		this.velY = (0.9*2);
	}
};

Pacman.prototype.resetLives = function() {
	this.lives = 3;
};

Pacman.prototype.resetScore = function() {
	this.score = 0;
};

Pacman.prototype.resetCakesEaten = function() {
	this.cakesEaten = 0;
};

Pacman.prototype.maybeWin = function() {
	if (GameEnd.level === 1) {
		GameEnd.nextLevel();
	}
	else if (GameEnd.level === 2) {
		GameEnd.gameIsWon();
		if(g_soundOn) {
			this.interSound.play();
		}
	}
};

Pacman.prototype.speedUp = function () {
	if (GameEnd.level === 1) {
		this.velX = (0.9*2);
		this.velY = (0.9*2);
	}
	else if (GameEnd.level === 2) {
		this.velX = (0.95*2);
		this.velY = (0.95*2);
	}
};

Pacman.prototype.speedDown = function () {
	if (GameEnd.level === 1) {
		this.velX = (0.8*2);
		this.velY = (0.8*2);
	}
	else if (GameEnd.level === 2) {
		this.velX = (0.9*2);
		this.velY = (0.9*2);
	}
};



//rendering
Pacman.prototype.g_cel_left = 51;
Pacman.prototype.g_cel_up = 0;
Pacman.prototype.g_cel_down = 34;
Pacman.prototype.g_cel_right = 17;

Pacman.prototype.isColliding_left;
Pacman.prototype.isColliding_up;
Pacman.prototype.isColliding_down;
Pacman.prototype.isColliding_right;

Pacman.prototype.render = function (ctx) {
	var cel;

    	if(!this.directions.left && !this.directions.right && 
    		!this.directions.up && !this.directions.down)
    	{
    		cel = g_sprites[18];
    		cel.drawAt(ctx, this.cx, this.cy, this.radius);
    	}
		if(this.directions.left) 
		{
			if(this.isColliding_left || GameEnd.gameWon || g_isUpdatePaused || GameEnd.gameOver) {
				this.renderSprite(52);
			} else {
				this.renderSprite(this.g_cel_left);
				++this.g_cel_left;
				if (this.g_cel_left === 55) this.g_cel_left = 51;
			}
		}
		if(this.directions.up) 
		{
			if(this.isColliding_up || GameEnd.gameWon || g_isUpdatePaused || GameEnd.gameOver) {
				this.renderSprite(1);
			} else {
				this.renderSprite(this.g_cel_up);
				++this.g_cel_up;
				if (this.g_cel_up === 4) this.g_cel_up = 0;
			}
		}
		if(this.directions.down) 
		{
			if(this.isColliding_down || GameEnd.gameWon || g_isUpdatePaused || GameEnd.gameOver) {
				this.renderSprite(35);
			} else {
				this.renderSprite(this.g_cel_down);
				++this.g_cel_down;
				if (this.g_cel_down === 38) this.g_cel_down = 34;
			}
		}
		if(this.directions.right) 
		{
			if(this.isColliding_right || GameEnd.gameWon || g_isUpdatePaused || GameEnd.gameOver) {
				this.renderSprite(18);
			} else {
				this.renderSprite(this.g_cel_right);
				++this.g_cel_right;
				if (this.g_cel_right === 21) this.g_cel_right = 17;
			}
		}
};

Pacman.prototype.renderSprite = function(sprite) {
	var cel = g_sprites[sprite];
	cel.drawAt(ctx, this.cx, this.cy, this.radius);
};
