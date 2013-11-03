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
Guy.prototype.radius = 15;
Guy.prototype.cx = 200;
Guy.prototype.cy = 200;
Guy.prototype.velX = 5;
Guy.prototype.velY = 5;
Guy.prototype.directions = { 
	left : true,
	right : true,
	up : true, 
	down : true
}
// HACKED-IN AUDIO (no preloading)
/*Guy.prototype.warpSound = new Audio(
    "sounds/GuyWarp.ogg");
*/


    
Guy.prototype.update = function (du) {
     
    // TODO: MOVE    
    if (eatKey(this.KEY_UP)) this.directions.up = true; 
    if (eatKey(this.KEY_DOWN))this.cy += du * this.velY; 
    if (eatKey(this.KEY_LEFT)) this.cx -= du * this.velX;
    if (eatKey(this.KEY_RIGHT)) this.cx += du * this.velX;
    //spatialManager.unregister(this);
	if(this._isDeadNow) return entityManager.KILL_ME_NOW;         
    this.Move(du);
    //spatialManager.register(this);

};


Guy.prototype.Move = function (du) {
	
	
	if(this.directions.up) this.cy -= du * this.velY; 
	
    /*if (eatKey(this.KEY_UP)) 
    if (eatKey(this.KEY_DOWN))this.cy += du * this.velY; 
    if (eatKey(this.KEY_LEFT)) this.cx -= du * this.velX;
    if (eatKey(this.KEY_RIGHT)) this.cx += du * this.velX;*/
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
