

/*
	Non-actionable items to be used in crafting essentially.

	This is designed to replace the "Item" class. Typically,
	items are just used in crafting, they have very few instance
	properties.

	Jun 28th 2025
*/

class NonActionableItem {
	static objectNumber = -1; get objectNumber() {return this.constructor.objectNumber;}
	static name = 'NULL'; get name() {return this.constructor.name;}
	static desc = 'No description.'; get desc() {return this.constructor.desc;}
	static typeOfObj = 'NON_ACTIONABLE_ITEM'; get typeOfObj() {return this.constructor.typeOfObj;}
	static actionType='NONE'; get actionType() {return this.constructor.actionType;}
	static index = 0; get index() {return this.constructor.index;}
	static toolType='NONE'; get toolType() {return this.constructor.toolType;}
	static numberOfVerts = 36; get numberOfVerts() {return this.constructor.numberOfVerts;}
	static sendData(){}

	constructor(){}
	draw(){
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	} 

	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		this.draw();
	}

	copy(){return new this.constructor();}
}


function initializeNonActionableItems(){
	nonActionableItems = [Copper, CopperBar, ArrowItem];
}


/*
	Ore scaling matrices.
*/
let ore1 = scale4(0.8,0.5,0.6,1);
let ore2 = mult(translate(0.1,0.2,0.1),scale4(0.5,0.5,0.7,1));
let ore3 = mult(translate(0.25,0.25,0.12),scale4(0.5,0.3,0.7,1));
let ore4 = mult(translate(0.6,0.3,0.3),scale4(0.25,0.23,0.27,1));
//let ore5 = mult(translate(-0.1,-0.1,-0.1),scale4(0.25,0.23,0.27,1));
let ore5 = mult(translate(-0.01,-0.01,-0.1),scale4(0.25,0.23,0.27,1));
let ore6 = mult(translate(-0.05,-0.05,-0.05),scale4(0.55,0.73,0.37,1));
let ore7 = mult(translate(0.05,0.05,-0.02),scale4(0.9,0.6,0.41,1));
let ore8 = mult(translate(-0.1,0.3,-0.02),scale4(0.3,0.4,0.41,1));
let ore9 = mult(translate(0.1,0.1,0.12),scale4(0.8,0.2,0.65,1));
class Copper extends NonActionableItem {
	static objectNumber = 67;
	static name = 'Copper';
	static desc = 'Copper ore.';

	static sendData(){
		//Three cubes
		build_colored_cuboid(hexToRgbA('#ed9f61'));
		build_colored_cuboid(hexToRgbA('#7fb6a3'));
		build_colored_cuboid(hexToRgbA('#918f9c'));

	}
	constructor(){super();}

	drawCopperColor(){
		gl.drawArrays(gl.TRIANGLES,this.index,36);
	}
	drawGreenColor(){
		gl.drawArrays(gl.TRIANGLES,this.index+36,36);
	}
	drawGreyColor(){
		gl.drawArrays(gl.TRIANGLES,this.index+72,36);
	}

	drawSmall(currentMat){
		set_light();
		currentMat = mult(currentMat,translate(0,0.25,0.2));

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore1)));
		this.drawGreenColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore2)));
		this.drawCopperColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore3)));
		this.drawGreyColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore4)));
		this.drawCopperColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore5)));
		this.drawCopperColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore6)));
		this.drawGreyColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore7)));
		this.drawGreenColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore8)));
		this.drawCopperColor();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,ore9)));
		this.drawCopperColor();
	}



}




class CopperBar extends NonActionableItem{
	static objectNumber = 68;
	static name = 'Copper Bar';
	static desc = 'Copper bar.';

	static sendData(){
		//Three cubes
		build_colored_bar(hexToRgbA('#e58158'),hexToRgbA('#ac966b') );

	}
	constructor(){super();}

}


//let ArrowMat = mult(scale4(1.3mult(rotateZ(-55-29),mult(rotateX(-45),rotateY(-55))
let ArrowMat = mult(rotateY(-55),mult(rotateX(-45),mult(rotateZ(-55-29),scale4(1.3,1.3,1.3,1))));
class ArrowItem extends NonActionableItem {
	static objectNumber = 69;
	static name = 'Arrow';
	static desc = 'An arrow.';

	static sendData(){build_arrow();}

	constructor(){super();}

	drawSmall(currentMat){

		//mv = mult(mv,translate(2.5,0.15,zLay-0.3));
		//mv = mult(mv,scale4(0.7,0.7,0.001))

		//Save outside!!!
		currentMat = mult(currentMat, ArrowMat);
		currentMat = mult(translate(0,0.04,0,1),currentMat)

		//mv = mult(mv,rotateZ(45));
		//mv = mult(mv,rotateX(45));
		//mv = mult(mv,rotateY(55));

		//currentMat = mult(currentMat, mult(scale4(1.2,1.2,1.2,0),rotateX(0,45,0)));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}





const ITEM_OBJNUMS = [WoodAxe, StonePickaxe, WoodenBow, Copper, CopperBar, ArrowItem];