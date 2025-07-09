


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


	let instanceBlocksObjectNumbers = [9, 14, 18];
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
			Chest 			18
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

				Need to store:
					originalInstanceMat		(will be flattened)
					instanceMat 			(will be flattened)	
					isOpen
					rotateOpen
					relativeAngle			(not really necessary, but just in case)
					orientationAngle
					isLeft
			*/
			case 14:
				let door = instanceBlocks[i];
				store.push(flatten(door.originalInstanceMat));
				store.push(flatten(door.instanceMat));
				store.push(door.isOpen);
				store.push(door.rotateOpen);
				store.push(door.relativeAngle);
				store.push(door.orientationAngle);
				store.push(door.isLeft);
				break;

			/*
				Chest

				getBlockList 	returns [block, quantity]
				getToolList		returns [tool, quantity]
				getItemList		returns [item, quantity]
				getRecipeList	returns [recipe, quantity]
	
				orientation

				We can simple store as
				store = [..., orientation, obj1Num, obj1Quant, obj2Num, obj2Quant,...]
			*/
			case 18:
				let chest = instanceBlocks[i];
				store.push(chest.orientation);

				let blockList = chest.getBlockList();
				let toolList = chest.getToolList();
				let itemList = chest.getItemList();
				let recipeList = chest.getRecipeList();

				for(let j = 0; j < blockList.length; j++){
					store.push(blockList[j][0].objectNumber);
					store.push(blockList[j][1]);
				}
				for(let j = 0; j < toolList.length; j++){
					store.push(toolList[j][0].objectNumber);
					store.push(toolList[j][1]);
				}
				for(let j = 0; j < itemList.length; j++){
					store.push(itemList[j][0].objectNumber);
					store.push(itemList[j][1]);
				}
				for(let j = 0; j < recipeList.length; j++){
					store.push(recipeList[j][0].objectNumber);
					store.push(recipeList[j][1]);
				}

				break;

		}
		blockInstanceInformation.push(store);
	}
	const blockInstanceInformationString = JSON.stringify(blockInstanceInformation);






	/*
		Inventory ----------------------------
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
	//Non-actionable items
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

	toolbarIDs = [];
	for(let i = 0; i < toolBarList.length; i++){
		if(toolBarList[i]!=null)
			toolbarIDs.push(toolBarList[i].objectNumber);
	}

	return [xPositions, yPositions, zPositions,objectNumbers, blockInstanceInformationString, invObjectNumbers, [player.posX, player.posY], player.health, toolbarIDs];
}

function loadWorldIntoGame(loadedWorld){
	disableNotifications = true;
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
			/*

				Door

				Need to load:
					4: originalInstanceMat		(needs to be unflattened)
					5: instanceMat 			(needs to be unflattened)	
					6: isOpen
					7: rotateOpen
					8: relativeAngle			(not really necessary, but just in case)
					9: orientationAngle
					10: isLeft

				store is formatted as:
				store = [..., same order as above].
			*/
			case 14:
				blockToChange.originalInstanceMat = unflatten(store[4]);
				blockToChange.instanceMat  = unflatten(store[5]);
				blockToChange.isOpen  = store[6];
				blockToChange.rotateOpen = store[7];
				blockToChange.relativeAngle = store[8];
				blockToChange.orientationAngle = store[9];
				blockToChange.isLeft = store[10];
				break;

			
			/*
				Chest

				store is formatted as:
				store = [..., orientation, obj1Num, obj1Quant, obj2Num, obj2Quant,...]
				Where orientation is 4.
			*/
			case 18:
				blockToChange.orientation = store[4];
				for(let j = 5; j < store.length; j+=2){
					let objNum = store[j];
					let objQuant = store[j+1];
					blockToChange.addObject(getObjectBasedOnObjectNumber(objNum), objQuant);

				}
				break;
				
		}

	}


	/*
		Inventory ------------------
	*/
	let inventoryContents = JSON.parse(loadedWorld.invObjNums);

	inventory = false;
	fQueue.empty();
	pQueue.empty();
	keyboardDisabled=false;
	disableInventoryCursor = false;
	player.resetInventory();
	toolBarList = [null, null, null, null, null, null, null];
	toolBarIDs = loadedWorld.toolbar;
	for(let i = 0; i < inventoryContents.length; i++){

		//Update using new method!!!
		if(inventoryContents[i] < 64){
			//Block
			let object = new BLOCK_OBJNUMS[inventoryContents[i]](null,null,null)
			player.addToInventory(object);
			for(let j = 0; j < toolBarIDs.length;j++){
				if(inventoryContents[i] == toolBarIDs[j])
					toolBarList[j] =object;
			}
		}
		else if(inventoryContents[i] < 128){
			//Item
			let item = new ITEM_OBJNUMS[inventoryContents[i]-64]();
			player.addToInventory(item);
			/*
				Add tools to toolbar.
			*/
			for(let j = 0; j < toolBarIDs.length;j++){
				if(inventoryContents[i] == toolBarIDs[j])
					toolBarList[j] =item;
			}
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
	player.health = loadedWorld.health;
	activeToolBarItem = 0;
	player.heldObject = null;
	//toolBarList = loaded.toolbar;
	disableNotifications = false;
	enemyArray = new ProperArray();
}



/*
	Need to clean this up.
*/
const BLOCK_OBJNUMS = [WoodBlock, WeirdBlock,GrassBlock,WoodLog,WoodBranch,StoneBlock,WorkBench,TestBlock,DirtBlock,DropBox,BrickBlock,StoneFloorBlock,DungeonWall,TeleBlock,Door,BorderWall,CopperStone,CopperBrick,Chest];



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


/*
	Converts a 1X16 vector to a 4X4 matrix.
*/
function unflatten(vector){
	let mat = mat4();
	for(let i = 0; i < 16; i++){
		mat[i%4][Math.floor(i/4)] = vector[i];
	}
	return mat;
}


