// ====
// ROCK
// ====


// A generic contructor which accepts an arbitrary descriptor object
function Tile(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    
    // Default sprite and scale, if not otherwise specified
//    this.sprite = this.sprite || g_sprites.rock;    
};



Tile.prototype.cx = 0;
Tile.prototype.cy = 0;
Tile.prototype.type = 0; 

Tile.prototype.height = 30; 
Tile.prototype.width = 30; 

Tile.prototype.left = true; 
Tile.prototype.right = true; 
Tile.prototype.top = true; 
Tile.prototype.bottom = true; 

Tile.prototype.update = function (du) {
     return;
};

Tile.prototype.getsEaten = function () {
    this.kill();    
};


Tile.prototype.render = function (ctx) {
    /*if(this.top) util.drawHorrLine(ctx, this.cx, this.cy, this.width, this.height, "black");    
    if(this.bottom) util.drawVerLine(ctx, this.cx, this.cy, this.width, this.height, "red");*/
    if(g_renderTilesDebug){
    	ctx.rect(this.cx,this.cy,this.width,this.height);
		ctx.stroke(); 
	}
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
