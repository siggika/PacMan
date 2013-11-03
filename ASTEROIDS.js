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

var KEY_0 = keyCode('0');

var KEY_1 = keyCode('1');
var KEY_2 = keyCode('2');

var KEY_K = keyCode('K');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)){ 
    	g_renderSpatialDebug = !g_renderSpatialDebug;
    	g_renderTilesDebug = !g_renderTilesDebug; 
    }

    if (eatKey(KEY_HALT)) entityManager.haltGuys();

    if (eatKey(KEY_RESET)) entityManager.resetGuys();

    

    if (eatKey(KEY_1)) entityManager.generateGuy({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.Guy});

    if (eatKey(KEY_2)) entityManager.generateGuy({
        cx : g_mouseX,
        cy : g_mouseY,
        
        sprite : g_sprites.Guy2
        });

    if (eatKey(KEY_K)) entityManager.killNearestGuy(
        g_mouseX, g_mouseY);
}


// =================
// RENDER SIMULATION
// =================

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

    var requiredImages = {
        Guy   : "ship.png",
        Guy2  : "ship_2.png",        
        
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.Guy  = new Sprite(g_images.Guy);
    g_sprites.Guy2 = new Sprite(g_images.Guy2);    
   
    entityManager.init();    
    main.init();
}

// Kick it off
requestPreloads();
