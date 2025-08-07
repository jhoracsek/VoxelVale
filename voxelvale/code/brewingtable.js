


/*
	Abstract class for interactable blocks that can be opened like
	chests.
*/
class BrewingTable extends BlockWallNew{

	static isInteractable = true;

	static topStart = 0;
	static topNumber = 0;

	static objectNumber = 26;
	static name = 'Brewing Table';
	static desc = 'A table to brew potions.';
	static tob = 'STONE';
	static particleColor = vec3(0.5, 0.5, 0.5);
	static displayWidth = 1.1; get displayWidth() {return this.constructor.displayWidth;}

	static sellPrice = 24;

	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z,false);
	}

	static sendData(){
		this.index = vertices.length;
		build_block_3D(41,0,0,40+8,40+8);
		this.numberOfVerts = vertices.length - this.index;
		
		this.topStart = vertices.length;
		build_block_3D(40,0,0,40+8,40+8);
		this.topNumber = vertices.length - this.topStart;
	}



	draw(){
		set_mv(this.instanceMat);
		if(hitBox){
			gl.drawArrays(gl.LINES,numberOfByte[0],numberOfByte[1]);
		}
	
		gl.drawArrays(gl.TRIANGLES,this.index+6,this.numberOfVerts-6);
	
	}

	drawContents(){
		if(inventory|| inFunction) return;
		let c = vec4(0.5,1,0,1);
		c = mult(translate(this.posX, this.posY, this.posZ), c);
		c = mult(modelViewMatrix, c);
		c = mult(projectionMatrix, c);
		c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5] //Exact center.
		draw_filled_box(c[0]-this.displayWidth/2,c[1],c[0]+this.displayWidth/2,c[1]+(1.3)*0.17);
		draw_centered_text(c[0],c[1]+0.1,"Use brewing table.",'12');
	}

	onHover(){
		//this.drawContents();

	}

	onClick(){
		//toggleInventory(IN_CHEST,this);
		//this.isOpen = true;
	}
}

