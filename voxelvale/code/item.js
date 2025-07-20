
class Item extends zObject{
	constructor(X,Y,Z,RendFunc){
		super();
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
		this.renderFunction = RendFunc;
		this.index;
		this.numberOfVerts;
		this.name = 'NULL';
		this.objectNumber=null;
		this.desc = 'NO DESCRIPTION';
		this.type = 'DEFAULT_ITEM';
		this.typeOfObj = 'ITEM';
		this.toolType = 'NONE';
	}
	sendData(){
		this.renderFunction();
	}
	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
	draw(){
		set_mv(this.instanceMat);
		gl.drawArrays(gl.TRIANGLES,this.index,this.numVerts());
	}
}

//Abstract Item, not to be used
class Tool extends Item{
	constructor(X,Y,Z,RendFunc,Strength){
		super(X,Y,Z,RendFunc);
		this.strength= Strength;
		this.type='TOOL'
		this.toolType='NONE';
	}
}

class WoodAxe extends Tool{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_axe,1);
		this.index=axeStart;
		this.numberOfVerts=axeVerts;
		this.toolType = 'AXE';
		this.name='Stone Axe';
		this.desc='A standard stone axe for chopping wood.';
		this.objectNumber=64;
	}
}

class StonePickaxe extends Tool{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_pickaxe,1);
		this.index=pickaxeStart;
		this.numberOfVerts=pickaxeVerts;
		this.toolType = 'PICK_AXE';
		this.name='Stone Pickaxe';
		this.desc='A standard stone pickaxe for mining.';
		this.objectNumber=65;
	}
}

class CopperPickaxe extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_pickaxe,1.2);
		
		this.toolType = 'PICK_AXE';
		this.name='Copper Pickaxe';
		this.desc='A copper pickaxe for mining.';
		this.objectNumber=70;
		//this.renderArgs = hexToRgbA('#FF0000');
	}

	sendData(){
		this.renderFunction(hexToRgbA('#e55f28'));
	}

}

class CopperAxe extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_axe,1.2);
		this.toolType = 'AXE';
		this.name='Copper Axe';
		this.desc='A copper axe for chopping wood.';
		this.objectNumber=71;
	}
	sendData(){
		this.renderFunction(hexToRgbA('#e55f28'));
	}
}


/*
	This is an abstract type.

	The sole super argument is strength which defines how much damage the sword does.
*/
class Sword extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	static wireframeIndexStart = 0;
	static wireframeNumber = 0;
	static bounds = [vec4(-0.25,-0.25,-0.25,1),vec4(0.25,0.25,0.25,1)]; get bounds() {return this.constructor.bounds;}
	static color = vec4(0.5,0.5,0.5,1); get color() {return this.constructor.color;}

	constructor(strength){
		super(null,null,null,null,strength);
		this.toolType = 'SWORD';
		this.currentHeldMatrix = mat4();
	}

	static sendData(){
		this.index = vertices.length;
		build_sword(this.color);
		this.numberOfVerts = vertices.length - this.index;

		this.wireframeIndexStart = vertices.length;
		push_wireframe_indices(this.bounds[0],this.bounds[1]);
		this.wireframeNumber = vertices.length - this.wireframeIndexStart;
	}



	checkCollisions(){
		if(enemyArray.isEmpty() || !player.attackHitBox)
			return;
		for(var i=0;i<enemyArray.getLength();i++){
			let cols = colDirection(this,enemyArray.accessElement(i).hitHurtBox);
			if(cols[0]||cols[1]||cols[2]||cols[3]){
				//SPAWN PARTICLES
				//this.particleColor = vec3(0.3, 0, 0);
				//this.destroy();
				let attackedEnemy = enemyArray.accessElement(i);
				if(attackedEnemy.invulnerable <= 0)
					attackedEnemy.spawnParticles(); 
				attackedEnemy.hit(180-angleFacing, this.strength);
				
			
			}
		}
	}

	/*
		Updates when the object is held.
	*/
	updateWhenHeld(currentMat){
		this.currentHeldMatrix = currentMat;
		this.checkCollisions();
	}

	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}

	returnBounds(){

		var curPos = translate(player.posX,player.posY,player.posZ);
		curPos = mult(curPos,rotateZ(-angleFacing))
		curPos = mult(curPos, translate(0,0,-3.5));
		curPos = mult(curPos,rotateX(armAngleRightSwing))
		curPos = mult(curPos, translate(0.375,-1.25,0));
		curPos = mult(curPos,rotateX(-armAngleRightSwing))
		curPos = mult(curPos,rotateZ(angleFacing))

		let b1 = mult(curPos, Sword.bounds[0])
		let b2 =  mult(curPos, Sword.bounds[1])

		return [vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]),-10,1),vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]),10,1)];
	}


	drawTransparent(currentMat){
		this.drawSmall(currentMat);
		if(hitBox && player.attackHitBox){
			let curPos = scale4(0.125,(1/4.5),0.1);

			curPos = mult(curPos,rotateZ(-angleFacing))
			curPos = mult(curPos, translate(0,0,-3));
			curPos = mult(curPos,rotateX(armAngleRightSwing))
			curPos = mult(curPos, translate(0.375,-1.25,0));
			curPos = mult(curPos,rotateX(-armAngleRightSwing))
			curPos = mult(curPos,rotateZ(angleFacing))
		
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(curPos));
			gl.drawArrays(gl.LINES,this.constructor.wireframeIndexStart,this.constructor.wireframeNumber);
		}
	}

	draw(){
		this.update();
		set_mv(this.instanceMat);
	}
}

class StoneSword extends Sword{
	static color = vec4(0.5,0.5,0.5,1);
	constructor(){
		super(1);
		this.name='Stone Sword';
		this.desc='A stone sword for attacking enemies.';
		this.objectNumber=73;
	}
}

class CopperSword extends Sword{
	static color = hexToRgbA('#e55f28');
	constructor(){
		super(1.5);
		this.name='Copper Sword';
		this.desc='A copper sword for attacking enemies.';
		this.objectNumber=74;
	}
}



//Abstract Item, not to be used
class Weapon extends Item{
	constructor(X,Y,Z,RendFunc,Strength){
		super(X,Y,Z,RendFunc);
		this.strength= Strength;
		this.type='WEAPON'
	}
}

class WoodenBow extends Weapon{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_bow,1);
		this.index=bowStart;
		this.numberOfVerts=bowVerts;
		this.weaponType = 'BOW';
		this.name='Wooden Bow';
		this.desc='A wooden bow.';
		this.actionType='SHOOT';
		this.objectNumber=66;	

		this.cooldown = 10;
	}
	onLClick(){
		if(projectileCooldown <= 0){
			if(player.getArrowCount() > 0 && shootingCooldown >= shootingCooldownStart) {
				projectileArray.push(new Arrow(cursorDirection,cursorPower,player.posX,player.posY,-4));
				player.removeArrowFromShoot();
				sound_ArrowShoot();
			}
			return true;
		}
		return false;
	}
	onHold(){
		blockCursor=false;
	}
	onRelease(){
		blockCursor=true;
	}
}


class Bucket extends Item{
	static color = vec4(0.5,0.5,0.5,1); get color() {return this.constructor.color;}

	static bucketStart = 0;
	static bucketNumber = 0;

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static waterStart = 0;
	static waterNumber = 0;

	constructor(Capacity){
		super(null,null,null,build_axe);
		this.strength= -1;
		this.capacity = Capacity;
		this.type='TOOL'
		this.actionType='SLURP';
		this.toolType='BUCKET';
		this.weaponType = 'NONE';
		this.unitsOfWater = 4;

		this.desc2 = '';
	}


	static sendData(){
		this.bucketStart = vertices.length;
		/*
			MAKE INSIDE BLACK!!!!
		*/
		build_bucket(hexToRgbA('#784f07'));
		this.bucketNumber = vertices.length - this.bucketStart;

		this.index = this.bucketStart;
		this.numberOfVerts = this.bucketNumber;

		this.waterStart = vertices.length;
		build_bucket_water();
		this.waterNumber = vertices.length-this.waterStart;

		//this.wireframeIndexStart = vertices.length;
		//push_wireframe_indices(this.bounds[0],this.bounds[1]);
		//this.wireframeNumber = vertices.length - this.wireframeIndexStart;
	}

	drawWaterInBucket(currentMat){
		this.desc2 = 'Amount held: ('+(Math.round(this.unitsOfWater * 100) / 100).toString()+'/'+this.capacity.toString()+').'
		if(this.unitsOfWater <= 0.5){
			return;
		}else if(this.unitsOfWater == 1){
			currentMat = mult(currentMat, translate(0,0,0.23));
		}else if(this.unitsOfWater <= this.capacity/2){
			//Draw a little.
			currentMat = mult(currentMat, translate(0,0,0.2));
		}else if(this.unitsOfWater < this.capacity){
			currentMat = mult(currentMat, translate(0,0,0.1));
		}

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.constructor.waterStart,this.constructor.waterNumber);

		return;
	}

	drawToolbar(currentMat){
		currentMat = mult(currentMat, rotateZ(35));

		currentMat = mult(currentMat, rotateX(90));
		currentMat = mult(currentMat, rotateZ(-35));
		currentMat = mult(currentMat, rotateY(-35));

		currentMat = mult(currentMat, translate(1,0,0));
		currentMat = mult(translate(0.01,0.075,0.01),currentMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.constructor.bucketStart,this.constructor.bucketNumber);
		this.drawWaterInBucket(currentMat);
		/*
			Draw water if sufficiently full.
			Maybe make back vertices dark?
			or just draw dark panel on the back?
		*/


		/*
			DRAW THE LITTLE WATER FILL METER HERE :) SHOULD BE SIMPLE ENOUGH.
		*/
		let startX = 1.9;
		let startY = 8.1;
		draw_arb_bar(startX,startY , startX+0.4, startY+.05, this.unitsOfWater, this.capacity, 40,0.7,2)
	}

	drawSmall(currentMat){

		//Within inventory.

		//currentMat = mult(currentMat, rotateX(45));
		//currentMat = mult(currentMat, rotateY(45+90));
		currentMat = mult(currentMat, rotateZ(35));

		currentMat = mult(currentMat, rotateX(90));
		currentMat = mult(currentMat, rotateZ(-35));
		currentMat = mult(currentMat, rotateY(-35));

		currentMat = mult(currentMat, translate(1,0,0));
		currentMat = mult(translate(0.0125,0.1225,0),currentMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.constructor.bucketStart,this.constructor.bucketNumber);
		this.drawWaterInBucket(currentMat);
	}

	drawTransparent(currentMat){
		let scale = 0.87;

		
		//currentMat = mult(currentMat, translate(0,-0.9,0.2));
		currentMat = mult(currentMat, rotateZ(35));

		currentMat = mult(currentMat, rotateX(90));
		currentMat = mult(currentMat, rotateZ(-90));
		//currentMat = mult(currentMat, rotateY(-35));
		currentMat = mult(currentMat, scale4(scale,scale,0.6));
		currentMat = mult(currentMat, translate(-0.1,0.24,0.3));
		//currentMat = mult(currentMat, translate(1,0,0));
		//currentMat = mult(translate(0.0125,0.1225,0),currentMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.constructor.bucketStart,this.constructor.bucketNumber);
		this.drawWaterInBucket(currentMat);
	}
	onLClick(){
		/*
			This can reduce unitsOfWater to below 0.

			Take the min of 1, this.unitsOfWater.
		*/

		if(fastMode){
			world.addWater( Math.round((coorSys[0]+player.posX)-9), Math.round((coorSys[1]+player.posY)-4.5), upOne, null, 1)
		}
		else if((selectedBlock == null || selectedBlock.isFluid) && this.unitsOfWater > 0 && upOne == -2){
			let toAdd = Math.min(this.unitsOfWater,1);
			if(toAdd > 0.000001){
				this.unitsOfWater-=toAdd;
				world.addWater( Math.round((coorSys[0]+player.posX)-9), Math.round((coorSys[1]+player.posY)-4.5), upOne, null, toAdd);
			}
		}
	}
}


class WoodenBucket extends Bucket{
	constructor(X=null,Y=null,Z=null){
		super(4);
		
		this.name='Wooden Bucket';
		this.desc='A wooden bucket to hold water.';

		this.objectNumber=75;
	}

	/*
		Should check the level.
	*/

	onHold(){
		//blockCursor=false;
	}
	onRelease(){
		//blockCursor=true;
	}
} 

var bowVectorVertices=0;
function make_bow_vector(){
	var v1,v2,v3,v4,v5;
	var c = vec4(0.75,0.85,0.8,1);
	var squareLength = 0.2;
	v1=vec3(-0.2,-0.2,-squareLength);

	v2=vec3(0,1,0); //0.5
	
	v3=vec3(0.2,-0.2,-squareLength);
	
	

	v4=vec3(-0.2,-0.2,squareLength);
	v5=vec3(0.2,-0.2,squareLength);
	
	//Top
	bowVectorVertices+=bow_vector_push(v1,v3,v2,c);
	//Bottom
	bowVectorVertices+=bow_vector_push(v4,v2,v5,c);

	//Square (back)
	bowVectorVertices+=bow_vector_push(v1,v3,v4,c);
	bowVectorVertices+=bow_vector_push(v4,v3,v5,c);

	//Right
	bowVectorVertices+=bow_vector_push(v1,v2,v4,c);

	//Left
	bowVectorVertices+=bow_vector_push(v2,v3,v5,c);

	return 3;
}

function bow_vector_push(v1, v2, v3, c=vec4(1,1,1,1)){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c);
	colours.push(c);
	colours.push(c);

    var cross1 = subtract(v2,v1); 
	var cross2 = subtract(v3,v1);
	var norm =(normalize(cross(cross1, cross2)));
	norm = vec3(norm);
	for(var i =0; i < 3; i++){
		normals.push(norm);
		texCoords.push(vec2(2.0,2.0));
	}
    return 3;
}

function ui_push_example(v1 ,v2, v3, c1=vec4(1,0,0,1), c2=c1, c3=c1){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c1);
	colours.push(c2);
	colours.push(c3);

	for(var i =0; i < 3; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
	return 3;
}
function polarToCartesian(magnitude,angle){
    return [-magnitude*Math.sin(angle),magnitude*Math.cos(angle)]
}
function toRad(angle){
	return angle*(Math.PI/180);
}
//bowVectorStart
var cursorDirection;
var cursorPower;
var bowVectorRotate = 0;
/*
	MAKE IT ROTATE!!!


	June 27th.

	So I want to make it a fixed 'circle' around the player.
	(Should vary a tiny bit though.)
*/
function draw_bow_vector(X=0,Y=0,Z=0){

	//set_mv(translate(X-0.5,Y-0.5,Z));
	var opp = cursorCoordinates[1]-(player.posY-0.5);
	var adj = cursorCoordinates[0]-(player.posX-0.5);

	//var opp = X;
	//var adj = Y;

	var theta = Math.atan(opp/adj);
	
	var rotMV;
	if(adj<0)
		cursorDirection = 90+(theta*180)/Math.PI;
	else
		cursorDirection = 270+(theta*180)/Math.PI;
	

	rotMV=rotateZ(cursorDirection);

	
	var magnitude;
	magnitude = 1.3*Math.sqrt(opp*opp+adj*adj);
	//magnitude = magnitude/2.83; //2*sqrt(2)
	
	magnitude = Math.min(magnitude,2.5);

	cursorPower = magnitude/2.83;
	cursorPower = Math.max(0.4, cursorPower);
	//magnitude = Math.max(0.5, magnitude);
	

	
	/*
		Need to kind of limit X,Y.
	
		We convert our polar coordinates, e.g., cursorDirection and magnitude
		to cartesian coordinates.
				 
				 0 (2pi)
				 /\
				 |
				 |
   90 (pi/2)<----------> 270 (3pi/2)
				 |
				 |
				 \/
				180 (pi)
	*/
	
	var drawPosition = polarToCartesian(magnitude,toRad(cursorDirection));
	//if(frameCount == 0){
		//Get these ones to 0,0 center
		//console.log(magnitude)
		//console.log('Normal', X+0.5-player.posX, Y+0.5-player.posY)
		//console.log('Limited', drawPosition[0], drawPosition[1]);
	//}

	var scaleMV = mult(scale4(0.125+cursorPower/1.25,cursorPower,1), rotateY(bowVectorRotate));
	
	//var firstMV= mult(translate(X+0.5,Y+0.5,Z),rotMV);

	var firstMV= mult(translate(drawPosition[0]+player.posX, drawPosition[1]+player.posY,Z),rotMV);
	

	set_mv(mult(firstMV,scaleMV));
	
	set_light();
	set_light_arrow_vector(mult(mult(modelViewMatrix, firstMV),vec4(0,0,-2,1)));
	gl.drawArrays(gl.TRIANGLES,bowVectorStart,bowVectorVertices);
	
	bowVectorRotate = (bowVectorRotate+0.5)%360;
}


function item_push_verts(v1,v2,v3,c){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);
	for(var i = 0; i < 3; i++){
		colours.push(c);
		normals.push(vec3(0,0,0));
		texCoords.push(vec2(2,2));
	}
}

function build_bucket_water(){
	let c = vec4(0.2,0.2,0.8,1);

	let zMin = -0.5;
	let zMax = -0.4;



	//For top bar
	let t1 = vec3(-.2, .2, zMin);
	let t2 = vec3(.2, .4, zMax);
	buildPrism(t1,t2,c);

	//For bottom bar
	let b1 = vec3(-.2, -.4, zMin);
	let b2 = vec3(.2, -.2, zMax);
	buildPrism(b1,b2,c);

	//For left bar
	let l1 = vec3(-.4, -.2, zMin);
	let l2 = vec3(.3, .2, zMax);
	buildPrism(l1,l2,c);

	//For right bar
	let r1 = vec3(.3, -.2, zMin);
	let r2 = vec3(.4, .2, zMax);
	buildPrism(r1,r2,c);


	//Lower corners

	//Top Left
	let c1 = vec3(-.3,.2,zMin);
	let c2 = vec3(-.2,.3,zMax);
	buildPrism(c1,c2,c);

	//Bottom Left
	c1 = vec3(-.3,-.3,zMin);
	c2 = vec3(-.2,-.2,zMax);
	buildPrism(c1,c2,c);

	//Top Right
	c1 = vec3(.2,.2,zMin);
	c2 = vec3(.3,.3,zMax);
	buildPrism(c1,c2,c);

	//Bottom Right
	c1 = vec3(.2,-.3,zMin);
	c2 = vec3(.3,-.2,zMax);
	buildPrism(c1,c2,c);
	
}

function build_bucket(c = vec4(0.5,0.5,0.5,1)){

	let secondColor = vec4(c[0]-0.01, c[1]-0.01, c[2]-0.01, 1);//c;//vec4(c[0]-0.1, c[1]-0.1, c[2]-0.1, 1);

	let sC = secondColor;
	let ins = vec4(0.05,0.05,0.05,1);

	let topColor = vec4(c[0]-0.05, c[1]-0.05, c[2]-0.05, 1);
	
	// Top down.
	var zMax = 0.5;
	var zMin = -0.5;
	
	//For top bar
	let t1 = vec3(-.2, .4, zMin);
	let t2 = vec3(.2, .5, zMax);
	buildPrism(t1,t2,topColor,c,ins);

	//For bottom bar
	let b1 = vec3(-.2, -.5, zMin);
	let b2 = vec3(.2, -.4, zMax);
	buildPrism(b1,b2,topColor,c,c,ins);

	//For left bar
	let l1 = vec3(-.5, -.2, zMin);
	let l2 = vec3(-.4, .2, zMax);
	buildPrism(l1,l2,topColor,c,c,c,c,ins);

	//For right bar
	let r1 = vec3(.4, -.2, zMin);
	let r2 = vec3(.5, .2, zMax);
	buildPrism(r1,r2,topColor,c,c,c,ins);

	/*
		Now build all 8 corners
	*/
	let c1,c2;

	//Top left 1
	c1 = vec3(-.4,.2,zMin);
	c2 = vec3(-.3,.3,zMax);
	buildPrism(c1,c2,topColor,sC,ins,sC,sC,ins);

	//Top left 2
	c1 = vec3(-.3,.3,zMin);
	c2 = vec3(-.2,.4,zMax);
	buildPrism(c1,c2,topColor,sC,ins,sC,sC,ins);


	//Top right 1
	c1 = vec3(.3,.2,zMin);
	c2 = vec3(.4,.3,zMax);
	buildPrism(c1,c2,topColor,sC,ins,sC,ins,sC);

	//Top right 2
	c1 = vec3(.2,.3,zMin);
	c2 = vec3(.3,.4,zMax);
	buildPrism(c1,c2,topColor,sC,ins,sC,ins,sC);


	//Bottom left 1
	c1 = vec3(-.4,-.3,zMin);
	c2 = vec3(-.3,-.2,zMax);
	buildPrism(c1,c2,topColor,sC,sC,ins,sC,ins);

	//Bottom left 2
	c1 = vec3(-.3,-.4,zMin);
	c2 = vec3(-.2,-.3,zMax);
	buildPrism(c1,c2,topColor,sC,sC,ins,sC,ins);


	//Bottom right 1
	c1 = vec3(.3,-.3,zMin);
	c2 = vec3(.4,-.2,zMax);
	buildPrism(c1,c2,topColor,sC,sC,ins,ins,sC);

	//Bottom right 2
	c1 = vec3(.2,-.4,zMin);
	c2 = vec3(.3,-.3,zMax);
	buildPrism(c1,c2,topColor,sC,sC,ins,ins,sC);


	/*
		Lower portion.
	*/
	zMin = zMax;
	zMax = zMax + 0.1;

	//For top bar
	t1 = vec3(-.2, .3, zMin);
	t2 = vec3(.2, .4, zMax);
	buildPrism(t1,t2,secondColor);

	//For bottom bar
	b1 = vec3(-.2, -.4, zMin);
	b2 = vec3(.2, -.3, zMax);
	buildPrism(b1,b2,secondColor);

	//For left bar
	l1 = vec3(-.4, -.2, zMin);
	l2 = vec3(-.3, .2, zMax);
	buildPrism(l1,l2,secondColor);

	//For right bar
	r1 = vec3(.3, -.2, zMin);
	r2 = vec3(.4, .2, zMax);
	buildPrism(r1,r2,secondColor);


	//Lower corners

	//Top Left
	c1 = vec3(-.3,.2,zMin);
	c2 = vec3(-.2,.3,zMax);
	buildPrism(c1,c2,secondColor);

	//Bottom Left
	c1 = vec3(-.3,-.3,zMin);
	c2 = vec3(-.2,-.2,zMax);
	buildPrism(c1,c2,secondColor);

	//Top Right
	c1 = vec3(.2,.2,zMin);
	c2 = vec3(.3,.3,zMax);
	buildPrism(c1,c2,secondColor);

	//Bottom Right
	c1 = vec3(.2,-.3,zMin);
	c2 = vec3(.3,-.2,zMax);
	buildPrism(c1,c2,secondColor);

	/*
		Bottom of bucket.
	*/
	zMin = zMax;
	zMax = zMax + 0.1;

	//Top edge
	c1 = vec3(-.2,.2,zMin);
	c2 = vec3(.2,.3,zMax);
	buildPrism(c1,c2,secondColor);

	//Bottom edge
	c1 = vec3(-.2,-.3,zMin);
	c2 = vec3(.2,-.2,zMax);
	buildPrism(c1,c2,secondColor);

	//Large middle portion
	c1 = vec3(-.3,-.2,zMin);
	c2 = vec3(.3,.2,zMax);
	buildPrism(c1,c2,secondColor);

	/*
		Now finally, do the handle.
	*/
	zMax = -0.3;
	zMin = -0.9;
	//Left handle
	c1 = vec3(-.6,-.05,zMin);
	c2 = vec3(-.5,.05,zMax);
	buildPrism(c1,c2,vec4(0.1,0.1,0.1,1));

	//Right handle
	c1 = vec3(.5,-.05,zMin);
	c2 = vec3(.6,.05,zMax);
	buildPrism(c1,c2,vec4(0.1,0.1,0.1,1));

	//Small cubes above handle
	zMax = -0.9;
	zMin = -1;
	c1 = vec3(-.5,-.05,zMin);
	c2 = vec3(-.4,.05,zMax);
	buildPrism(c1,c2,vec4(0.1,0.1,0.1,1));
	c1 = vec3(.4,-.05,zMin);
	c2 = vec3(.5,.05,zMax);
	buildPrism(c1,c2,vec4(0.1,0.1,0.1,1));

	//Middle Bar
	zMax = -1;
	zMin = -1.1;
	c1 = vec3(-.4,-.05,zMin);
	c2 = vec3(.4,.05,zMax);
	buildPrism(c1,c2,vec4(0.1,0.1,0.1,1));

	//Wooden handle
	zMax = -0.95;
	zMin = -1.15;
	c1 = vec3(-.275,-.095,zMin);
	c2 = vec3(.275,.095,zMax);
	buildPrism(c1,c2,hexToRgbA('#513504'));

}

var axeVerts=0;
function build_axe(c = vec4(0.5,0.5,0.5,1)){
	//RANGE xE(-1(left),3(right)) yE(-2(bottom),3(top))
	var colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = c;
	var testColour = vec4(1.0,0,0,1);
	axeVerts=buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colour);
	//BUILD LITTLE TOP PIECE AND CHANGE COLOUR 
	//axeVerts+=buildRectangularPrism(0,2.5,-0.025,0.25,2.4,0.025,colour);
	axeVerts+=buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colour);

	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.6,1.8,0);
	var v3=vec3(0.6,2.6,0);
	var v4=vec3(0.35,2.4,0.05);
	axeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	axeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);

	v1=vec3(0.6,2.6,0);
	v2=vec3(0.35,2.4,-0.05);
	v3=vec3(0.35,2.4,0.05);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(0.6,1.8,0);
	v2=vec3(0.35,2,-0.05);
	v3=vec3(0.35,2,0.05);
	pushvs(v1,v2,v3,colourAxe);
	axeVerts+=6;
	axeVerts+=buildRectangularPrism(0.35,2.4,-0.05, -0.1,2,0.05,colourAxe);

	v1=vec3(-0.1,2,0.05);
	v2=vec3(-0.1,2.4,0.05);
	v3=vec3(-0.25,2.45,0);
	v4=vec3(-0.25,1.95,0);
	axeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(-0.1,2,-0.05);
	v2=vec3(-0.1,2.4,-0.05);
	axeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	
	v1=vec3(-0.1,2.4,0.05);
	v2=vec3(-0.1,2.4,-0.05);
	v3=vec3(-0.25,2.45,0);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(-0.1,2,0.05);
	v2=vec3(-0.1,2,-0.05);
	v3=vec3(-0.25,1.95,0);
	pushvs(v1,v2,v3,colourAxe);
	axeVerts+=6;
	return;
}

function build_sword(c = vec4(0.5,0.5,0.5,1), isBlue=false){

	var colourHandle=vec4(0.9,0.6,0.15,1);
	var secondColor=vec4(0.8,0.5,0.1,1)
	
	if(isBlue){
		colourHandle = mult_colors(colourHandle,recipeColor);
		//colourHandle[3] = 0.6
		secondColor = mult_colors(secondColor,recipeColor);
		//secondColor[3] = 0.6
	}

	let handleHeight = 0.5;
	let guardHeight = 0.15;
	let guardWidth = 0.1
	let bladeHeight = 2.5;

	var bladeOuter = c;
	var bladeInner = vec4(c[0]+0.1,c[1]+0.1,c[2]+0.1,1);

	if(isBlue){
		bladeOuter = mult_colors(bladeOuter,recipeColor);
		bladeInner = mult_colors(bladeInner,recipeColor);
		//bladeOuter[3] = 0.6
		//bladeInner[3] = 0.6
	}


	//ADD A PUMMEL!
	// Hilt
	buildRectangularPrism(0,0.20,-0.05, 0.25,0.05,0.05,colourHandle);	//Pummel
	buildRectangularPrism(0.05,0.2+handleHeight,-0.025, 0.2,0.05,0.025,secondColor);			//Handle
	buildRectangularPrism(-0.1-guardWidth/2,0.2+handleHeight+guardHeight,-0.05, 0.35+guardWidth/2,0.2+handleHeight,0.05,colourHandle);			//Guard
	buildRectangularPrism(0.05,bladeHeight, -0.025, 0.2,0.2+handleHeight+guardHeight,0.025,bladeInner);		//Sword prism/Center of blade.

	let v1, v2, v3, v4;
	let p1, p2;	

	/*
		Left side of blade.
	*/


	 //Vertices out left face.
	v1 = vec3(0.05,bladeHeight, -0.025);
	v2 = vec3(0.05,0.2+handleHeight+guardHeight, -0.025);
	v3 = vec3(0.05,bladeHeight, 0.025);
	v4 = vec3(0.05,0.2+handleHeight+guardHeight,0.025);

	//Edge vertices.
	p1 = vec3(0,bladeHeight,0);
	p2 = vec3(0,0.2+handleHeight+guardHeight,0);

	pushvs(v1,p2,p1,bladeOuter);
	pushvs(p2,v1,v2,bladeOuter);
	pushvs(v3,p2,p1,bladeOuter);
	pushvs(p2,v3,v4,bladeOuter);
	//pushvs(v2,v3,v4,c);


	 //Vertices out right face.
	v1 = vec3(0.2,bladeHeight, -0.025);
	v2 = vec3(0.2,0.2+handleHeight+guardHeight, -0.025);
	v3 = vec3(0.2,bladeHeight, 0.025);
	v4 = vec3(0.2,0.2+handleHeight+guardHeight,0.025);

	//Edge vertices.
	p1 = vec3(0.25,bladeHeight,0);
	p2 = vec3(0.25,0.2+handleHeight+guardHeight,0);

	pushvs(v1,p2,p1,bladeOuter);
	pushvs(p2,v1,v2,bladeOuter);
	pushvs(v3,p2,p1,bladeOuter);
	pushvs(p2,v3,v4,bladeOuter);


	/*
		Top portion of the sword.
	*/

	let tipHeight = bladeHeight + 0.2; //This is the very top of the sword.
	//Top face of blade prism vertices
	v1 = vec3(0.05,bladeHeight, -0.025);
	v2 = vec3(0.05,bladeHeight, 0.025);
	v3 = vec3(0.2,bladeHeight, -0.025);
	v4 = vec3(0.2,bladeHeight, 0.025);

	//Tip of blade
	p1 = vec3(0.05,tipHeight, 0);
	p2 = vec3(0.2,tipHeight, 0);

	pushvs(v1,p2,p1,bladeOuter);
	pushvs(p2,v1,v3,bladeOuter);
	pushvs(v2,p2,p1,bladeOuter);
	pushvs(p2,v2,v4,bladeOuter);


	/*
		The top edges (Left side)
	*/

	v1 = vec3(0.05,bladeHeight, -0.025);
	v2 = vec3(0.05,bladeHeight, 0.025);
	v3 = vec3(0.05,tipHeight, 0);
	v4 = vec3(0,bladeHeight,0);

	pushvs(v2,v3,v4,bladeOuter);
	pushvs(v1,v3,v4,bladeOuter);

	/*
		The top edges (Right side)
	*/
	v1 = vec3(0.2,bladeHeight, -0.025);
	v2 = vec3(0.2,bladeHeight, 0.025);
	v3 = vec3(0.2,tipHeight, 0);
	v4 = vec3(0.25,bladeHeight,0);

	pushvs(v2,v3,v4,bladeOuter);
	pushvs(v1,v3,v4,bladeOuter);

	return;
}

var pickaxeVerts=0;
function build_pickaxe(c = vec4(0.5,0.5,0.5,1)){
	//RANGE xE(-1(left),3(right)) yE(-2(bottom),3(top))
	var colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = c;
	var testColour = vec4(1.0,0,0,1);
	pickaxeVerts=buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colour);
	//BUILD LITTLE TOP PIECE AND CHANGE COLOUR 
	//axeVerts+=buildRectangularPrism(0,2.5,-0.025,0.25,2.4,0.025,colour);
	pickaxeVerts+=buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colour);

	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.7,1.8,0);
	var v3=vec3(0.7,1.8,0);
	var v4=vec3(0.35,2.4,0.05);
	pickaxeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	pickaxeVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);

	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2.4,-0.05);
	v3=vec3(0.35,2.4,0.05);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2,-0.05);
	v3=vec3(0.35,2,0.05);
	pushvs(v1,v2,v3,colourAxe);
	pickaxeVerts+=6;
	pickaxeVerts+=buildRectangularPrism(0.35,2.4,-0.05, -0.1,2,0.05,colourAxe);

	var v1=vec3(-0.1,2,0.05);
	var v2=vec3(-0.45,1.8,0);
	var v3=vec3(-0.45,1.8,0);
	var v4=vec3(-0.1,2.4,0.05);
	pickaxeVerts+=buildArbQuadrilateral(v2,v1,v4,v3,colourAxe);
	v1=vec3(-0.1,2,-0.05);
	v4=vec3(-0.1,2.4,-0.05);
	pickaxeVerts+=buildArbQuadrilateral(v2,v1,v4,v3,colourAxe);

	v1=vec3(-0.45,1.8,0);
	v2=vec3(-0.1,2.4,-0.05);
	v3=vec3(-0.1,2.4,0.05);
	pushvs(v1,v3,v2,colourAxe);
	v1=vec3(-0.45,1.8,0);
	v2=vec3(-0.1,2,-0.05);
	v3=vec3(-0.1,2,0.05);
	pushvs(v1,v3,v2,colourAxe);
	pickaxeVerts+=6;	
	return;
}


var bowVerts=0;
function build_bow(){
	const colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = vec4(0.9,0.6,0.15,1);
	var testColour = vec4(1.0,0,0,1);
	const greyColor = vec4(0.3,0.3,0.3,1)
	//Original
	//bowVerts=buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colour);
	//bowVerts+=buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colour);
	//Updated
	bowVerts=buildRectangularPrism(  -0.018,  2.5,   -0.018,      0.018, 0, 0.018,       greyColor);


	
	var v1=vec3(0.15,2.45,0.05);
	var v4=vec3(0.15,2.35,0.05);
	var v2=vec3(0.7,1.25,0);
	var v3=vec3(0.7,1.25,0);

	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(0.15,2.35,-0.05);
	v4=vec3(0.15,2.45,-0.05);
	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);

	v1=vec3(0.7,1.25,0);
	v2=vec3(0.15,2.45,-0.05);
	v3=vec3(0.15,2.45,0.05);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(0.7,1.25,0);
	v2=vec3(0.15,2.35,-0.05);
	v3=vec3(0.15,2.35,0.05);
	pushvs(v1,v2,v3,colourAxe);
	bowVerts+=6;
	bowVerts+=buildRectangularPrism(0.15, 2.45, -0.05,     -0.1, 2.35, 0.05,       colourAxe);


	//Now just flip the above thing.
	var v1=vec3(0.15,-2.45+2.5,0.05);
	var v4=vec3(0.15,-2.35+2.5,0.05);
	var v2=vec3(0.7,-1.25+2.5,0);
	var v3=vec3(0.7,-1.25+2.5,0);

	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(0.15,-2.35+2.5,-0.05);
	v4=vec3(0.15,-2.45+2.5,-0.05);
	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);

	v1=vec3(0.7,-1.25+2.5,0);
	v2=vec3(0.15,-2.45+2.5,-0.05);
	v3=vec3(0.15,-2.45+2.5,0.05);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(0.7,-1.25+2.5,0);
	v2=vec3(0.15,-2.35+2.5,-0.05);
	v3=vec3(0.15,-2.35+2.5,0.05);
	pushvs(v1,v2,v3,colourAxe);
	bowVerts+=6;
	bowVerts+=buildRectangularPrism(0.15, -2.45+2.5, -0.05,     -0.1, -2.35+2.5, 0.05,       colourAxe);

	bowVerts+= buildRectangularPrism(0.7-0.02-0.03, 1.25-0.13, -0.025,     0.7+0.02-0.03, 1.25+0.13, 0.025,       vec4(0.1,0.1,0.1,1));
	return;
}







/*
	Interesting.
var bowVerts=0;
function build_bow(){
	const colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = vec4(0.5,0.5,0.5,1);
	var testColour = vec4(1.0,0,0,1);
	const greyColor = vec4(0.3,0.3,0.3,1)
	//Original
	//bowVerts=buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colour);
	//bowVerts+=buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colour);
	//Updated
	bowVerts=buildRectangularPrism(  -0.025,  2.5,   -0.025,      0.025, 0.05, 0.025,       greyColor);

	
	//Making top half of wood
	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.7,1.8,0);
	var v3=vec3(0.7,1.8,0);
	var v4=vec3(0.35,2.4,0.05);
	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	bowVerts+=buildArbQuadrilateral(v1,v2,v3,v4,colourAxe);

	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2.4,-0.05);
	v3=vec3(0.35,2.4,0.05);
	pushvs(v1,v2,v3,colourAxe);
	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2,-0.05);
	v3=vec3(0.35,2,0.05);
	pushvs(v1,v2,v3,colourAxe);
	bowVerts+=6;
	bowVerts+=buildRectangularPrism(0.35,2.4,-0.05, -0.1,2,0.05,colourAxe);

	return;
}
*/