var vPs = [
	vec3( 0, 0, 1),  //0
    vec3( 0, 1, 1),  //1
    vec3( 1, 1, 1),  //2
    vec3( 1, 0, 1),  //3
    vec3( 0, 0, 0),  //4
    vec3( 0, 1, 0),  //5
    vec3( 1, 1, 0),  //6
    vec3( 1, 0, 0)   //7
];

function block_face(a,b,c,d,flipNorm=false,color=vec4(1,1,1,1)){
	if(!flipNorm){
		default_push(vPs[a], vPs[d], vPs[c],color,color,color);
		default_push(vPs[a], vPs[c], vPs[b],color,color,color);
	}else{
		default_push(vPs[a], vPs[b], vPs[c],color,color,color);
		default_push(vPs[a], vPs[c], vPs[d],color,color,color);
	}
}


function build_block(Texture, oX=0.0065, oY=0.0065, Texture2 = Texture, Texture3 = Texture){
	//Bottom
	block_face( 1, 0, 3, 2 );
	set_texture(Texture,oX,oY);
	
	//Right
	block_face( 2, 3, 7, 6 ,true);
	set_texture(Texture3,oX,oY);
	
	//Front
	block_face( 3, 0, 4, 7,true);
	set_texture(Texture2,oX,oY);


	//Back (here)
	block_face( 6, 5, 1, 2,true);
	set_texture(Texture2,oX,oY);
	
	//Top
	block_face( 4, 5, 6, 7,true);
	set_texture(Texture,oX,oY);
	

	//Left
	block_face( 5, 4, 0, 1,true);
	set_texture(Texture3,oX,oY);
}





function build_colored_cuboid(color){
	for(let i = 0; i < 36; i++)
		texCoords.push(vec2(2.0,2.0));
	//Bottom
	block_face( 1, 0, 3, 2, false, color);
	
	//Right
	block_face( 2, 3, 7, 6 ,true, color);
	
	//Front
	block_face( 3, 0, 4, 7,true, color);

	//Back
	block_face( 6, 5, 1, 2,true, color);
	
	//Top
	block_face( 4, 5, 6, 7,true, color);

	//Left
	block_face( 5, 4, 0, 1,true, color);

}


let pinch = 0.1;  //For the top.
let squish = 0.25; //For height
let squeeze = 0.2; //Squeeze side in
let elongate = 0.12;
var vPBars = [
	vec3( 0+squish, 0-elongate, 1-squeeze),  			//0
    vec3( 0+squish, 1+elongate, 1-squeeze),  			//1
    vec3( 1-squish, 1-pinch+elongate, 1-pinch-squeeze),  //2 
    vec3( 1-squish, 0+pinch-elongate, 1-pinch-squeeze),  //3 

    vec3( 0+squish, 0-elongate, 0+squeeze),  			//4
    vec3( 0+squish, 1+elongate, 0+squeeze),  			//5
    vec3( 1-squish, 1-pinch+elongate, 0+pinch+squeeze),  //6 
    vec3( 1-squish, 0+pinch-elongate, 0+pinch+squeeze)   //7 
];

function bar_face(a,b,c,d,flipNorm=false,colors=[]){
	if(!flipNorm){
		default_push(vPBars[a], vPBars[d], vPBars[c],colors[a],colors[d],colors[c]);
		default_push(vPBars[a], vPBars[c], vPBars[b],colors[a],colors[c],colors[b]);
	}else{
		default_push(vPBars[a], vPBars[b], vPBars[c],colors[a],colors[b],colors[c]);
		default_push(vPBars[a], vPBars[c], vPBars[d],colors[a],colors[c],colors[d]);
	}
}


/*
	isBlue=false){

	var colourHandle=vec4(0.9,0.6,0.15,1);
	var secondColor=vec4(0.8,0.5,0.1,1)
	
	if(isBlue){
		colourHandle = mult_colors(colourHandle,recipeColor);
		secondColor = mult_colors(secondColor,recipeColor);
	}
*/



//Do TWO COLORS :) Gradient from top copper green bottom.
function build_colored_bar(color2, color=color2, isBlue=false){
	for(let i = 0; i < 36; i++)
		texCoords.push(vec2(2.0,2.0));

	if(isBlue){
		color = mult_colors(color,recipeColor);
		color2 = mult_colors(color2,recipeColor);
	}

	let vPBarColors = [color, color, color2, color2, color, color, color2, color2]

	if(!isBlue){
		//Bottom 
		bar_face( 1, 0, 3, 2, false, vPBarColors);
		
		//Right (Pinch this face in.)
		bar_face( 2, 3, 7, 6 ,true, vPBarColors);
		
		//Front 
		bar_face( 3, 0, 4, 7,true, vPBarColors);

		//Back 
		bar_face( 6, 5, 1, 2,true, vPBarColors);
		
		//Top 
		bar_face( 4, 5, 6, 7,true, vPBarColors);

		//Left (Only makes sense that you're the bottom.)
		bar_face( 5, 4, 0, 1,true, vPBarColors);
	}else{

		//Top 
		bar_face( 4, 5, 6, 7,true, vPBarColors);
		
		
		
		//Right (Pinch this face in.)
		bar_face( 2, 3, 7, 6 ,true, vPBarColors);
		
		//Front 
		bar_face( 3, 0, 4, 7,true, vPBarColors);

		//Back 
		bar_face( 6, 5, 1, 2,true, vPBarColors);
		
		//Bottom 
		bar_face( 1, 0, 3, 2, false, vPBarColors);

		//Left (Only makes sense that you're the bottom.)
		bar_face( 5, 4, 0, 1,true, vPBarColors);
	}
}

//Wood(0), Weird(1), Grass(2), Tile(3),...
function get_specific_block_offset(number){
	return NM+(36*number);
}

//Abstract upon which all blocks and items are based. So, methods essential to both of them, essentially most
//to do with inventory management and crafting should be added here.
class zObject{
	constructor(){
		/* These should all be static*/
		this.typeOfObj='NULL';
		this.name='none';
		this.numReturned=1;
		this.actionType='SWING';
	}
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
	updateWhenHeld(){}
}

class BlockWall extends zObject{
	constructor(X,Y,Z,Texture=0,Ground=false,TOB='NULL'){
		super();
		//Static
		this.texture = Texture;
		
		//Instance
		this.instanceMat = translate(X,Y,Z);
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;

		//Static
		this.index = 0;
		this.numberOfVerts = 36;
		this.ground=Ground;
		this.typeOfObj = 'BLOCK';
		this.type = 'BLOCK_WALL';
		this.name = 'NULL';
		this.desc = 'No description.';
		this.tob=TOB;
		this.objectNumber=null;
		this.particleColor = vec3(0.5, 0.5, 0.5);
		this.isTall = false;
		this.isInteractable = false;
		this.isTop = false;
		this.isCeiling = false;
		/*
			Give ceiling some sort of "opacityFactor"
			That increases maybe by the number of ceiling blocks around it?.
			Not a great idea...
		*/
		//this.opacityFactor = 0;

		//These might need to be instance?
		this.drawTop = true;
		this.drawLeft = true;
		this.drawRight = true;
		this.drawBack = true;
		this.drawFront = true;

		this.sound = 'STONE';
		this.isFluid = false;
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
	destroy(){


		//this.spawnParticles();

		//You can just adjust this so it adds a specified drop
		//where the default can be the block unless otherwise
		//specified...
		//player.addToInventory(this.drop());

		this.spawnParticles();
		/*
			Adjust if block is to drop and item.
		*/
		if(Array.isArray(this.drop())){
			let arr = this.drop();
			for(let i = 0; i < arr.length; i++)
				player.addToInventory(arr[i])
		}else{
			player.addToInventory(this.drop());
		}


		return;
	}
	isArray(){return false;}
	returnIndex(){
		return this.index;
	}
	returnName(){
		return this.name;
	}
	returnPos(){
		return [this.posX,this.posY,this.posZ];
	}
	returnBounds(){
		if(fixedView){
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+0.5)];
		}
		else{
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+0.5,1)))];
		}
	}
	sendData(){
		build_block(this.texture);
	}
	/*
	draw(){
		set_mv(this.instanceMat);
		//gl.drawArrays(gl.LINES,lastByte,numberOfBytes);
		if(this.ground){
			gl.drawArrays(gl.TRIANGLES,this.index+24,6);
			return;
		}
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index+6,this.numberOfVerts-6);

	}
	*/

	setCeilOpac(){
		if(upOne == -6){
			gl.uniform1f(opacityFactorLoc,0.4);
		}else if(upOne == -5){
			gl.uniform1f(opacityFactorLoc,0.3);
		}else{
			gl.uniform1f(opacityFactorLoc,0);
		}
		//gl.uniform1f(opacityFactorLoc,this.opacityFactor);
	}
	draw(){

		if(!this.isCeiling){
			set_mv(this.instanceMat);
			//gl.drawArrays(gl.LINES,lastByte,numberOfBytes);
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




class SpecialBlock{
	constructor(X,Y,Z){
		this.instanceMat = translate(X,Y,Z);
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.index = 0;
		this.numberOfVerts = 36;
		this.type = 'SPECIAL_BLOCK';
		this.objectNumber = -1;
	}
	update(){return;}
	returnPos(){
		return [this.posX,this.posY,this.posZ];
	}
	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	sendData(){
		build_block(this.texture);
	}
	draw(){
		if(hitBox){
			set_mv(this.instanceMat);
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
	}
	intersect(dir=0){

	}
	drawShadows(){

	}
	onClick(){return;}
	onHover(){return;}
}

class NullifierBlock{
	constructor(X=null,Y=null,Z=null){
		this.instanceMat = translate(X,Y,Z);
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.type = 'NULL_BLOCK';

		//console.log('I am created for some reason?')
	}
}

class WoodBlock extends BlockWall{
	constructor(X=null,Y=null,Z=null,Ground=false){
		super(X,Y,Z,5,Ground);
		this.index = woodStart;
		this.name = 'Wood';
		this.objectNumber = 0;
		this.numReturned=2;
		this.desc = 'A wood block.'
		this.tob='WOOD';
		this.sound = 'WOOD';
	}
	getRecipe(){
		return [
			[new WoodLog(),1]
		];
	}
}


class TestBlock extends BlockWall{
	constructor(X=null,Y=null,Z=null,Ground=false){
		super(X,Y,Z,9,Ground);
		this.index = testStart;
		this.name = 'Test';
		this.objectNumber = 7;
		this.numReturned=1;
		this.desc = 'A test block.'
		this.isCeiling = true;

		this.drawTop = true;
		this.drawLeft = true;
		this.drawRight = true;
		this.drawBack = true;
		this.drawFront = true;
	}

	update(){
		/*
			Determine if this is a ceiling or not.
		*/

		// I.e., -6, -5.
		if(this.posZ >= -4){
			this.isCeiling = false;
		}else{
			var blockLeft = world.getBlockAt(this.posX-1,this.posY,this.posZ)
			var blockRight = world.getBlockAt(this.posX+1,this.posY,this.posZ)
			var blockBehind = world.getBlockAt(this.posX,this.posY+1,this.posZ)
			var blockInfront = world.getBlockAt(this.posX,this.posY-1,this.posZ)
			
			this.drawLeft = (blockLeft==null)
			this.drawRight = (blockRight==null)
			this.drawBack = (blockBehind==null)
			this.drawFront = (blockInfront==null)
		
			if(this.posZ == -6){
				var blockBelow = world.getBlockAt(this.posX,this.posY,this.posZ+1);
				var blockBelowBelow = world.getBlockAt(this.posX,this.posY,this.posZ+2);

				this.isCeiling = true;
				if(blockBelow!=null && blockBelowBelow!=null){
					this.isCeiling = false;
				}
			}
			else if(this.posZ == -5){
				//var blockAbove = 
				if(world.getBlockAt(this.posX,this.posY,this.posZ+1)!=null){
					this.isCeiling = false;
				}else{
					this.isCeiling = true;
				}
			}

		}

	}


	draw(){
		set_mv(this.instanceMat);
	
		//Top
		if(this.drawTop)
			gl.drawArrays(gl.TRIANGLES,this.index+24,6);

		//Left
		if(this.drawLeft)
			gl.drawArrays(gl.TRIANGLES,this.index+30,6);

		//Back
		if(this.drawBack)
			gl.drawArrays(gl.TRIANGLES,this.index+18,6);

		//Front
		if(this.drawFront)
			gl.drawArrays(gl.TRIANGLES,this.index+12,6);

		//Right
		if(this.drawRight)
			gl.drawArrays(gl.TRIANGLES,this.index+6,6);

		//Bottom
		//gl.drawArrays(gl.TRIANGLES,this.index,6);


	}

}

class DirtBlock extends BlockWall{
	/*
		If there's nothing above the dirt block add a collision box.

		Add thingy's for create and destroy for testing.
		Like you should be destroyed when a block is placed over top of you,
		and you should be creating when a block a z=-2 is destroyed.

		(You are created at z = -1)

		Also this makes the collision thing easier, because um if it exists,
		then just make the little collision box above it I guess?
	*/
	constructor(X=null,Y=null,Z=null,Ground=false){
		super(X,Y,Z,1,Ground);
		this.index = dirtStart;
		this.name = 'Dirt';
		this.objectNumber=8;
		this.desc = 'A dirt block.'
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

	destroy(){
		return;
	}

	draw(){
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index+24,6);

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
	sendData(){
		//build_block(this.texture,0.09,0.09);
		build_block(this.texture,0.0,0.0);
	}
	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ-2), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ-2,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
			//return [vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX,this.posY,this.posZ,1))),vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
}

class TeleBlock extends SpecialBlock{
	constructor(X=null,Y=null,Z=null, Scene){
		super(X,Y,Z);
		this.scene = Scene;

		this.used = false;
		this.toDungeon = false;
		this.dungeonNumber = -1;

		if(scene == WORLD_SCENE){
			this.toDungeon = true;
		}
		this.objectNumber = 13;
	}
	sendData(){
		//push_wireframe_indices(vec3(0,0,0),vec3(1,1,1))
	}
	intersect(dir=0){
		if(!this.toDungeon){
			change_scene(this.scene);
			return;
		}

		/*
			We are generating a new dungeon.
		*/
		if(!this.used){
			this.used = true;
			genNewDungeon = true;
			this.dungeonNumber = dungeonList.length;
			change_scene(this.scene);
			return;
		}
		/*
			We are going to an old dungeon.
		*/
		else{
			dungeonNumber = this.dungeonNumber;
			change_scene(this.scene);
			return;
		}
	}
}

/*
	Shifts the model view for fixed views.
*/
/*
	Since there may be multiple shift blocks side by side,
	make sure to have a global cooldown. shiftCoolDown
	is decreased in the render loop.
*/
var shiftCoolDown = 0;
const shiftCoolDownMax = 80;

var shiftTransition = 0;
const shiftTransitionMaxX = 30;
const shiftTransitionMaxY = 30;

var shiftDirection = -1;
var isShifting = false;

class ShiftBlock extends SpecialBlock{
	constructor(X=null,Y=null,Z=null, LR = true){
		super(X,Y,Z);
		this.block;
		this.objectNumber = 512;
		/*
			If leftRight is true, then the hit box is squished on the x-axis, otherwise it's squished on the y-axis.	
		*/
		this.leftRight = LR;
	}
	sendData(){
		//push_wireframe_indices(vec3(0,0,0),vec3(1,1,1))
	}
	returnBounds(){
		//Tighten to midsection
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	draw(){
		if(hitBox){
			set_mv(this.instanceMat);
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
	}
	intersect(dir=0){
		if(shiftCoolDown <= 0){
			isShifting = true;
			shiftDirection = dir;
			shiftCoolDown = shiftCoolDownMax;
			if(dir == RIGHT || dir == LEFT){
				shiftTransition = shiftTransitionMaxX;
			}else{
				shiftTransition = shiftTransitionMaxY;
			}
		}
	}
}

/*
	This runs every frame (in render_data()), if isShifting is true.
	Intersecting with a ShiftBlock will the the flag isShifting to true and will set shiftDirection.
	It is the job of this method to set isShifting to false once the transition is complete.
*/
var testSum = 0;
var testSum2 = 0;
var roomSizeX = 0;
var roomSizeY = 0;
function shiftFixedView(){
	switch(shiftDirection){
		case LEFT:
			//Player walks through on right. (Left side of player hitbox.)
			viewMatrixFixed = mult(viewMatrixFixed,translate(roomSizeX/shiftTransitionMaxX,0,0));
			//testSum += roomSizeX/shiftTransitionMaxX;
			break;
		case RIGHT:
			//Player walks through on left. (Right side of player hitbox.)
			viewMatrixFixed = mult(viewMatrixFixed,translate(-roomSizeX/shiftTransitionMaxX,0,0));
			//testSum += -roomSizeX/shiftTransitionMaxX;
			break;
		case TOP:
			//Player walks through from bottom. (Top side of player hitbox.)
			viewMatrixFixed = mult(viewMatrixFixed, translate(0,-roomSizeY/shiftTransitionMaxY,0));
			//testSum2+= -roomSizeY/shiftTransitionMaxY;
			break;
		case BOTTOM:
			//Player walks through from top. (Bottom side of player hitbox.)
			viewMatrixFixed = mult(viewMatrixFixed, translate(0,roomSizeY/shiftTransitionMaxY,0));
			//testSum2+= roomSizeY/shiftTransitionMaxY;
			break;
	}
	if(shiftTransition <= 0){
		isShifting = false;
		shiftTransition = 1;
		/*
		console.log('Shifted left-right:', testSum)
		console.log('Shifted up-down:', testSum2)
		testSum = 0;
		testSum2 = 0;
		*/
	}
}

class DungeonCeiling extends SpecialBlock{
	/*
		Should allow you to specify how many blocks wide and tall.
		Should take an "activeRoom" argument, to know when to draw opaque
		and when to draw translucent.
		Should only display the bottom portion.
	*/
	constructor(X=null,Y=null,Z=null, xSpan=1,ySpan=1, actRoom = [0,0]){
		super(X,Y,Z);
		this.objectNumber = 513;
		this.index = dungeonCeilingStart;
		this.isCeiling = true;
		this.name = 'Dungeon Ceiling'

		this.xBlocksSpanned = xSpan;
		this.yBlocksSpanned = ySpan;

		//currentRoom= [x,y]
		this.activeRoom = actRoom;
	}
	sendData(){
		block_face( 1, 0, 3, 2, false, vec4(0,0,0,1));
		for(var i =0; i < 6; i++)
			texCoords.push(vec2(2.0,2.0));
		return;
	}
	returnBounds(){
		//Tighten to midsection
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	drawTopBlock(){
		this.draw();
	}
	draw(){
		if(hitBox){
			//set_mv(this.instanceMat);
			//gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		//gl.uniform1f(opacityFactorLoc,-0.3);
		set_mv(mult(this.instanceMat,scale4(this.xBlocksSpanned,this.yBlocksSpanned,1)));
		//if(currentRoom[0] != this.activeRoom[0] || currentRoom[1] != this.activeRoom[1]){
			gl.drawArrays(gl.TRIANGLES,this.index,6);
		//}
		//gl.uniform1f(opacityFactorLoc,0.0);
	}

}

class CursorBlock extends SpecialBlock{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.objectNumber = 515;
	}
	move(X,Y,Z){
		this.instanceMat = translate(X,Y,Z);
	}
}