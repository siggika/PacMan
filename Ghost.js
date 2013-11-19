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
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this.init();
    
};

Ghost.prototype = new Entity();

// Initial, inheritable, default values
//Movement and positions
Ghost.prototype.radius = 12;
Ghost.prototype.velX = 2;
Ghost.prototype.velY = 2;

Ghost.prototype.numSubSteps = 2;
//Ghost.prototype.start = true;
Ghost.prototype.directions;

//AI and individual Attributes
Ghost.prototype.targetTile = false; 
Ghost.prototype.color;
Ghost.prototype.type = "ghost";
Ghost.prototype.mode = "scatter";
Ghost.prototype.lastMode = "scatter";

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

	if(this._isDeadNow) 
		return entityManager.KILL_ME_NOW;  
		
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
	
};

Ghost.prototype.getAIDirection = function(du)
{
	//this.targetTile.debug = true;
	var tileX = this.targetTile.cx + this.targetTile.width/2;
	var tileY = this.targetTile.cy + this.targetTile.height/2;
	var nextPos = this.getNextPos(du);
	
	// first move just to get red ghost moving
	// needs better to get everybody out of the cage
	/*if (this.start) {
		if (tileX < this.cx) {
			this.directions.left = true;
		}
		if (tileX > this.cx) {
			this.directions.right = true;
		}
		this.start = false;
	}	*/
	
	var thisTile = entityManager.getTile(this.cx, this.cy, this.radius, this.directions);
	var nextTile = entityManager.getTile(nextPos.nextX, nextPos.nextY, this.radius, this.directions);
	
	if (nextTile) {
		
		if (this.mode === "dead" && nextTile === this.targetTile) {
			console.log("here");
			this.mode = this.lastMode;
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
					if (this.mode != "dead" && (tileCloser === startingGhostTile || tileCloser === startingGhostTile2)){
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
					
					//so they won't go in the box
					if (this.mode != "dead" && (tileCloser === startingGhostTile || tileCloser === startingGhostTile2)){
						console.log("here");
						console.log(this.color);
						console.log(this.mode);
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
			//tileCloser.debug2 = true;
		}
		// if ghosts hit walls
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


Ghost.prototype.setTargetTile = function () {
	
	if (this.color === "red") {
		this.setTargetForRed();	
	}
	if (this.color === "pink") {
		this.setTargetForPink();	
	}
	if (this.color === "orange") {
		//this.setTargetForOrange();	
	}
	if (this.color === "blue") {
		//this.setTargetForBlue();	
	}
};

Ghost.prototype.setTargetForRed = function () { 
	var targetTile = false;
	
	if (this.mode === "scatter") 
	{ //done
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	
	else if (this.mode === "chase") 
	{ //done
		var pacman = entityManager.getPacman();
		targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
	}
	else if (this.mode === "frightened") 
	{
		//targetTile = false; 
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(230,190,3);;    // outside box
	}
	else if (this.mode === "dead") {
		targetTile = entityManager.getTile(230,200,3);    //inside box
	}

	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForPink = function () { 
	var targetTile = false;

	if (this.mode === "scatter") 
	{ //done
		targetTile = entityManager.getTile(17,17,5);    // upper left corner
	}
	
	else if (this.mode === "chase") 
        { //done
                var pacman = entityManager.getPacman();
                var upperRange = 15;
                var lowerRange = 485;
                var rightRange = 435;
                var leftRange = 15;

                if(pacman.directions.up) {
                        var nextCY = pacman.cy-(4*pacman.radius);
                        if(nextCY > upperRange) {
                                targetTile = entityManager.getTile(pacman.cx, nextCY, pacman.radius);
                        }
                        else {
                                targetTile = entityManager.getTile(pacman.cx, upperRange, pacman.radius);
                        }
                }
                else if(pacman.directions.down) {
                        var nextCY = pacman.cy+(4*pacman.radius);
                        if(nextCY < lowerRange) {
                                targetTile = entityManager.getTile(pacman.cx, nextCY, pacman.radius);
                        }
                        else {
                                targetTile = entityManager.getTile(pacman.cx, lowerRange, pacman.radius);
                        }
                }
                else if(pacman.directions.left) {
                        var nextCX = pacman.cx-(4*pacman.radius);
                        if(nextCX > leftRange) {
                                targetTile = entityManager.getTile(nextCX, pacman.cy, pacman.radius);
                        }
                        else {
                                targetTile = entityManager.getTile(leftRange, pacman.cy, pacman.radius);
                        }
                }
                else if(pacman.directions.right)
                {
                        var nextCX = pacman.cx+(4*pacman.radius);
                        if(nextCX < rightRange) {
                                targetTile = entityManager.getTile(nextCX, pacman.cy, pacman.radius);
                        }
                        else {
                                targetTile = entityManager.getTile(rightRange, pacman.cy, pacman.radius);
                        }
                }
                //console.log("targetTile = ("+targetTile.cx+","+targetTile.cy+")");
        }
	else if (this.mode === "frightened") 
	{
		//targetTile = false; 
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(230,190,3);;    // outside box		
	}
	else if (this.mode === "dead") {
		targetTile = entityManager.getTile(220,200,3);    //inside box
	}

	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForOrange = function () { 
	var targetTile = false;
	var pacman = entityManager.getPacman();

	if (this.mode === "scatter") 
	{ // done
		targetTile = entityManager.getTile(17,470,5);		// bottom left corner
	}
	
	else if (this.mode === "chase") 
	{ //done
		var distanceFromPacman = Math.round(util.distSq(pacman.cx, pacman.cy, this.cx, this.cy)/2000);

		if(distanceFromPacman < 8) 
		{
			targetTile = entityManager.getTile(17,470,5);
			//console.log("orange Scatter");
		}
		else if (distanceFromPacman >= 8) 
		{
			targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
			//console.log("orange Chase");
		}
	}
	else if (this.mode === "frightened") 
	{
		//targetTile = false; 
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(230,190,3);;    // outside box
	}
	else if (this.mode === "dead") {
		targetTile = entityManager.getTile(230,200,3);    //inside box
	}
	
	this.targetTile = targetTile;
};

Ghost.prototype.setTargetForBlue = function () { 
	var targetTile = false;

	if (this.mode === "scatter") 
	{ //done
		targetTile = entityManager.getTile(430,470,5);    //bottom right corner
	}
	
	else if (this.mode === "chase") 
	{
		var pacman = entityManager.getPacman();
		targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
	}
	else if (this.mode === "frightened") 
	{
		//targetTile = false; 
		targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	else if (this.mode === "caged")
	{
		targetTile = entityManager.getTile(230,190,3);;    // outside box
	}
	else if (this.mode === "dead") {
		targetTile = entityManager.getTile(230,200,3);    //inside box
	}
	
	this.targetTile = targetTile;
};

Ghost.prototype.getsEaten = function () {
    this.kill();
};



Ghost.prototype.isWallColliding = function (nextTile, nextX, nextY) {
	
	var startingGhostTile = entityManager.getTile(230,200,3);
	var startingGhostTile2 = entityManager.getTile(220,200,3);	
	var left, right, up, down = false;
	
	if (nextTile)
	{	
		//the ghost box
		/*if (nextTile === startingGhostTile || nextTile === startingGhostTile2) {
			down = true;
			//console.log("colliding down");
		}*/
	
		if (nextTile.type == "1") 
		{
			var nextTileX = nextTile.cx + (nextTile.width/2);
			var nextTileY = nextTile.cy + (nextTile.height/2);
			var limit = this.radius + (nextTile.width/2);
			
			//right
			if ((this.directions.right || this.nextTurn === "right") && (nextTileX - nextX) <= limit)
			{
				right = true;
				//console.log("colliding right");
			}
			
			//left
			if ((this.directions.left || this.nextTurn === "left") && (nextX - nextTileX) <= limit) 
			{
				left = true;
				//console.log("colliding left");
			}
			
			//up
			if ((this.directions.up || this.nextTurn === "up") && (nextY - nextTileY) <= limit) 
			{
				up = true;
				//console.log("colliding up");
			}
			
			//down
			if ((this.directions.down || this.nextTurn === "down") && (nextTileY - nextY) <= limit) 
			{
				down = true;
				//console.log("colliding down");
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
	this.mode = "chase";
	this.speedUp();
	this.switchDirection();
};

Ghost.prototype.setScatterMode = function () {
	this.mode = "scatter";
	this.speedUp();
	this.switchDirection();
};

Ghost.prototype.setFrightenedMode = function () {
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
	this.velX = 2;
	this.velY = 2;
};

Ghost.prototype.speedDown = function () {
	this.velX = 1;
	this.velY = 1;
};
