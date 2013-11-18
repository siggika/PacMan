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

//frightened mode
var frightened_ghost = 13;
var frightened_ghost_2 = 30;
var frightened_ghost_3 = 47;
var frightened_ghost_4 = 64;

Entity.prototype.render = function (ctx) {
	var cel;

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
		if(this.mode === "frightened") {
			if(this.color === "blue") {
				this.renderSprite(frightened_ghost);
				++frightened_ghost;
		 		if (frightened_ghost === 17) frightened_ghost = 13;
			}
			if(this.color === "pink") {
				this.renderSprite(frightened_ghost_2);
				++frightened_ghost_2;
		 		if (frightened_ghost_2 === 34) frightened_ghost_2 = 30;
			}
			if(this.color === "orange") {
				this.renderSprite(frightened_ghost_3);
				++frightened_ghost_3;
		 		if (frightened_ghost_3 === 51) frightened_ghost_3 = 47;
			}
			if(this.color === "red") {
				this.renderSprite(frightened_ghost_4);
				++frightened_ghost_4;
		 		if (frightened_ghost_4 === 68) frightened_ghost_4 = 64;
			}
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
	


Entity.prototype.renderSprite = function(sprite) {

	var cel = g_sprites[sprite];
	cel.drawAt(ctx, this.cx, this.cy, this.radius);
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
};
Entity.prototype.setLastMode = function () {
	if (this.mode === "scatter") {
		this.lastMode = "scatter";
	}
	if (this.mode === "chase") {
		this.lastMode = "chase";
	}
};

