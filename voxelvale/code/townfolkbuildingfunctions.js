






function build_human_head(c = vec4(1.0,0.7,0.50,1)){
	var topVerts=[];
	var leftVerts=[];
	var rightVerts=[];
	var faceVerts=[];
	var backVerts=[];
	var bottomVerts=[];
	var soften = 0.2;
	//var soften = 0.0;
	var p = 0;
	for(var i=0; i < vertexP.length; i++){
		var vertsPush = soften_edge(vertexP[i],vec3(0.0,0.0,0.0),soften);
		for(var j = 0; j < vertsPush.length; j++){
			if(vertsPush[j][2] == -0.5){
				faceVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][2] == 0.5){
				backVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][1] == 0.5){
				topVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][1] == -0.5){
				bottomVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][0] == 0.5){
				rightVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][0] == -0.5){
				leftVerts.push(vertsPush[j]);
			}
		}
		var pushOrder = [vertsPush[0],vertsPush[1],vertsPush[3],vertsPush[1],vertsPush[2],vertsPush[3],vertsPush[0],vertsPush[2],vertsPush[3]];
		for(var j = 0; j < pushOrder.length; j+=3){
			special_push(pushOrder[j],pushOrder[j+1],pushOrder[j+2],c);
		}
	}
	
	//Top of head.
	draw_z_face(faceVerts,soften,c);
	//Bottom of head.
	draw_z_face(backVerts,soften,c);

	//Left of head.
	draw_x_face_fixed(leftVerts,soften,c);
	//Right of head.
	draw_x_face(rightVerts,soften,c);

	//Back of head.
	draw_y_face(topVerts,soften,c);
	//Front of head (where the face is I guess).
	draw_y_face(bottomVerts,soften,c);

	return;
}





function draw_x_face_fixed(vertArray,soften, c = vec4(1.0,0.7,0.50,1)){
	var tL, tR, bL, bR;
	var tX = vertArray[0][0];

	tL = vec3(tX, 0.5-soften,-0.5+soften);
	tR = vec3(tX, 0.5-soften,0.5-soften);
	bR = vec3(tX, -0.5+soften,0.5-soften);
	bL = vec3(tX, -0.5+soften,-0.5+soften);

	//Corners.
	special_push(vertArray[6],vertArray[7],tL,c);
	special_push(vertArray[4],vertArray[5],bL,c);
	special_push(vertArray[0],vertArray[1],bR,c);
	special_push(vertArray[2],vertArray[3],tR,c);
	

	//Top strip.	
	special_push(vertArray[4],vertArray[6],tL,c);
	special_push(vertArray[4],bL,tL,c);

	//Bottom strip.
	special_push(tR,bR,vertArray[2],c);
	special_push(vertArray[2],vertArray[0],bR,c);

	//Left strip.
	special_push(vertArray[7], tL, vertArray[3], c);
	special_push(vertArray[3], tR, tL, c);

	//Right strip
	special_push(bL, vertArray[5], bR, c);
	special_push(bR,vertArray[1],vertArray[5],c);


	//Center square.
	special_push(tL, bL, tR, c);
	special_push(bL, bR, tR, c);

	return;
}