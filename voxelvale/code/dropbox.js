



/*
	Notes
		Maybe no shadow?

		Maybe add an option for a timer.
		That is drops that the player does will despawn,
		but drops in a dungeon won't.
*/
class DropBox extends X_Y_Z_TextureBlock{
	
	constructor(X=null,Y=null,Z=null, objects=[]){
		super(X,Y,Z,23,15,14,false);
		this.index = dropBoxStart;
		this.name = 'DropBox';
		this.objectNumber = 9;
		this.numReturned=0;
		this.desc = 'DropBox, why is this in your inventory?.'
		this.tob='NONE';
		this.objectsReturned = objects;
		this.objectQuantityPair = [];

		this.minDisplayWidth = 0.9;
		this.displayWidth = this.minDisplayWidth;
		this.isInteractable = true;
		this.refreshQuantities();

		let scaleMat = mult(translate(0.5,0.5,1),mult(scale4(0.8,0.8,0.8), mult(rotateZ(0),translate(-0.5,-0.5,-1))));
		this.unrotatedInstanceMat = mult(translate(X,Y,Z),scaleMat);

		scaleMat = mult(translate(0.5,0.5,1),mult(scale4(0.8,0.8,0.8), mult(rotateZ(90),translate(-0.5,-0.5,-1))));
		this.instanceMat = mult(translate(X,Y,Z),scaleMat);
	}

	getObjectQuantityPair(){
		return this.objectQuantityPair;
	}

	refreshQuantities(){
		let temp = [];
		this.displayWidth = this.minDisplayWidth;
		for(let i = 0; i < this.objectsReturned.length; i++){
			let isIn = false;
			let ind = -1;
			for(let j = 0; j < temp.length; j++){
				if(temp[j][0].objectNumber == this.objectsReturned[i].objectNumber){
					isIn = true;
					ind = j;
				}
			}
			if(isIn){
				temp[ind][1]++;
			}else{
				temp.push([this.objectsReturned[i],1])
				if(measure_text(this.objectsReturned[i].name + ' (x10)','10') > this.displayWidth){
					this.displayWidth = measure_text(this.objectsReturned[i].name + ' (x10)','10');
				}
			}
		}
		this.objectQuantityPair = temp;
	}

	addTo(block){
		//Make sure to run this.refreshQuantities().

		this.objectsReturned.push(block);

		this.refreshQuantities();
	}

	drop(){}

	copy(X=null,Y=null,Z=null){
		return new this.constructor(X,Y,Z,this.objectsReturned);
	}

	destroy(){
		this.spawnParticles();
	
		for(let i = 0; i < this.objectsReturned.length; i++){
			player.addToInventory(this.objectsReturned[i]);
		}

		return;
	}

	
	onClick(){
		removeBlockGlobal(this);
	}

	drawContents(){
		if(inventory) return;
		//let c = vec4(0.5,0.5,0,1);
		let c = vec4(0.5,1,0,1);

		c = mult(this.unrotatedInstanceMat, c);
		c = mult(modelViewMatrix, c);
		c = mult(projectionMatrix, c);

		c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5] //Exact center.



		//Draw box on top (one block)
		//Top should be dependent on how many unique blocks there are!
		draw_filled_box(c[0]-this.displayWidth/2,c[1],c[0]+this.displayWidth/2,c[1]+(this.objectQuantityPair.length+1.25)*0.17);


		draw_centered_text(c[0],c[1]+(this.objectQuantityPair.length+0.5)*0.17,"Contents:",'12');

		for(let i = 0; i < this.objectQuantityPair.length; i++){
			//Print quantity and name.
			let name = this.objectQuantityPair[i][0].name;
			let quant = this.objectQuantityPair[i][1];

			draw_centered_text(c[0],c[1]+(i+0.5)*0.17, name + " (x"+quant.toString()+")" ,'10' );


		}

		//Get object quantity pair from this.objectsReturned.

		//Exact center draw_centered_text((c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5,"HI!")
	}

	onHover(){
		this.drawContents();
	}


	returnBounds(){
		
		return null;
	}
}