/*

spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.

*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */


var spatialManager = {

// "PRIVATE" DATA

_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)

_entities : [],

// PUBLIC METHODS

getNewSpatialID : function() {

    var temp = this._nextSpatialID;
    return this._nextSpatialID++;

},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
           
    pos.radius = entity.getRadius();        
    this._entities[spatialID] = {
    entity : entity,
    posX : pos.posX,
    posY : pos.posY,
    radius : pos.radius    
    };
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();
    this._entities.splice(spatialID,1)    
},

findEntityInRange: function(posX, posY, radius) {

    for(var ID in this._entities){
    	var e = this._entities[ID];
    	var distSq = util.wrappedDistSq(e.posX, e.posY,posX, posY,g_canvas.width, g_canvas.height);
		var r2 = radius * radius;
        if (distSq - r2 < e.radius * e.radius) {        	
            return e.entity;            
        }
    }
    return false;
},

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";              
    for (var ID in this._entities) {    
        var e = this._entities[ID];        
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);        
        var debug = e.posX + "\n" + e.posY +"\n"+e.radius;        
    }
    ctx.strokeStyle = oldStyle;
}

}
