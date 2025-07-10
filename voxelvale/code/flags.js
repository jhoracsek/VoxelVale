


const GAME_VERSION = "Alpha 0.2.0"
const DEV_TOOLS = true;
const GEN_DUNGEONS = false;
var SPAWN_ENEMIES = false;
const MAX_ENEMIES_IN_WORLD = 5;

/*
	Set to 1.5 for 1080p
	Set to 1 for 720p (default)
*/
const canvas_multiplier = 1.5;

/*
	The probability an enemy is spawned roughly every second.
*/
const SPAWN_RATE = 0.07;


/*
	Some information:

	In inventory, cursor coordinates are:
		cursorCoor[0], cursorCoor[1]



*/


function getEnemySpawn(){
	if(SPAWN_ENEMIES){
		return "Turn enemies off.";
	}else{
		return "Turn enemies on.";
	}
}
