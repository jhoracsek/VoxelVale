
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
		this.typeOfObj = 'ITEM'
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
		this.name='Standard Axe';
		this.desc='A standard stone axe.';
		this.objectNumber=64;
	}
}

class StonePickaxe extends Tool{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_pickaxe,1);
		this.index=pickaxeStart;
		this.numberOfVerts=pickaxeVerts;
		this.toolType = 'PICK_AXE';
		this.name='Standard Pickaxe';
		this.desc='A standard stone pickaxe.';
		this.objectNumber=65;
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
			//projectileArray.push(new Arrow(cursorDirection,cursorPower,player.posX,player.posY,upOne));
			if(player.getArrowCount() > 0) {
				projectileArray.push(new Arrow(cursorDirection,cursorPower,player.posX,player.posY,-3));
				player.removeArrowFromShoot();
				sound_ArrowShoot();
				projectileCooldown = this.cooldown;
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

var axeVerts=0;
function build_axe(){
	//RANGE xE(-1(left),3(right)) yE(-2(bottom),3(top))
	var colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = vec4(0.5,0.5,0.5,1);
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

var pickaxeVerts=0;
function build_pickaxe(){
	//RANGE xE(-1(left),3(right)) yE(-2(bottom),3(top))
	var colour=vec4(0.9,0.6,0.15,1);
	var colourAxe = vec4(0.5,0.5,0.5,1);
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