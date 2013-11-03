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

Maze.prototype.initMaze = function (descr) {
    var w = g_canvas.width; 
    var h = g_canvas.height;     
    var t_w = 55; 
    var t_h = 55; 
    var levels = 0;         
    for(var j = 0; j < 8; j++){    	
    	for(var i = 0; i <= 7; i++){    	
    		this._tile.push(new Tile({
    			cx : i * t_w,
    			cy : levels,   
    			width : t_w,
    			height : t_h 	
    		}));    	
    	}
    	levels = j * t_h;
    }
};
Maze.prototype.update = function (du) {
     return;
};

Maze.prototype.getsEaten = function () {
    this.kill();    
};


Maze.prototype.render = function (ctx) {
    /*if(this.top) util.drawHorrLine(ctx, this.cx, this.cy, this.width, this.height, "black");    
    if(this.bottom) util.drawVerLine(ctx, this.cx, this.cy, this.width, this.height, "red");*/
    if(g_renderTilesDebug){
    	for(var t in this._tile)
    	{
    		var tile = this._tile[t];
    		if(tile) tile.render(ctx);
    	}
    	ctx.rect(this.cx,this.cy,this.width,this.height);
		ctx.stroke(); 
	}
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
