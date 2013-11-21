// =========
// PacMan
// =========


var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");

// ====================
// CREATE INITIAL GuyS
// ====================

function createInitialGuys() {

    entityManager.generateGuy({
        cx : 200,
        cy : 200
    });
    
}

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    entityManager.update(du);
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;
var g_renderTilesDebug = false;

var KEY_SPATIAL = keyCode('X');
var KEY_HALT  = keyCode('H');
var KEY_RESET = keyCode('R');

var KEY_MUTE = keyCode('M');
var g_soundOn = true;

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)){ 
    	g_renderSpatialDebug = !g_renderSpatialDebug;
    	g_renderTilesDebug = !g_renderTilesDebug; 
    }

    if (eatKey(KEY_HALT)) entityManager.haltGuys();

    if (eatKey(KEY_RESET)) entityManager.resetGuys();

    if (eatKey(KEY_MUTE)) g_soundOn = !g_soundOn;
}


// =================
// RENDER/CLEAR SIMULATION
// =================

function clearBackground(ctx) {

    entityManager.clear(ctx);        
}


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {

    entityManager.render(ctx);        

    if (g_renderSpatialDebug) spatialManager.render(ctx);
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {
    g_spriteSheet = new Image();
    g_spriteSheet.onload = preloadDone;
    g_spriteSheet.src = "https://notendur.hi.is/ebk13/PMsprite.png";
    g_spriteSheet2 = new Image();
    g_spriteSheet2.src = "https://notendur.hi.is/ebk13/pacmansprites.png";
}

var g_fruit_sprites = [];
var g_sprites = [];

function preloadDone() {

  	var celWidth  = 24;
    var celHeight = 24;
    var numCols = 17;
    var numRows = 4;
    var numCels = 68;
    
    var sprite;
    
    for (var row = 0; row < numRows; ++row) {
        for (var col = 0; col < numCols; ++col) {
            sprite = new Sprite(g_spriteSheet, col * celWidth, row * celHeight,
                                celWidth, celHeight) ;
            g_sprites.push(sprite);
        }
    }
    g_sprites.splice(numCels);
    
    //cherry
    g_fruit_sprites.push(new Sprite(g_spriteSheet2, 170, 163, 22, 20));
    //strawberry
    g_fruit_sprites.push(new Sprite(g_spriteSheet2, 170, 185, 22, 20));

    entityManager.init();
    sideText.initScoreBoard();
    main.init();
}

// Kick it off
//requestPreloads();
