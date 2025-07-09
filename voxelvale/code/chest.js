


/*
	Abstract class for interactable blocks that can be opened like
	chests.
*/
class OpeningBlock extends BlockWallNew{

	static isInteractable = true;

	static bottomStart = 0;
	static bottomNumber = 0;

	static topStart = 0;
	static topNumber = 0;

	static latchStart = 0;
	static latchNumber = 0;

	/*
		Should take some arguments/static fields.
		Need to make it two seperate portions.
	*/
	static sendData(){
		this.bottomStart = vertices.length;
		build_block_3D(41,0,0,40+8,40+8);
		this.bottomNumber = vertices.length - this.bottomStart;
		
		this.topStart = vertices.length;
		build_block_3D(40,0,0,40+8,40+8);
		this.topNumber = vertices.length - this.topStart;

		this.latchStart = vertices.length;
		build_colored_cuboid(hexToRgbA('#888888'));
		this.latchNumber = vertices.length - this.latchStart;
	
		

	}
	
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,false);

		this.maxCapacity = 25;
		this.numberOfObjects = 0;

		this.relativeAngle = 0;
		this.orientation = 0;
		this.openAngle = 0;

		let scaleMat = mult(translate(0.5,0.5,1),mult(scale4(0.9,0.9,0.9), mult(rotateZ(0),translate(-0.5,-0.5,-1))));
		this.drawContentsInstanceMat = mult(translate(X,Y,Z),scaleMat);


		scaleMat = mult(translate(0.5,0.5,1),mult(scale4(0.9,0.9,0.6), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))));
		this.bottomMat = mult(translate(X,Y,Z),scaleMat);
		this.bottomMatOriginal = scaleMat;

		scaleMat = mult(translate(0.5,0.5,0.4),mult(scale4(0.9,0.9,0.3),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)
		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat  );
		this.topMat = mult(translate(X,Y,Z),scaleMat);
		this.topMatOriginal = scaleMat;

		scaleMat = mult(translate(0.5,0,0.47),mult(scale4(0.1,0.1,0.2),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)

		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat );
		this.latchMat = mult(translate(this.posX,this.posY,this.posZ),scaleMat);
		this.latchMatOriginal = scaleMat;


		if(X==null) return;

		this.setAngle((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5);

		if(this.relativeAngle > 45 && this.relativeAngle <= 145){
			this.orientation = 0;
		}
		else if(this.relativeAngle > 145 && this.relativeAngle <= 225){
			this.orientation = 90;
		}
		else if(this.relativeAngle > 225 && this.relativeAngle <= 305){
			this.orientation = 180;
		}
		else{
			this.orientation = 270;
		}

		this.isOpen = false
	}

	draw(){

		//this.openAngle = 25//(this.openAngle+0.4) % 30;

		if(this.isOpen){
			this.openAngle = Math.min(this.openAngle+2,26);
		}else{
			this.openAngle = Math.max(this.openAngle-2,0);
		}

		
		let scaleMat = mult(translate(0.5,0.5,0.4),mult(scale4(0.9,0.9,0.3),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)

		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat  );
		
		this.topMat = mult(translate(this.posX,this.posY,this.posZ),scaleMat);

		set_mv(this.bottomMat);
		gl.drawArrays(gl.TRIANGLES,this.constructor.bottomStart+6,this.constructor.bottomNumber-6);


		set_mv(this.topMat);
		gl.drawArrays(gl.TRIANGLES,this.constructor.topStart+6,this.constructor.topNumber-6);


		scaleMat = mult(translate(0.5,0,0.47),mult(scale4(0.1,0.1,0.2),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)

		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat );
		

		this.latchMat = mult(translate(this.posX,this.posY,this.posZ),scaleMat);
		set_mv(this.latchMat);
		gl.drawArrays(gl.TRIANGLES,this.constructor.latchStart,this.constructor.latchNumber);

		return;
		
	
	}

	drawSmall(currentMat){
		currentMat = mult(currentMat,translate(1,0,0));
		currentMat = mult(currentMat,mult(rotateY(-90),scale4(1,1,1)));

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.topMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.topStart+6,this.constructor.topNumber-6);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.bottomMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.bottomStart+6,this.constructor.bottomNumber-6);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.latchMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.latchStart,this.constructor.latchNumber);
	}

	drawCursor(currentMat){
		this.setAngle((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5);

		if(this.relativeAngle > 45 && this.relativeAngle <= 145){
			this.orientation = 0;
		}
		else if(this.relativeAngle > 145 && this.relativeAngle <= 225){
			this.orientation = 90;
		}
		else if(this.relativeAngle > 225 && this.relativeAngle <= 305){
			this.orientation = 180;
		}
		else{
			this.orientation = 270;
		}

		let scaleMat = mult(translate(0.5,0.5,1),mult(scale4(0.9,0.9,0.6), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, scaleMat)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.bottomStart+6,this.constructor.bottomNumber-6);

		scaleMat = mult(translate(0.5,0.5,0.4),mult(scale4(0.9,0.9,0.3),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)
		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat  );
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, scaleMat)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.topStart+6,this.constructor.topNumber-6);



		scaleMat = mult(translate(0.5,0,0.47),mult(scale4(0.1,0.1,0.2),translate(-0.5,-0.5,-1)));
		scaleMat = mult(translate(0,-1.2,-0.1),scaleMat)
		scaleMat = mult(rotateX(this.openAngle), scaleMat);
		scaleMat = mult(translate(0,1.2,0.1),scaleMat)

		scaleMat = mult(mult(translate(0.5,0.5,1), mult(rotateZ(this.orientation),translate(-0.5,-0.5,-1))),scaleMat );
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, scaleMat)));
		gl.drawArrays(gl.TRIANGLES,this.constructor.latchStart,this.constructor.latchNumber);
	}


	setAngle(X,Y){
		var pX=player.posX;
		var pY=player.posY;
		
		var dX=X-pX;
		var dY=Y-pY;

		if(dX == 0 && dY >= 0){
			this.relativeAngle = 90;
			return;
		}
		if(dX == 0 && dY < 0){
			this.relativeAngle = 270;
			return;
		}
		var ang = (180*Math.atan(Math.abs(dY/dX))/Math.PI);
		var signX = Math.sign(dX);
		var signY = Math.sign(dY);

		//Quadrant 1
		if(signX == 1 && signY == 1){this.relativeAngle = ang;}
		//Quadrant 2
		if(signX == -1 && signY == 1){this.relativeAngle = (90-ang)+90;}
		//Quadrant 3
		if(signX == -1 && signY == -1){this.relativeAngle = ang+180;}
		//Quadrant 4
		if(signX == 1 && signY == -1){this.relativeAngle = (90-ang)+270;}

	}
	

}


class Chest extends OpeningBlock{
	static objectNumber = 18;
	static name = 'Wooden Chest';
	static desc = 'A wooden chest.';
	static tob = 'WOOD';
	static particleColor = vec3(0.5, 0.5, 0.5);
	static texture = 9;
	static displayWidth = 1.1; get displayWidth() {return this.constructor.displayWidth;}
	static capacity = 10; get capacity() {return this.constructor.capacity;}
	constructor(X=null, Y=null, Z=null){
		super(X,Y,Z);
		//this.orientation = 0;

		//this.blocks = [new WoodLog(), new WoodLog(), new GrassBlock(), new WoodBlock(), new GrassBlock(), new CopperBrick(), new CopperBrick(), new WeirdBlock()];
		//this.tools = [];
		//this.items = [];
		//this.recipes = [];

		this.blockQuantityPair = [];
		this.toolQuantityPair = [];
		this.itemQuantityPair = [];
		this.recipeQuantityPair = [];

		/* For testing */
		/*
		this.addObject(new WoodLog());
		this.addObject(new WoodLog());

		this.addObject(new GrassBlock());
		this.addObject(new WoodBlock());

		this.addObject(new GrassBlock());
		this.addObject(new CopperBrick());

		this.addObject(new WeirdBlock());
		this.addObject(new CopperBrick());

		this.addObject(new WeirdBlock());
		this.addObject(new WeirdBlock());
		this.addObject(new WeirdBlock());
		this.addObject(new WeirdBlock());
		*/

	}

	destroy(){
		if(this.posX == null) return;


		
		let blockList = this.getBlockList();
		let toolList = this.getToolList();
		let itemList = this.getItemList();
		let recipeList = this.getRecipeList();

		for(let j = 0; j < blockList.length; j++){
			let quant = blockList[j][1];
			for(let k = 0; k < quant; k++){
				player.addToInventory(blockList[j][0])	
			}
		}
		for(let j = 0; j < toolList.length; j++){
			let quant = toolList[j][1];
			for(let k = 0; k < quant; k++){
				player.addToInventory(toolList[j][0])	
			}
		}
		for(let j = 0; j < itemList.length; j++){
			let quant = itemList[j][1];
			for(let k = 0; k < quant; k++){
				player.addToInventory(itemList[j][0])	
			}
		}
		for(let j = 0; j < recipeList.length; j++){
			let quant = recipeList[j][1];
			for(let k = 0; k < quant; k++){
				player.addToInventory(recipeList[j][0])	
			}
		}

		player.addToInventory(this.copy());
	

	}



	getCorrectArrayPair(object){
		switch(object.typeOfObj){
			case 'BLOCK':
				return this.blockQuantityPair;
			case 'ITEM':
				return this.toolQuantityPair;
			case 'NON_ACTIONABLE_ITEM':
				return this.itemQuantityPair;
			case 'REC':
				return this.recipeQuantityPair;
		}
		return this.blockQuantityPair
	}

	getQuantity(object){
		let correctPair = this.getCorrectArrayPair(object);
		for(let i = 0; i < correctPair.length; i++){
			if(correctPair[i][0].objectNumber == object.objectNumber){
				return correctPair[i][1]
			}
		}
		return 0;
	}

	addObject(object, numberToAdd = 1){
		let correctPair = this.getCorrectArrayPair(object);

		this.numberOfObjects+=numberToAdd;

		for(let i = 0; i < correctPair.length; i++){
			if(correctPair[i][0].objectNumber == object.objectNumber){
				correctPair[i][1]+=numberToAdd;
				return;
			}
		}
		correctPair.push([object,numberToAdd]);
	}

	removeObject(object, numberToRemove = 1){
		let correctPair = this.getCorrectArrayPair(object);
		let len = correctPair.length;
		this.numberOfObjects-=numberToRemove;
		for(let i = 0; i < len; i++){
			if(correctPair[i][0].objectNumber == object.objectNumber){
				correctPair[i][1]-=Math.max(numberToRemove,0);

				// In this case you need to remove the pair from the array.
				// You don't really need to, but this is for ordering.
				
				//[WoodBlock, 5], [WeirdBlock, 6], [TestBlock, 0], [WoodLog, 3], [CopperBrick, 3]   # of pairs is len.
				if(correctPair[i][1] <= 0){
					if(i == len){
						correctPair.pop();
						return;
					}
					else{
						for(let j = i; j < len-1; j++){
							correctPair[j] = correctPair[j+1];
						}
						correctPair.pop();
						return;
					}
				}

				return;
			}
		}
	}

	getBlockList(){
		return this.blockQuantityPair;
	}

	getToolList(){
		return this.toolQuantityPair;
	}

	getItemList(){
		return this.itemQuantityPair;
	}

	getRecipeList(){
		return this.recipeQuantityPair;
	}

	drawContents(){
		if(inventory|| inFunction) return;
		let c = vec4(0.5,1,0,1);
		c = mult(this.drawContentsInstanceMat, c);
		c = mult(modelViewMatrix, c);
		c = mult(projectionMatrix, c);
		c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5] //Exact center.
		draw_filled_box(c[0]-this.displayWidth/2,c[1],c[0]+this.displayWidth/2,c[1]+(1.3)*0.17);
		draw_centered_text(c[0],c[1]+0.1,"Open chest.",'12');
	}

	onHover(){
		this.drawContents();

	}

	onClick(){
		toggleInventory(IN_CHEST,this);
		this.isOpen = true;
	}

}