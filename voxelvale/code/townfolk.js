



/*
	Need:
		sendData(); 			I.e., build function.

		draw(); 

		onClick();				To open inventory.

		onHover();				Call 'drawContents().

		drawContents();			
*/
class TownFolk{
	constructor(pX,pY,pZ=-3){
		this.posX = pX;
		this.posY = pY;
		this.posZ = pZ;

		//For traversal/drawing.
		this.model = [];
		this.modelViewStack = [];


		this.angleFacing = 0;
		this.legAngle = 0;

		this.idleArms = 0;
		this.idleHead = 0;

		this.initialize(this.posX,this.posY,this.posZ);
	}

	static headStart = 0;
	static headNumber = 0;

	static shoulderStart = 0;
	static shoulderNumber = 0;

	static torsoStart = 0;
	static torsoNumber = 0;

	static legStart = 0;
	static legNumber = 0;

	static eyeStart = 0;
	static eyeNumber = 0;

	static headAccStart = 0;
	static headAccNumber = 0;

	static bodyId = 0;				get bodyId() {return this.constructor.bodyId;}
	static headId = 1;				get headId() {return this.constructor.headId;}
	static leftArmId = 2;			get leftArmId() {return this.constructor.leftArmId;}
	static rightArmId = 3;			get rightArmId() {return this.constructor.rightArmId;}
	static leftLegId = 4;			get leftLegId() {return this.constructor.leftLegId;}
	static rightLegId = 5;			get rightLegId() {return this.constructor.rightLegId;}
	static leftShoulderId = 6;		get leftShoulderId() {return this.constructor.leftShoulderId;}
	static rightShoulderId = 7;		get rightShoulderId() {return this.constructor.rightShoulderId;}
	static leftEyeId = 8;			get leftEyeId() {return this.constructor.leftEyeId;}
	static rightEyeId = 9;			get rightEyeId() {return this.constructor.rightEyeId;}

	static sendData(){
		flipPlayerNorms = true;
		this.headStart = vertices.length;
		build_human_head(hexToRgbA('#569756'));
		this.headNumber = vertices.length-this.headStart ;

		this.shoulderStart = vertices.length;//headVerts
		build_shoulder(hexToRgbA('#4c1e1e'));
		this.shoulderNumber =  vertices.length - this.shoulderStart;

		this.torsoStart = vertices.length;
		build_torso(hexToRgbA('#4c1e1e'));
		this.torsoNumber = vertices.length -  this.torsoStart; 

		this.legStart = vertices.length;
		build_leg(hexToRgbA('#151a29'));
		this.legNumber = vertices.length - this.legStart;

		this.eyeStart = vertices.length;
		build_eye(hexToRgbA('#670808'));
		this.eyeNumber = vertices.length - this.eyeStart;



		this.headAccStart = vertices.length;
		build_head_acc(vec4(1,0,0,1));
		this.headAccNumber = vertices.length - this.headAccStart;
	}

	static body(){
		var scalemat = scale4(BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH);
		var instanceMat = scalemat;
		instanceMat = mult(translate(0,0.25,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.torsoStart, TownFolk.torsoNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.torsoStart, TownFolk.torsoNumber);
		}
	}
	static head(){
		var instanceMat = scale4(1,1,1);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);

		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);
				gl.drawArrays(gl.TRIANGLES, TownFolk.headAccStart, TownFolk.headAccNumber);
		}
	}
	static left_arm(){
		var instanceMat = scale4(0.5,ARM_HEIGHT, BODY_DEPTH);
		instanceMat = mult(translate(0,-1,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);
		}
	}
	static right_arm(){
		var instanceMat = scale4(0.5,ARM_HEIGHT, BODY_DEPTH);
		instanceMat = mult(translate(0,-1,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.headStart, TownFolk.headNumber);
		}
	}
	static left_leg(){
		var instanceMat = scale4(0.5,APPENDAGE_HEIGHT, BODY_DEPTH);
		instanceMat = mult(translate(0,-1.25,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.legStart, TownFolk.legNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.legStart, TownFolk.legNumber);
		}
	}
	static right_leg(){
		var instanceMat = scale4(0.5,APPENDAGE_HEIGHT, BODY_DEPTH);
		instanceMat = mult(translate(0,-1.25,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES, TownFolk.legStart, TownFolk.legNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, TownFolk.legStart, TownFolk.legNumber);
		}
	}

	static left_shoulder(){
		var instanceMat = scale4(0.62,0.62,0.62);
		instanceMat = mult(translate(0,-0.2,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES,TownFolk.shoulderStart,TownFolk.shoulderNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,TownFolk.shoulderStart,TownFolk.shoulderNumber);
		}
	}

	static right_shoulder(){
		var instanceMat = scale4(0.62,0.62,0.62);
		instanceMat = mult(translate(0,-0.2,0),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES,TownFolk.shoulderStart,TownFolk.shoulderNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,TownFolk.shoulderStart,TownFolk.shoulderNumber);
		}
	}

	static left_eye(){
		var instanceMat = scale4(0.1,0.2,0.2);
		instanceMat = mult(translate(-0.25,0.1,-0.43),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES,TownFolk.eyeStart,TownFolk.eyeNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,TownFolk.eyeStart,TownFolk.eyeNumber);
		}
	}

	static right_eye(){
		var instanceMat = scale4(0.1,0.2,0.2);
		instanceMat = mult(translate(0.25,0.1,-0.43),instanceMat);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		if(enemyShadow){
			var thisModelViewMatrix = mult(modelViewMatrix, instanceMat);
			var modelViewShadow = mult(sMatrixForEnemy, thisModelViewMatrix);
			gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewShadow));
			gl.drawArrays(gl.TRIANGLES,TownFolk.eyeStart,TownFolk.eyeNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,TownFolk.eyeStart,TownFolk.eyeNumber);
		}
	}

	initialize(X=0,Y=0,Z=0){
		this.update_node(this.bodyId, X,Y,Z);
		this.update_node(this.headId);
		this.update_node(this.leftArmId);
		this.update_node(this.rightArmId);
		this.update_node(this.leftLegId);
		this.update_node(this.rightLegId);
		this.update_node(this.leftShoulderId);
		this.update_node(this.rightShoulderId);
		this.update_node(this.leftEyeId);
		this.update_node(this.rightEyeId);
		this.update_node(this.toolId);
	}

	update_node(id, X = this.posX, Y = this.posY, Z = this.posZ){
		var m = mat4();
		X+=0.5;
		Y+=0.5
		switch(id){
			case bodyId:
				m = scale4(0.5,0.5,0.5);
				m = mult(m, rotateX(-90));
				m = mult(m, rotateY(this.angleFacing));
				m = mult(translate(X,Y,Z,0),m);
				this.model[this.bodyId] = create_node(m, this.constructor.body, null, this.headId);
				break;
			case headId:
				m = translate(0,1.5,0,0);
				this.model[this.headId] = create_node(m, this.constructor.head, this.leftArmId, this.leftEyeId);
				break;
			case leftArmId:
				m = rotateX(0);
				m = mult(translate(-0.75,1.125,0,0),m);
				this.model[this.leftArmId] = create_node(m, this.constructor.left_arm, this.rightArmId, this.leftShoulderId);
				break;
			case rightArmId:
				m = rotateX(this.idleArms);
				m = rotateZ(this.idleArms);
				m = mult(translate(0.75,1.125,0,0),m);
				this.model[this.rightArmId] = create_node(m, this.constructor.right_arm, this.leftLegId, this.rightShoulderId);
				break;
			case leftLegId:
				m = rotateX(-this.legAngle);
				m = mult(translate(-0.25,-0.25,0,0),m);
				this.model[this.leftLegId] = create_node(m,this.constructor.left_leg, this.rightLegId, null);
				break;
			case rightLegId:
				m = rotateX(this.legAngle);
				m = mult(translate(0.25,-0.25,0,0),m);
				this.model[this.rightLegId] = create_node(m,this.constructor.right_leg, null,null);
				break;
			case leftShoulderId:
				this.model[this.leftShoulderId] = create_node(m, this.constructor.left_shoulder,null,null); 
				break;
			case rightShoulderId:
				this.model[this.rightShoulderId] = create_node(m, this.constructor.right_shoulder, null, null);
				break;
			case leftEyeId:
				this.model[this.leftEyeId] = create_node(m, this.constructor.left_eye,rightEyeId,null);
				break;
			case rightEyeId:
				this.model[this.rightEyeId] = create_node(m, this.constructor.right_eye, null,null);
				break;
		}
	}

	traverse(id){
		if(id==null) return;

		this.modelViewStack.push(modelViewMatrix);
		modelViewMatrix = mult(modelViewMatrix, this.model[id].transform);
		this.model[id].render();

		if(this.model[id].child != null)
			this.traverse(this.model[id].child);
		modelViewMatrix = this.modelViewStack.pop();
		if(this.model[id].sibling != null)
			this.traverse(this.model[id].sibling);
		return;
	}

	update(){
		this.update_node(this.bodyId);
		//Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5
		if(this.posX == Math.round((coorSys[0]+player.posX)-9) &&  this.posY == Math.round((coorSys[1]+player.posY-4.5)) ){
			this.onHover();
		}

		if(this.idleArms < 10){
			this.idleArms += 1;
		}else{
			this.idleArms -= 1;
		}


		this.update_node(this.rightArmId);
		this.update_node(this.leftArmId);

		
	}

	fireClick(){
		if(this.posX == Math.round((coorSys[0]+player.posX)-9) &&  this.posY == Math.round((coorSys[1]+player.posY-4.5)) ){
			this.onClick();
		}
	}

	draw(){
	}

	onClick(){
		console.log('poop ass')
	}

	drawContents(){
		if(inventory|| inFunction) return;
		
		let drawWidth = 0.4;
		let drawHeight = 0.25;
		let c = vec4(-drawWidth-0.125,drawHeight,0,1);
		let c2 = vec4(drawWidth+0.125,drawHeight+0.1,0,1);
		
		let zVal = -6+1.25;
		c = mult(translate(this.posX+0.5,this.posY,zVal), c);
		c = mult(modelViewMatrix, c);
		c = mult(projectionMatrix, c);


		c2 = mult(translate(this.posX+0.5,this.posY,zVal), c2);
		c2 = mult(modelViewMatrix, c2);
		c2 = mult(projectionMatrix, c2);


		c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5];
		c2 = [(c2[0]/c2[3]+1)*8,(c2[1]/c2[3]+1)*4.5];

		this.displayWidth = 1;
		//draw_healthbar(c[0], c[1], c2[0], c2[1], 1, 1,40,1)	
		//draw_filled_box(c[0]-this.displayWidth/2,c[1],c[0]+this.displayWidth/2,c[1]+(1.35)*0.17);
		draw_filled_box(c[0],c[1],c2[0],c[1]+(1.35)*0.17);
		draw_centered_text((c[0]+c2[0])/2,c[1]+0.1,"Close door.",'12');
	}

	onHover(){
		this.drawContents();
	}

}