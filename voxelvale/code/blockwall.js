/*
	Remove "new" from class name after testing is done.
*/
class zObjectNew{
	static objectNumber = -1; get objectNumber() {return this.constructor.objectNumber;}
	static name = 'NULL'; get name() {return this.constructor.name;}
	static typeOfObj = 'BLOCK'; get typeOfObj() {return this.constructor.typeOfObj;}
	static numReturned = 1; get numReturned() {return this.constructor.numReturned;}
	static actionType='SWING'; get actionType() {return this.constructor.actionType;}
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 36; get numberOfVerts() {return this.constructor.numberOfVerts;}


	static sendData(){}
	
	constructor(){}

	updateWhenHeld(){}
	
	isCraftable(){
		var neededObjects=this.getRecipe();
		if(neededObjects==null)
			return false;

		var canCraft=true;
		for(var i=0;i<neededObjects.length;i++){
			if(player.getObjectQuantity(neededObjects[i][0]) < neededObjects[i][1]){
				canCraft=false;
			}
		}

		return canCraft;
	}
	//Remove objects from recipe, then add object to inventory
	craftObject(){
		if(this.isCraftable()==false)
			return;
		var neededObjects=this.getRecipe();
		for(var i=0;i<neededObjects.length;i++){
			for(var j =0; j<neededObjects[i][1];j++){
				player.removeFromInventory(neededObjects[i][0]);
			}
		}
		for(var i=0;i<this.numReturned;i++)
			player.addToInventory(this.copy());
		return;
	}
	//Returns an array of the items needed to craft the item, along with the quantity of the item needed.
	//EX: return [[new WeirdBlock(),3],[new WoodBlock(),3],[new WoodAxe(),4],[new WeirdBlock(),3],[new GrassBlock(),3]];
	getRecipe(){
		return null;
	}
	copy(){
		return new this.constructor();
	}
	update(){

	}
	onLClick(){
		return;
	}
	onHold(){
		return;
	}
	onRelease(){
		return;
	}
	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
	drawTransparent(currentMat){
		this.drawSmall(currentMat);
	}
}

class BlockWallNew extends zObjectNew{
	
	static type = 'BLOCK_WALL'; get type() {return this.constructor.type;}
	static desc = 'No description.'; get desc() {return this.constructor.desc;}
	static tob = 'NULL'; get tob() {return this.constructor.tob;}
	static particleColor = vec3(0.5, 0.5, 0.5); get particleColor() {return this.constructor.particleColor;}
	static isTall = false; get isTall() {return this.constructor.isTall;}
	static isTop = false; get isTop() {return this.constructor.isTop;}
	static texture = -1; get texture() {return this.constructor.texture;}
	static sound = 'STONE'; get sound() {return this.constructor.sound;}
	static isInteractable = false; get isInteractable() {return this.constructor.isInteractable;}
	static correctTextureOrientation = false;
	static isFluid = false; get isFluid() {return this.constructor.isFluid;}

	static sendData(){
		if(!this.correctTextureOrientation){
			build_block(this.texture,0.0,0.0);
		}else{
			build_block_flip_top(this.texture,0,0,this.texture,this.texture)
		}
	}
	
	constructor(X,Y,Z,ground){
		super();
		
		this.instanceMat = translate(X,Y,Z);
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;

		this.ground = ground;

		this.isCeiling = false;
		this.drawTop = true;
		this.drawLeft = true;
		this.drawRight = true;
		this.drawBack = true;
		this.drawFront = true;
	}
	drop(){
		return this.copy();
	}
	update(){
		if(inDungeon)
			return;
		/*
			Determine if this is a ceiling or not.
		*/
		// I.e., -6, -5.
		if(this.posZ >= -4){
			this.isCeiling = false;
		}else{
			var blockLeft = world.getBlockAt(this.posX-1,this.posY,this.posZ);
			var blockRight = world.getBlockAt(this.posX+1,this.posY,this.posZ);
			var blockBehind = world.getBlockAt(this.posX,this.posY+1,this.posZ);
			var blockInfront = world.getBlockAt(this.posX,this.posY-1,this.posZ);
			
			
		
			if(this.posZ == -6){
				var blockBelow = world.getBlockAt(this.posX,this.posY,this.posZ+1);
				var blockBelowBelow = world.getBlockAt(this.posX,this.posY,this.posZ+2);

				this.isCeiling = true;
				if(blockBelow!=null){ //&& blockBelowBelow!=null){
					this.isCeiling = false;
					this.drawLeft = true;
					this.drawRight = true;
					this.drawBack = true;
					this.drawFront = true;
				}else{
					this.drawLeft = (blockLeft==null)
					this.drawRight = (blockRight==null)
					this.drawBack = (blockBehind==null)
					this.drawFront = (blockInfront==null)

					//Measure of how many blocks around block are empty. Block should be less transparent if this number is high.
					//Maybe do all 8 surrounding blocks. Might seems smoother?
					//this.opacityFactor = (this.drawLeft + this.drawRight + this.drawBack + this.drawFront)/4;

					/*
						Trying all 8 surrounding blocks
					*/
					/*
					var blockTL = world.getBlockAt(this.posX-1,this.posY+1,this.posZ);
					var blockBL = world.getBlockAt(this.posX-1,this.posY-1,this.posZ);
					
					var blockTR = world.getBlockAt(this.posX+1,this.posY+1,this.posZ);
					var blockBR = world.getBlockAt(this.posX+1,this.posY-1,this.posZ);
					this.opacityFactor = (this.drawLeft + this.drawRight + this.drawBack + this.drawFront + (blockTL == null) + (blockBL == null) + (blockTR == null) + (blockBR == null))/8;
					*/

				}
			}
			else if(this.posZ == -5 && false){
				var blockAbove = world.getBlockAt(this.posX,this.posY,this.posZ-1);
				var blockBelow = world.getBlockAt(this.posX,this.posY,this.posZ+1);
				if(blockAbove != null){
					this.drawTop = false;
				}

				this.isCeiling = true;
				if(blockBelow!=null){
					this.isCeiling = false;
					this.drawLeft = true;
					this.drawRight = true;
					this.drawBack = true;
					this.drawFront = true;
				}else{
					this.drawLeft = (blockLeft==null)
					this.drawRight = (blockRight==null)
					this.drawBack = (blockBehind==null)
					this.drawFront = (blockInfront==null)
				}
			}

		}

	}
	spawnParticles(){
		/*
			Spawn particles
		*/
		var numParticles = Math.round(Math.random()*6) + 6;

		for (let i = 0; i < numParticles; i++){
			var zOffset = Math.random();
			var xOffset = Math.random()-0.5;
			var yOffset = Math.random()-0.5;
			new Particle(this.posX+xOffset,this.posY+yOffset,this.posZ+zOffset, this.particleColor);
		}
	}
	isArray(){return false;}
	destroy(){
		this.spawnParticles();
		/*
			Adjust if block is to drop and item.
		*/
		
		if(this.drop().isArray()){
			let arr = this.drop();
			for(let i = 0; i < arr.length; i++)
				player.addToInventory(arr[i])
		}else{
			player.addToInventory(this.drop());
		}

		return;
	}
	returnPos(){
		return [this.posX,this.posY,this.posZ];
	}
	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
			//return [vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX,this.posY,this.posZ,1))),vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	

	setCeilOpac(){
		if(upOne == -6){
			gl.uniform1f(opacityFactorLoc,0.4);
		}else if(upOne == -5){
			gl.uniform1f(opacityFactorLoc,0.3);
		}else{
			gl.uniform1f(opacityFactorLoc,0);
		}
	}
	draw(){

		if(!this.isCeiling){
			set_mv(this.instanceMat);
			if(this.ground){
				gl.drawArrays(gl.TRIANGLES,this.index+24,6);
				return;
			}
			if(hitBox){
				gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
			}
		
			gl.drawArrays(gl.TRIANGLES,this.index+6,this.numberOfVerts-6);
		}else{
			set_mv(this.instanceMat);
			this.setCeilOpac();
			//Front
			if(this.drawFront)
				gl.drawArrays(gl.TRIANGLES,this.index+12,6);
			
			//Left
			if(this.drawLeft)
				gl.drawArrays(gl.TRIANGLES,this.index+30,6);
			//Right
			if(this.drawRight)
				gl.drawArrays(gl.TRIANGLES,this.index+6,6);
			
			//Back
			if(this.drawBack)
				gl.drawArrays(gl.TRIANGLES,this.index+18,6);

			
			
			//Bottom
			//gl.drawArrays(gl.TRIANGLES,this.index,6);
		}
	}

	drawTopBlock(){
		
		if(!this.drawTop) return;
		set_mv(this.instanceMat);
		this.setCeilOpac();
		gl.drawArrays(gl.TRIANGLES,this.index+24,6);
	}

	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}

	drawTransparent(currentMat){
		this.drawSmall(currentMat);
	}

	drawCursor(currentMat){
		this.drawSmall(currentMat);	
	}
	drawShadows(){
		/*
			Shadows should not be generated below (technically above) the depth z = -0.201. So if z > -0.2 don't generate a shadow.
		*/
		if(this.posZ >= -2){
			return;
		}
		/*
			This is the matrix that puts our blocks coordinates into the orthogonal display coordinates (eyespace, or what you see when you hit 'p').
			For instance, if the block is on the ground and in the first quadrant (top right), with respect to the player/light,
			then its position in WebGL coordinates may be like (0.5,0.5,-0.3). As another example, if it's on the ground 
			and in the third quadrant (bottom left), it may be like (-0.6, -0.6, -0.3).

			Essentially, this is the model view matrix for this specific block, which puts it in eye-space (prior to clip space).
		*/
		var thisModelViewMatrix = mult(modelViewMatrix, this.instanceMat);

		/*
			We then calculate modelViewShadow, by applying sMatrix. sMatrix is calculated by the method "computeShadowMatrix".
			sMatrix represents the projection of our model onto the plane at level z = -0.2 (more precisely z = -0.201, so shadows sit above blocks),
			from the perspective of the light (in eye-space). So applying sMatrix to our block gives us the coordinates of the shadow in
			eyespace.
		*/
		var modelViewShadow = mult(sMatrix, thisModelViewMatrix);

		// Set current model view matrix and draw the shadow.
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	
	}

	drawHB(){
		set_mv(this.instanceMat);
		gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
	}
	copy(X=null,Y=null,Z=null){
		return new this.constructor(X,Y,Z);
	}
	onClick(){return;}
	onHover(){return;}
	intersect(){return;}
}


class FlipBlock extends BlockWallNew{

	constructor(X=null,Y=null,Z=null,ground=false){
		//This is the good texture.
		super(X,Y,Z,ground);
		
		const rotation = Math.floor((Math.random() * 4))
		if(rotation  == 0){
			this.switchOrientation(0,0.001);
		}
		if(rotation  == 1){
			this.switchOrientation(90,0.0001);
		}
		if(rotation == 2){
			this.switchOrientation(180,-0.0001);
		}
		if(rotation == 3){
			this.switchOrientation(270,-0.001);
		}
	}

	switchOrientation(ROT, depthOffset){
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		this.rot = ROT;
		this.instanceMat = mult(this.instanceMat,translate(0.5,0.5,0));
		//this.instanceMat = mult(this.instanceMat,scale4(1,0.999,1));
		if(this.posY%2 == 0){
			//this.instanceMat = mult(this.instanceMat,translate(0,0,0.02));
		}
		//this.instanceMat = mult(this.instanceMat,translate(0,0,depthOffset));
		this.instanceMat = mult(this.instanceMat,rotateZ(this.rot));
		this.instanceMat = mult(this.instanceMat,translate(-0.5,-0.5,0));
	}
	
}

class GrassBlock extends BlockWallNew{
	static name = 'Grass';
	static objectNumber=2;
	static desc = 'A grass block.'
	static tob='STONE';
	static particleColor = vec3(0.5, 0.7, 0.2);
	static texture = 0;
	static sound = 'DIRT';

	static sendData(){
		build_block(this.texture,0.0,0.0);
		build_block(this.texture+8,0.0,0.0);
		build_block(this.texture+16,0.0,0.0);
	}

	constructor(X=null,Y=null,Z=null,ground=false){
		//This is the good texture.
		super(X,Y,Z,ground);
		
		const rotation = Math.floor((Math.random() * 4));
		this.originalInstanceMat = this.instanceMat;
		if(rotation  == 0){
			this.switchOrientation(0,0.001);
		}
		if(rotation  == 1){
			this.switchOrientation(90,0.0001);
		}
		if(rotation == 2){
			this.switchOrientation(180,-0.0001);
		}
		if(rotation == 3){
			this.switchOrientation(270,-0.001);
		}

		this.isCool = Math.round(Math.random()*100);
	}

	switchOrientation(ROT, depthOffset){
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		this.rot = ROT;
		this.instanceMat = mult(this.instanceMat,translate(0.5,0.5,0));
		//this.instanceMat = mult(this.instanceMat,scale4(1,0.999,1));
		if(this.posY%2 == 0){
			//this.instanceMat = mult(this.instanceMat,translate(0,0,0.02));
		}
		//this.instanceMat = mult(this.instanceMat,translate(0,0,depthOffset));
		this.instanceMat = mult(this.instanceMat,rotateZ(this.rot));
		this.instanceMat = mult(this.instanceMat,translate(-0.5,-0.5,0));
	}

	draw(){

		if(!this.isCeiling){
			set_mv(this.instanceMat);
			if(this.ground){
				gl.drawArrays(gl.TRIANGLES,this.index+24,6);
				return;
			}
			if(hitBox){
				gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
			}
			
			switch(this.isCool){
				case 0:
					gl.drawArrays(gl.TRIANGLES,this.index+42,this.numberOfVerts-6);
					break;
				case 1:
					gl.drawArrays(gl.TRIANGLES,this.index+78,this.numberOfVerts-6);
					break;
				default:
					gl.drawArrays(gl.TRIANGLES,this.index+6,this.numberOfVerts-6);
			}
				
		}else{
			if(this.posZ == -6)
				set_mv(this.originalInstanceMat);

			this.setCeilOpac();
			//Front
			if(this.drawFront)
				gl.drawArrays(gl.TRIANGLES,this.index+12,6);
			
			//Left
			if(this.drawLeft)
				gl.drawArrays(gl.TRIANGLES,this.index+30,6);
			//Right
			if(this.drawRight)
				gl.drawArrays(gl.TRIANGLES,this.index+6,6);
			
			//Back
			if(this.drawBack)
				gl.drawArrays(gl.TRIANGLES,this.index+18,6);
			//Bottom
			//gl.drawArrays(gl.TRIANGLES,this.index,6);

		}
	}
	
}

/*
	Simple blocks.
*/

function initialize_simpleBlocks(){
	simpleBlocks = [GrassBlock, WeirdBlock, BrickBlock, StoneFloorBlock, DungeonWall, BorderWall,CopperBrick, Chest, Water];
}

class WeirdBlock extends BlockWallNew{
	static name = 'Weird';
	static objectNumber=1;
	static desc = 'A weird block.'
	static texture = 43;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
}

class BrickBlock extends BlockWallNew{
	static name = 'Stone Brick';
	static objectNumber=10;
	static desc = 'A stone brick block.'
	static texture = 12;
	static tob='STONE';
	static correctTextureOrientation = true;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
}

class StoneFloorBlock extends FlipBlock{
//class StoneFloorBlock extends BlockWallNew{
	static name = 'Stone Floor';
	static objectNumber=11;
	static desc = 'A stone floor.'
	static texture = 61;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
}

class DungeonWall extends BlockWallNew{
	static name = 'Dungeon Wall';
	static objectNumber=12;
	static desc = 'A dungeon wall floor.'
	static texture = 60;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
}

class BorderWall extends BlockWallNew{
	static name = 'Border Wall';
	static objectNumber=15;
	static desc = 'How did you get this in your inventory?!'
	static texture = 51;
	static correctTextureOrientation = true;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
	//onClick(){
	//	console.log('xPos:', this.posX, 'yPos:', this.posY);
	//}
}

class CopperBrick extends BlockWallNew{
	static name = 'Copper Brick';
	static objectNumber=17;
	static desc = 'A copper brick block.'
	static texture = 52;
	static tob='STONE';
	static correctTextureOrientation = true;
	constructor(X=null,Y=null,Z=null,ground=false){
		super(X,Y,Z,ground);
	}
}

