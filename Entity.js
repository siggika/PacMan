// ======
// ENTITY
// ======
/*

Provides a set of common functions which can be "inherited" by all other
game Entities.

JavaScript's prototype-based inheritance system is unusual, and requires 
some care in use. In particular, this "base" should only provide shared
functions... shared data properties are potentially quite confusing.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


function Entity() {

/*
    // Diagnostics to check inheritance stuff
    this._entityProperty = true;
    console.dir(this);
*/

};

Entity.prototype.setup = function (descr) {

    // Apply all setup properies from the (optional) descriptor
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Get my (unique) spatial ID
    this._spatialID = spatialManager.getNewSpatialID();
    
    // I am not dead yet!
    this._isDeadNow = false;
};

Entity.prototype.setPos = function (cx, cy) {
    this.cx = cx;
    this.cy = cy;
};

Entity.prototype.getPos = function () {
    return {posX : this.cx, posY : this.cy};
};

Entity.prototype.getRadius = function () {
    return this.radius;
};

Entity.prototype.getSpatialID = function () {
    return this._spatialID;
};

Entity.prototype.kill = function () {
    this._isDeadNow = true;
};

Entity.prototype.wrapPosition = function () {
    this.cx = util.wrapRange(this.cx, 0, g_canvas.width);
    this.cy = util.wrapRange(this.cy, 0, g_canvas.height);
};

Entity.prototype.findHitEntity = function () {
    var pos = this.getPos();
    return spatialManager.findEntityInRange(
        pos.posX, pos.posY, this.getRadius()
    );
};

// This is just little "convenience wrapper"
Entity.prototype.isColliding = function () {
    return this.findHitEntity();
};

Entity.prototype.rememberResets = function () {

    // Remember my reset positions
    this.reset_cx = this.cx;
    this.reset_cy = this.cy;
    this.reset_radius = this.radius;
};

Entity.prototype.resetDirections = function() {
	this.directions = { 
		left : false,
		right : false,
		up : false, 
		down : false
	};
};


Entity.prototype.Move = function (du) {
	    
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

Entity.prototype.reset = function () {

    this.setPos(this.reset_cx, this.reset_cy);
    this.radius = this.reset_radius;
    
    //this.halt();
};

Entity.prototype.halt = function () {

    this.velX = 0;
    this.velY = 0;
};

Entity.prototype.clear = function(ctx){

	var width = this.radius + 1; 
	util.fillBox(ctx, this.cx - width, this.cy - width,  width * 2, width * 2, "white");
};

Entity.prototype.getNextPos = function (du, cx, cy) {
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
	}
	if (this.directions.right) 
	{
		nextX = cx + this.velX * du;
		nextY = cy;
	}
	if (this.directions.up) 
	{
		nextX = cx;
		nextY = cy - this.velY * du;
	}
	if (this.directions.down) 
	{
		nextX = this.cx;
		nextY = this.cy + this.velY * du;
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

Entity.prototype.setDirectionLeft = function () {
	this.directions = {
		left : true,
		right : false,
		up : false, 
		down : false
	};
};
Entity.prototype.setDirectionRight = function () {
	this.directions = {
		left : false,
		right : true,
		up : false, 
		down : false
	};
};
Entity.prototype.setDirectionUp = function () {
	this.directions = {
		left : false,
		right : false,
		up : true, 
		down : false
	};
};
Entity.prototype.setDirectionDown = function () {
	this.directions = {
		left : false,
		right : false,
		up : false, 
		down : true
	};
};

Entity.prototype.setMode = function (mode) {
	if (mode === "scatter") {
		this.setScatterMode();
	}
	if (mode === "chase") {
		this.setChaseMode();
	}
	if (mode === "frightened") {
		this.setFrightenedMode();
	}
	if (mode === "caged") {
		this.setCagedMode();
	}
	if (mode === "dead") {
		this.setDeadMode();
	}
};
Entity.prototype.setLastMode = function () {
	if (this.mode === "scatter") {
		this.lastMode = "scatter";
	}
	if (this.mode === "chase") {
		this.lastMode = "chase";
	}
};

