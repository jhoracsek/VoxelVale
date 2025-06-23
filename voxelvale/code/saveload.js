


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
	console.log(posXs.length, posYs.length, posZs.length)
	const objectNumbers = JSON.stringify(objNums);

	return [xPositions, yPositions, zPositions,objectNumbers];
}

function loadWorldIntoGame(loadedWorld){
	//const obj = JSON.parse(json);
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
	//82862 82862 82862
	//console.log('Here',posXs.length, posYs.length, posZs.length)

	let objNums = JSON.parse(loadedWorld.objectNumbers);

	for(let i = 0; i < objNums.length; i++){
		//console.log(posXs[i],posYs[i],posZs[i]);
		if(objNums[i]!=null){
			world.addBlock( new BLOCK_OBJNUMS[objNums[i]](posXs[i],posYs[i],posZs[i]) );
		}
		//console.log('poop')
	}
}


const BLOCK_OBJNUMS = [WoodBlock, WeirdBlock,GrassBlock,WoodLog,WoodBranch,StoneBlock,WorkBench,TestBlock,DirtBlock,DropBox,BrickBlock,StoneFloorBlock,DungeonWall,TeleBlock,Door]
function getBlockByObjectNumber(objNumber){
	return BLOCK_OBJNUMS[objNumber];
}