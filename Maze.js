// ====
// MAZE
// ====


// A generic contructor which accepts an arbitrary descriptor object
function Maze(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);  
    this.initMaze();          
};

Maze.prototype = new Entity();

//Set the tiles heightXwidth
Maze.prototype._tiles = new Array();
Maze.prototype.height = 16; 
Maze.prototype.width = 16; 


Maze.prototype.initMaze = function () {

    this._prepArray(30,27);    
    this._layBricks();
    this._drawCorners();    
    this._clearUpMaze();
};


//==================
//   DRAWING UTILS        
//==================


Maze.prototype._layBricks = function () {    
     
     //Draw the Borders        
    this.drawHorrLane(0,0,27);
    
    this.drawVertLane(0,0,8);    
    this.drawVertLane(0,20,29);    
    this.drawVertLane(27,0,8);    
    this.drawVertLane(27,20,29);    
    
    this.drawHorrLane(30,0,27);    
    
    //Draw Bricks    
    //1st level (c.a. x0 ---- x10 )
    this._drawBox(2,2,3,2);
    this._drawBox(7,2,4,2);
    this._drawBox(13,0,1,4);
    this._drawBox(16,2,4,2);
    this._drawBox(22,2,3,2);
    
    //Level 2
    this._drawBox(2,6,3,1);
    this._drawBox(7,6,1,7);
    this._drawBox(9,9,2,1);

    this._drawBox(10,6,7,1);
    this._drawBox(13,7,1,3);
    this._drawBox(19,6,1,7);
    this._drawBox(16,9,2,1);

    this._drawBox(22,6,3,1);    

    //Left right center "boxes"        
    this._drawBox(22,9,5,4);    
    this._drawBox(22,15,5,4);    
    this._drawBox(0,9,5,4);    
    this._drawBox(0,15,5,4);    
    
    //Center
    this.drawHorrLane(12,10,12);
    this.drawHorrLane(12,15,17);
    this.drawVertLane(10,13,15);   
    this.drawVertLane(17,13,15);   
    this.drawHorrLane(16,10,17);
    
    /***********************************/

    this._drawBox(7,15,1,4);    
    this._drawBox(19,15,1,4);    
    
    /*Center Low "T"'s*/
    this._drawBox(10,18,7,1);    
    this._drawBox(13,19,1,3);    

    this._drawBox(10,24,7,1);    
    this._drawBox(13,25,1,3);    

    /*Bottom half*/
    this._drawBox(2,21,3,1);    
    this._drawBox(4,21,1,4);    


    this._drawBox(1,24,1,1);
    this._drawBox(7,21,4,1);
    
    this._drawBox(22,21,3,1);    
    this._drawBox(22,21,1,4);    
    
    this._drawBox(25,24,2,1);

    this._drawBox(16,21,4,1);
    

    this._drawBox(7,24,1,3);
    this._drawBox(2,27,9,1);
    
    this._drawBox(19,24,1,3);
    this._drawBox(16,27,9,1);    
}

Maze.prototype._drawCorners = function() {

    this._tiles[0][0].draw = "UL";
    this._tiles[0][27].draw = "UR";

    this._tiles[0][13].draw = "UR";
    this._tiles[0][14].draw = "UL";
    
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
    
    for(var j = 1; j < this._tiles.length-1; j++)
    {
        for(var i = 1; i < this._tiles[j].length-1; i++)
        {
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

    if(lane.type === 0 && brick.type === 1)
    {
        if(above.type !== 1) brick.draw = Ucorn;
        if(below.type !== 1) brick.draw = Lcorn;
    }
};

Maze.prototype._setIntersection = function(HL_Tile, VL_Tile, lane1,lane2, IS1, IS2, targetTile) {

    if(HL_Tile.draw === "HL" && VL_Tile.draw === "VL" && lane1.type === 0) 
        targetTile.draw = IS1;
    if(HL_Tile.draw === "HL" && VL_Tile.draw === "VL" && lane2.type === 0) 
        targetTile.draw = IS2;
};

Maze.prototype._clearUpMaze = function() {

    this._tiles[12][12].draw = "HL"
    this._tiles[12][15].draw = "HL"    
    this._tiles[12][13].hasCake = false; 
    this._tiles[12][14].hasCake = false; 
    
    for(var x = 13; x < 16; x++)
    {
        for(var y = 11; y < 17; y++)
        {
            this._tiles[x][y].hasCake = false; 
        }
    }
    
    for(var j = 0; j < 3; j++)
    {        
        this.drawBlankLane(10 + j,0,4);
        this.drawBlankLane(16 + j,0,4);
        
        this.drawBlankLane(10 + j,24,27);
        this.drawBlankLane(16 + j,24,27);        
    }
};      

Maze.prototype.drawHorrLane = function(level, startX, len){

    for(var i = startX; i <= len; i++)
    {
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

    for(var i = startY; i <= len; i++)
    {
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

Maze.prototype._prepArray = function(y,x){

    for(var i = 0; i <= y; i++)
    {
        if(!this._tiles[i])
            this._tiles[i] = new Array();
        
        for(var j = 0; j <= x; j++)
        {
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

Maze.prototype._drawBox = function(startX, startY,length, height){

    var endX = startX + length; 
    var endY = startY + height;
    this.drawHorrLane(startY,startX,endX);
    this.drawHorrLane(endY,startX,endX);   
    this.drawVertLane(startX,startY+1,endY-1);
    this.drawVertLane(endX,startY+1,endY-1); 
    
    for(var i = 1; i < height; i++)
    {
       this.drawBlankLane(startY + i, startX + 1,endX - 1);
    }
};


//==================
//   UTILS        
//==================


Maze.prototype.getTile = function(guyX, guyY, guyR, dir){

    var lowest = Number.MAX_VALUE;
    var nearestTile;    
    for(var j = 0; j < this._tiles.length; j++)
    {
        for(var i = 0; i < this._tiles[j].length; i++)
        { 
            var tile = this._tiles[j][i];
            if(!dir)
            {
                if(tile.cx < guyX && tile.cx + tile.width >= guyX)
                    if(tile.cy < guyY && tile.cy + tile.height >= guyY)
                        return tile;         
            }

            else if(dir)
            {
                var tileX = tile.cx + (tile.width/2);
                var tileY = tile.cy + (tile.height/2);
                
                // only searching to the right of guy when going right,
                // left of guy when going left...
                if ((dir.right && tileX >= guyX) || (dir.left && tileX <= guyX)
                    || (dir.down && tileY >= guyY) || (dir.up && tileY <= guyY)) 
                {
                    var dist =  util.distSq(guyX, guyY, tileX, tileY);
                    if (dist < lowest)
                    { 
                        lowest = dist;
                        nearestTile = tile;
                    }
                }
            }
        }   
    }
    return nearestTile;
};


//================
// The Usual stuff
//================


Maze.prototype.update = function (du) {

    for(var j = 0; j < this._tiles.length; j++) 
    {
        for(var i = 0; i < this._tiles[j].length; i++) 
        {
            var tile = this._tiles[j][i];
            if (tile.hasCake) return;
        }
    }
    entityManager.haltGuys();
    gameWon = true;
};

Maze.prototype.getsEaten = function () {

    this.kill();
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
