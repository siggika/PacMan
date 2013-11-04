/*

entityManager.js

*/


var entityManager = {

// "PRIVATE" DATA

_pacman   : [],
_maze : [],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._pacman, this._maze];
},

init: function() {
    this.generateGuy();
    this.generateMaze();
},

generateGuy : function(descr) {
    this._pacman.push(new Guy(descr));
},

generateMaze : function(descr) {   
    this._maze.push(new Maze(descr));    
},

resetGuys: function() {
    this._forEachOf(this._pacman, Guy.prototype.reset);
},

haltGuys: function() {
    this._forEachOf(this._pacman, Guy.prototype.halt);
},	

getTile: function(x,y,r) {
	for(var t = 0; t < this._maze.length; t++)
	{		
		return this._maze[t].getTile(x,y,r); 
	}	
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            
            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }    
},

clear: function(ctx){

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];    

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
