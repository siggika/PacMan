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
    var t_w = 45 
    var t_h = 45; 
    var _tiles = new Array();
   //0:  Left - Right	
    //1:  Top - Bottom  
	//2:  Top - Bottom - Left - Right         
	//3:  Top - Bottom - Right	    
	//4:  Top - Bottom - Left	    
	//5: Top - Right - Left
	//6: Bottom - Right - Left
	//7: Top - Left 
	//8: Top - Right
	//9: Bottom - Right
	//10: Bottom - Left	

	_tiles[0] = new Array();
	_tiles[0][0] = 9;  
	_tiles[0][1] = 0;  
	_tiles[0][2] = 0;      
	_tiles[0][3] = 6;      
	_tiles[0][4] = 0;      
	_tiles[0][5] = 0;      
	_tiles[0][6] = 0;      
	_tiles[0][7] = 10;      	
	_tiles[0][8] = 11;   
	/********************/
	_tiles[1] = new Array();
	_tiles[1][0] = 1;   
	_tiles[1][1] = 11;   
	_tiles[1][2] = 11;   
	_tiles[1][3] = 1;   
	_tiles[1][4] = 11;   
	_tiles[1][5] = 11;   
	_tiles[1][6] = 11;   
	_tiles[1][7] = 1;   
	_tiles[1][8] = 11;   
	/***********************/
	_tiles[2] = new Array();
	_tiles[2][0] = 3;
	_tiles[2][1] = 0;
	_tiles[2][2] = 0;
	_tiles[2][3] = 2;
	_tiles[2][4] = 0;
	_tiles[2][5] = 6;
	_tiles[2][6] = 0;
	_tiles[2][7] = 2;
	_tiles[2][8] = 0;
	//0:  Left - Right	
    //1:  Top - Bottom  
	//2:  Top - Bottom - Left - Right         
	//3:  Top - Bottom - Right	    
	//4:  Top - Bottom - Left	    
	//5: Top - Right - Left
	//6: Bottom - Right - Left
	//7: Top - Left 
	//8: Top - Right
	//9: Bottom - Right
	//10: Bottom - Left	
	      
	            
	//alert(_tiles.length + " ---- " + _tiles[0].length);
	console.dir(_tiles);    
    var levels = 0;         
    for(var j = 0; j < _tiles.length; j++){    	
    	for(var i = 0; i < _tiles[j].length; i++){    	    		
    		this._tile.push(new Tile({
    			cx : i * t_w,
    			cy : j * t_h,   
    			width : t_w,
    			height : t_h,
    			type : _tiles[j][i]
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
    
    
    if(g_renderTilesDebug){    	
	}
	for(var t in this._tile)
    	{
    		var tile = this._tile[t];
    		if(tile) tile.render(ctx);
    	}    	
    
    /*this.sprite.drawWrappedCentredAt(
        ctx, this.cx, this.cy, this.rotation
    );*/
};
