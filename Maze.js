// ====
// MAZE
// ====


// A generic contructor which accepts an arbitrary descriptor object
function Maze(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);  
    this.initMaze();      
    
    // Default sprite and scale, if not otherwise specified
//    this.sprite = this.sprite || g_sprites.rock;    
};

Maze.prototype = new Entity();

Maze.prototype.cx = 0;
Maze.prototype.cy = 0;
Maze.prototype.type = 0; 


Maze.prototype.height = 16; 
Maze.prototype.width = 16; 

Maze.prototype.left = true; 
Maze.prototype.right = true; 
Maze.prototype.top = true; 
Maze.prototype.bottom = true; 

Maze.prototype._tiles = new Array();
Maze.prototype.drawHorrLane = function(level, startX, len){
	for(var i = startX; i <= len; i++){

		if(!this._tiles[level]) this._tiles[level] = new Array();
		this._tiles[level][i] = new Tile({
    		cx : i * this.width,
    		cy : level * this.height,   
    		width : this.width,
    		height : this.height,
    		type : 1
    	});
		//if(!this._tiles[i]) this._tiles[i] = new Array();		
	}
};

Maze.prototype.drawVertLane = function(x, startY, len){	
	for(var i = startY; i <= len; i++){	
		if(!this._tiles[i]) this._tiles[i] = new Array();
		
		this._tiles[i][x] = new Tile({
    		cx : x * this.width,
    		cy : i * this.height,   
    		width : this.width,
    		height : this.height,
    		type : 1
    	});
	}
};
Maze.prototype.prepArray = function(y,x){
	for(var i = 0; i <= y; i++)
	{
		if(!this._tiles[i])this._tiles[i] = new Array();
		
		for(var j = 0; j <= x; j++){
			this._tiles[i][j] = new Tile({
    			cx : j * this.width,
    			cy : i * this.height,   
    			width : this.width,
    			height : this.height,
    			type : 0
    		});
		}						
	}	
	
}

Maze.prototype.initMaze = function (descr) {
    var w = g_canvas.width; 
    var h = g_canvas.height;     
  /*  var t_w = 16 
    var t_h = 16; 
    */
    this.prepArray(30,27);
    //Draw Bricks    
    this.drawHorrLane(0,0,27);
    this.drawVertLane(0,0,13);    
    this.drawVertLane(0,15,29);    
    this.drawVertLane(27,0,13);    
    this.drawVertLane(27,15,29);    
    this.drawHorrLane(30,0,27);
    
    this.drawHorrLane(2,2,5);
    this.drawHorrLane(3,2,5);    
    this.drawHorrLane(4,2,5);
    
    
    this.drawHorrLane(2,7,11);
    this.drawHorrLane(3,7,11);
    this.drawHorrLane(4,7,11);
    
    this.drawHorrLane(1,13,14);
    this.drawHorrLane(2,13,14);
    this.drawHorrLane(3,13,14);
    this.drawHorrLane(4,13,14);
    
    
    this.drawHorrLane(2,16,20);
    this.drawHorrLane(3,16,20);
    this.drawHorrLane(4,16,20);
    
    
    this.drawHorrLane(2,22,25);
    this.drawHorrLane(3,22,25);
    this.drawHorrLane(4,22,25);    
    
    this.drawHorrLane(6,2,5);
    this.drawHorrLane(7,2,5);
    
    this.drawVertLane(7,6,13);
    this.drawVertLane(8,6,13);   
    this.drawHorrLane(9,7,11);
    this.drawHorrLane(10,7,11);

    this.drawHorrLane(6,10,17);
    this.drawHorrLane(7,10,17);
    this.drawVertLane(13,6,10);   
    this.drawVertLane(14,6,10);   
        
    this.drawVertLane(19,6,13);   
    this.drawVertLane(20,6,13);   
    this.drawHorrLane(9,16,20);
    this.drawHorrLane(10,16,20);
    
    this.drawHorrLane(6,22,25);
    this.drawHorrLane(7,22,25);

//Left right center "boxes"
    this.drawHorrLane(9,22,26);
    this.drawHorrLane(10,22,26);
    this.drawHorrLane(11,22,26);
    this.drawHorrLane(12,22,26);
    this.drawVertLane(22,10,12);   
    this.drawHorrLane(13,22,26);
    
    this.drawHorrLane(15,22,26);
    this.drawHorrLane(16,22,26);
    this.drawHorrLane(17,22,26);
    this.drawHorrLane(18,22,26);
    this.drawVertLane(22,16,18);   
    this.drawHorrLane(19,22,26);
    
    this.drawHorrLane(9,1,5);
    this.drawHorrLane(10,1,5);
    this.drawHorrLane(11,1,5);
    this.drawHorrLane(12,1,5);
    this.drawVertLane(5,10,12);   
    this.drawHorrLane(13,1,5);
    
    this.drawHorrLane(15,1,5);
    this.drawHorrLane(16,1,5);
    this.drawHorrLane(17,1,5);
    this.drawHorrLane(18,1,5);
    this.drawVertLane(5,16,18);   
    this.drawHorrLane(19,1,5);

    //Center
    this.drawHorrLane(12,10,12);
    this.drawHorrLane(12,15,17);
    this.drawVertLane(10,13,16);   
    this.drawVertLane(17,13,16);   
    this.drawHorrLane(16,10,16);
    
/***********************************/

    this.drawVertLane(7,15,19);   
    this.drawVertLane(8,15,19);   
    
    this.drawVertLane(19,15,19);   
    this.drawVertLane(20,15,19);   

/*Center Low "T"'s*/
    this.drawHorrLane(18,10,17);
    this.drawHorrLane(19,10,17);
    this.drawVertLane(13,20,22);   
    this.drawVertLane(14,20,22);   
    
    this.drawHorrLane(24,10,17);
    this.drawHorrLane(25,10,17);
    this.drawVertLane(13,26,28);   
    this.drawVertLane(14,26,28);   

    this.drawHorrLane(21,2,5);
    this.drawHorrLane(22,2,5);
    this.drawVertLane(4,23,25);   
    this.drawVertLane(5,23,25);   
    
    this.drawHorrLane(24,1,2);
    this.drawHorrLane(25,1,2);
    
    this.drawHorrLane(21,22,25);
    this.drawHorrLane(22,22,25);
    this.drawVertLane(22,23,25);   
    this.drawVertLane(23,23,25);   
    
    this.drawHorrLane(24,25,27);
    this.drawHorrLane(25,25,27);
    
    
    this.drawHorrLane(21,7,11);
    this.drawHorrLane(22,7,11);
    
    this.drawHorrLane(21,16,20);
    this.drawHorrLane(22,16,20);
    
    this.drawVertLane(7,24,26);   
    this.drawVertLane(8,24,26);   
    this.drawHorrLane(27,2,11);
    this.drawHorrLane(28,2,11);
    
    this.drawVertLane(19,24,26);   
    this.drawVertLane(20,24,26);   
    this.drawHorrLane(27,16,25 );
    this.drawHorrLane(28,16,25);
  
	//alert(this._tiles.length + " ---- " + this._tiles[0].length);	    
    for(var j = 0; j < this._tiles.length; j++){    	
    	for(var i = 0; i < this._tiles[j].length; i++){    	    		    		
    		this._tiles[j][i].render(ctx);
    	}
    	
    }
        
}
Maze.prototype.update = function (du) {
     return;
};

Maze.prototype.getsEaten = function () {
    this.kill();    
};

Maze.prototype.getTile = function(guyX, guyY, guyR, dir){
	var lowest = Number.MAX_VALUE;
	var nearestTile;	
	for(var j = 0; j < this._tiles.length; j++){    	
    	for(var i = 0; i < this._tiles[j].length; i++){   
    				
			var tile = this._tiles[j][i];
            if(!dir){
                if(tile.cx < guyX && tile.cx + tile.width >= guyX)
                    if(tile.cy < guyY && tile.cy + tile.height >= guyY)
                        return tile;         
            }

            else if(dir){

    			var tileX = tile.cx + (tile.width/2);
    			var tileY = tile.cy + (tile.height/2);
    			
    			// only searching to the right of guy when going right,
    			// left of guy when going left...
    			if ((dir.right && tileX >= guyX) || (dir.left && tileX <= guyX)
    				|| (dir.down && tileY >= guyY) || (dir.up && tileY <= guyY)) {	
    				
				    var dist =  util.distSq(guyX, guyY, tileX, tileY);
				    if (dist < lowest) { 
					   lowest = dist;
				    	nearestTile = tile;
			     	}
			 }
    	   }
        }	
    }
	
	return nearestTile;
};

Maze.prototype.render = function (ctx) {
    
    
    if(g_renderTilesDebug){    	
	}
	for(var level in this._tiles)
    	{
    		var row = this._tiles[level];
    		for(var t in row)
    		{
                    var tile = row[t];
                  //  if(tile && tile.shouldRender)
                    {
    			
                        tile.render(ctx);    			
                    }
                }
    	}    	
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
