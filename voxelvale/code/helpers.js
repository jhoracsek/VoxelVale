




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

	if(!world.isSpaceOccupied(x,y,-3)){
		var enemy = new Undead(x,y,-6);
		enemy.initialize_enemy();
		enemyArray.push(enemy);
	}

}