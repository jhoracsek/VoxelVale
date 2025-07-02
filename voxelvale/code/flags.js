


const GAME_VERSION = "Alpha 0.0.1"
const DEV_TOOLS = true;
const GEN_DUNGEONS = false;
var SPAWN_ENEMIES = false;
const MAX_ENEMIES_IN_WORLD = 5;

/*
	The probability an enemy is spawned roughly every second.
*/
const SPAWN_RATE = 0.04;


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
