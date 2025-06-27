//Power should be within [0,1]
//AKA Universal Acceleration Cutoff Threshold;
//UACT;

class Projectile{
	constructor(RENDER,DIRECTION,POWER,initX=null,initY=null,initZ=null){
		this.renderFunction=RENDER;
		this.direction=DIRECTION;
		this.power=POWER;
		this.index=0;
		this.numberOfVertices=0;
		this.hbIndex=0;
		this.hbEnd=24;
		this.bounds=[vec4(-1,-1,-1,1),vec4(1,1,1,1)];
		this.markedToDestroy=false;

		//this.acceleration=0.0125;
		this.acceleration=0.0125;
		
		//Max power: 0.88 -> 0.0120  Min power: 0.50 -> 0.0225

		//this.acceleration = (2-this.power/0.88)*0.0120;
		this.acceleration = (2-this.power/0.6)*0.0120 + 0.006;

		//These are the initial velocities
		this.horizontalVelocity=Math.sin(Math.PI*this.direction/180)/5;
		this.verticalVelocity=Math.cos(Math.PI*this.direction/180)/5;
		this.downwardVelocity=0.00125;
		this.horizontalAcceleration=Math.abs(this.acceleration*this.horizontalVelocity);
		this.verticalAcceleration=Math.abs(this.acceleration*this.verticalVelocity);
		this.downwardAcceleration=0.00098;
		this.pX=initX;
		this.pY=initY;
		this.pZ=initZ;
		this.particleColor = vec3(0.5,0.5,0.5);
	}

	spawnParticles(){
		/*
			Spawn particles
		*/
		var numParticles = Math.round(Math.random()*6) + 6;
		//Spawn at average location of hitbox.

		var dip=180*Math.atan(this.downwardVelocity)/Math.PI;
		var locMV=rotateX(dip);
		locMV=mult(locMV,rotateZ(this.direction));
		var setMV=mult(translate(this.pX,this.pY,this.pZ),locMV);

		var low = mult(setMV,this.bounds[0]);
		var high = mult(setMV,this.bounds[1]);

		var loc = vec4(Math.min(low[0],high[0])+Math.abs(high[0]-low[0])/2 - 0.5, Math.min(low[1],high[1])+Math.abs(high[1]-low[1])/2 - 0.5, Math.min(low[2],high[2])+Math.abs(high[2]-low[2])/2, 1);

		for (let i = 0; i < numParticles; i++){
			var zOffset = Math.random();
			var xOffset = Math.random()-0.5;
			var yOffset = Math.random()-0.5;
			new Particle(loc[0]+xOffset,loc[1]+yOffset,loc[2]+zOffset, this.particleColor);
		}
	}

	spawnParticlesXYZ(X,Y,Z){
		var numParticles = Math.round(Math.random()*6) + 6;

		for (let i = 0; i < numParticles; i++){
			var zOffset = Math.random();
			var xOffset = Math.random()-0.5;
			var yOffset = Math.random()-0.5;
			new Particle(X+xOffset,Y+yOffset,Z+zOffset, this.particleColor);
		}
	}

	//Should be destroyed after a certain amount of time.
	destroy(){
		this.spawnParticles();
		this.markedToDestroy=true;
		//this.spawnParticlesXYZ(this.pX, this.pY, this.pZ);
		return;
	}
	//Power determines speed of projectile.
	determineAcceleration(){
		this.acceleration=this.power;
	}
	//determine/update path
	determinePath(){

		return;
	}

	//This method should also stop imediatly if it registers a collision
	updateLocation(){
		this.pX -= this.horizontalVelocity;
		this.pY += this.verticalVelocity;
		this.pZ += this.downwardVelocity;

		if(this.horizontalVelocity > UACT)
			this.horizontalVelocity -= this.horizontalAcceleration;
		else if(this.horizontalVelocity < -UACT)
			this.horizontalVelocity += this.horizontalAcceleration;
		else{
			this.horizontalVelocity=0;
		}

		if(this.verticalVelocity > UACT)
			this.verticalVelocity -= this.verticalAcceleration;
		else if(this.verticalVelocity < -UACT)
			this.verticalVelocity += this.verticalAcceleration;
		else{
			this.verticalVelocity=0;
		}

		if(this.pZ < -2.1){
			this.downwardVelocity += this.downwardAcceleration;
		}else{
			this.downwardVelocity = 0;
		}


		return;
	}
	sendData(){//VERT_START){
		//Could just make the index equal vertices.length when this method is called.
		//this.index=VERT_START;
		//this.numberOfVertices=this.renderFunction();
		this.renderFunction();
	}
	checkCollisions(){
		if(enemyArray.isEmpty())
			return;
		for(var i=0;i<enemyArray.getLength();i++){
			if(isColliding(this,enemyArray.accessElement(i)))
				console.log('IM HIT')
		}
		return;
	}
	draw(){
		this.updateLocation();
		var dip=180*Math.atan(this.downwardVelocity)/Math.PI;
		var locMV=rotateX(dip);
		locMV=mult(locMV,rotateZ(this.direction));
		var setMV= mult(translate(this.pX,this.pY,this.pZ),locMV);
		set_mv(setMV);
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVertices);
		if(hitBox)
			gl.drawArrays(gl.LINES,this.hbIndex,this.hbEnd);
	}
	returnBounds(){
		var dip=180*Math.atan(this.downwardVelocity)/Math.PI;
		var locMV=rotateX(dip);
		locMV=mult(locMV,rotateZ(this.direction));
		var setMV=mult(translate(this.pX,this.pY,this.pZ),locMV);

		
		return [mult(setMV, this.bounds[0]), mult(setMV, this.bounds[1])];
	}
	sendHitBoxData(){
		//Make a square with returnBounds  
		push_wireframe_indices(this.bounds[0],this.bounds[1]);
	}
}

class Arrow extends Projectile{
	constructor(DIRECTION,POWER,initX=null,initY=null,initZ=null){
		super(build_arrow,DIRECTION,POWER,initX,initY,initZ);
		this.index=arrowStart;
		this.numberOfVertices=arrowVerts;
		this.hbIndex=arrowHB;
		//this.bounds=[vec4(-0.12 ,0.72,-0.12,1),vec4(0.12,1,0.12,1)];
		this.bounds=[vec4(-0.12 ,0.1,-0.12,1),vec4(0.12,1,0.12,1)];
	}

	//Since this can only be used by player only check enemy collisions
	checkCollisions(){

		/*
		if(enemyArray.isEmpty==false){
			for(var i=0;i<enemyArray.getLength();i++){
			enemyArray.accessElement(i).draw();
			}
		}*/
		//this.posX, this.posY, this.posZ
		if(isNaN(this.pX) || isNaN(this.pY) || isNaN(this.pZ)) return;
		var PX = [Math.floor(this.pX)-1, Math.floor(this.pX), Math.floor(this.pX)+1];
		var PY = [Math.floor(this.pY)-1, Math.floor(this.pY), Math.floor(this.pY)+1];
		var PZ = [Math.floor(this.pZ)-1, Math.floor(this.pZ), Math.floor(this.pZ)+1];
		//if(PX == null || PY == null || PZ == null) return;
		var worldObj;

		if(inDungeon){
			worldObj = currentDungeon;
		}else{
			worldObj = world;
		}
		//Check surrounding blocks.
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				for(let k = 0; k < 3; k++){

					if (worldObj.isSpaceOccupied(PX[i],PY[j],PZ[k])){
						if(isColliding_Original(this, new BoundObject(PX[i],PY[j],PZ[k]))){
							//Check if it's a ceiling.
							var block = worldObj.getBlockAt(PX[i],PY[j],PZ[k]);

							if(block.isTall){
								if(isColliding_Original(this,block)){
									this.destroy();
									return;									
								}
							}else if(block.isTop){
								if(isColliding_Original(this,block.bottom)){
									this.destroy();
									return;									
								}
							}else{
								this.destroy();
								return;
							}
						}
					}	
				}
			}
		}

		if(enemyArray.isEmpty())
			return;
		for(var i=0;i<enemyArray.getLength();i++){
			//console.log(this.returnBounds()[0])
			//console.log(player.returnBounds()[0])
			if(isColliding_Original(this,enemyArray.accessElement(i))){
				this.destroy();
				enemyArray.accessElement(i).hit(this.direction);
				enemyArray.accessElement(i).healthDown(2.5);
			}
		}
	}

}

var arrowVerts=0;
function build_arrow(){
	var v1,v2,v3,v4;
	var aH=0.065;
	var arrowV = 0;
	v1=vec3(-aH,.75,aH);
	v2=vec3(0,1,0); //0.5
	v3=vec3(aH,.75,aH);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	v1=vec3(-aH,.75,-aH);
	v2=vec3(0,1,0); 
	v3=vec3(aH,.75,-aH);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	v1=vec3(aH,.75,-aH);
	v2=vec3(0,1,0); 
	v3=vec3(aH,.75,aH);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	v1=vec3(-aH,.75,-aH);
	v2=vec3(0,1,0); 
	v3=vec3(-aH,.75,aH);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	arrowV+=buildRectangleXZ(-aH,-aH,aH,aH,.75,vec4(1,1,1,1));
	arrowV+=buildRectangularPrism(0.0125,0.75,0.0125,-0.0125,-.35,-0.0125,vec4(0.7,0.5,0.2,1));

	v1=vec3(-0.05,-0.25,0.05);
	v2=vec3(0,0,0); //0.5
	v3=vec3(0.05,-0.25,0.05);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	v1=vec3(-0.05,-0.25,-0.05);
	v2=vec3(0,0,0); 
	v3=vec3(0.05,-0.25,-0.05);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));

	v1=vec3(0.05,-0.25,-0.05);
	v2=vec3(0,0,0); 
	v3=vec3(0.05,-0.25,0.05);
	arrowV+=ui_push(v1,v2,v3,vec4(1,1,1,1));
	arrowVerts=arrowV;

}