//Should extend humanoid or something, figure it out later
//This should extend ENEMY, which extends humanoid
//Since whenever a new enemy is created the universalEnemyID increases.
var universalEnemyId;


//var boxX = 0.35;
//var boxY = 0.35;
var boxX = 0.25;
var boxY = 0.25;


var undeadHitboxBounds = [vec3(-boxX,-boxY,1.25), vec3(boxX,boxY,3.1)];

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
		this.initialSpeed = 0.025;
		universalEnemyId++;

		this.posXNew=this.posX;
		this.posYNew=this.posY;

		this.cooldownMax = 10;
		this.verticleCooldown = 0;
		this.horizontalCooldown = 0;
	}

	isEqual(otherEnemy){
		if(this.ID==otherEnemy.ID)
			return true;
		return false;
	}

	hit(angle){
		var knockBackDistance=1;
		var kbd=knockBackDistance;
		this.posXNew-=Math.sin(Math.PI*angle/180);
		this.posYNew+=Math.cos(Math.PI*angle/180);
		this.checkIfDead();
		//this.posX--;	
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
		Z=-3.25;
		switch(id){
			case bodyId:
				m = scale4(0.5,0.5,0.5);
				m = mult(m, rotateX(-90));
				m = mult(m, rotateY(this.angleFacing));
				m = mult(translate(X,Y,Z,0),m);
				this.model[bodyId] = create_node(m, body, null, headId);
				break;
			case headId:
				m = translate(0,1.5,0,0);
				this.model[headId] = create_node(m, head, leftArmId, leftEyeId);
				break;
			case leftArmId:
				m = rotateX(90);
				m = mult(translate(-0.75,1.125,0,0),m);
				this.model[leftArmId] = create_node(m, left_arm, rightArmId, leftShoulderId);
				break;
			case rightArmId:
				m = rotateX(90);
				m = mult(translate(0.75,1.125,0,0),m);
				this.model[rightArmId] = create_node(m, right_arm, leftLegId, rightShoulderId);
				break;
			case leftLegId:
				m = rotateX(-this.legAngle);
				m = mult(translate(-0.25,-0.25,0,0),m);
				this.model[leftLegId] = create_node(m,left_leg, rightLegId, null);
				break;
			case rightLegId:
				m = rotateX(this.legAngle);
				m = mult(translate(0.25,-0.25,0,0),m);
				this.model[rightLegId] = create_node(m,right_leg, null,null);
				break;
			case leftShoulderId:
				this.model[leftShoulderId] = create_node(m, left_shoulder,null,null); 
				break;
			case rightShoulderId:
				this.model[rightShoulderId] = create_node(m, right_shoulder, null, null);
				break;
			case leftEyeId:
				this.model[leftEyeId] = create_node(m, left_eye,rightEyeId,null);
				break;
			case rightEyeId:
				this.model[rightEyeId] = create_node(m, right_eye, null,null);
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
	checkStuck(){
		if(enemyArray.isEmpty()==false)
			for(var i=0;i<enemyArray.getLength();i++){
				enemyArray.accessElement(i).draw();
			}
		return;
	}

	//This data is already on the gpu, but it will need to be resent once it
	//differs from this model
	sendData(){
		head2();
		headVerts = vertices.length;
		build_shoulder();
		shoulderVerts = vertices.length - headVerts;
		build_torso();
		torsoVerts = vertices.length - shoulderVerts-headVerts;
		build_leg();
		legVerts = vertices.length -torsoVerts-shoulderVerts-headVerts;
		build_eye();
		eyeVerts = vertices.length - legVerts -torsoVerts-shoulderVerts-headVerts;
		NM = vertices.length;
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

			
			if(directions[LEFT] == true){

				canMoveLeft = false;
			}
			if(directions[RIGHT] == true){
				canMoveRight = false;
			}
		}

		if( (canMoveLeft && dX < 0) || (canMoveRight && dX >= 0)){
			this.posXNew += this.speed*(dX/hyp);
			if(dX > 0 && !canMoveLeft){
				//this.posX += this.speed*(dX/hyp)/4;
			}
			if(dX < 0 && !canMoveRight){
				//this.posX += this.speed*(dX/hyp)/4;
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
		var mat = translate(this.posX,this.posY,this.posZ);

		b1 = mult(mat,b1);
		b2 = mult(mat,b2);

		var bound1 = vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]), Math.min(b1[2],b2[2]),1 );
		var bound2 = vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]), Math.max(b1[2],b2[2]),1 );
	
		return [bound1, bound2];
		
	}


	moveTowardPlayer(){
		if(player==null)
			return;
		var pX=player.posX;
		var pY=player.posY;
		
		var dX=pX-this.posX;
		var dY=pY-this.posY;

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
					if(isCollidingLeft(this,chunk[i]))
						isCLeft = true;
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
					if(isCollidingRight(this,chunk[i]))
						isCRight = true;
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
					if(isCollidingDown(this,chunk[i]))
						isCDown = true;
				}
				if(!isCDown)
					this.moveVertically(dY,hyp);
				break;
			//Is moving up
			case 1:
				var isCUp = false;
				for(let i = 0; i < chunk.length; i++){
					if(isCollidingUp(this,chunk[i]))
						isCUp = true;
				}
				if(!isCUp)
					this.moveVertically(dY,hyp);
				break;
		}
	}

	updatePosition(){
		this.moving();
		this.moveTowardPlayer();
	}
	setNewPosition(){
		this.posX = this.posXNew;
		this.posY = this.posYNew;
	}

	draw(){
		this.setNewPosition();
		this.traverse(bodyId);
		if(fixedView){
			//set_mv();
			set_mv(translate(this.posX,this.posY,this.posZ))
		}else{
			set_mv(translate(this.posX,this.posY,this.posZ))
		}
		if(hitBox){
			//set_mv(mult(translate(this.posX,this.posY,this.posZ),rotateZ(-this.angleFacing)));
			gl.drawArrays(gl.LINES,undeadHitboxStart,undeadHitboxSize);
		}
	}
}

