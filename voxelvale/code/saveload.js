


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


	let instanceBlocksObjectNumbers = [9, 14];
	let instanceBlocks = [];

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

				if(instanceBlocksObjectNumbers.includes(non_ceiling[k].objectNumber)){
					instanceBlocks.push(non_ceiling[k]);
				}
			}
			let ceiling = portionBlocks[1];
			for(let k = 0; k < ceiling.length; k++){
				if(ceiling[k].objectNumber == -1)
					continue;
				posXs.push(ceiling[k].posX);
				posYs.push(ceiling[k].posY);
				posZs.push(ceiling[k].posZ);
				
				objNums.push(ceiling[k].objectNumber);

				if(instanceBlocksObjectNumbers.includes(ceiling[k].objectNumber)){
					instanceBlocks.push(ceiling[k]);
				}
			}
		}
	}
	const xPositions = JSON.stringify(posXs);
	const yPositions = JSON.stringify(posYs);
	const zPositions = JSON.stringify(posZs);
	const objectNumbers = JSON.stringify(objNums);

	/*
		Some blocks have instance properties that need to be saved.

		These should be added to 'instanceBlocks'.

		Current blocks and objectNumbers:
			DropBox 		9
			Door 			14
		These objectNumbers should be added to 'instanceBlocksObjectNumbers'.

		This information will be stored as [objectNumber, pX, pY, pZ, 'additional data dependent on block']
	*/
	let blockInstanceInformation = [];
	for(let i = 0; i < instanceBlocks.length; i++){
		let currentObjNum = instanceBlocks[i].objectNumber;
		let store = [currentObjNum, instanceBlocks[i].posX, instanceBlocks[i].posY, instanceBlocks[i].posZ];

		switch(currentObjNum){
			/*
				DropBox

				getObjectQuantity pair returns [object, quantity]

				We will just store the id and the quantity like
				store = [..., obj1Num, obj1Quant, obj2Num, obj2Quant,...]
			*/
			case 9:
				let objQPair = instanceBlocks[i].getObjectQuantityPair();
				for(let j = 0; j < objQPair.length; j++){
					store.push(objQPair[j][0].objectNumber);
					store.push(objQPair[j][1]);
				}
				break;

			/*
				Door
			*/
			case 14:
				//Implement.
				break;
		}
		blockInstanceInformation.push(store);
	}
	const blockInstanceInformationString = JSON.stringify(blockInstanceInformation);






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

	

	return [xPositions, yPositions, zPositions,objectNumbers, blockInstanceInformationString, invObjectNumbers, [player.posX, player.posY]];
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
	let blockInstanceInformation = JSON.parse(loadedWorld.blockInstanceInfo);

	for(let i = 0; i < objNums.length; i++){
		if(objNums[i]!=null){
			let blockToAdd = new BLOCK_OBJNUMS[objNums[i]](posXs[i],posYs[i],posZs[i]);
			world.addBlock(blockToAdd);
			
		}
	}

	/*
		Some blocks have instance properties that need to be loaded.

		Current blocks and objectNumbers:
			DropBox 		9
			Door 			14

		This information is saved in 'blockInstanceInformation'.

		'blockInstanceInformation' is formatted as follows:

		[store1, store2, store3, ...]

		Each store has the format:
		storei = [objectNumber, pX, pY, pZ, 'additional data dependent on block']
	*/

	for(let i = 0; i < blockInstanceInformation.length; i++){
		let store = blockInstanceInformation[i];

		var blockToChange = world.getBlockAt(store[1], store[2], store[3]);
		switch(store[0]){
			/*
				DropBox

				store is formatted as:
				store = [..., obj1Num, obj1Quant, obj2Num, obj2Quant,...]
			*/
			case 9:
				for(let j = 4; j < store.length; j+=2){
					let objNum = store[j];
					let objQuant = store[j+1];
					for(let z = 0; z < objQuant; z++)
						blockToChange.addTo(getObjectBasedOnObjectNumber(objNum));

				}
				break;
			//Door
			case 14:

				break;
				
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

		//Update using new method!!!
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

function getObjectBasedOnObjectNumber(objectNumber){
	let object = null;
	
	// Block
	if(objectNumber < 64){
		object = new BLOCK_OBJNUMS[objectNumber](null,null,null);
	}

	// Item
	else if(objectNumber < 128){
		object = new ITEM_OBJNUMS[objectNumber-64]();
	}

	//Recipe
	else if(objectNumber < 256){
		object = new RECIPE_OBJNUMS[objectNumber-128]();
	}
	return object;
}

