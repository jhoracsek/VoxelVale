











/*
	Probably can just change to BlockWallNew
*/
class Cactus extends BlockWallNew{

	static objectNumber = 29;
	static name = 'Cactus';
	static index = 0;
	static numberOfVerts = 0;

	static topIndex = 0; get topIndex(){return this.constructor.topIndex;}
	static topNumberOfVerts = 0; get topNumberOfVerts(){return this.constructor.topNumberOfVerts;}

	static topIndex2 = 0; get topIndex2(){return this.constructor.topIndex2;}
	static topNumberOfVerts2 = 0; get topNumberOfVerts2(){return this.constructor.topNumberOfVerts2;}

	static desc = 'A piece of cactus.';
	static tob = 'WOOD';
	static particleColor = vec3(0.3, 0.87, 0.2);
	static sound = 'WOOD';


	static sellPrice = 4;

	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,5,false);

		this.isTopOfCactus = false;
	}

	static sendData(){
		this.index = vertices.length;
		build_cactus();
		this.numberOfVerts = vertices.length - this.index;

		this.topIndex = vertices.length;
		build_block(58,0.0,0.0);
		this.topNumberOfVerts = vertices.length - this.topIndex;

		this.topIndex2 = vertices.length;
		build_block(58,0.0,0.0);
		this.topNumberOfVerts2 = vertices.length - this.topIndex2;
	}

	/*
	returnBounds(){
		let scalingMatrix = mult(translate(0.5,0.5,0),mult(scale4(0.6,0.6,1), translate(-0.5,-0.5,0)));
		if(fixedView)
			return [mult(vec3(this.posX,this.posY,this.posZ),scalingMatrix), mult(vec3(this.posX+1,this.posY+1,this.posZ+1),scalingMatrix)];
		else
			return [vec3(mult(vec4(this.posX,this.posY,this.posZ,1),scalingMatrix)), vec3(mult(vec4(this.posX+1,this.posY+1,this.posZ+1,1),scalingMatrix)) ];
			//return [vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX,this.posY,this.posZ,1))),vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	*/

	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX+0.2,this.posY+0.2,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+0.8,this.posY+0.8,this.posZ+1,1)))];
	}
	destroy(){
		//console.log(this.posZ);
		super.destroy();
		if(world.getBlockAt(this.posX+1,this.posY,this.posZ) != null)
			if(world.getBlockAt(this.posX+1,this.posY,this.posZ).objectNumber==30){
				//world.removeBlock(new NullifierBlock(this.posX+1,this.posY,this.posZ));
				world.removeBlockByPos(this.posX+1,this.posY,this.posZ);
			}

		if(world.getBlockAt(this.posX-1,this.posY,this.posZ) != null)
			if(world.getBlockAt(this.posX-1,this.posY,this.posZ).objectNumber==30){
				//world.removeBlock(new NullifierBlock(this.posX-1,this.posY,this.posZ));
				world.removeBlockByPos(this.posX-1,this.posY,this.posZ);
			}

		if(world.getBlockAt(this.posX,this.posY+1,this.posZ) != null)
			if(world.getBlockAt(this.posX,this.posY+1,this.posZ).objectNumber==30){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY+1,this.posZ));
				world.removeBlockByPos(this.posX,this.posY+1,this.posZ);
			}

		if(world.getBlockAt(this.posX,this.posY-1,this.posZ) != null)
			if(world.getBlockAt(this.posX,this.posY-1,this.posZ).objectNumber==30){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY-1,this.posZ));
				world.removeBlockByPos(this.posX,this.posY-1,this.posZ);
			}
		if(world.getBlockAt(this.posX,this.posY,this.posZ-1) != null)
			if(world.getBlockAt(this.posX,this.posY,this.posZ-1).objectNumber==29){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY,this.posZ-1));
				world.removeBlockByPos(this.posX,this.posY,this.posZ-1);
			}

			
	}
	draw(){
		//CONSIDER SCALING THIS!
		let scalingMatrix = mult(translate(0.5,0.5,0),mult(scale4(0.6,0.6,1), translate(-0.5,-0.5,0)));
		set_mv(mult(this.instanceMat,scalingMatrix));
		//set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);

		if(this.isTopOfCactus){

			//Middle portion
			scalingMatrix = mult(translate(0.5,0.5,-0.1),mult(scale4(0.4,0.4,0.1), translate(-0.5,-0.5,0)));
			set_mv(mult(this.instanceMat,scalingMatrix));
			gl.drawArrays(gl.TRIANGLES,this.topIndex,this.topNumberOfVerts);



			/*
				Four edges
			*/
			scalingMatrix = mult(translate(0.5,0.5+0.2,-0.05),mult(scale4(0.4,0.1,0.1), translate(-0.5,-0.5,-0.1)));
			set_mv(mult(this.instanceMat,scalingMatrix));
			gl.drawArrays(gl.TRIANGLES,this.topIndex2,this.topNumberOfVerts2);

			scalingMatrix = mult(translate(0.5,0.5-0.2,-0.05),mult(scale4(0.4,0.1,0.1), translate(-0.5,-0.5,-0.1)));
			set_mv(mult(this.instanceMat,scalingMatrix));
			gl.drawArrays(gl.TRIANGLES,this.topIndex2,this.topNumberOfVerts2);

			scalingMatrix = mult(translate(0.5-0.2,0.5,-0.05),mult(scale4(0.1,0.4,0.1), translate(-0.5,-0.5,-0.1)));
			set_mv(mult(this.instanceMat,scalingMatrix));
			gl.drawArrays(gl.TRIANGLES,this.topIndex2,this.topNumberOfVerts2);

			scalingMatrix = mult(translate(0.5+0.2,0.5,-0.05),mult(scale4(0.1,0.4,0.1), translate(-0.5,-0.5,-0.1)));
			set_mv(mult(this.instanceMat,scalingMatrix));
			gl.drawArrays(gl.TRIANGLES,this.topIndex2,this.topNumberOfVerts2);
		}
	}

	drawSmall(currentMat){
		let scalingMatrix = mult(translate(0.5,0.5,0),mult(scale4(0.6,0.6,1), translate(-0.5,-0.5,0)));

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,scalingMatrix)));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}

	drawTransparent(currentMat){
		this.drawSmall(currentMat);
	}

	drawCursor(currentMat){
		this.drawSmall(currentMat);	
	}


	drawShadows(){

		if(this.posZ >= -2){
			return;
		}

		let scalingMatrix = mult(translate(0.5,0.5,0),mult(scale4(0.6,0.6,1), translate(-0.5,-0.5,0)));
		let updatedInstanceMat = mult(this.instanceMat,scalingMatrix);

		var thisModelViewMatrix = mult(modelViewMatrix, updatedInstanceMat);
		var modelViewShadow = mult(sMatrix, thisModelViewMatrix);

		// Set current model view matrix and draw the shadow.
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	
	}
}


class CactusArm extends BlockWallNew {
	static objectNumber = 30;
	static name = 'Cactus Arm';
	static index = 0;
	static numberOfVerts = 0;

	static topIndex = 0; get topIndex(){return this.constructor.topIndex;}
	static topNumberOfVerts = 0; get topNumberOfVerts(){return this.constructor.topNumberOfVerts;}

	static desc = 'A cactus arm.';
	static tob = 'WOOD';
	static particleColor = vec3(0.3, 0.87, 0.2);
	static sound = 'WOOD';

	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,5,false);
		this.instanceMat2 = mat4();
		this.rot =0;
	}

	spawnParticles(){
		return;
	}
	
	static sendData(){
		this.index = vertices.length;
		build_block(58,0.0,0.0);
		this.numberOfVerts = vertices.length - this.index;


		this.topIndex = vertices.length;
		build_block(50,0.0,0.0);
		this.topNumberOfVerts = vertices.length - this.topIndex;

		//this.topIndex = vertices.length;
		//build_block(2,0.0,0.0);
		//this.topNumberOfVerts = vertices.length - this.topIndex;
	}
	drop(){
		return new Cactus();
	}

	returnBounds(){
		


		let boundMat = translate(0.5,0.5,0);
		boundMat = mult(boundMat,rotateZ(this.rot));
		boundMat = mult(boundMat,translate(-0.5,-0.5,0));

		let pushIn = 0.2
		var scale= 0.25;

		boundMat = mult(boundMat,translate(-0.4-pushIn,0.25+0.125,0));
		boundMat = mult(boundMat,scale4(0.80,scale,scale));

		boundMat = mult(translate(this.posX, this.posY,this.posZ), boundMat);


		let v1 = mult(boundMat,vec4(0,0,0,1));
		let v2 = mult(boundMat,vec4(1,1,1,1));

		let b1 = vec3(Math.min(v1[0],v2[0]), Math.min(v1[1],v2[1]), Math.min(v1[2],v2[2]));
		let b2 = vec3(Math.max(v1[0],v2[0]), Math.max(v1[1],v2[1]), Math.max(v1[2],v2[2]));

		//console.log(v1,v2)

		return [b1,b2];

		/*
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX+0.2,this.posY+0.2,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+0.8,this.posY+0.8,this.posZ+1,1)))];
		*/
	}

	switchOrientation(){

		var scale= 0.25;
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		
		var bLeft=false;
		var bRight=false;
		var bUp=false;
		var bDown=false;

		if(world.getBlockAt(this.posX-1,this.posY,this.posZ)!=null)
			if(world.getBlockAt(this.posX-1,this.posY,this.posZ).objectNumber == 29)
				bLeft=true;
		if(world.getBlockAt(this.posX+1,this.posY,this.posZ)!=null)
			if(world.getBlockAt(this.posX+1,this.posY,this.posZ).objectNumber == 29)
				bRight=true;
		if(world.getBlockAt(this.posX,this.posY-1,this.posZ)!=null)
			if(world.getBlockAt(this.posX,this.posY-1,this.posZ).objectNumber == 29)
				bDown=true;
		if(world.getBlockAt(this.posX,this.posY+1,this.posZ)!=null)
			if(world.getBlockAt(this.posX,this.posY+1,this.posZ).objectNumber == 29)
				bUp=true;

		this.rot =0;


		if(bLeft){
			this.rot=0;
		}
		if(bRight){
			this.rot=180;
		}
		if(bDown){
			this.rot=90;
		}
		if(bUp){
			this.rot=-90;
		}

		this.instanceMat = mult(this.instanceMat,translate(0.5,0.5,0));
		this.instanceMat = mult(this.instanceMat,rotateZ(this.rot));
		this.instanceMat = mult(this.instanceMat,translate(-0.5,-0.5,0));

		//this.instanceMat2 = mult(this.instanceMat,translate(-0.4,0.25+0.125,0));

		let pushIn = 0.1

		this.instanceMat2 = mult(this.instanceMat,translate(0.15-pushIn,0.25+0.125,-0.4));
		
		this.instanceMat = mult(this.instanceMat,translate(-0.4-pushIn,0.25+0.125,0));


		this.instanceMat2 = mult(this.instanceMat2,scale4(scale,scale,0.4));
		this.instanceMat = mult(this.instanceMat,scale4(0.80,scale,scale));
		
	}
	update(){
		this.switchOrientation();
	}
	draw(){
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
		set_mv(this.instanceMat2);
		gl.drawArrays(gl.TRIANGLES,this.topIndex,this.topNumberOfVerts);

	}
}


function build_cactus(){
	//within bounds (0,0,0) <-> (1,1,1)
	// 42 top
	// 50
	// 58
	var v1=[],v2=[],v3=[],v4=[],v5=[],v6=[],v7=[],v8=[],v9=[],v10=[],v11=[],v12=[],v13=[],v14=[],v15=[],v16=[],v17=[],v18=[],v19=[],v20=[];
	var v=[];
	const textureTop = 42;
	const textureSide = 58;
	const textureSide2 = 50;
	//const textureSide = 46;
	//const textureSide2 = textureSide-8;
	for(var i = 0; i < 2; i++){
		//BottomLeft
		v1[i] = vec3(0.1,0.1, i);
		v2[i] = vec3(0  ,0.2, i);
		v3[i] = vec3(0.2,0  , i);
		//Extra2
		v13[i] = vec3(0.1,0.2,i);
		v14[i] = vec3(0.2,0.1,i);

		//TopLeft
		v4[i] = vec3(0.1,0.9, i);
		v5[i] = vec3(0  ,0.8, i);
		v6[i] = vec3(0.2,1  , i);
		//Extra2
		v15[i] = vec3(0.1,0.8,i);
		v16[i] = vec3(0.2,0.9,i);

		//BottomRight
		v7[i] = vec3(0.9,0.1, i);
		v8[i] = vec3(1  ,0.2, i);
		v9[i] = vec3(0.8,0  , i);
		//Extra2
		v17[i] = vec3(0.8,0.1,i);
		v18[i] = vec3(0.9,0.2,i);

		//TopRight
		v10[i] = vec3(0.9,0.9, i);
		v11[i] = vec3(1  ,0.8, i);
		v12[i] = vec3(0.8,1  , i);
		//Extra2
		v19[i] = vec3(0.9,0.8,i);
		v20[i] = vec3(0.8,0.9,i);

		default_push2(v1[i],v7[i],v10[i]);
		default_push2(v10[i],v4[i],v1[i]);
		//This is top
		set_texture2(textureTop);

		default_push2(v13[i],v15[i],v5[i]);
		default_push2(v5[i],v2[i],v13[i]);
		set_texture(textureSide);

		default_push2(v3[i],v9[i],v17[i]);
		default_push2(v17[i],v14[i],v3[i]);
		set_texture(textureSide);

		default_push2(v8[i],v11[i],v19[i]);
		default_push2(v19[i],v18[i],v8[i]);
		set_texture(textureSide);

		default_push2(v20[i],v12[i],v6[i]);
		default_push2(v6[i],v16[i],v20[i]);
		set_texture(textureSide);
	}
	//Front Face
	default_push2(v3[0],v3[1],v9[0]);
	default_push2(v3[1],v9[1],v9[0]);
	set_texture(textureSide);

	//Right Face
	default_push2(v8[0],v8[1],v11[1]);
	default_push2(v8[0],v11[1],v11[0]);
	set_texture(textureSide);

	//Back Face
	default_push2(v6[1],v6[0],v12[0]);
	default_push2(v6[1],v12[0],v12[1]);
	set_texture(textureSide);

	//Left Face
	default_push2(v5[0],v5[1],v2[0]);
	default_push2(v5[1],v2[1],v2[0]);
	set_texture(textureSide);

	//BOTTOM LEFT (good)
	default_push2(v3[0],v14[0],v14[1]);
	default_push2(v14[1],v3[1],v3[0]);
	set_texture(textureSide);

	//Good
	default_push2(v14[0],v1[0],v1[1]);
	default_push2(v1[1],v14[1],v14[0]);
	set_texture(textureSide);

	//Good
	default_push2(v1[0],v13[0],v13[1]);
	default_push2(v13[1],v1[1],v1[0]);
	set_texture(textureSide);

	//GOOD
	default_push2(v13[0],v2[0],v13[1]);
	default_push2(v2[1],v13[1],v2[0]);
	set_texture(textureSide);

	//BOTTOM RIGHT +24
	default_push2(v17[0],v9[0],v9[1]);
	default_push2(v9[1],v17[1],v17[0]);
	set_texture(textureSide);

	default_push2(v7[0],v17[0],v17[1]);
	default_push2(v17[1],v7[1],v7[0]);
	set_texture(textureSide);

	default_push2(v18[0],v7[0],v7[1]);
	default_push2(v7[1],v18[1],v18[0]);
	set_texture(textureSide);

	default_push2(v8[0],v18[0],v18[1]);
	default_push2(v18[1],v8[1],v8[0]);
	set_texture(textureSide);

	//TOP RIGHT + 24
	default_push2(v19[0],v11[0],v11[1]);
	default_push2(v11[1],v19[1],v19[0]);
	set_texture(textureSide);

	default_push2(v10[0],v19[0],v19[1]);
	default_push2(v19[1],v10[1],v10[0]);
	set_texture(textureSide);

	default_push2(v20[0],v10[0],v10[1]);
	default_push2(v10[1],v20[1],v20[0]);
	set_texture(textureSide);

	default_push2(v12[0],v20[0],v20[1]);
	default_push2(v20[1],v12[1],v12[0]);
	set_texture(textureSide);

	//TOP LEFT + 24
	default_push2(v16[0],v6[0],v6[1]);
	default_push2(v6[1],v16[1],v16[0]);
	set_texture(textureSide);

	default_push2(v4[0],v16[0],v16[1]);
	default_push2(v16[1],v4[1],v4[0]);
	set_texture(textureSide);

	default_push2(v15[0],v4[0],v4[1]);
	default_push2(v4[1],v15[1],v15[0]);
	set_texture(textureSide);

	default_push2(v5[0],v15[0],v15[1]);
	default_push2(v15[1],v5[1],v5[0]);
	set_texture(textureSide);
}

function draw_wood_branch(){
	woodBranchNum=36;
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1 = vec3(0,0,0);
	v2 = vec3(1,0,0);
	v3 = vec3(1,1,0);
	v4 = vec3(0,1,0);
	var d=0.75;
	v5 = vec3(0,0,1);
	v6 = vec3(1-d,0,1);
	v7 = vec3(1-d,1,1);
	v8 = vec3(0,1,1);
	const textureSide1 = 19;
	const textureSide2 = 19;
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(textureSide1);

	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(textureSide1);

	default_push2(v5,v6,v2);
	default_push2(v2,v1,v5);
	set_texture2(textureSide2);

	default_push2(v1,v4,v8);
	default_push2(v8,v5,v1);
	set_texture2(textureSide2);

	default_push2(v4,v3,v7);
	default_push2(v7,v8,v4);
	set_texture2(textureSide2);

	default_push2(v2,v6,v7);
	default_push2(v7,v3,v2);
	set_texture2(textureSide2);
}