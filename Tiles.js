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

Tile.prototype.left = true; 
Tile.prototype.right = true; 
Tile.prototype.top = true; 
Tile.prototype.bottom = true; 

Tile.prototype.init = function(type){						
	switch(type)
	{		
		//0:  Left - Right	
		case 0:
	  		this.left = true; 
	  		this.right = true;
	  		this.top = false; 
	  		this.bottom = false;
	  		break;	  		
		//1:  Top - Bottom  
		case 1:
	  		this.left = false; 
	  		this.right = false;
	  		this.top = true; 
	  		this.bottom = true; 
	  		break;	  	
		//2:  Top - Bottom - Left - Right         
		case 2:
	  		this.left = true; 
	  		this.right = true;
	  		this.top = true; 
	  		this.bottom = true; 
	  		break;	  	
		//3:  Top - Bottom - Right	    
		case 3:
	  		this.left = false; 
	  		this.right = true;
	  		this.top = true; 
	  		this.bottom = true; 
	  		break;	  	
		//4:  Top - Bottom - Left	    
		case 4:
	  		this.left = true; 
	  		this.right = false;
	  		this.top = true; 
	  		this.bottom = true; 
	  		break;	  	
		//5: Top - Right - Left
		case 5:
	  		this.left = true; 
	  		this.right = true;
	  		this.top = true; 
	  		this.bottom = false;
	  		break;	  	
		//6: Bottom - Right - Left
		case 6:
	  		this.left = true; 
	  		this.right = true;
	  		this.top = false; 
	  		this.bottom = true; 
	  		break;	  	
		//7: Top - Left 
		case 7:
	  		this.left = true; 
	  		this.right = false; 
	  		this.top = true; 
	  		this.bottom = false;
	  		break;	  	  
		//8: Top - Right
		case 8:
	  		this.left = false;
	  		this.right = true;
	  		this.top = true;
	  		this.bottom = false;
	  		break;	  	
		//9: Bottom - Right
		case 9:
	  		this.left = false; 
	  		this.right = true;
	  		this.top = false; 
	  		this.bottom = true; 
	  		break;	  	
		//10: Bottom - Left	
		case 10:
	  		this.left = true; 
	  		this.right = false; 
	  		this.top = false; 
	  		this.bottom = true; 
	  		break;	  	
	  	//11: None
		case 11:
	  		this.left = false; 
	  		this.right = false; 
	  		this.top = false; 
	  		this.bottom = false; 
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
	var offset = -5; 
    if(g_renderTilesDebug){
    	ctx.rect(this.cx,this.cy,this.width,this.height);
		ctx.stroke(); 
	}
	//Top right corner
	util.drawLine(ctx, (this.cx + this.width + offset), this.cy, this.cx + this.width + offset, this.cy - offset);
	util.drawLine(ctx, (this.cx + this.width + offset), this.cy - offset, this.cx + this.width, this.cy - offset);
	
	//Top Left corner
	util.drawLine(ctx, (this.cx - offset), this.cy, this.cx - offset, this.cy - offset);
	util.drawLine(ctx, (this.cx - offset), this.cy - offset, this.cx, this.cy-offset);
	
	//Bottom right
	util.drawLine(ctx, (this.cx + this.width + offset), this.cy + this.height + offset, this.cx + this.width + offset, this.cy + this.height);
	util.drawLine(ctx, (this.cx + this.width + offset), this.cy + this.height + offset, this.cx + this.width, this.cy + this.height + offset);
	
	//Bottom Left
	util.drawLine(ctx, (this.cx - offset), this.cy + this.height + offset, this.cx - offset, this.cy + this.height);
	util.drawLine(ctx, (this.cx - offset), this.cy + this.height + offset, this.cx, this.cy + this.height + offset);
	//DEBUG
	/*
	this.left = false; 
	this.right = true; 
	this.top = true; 
	this.bottom = true; 
	*/
	
	
	if(!this.left) util.drawLine(ctx, (this.cx - offset), this.cy, this.cx - offset, this.cy + this.height);
	if(!this.right) util.drawLine(ctx, (this.cx + this.width + offset), this.cy, this.cx + this.width + offset, this.cy + this.height);
	if(!this.top) util.drawLine(ctx, this.cx, this.cy - offset, this.cx + this.width, this.cy - offset);
	if(!this.bottom) util.drawLine(ctx, this.cx, this.cy +this.height + offset, this.cx + this.width, this.cy +this.height + offset);
};
