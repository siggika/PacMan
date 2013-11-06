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
    
};

Guy.prototype = new Entity();

Guy.prototype.rememberResets = function () {
    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_radius = this.radius;
};

Guy.prototype.KEY_UP = 'W'.charCodeAt(0);
Guy.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Guy.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Guy.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);


// Initial, inheritable, default values
Guy.prototype.radius = 12;
Guy.prototype.cx = 20;
Guy.prototype.cy = 15;
Guy.prototype.velX = 5;
Guy.prototype.velY = 5;
Guy.prototype.score = 0;
Guy.prototype.directions = { 
	left : false,
	right : true,
	up : false, 
	down : false
}
// HACKED-IN AUDIO (no preloading)
/*Guy.prototype.warpSound = new Audio(
    "sounds/GuyWarp.ogg");
*/

Guy.prototype.updateDirections = function(){
	if (eatKey(this.KEY_UP))
	{
		this.directions.up = true; 
		this.directions.down = false; 
		this.directions.left = false; 
		this.directions.right = false; 
	}
    if (eatKey(this.KEY_DOWN)){
    	this.directions.down = true;
    	
    	this.directions.up = false; 		
		this.directions.left = false; 
		this.directions.right = false; 
    } 
    if (eatKey(this.KEY_LEFT)){
    	this.directions.left = true;
    	this.directions.up = false; 
		this.directions.down = false; 		
		this.directions.right = false; 
    } 
    if (eatKey(this.KEY_RIGHT)){
    	this.directions.right = true;
    	this.directions.up = false; 
		this.directions.down = false; 
		this.directions.left = false; 		
    } 	
};
    
Guy.prototype.update = function (du) {

     
    // TODO: MOVE   
    this.updateDirections();    
    this.clear(ctx);
    //spatialManager.unregister(this);
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;             
    this.Move(du);
    
    //spatialManager.register(this);

};


Guy.prototype.Move = function (du) {
	
	var prevX = this.cx;
    var prevY = this.cy;
    
	var nextPos = this.getNextPos(du);
	
    var nextX = nextPos.nextX;
    var nextY = nextPos.nextY;
	
	var nextTile = entityManager.getTile(nextX, nextY, this.radius, this.directions);

	var wallColliding = this.isWallColliding (nextTile, nextX, nextY);
		    
	//Move left
	if(nextX - this.radius > 0 && this.directions.left && !wallColliding.left){
			
		this.cx -= du * this.velX; 
		this.cy = nextTile.cy + (nextTile.height/2);     	
	}
	//Move Right
	if(nextX + this.radius <= g_canvas.width && this.directions.right && !wallColliding.right)
	{
		this.cx += du * this.velX; 
		this.cy = nextTile.cy + (nextTile.height/2);     	
	}
	//Move up
	if(nextY - this.radius > 0 && this.directions.up && !wallColliding.up) {
		this.cy -= du * this.velY; 		
		this.cx = nextTile.cx + (nextTile.height/2);
	}
	
	//Move Down
	if(nextY + this.radius < g_canvas.height && this.directions.down && !wallColliding.down) {
		this.cy += du * this.velY;    
		this.cx = nextTile.cx + (nextTile.height/2);     	
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

Guy.prototype.render = function (ctx) {
    
    
    util.strokeCircle(ctx, this.cx, this.cy, this.radius);
    
    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.radius);
    
};
Guy.prototype.clear = function(ctx){
	var width = this.radius + 1.5; 
	util.fillBox(ctx, this.cx - width, this.cy - width,  width * 2, width * 2, "white");
};

Guy.prototype.getNextPos = function (du) {
	var nextX;
	var nextY;
	
	if (this.directions.left) {
		nextX = this.cx - this.velX * du;
		nextY = this.cy;
	}
	if (this.directions.right) {
		nextX = this.cx + this.velX * du;
		nextY = this.cy;
	}
	if (this.directions.up) {
		nextX = this.cx;
		nextY = this.cy - this.velY * du;
	}
	if (this.directions.down) {
		nextX = this.cx;
		nextY = this.cy + this.velY * du;
	}

    return {nextX : nextX, nextY : nextY};
};

Guy.prototype.isWallColliding = function (nextTile, nextX, nextY) {
	
	
	if (nextTile && nextTile.type == "1") {
	
		var left, right, up, down = false;
		var nextTileX = nextTile.cx + (nextTile.width/2);
		var nextTileY = nextTile.cy + (nextTile.height/2);
		var limit = this.radius + (nextTile.width/2);

		/*
		console.log("limit: " + limit);
		console.log("right: " + (nextTileX - nextX));
		console.log("left: " + (nextX - nextTileX));
		console.log("up: " + (nextY - nextTileY));
		console.log("down: " + (nextTileY - nextY));
		console.log("nextTileX: " + nextTileX);
		console.log("nextTileY: " + nextTileY);
		*/
		
		//right
		if (this.directions.right && (nextTileX - nextX) <= limit){
			right = true;
			//console.log("colliding right");
		}
		
		//left
		if (this.directions.left && (nextX - nextTileX) <= limit) {
			left = true;
			//console.log("colliding left");
		}
		
		//up
		if (this.directions.up && (nextY - nextTileY) <= limit) {
			up = true;
			//console.log("colliding up");
		}
		
		//down
		if (this.directions.down && (nextTileY - nextY) <= limit) {
			down = true;
			//console.log("colliding down");
		}
	}
	//if tile has a cake, change it to a normal lane
	else if (nextTile && nextTile.type == "0"){
		nextTile.type = 2;
		this.score++;
		updateSideText(this.score);
	}
	return {
		left: left, 
		right: right,
		up: up,
		down: down
	};

};
