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
Guy.prototype.velX = 5;
Guy.prototype.velY = 5;
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
	
	var tile = entityManager.getTile(this.cx, this.cy, this.radius);
    if(tile)
    {
    	tile.shouldRender = true;    	
    }    
		    
	//Move left
	if(this.cx - this.radius > 0 && this.directions.left){
			
		this.cx -= du * this.velX; 
		//this.cy = tile.cy + this.radius + 5;     	
	}
	//Move Right
	if(this.cx + this.radius <= g_canvas.width && this.directions.right )
	{
		this.cx += du * this.velX; 
		//this.cy = tile.cy + this.radius + 5;     	
	}
	//Move up
	if(this.cy - this.radius > 0 && this.directions.up ) {
		this.cy -= du * this.velY; 		
		//this.cx = tile.cx + this.radius + 5;     	
	}
	
	//Move Down
	if(this.cy + this.radius < g_canvas.height && this.directions.down ) {
		this.cy += du * this.velY;    
		//this.cx = tile.cx + this.radius + 5;     	
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
	var width = this.radius + 1; 
	util.fillBox(ctx, this.cx - width, this.cy - width,  width * 2, width * 2, "white");
};
