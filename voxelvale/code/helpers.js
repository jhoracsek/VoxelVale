




/*
	Random integer in range [minimum, maximum].
*/
function randomIntInRange(minimum, maximum){
	return Math.floor(Math.random()*(maximum-minimum+1))+minimum;
}



/*
	X and Y will represent the players current coordinates.


	Remember, zombies spawn at level -6.

	Change name of function.

	pick border side randomly [1-4].
	pick random block on the line.

	getSpawnPosition?
*/
function spawnEnemy(){

	/*
		Good bounds
	*/
	let XBound = 20;
	let YBound = 10; 

	


	// Randomly choose a corner.
	let side = Math.floor(Math.random()*4);

	switch(side){
		// Left
		case 0:
			XBound = -XBound;
			YBound = randomIntInRange(-YBound, YBound);//Math.floor(Math.random);
			break;
		//Right
		case 1:
			YBound = randomIntInRange(-YBound, YBound);
			break;
		// Top
		case 2:
			XBound = randomIntInRange(-XBound, XBound);
			break;
		// Bottom
		case 3:
			XBound = randomIntInRange(-XBound, XBound);
			YBound = -YBound;
			break;
	}


	let x = Math.round((player.posX)+XBound);
	let y = Math.round((player.posY)+YBound);

	if(!world.isSpaceOccupied(x,y,-3) && !world.isSpaceOccupied(x+1,y,-3) && !world.isSpaceOccupied(x-1,y,-3) && !world.isSpaceOccupied(x,y+1,-3) && !world.isSpaceOccupied(x,y-1,-3)){
		var enemy = new Undead(x,y,-3.25);
		enemy.initialize_enemy();
		enemyArray.push(enemy);
	}

}

function killAllEnemies(){
	for(let i = 0; i < enemyArray.getLength(); i++){
		let curEnemy = enemyArray.accessElement(i);
		curEnemy.deathMarker = true;
		curEnemy.health = 0;
	}
	return;
}

//https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return vec4( ((c>>16)&255)/255, ((c>>8)&255)/255, (c&255)/255, 1 );
    }
    return vec4(0,0,0,1);
}

/*
	Should you draw the frame for the block if you're in grid mode?
	Don't draw by block just draw grid surrounding cursor!
*/
function drawGridModeFrame(pZ){
	if(!gridMode) return false;
	if(upOne == Math.round(pZ)) return true;
	return false;
}

/*
	Changed to overlay
*/
function mult_colors(c1, c2){
	//return vec4(c1[0]*c2[0], c1[1]*c2[1],c1[2]*c2[2],c1[3]*c2[3]);

	return vec4(overlay(c1[0],c2[0]), overlay(c1[1],c2[1]), overlay(c1[2],c2[2]),overlay(c1[3],c2[3]));
}

function overlay(a,b){
	if(b < 0.5) return 2*a*b;
	else return 1 - 2*(1-a)*(1-b);
}



