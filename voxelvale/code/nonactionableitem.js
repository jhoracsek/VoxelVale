

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
	static isConsumable = false; get isConsumable() {return this.constructor.isConsumable;}
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
	nonActionableItems = [Copper, CopperBar, ArrowItem, HealthPotion];
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


class HealthPotion extends NonActionableItem {
	static objectNumber = 72;
	static name = 'Red Potion';
	static desc = 'A potion to restore your health.';
	static isConsumable = true;
	static wireFrameStart = 0;
	static wireFrameNumber = 0;

	static blueStart = 0;
	static blueNumber = 0;

	static redStart = 0;
	static redNumber = 0;

	static corkStart = 0;
	static corkNumber = 0;

	static sendData(){


		//Make light blue. outline
		//Then transparent blue faces.
		//Bounds are [0,0,0] to [1,1,1]
		let c =vec4(18/255,225/255,218/255,0.5);
		HealthPotion.wireFrameStart = vertices.length;
		//Bottom of potion
		let base1, base2, base3, base4;
		let baseWidth = 0.6;
		base1 = vec3(0,0,0);
		base2 = vec3(0,baseWidth,0);
		base3 = vec3(0,baseWidth,baseWidth);
		base4 = vec3(0,0,baseWidth);

		wireframe_line(base1, base2,c);
		wireframe_line(base2, base3,c);
		wireframe_line(base3, base4,c);
		wireframe_line(base4, base1,c);

		//Top portion of potion container.
		let midHeight = 0.5;
		let top1, top2, top3, top4;
		top1 = vec3(midHeight,0,0);
		top2 = vec3(midHeight,baseWidth,0);
		top3 = vec3(midHeight,baseWidth,baseWidth);
		top4 = vec3(midHeight,0,baseWidth);
		wireframe_line(top1, top2,c);
		wireframe_line(top2, top3,c);
		wireframe_line(top3, top4,c);
		wireframe_line(top4, top1,c);

		//Connecting lines.
		wireframe_line(base1, top1,c);
		wireframe_line(base2, top2,c);
		wireframe_line(base3, top3,c);
		wireframe_line(base4, top4,c);

		// From top of base, do spout bottom.
		let spoutWidth = 0.125;
		let middlePoint = baseWidth/2;
		let spoutBase1, spoutBase2, spoutBase3, spoutBase4;
		spoutBase1 = vec3(midHeight,middlePoint-spoutWidth,middlePoint-spoutWidth);
		spoutBase2 = vec3(midHeight,middlePoint+spoutWidth,middlePoint-spoutWidth);
		spoutBase3 = vec3(midHeight,middlePoint+spoutWidth,middlePoint+spoutWidth);
		spoutBase4 = vec3(midHeight,middlePoint-spoutWidth,middlePoint+spoutWidth);

		wireframe_line(spoutBase1, spoutBase2,c);
		wireframe_line(spoutBase2, spoutBase3,c);
		wireframe_line(spoutBase3, spoutBase4,c);
		wireframe_line(spoutBase4, spoutBase1,c);

		// Top of spout.
		let spoutTop1, spoutTop2, spoutTop3, spoutTop4;
		let spoutHeight = 0.7;
		spoutTop1 = vec3(spoutHeight,middlePoint-spoutWidth,middlePoint-spoutWidth);
		spoutTop2 = vec3(spoutHeight,middlePoint+spoutWidth,middlePoint-spoutWidth);
		spoutTop3 = vec3(spoutHeight,middlePoint+spoutWidth,middlePoint+spoutWidth);
		spoutTop4 = vec3(spoutHeight,middlePoint-spoutWidth,middlePoint+spoutWidth);

		wireframe_line(spoutTop1, spoutTop2,c);
		wireframe_line(spoutTop2, spoutTop3,c);
		wireframe_line(spoutTop3, spoutTop4,c);
		wireframe_line(spoutTop4, spoutTop1,c);

		// Connecting lines.
		wireframe_line(spoutBase1, spoutTop1,c);
		wireframe_line(spoutBase2, spoutTop2,c);
		wireframe_line(spoutBase3, spoutTop3,c);
		wireframe_line(spoutBase4, spoutTop4,c);

		// Draw cork at top of spout.

		/*
			Probably no wireframes for cork top.
		*/
		/*
		//Base of cork.
		let corkBase1, corkBase2, corkBase3, corkBase4;
		spoutWidth = 0.2; // For simplicity, this is the corkWidth
		corkBase1 = vec3(spoutHeight,middlePoint-spoutWidth,middlePoint-spoutWidth);
		corkBase2 = vec3(spoutHeight,middlePoint+spoutWidth,middlePoint-spoutWidth);
		corkBase3 = vec3(spoutHeight,middlePoint+spoutWidth,middlePoint+spoutWidth);
		corkBase4 = vec3(spoutHeight,middlePoint-spoutWidth,middlePoint+spoutWidth);
		wireframe_line(corkBase1, corkBase2);
		wireframe_line(corkBase2, corkBase3);
		wireframe_line(corkBase3, corkBase4);
		wireframe_line(corkBase4, corkBase1);

		//Top of cork.
		let corkTop1, corkTop2, corkTop3, corkTop4;
		let corkTopHeight = 0.8;
		spoutWidth = 0.2; // For simplicity, this is the corkWidth
		corkTop1 = vec3(corkTopHeight,middlePoint-spoutWidth,middlePoint-spoutWidth);
		corkTop2 = vec3(corkTopHeight,middlePoint+spoutWidth,middlePoint-spoutWidth);
		corkTop3 = vec3(corkTopHeight,middlePoint+spoutWidth,middlePoint+spoutWidth);
		corkTop4 = vec3(corkTopHeight,middlePoint-spoutWidth,middlePoint+spoutWidth);
		wireframe_line(corkTop1, corkTop2);
		wireframe_line(corkTop2, corkTop3);
		wireframe_line(corkTop3, corkTop4);
		wireframe_line(corkTop4, corkTop1);

		//Connecting lines
		wireframe_line(corkBase1, corkTop1);
		wireframe_line(corkBase2, corkTop2);
		wireframe_line(corkBase3, corkTop3);
		wireframe_line(corkBase4, corkTop4);
		*/
		HealthPotion.wireFrameNumber =vertices.length - HealthPotion.wireFrameStart;

		c =vec4(18/255,225/255,218/255,0.1);
		/*
			Now do the blue border
		*/
		HealthPotion.blueStart = vertices.length;

		build_colored_cuboid(c);

		HealthPotion.blueNumber = vertices.length - HealthPotion.blueStart;

		/*
			Now do cork.
		*/
		HealthPotion.corkStart = vertices.length;

		build_colored_cuboid(hexToRgbA('#493020'));

		HealthPotion.corkNumber = vertices.length - HealthPotion.corkStart;


		/*
			Now the red.
		*/
		HealthPotion.redStart = vertices.length;

		build_colored_cuboid(vec4(1,0.1,0.2,1));

		HealthPotion.redNumber = vertices.length - HealthPotion.redStart;


	}

	draw(){

	} 

	drawSmall(currentMat){
		//set_light()
		currentMat = mult(translate(0.006,0.017,0), mult(currentMat, scale4(1.2,1.2,1.2)));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(translate(0.025,0.025,0.025),scale4(0.45,0.55,0.55)))));
		gl.drawArrays(gl.TRIANGLES,HealthPotion.redStart,HealthPotion.redNumber);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,HealthPotion.wireFrameStart,HealthPotion.wireFrameNumber);
		
		//Base transparent blue.
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,scale4(0.5,0.6,0.6))));
		gl.drawArrays(gl.TRIANGLES,HealthPotion.blueStart,HealthPotion.blueNumber);
		//Spout transparent blue.
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(translate(0.5,0.175,0.175),scale4(0.2,0.25,0.25)))));
		gl.drawArrays(gl.TRIANGLES,HealthPotion.blueStart,HealthPotion.blueNumber);

		//Now cork
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(translate(0.7,0.1,0.1),scale4(0.1,0.4,0.4)))));
		gl.drawArrays(gl.TRIANGLES,HealthPotion.corkStart,HealthPotion.corkNumber);


		

	}

	constructor(){super();}

}





const ITEM_OBJNUMS = [WoodAxe, StonePickaxe, WoodenBow, Copper, CopperBar, ArrowItem, CopperPickaxe, CopperAxe, HealthPotion];