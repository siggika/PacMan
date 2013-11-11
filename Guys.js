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
Guy.prototype.cx = 25;
Guy.prototype.cy = 25;
Guy.prototype.velX = 3;
Guy.prototype.velY = 3;
Guy.prototype.ai = false;
Guy.prototype.color = "yellow";
Guy.prototype.nextTurn = false;
Guy.prototype.currentDirection = false;
Guy.prototype.score = 0;
Guy.prototype.dotsCaught = 0;
Guy.prototype.numSubSteps = 2;
Guy.prototype.directions = { 
	left : false,
	right : false,
	up : false, 
	down : false
}
// HACKED-IN AUDIO (no preloading)
/*Guy.prototype.warpSound = new Audio(
    "sounds/GuyWarp.ogg");
*/
Guy.prototype.update = function (du) {
     
    if (eatKey(this.KEY_UP)) this.nextTurn = "up";		
	if (eatKey(this.KEY_DOWN)) this.nextTurn = "down";    	     
    if (eatKey(this.KEY_LEFT)) this.nextTurn = "left";
    if (eatKey(this.KEY_RIGHT)) this.nextTurn = "right"; 	

	//ÞETTA VAR VILLAN MEÐ AÐ FESTAST Í VEGGJUM
    //if(!this.nextTurn)this.updateDirections(); 
    this.updateDirections();    
    
    //spatialManager.unregister(this);
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;             
	
	if(!this.ai) {
		var steps = this.numSubSteps;
		var dStep = du / steps;
		for (var i = 0; i < steps; ++i) {
			this.Move(dStep);
		}
		this.updateScore();
	}

    //spatialManager.register(this);

};

Guy.prototype.updateDirections = function(){
		

	var tile = entityManager.getTile(this.cx, this.cy, this.radius);	
	if(!tile || !this.nextTurn)return;	
	
	if(this.nextTurn === "up"){
		var nextX = tile.cx +1 ; 
		var nextY = tile.cy - tile.height+1; 
		var nextTile = entityManager.getTile(nextX, nextY, this.radius);			
		if(!nextTile || nextTile.type === 1 ) return; 		
		else{
			this.directions.up = true; 
			this.directions.down = false; 
			this.directions.left = false; 
			this.directions.right = false; 		        
		}
	}
	if(this.nextTurn === "down"){
		var nextX = tile.cx + 1; 
		var nextY = tile.cy + tile.height + 1; 
		var nextTile = entityManager.getTile(nextX, nextY, this.radius);		
    	if(!nextTile || nextTile.type === 1 ) return; 
    	else{
    		this.directions.down = true;    	
    		this.directions.up = false; 		
			this.directions.left = false; 
			this.directions.right = false;        
		}
	}
    if(this.nextTurn === "left"){
    	var nextX = tile.cx - tile.width + 1; 
		var nextY = this.cy + 1; 
		var nextTile = entityManager.getTile(nextX, nextY, this.radius)
		if(!nextTile || nextTile.type === 1 ) return; 
    	else{
    		this.directions.left = true;
    		this.directions.up = false; 
			this.directions.down = false; 		
			this.directions.right = false;  
		}       
    }
    if(this.nextTurn === "right"){
    	var nextX = tile.cx + tile.width + 1; 
		var nextY = this.cy + 1; 
		var nextTile = entityManager.getTile(nextX, nextY, this.radius)		
    	if(!nextTile || nextTile.type === 1 ) return; 
    	else{
    		this.directions.right = true;
    		this.directions.up = false; 
			this.directions.down = false; 
			this.directions.left = false; 		    
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
	if(this.directions.left && !wallColliding.left){			                  
		this.cx = nextX; 
		if(this.cx <= 0) this.cx = g_canvas.width; 
		if(!nextTile)return; 
		this.cy = nextTile.cy + (nextTile.height/2); 
		//this.nextTurn = false;
	}
	//Move Right
	if(this.directions.right && !wallColliding.right)
	{
		
		this.cx = nextX;   
		if(this.cx  >= g_canvas.width) this.cx = 0; 		
		if(!nextTile)return;
		this.cy = nextTile.cy + (nextTile.height/2); 
		//this.nextTurn = false;
	}
	//Move up
	if(this.cy - this.radius > 0 && this.directions.up  && nextTile && !wallColliding.up) {
		this.cy = nextY;                 
		this.cx = nextTile.cx + (nextTile.width/2); 
		//this.nextTurn = false;
	}
	
	//Move Down
	if(this.cy + this.radius < g_canvas.height && this.directions.down && nextTile && !wallColliding.down) {
		this.cy = nextY;                  	                
		this.cx = nextTile.cx + (nextTile.width/2); 
		//this.nextTurn = false;
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
    
    
    //util.strokeCircle(ctx, this.cx, this.cy, this.radius);
    ctx.fillStyle= this.color;    
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(this.cx - g_canvas.width, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(g_canvas.width + this.cx, this.cy, this.radius, 0, Math.PI * 2);    
    ctx.fill();


    
   // util.fillCircle(ctx, this.cx, this.cy, this.radius);
    //this.sprite.drawWrappedCentredAt(ctx, this.cx, this.cy, this.radius);
    
};
Guy.prototype.clear = function(ctx){
	var width = this.radius + 1; 
	util.fillBox(ctx, this.cx - width, this.cy - width,  width * 2, width * 2, "white");
};


Guy.prototype.getNextPos = function (du) {
	var nextX;
	var nextY;
	
	if (this.directions.left) {
		nextX = this.cx - this.velX * du;
		nextY = this.cy;
		this.currentDirection = "left";
	}
	if (this.directions.right) {
		nextX = this.cx + this.velX * du;
		nextY = this.cy;
		this.currentDirection = "right";
	}
	if (this.directions.up) {
		nextX = this.cx;
		nextY = this.cy - this.velY * du;
		this.currentDirection = "up";
	}
	if (this.directions.down) {
		nextX = this.cx;
		nextY = this.cy + this.velY * du;
		this.currentDirection = "down";
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
		collision-checking
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
	else if (nextTile && nextTile.hasCake){
		nextTile.hasCake = false;
		this.score += 10;
		this.dotsCaught++;
	}
	else if (nextTile && nextTile.hasFruit){
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

};

Guy.prototype.updateScore = function (score) {
	updateSideText(this.score);
	if (this.dotsCaught === 70 || this.dotsCaught === 170) {
		var tile = entityManager.getTile(215,280,3);
		tile.putFruit(this.dotsCaught, tile);
	}
}

