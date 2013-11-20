// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";


var util = {


// RANDOMNESS
// ==========


randTwo: function(opt1, opt2) {
	var random = Math.random();
	if (random < 0.5) { return opt1; }
	else { return opt2;}
},

randThree: function(opt1, opt2, opt3) {
	var random = Math.random();
	if (random <= 0.33) { return opt1; }
	else if (random > 0.333 && random <= 0.666) { return opt2; }
	else { return opt3;}
},


// MISC
// ====

square: function(x) {
    return x*x;
},


// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},


// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.fillStyle = "red";    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

drawLine : function (ctx, x, y, x2, y2, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.beginPath();
    ctx.moveTo(x, y);    
    ctx.lineTo(x2,y2)
    ctx.stroke();
    ctx.fillStyle = oldStyle;    
}

};
