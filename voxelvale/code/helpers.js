




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
	if(!hasInteractedWithWindow) return;
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



function getEnemySpawn(){
	if(SPAWN_ENEMIES){
		return "Turn enemies off.";
	}else{
		return "Turn enemies on.";
	}
}


function toShop(){
	player.posX = townFolkArray.accessElement(0).posX;
	player.posY = townFolkArray.accessElement(0).posY-1;
}


function addToInventory(){
	
	

	var axe = new WoodAxe();
	player.addToInventory(axe);
	toolBarList.push(axe)

	var pick = new StonePickaxe();
	player.addToInventory(pick);
	toolBarList.push(pick);

	let sword = new StoneSword();
	player.addToInventory(sword);

	var bow = new WoodenBow();	
	player.addToInventory(bow);

	if(!DEV_TOOLS)
		toolBarList.push(sword);
	//toolBarList.push(bow);

	var workbench = new WorkBench();
	player.addToInventory(workbench);
	if(!DEV_TOOLS)
		toolBarList.push(workbench);

	player.addToInventory(new WoodBlockRecipe())
	player.addToInventory(new DoorRecipe())
	var workbenchRecipe = new WorkBenchRecipe();
	player.addToInventory(workbenchRecipe);
	player.addToInventory(new ArrowRecipe());
	player.addToInventory(new ChestRecipe());

	player.addToInventory(new WoodenBucket());


	if(DEV_TOOLS){
		for(let i = 0; i < 30; i++)
			player.addToInventory(new ArrowItem());
	}else{
		for(let i = 0; i < 10; i++)
			player.addToInventory(new ArrowItem());
	}
	player.addToInventory(new HealthPotion());


	/*
		Add objects to inventory for testing here.
	*/
	if(DEV_TOOLS){
		
		chest = new Chest()
		player.addToInventory(chest);
		player.addToInventory(new DaytumPickaxe());
		
		player.addToInventory(new SandBlock());

		/*
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new WoodBlock());
		player.addToInventory(new GrassBlock());
		player.addToInventory(new WoodLog());
		*/
		
		/*
		player.addToInventory(new CopperPickaxe());
		player.addToInventory(new LatkinPickaxe());
		player.addToInventory(new IllsawPickaxe());
		player.addToInventory(new PlatinumPickaxe());
		player.addToInventory(new LunitePickaxe());
		player.addToInventory(new DaytumPickaxe());
		*/
		/*
		player.addToInventory(new CopperSword());
		player.addToInventory(new LatkinSword());
		player.addToInventory(new IllsawSword());
		player.addToInventory(new PlatinumSword());
		player.addToInventory(new LuniteSword());
		player.addToInventory(new DaytumSword());
		

		player.addToInventory(new CopperAxe());
		player.addToInventory(new LatkinAxe());
		player.addToInventory(new IllsawAxe());
		player.addToInventory(new PlatinumAxe());
		player.addToInventory(new LuniteAxe());
		player.addToInventory(new DaytumAxe());
	

		player.addToInventory(new CopperStone());
		player.addToInventory(new LatkinStone());
		player.addToInventory(new IllsawStone());
		player.addToInventory(new PlatinumStone());
		player.addToInventory(new LuniteStone());
		player.addToInventory(new DaytumStone());
		*/

		/*
		player.addToInventory(new Latkin());

		player.addToInventory(new WoodenBowRecipe());
	
		player.addToInventory(new CopperBarRecipe());
		player.addToInventory(new LatkinBarRecipe());
		player.addToInventory(new IllsawBarRecipe());
		player.addToInventory(new PlatinumBarRecipe());
		player.addToInventory(new LuniteBarRecipe());
		player.addToInventory(new DaytumBarRecipe());


		player.addToInventory(new CopperPickRecipe());
		player.addToInventory(new LatkinPickRecipe());
		player.addToInventory(new IllsawPickRecipe());
		player.addToInventory(new PlatinumPickRecipe());
		player.addToInventory(new LunitePickRecipe());
		player.addToInventory(new DaytumPickRecipe());



		player.addToInventory(new CopperAxeRecipe());
		player.addToInventory(new LatkinAxeRecipe());
		player.addToInventory(new IllsawAxeRecipe());
		player.addToInventory(new PlatinumAxeRecipe());
		player.addToInventory(new LuniteAxeRecipe());
		player.addToInventory(new DaytumAxeRecipe());


		player.addToInventory(new CopperSwordRecipe());
		player.addToInventory(new LatkinSwordRecipe());
		player.addToInventory(new IllsawSwordRecipe());
		player.addToInventory(new PlatinumSwordRecipe());
		player.addToInventory(new LuniteSwordRecipe());
		player.addToInventory(new DaytumSwordRecipe());

		


		player.addToInventory(new CopperBarRecipe());
		player.addToInventory(new CopperPickRecipe());
		player.addToInventory(new CopperAxeRecipe());
		player.addToInventory(new CopperSwordRecipe());
		
		let testShop = new WeirdBlock();

		player.addToInventory(testShop);

		//player.addToInventory(new DaytumSword());
		//let water = new Water();
		//player.addToInventory(water)
		*/
	
		//Latkin, Illsaw, Platinum, Lunite, Daytum
		/*
		player.addToInventory(new LatkinBar());
		player.addToInventory(new IllsawBar());
		player.addToInventory(new PlatinumBar());
		player.addToInventory(new LuniteBar());
		player.addToInventory(new DaytumBar());
		*/

		let woodenBucket = new WoodenBucket();
		player.addToInventory(woodenBucket);
		toolBarList.push(woodenBucket);
		

		//toolBarList.push(sword);
		toolBarList.push(workbench);
		//toolBarList.push(new WoodBlock());
		//let brewTable = new BrewingTable();
		//player.addToInventory(brewTable);
		//toolBarList.push(brewTable);
		toolBarList.push(null);

	}else{
		toolBarList.push(null);
		toolBarList.push(null);
		toolBarList.push(null);
	}

	/*
		End adding objects to testing.
	*/
}


