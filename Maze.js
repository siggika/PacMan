// ====
// ROCK
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
Maze.prototype._tile = new Array();

Maze.prototype.height = 30; 
Maze.prototype.width = 30; 

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
    var t_w = 30 
    var t_h = 30; 
    
    this.prepArray(30,30);
    //Draw Bricks    
    this.drawHorrLane(1,1,2);
    this.drawHorrLane(1,4,6);
    this.drawHorrLane(1,10,12);
    this.drawHorrLane(1,14,15);
    
    this.drawHorrLane(2,1,2);
    this.drawHorrLane(2,4,6);
    this.drawHorrLane(2,10,12);
    this.drawHorrLane(2,14,15);

    this.drawHorrLane(4,1,2);
    this.drawHorrLane(4,6,10);
    this.drawHorrLane(4,14,15);
    
    this.drawHorrLane(6,0,2);
    this.drawHorrLane(6,5,6);
    this.drawHorrLane(6,10,11);
    this.drawHorrLane(6,14,16);
    
    this.drawHorrLane(7,0,2);
    this.drawHorrLane(7,14,16);
    
    this.drawHorrLane(8,0,2);
    this.drawHorrLane(8,14,16);

    this.drawHorrLane(10,0,2);
    this.drawHorrLane(10,14,16);
    
    this.drawHorrLane(11,0,2);
    this.drawHorrLane(11,14,16);
    
    this.drawHorrLane(12,0,2);
    this.drawHorrLane(12,14,16);
    this.drawHorrLane(12,6,10);

    this.drawHorrLane(14,1,2);
    this.drawHorrLane(14,4,6);
    this.drawHorrLane(14,10,12);
    this.drawHorrLane(14,14,16);

    this.drawHorrLane(16,0,0);
    this.drawHorrLane(16,6,10);
    this.drawHorrLane(16,16,16);

    this.drawHorrLane(18,1,6);
    this.drawHorrLane(18,10,15);

    this.drawVertLane(8,0,2);

    this.drawVertLane(8,5,6);

    this.drawVertLane(4,4,8);
    this.drawVertLane(12,4,8);
    
    this.drawVertLane(4,10,12);
    this.drawVertLane(12,10,12);

    this.drawVertLane(8,17,18);

    this.drawVertLane(2,15,16);
    this.drawVertLane(14,15,16);

    this.drawVertLane(4,16,17);
    this.drawVertLane(12,16,17);

    this.drawVertLane(8,13,14);

    //draw middle box

    this.drawVertLane(6,8,10);
    this.drawVertLane(10,8,10);
    this.drawHorrLane(8,7,7);
    this.drawHorrLane(8,9,9);
    this.drawHorrLane(10,6,9);

	//alert(this._tiles.length + " ---- " + this._tiles[0].length);	    
    for(var j = 0; j < this._tiles.length; j++){    	
    	for(var i = 0; i < this._tiles[j].length; i++){    	    		    		
    		this._tiles[j][i].render(ctx);
    	}
    	
    }
        
};
Maze.prototype.update = function (du) {
     return;
};

Maze.prototype.getsEaten = function () {
    this.kill();    
};

Maze.prototype.getTile = function(x,y,r){
	
	for(var t in this._tile)
	{
		var tile = this._tile[t];
		var dist = util.distSq(tile.cx, tile.cy, x-r, y-r);		
		if(dist <= r*r)return tile; 
			dist = util.distSq(tile.cx, tile.cy, x+r, y+r);		
		if(dist <= r*r)return tile; 
			dist = util.distSq(tile.cx, tile.cy, x+r, y-r);		
		if(dist <= r*r)return tile; 
			dist = util.distSq(tile.cx, tile.cy, x-r, y+r);		
		if(dist <= r*r)return tile; 
	}
	return false; 
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
