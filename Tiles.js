// ====
// Tile
// ====


// A generic contructor which accepts an arbitrary descriptor object
function Tile(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    this.init(this.type); 
};


Tile.prototype.init = function(type){						
	switch(type)
	{		
		//0:  Lane	
		case 0:
			this.hasCake = true;
	  		break;	  		
		//1:  Brick 
		case 1:
			this.hasCake = false;
	  		break;	  		
	}	
}

Tile.prototype.cx = 0;
Tile.prototype.cy = 0;
Tile.prototype.type = 0; 
Tile.prototype.debug = false; 
Tile.prototype.debug2 = false; 
Tile.prototype.draw = false; 
Tile.prototype.hasFruit = false; 
Tile.prototype.Fruit; 
Tile.prototype.timeout; 
Tile.prototype.hasPill = false; 

Tile.prototype.height = 16; 
Tile.prototype.width = 16; 

Tile.prototype.render = function (ctx) {
	var offset = this.width/2; 
    if(g_renderTilesDebug){    	
    	ctx.strokeStyle = "white";
    	ctx.rect(this.cx,this.cy,this.width,this.height);
		ctx.stroke(); 		
	}
	var startX = this.cx + offset;
	var endX =  this.cx + this.width; 
	var startY = this.cy + offset; 
	var endY = this.height - offset;
        
    if(this.type ===1){                        
        ctx.strokeStyle = "blue";
		ctx.lineWidth=2;			        
        if(this.draw === "VL")
        {    	
    		ctx.beginPath();        
        	ctx.moveTo(this.cx + offset,this.cy);    
    		ctx.lineTo(this.cx + offset,this.cy + this.height);
    		ctx.stroke();    		
    		
        }
         if(this.draw === "HL")
        {
        
			ctx.beginPath();        
        	ctx.moveTo(this.cx, this.cy + offset);    
			ctx.lineTo(this.cx + this.width,this.cy + offset);
    		ctx.stroke();    		    	
        }		
		if(this.draw === "UL"){
		    ctx.strokeStyle = "blue";
		    ctx.beginPath();        
        	ctx.moveTo(this.cx + offset, this.cy + offset);    
			ctx.lineTo(this.cx + this.width,this.cy + offset);
    		ctx.stroke();  
			ctx.moveTo(this.cx + offset, this.cy + offset);    
			ctx.lineTo(this.cx + offset,+ this.cy +this.height);
    		ctx.stroke();  

		}

		if(this.draw === "LL"){
		    ctx.strokeStyle = "blue";
		    ctx.beginPath();        
        	ctx.moveTo(this.cx + offset, this.cy);    
			ctx.lineTo(this.cx + offset, this.cy + this.height/2);
    		ctx.stroke();  
			ctx.moveTo(this.cx + offset, this.cy + this.height/2);    
			ctx.lineTo(this.cx + this.width,this.cy +this.height/2);
    		ctx.stroke();  
		}
		if(this.draw === "UR"){
		    ctx.strokeStyle = "blue";
		    ctx.beginPath();        
        	ctx.moveTo(this.cx + offset, this.cy + this.height/2);    
			ctx.lineTo(this.cx + offset, this.cy + this.height);
    		ctx.stroke();  
			ctx.moveTo(this.cx + offset, this.cy + this.height/2);    
			ctx.lineTo(this.cx, this.cy +this.height/2);
    		ctx.stroke();  
		}
		if(this.draw === "LR"){
		    ctx.strokeStyle = "blue";
		    ctx.beginPath();        
        	ctx.moveTo(this.cx + offset, this.cy + this.height/2);    
			ctx.lineTo(this.cx + offset, this.cy);
    		ctx.stroke();  
			ctx.moveTo(this.cx + offset, this.cy + this.height/2);    
			ctx.lineTo(this.cx, this.cy +this.height/2);
    		ctx.stroke();  

		}
    } 
    if(this.type === 0 && this.draw != "Blank"){            
        if(this.hasCake){
            ctx.fillStyle= "white";    
            ctx.beginPath();
            ctx.arc(this.cx + this.width/2, this.cy+this.height/2, 2, 0, Math.PI * 2);
            ctx.fill();
        }
		if (this.hasFruit) {
			if (this.Fruit === "cherry") {
				var cel = g_fruit_sprites[0];
				cel.drawAt(ctx, this.cx, this.cy+10, this.radius);
			}
			if (this.Fruit === "strawberry") {
				var cel = g_fruit_sprites[1];
				cel.drawAt(ctx, this.cx, this.cy+10, this.radius);
			}
		}
		if (this.hasPill) {
			ctx.fillStyle= "yellow";    
            ctx.beginPath();
            ctx.arc(this.cx + this.width/2, this.cy+this.height/2, 6, 0, Math.PI * 2);
            ctx.fill();
		}
    }	
    if(this.debug){    
    	util.fillBox(ctx, this.cx, this.cy, this.width, this.height , "red");                        	
    } 
	if(this.debug2){    
    	util.fillBox(ctx, this.cx, this.cy, this.width, this.height , "blue");                        	
    } 
};

Tile.prototype.putFruit = function (cakesEaten, tile) {
	
	this.hasFruit = true;
	
	//make fruit last for 10 seconds
	this.timeout = setTimeout(function(){tile.hasFruit = false;}, 10000);
	
	if (cakesEaten < 75) {		
		this.Fruit = "cherry";
	}
	else if (cakesEaten < 175) {
		this.Fruit = "strawberry";
	}
};

Tile.prototype.isCloser = function (tile1, tile2) {
	var centerX = this.cx + this.width/2;
	var centerY = this.cy + this.height/2;
	var tile1X = tile1.cx + tile1.width/2;
	var tile1Y = tile1.cy + tile1.height/2;
	var tile2X = tile2.cx + tile2.width/2;
	var tile2Y = tile2.cy + tile2.height/2;
	
	var dist1 =  util.distSq(tile1X, tile1Y, centerX, centerY);
	var dist2 =  util.distSq(tile2X, tile2Y, centerX, centerY);
	
	//the first parameter get's priority
	if (dist1 <= dist2) return tile1;
	else return tile2;	
};

Tile.prototype.isIntersection = function () {
	var tileX = this.cx + this.width/2;
	var tileY = this.cy + this.height/2;
	var count = 0;
	
	var tileAbove = entityManager.getTile(tileX, tileY - this.height, this.radius);
	var tileBelow = entityManager.getTile(tileX, tileY + this.height, this.radius);
	var tileLeft = entityManager.getTile(tileX - this.width, tileY, this.radius);
	var tileRight = entityManager.getTile(tileX + this.width, tileY, this.radius);
	
	if (tileAbove && tileAbove.type === 0 ) count++;
	if (tileBelow && tileBelow.type === 0 ) count++;
	if (tileLeft && tileLeft.type === 0 ) count++;
	if (tileRight && tileRight.type === 0 ) count++;
	
	if (count > 2) return true;
};