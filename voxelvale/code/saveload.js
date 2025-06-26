


/*
	Functions for saving and loading an existing world.

	Todo: Add ability to save dungeons.


	Note: 	Most blocks store very little information.
			For 90% just their position and objectNumber are sufficient.

			dropboxes and later chest will be a little more tricky and require more memory.
*/



/*
	Need position of all blocks.

	Contents and locations of any dropboxes/chest.

	Player inventory contents.

*/
function getWorldObj(){

	/*
		World
	*/
	let posXs = [];
	let posYs = [];
	let posZs = [];
	let objNums = [];

	for(let i = 0; i <= world.size; i++){
		for(let j = 0; j <= world.size; j++){
			//portionBlocks[0] is an array of all non-ceiling blocks.
			//portionBlocks[1] is an array of all ceiling blocks.
			let portionBlocks = world.portions[i][j].getPortionArray()

			let non_ceiling = portionBlocks[0];
			for(let k = 0; k < non_ceiling.length; k++){
				if(non_ceiling[k].objectNumber == -1)
					continue;
				posXs.push(non_ceiling[k].posX);
				posYs.push(non_ceiling[k].posY);
				posZs.push(non_ceiling[k].posZ);
		
				objNums.push(non_ceiling[k].objectNumber);
			}
			let ceiling = portionBlocks[1];
			for(let k = 0; k < ceiling.length; k++){
				if(ceiling[k].objectNumber == -1)
					continue;
				posXs.push(ceiling[k].posX);
				posYs.push(ceiling[k].posY);
				posZs.push(ceiling[k].posZ);
				
				objNums.push(ceiling[k].objectNumber);
			}
		}
	}
	const xPositions = JSON.stringify(posXs);
	const yPositions = JSON.stringify(posYs);
	const zPositions = JSON.stringify(posZs);
	const objectNumbers = JSON.stringify(objNums);

	/*
		Inventory
	*/
	let inventoryContents = player.getInventoryContents();
	let inventoryObjNums = [];
	//Blocks
	for(let i = 0; i < inventoryContents[0].length; i++){
		let q = player.getObjectQuantity(inventoryContents[0][i]);
		for(let k = 0; k < q; k++)
			inventoryObjNums.push(inventoryContents[0][i].objectNumber);
	}
	//Tools
	for(let i = 0; i < inventoryContents[1].length; i++){
		let q = player.getObjectQuantity(inventoryContents[1][i]);
		for(let k = 0; k < q; k++)
			inventoryObjNums.push(inventoryContents[1][i].objectNumber);
	}
	//Non tool items
	for(let i = 0; i < inventoryContents[2].length; i++){
		let q = player.getObjectQuantity(inventoryContents[2][i]);
		for(let k = 0; k < q; k++)
			inventoryObjNums.push(inventoryContents[2][i].objectNumber);
	}
	//Recipes
	for(let i = 0; i < inventoryContents[3].length; i++){
		let q = player.getObjectQuantity(inventoryContents[3][i]);
		for(let k = 0; k < q; k++)
			inventoryObjNums.push(inventoryContents[3][i].objectNumber);
	}

	const invObjectNumbers = JSON.stringify(inventoryObjNums);

	

	return [xPositions, yPositions, zPositions,objectNumbers, invObjectNumbers, [player.posX, player.posY]];
}

function loadWorldIntoGame(loadedWorld){
	/*
		World
	*/
	if(loadedWorld == null){ 
		console.log("Failed to load world.")
		return;
	}
	world = null;
	world = new World(WORLD_SIZE);
	world.fillAllEmpty();

	let posXs = JSON.parse(loadedWorld.xPos);
	let posYs = JSON.parse(loadedWorld.yPos);
	let posZs = JSON.parse(loadedWorld.zPos);
	let objNums = JSON.parse(loadedWorld.objectNumbers);

	for(let i = 0; i < objNums.length; i++){
		//console.log(posXs[i],posYs[i],posZs[i]);
		if(objNums[i]!=null){
			world.addBlock( new BLOCK_OBJNUMS[objNums[i]](posXs[i],posYs[i],posZs[i]) );
		}
	}

	/*
		Inventory
	*/
	let inventoryContents = JSON.parse(loadedWorld.invObjNums);

	inventory = false;
	fQueue.empty();
	pQueue.empty();
	keyboardDisabled=false;
	disableInventoryCursor = false;
	player.resetInventory();
	toolBarList = [];
	for(let i = 0; i < inventoryContents.length; i++){
		if(inventoryContents[i] < 64){
			//Block
			player.addToInventory(new BLOCK_OBJNUMS[inventoryContents[i]](null,null,null));
		}
		else if(inventoryContents[i] < 128){
			//Item
			let item = new ITEM_OBJNUMS[inventoryContents[i]-64]();
			player.addToInventory(item);
			/*
				Add tools to toolbar.
			*/
			if(inventoryContents[i] == 64)
				toolBarList.push(item);
			if(inventoryContents[i] == 65)
				toolBarList.push(item);
			if(inventoryContents[i] == 66)
				toolBarList.push(item);
		}
		else if(inventoryContents[i] < 256){
			//Recipe
			player.addToInventory(new RECIPE_OBJNUMS[inventoryContents[i]-128]());
		}
	}
	//Clear tool bar

	// Reset player coordinates.
	let playerPosition = loadedWorld.position;
	player.posX = playerPosition[0];
	player.posY = playerPosition[1];
	

}

/*
	Need to clean this up.
*/
const BLOCK_OBJNUMS = [WoodBlock, WeirdBlock,GrassBlock,WoodLog,WoodBranch,StoneBlock,WorkBench,TestBlock,DirtBlock,DropBox,BrickBlock,StoneFloorBlock,DungeonWall,TeleBlock,Door];
const ITEM_OBJNUMS = [WoodAxe, StonePickaxe, WoodenBow];
const RECIPE_OBJNUMS = [WorkBenchRecipe];

