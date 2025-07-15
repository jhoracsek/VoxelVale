//Simple no texture, no normals. Once you start developing a lighting engine,
//you can begin to update these methods accordingly, but for now this will suffice.
function pushvs(v1,v2,v3,c){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);
	for(var i = 0; i < 3; i++){
		colours.push(c);
		//normals.push(vec3(0,0,0));
		texCoords.push(vec2(2,2));
	}
	var cross1 = subtract(v2,v1); 
	var cross2 = subtract(v1,v3);
	var norm = cross(cross1, cross2);
	norm = vec3(norm);
	for(var i =0; i < 3; i++)
		normals.push(norm);
	return 3;
}

//Order of point for any arbQuad method...
/*   ____________
(p2)|            |(p1)
(p3)|____________|(p4)
*/

//p values used with vec3(x,y,z)
function buildArbQuadrilateral(p1,p2,p3,p4,c){
	var numVertsToReturn=6;
	v1=vec3(p1[0],p1[1],p1[2]);
	v2=vec3(p2[0],p2[1],p2[2]);
	v3=vec3(p3[0],p3[1],p3[2]);
	v4=vec3(p4[0],p4[1],p4[2]);
	pushvs(p1,p2,p4,c);
	pushvs(p3,p4,p2,c);
	return numVertsToReturn;
}

//p values used with vec2(x,y)
function buildArbQuadrilateralXY(p1,p2,p3,p4,z,c){
	var numVertsToReturn=6;
	v1=vec3(p1[0],p1[1],z);
	v2=vec3(p2[0],p2[1],z);
	v3=vec3(p3[0],p3[1],z);
	v4=vec3(p4[0],p4[1],z);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}

//p values used with vec2(x,z)
function buildArbQuadrilateralXZ(p1,p2,p3,p4,y,c){
	var numVertsToReturn=6;
	v1=vec3(p1[0],y,p1[1]);
	v2=vec3(p2[0],y,p2[1]);
	v3=vec3(p3[0],y,p3[1]);
	v4=vec3(p4[0],y,p4[1]);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}

//p values used with vec2(y,z)
function buildArbQuadrilateralYZ(p1,p2,p3,p4,x,c){
	var numVertsToReturn=6;
	v1=vec3(x,p1[0],p1[1]);
	v2=vec3(x,p2[0],p2[1]);
	v3=vec3(x,p3[0],p3[1]);
	v4=vec3(x,p4[0],p4[1]);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}

function buildRectangleXY(x1,y1,x2,y2,z,c){
	var numVertsToReturn=6;
	v1=vec3(x1,y1,z);
	v2=vec3(x2,y1,z);
	v3=vec3(x2,y2,z);
	v4=vec3(x1,y2,z);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}
function buildRectangleXZ(x1,z1,x2,z2,y,c){
	var numVertsToReturn=6;
	v1=vec3(x1,y,z1);
	v2=vec3(x2,y,z1);
	v3=vec3(x2,y,z2);
	v4=vec3(x1,y,z2);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}
function buildRectangleYZ(y1,z1,y2,z2,x,c){
	var numVertsToReturn=6;
	v1=vec3(x,y1,z1);
	v2=vec3(x,y1,z2);
	v3=vec3(x,y2,z2);
	v4=vec3(x,y2,z1);
	pushvs(v1,v2,v4,c);
	pushvs(v3,v4,v2,c);
	return numVertsToReturn;
}
/*
Notes:
	For a vPosition vector, vec3(First,Second,Third)
		First: 	Assume X
		Second: Assume Y
		Third: 	Assume Z
*/
function buildRectangularPrism(x1,y1,z1,x2,y2,z2,c){
	var numVertsToReturn=0;
	numVertsToReturn += buildRectangleXY(x1,y1,x2,y2,z1,c);
	numVertsToReturn += buildRectangleXY(x1,y1,x2,y2,z2,c);

	numVertsToReturn += buildRectangleXZ(x1,z1,x2,z2,y1,c);
	numVertsToReturn += buildRectangleXZ(x1,z1,x2,z2,y2,c);
	
	numVertsToReturn += buildRectangleYZ(y1,z1,y2,z2,x1,c);
	numVertsToReturn += buildRectangleYZ(y1,z1,y2,z2,x2,c);
	return numVertsToReturn;
}

function buildPrism(vector1, vector2, c, c2=c, c3=c2, c4=c2, c5=c2, c6=c2){
	let x1 = vector1[0];
	let y1 = vector1[1];
	let z1 = vector1[2];

	let x2 = vector2[0];
	let y2 = vector2[1];
	let z2 = vector2[2];

	var numVertsToReturn=0;
	numVertsToReturn += buildRectangleXY(x1,y1,x2,y2,z1,c);
	numVertsToReturn += buildRectangleXY(x1,y1,x2,y2,z2,c2);

	numVertsToReturn += buildRectangleXZ(x1,z1,x2,z2,y1,c3);
	numVertsToReturn += buildRectangleXZ(x1,z1,x2,z2,y2,c4);
	
	numVertsToReturn += buildRectangleYZ(y1,z1,y2,z2,x1,c5);
	numVertsToReturn += buildRectangleYZ(y1,z1,y2,z2,x2,c6);
	return numVertsToReturn;
}
