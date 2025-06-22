var isStopRight=false;
var isStopLeft=false;
var isStopUp=false;
var isStopDown=false;
var colOffset=0.1;
var colZOffset=-0.5;
function isInZRange(objectOne, objectTwo){
	if(objectOne.returnBounds()[1][2] >= (objectTwo.returnBounds()[0][2]+colZOffset) &&  objectOne.returnBounds()[1][2] <= (objectTwo.returnBounds()[1][2]-colZOffset))
		return true;
	if(objectOne.returnBounds()[0][2] >= (objectTwo.returnBounds()[0][2]+colZOffset) &&  objectOne.returnBounds()[0][2] <= (objectTwo.returnBounds()[1][2]-colZOffset))
		return true;
	return false;
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