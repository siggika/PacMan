// ====
// Tile
// ====


/// A generic contructor which accepts an arbitrary descriptor object
function Tile(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.init(this.type);
    
    // Default sprite and scale, if not otherwise specified
//    this.sprite = this.sprite || g_sprites.rock;    
};

//Needs to be rendered or not:
Tile.prototype.shouldRender = false; 

Tile.prototype.left = true; 
Tile.prototype.right = true; 
Tile.prototype.top = true; 
Tile.prototype.bottom = true; 

Tile.prototype.init = function(type){						
	switch(type)
	{		
		//0:  Lane	
		case 0:
	  		this.left = true; 
	  		this.right = true;
	  		this.top = true; 
	  		this.bottom = true;
	  		this.shouldRender = false;
	  		break;	  		
		//1:  Brick 
		case 1:
	  		this.left = false; 
	  		this.right = false;
	  		this.top = false; 
	  		this.bottom = false; 
	  		this.shouldRender = true; 
	  		break;	  		
	}	
}

Tile.prototype.cx = 0;
Tile.prototype.cy = 0;
Tile.prototype.type = 0; 

Tile.prototype.height = 30; 
Tile.prototype.width = 30; 

Tile.prototype.getsEaten = function () {
    this.kill();    
};


Tile.prototype.render = function (ctx) {
	var offset = 5; 
    if(g_renderTilesDebug){
    	ctx.rect(this.cx,this.cy,this.width,this.height);
		ctx.stroke(); 
	}
	var startX = this.cx + offset;
	var endX = this.cx + this.width - offset; 
	var startY = this.cy + offset; 
	var endY = this.cy - offset + this.height;
	if(!this.left) util.drawLine(ctx,startX, startY , startX, endY);
	if(!this.right) util.drawLine(ctx, endX, startY, endX, endY);
	if(!this.top) util.drawLine(ctx, startX, startY, endX, startY);
	if(!this.bottom) util.drawLine(ctx, startX, endY, endX, endY);
};
