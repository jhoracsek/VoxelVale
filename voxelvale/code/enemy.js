//Should extend humanoid or something, figure it out later
//This should extend ENEMY, which extends humanoid
//Since whenever a new enemy is created the universalEnemyID increases.
var universalEnemyId;


var boxX = 0.40;
var boxY = 0.40;
//var boxX = 0.25;
//var boxY = 0.25;
var enemyShadow = false;

//var undeadHitboxBounds = [vec3(-boxX,-boxY,1.25), vec3(boxX,boxY,3.1)];
var undeadHitboxBounds = [vec3(-boxX,-boxY,-2), vec3(boxX,boxY,4.1)];

let undeadhurtBoxSize = [1.2,1.2]
var undeadHurtBox = [vec4(-undeadhurtBoxSize[0]/2,-0.7,-2,1), vec4(undeadhurtBoxSize[0]/2,0.25,2,1)]

class Undead extends Humanoid{
	constructor(X,Y,Z){
		super(X,Y,Z);
		this.model=[];

		this.modelViewStack=[];

		this.angleFacing = 0;
		this.legAngle = 0;
		this.switchDirection=false;

		this.stuck=false;
		this.stuckWith=[];
		
		this.ID = universalEnemyId;

		this.speed = 0.045;
		//this.speed = Math.random() * 0.05 + 0.04;
		this.maxSpeed = 0.045;
		this.initialSpeed = 0.04;
		universalEnemyId++;

		this.posXNew=this.posX;
		this.posYNew=this.posY;

		this.cooldownMax = 10;
		this.verticleCooldown = 0;
		this.horizontalCooldown = 0;

		this.invulnerable = 0;
		this.invulnerableTime = 15;
		this.flash = false;

		this.knockbackTimer = 0;
		this.knockbackDirection = [0,0];
		this.knockbackFrames = 5;
		this.knockbackFactor = 1.2;

		this.isStuck = [false, false, false, false];

		this.particleColor = vec3(0.3, 0, 0);

		this.zDrawHeight = 3.25-0.0005 + (Math.random()*0.001);
		this.drawOffset = -0.0005 + (Math.random()*0.001);
		this.displayWidth = 2;

		this.displayToolbar=false;
		this.healthOpacity = 0;

		this.fullHealthOpacityTimer = 0;
		this.fullHealthOpacityTimerMax = 60*4;

		this.hitHurtBox = new HitBox(undeadHurtBox, Undead.hitHurtBoxStart, Undead.hitHurtBoxNumber, this);

		
		this.particleCooldownMax = 20;
		this.particleCooldown = 0;

		this.silverDropped = 62 + roll_n_sided_die(14);

		this.drawDeathTimer = false;
	}

	isEqual(otherEnemy){
		if(this.ID==otherEnemy.ID)
			return true;
		return false;
	}

	drawShadows(){

		enemyShadow = true;
		this.traverse(bodyId);
		enemyShadow = false;
	}
	/*
		Change to draw health bar and take a matrix as an argument.
	*/
	drawContents(){
		if(inventory|| inFunction) return;
		/*
	
		*/
		let drawWidth = 0.25;
		let drawHeight = 0.25;
		let c = vec4(-drawWidth-0.125,drawHeight,0,1);
		let c2 = vec4(drawWidth+0.125,drawHeight+0.1,0,1);
		//let zVal = this.posZ+1.25;// best so far
		//let zVal = this.posZ;

		//After I fixed the zPosition stuff
		let zVal = -6+1.25;
		c = mult(translate(this.posX,this.posY,zVal), c);
		c = mult(modelViewMatrix, c);
		c = mult(viewModMatrix, c);
		c = mult(projectionMatrix, c);


		c2 = mult(translate(this.posX,this.posY,zVal), c2);
		c2 = mult(modelViewMatrix, c2);
		c2 = mult(viewModMatrix, c2);
		c2 = mult(projectionMatrix, c2);


		c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5];
		c2 = [(c2[0]/c2[3]+1)*8,(c2[1]/c2[3]+1)*4.5];

		//draw_test_line(c[0], c[1], c2[0], c2[1])
		if(this.fullHealthOpacityTimer > 0){
			draw_healthbar(c[0], c[1], c2[0], c2[1], this.health, this.maxHealth,40,1)	
		}else{
			draw_healthbar(c[0], c[1], c2[0], c2[1], this.health, this.maxHealth,40,this.healthOpacity)
		}
		//draw_c_line(x1,y1,x2,y2, c='#FFFFFF'){

		//draw_filled_box(c[0]-this.displayWidth/2,c[1],c[0]+this.displayWidth/2,c[1]+(1.3)*0.17);


		//draw_centered_text(c[0],c[1]+0.1,"Use workbench.",'12');
	}

	hit(angle, damage = 1){
		this.fullHealthOpacityTimer=this.fullHealthOpacityTimerMax;
		if(this.invulnerable <= 0){
			this.health -= damage;
			this.particleCooldown = this.particleCooldownMax;
			this.knockbackTimer = this.knockbackFrames;
			let rad = angle*(Math.PI/180);
			this.knockbackDirection = [-Math.sin(rad)/this.knockbackFrames, Math.cos(rad)/this.knockbackFrames];

			//Remove this.
			//this.posXNew-=Math.sin(Math.PI*angle/180);
			//this.posYNew+=Math.cos(Math.PI*angle/180);
			//-------------

			if(this.checkIfDead()){
				this.died();
			}else{

			}
			

			this.invulnerable = this.invulnerableTime;
		}
		//this.posX--;	
	}

	knockback(){
		//if(!this.isStuck){
		//	this.posXNew += this.knockbackDirection[0]*this.knockbackFactor;
		//	this.posYNew += this.knockbackDirection[1]*this.knockbackFactor;
		//}
		//return;

		let directions = [false, false, false, false];
		if(this.knockbackDirection[0] < 0){
			directions[0] = true;
		}else if(this.knockbackDirection[0] > 0){
			directions[1] = true;
		}
		if(this.knockbackDirection[1] < 0){
			directions[3] = true;
		}else if(this.knockbackDirection[1] > 0){
			directions[2] = true;
		}
		let colDirections = this.isStuck;
		if(	(colDirections[0] && directions[0]) || (colDirections[1] && directions[1]) || (colDirections[2] && directions[2]) || (colDirections[3] && directions[3]) 	){
			
			this.posXNew -= this.knockbackDirection[0];
			this.posYNew -= this.knockbackDirection[1];
			this.knockbackTimer = 0;
			return;
		}
		this.posXNew += this.knockbackDirection[0]*this.knockbackFactor;
		this.posYNew += this.knockbackDirection[1]*this.knockbackFactor;
	}

	spawnParticles(){
		if(this.particleCooldown > 0)
			return;
		/*
			Spawn particles
		*/
		var numParticles = Math.round(Math.random()*6) + 6;

		for (let i = 0; i < numParticles; i++){
			var zOffset = Math.random();
			var xOffset = Math.random()-0.5;
			var yOffset = Math.random()-0.5;
			new Particle(this.posXNew+xOffset-0.5,this.posYNew+yOffset-0.5,this.posZ+zOffset, this.particleColor);
		}
	}

	/*
		Move to enemy class?
	*/
	died(){
		this.spawnParticles();
		this.drawDeathTimer = true;

		player.increaseSilver(this.silverDropped);
		
		let worldObj;
		if(inDungeon) worldObj = currentDungeon;
		else worldObj = world;

		let r;
		r = Math.random();

		if(r < 0.5)
			enemy_drop(worldObj, new HealthPotion(), this.posX, this.posY);

		//How many additional drops?
		//In expectation.
		/*
			BrickBlockRecipe
			CopperBarRecipe
			CopperPickRecipe
			CopperAxeRecipe
		*/
		
		
		//Drops copper stuff for convience recipe.
		r = Math.random();
		if(r < 0.2){
			let dice_roll = roll_n_sided_die(2);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperBarRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new CopperPickRecipe(), this.posX, this.posY);
					break;
			}
		}

		r = Math.random();
		if(r < 0.15){
			let dice_roll = roll_n_sided_die(4);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperAxeRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new CopperSwordRecipe(), this.posX, this.posY);
					break;
				case 2:
					enemy_drop(worldObj, new LatkinBarRecipe(), this.posX, this.posY);
					break;
				case 3:
					enemy_drop(worldObj, new LatkinPickRecipe(), this.posX, this.posY);
					break;
			}
		}
	}

	initialize_enemy(){
		this.initialize_node(bodyId);
		this.initialize_node(headId);
		this.initialize_node(leftArmId);
		this.initialize_node(rightArmId);
		this.initialize_node(leftLegId);
		this.initialize_node(rightLegId);
		this.initialize_node(leftShoulderId);
		this.initialize_node(rightShoulderId);
		this.initialize_node(leftEyeId);
		this.initialize_node(rightEyeId);
		this.initialize_node(toolId);
	}
	initialize_node(id,X=0,Y=0,Z=0){
		var m = mat4();
		//Z=-this.zDrawHeight;
		Z+=this.drawOffset;
		switch(id){
			case bodyId:
				m = scale4(0.5,0.5,0.5);
				m = mult(m, rotateX(-90));
				m = mult(m, rotateY(this.angleFacing));
				m = mult(translate(X,Y,Z,0),m);
				this.model[bodyId] = create_node(m, Undead.body, null, headId);
				break;
			case headId:
				m = translate(0,1.5,0,0);
				this.model[headId] = create_node(m, Undead.head, leftArmId, leftEyeId);
				break;
			case leftArmId:
				m = rotateX(90);
				m = mult(translate(-0.75,1.125,0,0),m);
				this.model[leftArmId] = create_node(m, Undead.left_arm, rightArmId, leftShoulderId);
				break;
			case rightArmId:
				m = rotateX(90);
				m = mult(translate(0.75,1.125,0,0),m);
				this.model[rightArmId] = create_node(m, Undead.right_arm, leftLegId, rightShoulderId);
				break;
			case leftLegId:
				m = rotateX(-this.legAngle);
				m = mult(translate(-0.25,-0.25,0,0),m);
				this.model[leftLegId] = create_node(m,Undead.left_leg, rightLegId, null);
				break;
			case rightLegId:
				m = rotateX(this.legAngle);
				m = mult(translate(0.25,-0.25,0,0),m);
				this.model[rightLegId] = create_node(m,Undead.right_leg, null,null);
				break;
			case leftShoulderId:
				this.model[leftShoulderId] = create_node(m, Undead.left_shoulder,null,null); 
				break;
			case rightShoulderId:
				this.model[rightShoulderId] = create_node(m, Undead.right_shoulder, null, null);
				break;
			case leftEyeId:
				this.model[leftEyeId] = create_node(m, Undead.left_eye,rightEyeId,null);
				break;
			case rightEyeId:
				this.model[rightEyeId] = create_node(m, Undead.right_eye, null,null);
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
	/*
		DRAWING FUNCTIONS======
	*/
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

	static hitHurtBoxStart = 0;
	static hitHurtBoxNumber = 0;


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
			gl.drawArrays(gl.TRIANGLES, Undead.torsoStart, Undead.torsoNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.torsoStart, Undead.torsoNumber);
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
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
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
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
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
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.headStart, Undead.headNumber);
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
			gl.drawArrays(gl.TRIANGLES, Undead.legStart, Undead.legNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.legStart, Undead.legNumber);
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
			gl.drawArrays(gl.TRIANGLES, Undead.legStart, Undead.legNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES, Undead.legStart, Undead.legNumber);
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
			gl.drawArrays(gl.TRIANGLES,Undead.shoulderStart,Undead.shoulderNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,Undead.shoulderStart,Undead.shoulderNumber);
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
			gl.drawArrays(gl.TRIANGLES,Undead.shoulderStart,Undead.shoulderNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,Undead.shoulderStart,Undead.shoulderNumber);
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
			gl.drawArrays(gl.TRIANGLES,Undead.eyeStart,Undead.eyeNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,Undead.eyeStart,Undead.eyeNumber);
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
			gl.drawArrays(gl.TRIANGLES,Undead.eyeStart,Undead.eyeNumber);
		}else{
			gl.drawArrays(gl.TRIANGLES,Undead.eyeStart,Undead.eyeNumber);
		}
	}
	/*
		END DRAWING FUNCTIONS=====
	*/



	//Dont think this is ever called, also don't understand
	//what it supposed to do?
	checkStuck(){
		if(enemyArray.isEmpty()==false)
			for(var i=0;i<enemyArray.getLength();i++){
				enemyArray.accessElement(i).draw();
			}
		return;
	}



	sendHitBoxData(){
		
	}

	moving(){
		if(this.legAngle > 35 || this.legAngle < -35) 
			this.switchDirection = !this.switchDirection;	
		this.initialize_node(bodyId,this.posX,this.posY,this.posZ);
		this.initialize_node(leftLegId);
		this.initialize_node(rightLegId);
		if(this.switchDirection){
			this.legAngle+=2;
		}
		else{
			this.legAngle-=2;
		}
	}

	//Don't think this is ever called.
	checkCollisions(){

		if (blocks[i].posX == (Math.floor(player.posX)+1) && blocks[i].posY == Math.floor(player.posY))
				hitBox=true;
			else if (blocks[i].posX == (Math.floor(player.posX)-1) && blocks[i].posY == Math.floor(player.posY))
				hitBox=true;
			else if (blocks[i].posX == (Math.floor(player.posX)) && blocks[i].posY == (Math.floor(player.posY)+1))
				hitBox=true;
			else if (blocks[i].posX == (Math.floor(player.posX)) && blocks[i].posY == (Math.floor(player.posY)-1))
				hitBox=true;
			else hitBox=false;
	}

	increaseSpeed(){
		if(this.speed >= this.maxSpeed)
			return;

		this.speed += 0.01;

	}
	moveHorizontally(dX,hyp){
		
		var canMoveLeft  = true;
		var canMoveRight = true;

		this.increaseSpeed();

		if(isColliding(this,player)){
			//Should push!
			player.isHit(this.angleFacing);
			return;
		}

		if(this.horizontalCooldown > 0){
			this.horizontalCooldown--;
			return;
		}

		if(enemyArray.isEmpty() || enemyArray.getLength()==1){
			this.posXNew += this.speed*(dX/hyp);
			return;
		}
		/*
			Need a function that returns the amount of collision from each thingy. Then we should probably offset the enemy by this.
		*/

		for(var i=0;i<enemyArray.getLength();i++){
			//This doesn't work because you need to consider the current enemy
			if(enemyArray.accessElement(i).isEqual(this)){
				continue;
			}

			var directions = colDirection(this,enemyArray.accessElement(i));

			if(directions[0]+directions[1]+directions[2]+directions[3] > 2){
				this.posXNew += (0.5-Math.random()*1)
				this.posYNew += (0.5-Math.random()*1)
			}

			
			if(directions[LEFT] == true){
				//nudge right
				//if(dX)
				//	this.posXNew += 0.1*Math.random();
				canMoveLeft = false;
			}
			if(directions[RIGHT] == true){
				//this.posXNew -= 0.1*Math.random();
				canMoveRight = false;
			}
		}

		if( (canMoveLeft && dX < 0) || (canMoveRight && dX >= 0)){
			this.posXNew += this.speed*(dX/hyp);
			if(dX > 0 && !canMoveLeft){
				this.posX += this.speed*(dX/hyp)/4;
			}
			if(dX < 0 && !canMoveRight){
				this.posX += this.speed*(dX/hyp)/4;
			}

			return true;
		}else{
			//this.posXNew -= Math.sign(dX)*0.00005;
			this.horizontalCooldown = this.cooldownMax;
			return false;
			//this.speed = this.initialSpeed;
		}

		
		return;
		
	}

	moveVertically(dY,hyp){
		
		var canMoveUp  = true;
		var canMoveDown = true;

		var colFromUp = false;
		var colFromDown = false;

		this.increaseSpeed();

		if(isColliding(this,player)){
			//Should push!
			player.isHit(this.angleFacing);

			//Maybe push in opposite direction of player slightly?
			//knockback?
			return;
		}

		if(this.verticleCooldown > 0){
			this.verticleCooldown--;
			return;
		}

		if(enemyArray.isEmpty() || enemyArray.getLength()==1){
			this.posYNew +=this.speed*(dY/hyp);
			return;
		}

		for(var i=0;i<enemyArray.getLength();i++){
			if(enemyArray.accessElement(i).isEqual(this)){
				continue;
			}
			var directions = colDirection(this,enemyArray.accessElement(i));
			
			if(directions[TOP])
				canMoveUp = false;
			if(directions[BOTTOM])
				canMoveDown = false;
			
		}

		
		if( (canMoveDown && dY < 0) || (canMoveUp && dY >= 0) ){
			this.posYNew += this.speed*(dY/hyp);
			//If you're being colliding from the behind give a little boost.
			if(dY > 0 && !canMoveDown){
				//this.posY += this.speed*(dY/hyp)/4;
			}
			if(dY < 0 && !canMoveUp){
				//this.posY += this.speed*(dY/hyp)/4;
			}
			return true;
		}else{

			//this.posYNew -= Math.sign(dY)*0.00005;
			this.verticleCooldown = this.cooldownMax;
			return false;
			//this.speed = this.initialSpeed;
		}	
		return;
		
	}

	returnBounds(){

		/*
			NEEDS TO ROTATE AS WELL.
		*/
		//undeadHitboxBounds = [vec3(-box,-box,1.25), vec3(box,box,3.1)];

		var b1 = vec4(undeadHitboxBounds[0][0],undeadHitboxBounds[0][1],undeadHitboxBounds[0][2], 1);
		var b2 = vec4(undeadHitboxBounds[1][0],undeadHitboxBounds[1][1],undeadHitboxBounds[1][2], 1);
	
		//var mat = mult(translate(this.posX,this.posY,this.posZ),rotateZ(-this.angleFacing) );
		//var mat = translate(this.posX,this.posY,this.posZ);
		var mat = translate(this.posXNew,this.posYNew,this.posZ);

		b1 = mult(mat,b1);
		b2 = mult(mat,b2);

		//var bound1 = vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), Math.min(b1[2],b2[2]),1 );
		//var bound2 = vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]), Math.max(b1[2],b2[2]),1 );

		var bound1 = vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), -100,1 );
		var bound2 = vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]), 100,1 );
	
		return [bound1, bound2];
		
	}


	moveTowardPlayer(){
		if(player==null)
			return;

		

		//[Left, Right, Up, Down]
		this.isStuck = [false,false,false,false];
		var pX=player.posX;
		var pY=player.posY;
		
		var dX=pX-this.posX;
		var dY=pY-this.posY;
		//dX = 0; dY = 0;
		//console.log(dX)

		if(dX*dX + dY*dY > 220){
			this.deathMarker = true;
			this.health = 0;
		}
		if(dX*dX + dY*dY < 40){
			//if(!this.displayToolbar){
				//fade in.
				//Make opacity a funciton of distance?
			//}
			this.healthOpacity = Math.min(1, Math.max(1.1-(dX*dX + dY*dY)/40,0));
			//console.log('Test:',1.1-(dX*dX + dY*dY)/30)

			this.displayToolbar = true;
			

		}else{
			this.displayToolbar = false;
		}

		//dX=0;dY=0;


		if(player.isDead){
			dX = -dX;
			dY = -dY;
		}

		var hyp=Math.sqrt(dX*dX + dY*dY);

		var centerX, centerY;

		centerX = Math.round(this.posX); //Math.round((bounds[0][0] + bounds[1][0])/2);
		centerY = Math.round(this.posY); //Math.round((bounds[0][1] + bounds[1][1])/2);

		var chunk;
		if(!inDungeon){
			chunk = world.getChunk(centerX, centerY);
		}else{
			chunk = currentDungeon.getChunk(centerX, centerY);
		}

		switch(Math.sign(dX)){
			//Is moving left
			case -1:
				var isCLeft = false;
				this.angleFacing = 90-(180*Math.atan(dY/dX)/Math.PI);
				for(let i = 0; i < chunk.length; i++){
					if(isCollidingLeft(this,chunk[i])){
						isCLeft = true;
					}
				}
				if(!isCLeft)
					this.moveHorizontally(dX,hyp);
				//this.angleFacing = 90-(180*Math.atan(dY/dX)/Math.PI);
				break;

			//Is moving right
			case 1:
				var isCRight = false;
				this.angleFacing = 270-(180*Math.atan(dY/dX)/Math.PI);
				for(let i = 0; i < chunk.length; i++){
					if(isCollidingRight(this,chunk[i])){
						isCRight = true;
					}
				}
				if(!isCRight)
					this.moveHorizontally(dX,hyp);
				//this.angleFacing = 270-(180*Math.atan(dY/dX)/Math.PI);
				break;
				
		}
		switch(Math.sign(dY)){
			//Is moving down
			case -1:
				var isCDown = false;
				for(let i = 0; i < chunk.length; i++){
					if(isCollidingDown(this,chunk[i])){
						isCDown = true;
					}
				}
				if(!isCDown)
					this.moveVertically(dY,hyp);
				break;
			//Is moving up
			case 1:
				var isCUp = false;
				for(let i = 0; i < chunk.length; i++){
					if(isCollidingUp(this,chunk[i])){
						isCUp = true;
					}
				}
				if(!isCUp)
					this.moveVertically(dY,hyp);
				break;
		}

		
		this.flash=false;
		if(this.invulnerable > 0){
			this.invulnerable--;
			//5 here is the number of frames a flash stays active or inactive for.
			if(Math.ceil((this.invulnerable-1)/5)%2 == 1)
				this.flash = true;
		}

		if(this.knockbackTimer > 0){
			//Good enough.
			for(let i = 0; i < chunk.length; i++){
				if(isCollidingLeft(this,chunk[i])){
					this.isStuck[0] = true;
				}
				if(isCollidingRight(this,chunk[i])){		
					this.isStuck[1] = true;
				}
				if(isCollidingDown(this,chunk[i])){
					this.isStuck[3] = true;
				}
				if(isCollidingUp(this,chunk[i])){
					this.isStuck[2] = true;
				}
		
			}
			this.knockback();
			this.knockbackTimer--;
		}
	


	}

	update(){
		if(this.particleCooldown > 0)
			this.particleCooldown--;
		if(this.fullHealthOpacityTimer > 0){
			this.fullHealthOpacityTimer--;
		}
	}

	updatePosition(){
		this.update();
		this.moving();
		this.moveTowardPlayer();
	}
	setNewPosition(){
		this.posX = this.posXNew;
		this.posY = this.posYNew;
	}

	static sendData(){
		flipPlayerNorms = true;
		Undead.headStart = vertices.length;
		head2(hexToRgbA('#569756'));
		Undead.headNumber = vertices.length-Undead.headStart ;

		Undead.shoulderStart = vertices.length;//headVerts
		build_shoulder(hexToRgbA('#4c1e1e'));
		//build_shoulder(hexToRgbA('#AAAAAA'));
		Undead.shoulderNumber =  vertices.length - Undead.shoulderStart;//shoulderVerts

		Undead.torsoStart = vertices.length;
		build_torso(hexToRgbA('#4c1e1e'));
		Undead.torsoNumber = vertices.length -  Undead.torsoStart; 

		Undead.legStart = vertices.length;
		build_leg(hexToRgbA('#151a29'));
		Undead.legNumber = vertices.length - Undead.legStart;

		Undead.eyeStart = vertices.length;
		build_eye(hexToRgbA('#670808'));
		Undead.eyeNumber = vertices.length - Undead.eyeStart;
		
		NM = vertices.length;

		Undead.hitHurtBoxStart = vertices.length;
		push_wireframe_indices(undeadHurtBox[0],undeadHurtBox[1],vec4(0,0,1,0.7));
		Undead.hitHurtBoxNumber = vertices.length - Undead.hitHurtBoxStart;
	}

	draw(){
		this.setNewPosition();

		/*
		let zVal = this.posZ+1.25;

		let c = vec4(this.posX-0.5,this.posY-0.5,zVal,1);
		//let c = mult(translate(this.posX,this.posY,zVal), c);
		c = mult(modelViewMatrix, c);
		c = mult(projectionMatrix, c);

		let d = vec4((c[0]/c[3]+1),(c[1]/c[3]+1),(c[2]/c[3]),1);

		draw_c_text(d[0]*8,d[1]*4.5,'FUCK');

		c = vec4((c[0]/c[3]),(c[1]/c[3]),-(c[2]/c[3]),1);
		//console.log(c);

		
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(vec4(0.1, 0.1, 0.1, 1.0)));
		gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(c) );
		*/
		//console.log((player.posX-this.posX)/16, (player.posY-this.posY)/8)
		//gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(vec4(0.1, 0.1, 0.1, 1.0)));
		//gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(vec4(0,0,-0.1,1)) );
		gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(vec4(0.25,0.25,0.25,1.0)));
		gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(vec4(1.0,1.0,1.0,1.0)));
		gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(vec4(0.8, 0.8, 0.8, 1.0)));
		//set_light_full()
		if(this.flash)
			gl.uniform1i(flashingLoc, true);
		this.traverse(bodyId);
		if(this.flash)
			gl.uniform1i(flashingLoc, false);
		if(fixedView){
			//set_mv();
			set_mv(translate(this.posX,this.posY,this.posZ))
		}else{
			set_mv(translate(this.posX,this.posY,this.posZ))
		}
		if(hitBox){
			//set_mv(mult(translate(this.posX,this.posY,this.posZ),rotateZ(-this.angleFacing)));
			gl.drawArrays(gl.LINES,undeadHitboxStart,undeadHitboxSize);
			this.hitHurtBox.draw();
		}
		if(this.displayToolbar || this.fullHealthOpacityTimer > 0)
			this.drawContents();

		//gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
		//gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
		//gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(lightSpecular));
		//gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
		set_light()
	}
}


/*

// OLD ENEMY DROP CODE


let r;

		//Drops brick recipe.
		r = Math.random();
		if(r < 0.1){
			let dice_roll = roll_n_sided_die(2);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new BrickBlockRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new CopperBrickRecipe(), this.posX, this.posY);
					break;
			}
		}

		//Drops copper stuff for convience recipe.
		r = Math.random();
		if(r < 0.4){
			let dice_roll = roll_n_sided_die(2);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperBarRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new CopperPickRecipe(), this.posX, this.posY);
					break;
			}
		}


		//Drops bar recipe.
		r = Math.random();
		if(r < 0.3){
			let dice_roll = roll_n_sided_die(6);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperBarRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new LatkinBarRecipe(), this.posX, this.posY);
					break;
				case 2:
					enemy_drop(worldObj, new IllsawBarRecipe(), this.posX, this.posY);
					break;
				case 3:
					enemy_drop(worldObj, new PlatinumBarRecipe(), this.posX, this.posY);
					break;
				case 4:
					enemy_drop(worldObj, new LuniteBarRecipe(), this.posX, this.posY);
					break;
				case 5:
					enemy_drop(worldObj, new DaytumBarRecipe(), this.posX, this.posY);
					break;
			}
		}

		//Drops pick recipe.
		r = Math.random();
		if(r < 0.25){
			let dice_roll = roll_n_sided_die(6);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperPickRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new LatkinPickRecipe(), this.posX, this.posY);
					break;
				case 2:
					enemy_drop(worldObj, new IllsawPickRecipe(), this.posX, this.posY);
					break;
				case 3:
					enemy_drop(worldObj, new PlatinumPickRecipe(), this.posX, this.posY);
					break;
				case 4:
					enemy_drop(worldObj, new LunitePickRecipe(), this.posX, this.posY);
					break;
				case 5:
					enemy_drop(worldObj, new DaytumPickRecipe(), this.posX, this.posY);
					break;
			}
		}

		//Drops axe recipe.
		r = Math.random();
		if(r < 0.20){
			let dice_roll = roll_n_sided_die(6);
			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperAxeRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new LatkinAxeRecipe(), this.posX, this.posY);
					break;
				case 2:
					enemy_drop(worldObj, new IllsawAxeRecipe(), this.posX, this.posY);
					break;
				case 3:
					enemy_drop(worldObj, new PlatinumAxeRecipe(), this.posX, this.posY);
					break;
				case 4:
					enemy_drop(worldObj, new LuniteAxeRecipe(), this.posX, this.posY);
					break;
				case 5:
					enemy_drop(worldObj, new DaytumAxeRecipe(), this.posX, this.posY);
					break;
			}
		}

		//Drops sword recipe.
		r = Math.random();
		if(r < 0.20){
			let dice_roll = roll_n_sided_die(6);

			switch(dice_roll){
				case 0:
					enemy_drop(worldObj, new CopperSwordRecipe(), this.posX, this.posY);
					break;
				case 1:
					enemy_drop(worldObj, new LatkinSwordRecipe(), this.posX, this.posY);
					break
				case 2:
					enemy_drop(worldObj, new IllsawSwordRecipe(), this.posX, this.posY);
					break;
				case 3:					
					enemy_drop(worldObj, new PlatinumSwordRecipe(), this.posX, this.posY);
					break;
				case 4:
					enemy_drop(worldObj, new LuniteSwordRecipe(), this.posX, this.posY);
					break;
				case 5:
					enemy_drop(worldObj, new DaytumSwordRecipe(), this.posX, this.posY);
					break;
			}
		}

*/

