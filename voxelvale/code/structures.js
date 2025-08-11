

class Structure{
	constructor(){
		this.blockList=[];
	}
	addG




}
function gen_tree(X,Y){
	var blockList=[];
	blockList.push(new WoodLog(X,Y,-3));
	blockList.push(new WoodLog(X,Y,-4));
	blockList.push(new WoodLog(X,Y,-5));
	//if(generate_by_probability(0.5))
	//	blockList.push(new WoodBranch(X,Y+1,-5))
	if(generate_by_probability(0.5))
		blockList.push(new WoodBranch(X+1,Y,-5))
	if(generate_by_probability(0.5))
		blockList.push(new WoodBranch(X-1,Y,-5))
	//if(generate_by_probability(0.25))
	//	blockList.push(new WoodBranch(X,Y-1,-5))
	if(generate_by_probability(0.4)){
		blockList.push(new WoodLog(X,Y,-6));
		//if(generate_by_probability(0.25))
		//	blockList.push(new WoodBranch(X,Y+1,-6))
		if(generate_by_probability(0.5))
			blockList.push(new WoodBranch(X+1,Y,-6))
		if(generate_by_probability(0.5))
			blockList.push(new WoodBranch(X-1,Y,-6))
		//if(generate_by_probability(0.25))
		//	blockList.push(new WoodBranch(X,Y-1,-6))
	}
	return blockList;
}

function gen_cactus(X,Y){
	var blockList=[];
	let topBlock = null;
	blockList.push(new Cactus(X,Y,-3));
	blockList.push(new Cactus(X,Y,-4));
	topBlock = new Cactus(X,Y,-5);
	blockList.push(topBlock);
	
	let extraTall = false;

	//Make it taller.
	if(generate_by_probability(0.4)){
		topBlock = new Cactus(X,Y,-6)
		blockList.push(topBlock);
		extraTall = true;
	}


	//Arm must be at either -4 or -5
	let roll = roll_n_sided_die(2);
	switch(roll){
		case 0:
			//Just one
			let offset = 0;
			if(extraTall){
				offset = Math.round(Math.random());
			}
			if(generate_by_probability(0.5)){
				blockList.push(new CactusArm(X+1,Y,-4-offset))			
			}else{
				blockList.push(new CactusArm(X-1,Y,-4-offset))
			}
			break;
		case 1:
			//Do two
			let offset1 = 0;
			let offset2 = 0;
			if(extraTall){
				offset1 = Math.round(Math.random());
				offset2 = Math.round(Math.random());
			}
			blockList.push(new CactusArm(X+1,Y,-4-offset1))			
			blockList.push(new CactusArm(X-1,Y,-4-offset2))
		
			break;

	}

	topBlock.isTopOfCactus = true;
	return blockList;
}

function gen_dungeon_BL(X,Y){
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
		/*
			Turned teleport off for testing transparent ceilings.
		*/
		//retList.push(new TeleBlock(X+4,Y+1,j,3));
		//It's kind of important that there's only one TeleBlock not two.
		//This is because a flag gets set that transports them to a specific dungeon...
		retList.push(new TeleBlock(X+4,Y+1,j,4));
	}
	for(var i=1;i<PORTION_SIZE-2;i++){
		for(var j=1;j<=PORTION_SIZE-6;j++)
			retList.push(new WeirdBlock(X+i,Y+j,-6));
	}
	return retList;
}

function gen_stone_cluster_big(X,Y){
	
}

function gen_stone_cluster(X,Y){
	var retList=[];
	var clusterPattern = Math.round(Math.random()*10);

	//This will be randomly chosen
	let ORE;

	//50 Percent no ore
	//25 Percent Copper
	let oddsForOre = Math.random();
	if(oddsForOre < 0.25){
		ORE = StoneBlock;
	}else if(oddsForOre<0.75){
		ORE = CopperStone;
	}else{
		ORE = StoneBlock;
	}


	switch(clusterPattern){
		case 0:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new ORE(X,Y-1,-3));
			retList.push(new ORE(X,Y+1,-3));
			retList.push(new ORE(X-1,Y,-3));
			retList.push(new ORE(X+1,Y,-3));
			break;
		case 1:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new StoneBlock(X+1,Y,-3));
			retList.push(new StoneBlock(X,Y+1,-3));
			retList.push(new StoneBlock(X+1,Y+1,-3));
			break;
		case 2:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new StoneBlock(X,Y+1,-3));
			retList.push(new StoneBlock(X,Y+2,-3));
			retList.push(new StoneBlock(X+1,Y+2,-3));
			retList.push(new StoneBlock(X+1,Y+1,-3));
		case 3:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new ORE(X,Y+1,-3));
			retList.push(new ORE(X,Y+2,-3));
			retList.push(new ORE(X+1,Y+2,-3));
			retList.push(new StoneBlock(X+1,Y+1,-3));

		case 4:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new ORE(X+1,Y,-3));
			retList.push(new ORE(X,Y+1,-3));
			retList.push(new StoneBlock(X+1,Y+1,-3));
			break;

		case 5:

		case 6:

		case 7:

		case 8:

		case 9:
			retList.push(new StoneBlock(X,Y,-3));
			retList.push(new StoneBlock(X+1,Y,-3));
			retList.push(new StoneBlock(X+2,Y,-3));
			retList.push(new StoneBlock(X+1,Y+1,-3));
			retList.push(new StoneBlock(X+2,Y+1,-3));
			if(Math.random()>0.5)
				retList.push(new StoneBlock(X+3,Y+1,-3));
			else
				retList.push(new StoneBlock(X,Y+1,-3));
		break;
	}
	return retList;
}

//GEN_TREE_CLUSTER?