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
    this._ghosts.push(new Ghost({
        cx: tile.cx,        
        cy: tile.cy + tile.height/2,
        ai: true,
        type: "ghost",
        color: "red"
    }));
},


initTimeouts : function () {
	
	
	// set first chase after 7 seconds
	this.timeout = new Timer(setFirstChase, 7000);
	
	function setFirstChase() {
		console.log("setting first chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager.timeout = new Timer(setSecondScatter, 20000);
	}
	
	function setSecondScatter() {
		console.log("setting second scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		
		entityManager.timeout = new Timer(setSecondChase, 7000);
	}
	
	function setSecondChase() {
		console.log("setting second chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager.timeout = new Timer(setThirdScatter, 20000);
	}
	
	function setThirdScatter() {
		console.log("setting third scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		entityManager.timeout = new Timer(setThirdChase, 5000);
	}
	
	function setThirdChase() {
		console.log("setting third chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		if (GameEnd.level === 1) {
			entityManager.timeout = new Timer(setFourthScatter, 20000);
		}
		else if (GameEnd.level === 2) {
			entityManager.timeout = new Timer(setFourthScatter, 1033000);
		}
	}
	
	function setFourthScatter() {
		console.log("setting fourth scatter");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeScatter);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setScatterMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setScatterMode);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setLastMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setLastMode);
		
		if (GameEnd.level === 1) {
			entityManager.timeout = new Timer(setLastChase, 5000);
		}
		else if (GameEnd.level === 2) {
			entityManager.timeout = new Timer(setLastChase, 17);
		}
	}	
	
	function setLastChase() {
		console.log("setting last chase");
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setGameModeChase);
		
		entityManager._forEachOf(entityManager._ghosts, Ghost.prototype.setChaseMode);
		entityManager._forEachOf(entityManager._pacman, Pacman.prototype.setChaseMode);
	}
},

pauseTimers : function() {
	this.timeout.pause();
},

resumeTimers : function() {
	this.timeout.resume();
},

resetTimers : function () {
	this.timeout.pause();
	entityManager._forEachOf(entityManager._pacman, Pacman.prototype.pauseTimers);
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

releaseElroy : function() {
	for (var i = 0; i < this._ghosts.length; ++i) 
    {
		if (this._ghosts[i].color === "red") {
			this._ghosts[i].releaseElroy();
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

resetMaze : function(descr) {

    this._maze.pop();
	this._maze.push(new Maze(descr));
},

resetGuys: function() {

    this._forEachOf(this._pacman, Pacman.prototype.reset);
    this._forEachOf(this._ghosts, Ghost.prototype.reset);
},


restartGuys: function() {

    this._forEachOf(this._pacman, Pacman.prototype.restart);
    this._forEachOf(this._ghosts, Ghost.prototype.restart);
},

guysSetNewLevel: function() {

    this._forEachOf(this._pacman, Pacman.prototype.setNewLevel);
    this._forEachOf(this._ghosts, Ghost.prototype.setNewLevel);
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
