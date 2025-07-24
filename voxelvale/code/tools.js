


/*
	PICKAXES.
*/

class Pickaxe extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static colorOne = hexToRgbA('#e55f28'); get colorOne() {return this.constructor.colorOne;}

	static toolLevel = 0; get toolLevel() {return this.constructor.toolLevel;}

	constructor(strength){
		super(null,null,null,build_pickaxe,strength);
		this.toolType = 'PICK_AXE';
	}

	sendData(){
		this.constructor.index = vertices.length;
		this.renderFunction(this.colorOne);
		this.constructor.numberOfVerts = vertices.length - this.constructor.index;
	}
}

class StonePickaxe extends Pickaxe{

	static colorOne = vec4(0.5,0.5,0.5,1);
	static toolLevel = 0;

	constructor(){
		super(1);
		this.name='Stone Pickaxe';
		this.desc='A standard stone pickaxe for mining.';
		this.objectNumber=65;
	}
}

class CopperPickaxe extends Pickaxe{

	static colorOne = hexToRgbA('#e55f28');
	static toolLevel = 1;

	constructor(){
		super(1.2);
		this.name='Copper Pickaxe';
		this.desc='A copper pickaxe for mining.';
		this.objectNumber=70;
	}
}

class LatkinPickaxe extends Pickaxe{
	
	static colorOne = hexToRgbA('#bcb7b7');
	static toolLevel = 2;

	constructor(){
		super(1.3);
		
		this.name='Latkin Pickaxe';
		this.desc='A latkin pickaxe for mining.';
		this.objectNumber=86;
	}
}

class IllsawPickaxe extends Pickaxe{
	
	static colorOne = hexToRgbA('#d9fefc');
	static toolLevel = 3;

	constructor(){
		super(1.4);
		
		this.name='Illsaw Pickaxe';
		this.desc='An illsaw pickaxe for mining.';
		this.objectNumber=87;
	}
}

class PlatinumPickaxe extends Pickaxe{
	
	static colorOne = hexToRgbA('#f4f0ed');
	static toolLevel = 4;

	constructor(){
		super(1.5);
		
		this.name='Platinum Pickaxe';
		this.desc='A platinum pickaxe for mining.';
		this.objectNumber=88;
	}
}

class LunitePickaxe extends Pickaxe{
	
	static colorOne = hexToRgbA('#e4d862');
	static toolLevel = 5;

	constructor(){
		super(1.7);
		
		this.name='Lunite Pickaxe';
		this.desc='A lunite pickaxe for mining.';
		this.objectNumber=89;
	}
}

class DaytumPickaxe extends Pickaxe{
	
	static colorOne = hexToRgbA('#ef61f1');
	static toolLevel = 6;

	constructor(){
		super(1.9);
		
		this.name='Daytum Pickaxe';
		this.desc='A daytum pickaxe for mining.';
		this.objectNumber=90;
	}
}

/*
	SWORDS
*/

/*
	This is an abstract type.

	The sole super argument is strength which defines how much damage the sword does.
*/
class Sword extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	static wireframeIndexStart = 0;
	static wireframeNumber = 0;
	static bounds = [vec4(-0.25,-0.25,-0.25,1),vec4(0.25,0.25,0.25,1)]; get bounds() {return this.constructor.bounds;}
	static color = vec4(0.5,0.5,0.5,1); get color() {return this.constructor.color;}

	constructor(strength){
		super(null,null,null,null,strength);
		this.toolType = 'SWORD';
		this.currentHeldMatrix = mat4();
	}

	static sendData(){
		this.index = vertices.length;
		build_sword(this.color);
		this.numberOfVerts = vertices.length - this.index;

		this.wireframeIndexStart = vertices.length;
		push_wireframe_indices(this.bounds[0],this.bounds[1]);
		this.wireframeNumber = vertices.length - this.wireframeIndexStart;
	}



	checkCollisions(){
		if(enemyArray.isEmpty() || !player.attackHitBox)
			return;
		for(var i=0;i<enemyArray.getLength();i++){
			let cols = colDirection(this,enemyArray.accessElement(i).hitHurtBox);
			if(cols[0]||cols[1]||cols[2]||cols[3]){
				//SPAWN PARTICLES
				//this.particleColor = vec3(0.3, 0, 0);
				//this.destroy();
				let attackedEnemy = enemyArray.accessElement(i);
				if(attackedEnemy.invulnerable <= 0)
					attackedEnemy.spawnParticles(); 
				attackedEnemy.hit(180-angleFacing, this.strength);
				
			
			}
		}
	}

	/*
		Updates when the object is held.
	*/
	updateWhenHeld(currentMat){
		this.currentHeldMatrix = currentMat;
		this.checkCollisions();
	}

	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}

	returnBounds(){

		var curPos = translate(player.posX,player.posY,player.posZ);
		curPos = mult(curPos,rotateZ(-angleFacing))
		curPos = mult(curPos, translate(0,0,-3.5));
		curPos = mult(curPos,rotateX(armAngleRightSwing))
		curPos = mult(curPos, translate(0.375,-1.25,0));
		curPos = mult(curPos,rotateX(-armAngleRightSwing))
		curPos = mult(curPos,rotateZ(angleFacing))

		let b1 = mult(curPos, Sword.bounds[0])
		let b2 =  mult(curPos, Sword.bounds[1])

		return [vec4(Math.min(b1[0],b2[0]), Math.min(b1[1],b2[1]),-10,1),vec4(Math.max(b1[0],b2[0]), Math.max(b1[1],b2[1]),10,1)];
	}


	drawTransparent(currentMat){
		this.drawSmall(currentMat);
		if(hitBox && player.attackHitBox){
			let curPos = scale4(0.125,(1/4.5),0.1);

			curPos = mult(curPos,rotateZ(-angleFacing))
			curPos = mult(curPos, translate(0,0,-3));
			curPos = mult(curPos,rotateX(armAngleRightSwing))
			curPos = mult(curPos, translate(0.375,-1.25,0));
			curPos = mult(curPos,rotateX(-armAngleRightSwing))
			curPos = mult(curPos,rotateZ(angleFacing))
		
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(curPos));
			gl.drawArrays(gl.LINES,this.constructor.wireframeIndexStart,this.constructor.wireframeNumber);
		}
	}

	draw(){
		this.update();
		set_mv(this.instanceMat);
	}
}

class StoneSword extends Sword{
	static color = vec4(0.5,0.5,0.5,1);
	constructor(){
		super(1);
		this.name='Stone Sword';
		this.desc='A stone sword for attacking enemies.';
		this.objectNumber=73;
	}
}

class CopperSword extends Sword{
	static color = hexToRgbA('#e55f28');
	constructor(){
		super(1.5);
		this.name='Copper Sword';
		this.desc='A copper sword for attacking enemies.';
		this.objectNumber=74;
	}
}

class LatkinSword extends Sword{
	static color = hexToRgbA('#bcb7b7');

	constructor(){
		super(2.25);
		this.name='Latkin Sword';
		this.desc='A latkin sword for attacking enemies.';
		this.objectNumber=91;
	}
}

class IllsawSword extends Sword{
	static color = hexToRgbA('#d9fefc');

	constructor(){
		super(2.75);
		this.name='Illsaw Sword';
		this.desc='An illsaw sword for attacking enemies.';
		this.objectNumber=92;
	}
}

class PlatinumSword extends Sword{
	static color = hexToRgbA('#f4f0ed');

	constructor(){
		super(3.5);
		this.name='Platinum Sword';
		this.desc='A platinum sword for attacking enemies.';
		this.objectNumber=93;
	}
}

class LuniteSword extends Sword{
	static color = hexToRgbA('#e4d862');

	constructor(){
		super(4);
		this.name='Lunite Sword';
		this.desc='A lunite sword for attacking enemies.';
		this.objectNumber=94;
	}
}

class DaytumSword extends Sword{
	static color = hexToRgbA('#ef61f1');

	constructor(){
		super(5);
		this.name='Daytum Sword';
		this.desc='A daytum sword for attacking enemies.';
		this.objectNumber=95;
	}
}



/*
	AXES
*/

class AbstractAxe extends Tool{
	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static color = hexToRgbA('#e55f28');

	constructor(strength){
		super(null,null,null,build_axe,strength);
		this.toolType = 'AXE';
	}

	static sendData(){
		this.index = vertices.length;
		build_axe(this.color);
		this.numberOfVerts = vertices.length - this.index;
	}
}


//Should really rename to stone...
class WoodAxe extends Tool{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,build_axe,1);
		this.index=axeStart;
		this.numberOfVerts=axeVerts;
		this.toolType = 'AXE';
		this.name='Stone Axe';
		this.desc='A standard stone axe for chopping wood.';
		this.objectNumber=64;
	}
}

class CopperAxe extends AbstractAxe{

	static color = hexToRgbA('#e55f28');

	constructor(){
		super(1.2);
		this.name='Copper Axe';
		this.desc='A copper axe for chopping wood.';
		this.objectNumber=71;
	}
}

class LatkinAxe extends AbstractAxe{

	static color = hexToRgbA('#bcb7b7');

	constructor(){
		super(1.25);
		this.name='Latkin Axe';
		this.desc='A latkin axe for chopping wood.';
		this.objectNumber=96;
	}
}

class IllsawAxe extends AbstractAxe{

	static color = hexToRgbA('#d9fefc');

	constructor(){
		super(1.3);
		this.name='Illsaw Axe';
		this.desc='An illsaw axe for chopping wood.';
		this.objectNumber=97;
	}
}

class PlatinumAxe extends AbstractAxe{

	static color = hexToRgbA('#f4f0ed');

	constructor(){
		super(1.4);
		this.name='Platinum Axe';
		this.desc='A platinum axe for chopping wood.';
		this.objectNumber=98;
	}
}

class LuniteAxe extends AbstractAxe{

	static color = hexToRgbA('#e4d862');

	constructor(){
		super(1.55);
		this.name='Lunite Axe';
		this.desc='A lunite axe for chopping wood.';
		this.objectNumber=99;
	}
}

class DaytumAxe extends AbstractAxe{

	static color = hexToRgbA('#ef61f1');

	constructor(){
		super(1.75);
		this.name='Daytum Axe';
		this.desc='A daytum axe for chopping wood.';
		this.objectNumber=100;
	}
}