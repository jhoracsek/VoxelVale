



/*
	Should be a function of the world size. I.e.,
	calculate it so that the per-portion average is
	the same regardless of how large the world is.
*/
//const AVG_NUM_TREES = 600;

const AVG_NUM_TREES = 1100;
const TREE_VARIANCE = 50;


const AVG_NUM_STONE_CLUSTERS = 290;
const STONE_CLUSTERS_VARIANCE = 10;

const STONE_CLUSTER_MAX_WIDTH = 10;
const STONE_CLUSTER_MAX_HEIGHT = 10;

const STONE_CLUSTER_MIN_SIZE = 5;
const STONE_CLUSTER_MAX_SIZE = 9;

/*
	Ore generation probabilities.
*/

const COPPER_ORE = 0.25;
const LUNITE_ORE = 0.2;
const DAYTUM_ORE = 0.15;
const NO_ORE = 1-(COPPER_ORE+LUNITE_ORE+DAYTUM_ORE);


const GENERATE_TREES = true;
const GENERATE_STONE_CLUSTERS = true;
const GENERATE_WATER_POOLS = false;


/*
	Between 0 and max-1.
*/
function randomInt(max) {
	return Math.floor(Math.random() * max);
}


const X_POS_UPPER_BOUND = WORLD_SIZE*10+8;
const Y_POS_UPPER_BOUND = WORLD_SIZE*10+8;
function generate_random_world_coordinate(){
	//between the ranges: (1,1) to (X_POS_UPPER_BOUND, Y_POS_UPPER_BOUND).
	return [randomInt(X_POS_UPPER_BOUND)+1, randomInt(Y_POS_UPPER_BOUND)+1];
}

function is_valid_world_coordinate(X,Y){
	if(X > 0 && X <= X_POS_UPPER_BOUND)
		if(Y > 0 && Y <= Y_POS_UPPER_BOUND)
			return true;
	return false;

}

/*
	'bias' represents the probability that we should return
	true. So if bias = 0.75, then w/ probablity 0.75
	the function will return true.
*/
function flip_biased_coin(bias = 0.5){
	if(bias == 0.5)
		return Boolean(Math.round(Math.random()));
	
	let randy = Math.random()
	if(randy < bias)
		return true;
	else
		return false;
}

function roll_n_sided_die(n){
	return Math.floor(Math.random()*n)
}

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function compare_candidate(c1, c2){
	if(c1.posX == c2.posX && c1.posY == c2.posY && c1.posZ == c2.posZ)
		return true;
	return false;
}

function is_duplicate(c1, arrayToCheck){
	if(arrayToCheck.length == 0)
		return false;
	for(let i = 0; i < arrayToCheck; i++){
		let c2 = arrayToCheck[i];
		if(c1.posX == c2.posX && c1.posY == c2.posY && c1.posZ == c2.posZ)
			return true;
	}
	return false;
}


/*
	Think about the average size of a cluster.

	From the starting position start to generate.
*/
function generate_global_stone_cluster_unoptimized(X,Y){
	var blocksToReturn = [];

	//blocksToReturn.push(new StoneBlock(X,Y,-3))
	// Can calculate bias based off avg_stone_cluster_size.
	// Have a hard limit on size. (i.e. a min and a max).

	let bias = 0.6;

	var gen_queue = [new StoneBlock(X,Y,-3)];


	let hard_limit = STONE_CLUSTER_MAX_SIZE;

	let smallestPX = X;
	let smallestPY = Y;

	while(gen_queue.length > 0 && blocksToReturn.length < hard_limit){
		let curStone = gen_queue.pop();


		//Get x and y position relative to the starting position.


		if(!is_duplicate(curStone, blocksToReturn)){
			blocksToReturn.push(curStone);

			let pX = curStone.posX;
			let pY = curStone.posY;

			if(pX < smallestPX) smallestPX = pX;
			if(pY < smallestPY) smallestPY = pY;

			let sub_queue = [];

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX+1,pY))
				sub_queue.push(new StoneBlock(pX+1, pY,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX-1,pY))
				sub_queue.push(new StoneBlock(pX-1, pY,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX,pY+1))
				sub_queue.push(new StoneBlock(pX, pY+1,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX,pY-1))
				sub_queue.push(new StoneBlock(pX, pY-1,-3));

			//Should randomize order they are pushed to gen_queue.
			if(sub_queue.length > 0)
				shuffleArray(sub_queue);
			for(let i = 0; i < sub_queue.length; i++)
				gen_queue.push(sub_queue[i]);
		}

	}
	if(blocksToReturn.length < STONE_CLUSTER_MIN_SIZE || blocksToReturn.length > STONE_CLUSTER_MAX_SIZE)
		return [];

	/*
		Add into a 2D array for removing holes.
	*/
	let structureMap = [];
	for(let i = 0; i < STONE_CLUSTER_MAX_SIZE; i++){
		let temp = []
		for(let j = 0; j < STONE_CLUSTER_MAX_SIZE; j++){
			temp.push(false)
		}
		structureMap.push(temp);
	}
	for(let i = 0; i < blocksToReturn.length; i++){
		let pX = blocksToReturn[i].posX;
		let pY = blocksToReturn[i].posY;

		pX = pX - smallestPX;
		pY = pY - smallestPY;

		structureMap[pX][pY] = true;
	}

	/*
		Check and fill in holes.
	*/

	let startPosition = [-1,-1];
	for(let i = 0; i < 2; i++){
		for(let j = 0; j < 2; j++){
			if(!structureMap[i*(STONE_CLUSTER_MAX_SIZE-1)][j*(STONE_CLUSTER_MAX_SIZE-1)]){
				startPosition[0] = i*(STONE_CLUSTER_MAX_SIZE-1);
				startPosition[1] = j*(STONE_CLUSTER_MAX_SIZE-1);

				let non_holes = [startPosition];

				while(non_holes.length > 0){
					let curPosition = non_holes.pop();
					let xPos = curPosition[0];
					let yPos = curPosition[1];
					structureMap[xPos][yPos] = true;

					if(xPos + 1 < STONE_CLUSTER_MAX_SIZE && !structureMap[xPos+1][yPos])
						non_holes.push([xPos+1, yPos]);

					if(xPos - 1 >= 0 && !structureMap[xPos-1][yPos])
						non_holes.push([xPos-1, yPos]);

					if(yPos + 1 < STONE_CLUSTER_MAX_SIZE && !structureMap[xPos][yPos+1])
						non_holes.push([xPos, yPos+1]);

					if(yPos - 1 >= 0 && !structureMap[xPos][yPos-1])
						non_holes.push([xPos, yPos-1]);
				}
			}
		}
	}
	for(let i = 0; i < STONE_CLUSTER_MAX_SIZE; i++){
		for(let j = 0; j < STONE_CLUSTER_MAX_SIZE; j++){
			if(!structureMap[i][j])
				blocksToReturn.push(new StoneBlock(i+smallestPX,j+smallestPY,-3));
		}
	}



	/*
		Add border.
	*/
	let borderBlocks = [];
	for(let i = 0; i < blocksToReturn.length; i++){
		let pX = blocksToReturn[i].posX;
		let pY = blocksToReturn[i].posY;

		let candidates = [];

		if(is_valid_world_coordinate(pX-1,pY))
			candidates.push({posX: pX-1, posY: pY, posZ:-3});
		
		if(is_valid_world_coordinate(pX+1,pY))
			candidates.push({posX: pX+1, posY: pY, posZ:-3});
		
		if(is_valid_world_coordinate(pX,pY+1))
			candidates.push({posX: pX, posY: pY+1, posZ:-3});

		if(is_valid_world_coordinate(pX,pY-1))
			candidates.push({posX: pX, posY: pY-1, posZ:-3});

		for(let j = 0; j < candidates.length; j++){
			//if(!is_duplicate(candidates[j], blocksToReturn)){
				borderBlocks.push(new StoneBlock(candidates[j].posX, candidates[j].posY, -3));
			//}
		}
	}
	for(let i = 0; i < borderBlocks.length; i++){
		blocksToReturn.push(borderBlocks[i]);
	}

	/*
		Generate lower level.
	*/
	let lowerBlocks = [];
	for(let i = 0; i < blocksToReturn.length; i++){
		let pX = blocksToReturn[i].posX;
		let pY = blocksToReturn[i].posY;
		lowerBlocks.push(new StoneBlock(pX, pY, -2));
	}

	let borderBlocksLower = [];
	for(let i = 0; i < lowerBlocks.length; i++){
		let pX = lowerBlocks[i].posX;
		let pY = lowerBlocks[i].posY;

		let candidates = [];

		if(is_valid_world_coordinate(pX-1,pY))
			candidates.push({posX: pX-1, posY: pY, posZ:-2});
		
		if(is_valid_world_coordinate(pX+1,pY))
			candidates.push({posX: pX+1, posY: pY, posZ:-2});
		
		if(is_valid_world_coordinate(pX,pY+1))
			candidates.push({posX: pX, posY: pY+1, posZ:-2});

		if(is_valid_world_coordinate(pX,pY-1))
			candidates.push({posX: pX, posY: pY-1, posZ:-2});

		for(let j = 0; j < candidates.length; j++){
			//if(!is_duplicate(candidates[j], lowerBlocks)){
				if(flip_biased_coin(0.7))
					borderBlocksLower.push(new StoneBlock(candidates[j].posX, candidates[j].posY, -2));
			//}
		}
	}

	for(let i = 0; i < borderBlocksLower.length; i++){
		lowerBlocks.push(borderBlocksLower[i]);
	}

	for(let i = 0; i < lowerBlocks.length; i++){
		blocksToReturn.push(lowerBlocks[i]);
	}

	
	borderBlocksLower = [];
	for(let i = 0; i < lowerBlocks.length; i++){
		let pX = lowerBlocks[i].posX;
		let pY = lowerBlocks[i].posY;

		let candidates = [];

		if(is_valid_world_coordinate(pX-1,pY))
			candidates.push({posX: pX-1, posY: pY, posZ:-2});
		
		if(is_valid_world_coordinate(pX+1,pY))
			candidates.push({posX: pX+1, posY: pY, posZ:-2});
		
		if(is_valid_world_coordinate(pX,pY+1))
			candidates.push({posX: pX, posY: pY+1, posZ:-2});

		if(is_valid_world_coordinate(pX,pY-1))
			candidates.push({posX: pX, posY: pY-1, posZ:-2});

		for(let j = 0; j < candidates.length; j++){
			//if(!is_duplicate(candidates[j], lowerBlocks)){
				if(flip_biased_coin(0.09))
					borderBlocksLower.push(new StoneBlock(candidates[j].posX, candidates[j].posY, -2));
			//}
		}
	}

	for(let i = 0; i < borderBlocksLower.length; i++){
		blocksToReturn.push(borderBlocksLower[i]);
	}


	/*
		Ore vein generation. Should first
			(1) Pick a random starting block in retArray (with some probability).
			(2) Decide length of vein (based on type of ore).
			(3) Randomly walk in each direction, i.e., pick a direction
				Up, down, left, or right, based on a four sided dice flip. (Make a method for this :) )
	*/


	/*
		Check max and min size. 
	*/
	//STONE_CLUSTER_MIN_SIZE
	//STONE_CLUSTER_MAX_SIZE
	

	return blocksToReturn;
}


/*
	Should return either 0,1,2,3,4.

	Assumes WORLD_SIZE is 44.
*/
function get_portion_distance_from_start(X,Y){
	var locX = Math.floor(X/PORTION_SIZE);
	var locY = Math.floor(Y/PORTION_SIZE);

	//locX and locY range from 0 to 44 inclusive.
	let x = -1;
	let y = -1;

	if(locX <= 4 || locX >= 40)
		x = 4;
	else if(locX <=9 || locX >= 35)
		x = 3;
	else if(locX <= 14 || locX >= 30)
		x = 2;
	else if(locX <= 19 || locX >= 25)
		x = 1;
	else
		x = 0;

	if(locY <= 4 || locY >= 40)
		y = 4;
	else if(locY <=9 || locY >= 35)
		y = 3;
	else if(locY <= 14 || locY >= 30)
		y = 2;
	else if(locY <= 19 || locY >= 25)
		y = 1;
	else
		y = 0;

	return Math.max(x, y);
}


function generate_global_stone_cluster(X,Y){
	var blocksToReturn = [];

	// Can calculate bias based off avg_stone_cluster_size.
	let bias = 0.6;

	var gen_queue = [new StoneBlock(X,Y,-3)];


	let hard_limit = STONE_CLUSTER_MAX_SIZE;

	let smallestPX = X;
	let smallestPY = Y;


	/*
		Add into a 2D array for borders.
	*/
	let structureMap = [];
	let structureMapSize = STONE_CLUSTER_MAX_SIZE+4;
	for(let i = 0; i < structureMapSize; i++){
		let temp = []
		for(let j = 0; j < structureMapSize; j++){
			temp.push(false)
		}
		structureMap.push(temp);
	}

	let bottomBlocks = [];

	while(gen_queue.length > 0 && blocksToReturn.length < hard_limit){
		let curStone = gen_queue.pop();

		if(!is_duplicate(curStone, blocksToReturn)){
			blocksToReturn.push(curStone);
			let blockBelow = new StoneBlock(curStone.posX, curStone.posY, -2);
			bottomBlocks.push(blockBelow);
			let pX = curStone.posX;
			let pY = curStone.posY;

			if(pX < smallestPX) smallestPX = pX;
			if(pY < smallestPY) smallestPY = pY;

			let sub_queue = [];

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX+1,pY))
				sub_queue.push(new StoneBlock(pX+1, pY,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX-1,pY))
				sub_queue.push(new StoneBlock(pX-1, pY,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX,pY+1))
				sub_queue.push(new StoneBlock(pX, pY+1,-3));

			if(flip_biased_coin(bias) && is_valid_world_coordinate(pX,pY-1))
				sub_queue.push(new StoneBlock(pX, pY-1,-3));

			//Should randomize order they are pushed to gen_queue.
			if(sub_queue.length > 0)
				shuffleArray(sub_queue);
			for(let i = 0; i < sub_queue.length; i++)
				gen_queue.push(sub_queue[i]);
		}
	}

	if(blocksToReturn.length < STONE_CLUSTER_MIN_SIZE || blocksToReturn.length > STONE_CLUSTER_MAX_SIZE)
		return [];

	
	for(let i = 0; i < blocksToReturn.length; i++){
		let pX = blocksToReturn[i].posX;
		let pY = blocksToReturn[i].posY;

		pX = pX - smallestPX + 2;
		pY = pY - smallestPY + 2;

		structureMap[pX][pY] = true;
	}

	/*
		Add border.
	*/
	let borderBlocks = [];
	for(let i = 0; i < blocksToReturn.length; i++){
		let pX = blocksToReturn[i].posX;
		let pY = blocksToReturn[i].posY;
		

		if(is_valid_world_coordinate(pX-1,pY) && !structureMap[pX - 1 - smallestPX + 2][pY - smallestPY + 2]){
			borderBlocks.push(new StoneBlock(pX-1,pY,-3));
			bottomBlocks.push(new StoneBlock(pX-1,pY,-2));
			structureMap[pX - 1 - smallestPX + 2][pY - smallestPY + 2] = true;
		}
		
		if(is_valid_world_coordinate(pX+1,pY) && !structureMap[pX+1 - smallestPX + 2][pY - smallestPY + 2]){
			borderBlocks.push(new StoneBlock(pX+1,pY,-3));
			bottomBlocks.push(new StoneBlock(pX+1,pY,-2));
			structureMap[pX+1 - smallestPX + 2][pY - smallestPY + 2] = true;
		}
		
		if(is_valid_world_coordinate(pX,pY+1) && !structureMap[pX - smallestPX + 2][pY+1 - smallestPY + 2]){
			borderBlocks.push(new StoneBlock(pX,pY+1,-3));
			bottomBlocks.push(new StoneBlock(pX,pY+1,-2));
			structureMap[pX - smallestPX + 2][pY+1 - smallestPY + 2] = true;
		}

		if(is_valid_world_coordinate(pX,pY-1) && !structureMap[pX - smallestPX + 2][pY-1 - smallestPY + 2]){
			borderBlocks.push(new StoneBlock(pX,pY-1,-3));
			bottomBlocks.push(new StoneBlock(pX,pY-1,-2));
			structureMap[pX - smallestPX + 2][pY-1 - smallestPY + 2] = true;
		}
	}

	for(let i = 0; i < borderBlocks.length; i++){
		blocksToReturn.push(borderBlocks[i]);
	}
	/*
	//Do one more bottom border.
	let bottomBorderBlocks = [];
	for(let i = 0; i < bottomBlocks.length; i++){
		let pX = bottomBlocks[i].posX;
		let pY = bottomBlocks[i].posY;
		

		if(is_valid_world_coordinate(pX-1,pY) && !structureMap[pX - 1 - smallestPX + 2][pY - smallestPY + 2]){
			bottomBorderBlocks.push(new StoneBlock(pX-1,pY,-2));
			structureMap[pX - 1 - smallestPX + 2][pY - smallestPY + 2] = true;
		}
		
		if(is_valid_world_coordinate(pX+1,pY) && !structureMap[pX+1 - smallestPX + 2][pY - smallestPY + 2]){
			bottomBorderBlocks.push(new StoneBlock(pX+1,pY,-2));
			structureMap[pX+1 - smallestPX + 2][pY - smallestPY + 2] = true;
		}
		
		if(is_valid_world_coordinate(pX,pY+1) && !structureMap[pX - smallestPX + 2][pY+1 - smallestPY + 2]){
			bottomBorderBlocks.push(new StoneBlock(pX,pY+1,-2));
			structureMap[pX - smallestPX + 2][pY+1 - smallestPY + 2] = true;
		}

		if(is_valid_world_coordinate(pX,pY-1) && !structureMap[pX - smallestPX + 2][pY-1 - smallestPY + 2]){
			bottomBorderBlocks.push(new StoneBlock(pX,pY-1,-2));
			structureMap[pX - smallestPX + 2][pY-1 - smallestPY + 2] = true;
		}
	}
	for(let i = 0; i < bottomBorderBlocks.length; i++){
		//if(flip_biased_coin())
			//bottomBlocks.push(bottomBorderBlocks[i]);
	}
	*/
	for(let i = 0; i < bottomBlocks.length; i++){
		blocksToReturn.push(bottomBlocks[i]);
	}

	/*
		Ore vein generation. Should first
			(1) Pick a random starting block in retArray (with some probability).
			(2) Decide length of vein (based on type of ore).
			(3) Randomly walk in each direction, i.e., pick a direction
				Up, down, left, or right, based on a four sided dice flip. (Make a method for this :) )
	*/

	/*
		Probability is affected by the distance of the starting block of the stone cluster
		to the starting position of the player. (I.e., the middle of the map.)

		This value ranges from 0 (closest) to 4 (furthest).
	*/

	let distance = get_portion_distance_from_start(X,Y);

	let ore_gen = Math.random();
	let ORE = null;
	let ore_len = 0;


	switch(distance){
		case 0:
			if(ore_gen < 0.5){
				ORE = CopperStone;
				ore_len = 6 + roll_n_sided_die(4);
			}
			break;
		case 1:
			if(ore_gen < 0.25){
				ORE = CopperStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.5){
				ORE = LatkinStone;
				ore_len = 6 + roll_n_sided_die(4);
			}
			break;
		case 2:
			if(ore_gen < 0.2){
				ORE = CopperStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.4){
				ORE = LatkinStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.6){
				ORE = IllsawStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.7){
				ORE = PlatinumStone;
				ore_len = 4 + roll_n_sided_die(3);
			}
			break;
		case 3:
			if(ore_gen < 0.2){
				ORE = LatkinStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.5){
				ORE = IllsawStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.725){
				ORE = PlatinumStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.85){
				ORE = LuniteStone;
				ore_len = 4 + roll_n_sided_die(3);
			}

			break;
		case 4:
			if(ore_gen < 0.25){
				ORE = PlatinumStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.45){
				ORE = LuniteStone;
				ore_len = 6 + roll_n_sided_die(4);
			}else if(ore_gen < 0.7){
				ORE = DaytumStone;
				ore_len = 6 + roll_n_sided_die(4);
			}
			break;
	}

	if(ORE == null){
		return blocksToReturn;
	}

	/*
	if(ore_gen < COPPER_ORE){
		//Copper
		ORE = CopperStone;
		ore_len = 6 + roll_n_sided_die(4);
	}else if(ore_gen < COPPER_ORE+LUNITE_ORE){
		//Lunite
		ORE = LuniteStone;
		ore_len = 3 + roll_n_sided_die(3);
	}else if(ore_gen < COPPER_ORE+LUNITE_ORE+DAYTUM_ORE){
		//Daytum
		ORE = DaytumStone;
		ore_len = 2 + roll_n_sided_die(2);
	}else{
		//No ore
		return blocksToReturn;
	}
	*/


	
	/*
		Pick random block in 'blocksToReturn'
	*/
	let index = roll_n_sided_die(blocksToReturn.length);
	let curZ = blocksToReturn[index].posZ;

	//let testIndices = [index];

	for(let i = 0; i < ore_len; i++){
		let pX = blocksToReturn[index].posX;
		let pY = blocksToReturn[index].posY;
		let pZ = curZ;

		blocksToReturn[index] = new ORE(pX,pY,pZ);

		//Odds to flip Z
		if(flip_biased_coin(0.2)){
			if(curZ == -3) curZ = -2;
			else curZ = -3;

			let toLookFor = {posX: pX, posY: pY};
			for(let k = 0; k < blocksToReturn.length;k++){

				if(toLookFor.posX == blocksToReturn[k].posX && toLookFor.posY == blocksToReturn[k].posY && curZ == blocksToReturn[k].posZ){
					blocksToReturn[k] = new ORE(pX,pY,curZ);
					break;
				}
				
			}
		}

		let candidates = [];

		// There should also just be a chance that you go up/down.
		if(structureMap[pX - 1 - smallestPX + 2][pY - smallestPY + 2]){
			candidates.push({posX: pX-1, posY: pY});
		}
		
		if(structureMap[pX+1 - smallestPX + 2][pY - smallestPY + 2]){
			candidates.push({posX: pX+1, posY: pY});
		}
		
		if(structureMap[pX - smallestPX + 2][pY+1 - smallestPY + 2]){
			candidates.push({posX: pX, posY: pY+1});
		}

		if(structureMap[pX - smallestPX + 2][pY-1 - smallestPY + 2]){
			candidates.push({posX: pX, posY: pY-1});
		}

		if(candidates.length == 0){
			break;
		}

		//Set the chosen candidate to false in the structure map.
		let randInd = roll_n_sided_die(candidates.length);
		let toLookFor = candidates[randInd];
		for(let j = 0; j < blocksToReturn.length; j++){
			if(toLookFor.posX == blocksToReturn[j].posX && toLookFor.posY == blocksToReturn[j].posY && curZ == blocksToReturn[j].posZ){
				index = j;
				structureMap[toLookFor.posX - smallestPX + 2][toLookFor.posY - smallestPY + 2] = false;

				//testIndices.push(j);
				break;
			}
		}
	}
	//console.log(testIndices)

	//Just focus on top.


	//blocksToReturn[0] = new CopperStone(blocksToReturn[0].posX, blocksToReturn[0].posY, blocksToReturn[0].posZ);

	return blocksToReturn;
}


function gen_shop(X,Y){
	var retList=[]
	retList.push(new WeirdBlock(X+4,Y,-6));
	retList.push(new WeirdBlock(X+5,Y,-6));
	retList.push(new WeirdBlock(X+3,Y,-6));
	for(var j=-3;j>-6;j--){
		retList.push(new WeirdBlock(X,Y+1,j));
		retList.push(new WeirdBlock(X+1,Y,j));
		retList.push(new WeirdBlock(X+2,Y,j));
		retList.push(new WeirdBlock(X+3,Y,j));

		retList.push(new WeirdBlock(X+5,Y,j));
		retList.push(new WeirdBlock(X+6,Y,j));
		retList.push(new WeirdBlock(X+7,Y,j));
		for(var i=1;i<PORTION_SIZE-5;i++){
			retList.push(new WeirdBlock(X+8,Y+i,j));
			retList.push(new WeirdBlock(X,Y+i,j));
		}
		for(var i=1;i<PORTION_SIZE-2;i++){
			retList.push(new WeirdBlock(X+i,Y+PORTION_SIZE-5,j));
		}
	}
	for(var i=1;i<PORTION_SIZE-2;i++){
		for(var j=1;j<=PORTION_SIZE-6;j++)
			retList.push(new WeirdBlock(X+i,Y+j,-6));
	}

	for(var i=1;i<PORTION_SIZE-2;i++){
		for(var j=0;j<=PORTION_SIZE-6;j++)
			retList.push(new WoodBlock(X+i,Y+j,-2));
	}


	return retList;
}