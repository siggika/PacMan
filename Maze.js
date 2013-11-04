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
Maze.prototype.drawHorrLane = function(level, startX, endX){
	for(var i = startX; i <= endX; i++){

		if(!this._tiles[level]) this._tiles[level] = new Array();
		this._tiles[level][i] = 1; 
		//if(!this._tiles[i]) this._tiles[i] = new Array();		
	}
};

Maze.prototype.drawVertLane = function(x, startY, endY){	
	for(var i = startY; i <= endY; i++){	
		if(!this._tiles[i]) this._tiles[i] = new Array();
		this._tiles[i][x] = 1;
	}
};
Maze.prototype.prepArray = function(y,x){
	for(var i = 0; i <= y; i++)
	{
		if(!this._tiles[i])this._tiles = new Array();						
	}	
	
}

Maze.prototype.initMaze = function (descr) {
    var w = g_canvas.width; 
    var h = g_canvas.height;     
    var t_w = 45 
    var t_h = 45; 
    
    //Draw Bricks
    this._tiles[0] = new Array();    
    this.drawHorrLane(1,1,2);
    this.drawVertLane(1,2,3);

	//alert(this._tiles.length + " ---- " + this._tiles[0].length);	
    var levels = 0;         
    for(var j = 0; j < this._tiles.length; j++){    	
    	for(var i = 0; i < this._tiles[j].length; i++){    	    		
    		this._tile.push(new Tile({
    			cx : i * t_w,
    			cy : j * t_h,   
    			width : t_w,
    			height : t_h,
    			type : this._tiles[j][i]
    		}));    	
    	}
    	levels = j * t_h;
    }
    
    for(var t in this._tile)
    	{
    		var tile = this._tile[t];
    		if(tile) tile.render(ctx);    		
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
	for(var t in this._tile)
    	{
    		var tile = this._tiles[t];
    		if(tile && tile.shouldRender){
    			tile.render(ctx);    			
    		}
    		
    	}    	
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
