
/*
	Functions for the lines that come out of the bottom of the cursor block.

*/

function build_cursor_lines_green(){
	build_line(0.025, mat4(), 0.5, vec4(0,1,0,0.4));
}

function build_cursor_lines_red(){
	build_line(0.025, mat4(), 0.5, vec4(1,0,0,0.4));
}


var zPosMove = 0;
function draw_cursor_lines(X=0,Y=0,Z=0){
	//cursorBytes[1][0] starting point.
	//cursorBytes[1][1] number of vertices.
	var index = 2;
	if(cursorGreen)
		index=1;

	var mat = rotateY(90);
	var zPos = 0;
	var inset = 0.05;
	zPosMove += (0.02);
	if(zPosMove > 1)
		zPosMove = 0;
	//Maybe draw a gl line in the middle of each?
	for(let i = -1; i < 5; i++){
		zPos = Z+1.25+i;

		//Bottom Left
		mat = mult(translate(X+inset,Y+inset,zPos+zPosMove), rotateY(90));
		set_mv(mat);
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);

		//Bottom Right
		mat = mult(translate(X+1-inset,Y+inset,zPos+zPosMove), rotateY(90));
		set_mv(mat);
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);

		//Top Left
		mat = mult(translate(X+inset,Y+1-inset,zPos+zPosMove), rotateY(90));
		set_mv(mat);
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);

		//Top Right
		mat = mult(translate(X+1-inset,Y+1-inset,zPos+zPosMove), rotateY(90));
		set_mv(mat);
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);
	}
}



/*
	Cursor draw functions
*/
function draw_cursor_block(X=0,Y=0,Z=0,Block=null){
	
	if (Block != null){
		var index=-1;
		if(cursorGreen){
			index = 3;
		}else{
			index = 4;
		}
	
		var mat = mult(translate(X,Y,Z),mult(translate(0.5,0.5,0.5),mult(scale4(1.005,1.005,1.005),translate(-0.5,-0.5,-0.5))));


		gl.uniform1i(cursorBlockLoc, true);
		Block.drawCursor(mult(modelViewMatrix,mat));
		gl.uniform1i(cursorBlockLoc, false);

		if(!Block.isTall){
			set_mv(translate(X,Y,Z));
			gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);
		}else{
			set_mv(mult(translate(X,Y,Z-1),scale4(1,1,2)));
			gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);
		}
		draw_cursor_lines(X,Y,Z);

	}else{
		set_mv(translate(X,Y,Z));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],cursorBytes[index][1]);
		set_mv(translate(-X,-Y,-Z));	
	}
}


function draw_cursor_point(X=0,Y=0,Z=0){
	if(cursorDisplayTimer < cursorFramesToDisappear){
		gl.disable(gl.DEPTH_TEST);
		set_mv(translate(X,Y,Z));
		gl.drawArrays(gl.POINT,cursorBytes[0][0],cursorBytes[0][1]);
		set_mv(translate(-X,-Y,-Z));
		gl.enable(gl.DEPTH_TEST);
	}
}


function updateCursorColour(){
	cursorGreen=false;
	heldItem = player.heldObject;
    
	// This may need to be removed, because we want to change the small cursor color if you can interact with a block.
    if(heldItem == null){
		return;
	}

	var xCoor, yCoor;
    if(fixedView){
    	xCoor = (coorSys[0]+player.posX)-9;
    	yCoor = (coorSys[1]+player.posY)-4.5;
    	selectedBlock = currentDungeon.getBlockAt(Math.round(xCoor),Math.round(yCoor),upOne); 
    }else{
    	xCoor = (coorSys[0]+player.posX)-9;
    	yCoor = (coorSys[1]+player.posY)-4.5;
    	selectedBlock = world.getBlockAt(Math.round(xCoor),Math.round(yCoor),upOne);
    }

    /*
		Handle the case where the selected block is too close to the player.
		I think placing/destroying above the player is fine, but not within the player, or below the player.

		So blocks that are at the same height as the player are those at z = -3, and z = -4 (I think).
		The block directly beneath the player is at z = -2 (again, I think).
    */
    //var cursorCoords = String(Math.round((coorSys[0]+player.posX)-9))+" "+String(Math.round((coorSys[1]+player.posY)-4.5))+" "+String(upOne);
    //var playerCoords = String(player.posX) + " " + String(player.posY) + " " + String(player.posZ);
    //text_log("Cursor Coords: "+cursorCoords + " Player Coords: "+playerCoords  )

    if(Math.abs((player.posX-0.5) - xCoor) <= 0.75 && Math.abs( (player.posY-0.5) - yCoor) <= 0.75){
    	if(heldItem.typeOfObj == 'ITEM' && upOne == -2){
    		cursorGreen = false;
			return;
    	}
    	if(heldItem.typeOfObj == 'BLOCK' && (upOne == -3 || upOne == -4)){
    		cursorGreen = false;
    		return;
    	}
    	
    }
	

	if(selectedBlock == null){
		if(heldItem.typeOfObj == 'BLOCK'){
			if(heldItem.isTall){
				var aboveSelectedBlock = world.getBlockAt(Math.round(xCoor),Math.round(yCoor),upOne-1);
				if(aboveSelectedBlock == null && upOne == -3){
					cursorGreen = true;
				}

			}else{
				cursorGreen = true;
			}
		}else if(heldItem.typeOfObj == 'ITEM'){
			cursorGreen = false;
		}
		return;
	}


	if(heldItem.typeOfObj == 'BLOCK'){

		if(selectedBlock == null)
			cursorGreen=true;
	}else if(heldItem.typeOfObj == 'ITEM'){
		if(heldItem.type=='TOOL'){
			switch(heldItem.toolType){
				case 'AXE':
					if(selectedBlock.tob=='WOOD'){
						cursorGreen=true;
					}
				break;
				case 'PICK_AXE':
					if(selectedBlock.tob=='STONE'){
						cursorGreen=true;
					}
				break;
			}
		}
	}
	return;
}

function draw_cursor(X=0,Y=0,Z=0){
	var index=-1;
	if(cursorGreen){
		index = 3;
	}else{
		index = 4;
	}
	set_mv(translate(X,Y,Z) );
	gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0],36*12);
	
	if(index == 3){
		//This is the max value. (blockCounterMax/player.heldObject.strength)
		//So to normalize, we have
		var normalizedBlockCounter = blockCounter/(blockCounterMax/player.heldObject.strength);
		var nbc = 1 - normalizedBlockCounter;
		var mat;

		//TOP
		mat = mult(translate(0.5,0.5,0), mult(scale4(nbc,nbc,nbc),translate(-0.5,-0.5,0)));
		set_mv(mult(translate(X,Y,Z), mat ) );
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0]+36*12, 6);

		//LEFT
		mat = mult(translate(0,0.5,0.5), mult(scale4(nbc,nbc,nbc),translate(0,-0.5,-0.5)));
		set_mv(mult(translate(X,Y,Z), mat ) );
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0]+36*12+6, 6);

		//RIGHT
		mat = mult(translate(1,0.5,0.5), mult(scale4(nbc,nbc,nbc),translate(-1,-0.5,-0.5)));
		set_mv(mult(translate(X,Y,Z), mat ) );
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0]+36*12+12, 6);


		//FRONT
		mat = mult(translate(0.5,0,0.5), mult(scale4(nbc,nbc,nbc),translate(-0.5,0,-0.5)));
		set_mv(mult(translate(X,Y,Z), mat ) );
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0]+36*12+18, 6);

		draw_cursor_lines(X,Y,Z);
	}else{
		gl.drawArrays(gl.TRIANGLES,cursorBytes[index][0]+36*12, 6*4);
		draw_cursor_lines(X,Y,Z);
	}
}


/*
	OLD

function draw_cursor(X=0,Y=0,Z=0){
	//set_mv(translate(X-0.5,Y-0.5,Z));
	set_mv(translate(X,Y,Z));
	if(cursorGreen==false)
		gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
	else
		gl.drawArrays(gl.LINES,startPositionOfGreenWireframe,totalVerticesOfGreenWireframe);
	set_mv(translate(-X,-Y,-Z));
}
*/