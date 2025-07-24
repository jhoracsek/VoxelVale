function default_push2(v1, v2, v3, c1=vec4(1,1,1,1),c2=vec4(1,1,1,1),c3=vec4(1,1,1,1)){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c1);
	colours.push(c2);
	colours.push(c3);

    var cross1 = subtract(v2,v1); 
	var cross2 = subtract(v1,v3);
	var norm = cross(cross2, cross1);
	norm = vec3(norm);
	for(var i =0; i < 3; i++)
		normals.push(norm);

    return;
}

function set_texture2(texLoc=0){
	if(texLoc == 16){
		for(var i =0; i < 6; i++)
			texCoords.push(vec2(2.0,2.0));
		return;
	}
	/*
	var s = 8;
	var offsetX = 0.0065;
	var offsetY = 0.0065;
	var xStart = (texLoc%8)+offsetX;
	var yStart = (Math.floor(texLoc/8))+offsetY;
	var xEnd = xStart+1-(2*offsetX);
	var yEnd = yStart+1-(2*offsetY);
	*/

	var row = Math.floor(texLoc%8);
	var col = Math.floor(texLoc/8);

	var xStart = 32 + row*(3*32);
	var xEnd = xStart + 32;
	var yStart = 32 + col*(3*32);
	var yEnd = yStart + 32;

	var s = 1024;

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	

	return;
}

//Unused I think.
class WoodTrunk extends BlockWall{
	constructor(X=null,Y=null,Z=null,Ground=false){
		super(X,Y,Z,5,Ground);
		//----> change this.index = woodStart;
		this.name = 'Wood Trunk';
		this.tob='WOOD';
		this.sound = 'WOOD';
		this.particleColor = vec3(0.337, 0.208, 0.094);
	}
}

class WoodLog extends BlockWall{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,5,false);
		this.index = woodLogStart;
		this.numberOfVerts = 108+24*3;
		this.name = 'Wood Log';
		this.orient = 'ALL'
		this.objectNumber=3;
		this.tob='WOOD';
		this.sound = 'WOOD';
		this.desc = 'A wood log.'
		this.particleColor = vec3(0.337, 0.208, 0.094);
	}
	sendData(){
		draw_wood_log();
	}
	destroy(){
		//console.log(this.posZ);
		super.destroy();
		if(world.getBlockAt(this.posX+1,this.posY,this.posZ) != null)
			if(world.getBlockAt(this.posX+1,this.posY,this.posZ).name=='Wood Branch'){
				//world.removeBlock(new NullifierBlock(this.posX+1,this.posY,this.posZ));
				world.removeBlockByPos(this.posX+1,this.posY,this.posZ);
			}

		if(world.getBlockAt(this.posX-1,this.posY,this.posZ) != null)
			if(world.getBlockAt(this.posX-1,this.posY,this.posZ).name=='Wood Branch'){
				//world.removeBlock(new NullifierBlock(this.posX-1,this.posY,this.posZ));
				world.removeBlockByPos(this.posX-1,this.posY,this.posZ);
			}

		if(world.getBlockAt(this.posX,this.posY+1,this.posZ) != null)
			if(world.getBlockAt(this.posX,this.posY+1,this.posZ).name=='Wood Branch'){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY+1,this.posZ));
				world.removeBlockByPos(this.posX,this.posY+1,this.posZ);
			}

		if(world.getBlockAt(this.posX,this.posY-1,this.posZ) != null)
			if(world.getBlockAt(this.posX,this.posY-1,this.posZ).name=='Wood Branch'){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY-1,this.posZ));
				world.removeBlockByPos(this.posX,this.posY-1,this.posZ);
			}
		if(world.getBlockAt(this.posX,this.posY,this.posZ-1) != null)
			if(world.getBlockAt(this.posX,this.posY,this.posZ-1).name=='Wood Log'){
				//world.removeBlock(new NullifierBlock(this.posX,this.posY,this.posZ-1));
				world.removeBlockByPos(this.posX,this.posY,this.posZ-1);
			}

			
	}
	draw(){
		//CONSIDER SCALING THIS!
		//set_mv(mult(this.instanceMat,scale4(0.95,0.95,1)));
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

var woodBranchNum = 0;
class WoodBranch extends BlockWall {
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,5,false);
		this.index = woodBranchStart;
		this.numberOfVerts = woodBranchNum;
		this.name = 'Wood Branch';
		this.objectNumber=4;
		this.tob='WOOD';
	}

	spawnParticles(){
		return;
	}
	sendData(){
		draw_wood_branch();
	}
	drop(){
		return new WoodLog();
	}
	switchOrientation(){

		var scale= 0.5;
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		
		var bLeft=false;
		var bRight=false;
		var bUp=false;
		var bDown=false;

		if(world.getBlockAt(this.posX-1,this.posY,this.posZ)!=null)
			if(world.getBlockAt(this.posX-1,this.posY,this.posZ).name=='Wood Log')
				bLeft=true;
		if(world.getBlockAt(this.posX+1,this.posY,this.posZ)!=null)
			if(world.getBlockAt(this.posX+1,this.posY,this.posZ).name=='Wood Log')
			bRight=true;
		if(world.getBlockAt(this.posX,this.posY-1,this.posZ)!=null)
			if(world.getBlockAt(this.posX,this.posY-1,this.posZ).name=='Wood Log')
			bDown=true;
		if(world.getBlockAt(this.posX,this.posY+1,this.posZ)!=null)
			if(world.getBlockAt(this.posX,this.posY+1,this.posZ).name=='Wood Log')
			bUp=true;

		this.rot =0;

		if(bLeft)
			this.rot=0;
		if(bRight)
			this.rot=180;
		if(bDown)
			this.rot=90;
		if(bUp)
			this.rot=-90;

		this.instanceMat = mult(this.instanceMat,translate(0.5,0.5,0));
		this.instanceMat = mult(this.instanceMat,rotateZ(this.rot));
		this.instanceMat = mult(this.instanceMat,translate(-0.5,-0.5,0));

		this.instanceMat = mult(this.instanceMat,translate(0,scale/2,0));
		this.instanceMat = mult(this.instanceMat,scale4(0.50,scale,1));
	}
	update(){

		this.switchOrientation();
	}
	draw(){
		//CONSIDER SCALING THIS!
		//Maybe Do softshading?
	//	if(updateUnimportantMethods)
	//		this.switchOrientation();
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

class StoneBlock extends BlockWall{

	static lowerStoneStart = 0;
	static lowerStoneNum = 0;

	static verticeStart = 0;
	static verticeNumber = 0;

	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,25,false);
		this.index = stoneBlockStart;
		this.numberOfVerts = 36;
		this.name = 'Stone';
		this.secondIndex = this.constructor.verticeStart;
		this.orient='NONE';
		this.objectNumber=5;
		this.tob='STONE';
		this.desc = 'A stone block.'

		this.aboveDirt = false;
		if(this.posZ == -2)
			this.aboveDirt = true;
		//this.switchOrientation();
	}
	sendData(){
		//Probably a more efficient way to do this
		this.constructor.verticeStart = vertices.length;
		draw_stone_single();		//INDEX <- stoneBlockStart;
		draw_stone_middle();		//INDEX <- stoneBlockStart+36;
		draw_stone_single_edge();	//INDEX <- stoneBlockStart+36*2;
		draw_stone_corner_edge();	//INDEX <- stoneBlockStart+36*3;
		draw_stone_triple_edge();	//INDEX <- stoneBlockStart+36*4;

		//For level z = -2.
		this.constructor.lowerStoneStart = vertices.length;
		build_block(17,0,0);
		this.constructor.lowerStoneNum = vertices.length - this.constructor.lowerStoneStart;
	}
	switchOrientation(){
		if(this.aboveDirt) return;
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		//this.instanceMat = mult(this.instanceMat,translate(0,0,0.5));

		this.instanceMat = mult(this.instanceMat,translate(0,0,0.25));
		this.instanceMat = mult(this.instanceMat,scale4(1,1,0.75));
		this.rot = 0;
		var bLeft=false;
		var bRight=false;
		var bUp=false;
		var bDown=false;
		
		if(this.posX==null)
			return;

		if(!inDungeon){
			if(world.isSpaceSolid(this.posX-1,this.posY,this.posZ))
				bLeft=true;
			if(world.isSpaceSolid(this.posX+1,this.posY,this.posZ))
				bRight=true;
			if(world.isSpaceSolid(this.posX,this.posY-1,this.posZ))
				bDown=true;
			if(world.isSpaceSolid(this.posX,this.posY+1,this.posZ))
				bUp=true;
		}else if(currentDungeon != null){
			if(currentDungeon.getBlockAt(this.posX-1,this.posY,this.posZ)!=null)
				bLeft=true;
			if(currentDungeon.getBlockAt(this.posX+1,this.posY,this.posZ)!=null)
				bRight=true;
			if(currentDungeon.getBlockAt(this.posX,this.posY-1,this.posZ)!=null)
				bDown=true;
			if(currentDungeon.getBlockAt(this.posX,this.posY+1,this.posZ)!=null)
				bUp=true;
		}
		var switchArr = [bLeft,bRight,bUp,bDown];
		//console.log(switchArr.join())
		switch(switchArr.join()){
			case "false,false,false,false":
				this.index=this.secondIndex;
				break;
			case "true,true,true,true":
				this.index=this.secondIndex+36;
				break;
			case "true,false,false,false":
				this.rot = 90;
				this.index=this.secondIndex+36*4;
				break;
			case "false,true,false,false":
				this.rot = -90;
				this.index=this.secondIndex+36*4;
				break;
			case "false,false,true,false":
				this.index=this.secondIndex+36*4;
				break;
			case "false,false,false,true":
				this.rot = 180;
				this.index=this.secondIndex+36*4;
				break;
			case "true,false,true,false":
				this.rot=0;
				this.index=this.secondIndex+36*3;
				break;
			case "true,false,false,true":
				this.rot=90;
				this.index=this.secondIndex+36*3;
				break;
			case "false,true,true,false":
				this.rot=-90;
				this.index=this.secondIndex+36*3;
				break;
			case "false,true,false,true":
				this.rot=180;
				this.index=this.secondIndex+36*3;
				break;
			case "true,true,true,false":
				this.index = this.secondIndex+36*2;
				break;
			case "true,true,false,true":
				this.rot=180;
				this.index = this.secondIndex+36*2;
				break;
			case "true,false,true,true":
				this.rot=90;
				this.index = this.secondIndex+36*2;
				break;
			case "false,true,true,true":
				this.rot=-90;
				this.index = this.secondIndex+36*2;
				break;


			case "false,false,true,true":
				//this.rot=0;
				this.index=this.secondIndex+36;
				break;
			//This is a case you don't have a model for :(
			case "true,true,false,false":
				//this.rot=0;
				this.index=this.secondIndex+36;
				break;

		}
		this.instanceMat = mult(this.instanceMat,translate(0.5,0.5,0));
		this.instanceMat = mult(this.instanceMat,rotateZ(this.rot));
		this.instanceMat = mult(this.instanceMat,translate(-0.5,-0.5,0));
	}
	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ+0.1), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ+0.1,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
			//return [vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX,this.posY,this.posZ,1))),vec3(mult(translate(player.posX,player.posY,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
	update(){
		this.switchOrientation();
	}
	draw(){
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
		if(!this.aboveDirt){
			gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
		}else{
			//set_mv(mult(this.instanceMat,mult(scale4(1,1,1.1),translate(0,0,-0.05))));
			gl.drawArrays(gl.TRIANGLES,this.constructor.lowerStoneStart, this.constructor.lowerStoneNum);
		}
	}
}

class StoneOre extends StoneBlock{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,25,false);
		this.tex = 0;
		this.index = this.constructor.verticeStart;
		this.secondIndex = this.index;
		this.numberOfVerts = 36;
		this.orient='NONE';
		this.tob='STONE';
	}

	sendData(){
		this.constructor.verticeStart = vertices.length;
		draw_stone_single(this.tex);		//INDEX <- stoneBlockStart;
		draw_stone_middle(this.tex);		//INDEX <- stoneBlockStart+36;
		draw_stone_single_edge(this.tex);	//INDEX <- stoneBlockStart+36*2;
		draw_stone_corner_edge(this.tex);	//INDEX <- stoneBlockStart+36*3;
		draw_stone_triple_edge(this.tex);	//INDEX <- stoneBlockStart+36*4;

		//For level z = -2.
		this.constructor.lowerStoneStart = vertices.length;
		build_block(this.tex,0,0);
		this.constructor.lowerStoneNum = vertices.length - this.constructor.lowerStoneStart;
	}
}

class CopperStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 25;
		this.name = 'Copper Ore';
		this.tob='STONE';
		this.desc = 'A copper ore block.'
		this.objectNumber=16;
	}
	drop(){
		return [new StoneBlock(), new Copper()];
	}
}

class LatkinStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 28;
		this.name = 'Latkin Ore';
		this.tob='STONE';
		this.desc = 'A latkin ore block.'
		this.objectNumber=22;
	}
	drop(){
		if(player.heldObject.toolLevel >= 1){
			return [new StoneBlock(), new Latkin()];
		}else{
			return [new StoneBlock()];	
		}
	}
}

class IllsawStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 29;
		this.name = 'Illsaw Ore';
		this.tob='STONE';
		this.desc = 'A illsaw ore block.'
		this.objectNumber=23;
	}
	drop(){
		if(player.heldObject.toolLevel >= 2){
			return [new StoneBlock(), new Illsaw()];
		}else{
			return [new StoneBlock()];	
		}
	}
}

class PlatinumStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 30;
		this.name = 'Platinum Ore';
		this.tob='STONE';
		this.desc = 'A platinum ore block.'
		this.objectNumber=24;
	}
	drop(){
		if(player.heldObject.toolLevel >= 3){
			return [new StoneBlock(), new Platinum()];
		}else{
			return [new StoneBlock()];	
		}
	}
}

class LuniteStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 26;
		this.name = 'Lunite Ore';
		this.tob='STONE';
		this.desc = 'A lunite ore block.'
		this.objectNumber=20;
	}
	drop(){
		if(player.heldObject.toolLevel >= 4){
			return [new StoneBlock(), new Lunite()];
		}else{
			return [new StoneBlock()];	
		}
	}
}

class DaytumStone extends StoneOre{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.tex = 27;
		this.name = 'Daytum Ore';
		this.tob='STONE';
		this.desc = 'A daytum ore block.'
		this.objectNumber=21;
	}
	drop(){
		if(player.heldObject.toolLevel >= 5){
			return [new StoneBlock(), new Daytum()];
		}else{
			return [new StoneBlock()];	
		}
	}
}




//woodBranchNum
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

//var dS=0.15;
var dS=0.15;
function draw_stone_single(texStone = 17){
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1=vec3(dS,dS,0);
	v2=vec3(1-dS,dS,0);
	v3=vec3(1-dS,1-dS,0);
	v4=vec3(dS,1-dS,0);
	v5=vec3(0,0,1);
	v6=vec3(1,0,1);
	v7=vec3(1,1,1);
	v8=vec3(0,1,1);
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(texStone);
	
	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(texStone);

	default_push2(v6,v2,v1);
	default_push2(v1,v5,v6);
	set_texture2(texStone);
	
	default_push2(v6,v7,v3);
	default_push2(v3,v2,v6);
	set_texture2(texStone);

	default_push2(v3,v7,v8);
	default_push2(v8,v4,v3);
	set_texture2(texStone);

	default_push2(v4,v8,v5);
	default_push2(v5,v1,v4);
	set_texture2(texStone);
}

function draw_stone_middle(texStone = 17){
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1=vec3(0,0,0);
	v2=vec3(1,0,0);
	v3=vec3(1,1,0);
	v4=vec3(0,1,0);
	v5=vec3(0,0,1);
	v6=vec3(1,0,1);
	v7=vec3(1,1,1);
	v8=vec3(0,1,1);
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(texStone);
	
	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(texStone);

	default_push2(v6,v2,v1);
	default_push2(v1,v5,v6);
	set_texture2(texStone);
	
	default_push2(v6,v7,v3);
	default_push2(v3,v2,v6);
	set_texture2(texStone);

	default_push2(v3,v7,v8);
	default_push2(v8,v4,v3);
	set_texture2(texStone);

	default_push2(v4,v8,v5);
	default_push2(v5,v1,v4);
	set_texture2(texStone);
}

function draw_stone_single_edge(texStone = 17){
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1=vec3(0,dS,0);
	v2=vec3(1,dS,0);
	v3=vec3(1,1,0);
	v4=vec3(0,1,0);
	v5=vec3(0,0,1);
	v6=vec3(1,0,1);
	v7=vec3(1,1,1);
	v8=vec3(0,1,1);
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(texStone);
	
	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(texStone);

	default_push2(v6,v2,v1);
	default_push2(v1,v5,v6);
	set_texture2(texStone);
	
	default_push2(v6,v7,v3);
	default_push2(v3,v2,v6);
	set_texture2(texStone);

	default_push2(v3,v7,v8);
	default_push2(v8,v4,v3);
	set_texture2(texStone);

	default_push2(v4,v8,v5);
	default_push2(v5,v1,v4);
	set_texture2(texStone);
}

function draw_stone_corner_edge(texStone = 17){
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1=vec3(0,dS,0);
	v2=vec3(1-dS,dS,0);
	v3=vec3(1-dS,1,0);
	v4=vec3(0,1,0);
	v5=vec3(0,0,1);
	v6=vec3(1,0,1);
	v7=vec3(1,1,1);
	v8=vec3(0,1,1);
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(texStone);
	
	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(texStone);

	default_push2(v6,v2,v1);
	default_push2(v1,v5,v6);
	set_texture2(texStone);
	
	default_push2(v6,v7,v3);
	default_push2(v3,v2,v6);
	set_texture2(texStone);

	default_push2(v3,v7,v8);
	default_push2(v8,v4,v3);
	set_texture2(texStone);

	default_push2(v4,v8,v5);
	default_push2(v5,v1,v4);
	set_texture2(texStone);
}

function draw_stone_triple_edge(texStone = 17){
	var v1,v2,v3,v4,v5,v6,v7,v8;
	v1=vec3(dS,dS,0);
	v2=vec3(1-dS,dS,0);
	v3=vec3(1-dS,1,0);
	v4=vec3(dS,1,0);
	v5=vec3(0,0,1);
	v6=vec3(1,0,1);
	v7=vec3(1,1,1);
	v8=vec3(0,1,1);
	default_push2(v1,v2,v3);
	default_push2(v3,v4,v1);
	set_texture2(texStone);
	
	default_push2(v5,v6,v7);
	default_push2(v7,v8,v5);
	set_texture2(texStone);

	default_push2(v6,v2,v1);
	default_push2(v1,v5,v6);
	set_texture2(texStone);
	
	default_push2(v6,v7,v3);
	default_push2(v3,v2,v6);
	set_texture2(texStone);

	default_push2(v3,v7,v8);
	default_push2(v8,v4,v3);
	set_texture2(texStone);

	default_push2(v4,v8,v5);
	default_push2(v5,v1,v4);
	set_texture2(texStone);
}


function draw_wood_log(){
	//within bounds (0,0,0) <-> (1,1,1)
	var v1=[],v2=[],v3=[],v4=[],v5=[],v6=[],v7=[],v8=[],v9=[],v10=[],v11=[],v12=[],v13=[],v14=[],v15=[],v16=[],v17=[],v18=[],v19=[],v20=[];
	var v=[];
	const textureTop = 3;
	const textureSide = 19;
	const textureSide2 = 11;
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

	//default_push2(v[],v[],v[]);
	//default_push2(v[],v[],v[]);
	//set_texture(0);



}