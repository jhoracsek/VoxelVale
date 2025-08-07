

function compare_candidate(c1, c2){
	if(c1.posX == c2.posX && c1.posY == c2.posY && c1.posZ == c2.posZ)
		return true;
	return false;
}


/*
	If c_i is unique in array returns true
	in ret[i].
*/
function unique_candidates_in_array(c1, c2, c3, c4, arr){
	let ret = [false,false,false,false];
	for(let j = 0; j < arr.length; j++){
		if(compare_candidate(c1,arr[j]))
			ret[0] = true;
		if(compare_candidate(c2,arr[j]))
			ret[1] = true;
		if(compare_candidate(c3,arr[j]))
			ret[2] = true;
		if(compare_candidate(c4,arr[j]))
			ret[3] = true;
	}
	return ret;
}



let newWaterNetworkID = 0;
class WaterNetwork {

	constructor(water, level=1){

		this.network = [water];
		this.networkSize = 1;
		this.level = level;
		
		let pX = water.posX;
		let pY = water.posY;
		let pZ = water.posZ;

		//Left, right, top, bottom
		this.edgeCandidates = [];
		this.blocksToExpand = [water];

		this.isAlive = true;

		this.requiresUpdate = true;

		//Simple hacky method for comparing networks.
		this.id = newWaterNetworkID;
		newWaterNetworkID++;

		this.updateCooldown = 20;
	}

	/*
		Sets this.edgeCandidates without duplicates.
		Can probably optimize this with the fluid world array.
	*/
	setCandidates(){
		this.edgeCandidates = [];
		
		for(let i = 0; i < this.network.length; i++){
			//if(!this.network[i].isEdge) continue;

			this.network[i].isEdge = false;
			
			let pX = this.network[i].posX;
			let pY = this.network[i].posY;
			let pZ = this.network[i].posZ;

			let c1 = {posX: pX-1, posY: pY, posZ: pZ};
			let c2 = {posX: pX+1, posY: pY, posZ: pZ};
			let c3 = {posX: pX, posY: pY+1, posZ: pZ};
			let c4 = {posX: pX, posY: pY-1, posZ: pZ};

			let toAdd = unique_candidates_in_array(c1,c2,c3,c4,this.edgeCandidates);

			if(!toAdd[0]) this.edgeCandidates.push(c1);
			if(!toAdd[1]) this.edgeCandidates.push(c2);
			if(!toAdd[2]) this.edgeCandidates.push(c3);
			if(!toAdd[3]) this.edgeCandidates.push(c4);


			//if(!toAdd[0] && (world.getFluid(pX-1,pY)==null || world.getFluid(pX-1,pY).network.id != this.id)) this.edgeCandidates.push(c1);
			//if(!toAdd[1] && (world.getFluid(pX+1,pY)==null || world.getFluid(pX+1,pY).network.id != this.id)) this.edgeCandidates.push(c2);
			//if(!toAdd[2] && (world.getFluid(pX,pY+1)==null || world.getFluid(pX,pY+1).network.id != this.id)) this.edgeCandidates.push(c3);
			//if(!toAdd[3] && (world.getFluid(pX,pY-1)==null || world.getFluid(pX,pY-1).network.id != this.id)) this.edgeCandidates.push(c4);
		}
	}



	update(){

		if(lowLevelChange){
			this.updateCooldown = 20;
		}

		//if(this.updateCooldown <= 0){
		//	return;
		//}

		if(this.updateCooldown > 0)
			this.updateCooldown--;
		//console.log('Im updating!')
		//Sets the level for each water block in the network
		for(let i = 0; i < this.network.length; i++){
			this.network[i].setLevel(this.level/this.network.length);
		}
		
		let keepUpdating = false;
		if(this.level/this.network.length >= 0.1){
			this.setCandidates();
			keepUpdating = false
			for(let i = 0; i < this.edgeCandidates.length; i++){
				let can = this.edgeCandidates[i];
				let pX = can.posX;
				let pY = can.posY;
				let pZ = can.posZ;

				let waterToAdd = world.addWater(pX,pY,pZ,this);
				
				if(waterToAdd != null){
					if(!this.replaceDuplicate(waterToAdd)){
						this.network.push(waterToAdd);
						this.networkSize++;
					}
					keepUpdating = true;
				}
			}
		}
		/*
			ENSURE LEVEL IS NOT TOO HIGH!!!
		*/

		if(this.level/this.network.length > 1){
			this.level = this.network.length;
		}

		//this.requiresUpdate = keepUpdating;
		//Sets the level for each water block in the network
		for(let i = 0; i < this.network.length; i++){
			this.network[i].setLevel(this.level/this.network.length);
		}
	}

	/*
		Should check at some point if the network
		is empty at which point it should be set to dead.

		Should have something to do with slurping (scooping might be
		a more accurate word) water with bucket.
	*/
	tryToKillNetwork(){
		if(this.network.length == 0){
			this.isAlive = false;
			return true
		}
		return false;
	}

	removeWaterBlock(water){

		let pX = water.posX;
		let pY = water.posY;

		/*
			Removes the block and checks the adjacent blocks
			in case network must be split.
		*/
		let numAdj = 0;
		let indexToRemove = -1;
		for(let i = 0; i < this.network.length; i++){
			if(this.network[i].posX == pX+1 && this.network[i].posY == pY){
				numAdj++;
				this.network[i].isEdge = true;
			}
			if(this.network[i].posX == pX-1 && this.network[i].posY == pY){
				numAdj++;
				this.network[i].isEdge = true;
			}
			if(this.network[i].posX == pX && this.network[i].posY == pY+1){
				numAdj++;
				this.network[i].isEdge = true;
			}
			if(this.network[i].posX == pX && this.network[i].posY == pY-1){
				numAdj++;
				this.network[i].isEdge = true;
			}

			if(this.network[i].posX == pX && this.network[i].posY == pY){
				indexToRemove = i;
				this.network[i].isEdge = true;
			}
		}
		if(indexToRemove == -1) return;

		this.network[indexToRemove] = this.network[this.network.length-1];
		world.setFluid(pX,pY);
		this.network.pop();
		if(this.tryToKillNetwork()) return;

		/*
			At least one block in network.

			Just one block in the network.
			No need to rebuild.
		*/
		if(numAdj == 1){
			return;
		}

		/*
			Try to split the networks.
		*/
		this.tryToSplitNetwork();
	}

	/*
		Cannot scoop more than what bucket is capable of
		holding at the moment.

		Need the current bucket!

		Cannot scoop more than what exists at the given block.

	*/
	onScoop(water, maxAmount, bucket){
		
		//Make sure you're scooping from the correct network.
		if(water.network.id!=this.id){
			return; //Something terrible happened probably.
		}



		/*
			The bucket tries to pick up 'maxAmount'.

			Two situations:
				(1) We reduce the level of the entire network.
				(2) We pick up only what is in the one spot.

			Situation (1) occurs only if we can reduce the level,
			without crossing the minimum depth threshold.

			If reducing the level causes us to cross the minimum depth threshold,
			we should just remove the water from that space and put
			the amount obtained from that space in the bucket.
		*/
		

		if((this.level-maxAmount)/this.network.length >= 0.1){
		//if(false){
			//Situation (1)
			this.level = this.level-maxAmount;
			bucket.unitsOfWater += maxAmount;

		}else{
			//Situation (2)
			let toRemove = this.level/this.network.length

			this.level -= toRemove;
			world.removeBlock(water);
			this.removeWaterBlock(water);
			bucket.unitsOfWater += toRemove;
			//this.update();
		}
	}

	tryToSplitNetwork(){

		let TOTAL_SIZE = this.network.length;
		/*
			Set all nodes in network to not-visited.
		*/	
		for(let i = 0; i < this.network.length; i++){
			this.network[i].visited = false;
			this.network[i].isEdge = true;
		}

		/*
			Can potentially split into four separate networks.
		*/
		let network1Array = [];
		let network2Array = [];
		let network3Array = [];
		let network4Array = [];



		/*
			Build first network.
			Starting at this.network[0];
		*/
		let waterQueue = [this.network[0]];
		let newNetwork1 = new WaterNetwork(this.network[0], this.level)
		this.network[0].network = newNetwork1;

		while(waterQueue.length > 0){
			let cur = waterQueue.pop();

			if(cur.visited)
				continue;

			network1Array.push(cur);
			cur.network = newNetwork1;
			cur.visited = true;
			/*
				Add four adj.
			*/
			console.log(this.id)
			// I think you also need to make sure it's part of the right network!
			let leftWater = world.getFluid(cur.posX-1,cur.posY,this.id);
			let rightWater = world.getFluid(cur.posX+1,cur.posY,this.id);
			let aboveWater = world.getFluid(cur.posX,cur.posY+1,this.id);
			let belowWater = world.getFluid(cur.posX,cur.posY-1,this.id);

			if(leftWater != null)
				waterQueue.push(leftWater);

			if(rightWater != null)
				waterQueue.push(rightWater);

			if(aboveWater != null)
				waterQueue.push(aboveWater);

			if(belowWater != null)
				waterQueue.push(belowWater);
		}
		newNetwork1.network = network1Array;
		waterNetworkArray.push(newNetwork1);

		/*
			network1Array now represents our first network.
		*/
		if(network1Array.length == this.network.length){
			/*
				Here I should probably just use the original network, but
				whatever.
			*/
			this.isAlive = false;
			return;
		}




		/*
			Build second network
		*/
		let startIndex = 1;
		for(startIndex = 1; startIndex < this.network.length; startIndex++ ){
			if(!this.network[startIndex].visited)
				break;
		}
		waterQueue = [this.network[startIndex]];

		let newNetwork2 = new WaterNetwork(this.network[startIndex], this.level)
		this.network[startIndex].network = newNetwork2;

		while(waterQueue.length > 0){
			let cur = waterQueue.pop();

			if(cur.visited)
				continue;

			network2Array.push(cur);
			cur.network = newNetwork2;
			cur.visited = true;
			/*
				Add four adj.
			*/
			let leftWater = world.getFluid(cur.posX-1,cur.posY,this.id);
			let rightWater = world.getFluid(cur.posX+1,cur.posY,this.id);
			let aboveWater = world.getFluid(cur.posX,cur.posY+1,this.id);
			let belowWater = world.getFluid(cur.posX,cur.posY-1,this.id);

			if(leftWater != null)
				waterQueue.push(leftWater);

			if(rightWater != null)
				waterQueue.push(rightWater);

			if(aboveWater != null)
				waterQueue.push(aboveWater);

			if(belowWater != null)
				waterQueue.push(belowWater);
		}
		newNetwork2.network = network2Array;
		waterNetworkArray.push(newNetwork2);

		if(network1Array.length + network2Array.length == this.network.length){
			newNetwork1.level = (network1Array.length/TOTAL_SIZE)*this.level;
			newNetwork2.level = (network2Array.length/TOTAL_SIZE)*this.level;

			this.isAlive = false;
			return;
		}



		/*
			Build third network
		*/
		startIndex = 1;
		for(startIndex = 1; startIndex < this.network.length; startIndex++ ){
			if(!this.network[startIndex].visited)
				break;
		}
		waterQueue = [this.network[startIndex]];

		let newNetwork3 = new WaterNetwork(this.network[startIndex], this.level)
		this.network[startIndex].network = newNetwork3;

		while(waterQueue.length > 0){
			let cur = waterQueue.pop();

			if(cur.visited)
				continue;

			network3Array.push(cur);
			cur.network = newNetwork3;
			cur.visited = true;
			/*
				Add four adj.
			*/
			let leftWater = world.getFluid(cur.posX-1,cur.posY,this.id);
			let rightWater = world.getFluid(cur.posX+1,cur.posY,this.id);
			let aboveWater = world.getFluid(cur.posX,cur.posY+1,this.id);
			let belowWater = world.getFluid(cur.posX,cur.posY-1,this.id);

			if(leftWater != null)
				waterQueue.push(leftWater);

			if(rightWater != null)
				waterQueue.push(rightWater);

			if(aboveWater != null)
				waterQueue.push(aboveWater);

			if(belowWater != null)
				waterQueue.push(belowWater);
		}

		newNetwork3.network = network3Array;
		waterNetworkArray.push(newNetwork3);

		if(network1Array.length + network2Array.length + network3Array.length == this.network.length){
			newNetwork1.level = (network1Array.length/TOTAL_SIZE)*this.level;
			newNetwork2.level = (network2Array.length/TOTAL_SIZE)*this.level;
			newNetwork3.level = (network3Array.length/TOTAL_SIZE)*this.level;
			this.isAlive = false;
			return;
		}


		/*
			Build fourth network.
		*/
		startIndex = 1;
		for(startIndex = 1; startIndex < this.network.length; startIndex++ ){
			if(!this.network[startIndex].visited)
				break;
		}
		waterQueue = [this.network[startIndex]];

		let newNetwork4 = new WaterNetwork(this.network[startIndex], this.level)
		this.network[startIndex].network = newNetwork4;

		while(waterQueue.length > 0){
			let cur = waterQueue.pop();

			if(cur.visited)
				continue;

			network4Array.push(cur);
			cur.network = newNetwork4;
			cur.visited = true;
			/*
				Add four adj.
			*/
			let leftWater = world.getFluid(cur.posX-1,cur.posY,this.id);
			let rightWater = world.getFluid(cur.posX+1,cur.posY,this.id);
			let aboveWater = world.getFluid(cur.posX,cur.posY+1,this.id);
			let belowWater = world.getFluid(cur.posX,cur.posY-1,this.id);

			if(leftWater != null)
				waterQueue.push(leftWater);

			if(rightWater != null)
				waterQueue.push(rightWater);

			if(aboveWater != null)
				waterQueue.push(aboveWater);

			if(belowWater != null)
				waterQueue.push(belowWater);
		}

		newNetwork4.network = network4Array;
		waterNetworkArray.push(newNetwork4);

		// This should be true at this point.
		if(network1Array.length + network2Array.length + network3Array.length + network4Array.length == this.network.length){
			newNetwork1.level = (network1Array.length/TOTAL_SIZE)*this.level;
			newNetwork2.level = (network2Array.length/TOTAL_SIZE)*this.level;
			newNetwork3.level = (network3Array.length/TOTAL_SIZE)*this.level;
			newNetwork4.level = (network4Array.length/TOTAL_SIZE)*this.level;
			this.isAlive = false;
			return;
		}

		//If the above isn't the case, something went terribly wrong (-_-)
		return;
	}

	replaceDuplicate(water){
		for(let i = 0; i < this.network.length; i++){
			if(this.network[i].posX == water.posX && this.network[i].posY == water.posY ){
				//Network now holds the updated water block... Not the old one
				this.network[i] = water;
				return true;
			}
		}
		return false;
	}


	mergeNetwork(other){
		//Set all the other blocks to refrence this network.
		//Add them all to this network array.
		//ALSO NEED TO remove it from the network array. (do last...)
		this.updateCooldown = 20;
		this.level += other.level;
		for(let i = 0; i < this.network.length; i++){
			this.network[i].isEdge = true;
		}
		for(let i = 0; i < other.network.length; i++){
			let blockToAdd = other.network[i];
			blockToAdd.isEdge = true;
			blockToAdd.network = this;
			this.network.push(blockToAdd);
			this.networkSize++;
		}
		other.kill();

	}

	kill(){
		this.network = [];
		this.networkSize = 0;
		this.level = 0;
		this.edgeCandidates = [];
		this.blocksToExpand = [];
		this.isAlive = false;
	}



}


class Water extends BlockWallNew{
	static name = 'Water';
	static objectNumber=19;
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
		build_colored_cuboid(vec4(0.3,0.5,1,0.5));
		this.sourceNumber = vertices.length - this.sourceStart;


		this.flowStart = vertices.length;
		build_block(39,0.0,0.0);
		this.flowNumber = vertices.length - this.flowStart;

	}

	constructor(X=null,Y=null,Z=null,level=1, startNetwork = true, network = null){
		super(X,Y,Z,false);
		
		this.visited = false;
		this.isEdge = true;

		this.isAlive = true;
		this.level = level;
		this.network = network;
		//What if we need to add it to an existing network?
		if(X!=null && startNetwork){
			
			let net = new WaterNetwork(this,level);
			waterNetworkArray.push(net);
			this.network = net;
		}
	}

	setLevel(level){
		this.level = level;
	}


	destroy(){
		//super.destroy();
		this.isAlive = false;
	}

	draw(){
		//let scaleMat = mult(translate(0,0,1),mult(scale4(1,1,this.level+0.025),translate(0,0,-1)));
		let scaleMat = mult(translate(0,0,1),mult(scale4(1,1,Math.max(this.level,0.1)),translate(0,0,-1)));
		set_mv(mult(this.instanceMat,scaleMat));
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}

		//Front
		if(world.getFluid(this.posX, this.posY-1) == null)
			gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+12,6);
		
		//Left
		if(world.getFluid(this.posX-1, this.posY) == null)
			gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+30,6);
		//Right
		if(world.getFluid(this.posX+1, this.posY) == null)
			gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+6,6);
		
		//Back
		if(world.getFluid(this.posX, this.posY+1) == null)
			gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+18,6);
			
	}

	drawTopFace(){
		//let scaleMat = mult(translate(0,0,1),mult(scale4(1,1,this.level+0.025),translate(0,0,-1)));
		let scaleMat = mult(translate(0,0,1),mult(scale4(1,1,Math.max(this.level,0.1)),translate(0,0,-1)));
		set_mv(mult(this.instanceMat,scaleMat));
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}

		gl.drawArrays(gl.TRIANGLES,this.constructor.sourceStart+24,6);

	}

	onClick(){
		/*
		Testing stuff.
		//If player has a bucket then do something.
		console.log('\nNetwork ID:', this.network.id, 'Network level:', this.network.level, 'Network size:', this.network.network.length,
			'\nLevel over network size:', this.network.level/this.network.network.length,'\n');
		//console.log('This:', world.getFluid(this.posX,this.posY))
		//console.log('Below:', world.getFluid(this.posX,this.posY-1))
		*/

		if(player.heldObject!=null && player.heldObject.typeOfObj == 'ITEM' && player.heldObject.type == 'TOOL' && player.heldObject.toolType=='BUCKET' && upOne == -2){
			let xCoor = (coorSys[0]+player.posX)-9;
    		let yCoor = (coorSys[1]+player.posY)-4.5;
			let pX = Math.round(xCoor);
			let pY = Math.round(yCoor);
			let water = world.getFluid(pX,pY);

			let amountToPick = Math.min(1, player.heldObject.capacity-player.heldObject.unitsOfWater);

			water.network.onScoop(water, amountToPick, player.heldObject);
		}else{
			console.log('Network size:', this.network.network.length, '\nMy level:', this.level);
		}
	}

	onHover(){
		//If player is holding a bucket.
	}
}




















