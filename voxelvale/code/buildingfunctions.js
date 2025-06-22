


function build_thick_wireframe(length=1, c1=vec4(1,0,0,1), c2=vec4(1,0,0.3)){
	const thickness = 0.025;
	const offset = length/2;

	var mat;

	//TOP
	mat = translate(offset,0,0);
	build_line(thickness, mat, length,c1);

	mat = rotateZ(90);
	mat = mult(translate(length,offset,0), mat);
	build_line(thickness, mat, length,c1);

	mat = translate(offset,length,0);
	build_line(thickness, mat, length,c1);

	mat = rotateZ(90);
	mat = mult(translate(0,offset,0), mat);
	build_line(thickness, mat, length,c1);


	//Sides
	mat = rotateY(90);
	mat = mult(translate(0,0,offset), mat);
	build_line(thickness, mat, length,c1);

	mat = rotateY(90);
	mat = mult(translate(length,0,offset), mat);
	build_line(thickness, mat, length,c1);

	mat = rotateY(90);
	mat = mult(translate(0,length,offset), mat);
	build_line(thickness, mat, length,c1);

	mat = rotateY(90);
	mat = mult(translate(length,length,offset), mat);
	build_line(thickness, mat, length,c1);


	//Bottom
	mat = translate(offset,0,length);
	build_line(thickness, mat, length,c1);

	mat = rotateZ(90);
	mat = mult(translate(length,offset,length), mat);
	build_line(thickness, mat, length,c1);

	mat = translate(offset,length,length);
	build_line(thickness, mat, length,c1);

	mat = rotateZ(90);
	mat = mult(translate(0,offset,length), mat);
	build_line(thickness, mat, length,c1);

	//build_transparent_cursor(c2, 0.01);
	build_transparent_cursor(c2, 0.02);
}

function build_transparent_cursor(color, e=0){
	//e is the expansion
	// Bottom vertices.
	var p1 = vec3(1+e,1+e,1+e);
	var p2 = vec3(0-e,1+e,1+e);
	var p3 = vec3(1+e,0-e,1+e);
	var p4 = vec3(0-e,0-e,1+e);
	//Top vertices.
	var p5 = vec3(1+e,1+e,0-e);
	var p6 = vec3(0-e,1+e,0-e);
	var p7 = vec3(1+e,0-e,0-e);
	var p8 = vec3(0-e,0-e,0-e);


	//Don't build bottom and back face

	//Top face
	cursor_push(p8,p7,p5,color);
	cursor_push(p5,p6,p8,color);

	//Left face
	cursor_push(p6,p8,p2,color);
	cursor_push(p2,p4,p8,color);

	//Right face
	cursor_push(p5,p7,p1,color);
	cursor_push(p1,p3,p7,color);

	//Front face
	cursor_push(p8,p7,p4,color);
	cursor_push(p4,p3,p7,color);

	//Back face
	//cursor_push(p6,p5,p2,color);
	//cursor_push(p2,p1,p5,color);
}



/*
	Draws a line with thickness "thickness" between the points vec3(-length/2,0,0), and vec3(length/2,0,0).
	Then transforms it with the given matrix.
*/
function build_line(thickness, mat=mat4(), length=1, color=vec4(1,1,1,1)){
	var push_order = [];
	const offset = thickness/2;
	var p1,p2,p3,p4,p5,p6,p7,p8;
	
	// Left side face.
	p1 = vec4(-length/2, offset, offset,1);
	p2 = vec4(-length/2, -offset, offset,1);
	p3 = vec4(-length/2, offset, -offset,1);
	p4 = vec4(-length/2, -offset, -offset,1);
	push_order.push(p1,p2,p3,p4,p3,p2);

	// Right side face.
	p5 = vec4(length/2, offset, offset,1);
	p6 = vec4(length/2, -offset, offset,1);
	p7 = vec4(length/2, offset, -offset,1);
	p8 = vec4(length/2, -offset, -offset,1);
	push_order.push(p5,p6,p7,p8,p7,p6);

	//Back face
	push_order.push(p3,p1,p7,p5,p1,p7);

	//Top face
	push_order.push(p3,p7,p4,p8,p7,p4);

	//Front face
	push_order.push(p4,p2,p8,p6,p8,p2);

	//Bottom face
	push_order.push(p1,p2,p5,p6,p2,p5);

	for(let i = 0; i < push_order.length; i+=3){
		//Transform with the provided matrix.
		cursor_push(mult(mat,push_order[i]), mult(mat,push_order[i+1]),mult(mat,push_order[i+2]), color);
	}
}


function cursor_push(p1, p2, p3, c=vec4(1,0,0,1)){
	vertices.push(vec3(p1[0],p1[1],p1[2]));
	vertices.push(vec3(p2[0],p2[1],p2[2]));
	vertices.push(vec3(p3[0],p3[1],p3[2]));

	colours.push(c);
	colours.push(c);
	colours.push(c);
	for(var i =0; i < 3; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}