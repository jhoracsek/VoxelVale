class InteractiveBlock extends BlockWall{
	constructor(X=null,Y=null,Z=null,T,MENUFUNCTION){
		super(X,Y,Z,T,false,'STONE');
		//Might need to fart around with this for a bit to get it working correctly :/
		this.menuFunction = MENUFUNCTION;
	}
	onClick(){
		xCoor=8;
		yCoor=4.5;
		cursorCoor = vec2(xCoor,yCoor);
		inFunction=true;
		fQueue.enqueue(new QueuedFunction(this.menuFunction));
		return;
	}
}

function set_door_texture(texLoc=0, oX=0.0065, oY=0.0065,changeOrder=true){
	var row = Math.floor(texLoc%8);
	var col = Math.floor(texLoc/8);

	let offset=0.0;

	var xStart = 32 + row*(3*32) + offset;
	var xEnd = xStart + 32 - offset;
	var yStart = 32 + col*(3*32) + offset;
	var yEnd = yStart + 32 -offset;


	//var xStart = (texLoc%8)+offsetX;
	//var yStart = (Math.floor(texLoc/8))+offsetY;

	//var xEnd = xStart+1-(2*offsetX);
	//var yEnd = yStart+1-(2*offsetY);

	var s = 1024;

	/*
	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));
	*/

	let vecs;


	if(changeOrder){

		vecs = [vec2(xStart/s,yStart/s), vec2(xEnd/s,yEnd/s), vec2(xStart/s,yEnd/s)];
	
		texCoords.push(vecs[1]);
		texCoords.push(vecs[2]);
		texCoords.push(vecs[0]);

		
		vecs = [vec2(xEnd/s,yStart/s), vec2(xEnd/s,yEnd/s), vec2(xStart/s,yStart/s)];

		texCoords.push(vecs[1]);
		texCoords.push(vecs[2]);
		texCoords.push(vecs[0]);

	}else{
		vecs = [vec2(xStart/s,yStart/s), vec2(xStart/s,yEnd/s), vec2(xEnd/s,yStart/s)];
	
		//change
		texCoords.push(vecs[2]);
		texCoords.push(vecs[0]);
		texCoords.push(vecs[1]);
		vecs = [vec2(xEnd/s,yStart/s), vec2(xStart/s,yEnd/s), vec2(xEnd/s,yEnd/s)];
		

		//change
		texCoords.push(vecs[0]);
		texCoords.push(vecs[1]);
		texCoords.push(vecs[2]);
	}
	return;
}

function build_door(Texture, Texture2, oX=0.0065, oY=0.0065){
	//Bottom
	block_face( 1, 0, 3, 2 );
	set_texture(Texture2,oX,oY);
	
	//Right
	block_face( 2, 3, 7, 6 ,true);
	set_texture(Texture2,oX,oY);
	
	//Front
	block_face( 3, 0, 4, 7,true);
	set_door_texture(Texture,oX,oY);


	//Back
	block_face( 6, 5, 1, 2,true);
	set_door_texture(Texture,oX,oY,false);

	

	//Left
	block_face( 5, 4, 0, 1,true);
	set_texture(Texture2,oX,oY);


	//Top
	block_face( 4, 5, 6, 7,true);
	set_texture(Texture2,oX,oY);
}

class DoorTop{
	constructor(X,Y,Z,bottom){
		this.instanceMat = translate(X,Y,Z);
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.index = 0;
		this.numberOfVerts = 0;
		this.objectNumber = -1;
		this.tob='WOOD';
		this.type = 'SPECIAL_BLOCK';
		this.bottom = bottom;
		this.isTall = false;
		this.isTop = true;
	}
	destroy(){


		//this.spawnParticles();

		//You can just adjust this so it adds a specified drop
		//where the default can be the block unless otherwise
		//specified...
		//player.addToInventory(this.drop());
		world.removeBlock(this.bottom);
		return;
	}
	update(){return;}

	returnPos(){
		return [this.posX,this.posY,this.posZ];
	}

	onClick(){
		//Rotate
		this.bottom.isOpen = !this.bottom.isOpen;
		this.bottom.rotateOpen = 90*this.bottom.isOpen;
		return;
	}
	onHover(){return;}

	returnBounds(){
		//if(fixedView)
		//	return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		//else
		//	return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
		return [vec3(mult(translate(-10000,-10000,-10000),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(-10000,-10000,-10000),vec4(this.posX,this.posY,this.posZ,1)))];
	}
	sendData(){}
	draw(){
		
	}
	intersect(){}
	drawShadows(){}
}

/*
	Double doors!!!
*/

class Door extends BlockWall{
	constructor(X=null,Y=null,Z=null, left = true){
		super(X,Y,Z,1,false);
		this.originalInstanceMat = this.instanceMat;
		if(X!=null){
			//Place top block at -4.
			//CANNOT PLACE DOORS NOT AT LEVEL -3.
			this.top = new DoorTop(X,Y,Z-1,this);
			world.addBlock(this.top);
		}
		//Might need to fart around with this for a bit to get it working correctly :/
		this.isOpen = false;
		this.texture = 0;
		this.index = doorStart;
		this.name = 'Wood Door';
		this.objectNumber = 14;
		this.numReturned=1;
		this.desc = 'A wood door.'
		this.tob='WOOD';
		this.rotateOpen = 0;

		// Based on the position relative to player.
		this.relativeAngle = 0;

		this.setAngle((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5);

		this.orientationAngle = 0;
		this.isTall = true;

		this.isLeft = left;

		//this.doorScale = 0.25;
		this.doorScale = 0.15;

		if(X == null){
			return;
		}

		var leftBlock = world.getBlockAt(X-1,Y,Z);
		var rightBlock = world.getBlockAt(X+1,Y,Z);
		var topBlock = world.getBlockAt(X,Y+1,Z);
		var bottomBlock = world.getBlockAt(X,Y-1,Z);

		var surroundingBlocks = [leftBlock, rightBlock, topBlock, bottomBlock];
		// There is a door to the LEFT, RIGHT, TOP, BOTTOM.
		var doorAt = [false, false, false,false];
		
		//Check all the surronding blocks for doors.
		for(let i = 0; i < 4; i++){
			var tempBlock = surroundingBlocks[i];
			if(tempBlock != null && tempBlock.objectNumber == 14){
				//So we have two adjacent doors.
				doorAt[i] = true;
			}
		}


		//Door on bottom portion of block.
		if(this.relativeAngle > 45 && this.relativeAngle <= 145){
			this.frontOfB();
			// Left and Right
			if(doorAt[0]){
				this.swapAngle();
				leftBlock.frontOfB();
			}
			if(doorAt[1]){
				rightBlock.frontOfB();
				rightBlock.swapAngle();
			}
				
		}

		//Door on right portion of block.
		else if(this.relativeAngle > 145 && this.relativeAngle <= 225){
			this.rightOfB();
			// Top
			if(doorAt[2]){
				topBlock.rightOfB();
				topBlock.swapAngle()
			}
			//Bottom
			if(doorAt[3]){
				bottomBlock.rightOfB();
				this.swapAngle();
			}
		}

		//Door on top portion of block.
		else if(this.relativeAngle > 225 && this.relativeAngle <= 305){
			this.topOfB();
			//Left and Right
			if(doorAt[1]){
				this.swapAngle();
				rightBlock.topOfB();
			}
			if(doorAt[0]){
				leftBlock.topOfB();
				leftBlock.swapAngle();
			}
		}

		//Door on left portion of block.
		else{
			this.leftOfB();
			// Top
			if(doorAt[2]){
				topBlock.leftOfB();
				this.swapAngle()
			}
			//Bottom
			if(doorAt[3]){
				bottomBlock.leftOfB();
				bottomBlock.swapAngle();
			}
		}

		
	}

	frontOfB(){
		this.instanceMat = this.originalInstanceMat;
	}
	rightOfB(){
		this.instanceMat = mult(this.originalInstanceMat, mult(translate(1,0,0),rotateZ(90)));
	}
	topOfB(){
		this.instanceMat = mult(this.originalInstanceMat, mult(translate(1,1,0),rotateZ(180)));
	}
	leftOfB(){
		this.instanceMat = mult(this.originalInstanceMat, mult(translate(0,1,0),rotateZ(270)));
	}



	swapAngle(){
		this.isLeft = false;
		if(!this.isLeft){
			this.instanceMat = mult(this.instanceMat, mult(translate(1,0,0),scale4(-1,1,1)));
		}
	}

	destroy(){


		this.spawnParticles();
		world.removeBlock(this.top);
		//You can just adjust this so it adds a specified drop
		//where the default can be the block unless otherwise
		//specified...
		player.addToInventory(this.drop());


		return;
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
		if(signX == 1 && signY == 1){
			this.relativeAngle = ang;
		}
		//Quadrant 2
		if(signX == -1 && signY == 1){
			this.relativeAngle = (90-ang)+90;
		}
		//Quadrant 3
		if(signX == -1 && signY == -1){
			this.relativeAngle = ang+180;
		}
		//Quadrant 4
		if(signX == 1 && signY == -1){
			this.relativeAngle = (90-ang)+270;
		}

	}
	onClick(){
		//Rotate
		this.isOpen = !this.isOpen;
		this.rotateOpen = 90*this.isOpen;
		return;
	}
	sendData(){
		//Bottom 
		build_door(21,6);
		//Top
		build_door(13, 6);
	}
	returnBounds(){
		//Needs to be rotated I guess... and extended for arrows!

		//if(!this.isOpen)
		//	return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+0.25,this.posZ+1,1)))];
		//return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+0.25,this.posY+1,this.posZ+1,1)))];

		if(!this.isOpen){
			var b1 = mult(this.instanceMat,vec4(0,0,-1,1));
			var b2 = mult(this.instanceMat,vec4(1,this.doorScale,1,1));
			
			var bound1 = vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), Math.min(b1[2],b2[2]),1 );
			var bound2 = vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]), Math.max(b1[2],b2[2]),1 );
	
			return [bound1, bound2];
		}
		var b1 = mult(this.instanceMat,vec4(0,0,-1,1));
		var b2 = mult(this.instanceMat,vec4(this.doorScale,1,1,1));
		
		var bound1 = vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), Math.min(b1[2],b2[2]),1 );
		var bound2 = vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]), Math.max(b1[2],b2[2]),1 );

		return [bound1, bound2];

	}
	draw(){
		var mat;
		if(this.isOpen){
			mat = mult(translate(this.doorScale,0,0),mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1)));
		}else{
			mat = mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1));	
		}
		set_mv(mult(this.instanceMat,mat));
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index,36);
		set_mv(mult(this.instanceMat,mult(translate(0,0,-1),mat)));
		gl.drawArrays(gl.TRIANGLES,this.index+36,36);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
	}
	drawShadows(){
		/*
			Shadows should not be generated below (technically above) the depth z = -0.201. So if z > -0.2 don't generate a shadow.
		*/
		if(this.posZ >= -2){
			return;
		}

		var mat;
		if(this.isOpen){
			mat = mult(translate(this.doorScale,0,0),mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1)));
		}else{
			mat = mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1));	
		}
		/*
			This is the matrix that puts our blocks coordinates into the orthogonal display coordinates (eyespace, or what you see when you hit 'p').
			For instance, if the block is on the ground and in the first quadrant (top right), with respect to the player/light,
			then its position in WebGL coordinates may be like (0.5,0.5,-0.3). As another example, if it's on the ground 
			and in the third quadrant (bottom left), it may be like (-0.6, -0.6, -0.3).

			Essentially, this is the model view matrix for this specific block, which puts it in eye-space (prior to clip space).
		*/
		var thisModelViewMatrix = mult(modelViewMatrix, mult(this.instanceMat,mat));

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

		thisModelViewMatrix = mult(modelViewMatrix, mult(this.instanceMat,mult(translate(0,0,-1),mat)));
		modelViewShadow = mult(sMatrix, thisModelViewMatrix);

		// Set current model view matrix and draw the shadow.
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
	drawSmall(currentMat){
		var mat;
		mat = mult(rotateY(-90), mult(scale4(1,this.doorScale,1),mult(scale4(0.85,0.85,0.85),translate(-this.doorScale,0,-1))));	
		
		currentMat = mult(currentMat,mat);
		
		//Don't draw top!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);

		//Don't draw bottom!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,translate(0,0,-1))));
		gl.drawArrays(gl.TRIANGLES,this.index+36,36);
	}
	drawTransparent(currentMat){

		var mat;
		if(this.isOpen){
			mat = mult(translate(this.doorScale,0,0),mult(rotateY(0), scale4(1,this.doorScale,1)));
		}else{
			mat = mult(rotateZ(0), scale4(1,this.doorScale,1));	
		}

		/*
		if(this.relativeAngle > 45 && this.relativeAngle <= 145){
			this.orientationAngle = 0;
		}else if(this.relativeAngle > 145 && this.relativeAngle <= 225){
			mat = mult(mult(translate(1,0,0),rotateZ(90)),mat);

		}else if(this.relativeAngle > 225 && this.relativeAngle <= 305){
			mat = mult(mult(translate(1,1,0),rotateZ(180)),mat);
		}else{
			mat = mult(mult(translate(0,1,0),rotateZ(270)),mat);
		}
		*/

		currentMat = mult(currentMat,mat);
		
		//Don't draw top!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);

		//Don't draw bottom!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,translate(0,0,-1))));
		gl.drawArrays(gl.TRIANGLES,this.index+36,36);
	}

	drawCursor(currentMat){
		var x = (coorSys[0]+player.posX)-8.5;
		var y = (coorSys[1]+player.posY)-4;



		this.setAngle(x,y);
		
		var mat;
		if(this.isOpen){
			mat = mult(translate(this.doorScale,0,0),mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1)));
		}else{
			mat = mult(rotateZ(this.rotateOpen), scale4(1,this.doorScale,1));	
		}

		if(this.relativeAngle > 45 && this.relativeAngle <= 145){
			this.orientationAngle = 0;
		}else if(this.relativeAngle > 145 && this.relativeAngle <= 225){
			mat = mult(mult(translate(1,0,0),rotateZ(90)),mat);

		}else if(this.relativeAngle > 225 && this.relativeAngle <= 305){
			mat = mult(mult(translate(1,1,0),rotateZ(180)),mat);
		}else{
			mat = mult(mult(translate(0,1,0),rotateZ(270)),mat);
		}


		currentMat = mult(currentMat,mat);
		
		//Don't draw top!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts-6);

		//Don't draw bottom!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,translate(0,0,-1))));
		gl.drawArrays(gl.TRIANGLES,this.index+42,30);
		
		
	}
}

function testFunction(){

	set_light_full();
	if(fixedView)
		set_ui_pv();
	else
		set_ui_pv(translate(-1,-1,0));
	draw_crafting_menu();
	set_light();
	reset_mv();
	reset_pv();
}

class WorkBench extends InteractiveBlock{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,5,testFunction);
		this.index = stoneBlockStart+36;
		this.numberOfVerts = 36;
		this.name = 'Work Bench';
		this.objectNumber=6;
		this.tob='STONE';
		this.desc = 'A work bench for crafting items.'
	}
	draw(){
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		set_mv(mult(this.instanceMat,scale4(1,1,0.5)));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
		set_mv(this.instanceMat);
		var legMV = mult(this.instanceMat,translate(0,0,0.45));
		legMV=mult(legMV,translate(0.05,0.05,0));
		legMV=mult(legMV,scale4(0.2,0.2,0.75));
		set_mv(legMV);
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(3.5,0,0));
		set_mv(legMV);
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(0,3.5,0));
		set_mv(legMV);
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(-3.5,0,0));
		set_mv(legMV);
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
	}
	drawSmall(currentMat){

		currentMat = mult(currentMat,translate(1,0,0) );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),scale4(1,1,0.5)))));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
		
		
		var legMV = translate(0,0,0.45);
		legMV=mult(legMV,translate(0.05,0.05,0));
		legMV=mult(legMV,scale4(0.2,0.2,0.75));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);

		
		legMV=mult(legMV,translate(3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(0,3.5,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(-3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
	
	}

	drawTransparent(currentMat){
		currentMat = mult(currentMat,mult(rotateY(90),translate(0,0,0)) );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),scale4(1,1,0.5)))));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
		
		
		var legMV = translate(0,0,0.45);
		legMV=mult(legMV,translate(0.05,0.05,0));
		legMV=mult(legMV,scale4(0.2,0.2,0.75));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);

		
		legMV=mult(legMV,translate(3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(0,3.5,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
		legMV=mult(legMV,translate(-3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,woodLogStart,108+24*3);
	}

	drawCursor(currentMat){
		this.drawTransparent(currentMat);
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
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);

	}
	drawSmall(){
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
	*/

}
