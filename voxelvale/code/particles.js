/*
	Particles are typically initialized in game coordinates (e.g., 262, 251, -3).


*/
class Particle{
	constructor(X,Y,Z,colour){
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.instanceMat = translate(X,Y,Z);
		this.colour = colour;
		this.framesAlive = 40;
		this.wiggle = 0.02;
		this.opacity = 1;
		this.opacityStep = 2/this.framesAlive;
		particles.push(this);
	}

	isAlive(){
		if(this.framesAlive <= 0)
			return false;
		return true;
	}

	draw(){
		//Wiggle and fade out.

		this.framesAlive--;
		if(this.framesAlive <= 20)
			this.opacity -= this.opacityStep;
		set_mv(this.instanceMat);
		gl.uniform4fv(particleColorLoc, flatten(vec4(this.colour[0],this.colour[1],this.colour[2],this.opacity) ) );

		gl.drawArrays(gl.POINT,particleStart,1);

		this.posX+= ((Math.random()*this.wiggle)-this.wiggle/2);
		this.posY+= ((Math.random()*this.wiggle)-this.wiggle/2);
		this.posZ+= -0.025;
		this.instanceMat = translate(this.posX,this.posY,this.posZ);
	}
}