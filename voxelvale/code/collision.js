var isStopRight=false;
var isStopLeft=false;
var isStopUp=false;
var isStopDown=false;
var colOffset=0.1;
var colZOffset=-0.05;
function isInZRangeOld(objectOne, objectTwo){

	let o1ZLow = objectOne.returnBounds()[0][2];
	let o1ZHigh = objectOne.returnBounds()[1][2];

	let o2ZLow = objectTwo.returnBounds()[0][2];
	let o2ZHigh = objectTwo.returnBounds()[1][2];

	if(o1ZHigh >= (o2ZLow+colZOffset) &&  o1ZHigh <= (o2ZHigh-colZOffset))
		return true;
	if(o1ZLow >= (o2ZLow+colZOffset) &&  o1ZLow <= (o2ZHigh-colZOffset))
		return true;
	return false;
}

function isInZRange(objectOne, objectTwo){
	
	let o1ZLow = objectOne.returnBounds()[0][2];
	let o1ZHigh = objectOne.returnBounds()[1][2];

	let o2ZLow = objectTwo.returnBounds()[0][2];
	let o2ZHigh = objectTwo.returnBounds()[1][2];

	if( (o1ZHigh < o2ZLow) || (o1ZLow > o2ZHigh))
		return false;

	return true;
}
/*
	For collisions with non-tile objects.
*/
class BoundObject{
	constructor(X,Y,Z){
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
	}
	returnBounds(){
		if(fixedView)
			return [vec3(this.posX,this.posY,this.posZ), vec3(this.posX+1,this.posY+1,this.posZ+1)];
		else
			return [vec3(mult(translate(0,0,0),vec4(this.posX,this.posY,this.posZ,1))), vec3(mult(translate(0,0,0),vec4(this.posX+1,this.posY+1,this.posZ+1,1)))];
	}
}

/*
	I think it's fair to treat hit/hurt boxes as 2D objects. This is just a class for 2D collisions that ignore any depth.
*/
class HitBox{
	constructor(bounds, hbS, hbN, obj){
		this.bound1 = bounds[0];
		this.bound2 = bounds[1];

		this.hitboxStart = hbS;
		this.hitboxNumber = hbN;

		this.obj = obj;
	}
	returnBounds(){
		let curPos = translate(this.obj.posX, this.obj.posY, this.obj.posZ);
		curPos = mult(curPos,rotateZ(-this.obj.angleFacing));
		curPos = mult(curPos,translate(0, -0.5,0));
		curPos = mult(curPos,rotateZ(this.obj.angleFacing));

		let b1 = mult(curPos, this.bound1);
		let b2 =  mult(curPos, this.bound2);
		return [vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]),-10,1),vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]),10,1)];
	}

	draw(){

		let curPos = modelViewMatrix;
		curPos = mult(curPos,translate(this.obj.posX, this.obj.posY, this.obj.posZ));
		curPos = mult(curPos,rotateZ(-this.obj.angleFacing));
		curPos = mult(curPos,translate(0, -0.5,0));
		curPos = mult(curPos,rotateZ(this.obj.angleFacing));
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(curPos));
		gl.drawArrays(gl.LINES,this.hitboxStart,this.hitboxNumber);
	}
}

/*
	Preserves height.
*/
class ArrowBlockHitBox{
	static bound1 = vec4(-0.15,-0.15,-0.1,1);
	static bound2 = vec4(0.15,0.15,0,1);
	
	static index = 0;
	static numberOfVerts = 0;

	static sendData(){
		this.index = vertices.length;
		push_wireframe_indices(this.bound1,this.bound2,vec4(0,0,1,0.7))
		this.numberOfVerts = vertices.length - this.index;
	}

	constructor(obj){
		this.obj = obj;
	}

	returnBounds(){
		let curPos = translate(this.obj.pX, this.obj.pY, this.obj.pZ);
		curPos = mult(curPos,rotateZ(this.obj.direction));
		curPos = mult(curPos,translate(0,0.8,0));
		curPos = mult(curPos,rotateZ(-this.obj.direction));

		let b1 = mult(curPos, ArrowBlockHitBox.bound1);
		let b2 =  mult(curPos, ArrowBlockHitBox.bound2);
		
		return [vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), Math.min(b1[2],b2[2]),1),vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]),Math.max(b1[2],b2[2]),1)];
	}

	draw(){
		let curPos = modelViewMatrix;
		curPos = mult(curPos,translate(this.obj.pX, this.obj.pY, this.obj.pZ));
		curPos = mult(curPos,rotateZ(this.obj.direction));
		curPos = mult(curPos,translate(0,0.8,0));
		curPos = mult(curPos,rotateZ(-this.obj.direction));
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(curPos));
		gl.drawArrays(gl.LINES,ArrowBlockHitBox.index,ArrowBlockHitBox.numberOfVerts);
	}
}

function isCollidingRight(objectOne, objectTwo){
	if(objectTwo==null || objectOne == null)return false;
	if(!isInZRange(objectOne, objectTwo)) return false;
	if( objectOne.returnBounds()[1][0] >= objectTwo.returnBounds()[0][0]  && objectOne.returnBounds()[1][0] <= objectTwo.returnBounds()[1][0]){
		if(objectOne.returnBounds()[1][1] >= (objectTwo.returnBounds()[0][1]+colOffset) && objectOne.returnBounds()[1][1] <= (objectTwo.returnBounds()[1][1]-colOffset))
			return true;
		if(objectOne.returnBounds()[0][1] >= (objectTwo.returnBounds()[0][1]+colOffset) && objectOne.returnBounds()[0][1] <= (objectTwo.returnBounds()[1][1]-colOffset))
			return true;
	}
	return false;
}
function isCollidingLeft(objectOne, objectTwo){
	if(objectTwo==null || objectOne == null)return false;
	if(!isInZRange(objectOne, objectTwo)) return false;
	if( objectOne.returnBounds()[0][0] >= objectTwo.returnBounds()[0][0]  && objectOne.returnBounds()[0][0] <= objectTwo.returnBounds()[1][0]){
		if(objectOne.returnBounds()[1][1] >= (objectTwo.returnBounds()[0][1]+colOffset)  && objectOne.returnBounds()[1][1] <= (objectTwo.returnBounds()[1][1]-colOffset))
			return true;
		if(objectOne.returnBounds()[0][1] >= (objectTwo.returnBounds()[0][1]+colOffset)  && objectOne.returnBounds()[0][1] <= (objectTwo.returnBounds()[1][1]-colOffset))
			return true;
	}
	return false;
}
function isCollidingUp(objectOne, objectTwo){
	if(objectTwo==null || objectOne == null)return false;
	if(!isInZRange(objectOne, objectTwo)) return false;
	if( objectOne.returnBounds()[1][1] >= objectTwo.returnBounds()[0][1]  && objectOne.returnBounds()[1][1] <= objectTwo.returnBounds()[1][1]){
		if( objectOne.returnBounds()[1][0] >= (objectTwo.returnBounds()[0][0]+colOffset)  && objectOne.returnBounds()[1][0] <= (objectTwo.returnBounds()[1][0]-colOffset))
			return true;
		if( objectOne.returnBounds()[0][0] >= (objectTwo.returnBounds()[0][0]+colOffset)  && objectOne.returnBounds()[0][0] <= (objectTwo.returnBounds()[1][0]-colOffset))
			return true;
	}
	return false;
}
function isCollidingDown(human, object){
	if(human==null || object == null)return false;
	if(!isInZRange(human, object)) return false;
	if(human.returnBounds()[0][1] <= object.returnBounds()[1][1] && human.returnBounds()[0][1] >= object.returnBounds()[0][1]){
		if(human.returnBounds()[0][0] >= (object.returnBounds()[0][0]+colOffset) && human.returnBounds()[0][0] <= (object.returnBounds()[1][0]-colOffset)){
			return true;
		}
		if(human.returnBounds()[1][0] >= (object.returnBounds()[0][0]+colOffset) && human.returnBounds()[1][0] <= (object.returnBounds()[1][0]-colOffset)){
			return true;
		}
	}
	return false;
}
function isColliding(oOne,oTwo){
	/*
	if(isCollidingRight(oOne, oTwo)) return true;
	if(isCollidingLeft(oOne, oTwo)) return true;
	if(isCollidingUp(oOne, oTwo)) return true;
	if(isCollidingDown(oOne, oTwo)) return true;
	*/
	//if(!isInZRange(oOne, oTwo)) return false;
	//Intersecting X's
	if(oOne == null || oTwo==null) return false;
	if(oOne.returnBounds()[1][0] >= oTwo.returnBounds()[0][0] && oOne.returnBounds()[0][0] < oTwo.returnBounds()[1][0])
		if(oOne.returnBounds()[1][1] >= oTwo.returnBounds()[0][1] && oOne.returnBounds()[0][1] < oTwo.returnBounds()[1][1])
			return true;

	return false;
}

function collidingHorizontal(oOne,oTwo){
	/*
	if(isCollidingRight(oOne, oTwo)) return true;
	if(isCollidingLeft(oOne, oTwo)) return true;
	if(isCollidingUp(oOne, oTwo)) return true;
	if(isCollidingDown(oOne, oTwo)) return true;
	*/
	//if(!isInZRange(oOne, oTwo)) return false;
	//Intersecting X's
	objectOneBounds = oOne.returnBounds();
	objectTwoBounds = oTwo.returnBounds();
	if(objectOneBounds[1][0] >= objectTwoBounds[0][0] && objectOneBounds[0][0] < objectTwoBounds[1][0]){

		return [objectOneBounds[1][0] - objectTwoBounds[0][0],  objectTwoBounds[1][0] - objectOneBounds[0][0]];
	}

	return [0,0];
}

function collidingVerticle(oOne,oTwo){
	/*
	if(isCollidingRight(oOne, oTwo)) return true;
	if(isCollidingLeft(oOne, oTwo)) return true;
	if(isCollidingUp(oOne, oTwo)) return true;
	if(isCollidingDown(oOne, oTwo)) return true;
	*/
	//if(!isInZRange(oOne, oTwo)) return false;
	//Intersecting X's
	
	if(oOne.returnBounds()[1][1] >= oTwo.returnBounds()[0][1] && oOne.returnBounds()[0][1] < oTwo.returnBounds()[1][1])
		return true;

	return false;
}

function isCollidingLeftNew(oOne,oTwo){
	/*
	if(isCollidingRight(oOne, oTwo)) return true;
	if(isCollidingLeft(oOne, oTwo)) return true;
	if(isCollidingUp(oOne, oTwo)) return true;
	if(isCollidingDown(oOne, oTwo)) return true;
	*/
	//if(!isInZRange(oOne, oTwo)) return false;
	//Intersecting X's
	objectOneBounds = oOne.returnBounds();
	objectTwoBounds = oTwo.returnBounds();
	if(oOne.returnBounds()[1][0] >= oTwo.returnBounds()[0][0] && oOne.returnBounds()[0][0] < oTwo.returnBounds()[1][0])
		if(oOne.returnBounds()[1][1] >= oTwo.returnBounds()[0][1] && oOne.returnBounds()[0][1] < oTwo.returnBounds()[1][1])
			return true;

	return false;
}


function isColliding_Original(oOne,oTwo){
	
	if(isCollidingRight(oOne, oTwo)) return true;
	if(isCollidingLeft(oOne, oTwo)) return true;
	if(isCollidingUp(oOne, oTwo)) return true;
	if(isCollidingDown(oOne, oTwo)) return true;
	
	return false;
}