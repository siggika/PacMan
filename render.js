// GENERIC RENDERING

var g_doClear = true;
var g_doBox = false;
var g_undoBox = false;
var g_doFlipFlop = false;
var g_doRender = true;

var g_frameCounter = 1;

var TOGGLE_CLEAR = 'C'.charCodeAt(0);
var TOGGLE_BOX = 'B'.charCodeAt(0);
var TOGGLE_UNDO_BOX = 'U'.charCodeAt(0);
var TOGGLE_FLIPFLOP = 'F'.charCodeAt(0);
var TOGGLE_RENDER = 'R'.charCodeAt(0);

function render(ctx) {
    
    // Process various option toggles
    //
    if (eatKey(TOGGLE_CLEAR)) g_doClear = !g_doClear;
    if (eatKey(TOGGLE_BOX)) g_doBox = !g_doBox;
    if (eatKey(TOGGLE_UNDO_BOX)) g_undoBox = !g_undoBox;
    if (eatKey(TOGGLE_FLIPFLOP)) g_doFlipFlop = !g_doFlipFlop;
    if (eatKey(TOGGLE_RENDER)) g_doRender = !g_doRender;

    // I've pulled the clear out of `renderSimulation()` and into
    // here, so that it becomes part of our "diagnostic" wrappers
    //
    if (g_doClear) util.clearCanvas(ctx);
    //if (g_doClear) clearBackground(ctx);
    
    // The main purpose of the box is to demonstrate that it is
    // always deleted by the subsequent "undo" before you get to
    // see it...
    //
    // i.e. double-buffering prevents flicker!
    //
    if (g_doBox) util.fillBox(ctx, 200, 200, 50, 50, "red");
    
    
    // The core rendering of the actual game / simulation
    //
    if (g_doRender) renderSimulation(ctx);
    
    
    // This flip-flip mechanism illustrates the pattern of alternation
    // between frames, which provides a crude illustration of whether
    // we are running "in sync" with the display refresh rate.
    //
    // e.g. in pathological cases, we might only see the "even" frames.
    //
    if (g_doFlipFlop) {
        var boxX = 250,
            boxY = g_isUpdateOdd ? 100 : 200;
        
        // Draw flip-flop box
        util.fillBox(ctx, boxX, boxY, 50, 50, "green");
        
        // Display the current frame-counter in the box...
        ctx.fillText(g_frameCounter % 1000, boxX + 10, boxY + 20);
        // ..and its odd/even status too
        var text = g_frameCounter % 2 ? "odd" : "even";
        ctx.fillText(text, boxX + 10, boxY + 40);
    }
    
    // Optional erasure of diagnostic "box",
    // to illustrate flicker-proof double-buffering
    //
    if (g_undoBox) ctx.clearRect(200, 200, 50, 50);
    if(GameEnd.gameWon){
        ctx.font="bolder 40px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("You win!!!",130,220);
        ctx.fillStyle = OF; 
    }
	if (GameEnd.gameOver) {
		ctx.font="bolder 40px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("You loose :(",130,70);
        ctx.fillStyle = OF; 
		ctx.globalAlpha = 0.2;
	}
	if (GameEnd.lifeLost && !GameEnd.gameOver) {		
		ctx.font="bolder 35px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("You lost a life",130,370);
        ctx.fillStyle = OF; 
	}
	if (GameEnd.renderScore) {
		ctx.font="bolder 20px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("+ " + GameEnd.scoreUp + " points",345,190);
        ctx.fillStyle = OF; 
	}
	if (g_isUpdatePaused) {
		ctx.font="bolder 40px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("Game Paused", 130,285);
        ctx.fillStyle = OF; 
		ctx.globalAlpha = 0.2;
	}
	if (GameEnd.level2) {
		ctx.font="bolder 40px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("Level 2",160,285);
        ctx.fillStyle = OF; 
	}
	if (GameEnd.quit) {
		ctx.globalAlpha = 1;
		util.fillBox(ctx, 0, 0, g_canvas.width, g_canvas.height, "black");
		ctx.font="bolder 30px Console";
        var OF = ctx.fillStyle;
        ctx.fillStyle = "orange";
        ctx.fillText("Thank you for playing",75,250);	
        ctx.fillStyle = OF;
	}
	if (!GameEnd.gameOver && !g_isUpdatePaused) {
		ctx.globalAlpha = 1;
	}
    ++g_frameCounter;
}
