//Depends on world size
var worldArray=[];
var currentBlockDrawList=[];
var PORTION_SIZE = 10;
var POSX;
var POSY;
var world;

//Old: WORLD_SIZE = 25;
const WORLD_SIZE = 44;

//WORLD PORTION HAS AN X CHANCE TO BE A DUNGEON
class WorldPortion{
	constructor(X=null,Y=null, Empty=false){
		this.posX=X*PORTION_SIZE;
		this.posY=Y*PORTION_SIZE;
		this.outerBoundX=this.posX+PORTION_SIZE;
		this.outerBoundY=this.posY+PORTION_SIZE;
		this.portion=[];
		this.portionCeiling=[];	//For blocks at levels above the player. I.e., -6, -5.



		/*
			Levels -3 and -4
			spaceOccupied is a 3D-array of booleans used for projectile collisions.

			spaceOccupied[0] is a 2D array of size: PORTION_SIZE*PORTION_SIZE.
			If you want to see if there is a block at any point (i, j, -4 ) you would access it like
			spaceOccupied[0][i - this.posX][j - this.posY]. Similarly, for a point (i,j,-3) you
			would access like spaceOccupied[1][i - this.posX][j - this.posY].
		*/
		this.canGenerateGlobalStructures = true;
		this.fluids=[];
		this.spaceOccupied = [[],[]];
		if(X!=null && Empty==false){
			if(GEN_OLD_STYLE_WORLD){
				this.makePortion();
			}else{
				this.generatePortion();
			}
		}

		if(X!=null && Empty==true)
			this.makeEmptyPortion();

		
	}

	/*
		Returns true if the space is occupied.
		Used for projectile collisions, so it only 
		works for levels -3 and -4.
	*/
	isSpaceOccupied(PX, PY, PZ){
		// Should return some error here.
		if (PZ != -3 && PZ != -4)
			return false;
		return this.spaceOccupied[PZ + 4][PX - this.posX][PY - this.posY];
	}

	setSpaceOccupied(PX,PY,PZ, val=true){
		if (PZ != -3 && PZ != -4)
			return;
		this.spaceOccupied[PZ + 4][PX - this.posX][PY - this.posY] = val;
	}

	getFluid(PX,PY,specifyNetworkId=-1){
		if(specifyNetworkId == -1)
			return this.fluids[PX-this.posX][PY-this.posY];
		else{
			let fluid = this.fluids[PX-this.posX][PY-this.posY];
			if(fluid!=null && fluid.network.id == specifyNetworkId){
				return fluid;
			}else{
				return null;
			}
		}
	}

	setFluid(PX,PY, val=null){
		this.fluids[PX-this.posX][PY-this.posY] = val;
		return;
	}

	push(block){
		//Check within cluster
		let px = block.posX;
		let py = block.posY;
		let pz = block.posZ;
		if(this.isSpaceOccupied(px, py, pz))//||px >= this.outerBoundX || px < this.posX || py >= this.outerBoundY || py < this.posY)
			return;
		if(block.posZ >= -4){
			this.portion.push(block);
			this.setSpaceOccupied(px,py,pz);
		}else{
			this.portionCeiling.push(block);
		}
	}
	makeEmptyPortion(){
		for(var i = 0; i < PORTION_SIZE; i++){
			var occ1 = [];
			var occ2 = [];
			var flu = [];
			for(var j = 0; j < PORTION_SIZE; j++){
				occ1.push(false);
				occ2.push(false);
				flu.push(null);
			}
			this.spaceOccupied[0].push(occ1);
			this.spaceOccupied[1].push(occ2);
			this.fluids.push(flu);
		}
	}
	generatePortion(){
		for(var i = 0; i < PORTION_SIZE; i++){
			var occ1 = [];
			var occ2 = [];
			var flu = [];
			for(var j = 0; j < PORTION_SIZE; j++){
				occ1.push(false);
				occ2.push(false);
				flu.push(null);
			}
			this.spaceOccupied[0].push(occ1);
			this.spaceOccupied[1].push(occ2);
			this.fluids.push(flu);
		}

		let startingPositionX = lastPos[0];
		let startingPositionY = lastPos[1];



		if( (startingPositionX <= this.outerBoundX) && (startingPositionX >= this.posX)){
			if(( startingPositionY >= this.posY) && (startingPositionY <= this.outerBoundY) ){
	
				this.canGenerateGlobalStructures = false;

				for(var i = this.posX; i < this.outerBoundX; i++){
					for(var j = this.posY; j < this.outerBoundY; j++){
						this.push(new GrassBlock(i,j,-2));

					}
				}
				return;
			}
			
		}

		/*
			Generate border
			We do this first to avoid anyoverlap
		*/
		for(var i = this.posX; i < this.outerBoundX; i++){
			for(var j = this.posY; j < this.outerBoundY; j++){
				if(i==0 || j==0){
					this.push(new BorderWall(i,j,-3));
				}

				if(i > PORTION_SIZE*WORLD_SIZE && i == this.outerBoundX-1)
					this.push(new BorderWall(i,j,-3));

				if(j > PORTION_SIZE*WORLD_SIZE && j == this.outerBoundY-1)
					this.push(new BorderWall(i,j,-3));

			}
		}
	}

	generateGrass(testMode=true){
		//Make temp 2D grid.
		let tempGrid = [];
		for(let i = 0; i < PORTION_SIZE; i++){
			let temp = [];
			for(let j = 0; j < PORTION_SIZE; j++){
				temp.push(false);
			}
			tempGrid.push(temp);
		}

		for(let i = 0; i < this.portion.length; i++){
			if(this.portion[i].posZ == -2){
				let pX = this.portion[i].posX-this.posX;
				let pY = this.portion[i].posY-this.posY;

				tempGrid[pX][pY] = true;
			}
		}

		for(var i = this.posX; i < this.outerBoundX; i++){
			for(var j = this.posY; j < this.outerBoundY; j++){
				if(!tempGrid[i-this.posX][j-this.posY]){
					


					if(DEV_TOOLS && GEN_SHOP){
						let test_num = get_portion_distance_from_start(i,j);

						if(test_num == 3){
							this.push(new GrassBlock(i,j,-2));
						}else{
							this.push(new GrassBlock(i,j,-2));
						}
					}else{
						if(testMode)
							this.push(new GrassBlock(i,j,-2));
						else
							this.push(new GrassBlock(i,j,-2));
					}
					/*
					//For testing:
					let test_num = get_portion_distance_from_start(i,j);
					switch(test_num){
						case 0:
							this.push(new GrassBlock(i,j,-2));	
							break;
						case 1:
							this.push(new WoodBlock(i,j,-2));
							break;
						case 2:
							this.push(new WeirdBlock(i,j,-2));
							break;
						case 3:
							this.push(new TestBlock(i,j,-2));
							break;
						case 4:
							this.push(new GrassBlock(i,j,-2));
							break;
					}
					*/
				}
			}
		}
	}
	makePortion(){
		for(var i = 0; i < PORTION_SIZE; i++){
			var occ1 = [];
			var occ2 = [];
			var flu = [];
			for(var j = 0; j < PORTION_SIZE; j++){
				occ1.push(false);
				occ2.push(false);
				flu.push(null);
			}
			this.spaceOccupied[0].push(occ1);
			this.spaceOccupied[1].push(occ2);
			this.fluids.push(flu);
		}

		//lastPos[0] and lastPos[1] is the starting point. So make sure nothing is generated in that block.
		let startingPositionX = lastPos[0];
		let startingPositionY = lastPos[1];

		if( (startingPositionX < this.outerBoundX) && (startingPositionX > this.posX)){
			if(( startingPositionY > this.posY) && (startingPositionY < this.outerBoundY) ){
				for(var i = this.posX; i < this.outerBoundX; i++){
					for(var j = this.posY; j < this.outerBoundY; j++){
						this.push(new GrassBlock(i,j,-2));
					}
				}
				return;
			}
			
		}

		/*
			Generate border
			We do this first to avoid anyoverlap
		*/
		for(var i = this.posX; i < this.outerBoundX; i++){
			for(var j = this.posY; j < this.outerBoundY; j++){
				if(i==0 || j==0){
					this.push(new BorderWall(i,j,-3));
				}

				if(i > PORTION_SIZE*WORLD_SIZE && i == this.outerBoundX-1)
					this.push(new BorderWall(i,j,-3));

				if(j > PORTION_SIZE*WORLD_SIZE && j == this.outerBoundY-1)
					this.push(new BorderWall(i,j,-3));

			}
		}

		
		
		if(GEN_DUNGEONS && generate_by_probability(0.15)){
			for(var i = this.posX; i < this.outerBoundX; i++){
				for(var j = this.posY; j < this.outerBoundY; j++){
					//Do wood if underneath dungeon.
					if( (j-this.posY) <= 6 && (j-this.posY) > 1 && (i - this.posX) >0 && (i-this.posX) <8  ){
						this.push(new WoodBlock(i,j,-2));
					}else{
						this.push(new GrassBlock(i,j,-2));
					}
				}
			}
			var retArray = gen_dungeon_BL(this.posX,this.posY+2);
			for(var z=0;z<retArray.length;z++)
				this.push(retArray[z]);
			return;
		}
	
		
		for(var i = this.posX; i < this.outerBoundX; i++){
			for(var j = this.posY; j < this.outerBoundY; j++){
				


				/*
					Generate stonecluster.
				*/
				if(generate_by_probability(0.01)){
					var retArray = gen_stone_cluster(i,j);
					for(var z = 0; z < retArray.length; z++){
						if(retArray[z].posX >= this.posX && retArray[z].posY >= this.posY && retArray[z].posX < this.outerBoundX && retArray[z].posY < this.outerBoundY){
							var isOccupied=false;
							for(var k = 0; k < this.portion.length; k++){
								if(this.portion[k].posX==retArray[z].posX && this.portion[k].posY==retArray[z].posY && this.portion[k].posZ==retArray[z].posZ)
									isOccupied=true;
							}
							if(!isOccupied)
								this.push(retArray[z]);
						}
					}
				}

				/*
					Generate tree.
				*/
				if(generate_by_probability(0.011)){
					var retArray = gen_tree(i,j);
					var isOccupied=false;
					for(var z = 0; z < retArray.length; z++){
						if(retArray[z].posX >= this.posX && retArray[z].posY >= this.posY && retArray[z].posX < this.outerBoundX && retArray[z].posY < this.outerBoundY){
							for(var k = 0; k < this.portion.length; k++){
								if(this.portion[k].posX==retArray[z].posX && this.portion[k].posY==retArray[z].posY && this.portion[k].posZ==retArray[z].posZ)
									isOccupied=true;
							}
							for(var k = 0; k < this.portionCeiling.length; k++){
								if(this.portionCeiling[k].posX==retArray[z].posX && this.portionCeiling[k].posY==retArray[z].posY && this.portionCeiling[k].posZ==retArray[z].posZ)
									isOccupied=true;
							}
							if(!isOccupied)
								this.push(retArray[z]);
						}
					}
				}

				this.push(new GrassBlock(i,j,-2));

			}
		}
	}
	updatePortion(){
		for(var i = 0; i < this.portion.length; i++)
			this.portion[i].update();
		for(var i = 0; i < this.portionCeiling.length; i++)
			this.portionCeiling[i].update();
	}
	//I need to make this better... Like it's just searching through the list of blocks
	//So it's an O(n) operation, I could organize the portion as a 3D array, so it would result
	//in an O(1) operation, or at least organize the blocks as I insert them, so searching could
	//be O(log2)... Either way fixing this should be a priority, same for removing blocks and
	//adding blocks.
	getBlockAt(PX,PY,PZ){
		if(PZ >= -4){
			for(var i = 0; i < this.portion.length; i++){
				if(this.portion[i].posX == PX && this.portion[i].posY == PY && this.portion[i].posZ == PZ){
					return this.portion[i];
				}
			}
		}else{
			for(var i = 0; i < this.portionCeiling.length; i++){
				if(this.portionCeiling[i].posX == PX && this.portionCeiling[i].posY == PY && this.portionCeiling[i].posZ == PZ){
					return this.portionCeiling[i];
				}
			}
		}
		return null;
	}
	removeBlock(block){
		if(block == null) return;
		if(block.posZ >= -4){
			if(this.portion.length == 0){
				return;
			}	
			if(this.portion.length == 1){
				if(this.portion[0].posX == block.posX && this.portion[0].posY == block.posY && this.portion[0].posZ == block.posZ){
					this.setSpaceOccupied(block.posX,block.posY,block.posZ, false);
					this.portion[0].destroy();
					this.portion=[];
				}
				return;
			}
			for(var i = 0; i < this.portion.length; i++){
				if(this.portion[i].posX == block.posX && this.portion[i].posY == block.posY && this.portion[i].posZ == block.posZ){
					if(i != this.portion.length-1){
						var temp = this.portion[i];
						this.setSpaceOccupied(block.posX,block.posY,block.posZ, false);
						this.portion[i]=this.portion[this.portion.length-1];
						this.portion.pop();
						temp.destroy();
					}else{
						var temp = this.portion[i];
						this.setSpaceOccupied(block.posX,block.posY,block.posZ, false);
						this.portion.pop();
						temp.destroy();
					}
					if(block.posZ == -2){
						//create a dirt block at -1.
						this.addBlock(new DirtBlock(block.posX,block.posY,-1));
					}
				}

			}
		}else{
			if(this.portionCeiling.length == 0){
				return;
			}	
			if(this.portionCeiling.length == 1){
				if(this.portionCeiling[0].posX == block.posX && this.portionCeiling[0].posY == block.posY && this.portionCeiling[0].posZ == block.posZ){
					this.portionCeiling[0].destroy();
					this.portionCeiling=[];
				}
				return;
			}
			for(var i = 0; i < this.portionCeiling.length; i++){
				if(this.portionCeiling[i].posX == block.posX && this.portionCeiling[i].posY == block.posY && this.portionCeiling[i].posZ == block.posZ){
					//var des=this.portion[i];
					if(i != this.portionCeiling.length-1){
						var temp = this.portionCeiling[i];
						this.portionCeiling[i]=this.portionCeiling[this.portionCeiling.length-1];
						this.portionCeiling.pop();
						temp.destroy();
					}else{
						var temp = this.portionCeiling[i];
						this.portionCeiling.pop();
						temp.destroy();
					}
				}
			}
		}

	}
	refreshWater(pX,pY,pZ,level,parent){
		var occupied = false;
		for(var i = 0; i < this.portion.length; i++){
			if(pX == this.portion[i].posX && pY == this.portion[i].posY && pZ == this.portion[i].posZ){

				//If this is true, a water block already exists here.
				if(this.portion[i].isFluid){
					
					/*
						Now our non-source water is interacting with another water block.
						We don't want to add another water block, but we want to increase the level.
					*/
					this.portion[i].increaseLevel(level);

					/*
					//If we share the same source do nothing.
					if(this.portion[i].source.compareSource(block.source)){
						this.portion[i].increaseLevel(level);
						return false;
					}else{
						this.portion[i].increaseLevel(level);
						return false;
					}
					*/
				}
				// No block here. Must add a new water block.
				else{
					occupied = true;
					break;
				}
			}
		}

		// The space was not occupied with a water block, so we must add one.
		if(!occupied){
			let block = new Water(pX,pY,pZ,level,parent);
			this.push(block);

			/*
				This is where you remove the dirt block.
				This is necessary, because the dirt block has a collision box to prevent the player
				from stepping over an empty hole.
			*/
			if(block.posZ == -2){
				this.removeBlock(this.getBlockAt(block.posX,block.posY,-1));
			}
			return true;
		}
		return false;
	}
	addBlock(block){
		//Add special provision for if it's water!
		//You could make this more efficient by making it a 2D array!
		var occupied = false;

		for(var i = 0; i < this.portion.length; i++){
			if(block.posX == this.portion[i].posX && block.posY == this.portion[i].posY && block.posZ == this.portion[i].posZ){
				if(this.portion[i].isFluid){
					/*
						(1) Remove this block from network its network.
						(2) Reclace this.portion[i] with the new block.
					*/
					let network = this.portion[i].network;
					network.removeWaterBlock(this.portion[i]);
					this.portion[i] = block;
					if(block.posZ == -2){
						this.removeBlock(this.getBlockAt(block.posX,block.posY,-1));
					}
					return true;
				}else{
					occupied = true;
					return true;
				}
			}

				
		}

		for(var i = 0; i < this.portionCeiling.length; i++){
			if(block.posX == this.portionCeiling[i].posX && block.posY == this.portionCeiling[i].posY && block.posZ == this.portionCeiling[i].posZ){
				occupied = true;
				return true;
			}
		}
		if(!occupied){
			this.push(block);
			/*
				This is where you remove the dirt block.
				This is necessary, because the dirt block has a collision box to prevent the player
				from stepping over an empty hole.
			*/
			if(block.posZ == -2){
				this.removeBlock(this.getBlockAt(block.posX,block.posY,-1));
			}
			return true;
		}
		return false;
	}

	addWater(pX, pY, pZ, network, level=1){
		//constructor(X,Y,Z, level=1, startNetwork = true, network = null)
		/*
			If startNetwork = true, it will just make a new network in the constructor.
			Properties: Water.level, Water.network.
		*/
		var occupied = false;
		if(network!=null)
		network.updateCooldown = 20;


		//Can just use the fluid array. No need for all this jazz.


		for(var i = 0; i < this.portion.length; i++){
			if(pX == this.portion[i].posX && pY == this.portion[i].posY && pZ == this.portion[i].posZ)
				if(this.portion[i].isFluid){
					let existingNetwork = this.portion[i].network;

					if(network == null){
						/*
							This would occur if the player is adding water
							from their bucket. If this is the case we just increase the level
							of the existing network: 'existingNetwork'.
						*/
						// INCREASE LEVEL.
						//Should increase based off of the level of the bucket.
						existingNetwork.level += level;
						return null;
					}else if(network.id == existingNetwork.id){
						/*
							Block already exists and is part of the same network.
							Do nothing here.
						*/
						return null;
					}else{
						/*
							Block exists, but as part of a seperate network.
							We should return false. We don't need to add a new
							block to this portion. What we do need to do
							is merge the networks.
						*/
						existingNetwork.mergeNetwork(network);
						return null;
					}
					
					
				} else {
					occupied = true;
				}
		}


		/*
			In this case we just need to add a new water block with
			a new network.

			When the user is placing the block, the network should be
			null, however, when water blocks are 'expanding', they will
			need to be attached to a network.
		*/
		if(!occupied){
			let block;
			onLowLevelChange();
			
			if(network == null){
				block = new Water(pX, pY, pZ, level, true, null);
				this.push(block);
				this.setFluid(pX,pY,block);
			}else{
				block = new Water(pX, pY, pZ, 1, false, network);
				
				this.push(block);
				this.setFluid(pX,pY,block);
			}
			/*
				With water we actually want to keep the dirt block.
			*/
			/*
			if(block.posZ == -2){
				this.removeBlock(this.getBlockAt(block.posX,block.posY,-1));
			}
			*/
			return block;
		}
		return null;
	}

	getPortionArray(){
		return [this.portion,this.portionCeiling];
	}
}

class World{
	constructor(SIZE){
		this.size = SIZE;
		this.portions=[];
		this.makeArray();
	}
	makeArray(){
		for(var i = 0; i <= this.size; i++){
			this.portions[i] = [];
		}
	}

	fillAllEmpty(){
		for(var i = 0; i <= this.size; i++){
			for(var j = 0; j <= this.size; j++)
				this.portions[i][j] = new WorldPortion(i,j,true);
		}
	}

	fillAllDefault(){
		for(var i = 0; i <= this.size; i++){
			for(var j = 0; j <= this.size; j++)
				this.portions[i][j] = new WorldPortion(i,j);
		}
	}
	updatePortions(){
		for(var i = 0; i <= this.size; i++){
			for(var j = 0; j <= this.size; j++)
				this.portions[i][j].updatePortion();
		}
	}
	generateGlobalStructures(){

		if(GEN_SHOP){

			let value = 0;
			let x;
			let y;

			while(value != 3){
				let coordinateToGen = generate_random_world_coordinate();
				x = coordinateToGen[0];
				y = coordinateToGen[1];
				value=get_portion_distance_from_start(x,y)
			}
			//Get portion from x and y.
			var locX = Math.floor(x/PORTION_SIZE);
			var locY = Math.floor(y/PORTION_SIZE);

			console.log('Portion shop generated at:', locX, locY)
			this.portions[locX][locY].canGenerateGlobalStructures = false;



			var retArray = gen_shop(locX*PORTION_SIZE,locY*PORTION_SIZE+2);
			for(var z=0;z<retArray.length;z++)
				this.addBlock(retArray[z]);

			//Start by just generating one block on the portion in the air.
		}

		if(GEN_DUNGEON){
			let value = 0;
			let x;
			let y;

			while(value != 3){
				let coordinateToGen = generate_random_world_coordinate();
				x = coordinateToGen[0];
				y = coordinateToGen[1];
				value=get_portion_distance_from_start(x,y)
			}
			//Get portion from x and y.
			var locX = Math.floor(x/PORTION_SIZE);
			var locY = Math.floor(y/PORTION_SIZE);

			console.log('Portion shop generated at:', locX, locY)
			this.portions[locX][locY].canGenerateGlobalStructures = false;



			var retArray = gen_dungeon_BL(locX*PORTION_SIZE,locY*PORTION_SIZE+2);
			for(var z=0;z<retArray.length;z++)
				this.addBlock(retArray[z]);
		}

		/*
		if(GEN_DUNGEONS && generate_by_probability(0.15)){
			for(var i = this.posX; i < this.outerBoundX; i++){
				for(var j = this.posY; j < this.outerBoundY; j++){
					//Do wood if underneath dungeon.
					if( (j-this.posY) <= 6 && (j-this.posY) > 1 && (i - this.posX) >0 && (i-this.posX) <8  ){
						this.push(new WoodBlock(i,j,-2));
					}else{
						this.push(new GrassBlock(i,j,-2));
					}
				}
			}
			var retArray = gen_dungeon_BL(this.posX,this.posY+2);
			for(var z=0;z<retArray.length;z++)
				this.push(retArray[z]);
			return;
		}
		*/

		/*
			Stone clusters
		*/
		let numClusters = AVG_NUM_STONE_CLUSTERS + (randomInt(STONE_CLUSTERS_VARIANCE+1)-Math.round(STONE_CLUSTERS_VARIANCE/2));



		for(let i = 0; i < numClusters; i++){
			// Define x and y as some random coordinates on the map.
			let coordinateToGen = generate_random_world_coordinate();
			let x = coordinateToGen[0];
			let y = coordinateToGen[1];

			//If the retArray is empty, it probably violated some condition. So just reset i 
			//and regenerate it.
			var retArray = generate_global_stone_cluster(x,y);
			if(retArray.length==0){
				i--;
				continue;
			}

			//If x and y lie in a portion where canGenerateGlobalStructures = false, skip
			let portionNum = this.getPortionNum(x,y);
			if(!this.portions[portionNum[0]][portionNum[1]].canGenerateGlobalStructures){
				i--;
				continue;
			}
			for(var z = 0; z < retArray.length; z++){
				let toAdd = retArray[z];
				let portionNum = this.getPortionNum(toAdd.posX,toAdd.posY);
				//Make sure it's in a portion that can generate global structures.
				if(this.portions[portionNum[0]][portionNum[1]].canGenerateGlobalStructures){
					this.addBlock(toAdd);
				}
			}
		}

		/*
			Trees
		*/
		let numTrees = AVG_NUM_TREES + (randomInt(TREE_VARIANCE+1)-Math.round(TREE_VARIANCE/2));
		
		for(let i = 0; i < numTrees; i++){
			// Define x and y as some random coordinates on the map.
			let coordinateToGen = generate_random_world_coordinate()
			let x = coordinateToGen[0];
			let y = coordinateToGen[1];
			var retArray = gen_tree(x,y);

			if(this.getBlockAt(x,y,-2) != null){
				continue;
			}

			if(is_valid_world_coordinate(x-1,y)){
				if(this.getBlockAt(x-1,y,-3) != null)
					continue;
			}

			if(is_valid_world_coordinate(x+1,y)){
				if(this.getBlockAt(x+1,y,-3) != null)
					continue;
			}

			if(is_valid_world_coordinate(x,y-1)){
				if(this.getBlockAt(x,y-1,-3) != null)
					continue;
			}

			if(is_valid_world_coordinate(x,y+1)){
				if(this.getBlockAt(x,y+1,-3) != null)
					continue;
			}

			for(var z = 0; z < retArray.length; z++){
				let toAdd = retArray[z];
				let portionNum = this.getPortionNum(toAdd.posX,toAdd.posY);
				//Make sure it's in a portion that can generate global structures.
				if(this.portions[portionNum[0]][portionNum[1]].canGenerateGlobalStructures){
					this.addBlock(toAdd);
				}else{
					break;
				}
			}
		}
	}

	generateGrass(){
		for(var i = 0; i <= this.size; i++){
			for(var j = 0; j <= this.size; j++)
				this.portions[i][j].generateGrass(Boolean(i%2));
		}
	}


	addPortion(portion){
		this.portions[portion.posX][portion.posY] = portion;
	}
	getPortionNum(PX,PY){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);
		return [locX,locY]
	}
	getPortion(PLAYERX,PLAYERY){
		var locX = Math.floor(PLAYERX/PORTION_SIZE);
		var locY = Math.floor(PLAYERY/PORTION_SIZE);
		if(this.portions[locX] != undefined && this.portions[locX][locY] != undefined)
			return this.portions[locX][locY]
		else
			return new WorldPortion();

	}
	getBlockAt(PX,PY,PZ){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);
		if(locX<0||locY<0||locX>this.size||locY>this.size)
			return null;
		else{
			return this.portions[locX][locY].getBlockAt(Math.floor(PX),Math.floor(PY),Math.floor(PZ));
		}
	}

	/*
		Returns true if the space is occupied.
		Used for projectile collisions, so it only 
		works for levels -3 and -4.
	*/
	isSpaceOccupied(PX, PY, PZ){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);
		if(locX<0||locY<0||locX>this.size||locY>this.size)
			return false;
		else{

			return this.portions[locX][locY].isSpaceOccupied(PX,PY,PZ);
		}
	}

	getFluid(PX, PY, specNetID=-1){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);
		if(locX<0||locY<0||locX>this.size||locY>this.size)
			return null;
		else{
			return this.portions[locX][locY].getFluid(PX,PY,specNetID);
		}
	}
	
	setFluid(PX, PY, block){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);
		if(locX<0||locY<0||locX>this.size||locY>this.size)
			return false;
		else{
			return this.portions[locX][locY].setFluid(PX,PY,block);
		}
	}


	updateChunk(PX,PY,PZ){
		//Update cube around block
		for(let i = -1; i < 2; i++){
			for(let j = -1; j < 2; j++){
				for(let k = -1; k < 2; k++){
					var block = this.getBlockAt(PX+i, PY+j, PZ+k);
					if(block != null){
						block.update();
					}
				}
			}
		}
		var block = this.getBlockAt(PX, PY, PZ-2);
		if(block != null){
			block.update();
		}
	}

	//Get chunk at level z = -3 for collisions
	getChunk(PX,PY){
		var chunk = [];
		for(let i = -2; i < 3; i++){
			for(let j = -2; j < 3; j++){
				var block = this.getBlockAt(PX+i, PY+j, -3);
				if(block != null){
					chunk.push(block);
				}
				block = this.getBlockAt(PX+i, PY+j, -4);
				if(block != null){
					chunk.push(block);
				}
				/*
                    Also get dirt.
                */
                block = this.getBlockAt(PX+i, PY+j, -1)
                if(block != null){
                    chunk.push(block);
                }
			}
		}
		return chunk;
	}

	removeBlock(block){
		var locX = Math.floor(block.posX/PORTION_SIZE);
		var locY = Math.floor(block.posY/PORTION_SIZE);
		var PX = block.posX;
		var PY = block.posY;
		var PZ = block.posZ;
		if(block.posZ == -2){
			onLowLevelChange();
		}

		if(!this.checkPortionValid(locX,locY))
			return;

		this.portions[locX][locY].removeBlock(block);
		//Update
		this.updateChunk(PX,PY,PZ);
		return;

	}
	removeBlockByPos(PX,PY,PZ){
		var locX = Math.floor(PX/PORTION_SIZE);
		var locY = Math.floor(PY/PORTION_SIZE);

		if(!this.checkPortionValid(locX,locY))
			return;

		let block = this.portions[locX][locY].getBlockAt(PX,PY,PZ);
		if(PZ == -2){
			onLowLevelChange();
		}
		if(block != null){
			this.portions[locX][locY].removeBlock(block);
			this.updateChunk(PX,PY,PZ);
		}
		return;

	}
	addBlock(block){
		var locX = Math.floor(block.posX/PORTION_SIZE);
		var locY = Math.floor(block.posY/PORTION_SIZE);

		// Check!
		if(!this.checkPortionValid(locX,locY))
			return false;
		var ret = this.portions[locX][locY].addBlock(block);
		if(block.posZ == -2)
			onLowLevelChange();
		//Update
		if(ret == false)
			return false;
		var PX = block.posX;
		var PY = block.posY;
		var PZ = block.posZ;
		this.updateChunk(PX,PY,PZ);
		return true;
	}


	/*
		Should take just the coordinates.

		If successful: returns the block that was added.

		Otherwise: Returns null
	*/
	addWater(pX, pY, pZ, network = null, level = 1){
		var locX = Math.floor(pX/PORTION_SIZE);
		var locY = Math.floor(pY/PORTION_SIZE);

		// Check!
		if(!this.checkPortionValid(locX,locY))
			return null;
		var ret = this.portions[locX][locY].addWater(pX,pY,pZ,network,level);
		//Update
		if(ret == null)
			return null;
		if(pZ == -2)
			onLowLevelChange();
		this.updateChunk(pX,pY,pZ);
		return ret;
	}

	refreshWater(pX, pY, pZ, level, parent){
		var locX = Math.floor(pX/PORTION_SIZE);
		var locY = Math.floor(pY/PORTION_SIZE);

		// Check!
		if(!this.checkPortionValid(locX,locY))
			return false;
		var ret = this.portions[locX][locY].refreshWater(pX,pY,pZ,level,parent);
		//Update
		if(ret == false)
			return false;
		if(pZ == -2)
			onLowLevelChange();
		this.updateChunk(pX, pY, pZ);
		return true;
	}

	/*
        Used for drop box. 

        Returns object of the form:

        [isADropBox, Position].

        If there is no dropBox, but there is an available space
        it returns:
            [false, pX,pY,pZ].

        If there is a dropbox at pX,pY,pZ, it returns
            [true, pX,pY,pZ].

        If neither conditions are met the function returns null.
    */  
    getDropBoxSpace(PX,PY){
        //DropBox objectNumber = 9.
        let PZ = -3;

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
            	let temp = this.getBlockAt(PX+(i-1), PY+(j-1), PZ);
                if(temp!=null && temp.objectNumber == 9)
                    return [true,temp];
            }
        }

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(this.getBlockAt(PX+(i-1), PY+(j-1), PZ)==null)
                    return [false,[PX+(i-1), PY+(j-1), PZ]]; 
            }
        }
        

        return null;
    }

    /*
		Should return false if the space is null,
		or a block with no collision box.
    */
    isSpaceSolid(PX, PY, PZ){
    	var block = this.getBlockAt(PX,PY,PZ);
    	if(block == null) return false;
    	let objNum = block.objectNumber;
    	if(objNum == 9 || objNum == 13) return false;
    	return true;
    }

    checkPortionValid(locX, locY){
    	if(locX >= 0 && locX <= this.size && locY >= 0 && locY <= this.size)
    		return true;
    	return false;
    }

}


function concate_portions(arrayOfPortions){
	var retArray = [];
	for(var i = 0; i < arrayOfPortions.length; i++){
		retArray.concat(arrayOfPortions[i])
	}
	return retArray;
}

function generate_by_probability(prob){
	var randomValue = Math.random();
	if(randomValue <= prob)
		return true;
	return false;
}

function is_within_portion_bound(portion){
	def_position();
	if(POSX <= portion.outerBoundX && POSX >= portion.posX)
		if(POSY <= portion.outerBoundY && POSY >= portion.posY)
			return true;
}

function make_world(){
	//world = new World(50);
	world = new World(WORLD_SIZE);
	world.fillAllDefault();
	if(!GEN_OLD_STYLE_WORLD){
		world.generateGlobalStructures();
		world.generateGrass();
	}
}

function init_world(){
	world.updatePortions();
	pX = Math.floor(POSX/PORTION_SIZE);
	pY = Math.floor(POSY/PORTION_SIZE);
	currentPortion = vec2(pX,pY);
}


function def_position(){
	POSX = Math.floor(player.posX);
	POSY = Math.floor(player.posY);

}

var pX;
var pY;
//Cool idea but I think this function is redundant, so I'm just making it return true for now
function check_reload(){
	return true;
	def_position();
	pX = Math.floor(POSX/PORTION_SIZE);
	pY = Math.floor(POSY/PORTION_SIZE);
	newPortion = vec2(pX,pY);
	if(currentPortion[0] == newPortion[0] && currentPortion[1] == newPortion[1])
		return false;
	else{
		currentPortion = newPortion;
		return true;
	}
}

function reload_portion(){

}


function return_draw_blocks(){
	def_position();
	var ret1, ret2, portion;

	portion = world.getPortion(POSX,POSY).getPortionArray();
	ret1 = portion[0];
	ret2 = portion[1];

	portion = world.getPortion(POSX-PORTION_SIZE,POSY).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX+PORTION_SIZE,POSY).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX,POSY+PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX,POSY-PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX+PORTION_SIZE,POSY+PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX+PORTION_SIZE,POSY-PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX-PORTION_SIZE,POSY+PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX-PORTION_SIZE,POSY-PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	//Newly added

	portion = world.getPortion(POSX+2*PORTION_SIZE,POSY+PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX+2*PORTION_SIZE,POSY).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX-2*PORTION_SIZE,POSY+PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX-2*PORTION_SIZE,POSY).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX+2*PORTION_SIZE,POSY-PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);

	portion = world.getPortion(POSX-2*PORTION_SIZE,POSY-PORTION_SIZE).getPortionArray();
	ret1 = ret1.concat(portion[0]);
	ret2 = ret2.concat(portion[1]);
		
	return [ret1, ret2];
}



function gen(){
	size=50;
	for(var i = -size; i <= size; i++){
		for(var j = -size; j <= size; j++){
			blocks.push(new WoodBlock(i,j,-2,false));
		}
	}
	for(var i = 0; i < 200; i++){
		//gen_tree(Math.floor(Math.random()*50),Math.floor(Math.random()*50));
	}
}

function removeBlockGlobal(Block){
	if(inDungeon){
		var PX = Block.posX;
		var PY = Block.posY;
		var PZ = Block.posZ;
		currentDungeon.removeBlockByPos(PX,PY,PZ);
	}else{
		world.removeBlock(Block);
	}
}

let lowLevelChange = false;
function onLowLevelChange(){
	lowLevelChange = true;
	//console.log('Low level change.')
}