





/*
	build_line(thickness, mat=mat4(), length=1, color=vec4(1,1,1,1))

	Draws a line with thickness "thickness" between the points vec3(-length/2,0,0), and vec3(length/2,0,0).
	Then transforms it with the given matrix.

	Can mess around with matrix functions in the console!

*/


function build_line_between_points(point1 = vec3(0,0,0), point2 = vec3(1,1,1), thickness = 0.025, color=vec4(1,1,1,1)){

	//First, find length 

	//let source1 = vec3(-1,0,0);
	//let source2 = vec3(1,0,0);


	/*
		point1 = vec3(a,b,c)

		point2 = vec3(x,y,z);


		Transform the vectors vec3(-q,0,0) and vec3(q,0,0) to these two use one matrix. (assume they are the same magnitude)


		
	*/

}


/*
	For an individual line
*/
function wireframe_line(v1 ,v2, c=vec4(1,1,1,1)){
	vertices.push(v1);
	vertices.push(v2);

	colours.push(c);
	colours.push(c);

	for(var i =0; i < 2; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

function wireframe_prism(p1,p2){
	let x1 = p1[0];
	let y1 = p1[1];
	let z1 = p1[2];

	let x2 = p2[0];
	let y2 = p2[1];
	let z2 = p2[2];


	let v1,v2,v3,v4,v5,v6,v7,v8;
	//Lower
	v1 = vec3(x1,y1,z1);
	v2 = vec3(x2,y1,z1);
	v3 = vec3(x2,y2,z1);
	v4 = vec3(x1,y2,z1);

	wireframe_line(v1,v2);
	wireframe_line(v2,v3);
	wireframe_line(v3,v4);
	wireframe_line(v4,v1);

	v5 = vec3(x1,y1,-z1);
	v6 = vec3(x2,y1,-z1);
	v7 = vec3(x2,y2,-z1);
	v8 = vec3(x1,y2,-z1);

	wireframe_line(v5,v6);
	wireframe_line(v6,v7);
	wireframe_line(v7,v8);
	wireframe_line(v8,v5);

	//Connect on z1
	wireframe_line(v1,v5);
	wireframe_line(v2,v6);
	wireframe_line(v3,v7);
	wireframe_line(v4,v8);



	//Upper

}


function build_pickaxe_wireframe(){


	wireframe_prism(vec3(0.25,2.5,-0.025),vec3(0,2.4,0.025));	// Top bit.			Highest y: 2.5
	wireframe_prism(vec3(0,2,-0.025), vec3(0.25,0.05,0.025));	// Handle.			Lowest y: 0.05
	wireframe_prism(vec3(0.35,2.4,-0.05), vec3(-0.1,2,0.05));	// Midsection.

	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.7,1.8,0);
	var v3=vec3(0.7,1.8,0);
	var v4=vec3(0.35,2.4,0.05);

	buildArbQuadrilateral(v1,v2,v3,v4,vec4(1,1,1,1));
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,vec4(1,1,1,1));

	var v1=vec3(-0.1,2,0.05);
	var v2=vec3(-0.45,1.8,0);
	var v3=vec3(-0.45,1.8,0);
	var v4=vec3(-0.1,2.4,0.05);
	buildArbQuadrilateral(v2,v1,v4,v3,vec4(1,1,1,1));
	v1=vec3(-0.1,2,-0.05);
	v4=vec3(-0.1,2.4,-0.05);
	buildArbQuadrilateral(v2,v1,v4,v3,vec4(1,1,1,1));

	return;
}



function build_sword_wireframe(){


	var white=vec4(1,1,1,1);
	
	let handleHeight = 0.5;
	let guardHeight = 0.15;
	let guardWidth = 0.1
	let bladeHeight = 2.5;


	//ADD A PUMMEL!
	// Hilt
	wireframe_prism(vec3(0,0.20,-0.05),vec3(0.25,0.05,0.05));	//Pummel
	wireframe_prism(vec3(0.05,0.2+handleHeight,-0.025),vec3(0.2,0.05,0.025))	//Handle
	wireframe_prism(vec3(-0.1-guardWidth/2,0.2+handleHeight+guardHeight,-0.05), vec3(0.35+guardWidth/2,0.2+handleHeight,0.05));			//Guard
	wireframe_prism(vec3(0.05,bladeHeight, -0.025),vec3(0.2,0.2+handleHeight+guardHeight,0.025));		//Sword prism/Center of blade.

	
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

	//wireframe_line(v2,v3);
	wireframe_line(p1,p2);
	wireframe_line(p1,v1);
	wireframe_line(p1,v3);
	wireframe_line(p2,v2);
	wireframe_line(p2,v4);

	 //Vertices out right face.
	v1 = vec3(0.2,bladeHeight, -0.025);
	v2 = vec3(0.2,0.2+handleHeight+guardHeight, -0.025);
	v3 = vec3(0.2,bladeHeight, 0.025);
	v4 = vec3(0.2,0.2+handleHeight+guardHeight,0.025);

	//Edge vertices.
	p1 = vec3(0.25,bladeHeight,0);
	p2 = vec3(0.25,0.2+handleHeight+guardHeight,0);

	wireframe_line(p1,p2);
	wireframe_line(p1,v1);
	wireframe_line(p1,v3);
	wireframe_line(p2,v2);
	wireframe_line(p2,v4);


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


	wireframe_line(p1,p2);
	wireframe_line(p1,v1);
	wireframe_line(p1,v2);
	wireframe_line(p2,v3);
	wireframe_line(p2,v4);

	v1 = vec3(0,bladeHeight,0);
	v2 = vec3(0.25,bladeHeight,0);
	wireframe_line(p1,v1);
	wireframe_line(p2,v2);



	return;
}

function build_axe_wireframe(){


	wireframe_prism(vec3(0.25,2.5,-0.025),vec3(0,2.4,0.025));
	wireframe_prism(vec3(0,2,-0.025), vec3(0.25,0.05,0.025));
	wireframe_prism(vec3(0.35,2.4,-0.05), vec3(-0.1,2,0.05));

	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.7,1.8,0);
	var v3=vec3(0.7,1.8,0);
	var v4=vec3(0.35,2.4,0.05);

	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);

	// Head of the axe.
	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.6,1.8,0);
	var v3=vec3(0.6,2.6,0);
	var v4=vec3(0.35,2.4,0.05);

	//Outer line.
	wireframe_line(v2,v3);

	wireframe_line(v2,v1);
	wireframe_line(v3,v4);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	wireframe_line(v2,v1)
	wireframe_line(v3,v4);


	// Back of Axe.
	v1=vec3(-0.1,2,0.05);
	v2=vec3(-0.1,2.4,0.05);
	v3=vec3(-0.25,2.45,0);
	v4=vec3(-0.25,1.95,0);

	//Outer line
	wireframe_line(v3,v4);

	wireframe_line(v3,v2);
	wireframe_line(v4,v1);
	v1=vec3(-0.1,2,-0.05);
	v2=vec3(-0.1,2.4,-0.05);
	wireframe_line(v3,v2);
	wireframe_line(v4,v1);

	return;
}


function build_axe_blue(cB = vec4(0.5,0.5,0.5,1)){

	var colourHandle=vec4(0.9,0.6,0.15,1);

	colourHandle = mult_colors(colourHandle,recipeColor);
	let colourBlade = mult_colors(cB, recipeColor);

	buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colourHandle);
	buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colourHandle);
	buildRectangularPrism(0.35,2.4,-0.05, -0.1,2,0.05,colourBlade);

	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.6,1.8,0);
	var v3=vec3(0.6,2.6,0);
	var v4=vec3(0.35,2.4,0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);

	v1=vec3(0.6,2.6,0);
	v2=vec3(0.35,2.4,-0.05);
	v3=vec3(0.35,2.4,0.05);
	pushvs(v1,v2,v3,colourBlade);
	v1=vec3(0.6,1.8,0);
	v2=vec3(0.35,2,-0.05);
	v3=vec3(0.35,2,0.05);
	pushvs(v1,v2,v3,colourBlade);


	v1=vec3(-0.1,2,0.05);
	v2=vec3(-0.1,2.4,0.05);
	v3=vec3(-0.25,2.45,0);
	v4=vec3(-0.25,1.95,0);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);
	v1=vec3(-0.1,2,-0.05);
	v2=vec3(-0.1,2.4,-0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);
	
	v1=vec3(-0.1,2.4,0.05);
	v2=vec3(-0.1,2.4,-0.05);
	v3=vec3(-0.25,2.45,0);
	pushvs(v1,v2,v3,colourBlade);
	v1=vec3(-0.1,2,0.05);
	v2=vec3(-0.1,2,-0.05);
	v3=vec3(-0.25,1.95,0);
	pushvs(v1,v2,v3,colourBlade);
	return;
}

function build_pickaxe_blue(cB = vec4(0.5,0.5,0.5,1)){

	var colourHandle=vec4(0.9,0.6,0.15,1);

	colourHandle = mult_colors(colourHandle,recipeColor);
	let colourBlade = mult_colors(cB, recipeColor);

	buildRectangularPrism(0,2,-0.025,0.25,0.05,0.025,colourHandle);		//Handle
	buildRectangularPrism(0.25,2.5,-0.025,0,2.4,0.025,colourHandle);	//Top bit
	buildRectangularPrism(0.35,2.4,-0.05, -0.1,2,0.05,colourBlade);
	var v1=vec3(0.35,2,0.05);
	var v2=vec3(0.7,1.8,0);
	var v3=vec3(0.7,1.8,0);
	var v4=vec3(0.35,2.4,0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);
	v1=vec3(0.35,2,-0.05);
	v4=vec3(0.35,2.4,-0.05);
	buildArbQuadrilateral(v1,v2,v3,v4,colourBlade);
	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2.4,-0.05);
	v3=vec3(0.35,2.4,0.05);
	pushvs(v1,v2,v3,colourBlade);
	v1=vec3(0.7,1.8,0);
	v2=vec3(0.35,2,-0.05);
	v3=vec3(0.35,2,0.05);
	pushvs(v1,v2,v3,colourBlade);

	var v1=vec3(-0.1,2,0.05);
	var v2=vec3(-0.45,1.8,0);
	var v3=vec3(-0.45,1.8,0);
	var v4=vec3(-0.1,2.4,0.05);
	buildArbQuadrilateral(v2,v1,v4,v3,colourBlade);
	v1=vec3(-0.1,2,-0.05);
	v4=vec3(-0.1,2.4,-0.05);
	buildArbQuadrilateral(v2,v1,v4,v3,colourBlade);
	v1=vec3(-0.45,1.8,0);
	v2=vec3(-0.1,2.4,-0.05);
	v3=vec3(-0.1,2.4,0.05);
	pushvs(v1,v3,v2,colourBlade);
	v1=vec3(-0.45,1.8,0);
	v2=vec3(-0.1,2,-0.05);
	v3=vec3(-0.1,2,0.05);
	pushvs(v1,v3,v2,colourBlade);
	return;
}
