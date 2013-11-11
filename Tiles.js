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
//Tile.prototype.shouldRender = false; 

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
	  		//this.shouldRender = false;
			this.hasCake = true;
	  		break;	  		
		//1:  Brick 
		case 1:
	  		this.left = false; 
	  		this.right = false;
	  		this.top = false; 
	  		this.bottom = false; 
	  		//this.shouldRender = true; 
			this.hasCake = false;
	  		break;	  		
	}	
}

Tile.prototype.cx = 0;
Tile.prototype.cy = 0;
Tile.prototype.type = 0; 
Tile.prototype.debug = false; 
Tile.prototype.draw = false; 

Tile.prototype.height = 16; 
Tile.prototype.width = 16; 

Tile.prototype.getsEaten = function () {
    this.kill();    
};


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
	/*ctx.strokeStyle = "white";
    ctx.strokeText(this.number, this.cx + 10, this.cy + 10);*/
        
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
    }	
    if(this.debug){    
    	util.fillBox(ctx, this.cx, this.cy, this.width, this.height , "red");                        	
    } 
};
