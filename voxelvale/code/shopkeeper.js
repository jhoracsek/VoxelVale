




/*
	Really for now just make it the player model that's static essentially.

	Basically just a shell to open the shop inventory.

	Need:
		sendData(); 			I.e., build function.

		draw(); 

		angleToPlayer(); 		Called in draw.

		onClick();				To open inventory.

		onHover();				Call 'drawContents().

		drawContents();			Write: 'Open Shop' or something.


	Maybe give him a nose.

*/

class ShopKeeper extends TownFolk{


	//Not making x/y position static because maybe in future updates it will move around.
	constructor(pX,pY){
		super(pX,pY);
	}

	draw(){
		this.update();
		var instanceMat = translate(this.posX,this.posY,this.posZ);
		var transformMat = mult(modelViewMatrix, instanceMat);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
		//gl.drawArrays(gl.TRIANGLES, this.constructor.headStart, this.constructor.headNumber);
		//gl.drawArrays(gl.TRIANGLES, this.constructor.headAccStart, this.constructor.headAccNumber);

		this.traverse(this.bodyId);
		
		let dX=player.posX-this.posX-0.5;
		let dY=player.posY-this.posY-0.5;
		 
		if(dX == 0)
			dX = 0.00001;
		if(dX < 0)
			this.angleFacing = 90-(180*Math.atan(dY/dX)/Math.PI);
		else
			this.angleFacing = 270-(180*Math.atan(dY/dX)/Math.PI);


	}


}