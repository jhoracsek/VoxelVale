
class WaterOld extends BlockWallNew{
	static name = 'Water';
	static objectNumber=1000000000;
	static desc = 'How did you get this in your inventory?!?!?'
	static texture = 52;
	static tob='STONE'; // Will be water type.
	static correctTextureOrientation = true;
	static isFluid = true;

	static sourceStart = 0;
	static sourceNumber = 0;

	static flowStart = 0;
	static flowNumber = 0;


	static sendData(){ //38 39

		this.sourceStart = vertices.length;
		build_block(38,0.0,0.0);
		this.sourceNumber = vertices.length - this.sourceStart;


		this.flowStart = vertices.length;
		build_block(39,0.0,0.0);
		this.flowNumber = vertices.length - this.flowStart;

	}

	/*
		Source begins,
			Spawns children.
			Basically a tree.
	*/
	constructor(X=null,Y=null,Z=null,level=4, parent=null){
		super(X,Y,Z,false);

		this.count = 0;
		this.isAlive = true;
		this.refreshAdj = true;

		this.parent = parent;
		this.parents = [parent];

		this.level = level;
		this.source = null;
		this.sources = null;
		this.isSource = false;

		
		if(level == 4){
			this.source = this;
			this.sources = [this];
			this.isSource = true;
		}
		else{
			this.source = parent.source;
			this.sources = [parent.sources[0]];
		}

		//Just for testing.
		this.numberSpawned = [false,false,false,false];;
		this.wasRefreshed = [-1,-1];
		//Only five acceptable levels 0.00, 0.25, 0.5, 0.75, 1.00.
		// Can make a 'mechanics video about this.' Highlight the source as a different colour.
		// If level ever gets updated then you need to propogate these changes to the surrounding blocks.
		// Talk about this, and how infinite water glitch could work.
		// buckets can be made from wood.


		this.numTimesUpdated = 0;
	}

	increaseLevel(level){
		//0.75 + 0.75 = 1.5 	1
		//0.5 + 0.75 = 1.25 	1
		
		//0.25 + 0.75 = 0.75
		


		this.wasRefreshed = [this.level, level];

		let newLevel = Math.max(level,this.level);
		if(newLevel > this.level){
			this.level = newLevel;
			this.refreshAdj = true;
		}
	}

	destroy(){
		//super.destroy();
		this.isAlive = false;
	}

	onClick(){
		console.log('My level is:', this.level,'.');
		console.log('I spawned these: [', this.numberSpawned.toString(), '] neighbour(s).')
		console.log('I was refreshed and these are the levels I considered:', this.wasRefreshed);
		console.log('I was updated:',this.numTimesUpdated,'time(s).')
	}

	compareSource(Water){
		if(this.posX == Water.posX && this.posY == Water.posY && this.posZ == Water.posZ )
			return true;
		return false;
	}

	addParent(parent){
		if(parent.getLevel() > this.getLevel())
			this.parents.push(parent);
	}

	refreshParents(){
		for(let i = 0; i < this.parents.length; i++){
			
		}
	}

	getLevel(){
		//should be calculated based on the level of the parents.
		//Also refresh parents here.
	}


	//Reset source.
	/*
		If your level ever becomes 4, then you have no parents!

	*/
	setLevel(){

	}

	//Can only pick up if source the block is a source...
	//If you place water in a source do nothing.

	spawnAdj(){
		/*
			Spawn four adj blocks
		*/
		
		if(this.level > 0){
			let leftAdded = world.refreshWater(this.posX-1, this.posY, this.posZ,this.level-1,this);
			let rightAdded = world.refreshWater(this.posX+1, this.posY, this.posZ,this.level-1,this);
			let topAdded = world.refreshWater(this.posX, this.posY+1, this.posZ,this.level-1,this);
			let bottomAdded = world.refreshWater(this.posX, this.posY-1, this.posZ,this.level-1,this);
	
			this.numberSpawned = [leftAdded,rightAdded,topAdded,bottomAdded];
		}
	}

	updateFlow(){
		if(logicCounter == 0 || logicCounter == 30){ //&& this.refreshAdj){
			this.spawnAdj();
			this.refreshAdj = false;
		}

		if(logicCounter == 15 || logicCounter == 45){
			//Keep it like this because it might be tweaked.
			if(!this.isSource && (this.parent == null || !this.parent.isAlive )){
				world.removeBlockByPos(this.posX,this.posY,this.posZ);
			}
		}

		this.count = (this.count + 1)%60;
	}

	draw(){
		this.updateFlow();
		if(!this.isCeiling){
			let scaleMat = mult(translate(0,0,1),mult(scale4(1,1,this.level/4+0.05),translate(0,0,-1)));
			set_mv(mult(this.instanceMat,scaleMat));
			if(hitBox){
				gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
			}


			if(this.source===this){
				gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+6,this.constructor.sourceNumber-6);
			}else{
				gl.drawArrays(gl.TRIANGLES,this.constructor.flowStart+6,this.constructor.flowNumber-6);
			}
		}
	}


}

/*
	OLD FUNCTIONS FOR NETWORK SPLIT IN WATERNETWORK CLASS

*/
	/*
		Returns a list of blocks adjacent to 'water'
		that exist in the network.

		Starts by constructing:
		[indexLeftWater, indexRightWater, indexAboveWater, indexBelowWater]

		Then sorts as:
		[highestIndex, ..., ..., lowestIndex]

		If directionWater does not exists the function
		returns -1 in that position.

		NOTES:
			NEEDS TO BE OPTIMIZED!!! SOOOOO EASY JUST ADD
			A REFERENCE TO ADJACENT BLOCKS
	*/
	getAdj(water){
		let ret = [-1, -1, -1, -1];
		let pX = water.posX;
		let pY = water.posY;

		for(let i = 0; i < this.network.length; i++){
			if(this.network[i].posX == pX-1 && this.network[i].posY == pY)
				ret[0] = i;
			if(this.network[i].posX == pX+1 && this.network[i].posY == pY)
				ret[1] = i;
			if(this.network[i].posX == pX && this.network[i].posY == pY+1)
				ret[2] = i;
			if(this.network[i].posX == pX && this.network[i].posY == pY-1)
				ret[3] = i;
		}

		return ret.sort(function(a,b){return b-a;});
	}

	/*
		Builds a network from water.
	*/
	buildNetworkFrom(water, numAdj){
		//console.log('BUILDING NEW NETWORKS...')


		let TOTAL_SIZE = this.network.length;

		
		let updatedNetwork = [water];
		let addedBlocks = [water];


		/*
			MAKE SURE TO UPDATE REFERENCES TO NEW NETWORK!!!!!
		*/
		while(addedBlocks.length > 0){
			let len = this.network.length-1;
			let adjIndices = this.getAdj(addedBlocks.pop());

			console.log(adjIndices)

			if(adjIndices[0] == -1){
				
			}
			else{
				
				//Add to new network
				updatedNetwork.push(this.network[adjIndices[0]]);
				addedBlocks.push(this.network[adjIndices[0]]);

				//Remove from old network
				this.network[adjIndices[0]] = this.network[len];
				this.network.pop();
			}

			if(adjIndices[1] == -1){
				
			}
			else{
				updatedNetwork.push(this.network[adjIndices[1]]);
				addedBlocks.push(this.network[adjIndices[1]]);

				this.network[adjIndices[1]] = this.network[len-1];
				this.network.pop();	
			}

			if(adjIndices[2] == -1){
				
			}
			else{
				updatedNetwork.push(this.network[adjIndices[2]]);
				addedBlocks.push(this.network[adjIndices[2]]);

				this.network[adjIndices[2]] = this.network[len-2];
				this.network.pop();	
			}

			if(adjIndices[3] == -1){
				
			}
			else{
				updatedNetwork.push(this.network[adjIndices[3]]);
				addedBlocks.push(this.network[adjIndices[3]]);

				this.network[adjIndices[3]] = this.network[len-3];
				this.network.pop();	
			}
			//remove this.network at adjIndices[0].

		}

		/*
			THERE WAS ONLY ONE NETWORK SHOOT.
		*/
		if(this.network.length == 0){

			this.network = updatedNetwork;
			return;
		}else{
			// Create a new network and add updatedNetwork blocks
			// to it. new WaterNetwork(Initial water block);

			if(updatedNetwork.length == 0)
				return;

			//Figure out the level?
			// Should be level divided by something...
			// like number of blocks in the level.

			let newNetwork = new WaterNetwork(updatedNetwork[0], this.level)
			updatedNetwork[0].network = newNetwork;

			for(let j = 1; j < updatedNetwork.length; j++){
				updatedNetwork[j].network = newNetwork;
				newNetwork.network.push(updatedNetwork[j]);
			}
			waterNetworkArray.push(newNetwork);

			if(numAdj == 2){
				/*
					Need to update the levels!


				*/
				newNetwork.level = this.level * (newNetwork.network.length / TOTAL_SIZE)
				this.level = this.level * (this.network.length / TOTAL_SIZE)


				return;
			}
		}

		//Now basically do the same thing...




		//Now make a new network


		//if numAdj == 2 I think we're done, because we now have two networks
		// JUST RESTART!
		return;
	}



	/*

		I mean, this seems to happen under a few cases.

			1) a block is placed that interupts the network.
			2) A bucket is used when the network is at the lowest level,
				since the bucket reduces the level of the network, this creates a 
				'hole' in the water which is similar to a block being placed. 

			Since this could only feasibly happen upon a user interaction,
			at positions: posX, posY, it would make sense to check the four surrounding
			positions.
	
			If water (in the network?) exists at more then 3 adjacent positions,
			don't split. If it exists at exactly 2, then split. If only 1, no need
			to split at all, (because the second network would be empty).
	*/
	/*
	tryToSplitNetwork(water){
		
	}
	*/

		/*
		console.log('\nTesting split:')
		console.log('Network 1:', network1Array.length)
		console.log('Network 2:', network2Array.length)
		console.log('Network 3:', network3Array.length)
		console.log('Network 4:', network4Array.length)
		*/