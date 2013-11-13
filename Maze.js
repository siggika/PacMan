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

		//if(!this._tiles[level]) this._tiles[level] = new Array();
		this._tiles[level][i] = new Tile({
    		cx : i * this.width,
    		cy : level * this.height,   
    		width : this.width,
    		height : this.height,
    		type : 1,
            draw : "HL"
    	});
		//if(!this._tiles[i]) this._tiles[i] = new Array();		
	}
};

Maze.prototype.drawVertLane = function(x, startY, len){	
	for(var i = startY; i <= len; i++){	
		//if(!this._tiles[i]) this._tiles[i] = new Array();
		
		this._tiles[i][x] = new Tile({
    		cx : x * this.width,
    		cy : i * this.height,   
    		width : this.width,
    		height : this.height,
    		type : 1,
            draw : "VL"
    	});
	}
};

Maze.prototype.drawBlankLane = function(level, startX, len){ 
    for(var i = startX; i <= len; i++){

        //if(!this._tiles[level]) this._tiles[level] = new Array();
        this._tiles[level][i] = new Tile({
            cx : i * this.width,
            cy : level * this.height,   
            width : this.width,
            height : this.height,
            type : 1,
            draw : "Blank"
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
  
    this.prepArray(30,27);
    //Draw Bricks    
    this.drawHorrLane(0,0,27);
    this.drawVertLane(0,0,13);    

    this.drawVertLane(0,15,29);    
    this.drawVertLane(27,0,13);    
    this.drawVertLane(27,15,29);    
    this.drawHorrLane(30,0,27);
    

    this.drawHorrLane(2,2,5);
    this.drawVertLane(2,3,3);    
    this.drawBlankLane(3,3,4);    
    this.drawVertLane(5,3,3); 
    this.drawHorrLane(4,2,5);       
    
    
    
    this.drawHorrLane(2,7,11);
    this.drawVertLane(7,3,3);    
    this.drawVertLane(11,3,3);    
    this.drawBlankLane(3,8,10);
    this.drawHorrLane(4,7,11);
    
    
    this.drawVertLane(13,1,3);
    this.drawVertLane(14,1,3);
    this.drawHorrLane(4,13,14);
    
    
    this.drawHorrLane(2,16,20);
    this.drawVertLane(16,3,3);    
    this.drawBlankLane(3,17,20);
    this.drawVertLane(20,3,3);    
    this.drawHorrLane(4,16,20);
    
    
    this.drawHorrLane(2,22,25);
    this.drawVertLane(22,3,3);    
    this.drawBlankLane(3,23,24);
    this.drawVertLane(25,3,3);    
    this.drawHorrLane(4,22,25);    
    
    //Level 2
    this.drawHorrLane(6,2,5);
    this.drawHorrLane(7,2,5);    
    
    this.drawHorrLane(6,7,8);
    this.drawVertLane(7,7,12);
    this.drawVertLane(8,7,12);   
    this.drawHorrLane(9,9,11);
    this.drawHorrLane(10,9,11);
    this.drawHorrLane(13,7,8);

    this.drawHorrLane(6,10,17);
    this.drawHorrLane(7,10,17);
    this.drawVertLane(13,8,10);   
    this.drawVertLane(14,8,10);   
        
    this.drawVertLane(19,6,13);   
    this.drawVertLane(20,6,13);   
    this.drawHorrLane(9,16,18);
    this.drawHorrLane(10,16,18);
    
    this.drawHorrLane(6,22,25);
    this.drawHorrLane(7,22,25);

//Left right center "boxes"
    
    this.drawHorrLane(9,22,27);
    this.drawBlankLane(10,22,27);
    this.drawBlankLane(11,22,27);
    this.drawBlankLane(12,22,27);
    this.drawVertLane(22,10,12);   
    this.drawHorrLane(13,22,27);
    
    this.drawHorrLane(15,22,27);
    this.drawBlankLane(16,22,27);
    this.drawBlankLane(17,22,27);
    this.drawBlankLane(18,22,27);
    this.drawVertLane(22,16,18);   
    this.drawHorrLane(19,22,27);
    
    this.drawHorrLane(9,0,5);
    this.drawBlankLane(10,0,5);
    this.drawBlankLane(11,0,5);
    this.drawBlankLane(12,0,5);
    this.drawVertLane(5,10,12);   
    this.drawHorrLane(13,0,5);
    
    this.drawHorrLane(15,0,5);
    this.drawBlankLane(16,0,5);
    this.drawBlankLane(17,0,5);
    this.drawBlankLane(18,0,5);
    this.drawVertLane(5,16,18);   
    this.drawHorrLane(19,0,5);

    //Center
    this.drawHorrLane(12,10,12);
    this.drawHorrLane(12,15,17);
    this.drawVertLane(10,13,15);   
    this.drawVertLane(17,13,15);   
    this.drawHorrLane(16,10,17);
    
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
    this.drawHorrLane(22,2,4);
    this.drawVertLane(4,23,25);   
    this.drawVertLane(5,22,25);   
    
    this.drawHorrLane(24,1,2);
    this.drawHorrLane(25,1,2);
    
    this.drawHorrLane(21,22,25);
    this.drawHorrLane(22,22,25);
    this.drawVertLane(22,22,25);   
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
    
    this._tiles[0][0].draw = "UL";
    this._tiles[0][27].draw = "UR";
    
    this._tiles[9][0].draw = "LL";
    this._tiles[9][27].draw = "LR";
    
    this._tiles[19][0].draw = "UL";
    this._tiles[19][27].draw = "UR";
    
    this._tiles[24][0].draw = "LL";
    this._tiles[24][27].draw = "LR";
    
    this._tiles[25][0].draw = "UL";
    this._tiles[25][27].draw = "UR";
    
    this._tiles[30][0].draw = "LL";
    this._tiles[30][27].draw = "LR";

    this._drawCorners();	
    this._clearMaze();
}

Maze.prototype._drawCorners = function() {            
    for(var j = 1; j < this._tiles.length-1; j++){              
        for(var i = 1; i < this._tiles[j].length-1; i++){

            var prevTile = this._tiles[j][i-1];
            var tile = this._tiles[j][i];            
            var nextTile = this._tiles[j][i+1];
            
            var prevAbove = this._tiles[j-1][i-1]; 
            var prevBelow = this._tiles[j+1][i-1];
        
            var tileAbove = this._tiles[j-1][i];
            var tileBelow = this._tiles[j+1][i];

            var nextAbove = this._tiles[j-1][i+1];
            var nextBelow = this._tiles[j+1][i+1];
            //Upper/Lower Left corners
            this._setCorner(tile, nextTile,nextAbove, nextBelow, "UL", "LL", tile);
            
            //Upper/Lower Right Coreners
            this._setCorner(tile, prevTile,prevAbove, prevBelow, "UR", "LR", tile);
         
            //Check for horizontal/vertical intersections
            this._setIntersection(tile, tileBelow, prevBelow, nextBelow, "UR", "UL", tile);
            this._setIntersection(tile, nextTile, tileAbove, tileBelow, "LR", "UR", nextTile);
            this._setIntersection(tileBelow, tile, prevTile, nextTile, "LR", "LL", tileBelow);
            this._setIntersection(nextTile, tile, nextAbove, nextBelow, "LL", "UL",tile);
        }
    }
    
};  
Maze.prototype._setCorner = function(lane, brick, above,below, Ucorn, Lcorn) {
      if(lane.type === 0 && brick.type === 1){
                if(above.type !== 1) brick.draw = Ucorn;
                if(below.type !== 1) brick.draw = Lcorn;
            }
};
Maze.prototype._setIntersection = function(HL_Tile, VL_Tile, lane1,lane2, IS1, IS2, targetTile) {
    if(HL_Tile.draw === "HL" && VL_Tile.draw === "VL" && lane1.type === 0) targetTile.draw = IS1;
    if(HL_Tile.draw === "HL" && VL_Tile.draw === "VL" && lane2.type === 0) targetTile.draw = IS2;
    
};
Maze.prototype._clearMaze = function() {
    this._tiles[12][12].draw = "HL"
    this._tiles[12][15].draw = "HL"    
    this._tiles[12][13].draw = "Blank"
    this._tiles[12][14].draw = "Blank"
    
    for(var x = 13; x < 16; x++)
    {
        for(var y = 11; y < 17; y++){
            
            this._tiles[x][y].draw = "Blank";
        }
    }
};      
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
           
       var j = 0; 
	for(var level in this._tiles)
    	{
    		j++;
            var i = 0; 
            var row = this._tiles[level];
    		for(var t in row)
    		{
                i++;
                var tile = row[t];                                
    			tile.render(ctx);
                tile.number = j + "-" + i    			
            }                
                
    	}    	
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
