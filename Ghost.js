// ==========
// Ghost
// ==========


// A generic contructor which accepts an arbitrary descriptor object
function Ghost(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Ghost;
    
    this.init();
    
};

Ghost.prototype = new Entity();

// Initial, inheritable, default values
//Movement and positions
Ghost.prototype.radius = 12;
Ghost.prototype.velX = (0.75*2);
Ghost.prototype.velY = (0.75*2);

Ghost.prototype.numSubSteps = 2;
Ghost.prototype.directions;

Ghost.prototype.targetTile = false; 
Ghost.prototype.color;
Ghost.prototype.mode = "caged";
Ghost.prototype.lastMode = "scatter";
Ghost.prototype.gameMode = "scatter";
Ghost.prototype.lastGameMode = "scatter";	// er ég að nota???
Ghost.prototype.free = false;

Ghost.prototype.init = function() {

	this.directions = {
		left : true,
		right : false,
		up : false, 
		down : false
	};
	this.nextTurn = false;
};

// HACKED-IN AUDIO (no preloading)
Ghost.prototype.sirenSound = new Audio("sounds/pacmansiren.mp3");

//Functions
Ghost.prototype.update = function (du) {
	
    spatialManager.unregister(this);
		
	this.setTargetTile();
	
	if(!this.targetTile)
		return; 
		
	this.getAIDirection(du);
	
	var steps = this.numSubSteps;
	var dStep = du / steps;	
	for (var i = 0; i < steps; ++i) 
	{
		this.Move(dStep);
	}
	
	if (this.mode != "dead") spatialManager.register(this);

	if (this.mode === "frightened" && g_soundOn){
		this.sirenSound.play();
	}
	
	if (this.color === "pink") {
		console.log("pink mode: " + this.mode);
	}
	
};


Ghost.prototype.setTargetTile = function () {
	
	if (this.color === "red") {
		this.setTargetForRed();	
	}
	if (this.color === "pink") {
		this.setTargetForPink();	
	}
	if (this.color === "orange") {
		this.setTargetForOrange();	
	}
	if (this.color === "blue") {
		this.setTargetForBlue();	
	}
};

Ghost.prototype.setTargetForRed = function () { 
	var targetTile = false;
	
	if (this.mode === "scatter") 
	{
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	
	else if (this.mode === "chase") 
	{
		var pacman = entityManager.getPacman();
		targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
	}
	else if (this.mode === "caged")		
	{
		targetTile = entityManager.getTile(250,180,3);    // outside box to the right
	}
	else if (this.mode === "dead" || this.mode === "frightened") 
	{
		targetTile = entityManager.getTile(240,190,3);	// above box
	}

	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForPink = function () { 
	var targetTile = false;

	if (this.mode === "scatter") 
	{
		targetTile = entityManager.getTile(17,17,5);    // upper left corner
	}
	
	else if (this.mode === "chase") 
	{ 
		var pacman = entityManager.getPacman();
		var pacTile = targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
		var upperRange = 15;
		var lowerRange = 485;
		var rightRange = 435;
		var leftRange = 15;

		if (pacman.directions.up) {
			var nextCY = pacman.cy-(4*pacTile.height);
			if(nextCY > upperRange) {
					targetTile = entityManager.getTile(pacman.cx, nextCY, pacman.radius);
			}
			else {
					targetTile = entityManager.getTile(pacman.cx, upperRange, pacman.radius);
			}
		}
		else if (pacman.directions.down) {
			var nextCY = pacman.cy+(4*pacTile.height);
			if(nextCY < lowerRange) {
					targetTile = entityManager.getTile(pacman.cx, nextCY, pacman.radius);
			}
			else {
					targetTile = entityManager.getTile(pacman.cx, lowerRange, pacman.radius);
			}
		}
		else if (pacman.directions.left) {
			var nextCX = pacman.cx-(4*tileWidth);
			
			if(nextCX > leftRange) {
					targetTile = entityManager.getTile(nextCX, pacman.cy, pacman.radius);
			}
			else {
					targetTile = entityManager.getTile(leftRange, pacman.cy, pacman.radius);
			}
		}
		else if (pacman.directions.right)
		{
			var nextCX = pacman.cx+(4*tileWidth);
			
			if(nextCX < rightRange) {
					targetTile = entityManager.getTile(nextCX, pacman.cy, pacman.radius);
			}
			else {
					targetTile = entityManager.getTile(rightRange, pacman.cy, pacman.radius);
			}
		}
	}
	else if (this.mode === "caged")		
	{
		targetTile = entityManager.getTile(190,180,3);;    // outside box to the left
		
	}
	else if (this.mode === "dead" || this.mode === "frightened") 
	{
		targetTile = entityManager.getTile(240,190,3);	// above box
	}

	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForOrange = function () { 
	if (!this.free) return;
	
	var targetTile = false;
	var pacman = entityManager.getPacman();
	var pacTile = targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
	
	if (this.mode === "scatter") 
	{
		targetTile = entityManager.getTile(17,470,5);		// bottom left corner
	}
	
	else if (this.mode === "chase") 
	{
		var distanceFromPacman = Math.round(util.distSq(pacman.cx, pacman.cy, this.cx, this.cy));
		if(distanceFromPacman < util.square(8*tileWidth)) 
		{
			targetTile = entityManager.getTile(17,470,5);	// bottom left corner
		}
		else if (distanceFromPacman >= util.square(8*tileWidth)) 
		{
			targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
		}
		
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(190,180,3);;    // outside box to the left
	}
	else if (this.mode === "dead" || this.mode === "frightened") 
	{	
		targetTile = entityManager.getTile(240,190,3);	// above box
	}
	
	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForBlue = function () { 
	if (!this.free) return;
	
	var targetTile = false;

	if (this.mode === "scatter") 
	{ 
		targetTile = entityManager.getTile(430,470,5);    //bottom right corner
	}
	
	else if (this.mode === "chase") 
	{
		var pacman = entityManager.getPacman();
		var pacTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
		
		var redPos = entityManager.getRedPos();
		
		var cx = pacman.cx;
		var cy = pacman.cy;
		var blueX;
		var blueY;
		
		if (pacman.directions.up) { 
			cy = cy - (2*pacTile.height);

			if (cx > redPos.posX) {
				blueX = (cx-redPos.posX)+cx;
			}
			else {
				blueX = cx-(redPos.posX-cx);
			}

			if (cy > redPos.posY) { 
				blueY = (cy-redPos.posY)+cy;
			}
			else {
				blueY = cy-(redPos.posY-cy);
			}
        }
        
		else if (pacman.directions.down) { 
			cy = cy + (2*pacTile.height);

			if (cx > redPos.posX) {
				blueX = (cx-redPos.posX)+cx;
			}
			else {
				blueX = cx-(redPos.posX-cx);
			}

			if (cy > redPos.posY) { 
				blueY = (cy-redPos.posY)+cy;
			}
			else {
				blueY = cy-(redPos.posY-cy);
			}
		}
		
		else if (pacman.directions.left) { 
			cx = cx - (2*tileWidth);
			
			if (cx > redPos.posX) { 
				blueX = (cx-redPos.posX)+cx;
			}
			else { 
				blueX = cx-(redPos.posX-cx);
			}

			if (cy > redPos.posY) { 
				blueY = (cy-redPos.posY)+cy; 
			}
			else { 
				blueY = cy-(redPos.posY-cy);
			}
		}
		else if (pacman.directions.right) {
			cx = cx + (2*tileWidth);
			if (cx > redPos.posX) { 
				blueX = (cx-redPos.posX)+cx;
			}
			else { 
				blueX = cx-(redPos.posX-cx);
			}

			if (cy > redPos.posY) { 
				blueY = (cy-redPos.posY)+cy; 
			}
			else { 
				blueY = cy-(redPos.posY-cy);
			}
		}

		//So that targetTiles won't get assigned outside the maze
		if(blueX < 15) blueX = 15;
		if(blueY < 15) blueY = 15;
		if(blueX > 435) blueX = 435;
		if(blueY > 485) blueY = 485;

		targetTile = entityManager.getTile(blueX, blueY, this.radius);
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(220,170,3);;    // outside box to the right
	}
	else if (this.mode === "dead" || this.mode === "frightened") 
	{	
		targetTile = entityManager.getTile(240,190,3);	// above box
	}
	
	this.targetTile = targetTile;
};

Ghost.prototype.isWallColliding = function (nextTile, nextX, nextY) {
	
	var startingGhostTile = entityManager.getTile(230,200,3);
	var startingGhostTile2 = entityManager.getTile(220,200,3);	
	var left, right, up, down = false;
	
	if (nextTile)
	{	
		if (nextTile.type == "1") 
		{
			var nextTileX = nextTile.cx + (nextTile.width/2);
			var nextTileY = nextTile.cy + (nextTile.height/2);
			var limit = this.radius + (nextTile.width/2);
			
			//right
			if ((this.directions.right || this.nextTurn === "right") && (nextTileX - nextX) <= limit){
				right = true;
			}
			
			//left
			if ((this.directions.left || this.nextTurn === "left") && (nextX - nextTileX) <= limit) {
				left = true;
			}
			
			//up
			if ((this.directions.up || this.nextTurn === "up") && (nextY - nextTileY) <= limit) {
				up = true;
			}
			
			//down
			if ((this.directions.down || this.nextTurn === "down") && (nextTileY - nextY) <= limit) {
				down = true;
			}
		}
		
	}
	return {
			left: left, 
			right: right,
			up: up,
			down: down
			};
};


Ghost.prototype.setChaseMode = function () {
	if (!this.free || this.mode === "caged" || this.mode === "dead") return;
	
	this.lastGameMode = this.gameMode;
	this.mode = "chase";
	this.gameMode = "chase";
	this.speedUp();
	this.switchDirection();
};

Ghost.prototype.cagedToChaseMode = function () {
	if (!this.free || this.mode === "dead") return;
	
	this.lastGameMode = this.gameMode;
	this.mode = "chase";
	this.gameMode = "chase";
	this.speedUp();
};

Ghost.prototype.setScatterMode = function () {
	if (!this.free || this.mode === "caged"  || this.mode === "dead") return;
	
	this.lastGameMode = this.gameMode;
	this.mode = "scatter";
	this.gameMode = "scatter";
	this.speedUp();
	this.switchDirection();
};

Ghost.prototype.cagedToScatterMode = function () {
	console.log(this.color + " set caged to scatter?????");
	console.log("free: " + this.free);
	if (!this.free || this.mode === "dead") return;
	
	this.lastGameMode = this.gameMode;
	this.mode = "scatter";
	this.gameMode = "scatter";
	this.speedUp();
	
	console.log(this.color + " set caged to scatter");
};

Ghost.prototype.setFrightenedMode = function () {
	this.gameMode = "frightened";
	
	if (!this.free || this.mode === "caged" || this.mode === "dead") return;
	
	this.mode = "frightened";
	if(g_soundOn){
		this.sirenSound.play();
	}
	this.speedDown();
};
Ghost.prototype.cagedToFrightenedMode = function () {
	this.gameMode = "frightened";
	
	if (!this.free || this.mode === "dead") return;
	
	this.mode = "frightened";
	if(g_soundOn){
		this.sirenSound.play();
	}
	this.speedDown();
};

Ghost.prototype.setCagedMode = function () {
	this.mode = "caged";
};

Ghost.prototype.setDeadMode = function () {
	if (!this.free) return;
	
	this.mode = "dead";
	this.speedUp();
};

Ghost.prototype.switchDirection = function () {
	if (this.directions.right) {
		this.setDirectionLeft();
	}
	else if (this.directions.left) {
		this.setDirectionRight();
	}
	else if (this.directions.up) {
		this.setDirectionDown();
	}
	else if (this.directions.down) {
		this.setDirectionUp();
	}
};

Ghost.prototype.speedUp = function () {
	if (GameEnd.level === 1) {
		this.velX = (0.75*2);
		this.velY = (0.75*2);
	}
	else if (GameEnd.level === 2) {
		this.velX = (0.85*2);
		this.velY = (0.85*2);
	}
};

Ghost.prototype.speedDown = function () {
	if (GameEnd.level === 1) {
		this.velX = (0.5*2);
		this.velY = (0.5*2);
	}
	else if (GameEnd.level === 2) {
		this.velX = (0.55*2);
		this.velY = (0.55*2);
	}
};

Ghost.prototype.reset = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.radius = this.reset_radius;
	this.mode = "caged";
	if (this.gameMode === "frightened") this.gameMode = this.lastGameMode;
	this.speedUp();
};

Ghost.prototype.restart = function () {
    this.setPos(this.reset_cx, this.reset_cy);
    this.radius = this.reset_radius;
	this.mode = "caged";
	this.gameMode = "scatter"; 
	this.lastGameMode = "scatter"; 
	this.targetTile = false;
	this.speedUp();
	this.trap();
};

Ghost.prototype.setNewLevel = function () {
	this.restart();
	this.trap();
};

Ghost.prototype.setFree = function () {
    this.free = true;
};

Ghost.prototype.setGameModeScatter = function() {
	this.lastGameMode = this.gameMode;
	this.gameMode = "scatter";
};

Ghost.prototype.setGameModeChase = function() {
	this.lastGameMode = this.gameMode;
	this.gameMode = "chase";
};

Ghost.prototype.trap = function() {
	if (this.color === "red" || this.color === "pink") this.free = true;
	else this.free = false;
};

Ghost.prototype.releaseElroy = function() {
	if (GameEnd.level === 1) {
		this.velX = (0.8*2);
		this.velY = (0.8*2);
	}
	else if (GameEnd.level === 2) {
		this.velX = (0.9*2);
		this.velY = (0.9*2);
	}
	console.log("releasing elroy, speed: " + this.velX);
};


Ghost.prototype.getAIDirection = function(du)
{
	var tileX = this.targetTile.cx + this.targetTile.width/2;
	var tileY = this.targetTile.cy + this.targetTile.height/2;
	var nextPos = this.getNextPos(du);
	
	var thisTile = entityManager.getTile(this.cx, this.cy, this.radius, this.directions);
	var nextTile = entityManager.getTile(nextPos.nextX, nextPos.nextY, this.radius, this.directions);
	
	if (nextTile) {
		
		if (this.mode === "dead" && nextTile === this.targetTile) {
			this.mode = this.lastMode;
		}		
		else if (this.mode === "caged" && nextTile === this.targetTile) {
			//this.mode = this.gameMode;
			if (this.gameMode === "frightened") this.cagedToFrightenedMode();
			else if (this.gameMode === "scatter") {
				this.cagedToScatterMode();
				console.log("here");
			}
			else if (this.gameMode === "chase") this.cagedToChaseMode();
			console.log(this.color + " going from caged to " + this.gameMode);
		}
		
		var nextTileX = nextTile.cx + nextTile.width/2;
		var nextTileY = nextTile.cy + nextTile.height/2;
		
		var tileAbove = entityManager.getTile(this.cx, this.cy - nextTile.height, this.radius, this.directions);
		var tileBelow = entityManager.getTile(this.cx, this.cy + nextTile.height, this.radius, this.directions);
		var tileLeft = entityManager.getTile(this.cx - nextTile.width, this.cy, this.radius, this.directions);
		var tileRight = entityManager.getTile(this.cx + nextTile.width, this.cy, this.radius, this.directions);
		
		var intersection = thisTile.isIntersection();
		
		var startingGhostTile = entityManager.getTile(230,200,3);
		var startingGhostTile2 = entityManager.getTile(220,200,3);
		
		if (intersection) 
		{
			var tileCloserUD = this.targetTile.isCloser(tileAbove, tileBelow); //tileCloser Up or Down
			var tileCloserLR = this.targetTile.isCloser(tileLeft, tileRight); //tileCloser Left or Right

			if (this.directions.right) 
			{
				if (this.mode === "frightened") {
					var randTile;
					
					for (var i = 0; i < 100; i++) {
						randTile = util.randThree(tileAbove, tileBelow, tileRight);
						if (randTile.type === 0 && randTile != startingGhostTile 
							&& randTile != startingGhostTile2) 
								break;
					}
					if (randTile === tileAbove) this.setDirectionUp();
					if (randTile === tileBelow) this.setDirectionDown();
					if (randTile === tileRight) this.setDirectionRight();
				}
				else {
					var tileCloser = this.targetTile.isCloser(tileCloserUD, tileRight);
					
					//so they won't go in the box
					if (tileCloser === startingGhostTile || tileCloser === startingGhostTile2){
						tileCloser = tileRight;
					}
					
					if (tileCloser.type === 0 && tileCloser != tileRight) {
						if (tileCloser === tileAbove) this.setDirectionUp();
						else this.setDirectionDown();
					}
					else if (tileCloser.type === 1) {
						if (tileCloser === tileRight) {
							if (tileCloserUD === tileAbove) {
								this.setDirectionUp();
							}
							else this.setDirectionDown();
						}
						else if (tileCloser === tileAbove) {
							var tileSecondClosest = this.targetTile.isCloser(tileBelow, tileRight);
							if (tileSecondClosest === tileBelow) {
								this.setDirectionDown();
							}
						}
						else if (tileCloser === tileBelow) {
							var tileSecondClosest = this.targetTile.isCloser(tileAbove, tileRight);
							if (tileSecondClosest === tileAbove) {
								this.setDirectionUp();
							}
						}
					}	
				}
			}
			else if (this.directions.left) 
			{
				if (this.mode === "frightened") {
					var randTile;
					
					for (var i = 0; i < 100; i++) {
						randTile = util.randThree(tileAbove, tileLeft, tileBelow);
						if (randTile.type === 0 && randTile != startingGhostTile 
							&& randTile != startingGhostTile2) 
								break;
					}
					if (randTile === tileAbove) this.setDirectionUp();
					if (randTile === tileBelow) this.setDirectionDown();
					if (randTile === tileLeft) this.setDirectionLeft();
				}
				else {
					var tileCloser = this.targetTile.isCloser(tileLeft, tileCloserUD);
					
					if (this.color === "orange" && this.mode === "caged") {
						tileCloser = tileLeft;
					}
					
					//so they won't go in the box
					if (tileCloser === startingGhostTile || tileCloser === startingGhostTile2){
						tileCloser = tileLeft;
					}
					
					if (tileCloser.type === 0 && tileCloser != tileLeft) {
						if (tileCloser === tileAbove) this.setDirectionUp();
						else this.setDirectionDown();
					}
					else if (tileCloser.type === 1) {
						if (tileCloser === tileLeft) {
							if (tileCloserUD === tileAbove) {
								this.setDirectionUp();
							}
							else this.setDirectionDown();
						}
						else if (tileCloser === tileAbove) {
							var tileSecondClosest = this.targetTile.isCloser(tileLeft, tileBelow);
							if (tileSecondClosest === tileBelow) {
								this.setDirectionDown();
							}
						}
						else if (tileCloser === tileBelow) {
							var tileSecondClosest = this.targetTile.isCloser(tileAbove, tileLeft);
							if (tileSecondClosest === tileAbove) {
								this.setDirectionUp();
							}
						}
					}
				}
			}
			else if (this.directions.down) 
			{
				if (this.mode === "frightened") {
					var randTile;
					
					for (var i = 0; i < 100; i++) {
						randTile = util.randThree(tileRight, tileLeft, tileBelow);
						if (randTile.type === 0) break;
					}
					if (randTile === tileRight) this.setDirectionRight();
					if (randTile === tileBelow) this.setDirectionDown();
					if (randTile === tileLeft) this.setDirectionLeft();
				}
				else {
					var tileCloser = this.targetTile.isCloser(tileBelow, tileCloserLR);
					
					if (tileCloser.type === 0 && tileCloser != tileBelow) {
						if (tileCloser === tileLeft) this.setDirectionLeft();
						else this.setDirectionRight();
					}
					else if (tileCloser.type === 1) {
						if (tileCloser === tileBelow) {
							if (tileCloserLR === tileLeft) {
								this.setDirectionLeft();
							}
							else this.setDirectionRight();
						}
						else if (tileCloser === tileLeft) {
							var tileSecondClosest = this.targetTile.isCloser(tileBelow, tileRight);
							if (tileSecondClosest === tileRight) {
								this.setDirectionRight();
							}
						}
						else if (tileCloser === tileRight) {
							var tileSecondClosest = this.targetTile.isCloser(tileLeft, tileBelow);
							if (tileSecondClosest === tileLeft) {
								this.setDirectionLeft();
							}
						}
					}
				}
				
			}
			else if (this.directions.up) 
			{
				if (this.mode === "frightened") {
					var randTile;
					
					for (var i = 0; i < 100; i++) {
						randTile = util.randThree(tileAbove, tileLeft, tileRight);
						if (randTile.type === 0) break;
					}
					if (randTile === tileAbove) this.setDirectionUp();
					if (randTile === tileRight) this.setDirectionRight();
					if (randTile === tileLeft) this.setDirectionLeft();
				}
				else {
					var tileCloser = this.targetTile.isCloser(tileAbove, tileCloserLR);
					
					if (tileCloser.type === 0 && tileCloser != tileAbove) {
						if (tileCloser === tileLeft) this.setDirectionLeft();
						else this.setDirectionRight();
					}
					else if (tileCloser.type === 1) {
						if (tileCloser === tileAbove) {
							if (tileCloserLR === tileLeft) {
								this.setDirectionLeft();
							}
							else this.setDirectionRight();
						}
						else if (tileCloser === tileLeft) {
							var tileSecondClosest = this.targetTile.isCloser(tileAbove, tileRight);
							if (tileSecondClosest === tileRight) {
								this.setDirectionRight();
							}
						}
						else if (tileCloser === tileRight) {
							var tileSecondClosest = this.targetTile.isCloser(tileAbove, tileLeft);
							if (tileSecondClosest === tileLeft) {
								this.setDirectionLeft();
							}
						}
					}
				}	
			}
		}
		// if ghost hits walls
		else if (nextTile.type === 1) {
			
			if (this.directions.right || this.directions.left) {
				if (tileAbove.type === 0) {
					this.setDirectionUp();
				}
				else {
					this.setDirectionDown();
				}
			}
			else if (this.directions.down || this.directions.up) {
				if (tileRight.type === 0) {
					this.setDirectionRight();
				}
				else {
					this.setDirectionLeft();
				}
			}
		}
	}
	
};

//rendering
var blue_left = 57;
var blue_up = 6;
var blue_down = 40;
var blue_right = 23;

var pink_left = 59;
var pink_up = 8;
var pink_down = 42;
var pink_right = 25;

var orange_left = 61;
var orange_up = 10;
var orange_down = 44;
var orange_right = 27;

var red_left = 55;
var red_up = 4;
var red_down = 38;
var red_right = 21;

//frightened mode
var frightened_ghost = 13;
var frightened_ghost_2 = 30;
var frightened_ghost_3 = 47;
var frightened_ghost_4 = 64;

//dead mode
var dead_left = 63;
var dead_up = 12;
var dead_down = 46;
var dead_right = 29;

var blink = false;

Ghost.prototype.render = function (ctx) {
	var cel;
		if(this.mode === "frightened") {
			if(this.color === "blue") {
				this.renderSprite(frightened_ghost);
				++frightened_ghost;
				if(!blink) {
					if (frightened_ghost >= 15) frightened_ghost = 13;
				}
				if(blink) {
					if (frightened_ghost === 17) frightened_ghost = 13;
				}
			}
			if(this.color === "pink") {
				this.renderSprite(frightened_ghost_2);
				++frightened_ghost_2;
				if(!blink) {
					if (frightened_ghost_2 >= 32) frightened_ghost_2 = 30;
				}
				if(blink) {
					if (frightened_ghost_2 === 34) frightened_ghost_2 = 30;
				}
			}
			if(this.color === "orange") {
				this.renderSprite(frightened_ghost_3);
				++frightened_ghost_3;
				if(!blink) {
					if (frightened_ghost_3 >= 49) frightened_ghost_3 = 47;
				} else {
					if (frightened_ghost_3 === 51) frightened_ghost_3 = 47;
				}
			}
			if(this.color === "red") {
				this.renderSprite(frightened_ghost_4);
				++frightened_ghost_4;
				if(!blink) {
					if (frightened_ghost_4 >= 66) frightened_ghost_4 = 64;
				} else {
					if (frightened_ghost_4 === 68) frightened_ghost_4 = 64;
				}
			}
		} else if(this.mode === "dead") {
			if(this.directions.left) this.renderSprite(dead_left);
			if(this.directions.right) this.renderSprite(dead_right);
			if(this.directions.up) this.renderSprite(dead_up);
			if(this.directions.down) this.renderSprite(dead_down);
		} else {
			if(this.color === "blue") 
			{
				if(!this.directions.left && !this.directions.right && 
				!this.directions.up && !this.directions.down) 
				{
    					cel = g_sprites[6];
					cel.drawAt(ctx, this.cx, this.cy, this.radius);
    			}
				if(this.directions.left) 
				{
					this.renderSprite(blue_left);
					++blue_left;
		 			if (blue_left === 59) 
		 			blue_left = 57;
				}
				if(this.directions.up) 
				{
					this.renderSprite(blue_up);
					++blue_up;
		 			if (blue_up === 8) 
		 			blue_up = 6;
				}
				if(this.directions.down) 
				{
					this.renderSprite(blue_down);
					++blue_down;
		 			if (blue_down === 42) 
		 			blue_down = 40;
				}
				if(this.directions.right) 
				{
					this.renderSprite(blue_right);
					++blue_right;
		 			if (blue_right === 25) 
		 			blue_right = 23;
				}
			}
			if(this.color === "pink") 
			{
				if(!this.directions.left && !this.directions.right && 
				!this.directions.up && !this.directions.down) 
				{
    					cel = g_sprites[8];
					cel.drawAt(ctx, this.cx, this.cy, this.radius);
    			}
				if(this.directions.left) 
				{
					this.renderSprite(pink_left);
					++pink_left;
		 			if (pink_left === 61) 
		 			pink_left = 59;
				}
				if(this.directions.up) 
				{
					this.renderSprite(pink_up);
					++pink_up;
		 			if (pink_up === 10) 
		 			pink_up = 8;
				}
				if(this.directions.down) 
				{
					this.renderSprite(pink_down);
					++pink_down;
		 			if (pink_down === 44) 
		 			pink_down = 42;
				}
				if(this.directions.right) 
				{
					this.renderSprite(pink_right);
					++pink_right;
		 			if (pink_right === 27) 
		 			pink_right = 25;
				}
			}
			if(this.color === "orange") 
			{
				if(!this.directions.left && !this.directions.right && 
				!this.directions.up && !this.directions.down) 
				{
    				cel = g_sprites[10];
					cel.drawAt(ctx, this.cx, this.cy, this.radius);
    			}
				if(this.directions.left) 
				{
					this.renderSprite(orange_left);
					++orange_left;
		 			if (orange_left === 63) 
		 			orange_left = 61;
				}
				if(this.directions.up) 
				{
					this.renderSprite(orange_up);
					++orange_up;
		 			if (orange_up === 12) 
		 			orange_up = 10;
				}
				if(this.directions.down) 
				{
					this.renderSprite(orange_down);
					++orange_down;
		 			if (orange_down === 46) 
		 			orange_down = 44;
				}
				if(this.directions.right) 
				{
					this.renderSprite(orange_right);
					++orange_right;
		 			if (orange_right === 29) 
		 			orange_right = 27;
				}
			}
			if(this.color === "red")
			{
				if(!this.directions.left && !this.directions.right && 
				!this.directions.up && !this.directions.down) 
				{
    				cel = g_sprites[4];
					cel.drawAt(ctx, this.cx, this.cy, this.radius);
    			}
				if(this.directions.left)
				{
					this.renderSprite(red_left);
					++red_left;
		 			if (red_left === 57) 
		 			red_left = 55;
				}
				if(this.directions.up)
				{
					this.renderSprite(red_up);
					++red_up;
		 			if (red_up === 6) 
		 			red_up = 4;
				}
				if(this.directions.down)
				{
					this.renderSprite(red_down);
					++red_down;
		 			if (red_down === 40) 
		 			red_down = 38;
				}
				if(this.directions.right)
				{
					this.renderSprite(red_right);
					++red_right;
		 			if (red_right === 23) 
		 			red_right = 21;
				}
			}
		}
};

Ghost.prototype.renderSprite = function(sprite) {
	var cel = g_sprites[sprite];
	cel.drawAt(ctx, this.cx, this.cy, this.radius);
};
