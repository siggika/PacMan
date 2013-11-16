// ==========
// Guys
// ==========


// A generic contructor which accepts an arbitrary descriptor object
function Guy(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);

    this.rememberResets();
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.Guy;
    
    // Set normal drawing scale, and warp state off
    this._scale = 1;
    this.init();
    
};

Guy.prototype = new Entity();

Guy.prototype.rememberResets = function () {

    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_radius = this.radius;
};

Guy.prototype.KEY_UP    = 'W'.charCodeAt(0);
Guy.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Guy.prototype.KEY_LEFT  = 'A'.charCodeAt(0);
Guy.prototype.KEY_RIGHT = 'D'.charCodeAt(0);

// Initial, inheritable, default values
//Movement and positions
Guy.prototype.radius = 12;
Guy.prototype.cx = 25;
Guy.prototype.cy = 25;
Guy.prototype.velX = 2;
Guy.prototype.velY = 2;
Guy.prototype.nextTurn = false;
Guy.prototype.currentDirection = false;


Guy.prototype.score = 0;
Guy.prototype.cakesEaten = 0;

Guy.prototype.numSubSteps = 2;
Guy.prototype.start = true;
Guy.prototype.directions;

Guy.prototype.init = function() {

	this.directions = {
		left : false,
		right : false,
		up : false, 
		down : false
	};
	this.currentDirection = false;
	this.nextTurn = false;

};

//AI and individual Attributes
Guy.prototype.ai = false;
Guy.prototype.targetTile = false; 
Guy.prototype.color = "yellow";
Guy.prototype.type = "pacman";
Guy.prototype.score = 0;
Guy.prototype.mode = "scatter";

// HACKED-IN AUDIO (no preloading)
/*Guy.prototype.warpSound = new Audio(
    "sounds/GuyWarp.ogg");
*/

//Functions
Guy.prototype.update = function (du) {
         
      
    //spatialManager.unregister(this);
	var steps = this.numSubSteps;
	var dStep = du / steps;	
	
	if(this._isDeadNow) 
		return entityManager.KILL_ME_NOW;  
		
    if(this.ai)
    {
    	this.setTargetTile();
		if(!this.targetTile)
    		return; 
    	this.getAIDirection(du);
    	for (var i = 0; i < steps; ++i) 
    	{
        	this.Move(dStep);
    	}
    }          
	
	if(!this.ai) 
	{	
		this.updateDirections(du);  
		for (var i = 0; i < steps; ++i) 
		{
			this.Move(dStep);
		}
		this.updateScore();
	}
    //spatialManager.register(this);
};

Guy.prototype.resetDirections = function() {
	this.directions = { 
		left : false,
		right : false,
		up : false, 
		down : false
	};
};

Guy.prototype.getAIDirection = function(du)
{
	//this.targetTile.debug = true;
	var tileX = this.targetTile.cx + this.targetTile.width/2;
	var tileY = this.targetTile.cy + this.targetTile.height/2;
	var nextPos = this.getNextPos(du);
	
	// first move just to get red ghost moving
	// needs better to get everybody out of the cage
	if (this.start) {
		if (tileX < this.cx) {
			this.directions.left = true;
		}
		if (tileX > this.cx) {
			this.directions.right = true;
		}
		this.start = false;
	}	
	
	var thisTile = entityManager.getTile(this.cx, this.cy, this.radius, this.directions);
	var nextTile = entityManager.getTile(nextPos.nextX, nextPos.nextY, this.radius, this.directions);
	
	if (nextTile) {
		
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
			else if (this.directions.left) 
			{
				var tileCloser = this.targetTile.isCloser(tileLeft, tileCloserUD);
				
				//so they won't go in the box
				if (tileCloser === startingGhostTile || tileCloser === startingGhostTile2) {
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
			else if (this.directions.down) 
			{
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
			else if (this.directions.up) 
			{
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

Guy.prototype.setTargetTile = function () {
	
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

Guy.prototype.setTargetForRed = function () {
	
	if (this.mode === "scatter") {
		var targetTile = entityManager.getTile(430,17,5);	// upper right corner
	}
	
	else if (this.mode === "chase") {
		var pacman = entityManager.getPacman();
		var targetTile = entityManager.getTile(pacman.cx, pacman.cy, pacman.radius);
	}
	
	if (targetTile) {
		this.targetTile = targetTile;
	}
};

Guy.prototype.setTargetForPink = function () {
	
	if (this.mode === "scatter") {
		//var targetTile = entityManager.getTile(17,17,5);    // upper left corner
		//targetTile.debug = true;
	}
	
	else if (this.mode === "chase") {
	}
	
	/*if (targetTile) {
		this.targetTile = targetTile;
	}*/
};

Guy.prototype.setTargetForOrange = function () {
	
	if (this.mode === "scatter") {
		//var targetTile = entityManager.getTile(17,470,5);		// bottom left corner
		//targetTile.debug = true;
	}
	
	else if (this.mode === "chase") {
	}
	
	/*if (targetTile) {
		this.targetTile = targetTile;
	}*/
};

Guy.prototype.setTargetForBlue = function () {

	if (this.mode === "scatter") {
		//var targetTile = entityManager.getTile(430,470,5);    //bttom right corner
		//targetTile.debug = true;
	}
	
	else if (this.mode === "chase") {
	}
	
	/*if (targetTile) {
		this.targetTile = targetTile;
	}*/
};

Guy.prototype.updateDirections = function(du){
		
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
		
		if (wallColliding.up) return;
		else
		{
			this.setDirectionUp();	        
		}
	}
	if(this.nextTurn === "down")
	{
		nextTile = entityManager.getTile(nextPos.nextXdown, nextPos.nextYdown, this.radius, this.nextTurn);		
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXdown, nextPos.nextYdown);
		
		if (wallColliding.down) return;
    	else
		{
    		this.setDirectionDown();       
		}
	}
    if(this.nextTurn === "left")
	{
		nextTile = entityManager.getTile(nextPos.nextXleft, nextPos.nextYleft, this.radius, this.nextTurn);
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXleft, nextPos.nextYleft);
		
		if (wallColliding.left) return;
    	else
		{
    		this.setDirectionLeft();
		}       
    }
    if(this.nextTurn === "right")
	{
		nextTile = entityManager.getTile(nextPos.nextXright, nextPos.nextYright, this.radius, this.nextTurn);
		wallColliding = this.isWallColliding (nextTile, nextPos.nextXright, nextPos.nextYright);
		
		if (wallColliding.right) return;
    	else
		{
    		this.setDirectionRight();	    
		}
    }	   
};    

Guy.prototype.Move = function (du) {
	    
    var nextPos = this.getNextPos(du);
    var nextX = nextPos.nextX;
    var nextY = nextPos.nextY;
	var nextTile = entityManager.getTile(nextX, nextY, this.radius, this.directions);
	var wallColliding = this.isWallColliding (nextTile, nextX, nextY);
 	
	//Move left        
	if(this.directions.left && !wallColliding.left)
	{			                  
		this.cx = nextX; 
		if(this.cx <= 0) 
			this.cx = g_canvas.width; 
		if(!nextTile)
			return; 
		this.cy = nextTile.cy + (nextTile.height/2); 
	}
	//Move Right
	if(this.directions.right && !wallColliding.right)
	{
		this.cx = nextX;   
		if(this.cx  >= g_canvas.width) 
			this.cx = 0; 		
		if(!nextTile)
			return;
		this.cy = nextTile.cy + (nextTile.height/2); 
	}
	//Move up
	if(this.cy - this.radius > 0 && this.directions.up  && nextTile && !wallColliding.up) 
	{
		this.cy = nextY;                 
		this.cx = nextTile.cx + (nextTile.width/2); 
	}
	//Move Down
	if(this.cy + this.radius < g_canvas.height && this.directions.down && nextTile && !wallColliding.down) 
	{
		this.cy = nextY;                  	                
		this.cx = nextTile.cx + (nextTile.width/2); 
	}
};

Guy.prototype.getRadius = function () {

    return (this.sprite.width / 2) * 0.9;
};

Guy.prototype.getsEaten = function () {

    this.kill();
};

Guy.prototype.reset = function () {

    this.setPos(this.reset_cx, this.reset_cy);
    this.radius = this.reset_radius;
    
    this.halt();
};

Guy.prototype.halt = function () {

    this.velX = 0;
    this.velY = 0;
};

//pacman
var g_cel_left = 51;
var g_cel_up = 0;
var g_cel_down = 34;
var g_cel_right = 17;

//ghosts
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

Guy.prototype.render = function (ctx) {

	if(this.type === "pacman") {
    		if(!this.directions.left && !this.directions.right && 
    			!this.directions.up && !this.directions.down)
    		{
    			cel = g_sprites[18];
    			cel.drawAt(ctx, this.cx, this.cy, this.radius);
    		}
		if(this.directions.left) 
		{
			this.renderSprite(g_cel_left);
			++g_cel_left;
			if (g_cel_left === 55) 
				g_cel_left = 51;
		}
		if(this.directions.up) 
		{
			this.renderSprite(g_cel_up);
			++g_cel_up;
			if (g_cel_up === 4) 
				g_cel_up = 0;
		}
		if(this.directions.down) 
		{
			this.renderSprite(g_cel_down);
			++g_cel_down;
			if (g_cel_down === 38) 
				g_cel_down = 34;
		}
		if(this.directions.right) 
		{
			this.renderSprite(g_cel_right);
			++g_cel_right;
			if (g_cel_right === 21) 
				g_cel_right = 17;
		}
	}
	
	if(this.type === "ghost") 
	{
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
		 		if (pink_left === 59) 
		 			pink_left = 57;
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

    //util.strokeCircle(ctx, this.cx, this.cy, this.radius);
    /*ctx.fillStyle= this.color;    
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();*/
    /*
    ctx.beginPath();
    ctx.arc(this.cx - g_canvas.width, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(g_canvas.width + this.cx, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();   
   // util.fillCircle(ctx, this.cx, this.cy, this.radius);
    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.radius);   */

Guy.prototype.renderSprite = function(sprite) {

	var cel = g_sprites[sprite];
	cel.drawAt(ctx, this.cx, this.cy, this.radius);
};

Guy.prototype.clear = function(ctx){

	var width = this.radius + 1; 
	util.fillBox(ctx, this.cx - width, this.cy - width,  width * 2, width * 2, "white");
};

Guy.prototype.getNextPos = function (du, cx, cy) {
	if (cx === undefined) 
	{
		cx = this.cx;
	}
	if (cy === undefined) 
	{
		cy = this.cy;
	}
	
	var nextX, nextY;
	var nextXleft, nextXright, nextXup, nextXdown, nextYleft, nextYright, nextYup, nextYdown;
	
	if (this.directions.left) 
	{
		nextX = cx - this.velX * du;
		nextY = cy;
		this.currentDirection = "left";
	}
	if (this.directions.right) 
	{
		nextX = cx + this.velX * du;
		nextY = cy;
		this.currentDirection = "right";
	}
	if (this.directions.up) 
	{
		nextX = cx;
		nextY = cy - this.velY * du;
		this.currentDirection = "up";
	}
	if (this.directions.down) 
	{
		nextX = this.cx;
		nextY = this.cy + this.velY * du;
		this.currentDirection = "down";
	}
	nextXleft = this.cx - this.velX * du;
	nextYleft = this.cy;
	
	nextXright = this.cx + this.velX * du;
	nextYright = this.cy;
	
	nextXup = this.cx;
	nextYup = this.cy - this.velY * du;
	
	nextXdown = this.cx;
	nextYdown = this.cy + this.velY * du;

    return {nextX : nextX, nextY : nextY,
			nextXleft : nextXleft, nextYleft : nextYleft,
			nextXright : nextXright, nextYright : nextYright,
			nextXup : nextXup, nextYup : nextYup,
			nextXdown : nextXdown, nextYdown : nextYdown
			};
};

Guy.prototype.isWallColliding = function (nextTile, nextX, nextY) {
	
	var startingGhostTile = entityManager.getTile(230,200,3);
	var startingGhostTile2 = entityManager.getTile(220,200,3);	
	
	if (nextTile)
	{	
		//the ghost box
		if (nextTile === startingGhostTile || nextTile === startingGhostTile2) {
			down = true;
			//console.log("colliding down");
		}
	
		if (nextTile.type == "1") 
		{
			var left, right, up, down = false;
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
		//if tile has a cake, change it to a normal lane
		else if (nextTile && nextTile.hasCake && this.type == "pacman")
		{
			nextTile.hasCake = false;
			this.score += 10;
			this.cakesEaten++;
		}
		else if (nextTile && nextTile.hasFruit && this.type == "pacman")
		{
			if (nextTile.Fruit === "cherry") this.score += 100;
			if (nextTile.Fruit === "strawberry") this.score += 300;
			nextTile.hasFruit = false;
		}
		return {
			left: left, 
			right: right,
			up: up,
			down: down
		};
	}

};

Guy.prototype.updateScore = function (score) {
	updateSideText(this.score);
	if (this.cakesEaten === 70 || this.cakesEaten === 170) {
		var tile = entityManager.getTile(215,280,3);
		tile.putFruit(this.cakesEaten, tile);
	}
}

Guy.prototype.setDirectionLeft = function () {
	this.directions = {
		left : true,
		right : false,
		up : false, 
		down : false
	};
};
Guy.prototype.setDirectionRight = function () {
	this.directions = {
		left : false,
		right : true,
		up : false, 
		down : false
	};
};
Guy.prototype.setDirectionUp = function () {
	this.directions = {
		left : false,
		right : false,
		up : true, 
		down : false
	};
};
Guy.prototype.setDirectionDown = function () {
	this.directions = {
		left : false,
		right : false,
		up : false, 
		down : true
	};
};

Guy.prototype.setChaseMode = function () {
	this.mode = "chase";
};

Guy.prototype.setScatterMode = function () {
	this.mode = "scatter";
};

