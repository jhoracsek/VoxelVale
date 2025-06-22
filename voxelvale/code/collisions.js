/*
	This is my updated file for detecting collisions between objects. I'm going to try and be a little more explicit 
	about the rules here, and what exactly a function does.

	Collision boxes are rectangular prisms defined by two points in 3D space. Any object that has a collision box 
	should have the method "returnBounds()", which returns these 2 points as 3D-vectors. We assume returnBounds()
	returns p1, p2 such that p1[i] <= p2[i] for i in {1,2,3}. In fact, we'll assume the 'small-point first' 
	condition, for any two points that define a collision box.

	There are a few exceptions where objects maybe have multiple methods for returning bounds. This is done if an
	object should collide differently with different objects. An example would be "Undead" enemies, they call 
	returnBounds() for the collision with boxes, but not for the collisions with other enemies.
*/

const NO_DIRECTION = -1;
const LEFT = 0;
const RIGHT = 1;
const TOP = 2;
const BOTTOM = 3;
const ALL_DIRECTIONS = 4;

// boundFunction=returnBounds

/*
	Determine if a given point is contained within a rectangle.

	"point" is taken to be a 2D vector, and box is 2 2D vectors.

	Note "In" is defined as inside or lying on the surface of the rectangle.
*/
function isPointInRectangle(point, rectangle){
	var rectPointSmall = rectangle[0];
	var rectPointLarge = rectangle[1];

	// For x-axis.
	if(rectPointSmall[0] <= point[0] && rectPointLarge[0] >= point[0])
		// For y-axis.
		if(rectPointSmall[1] <= point[1] && rectPointLarge[1] >= point[1])
			return true;
	return false;
}

/*
	Takes two rectangles (2D). One is assumed to be moving, the other fixed.
	We know that a fixed collision box can only inhibit movement in a single direction,
	so this method returns the direction the box is being inhibited, -1 if
	if the fixed box does not inhibit the movement of "moving", or 4 if moving
	is inside fixed.
*/
function directionInhibited(moving, fixed){
	
	// Define moving box points.
	var p0,p1,p2,p3;
	// Bottom Left
	p0 = moving[0];
	// Bottom right
	p1 = vec2(moving[1][0], moving[0][1]);
	// Top Left
	p2 = vec2(moving[0][0], moving[1][1]);
	// Top Right
	p3 = moving[1];


	// Define fixed box points.
	var f0,f1,f2,f3;
	// Bottom Left
	f0 = fixed[0];
	// Bottom right
	f1 = vec2(fixed[1][0], fixed[0][1]);
	// Top Left
	f2 = vec2(fixed[0][0], fixed[1][1]);
	// Top Right
	f3 = fixed[1];

	/*
		Let's assume the boxes are not 'inside' each other. Either they are not
		colliding, or the are intersecting on a line.
	*/
	var pIn = [isPointInRectangle(p0,fixed), isPointInRectangle(p1,fixed), isPointInRectangle(p2,fixed), isPointInRectangle(p3,fixed)];
	var fIn = [isPointInRectangle(f0,moving), isPointInRectangle(f1,moving), isPointInRectangle(f2,moving), isPointInRectangle(f3,moving)];

	var pInSum = 0;
	var fInSum = 0;

	for (let i = 0; i < 4; i++){
		pInSum+=pIn[i];
		fInSum+=fIn[i];
	}

	if(pInSum==0 && fInSum==0) return NO_DIRECTION; // No points intersect, so they are not colliding.

	/*
		As an example, let's say that moving intersects fixed on its right side. There are a few ways this can happen.
		For instance pIn[1] == true and pIn[3] == true, and fIn[0] and fIn[2] are any values. Basically, at least two
		values out of pIn[1], pIn[3], fIn[0], and fIn[2] must be true. 
	*/
	var onLeft = false;
	var onRight = false;
	var onTop = false;
	var onBottom = false;

	var rightPoints, leftPoints, topPoints, bottomPoints;

	if ((pIn[1] + pIn[3] + fIn[0] + fIn[2]) >= 2) onRight = true; //return RIGHT;//
	if ((pIn[0] + pIn[2] + fIn[1] + fIn[3]) >= 2) onLeft = true; //return LEFT;//
	if ((pIn[2] + pIn[3] + fIn[0] + fIn[1]) >= 2) onTop = true; //return TOP;//
	if ((pIn[0] + pIn[1] + fIn[2] + fIn[3]) >= 2) onBottom = true;//return BOTTOM;//

	return [onLeft, onRight, onTop, onBottom];

	/*
		It's important to note that if two rectangles are not inside each other, but are intersecting,
		the direction of moving can only be inhibited one way. This function however does not guarrantee
		that the rectangles are not intersecting. This is TO BE IMPLEMENTED!
	*/
}


/*
	Takes two rectangles (2D). One is assumed to be moving, the other fixed.
	We know that a fixed collision box can only inhibit movement in a single direction,
	so this method returns the direction the box is being inhibited, -1 if
	if the fixed box does not inhibit the movement of "moving", or 4 if moving
	is inside fixed.
*/

function directionInhibitedOffset(moving, fixed){
	var offset = 0.05;

	// Define moving box points.
	var p0,p1,p2,p3;
	// Bottom Left
	p0 = moving[0];
	// Bottom right
	p1 = vec2(moving[1][0], moving[0][1]);
	// Top Left
	p2 = vec2(moving[0][0], moving[1][1]);
	// Top Right
	p3 = moving[1];


	// Define fixed box points.
	var f0,f1,f2,f3;
	// Bottom Left
	f0 = fixed[0];
	// Bottom right
	f1 = vec2(fixed[1][0], fixed[0][1]);
	// Top Left
	f2 = vec2(fixed[0][0], fixed[1][1]);
	// Top Right
	f3 = fixed[1];

	// Define offset points. This is done so the boundaries do not meet on a single point.

	var p0L = vec2(p0[0] - offset, p0[1]);
	var p0B = vec2(p0[0], p0[1] - offset);

	var p1R = vec2(p1[0] + offset,p1[1]);
	var p1B = vec2(p1[0],p1[1] - offset);

	var p2L = vec2(p2[0] - offset,p2[1]);
	var p2T = vec2(p2[0],p2[1] + offset);

	var p3R = vec2(p3[0] + offset,p3[1]);
	var p3T = vec2(p3[0],p3[1] + offset);

	/*
		Let's assume the boxes are not 'inside' each other. Either they are not
		colliding, or the are intersecting on a line.
	*/
	var pIn = [ [isPointInRectangle(p0L,fixed), isPointInRectangle(p0B,fixed)], [isPointInRectangle(p1R,fixed),isPointInRectangle(p1B,fixed)], 
				[isPointInRectangle(p2L,fixed), isPointInRectangle(p2T,fixed)], [isPointInRectangle(p3R,fixed), isPointInRectangle(p3T,fixed)]];
	

	var newMoving = [vec2(p0[0] - offset, p0[1]-offset), vec2(p3[0] + offset,p3[1] + offset)];
	var fIn = [isPointInRectangle(f0,newMoving), isPointInRectangle(f1,newMoving), isPointInRectangle(f2,newMoving), isPointInRectangle(f3,newMoving)];


	/*
		As an example, let's say that moving intersects fixed on its right side. There are a few ways this can happen.
		For instance pIn[1] == true and pIn[3] == true, and fIn[0] and fIn[2] are any values. Basically, at least two
		values out of pIn[1], pIn[3], fIn[0], and fIn[2] must be true. 
	*/
	var onLeft = false;
	var onRight = false;
	var onTop = false;
	var onBottom = false;

	var rightPoints, leftPoints, topPoints, bottomPoints;

	if ((pIn[1][0] + pIn[3][0] + fIn[0] + fIn[2]) >= 2) onRight = true; //return RIGHT;//
	if ((pIn[0][0] + pIn[2][0] + fIn[1] + fIn[3]) >= 2) onLeft = true; //return LEFT;//
	if ((pIn[2][1] + pIn[3][1] + fIn[0] + fIn[1]) >= 2) onTop = true; //return TOP;//
	if ((pIn[0][1] + pIn[1][1] + fIn[2] + fIn[3]) >= 2) onBottom = true;//return BOTTOM;//

	return [onLeft, onRight, onTop, onBottom];

	/*
		It's important to note that if two rectangles are not inside each other, but are intersecting,
		the direction of moving can only be inhibited one way. This function however does not guarrantee
		that the rectangles are not intersecting. This is TO BE IMPLEMENTED!
	*/
}

function colDirection(object1, object2){
	if(object1==null || object2==null) return [false,false,false,false];

	var bound1 = object1.returnBounds();
	var bound2 = object2.returnBounds();

	if(bound1 == null || bound2 == null) return [false,false,false,false];

	/*
		First, we need to ensure that neither object is above or below the other.
	*/

	var bound1_z_low = bound1[0][2];
	var bound1_z_high = bound1[1][2];
	var bound2_z_low = bound2[0][2];
	var bound2_z_high = bound2[1][2];

	if((bound1_z_high < bound2_z_low) || (bound1_z_low > bound2_z_high))
		return [false,false,false,false];

	/*
		Now, for simplicity, we can treat this as a 2D collision.
	*/
	var moving = [vec2(bound1[0][0], bound1[0][1]), vec2(bound1[1][0], bound1[1][1])];
	var fixed = [vec2(bound2[0][0], bound2[0][1]), vec2(bound2[1][0], bound2[1][1])];

	return directionInhibitedOffset(moving,fixed);
}






/*
	UNUSED FUNCTIONS!
*/


/*
	Tests if any point in box1 is contained in box2. This holds if and only if,
	any of the 8 vertices of box1 are contained within box2.
*/
function boxInBox(box1, box2){
	//Recall the small point assumtion.

	// box1 vertices.
	var p1,p2,p3,p4,p5,p6,p7,p8;
	// Bottom-Left
	p1 = box1[0];


}

/*
	A prism, bound1, is colliding with another prism, bound2, if and only if any of the 8 points on bound1
	is contained within the prism defined by bound2, or vice-versa.
*/
function isCol(object1,object2){
	if(object1==null || object2==null) return false;
	
	var bound1 = object1.returnBounds();
	var bound2 = object2.returnBounds();



	if(oOne.returnBounds()[1][0] >= oTwo.returnBounds()[0][0] && oOne.returnBounds()[0][0] < oTwo.returnBounds()[1][0])
		if(oOne.returnBounds()[1][1] >= oTwo.returnBounds()[0][1] && oOne.returnBounds()[0][1] < oTwo.returnBounds()[1][1])
			return true;

	return false;
}





function pushApart(object1,object2){

}


/*
	Determine if a given point is contained within a rectangular prism.
	"point" is taken to be a 3d vector, and box is 2, 3d vectors.

	Note "In" is defined as inside or lying on the surface of the box!
*/
function isPointInBox(point, box){

	var boxPointSmall = box[0];
	var boxPointLarge = box[1];
	
	// For x-axis.
	if(boxPointSmall[0] <= point[0] && boxPointLarge[0] >= point[0])
		// For y-axis.
		if(boxPointSmall[1] <= point[1] && boxPointLarge[1] >= point[1])
			// For z-axis.
			if(boxPointSmall[2] <= point[2] && boxPointLarge[2] >= point[2])
				return true;

	return false;
}
