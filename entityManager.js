/*

entityManager.js

*/


var entityManager = {

// "PRIVATE" DATA

_pacman   : [],
_ghosts : [],
_maze : [],


// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {

    for (var i = 0; i < aCategory.length; ++i) 
    {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// 
timeout : false,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {

    this._categories = [this._maze,this._pacman, this._ghosts];
},

init: function() {

    this.generateMaze();
    this.generatePacman();
    this.generateGhosts();
    this.initTargetTiles();
	this.initTimeouts();
},

generatePacman : function(descr) {

    var tile = this._maze[0].getTile(215,380,3);
    this._pacman.push(new Pacman({
        cx: tile.cx + tile.width,
        cy: tile.cy + tile.height/2
    }));
},
generateGhosts : function(descr) {

    var colors = ["","blue","pink","orange"]
	var tile = this._maze[0].getTile(215,280,3);
    for(var i = 1; i < 4; i++)
    {
        tile = this._maze[0].getTile(170 + (i * tile.width*2),230,3);
        this._ghosts.push(new Ghost({
            cx: tile.cx,           
            cy: tile.cy + tile.height/2,           
            ai: true,
            type : "ghost",
            color : colors[i]
        }));
    }
    
    tile = this._maze[0].getTile(230,190,3);
    //tile = this._maze[0].getTile(230,280,3);
    this._ghosts.push(new Ghost({
        cx: tile.cx,        
        cy: tile.cy + tile.height/2,
        ai: true,
        type: "ghost",
        color: "red"
    }));
},

setGhost : function(x,y){

    var tile = this._maze[0].getTile(x,y,5);
    this._ghosts[3].cx = tile.cx + tile.width/2;
    this._ghosts[3].cy = tile.cy + tile.height/2;
},

setTarget : function(x,y){

    this._ghosts[3].targetTile.debug = false;
    var tile = this._maze[0].getTile(x,y,5);
    //this._pacman[4].targetTile = tile;     
},


initTimeouts : function () {
	
	
	// set first chase after 7 seconds
	this.timeout = new Timer(setFirstChase, 7000);
	
	function setFirstChase() {
		console.log("setting first chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager.timeout = new Timer(setSecondScatter, 20000);
	}
	
	function setSecondScatter() {
		console.log("setting second scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager.timeout = new Timer(setSecondChase, 7000);
	}
	
	function setSecondChase() {
		console.log("setting second chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager.timeout = new Timer(setThirdScatter, 20000);
	}
	
	function setThirdScatter() {
		console.log("setting third scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager.timeout = new Timer(setThirdChase, 5000);
	}
	
	function setThirdChase() {
		console.log("setting third chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager.timeout = new Timer(setFourthScatter, 20000);
	}
	
	function setFourthScatter() {
		console.log("setting fourth scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager.timeout = new Timer(setLastChase, 5000);
	}
	
	function setLastChase() {
		console.log("setting last chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
	}
},

setMode : function(mode) {
	for (var i = 0; i < this._pacman.length; ++i) 
    {
		this._pacman[i].setMode(mode);

    }
	for (var i = 0; i < this._ghosts.length; ++i) 
    {
		this._ghosts[i].setMode(mode);

    }
},

setFree : function(color) {
	for (var i = 0; i < this._ghosts.length; ++i) 
    {
		if (this._ghosts[i].color === color) {
			this._ghosts[i].setFree();
		}
    }
},

getRedPos : function() {
	var redPos;
	for (var i = 0; i < this._ghosts.length; ++i) 
    {
		if (this._ghosts[i].color === "red") {
			redPos = this._ghosts[i].getPos();
			
		}
    }
	return redPos;
},

generateMaze : function(descr) {

    this._maze.push(new Maze(descr));    
},

resetGuys: function() {

    this._forEachOf(this._pacman, Pacman.prototype.reset);
    this._forEachOf(this._ghosts, Ghost.prototype.reset);
},

haltGuys: function() {

    this._forEachOf(this._pacman, Entity.prototype.halt);
    this._forEachOf(this._ghosts, Entity.prototype.halt);
},	

getTile: function(x,y,r,dir) {

	for(var t = 0; t < this._maze.length; t++) 
    {		
		return this._maze[t].getTile(x,y,r,dir); 
	}	
},

getPacman: function () {
	return this._pacman[0];
},

initTargetTiles: function(){

    var tile = this.getTile(430,17,5);  //upper right corner (red)
    var tile2 = this.getTile(17,17,5);    //upper left corner (pink)
    var tile3 = this.getTile(430,470,5);    //bottom right corner (blue)
    var tile4 = this.getTile(17,470,5);    //bottom left corner (orange)
    var tile5 = this.getTile(230,190,3);    //starting tile
    var tilePacman = this.getTile(this._pacman[0].cx, this._pacman[0].cy, this._pacman[0].radius); //pacman 
    //Hentugt til að sjá flísina sem verið er að vinna með:
    //tilePacman.debug = true; 
    
	// 		Ef það á að fikta með þetta þá þarf að setja this._ghosts[i]
	
	//this._pacman[1].targetTile = tile3;
    //this._pacman[1].cx = 250;
    //this._pacman[1].cy = 175;
    //console.log(this._pacman[1].color);

    //this._pacman[2].targetTile = tile2;
    //this._pacman[2].cx = 180;
    //this._pacman[2].cy = 175;
    //console.log(this._pacman[2].color);
    
    //this._pacman[3].targetTile = tile4;
    //this._pacman[3].cx = 200;
    //this._pacman[3].cy = 175;
    //console.log(this._pacman[3].color);
    
    //this._pacman[4].targetTile = tile;
    //console.log(this._pacman[4].color);
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) 
    {
        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) 
        {
            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) 
            {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else 
            {
                ++i;
            }
        }
    }
},

clear: function(ctx){

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) 
    {
        var aCategory = this._categories[c];
        for (var i = 0; i < aCategory.length; ++i) 
        {
            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);
        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
