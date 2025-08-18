/*
	Recipes for crafting.

	These aren't designed the best, but they're fine.

	


	Recipes
	June 13 2025
*/

/*
	The constants below define which crafting station is required.
*/

const REQUIRES_NO_CRAFTING_STATION = 0;
const REQUIRES_WORKBENCH = 1;



/*
	Player should be holding these.
*/
function getEligibleRecipes(){
	if(fastMode)
		return [new WorkBenchRecipe(), new WoodBlockRecipe(), new DoorRecipe() ]

	//Should ret
	var allRecipes = player.getRecipeList();
	var returnedRecipes = [];
	/*
		Switches based on the current crafting station: 'currentStation',
		as defined in 'craftingmenu.js'.
	*/
	switch(currentStation){
		case IN_NONE:
			for(let i = 0; i < allRecipes.length; i++)
				if(allRecipes[i].craftingStation == REQUIRES_NO_CRAFTING_STATION)
					returnedRecipes.push(allRecipes[i]);
			break;
		case IN_WORKBENCH:
			for(let i = 0; i < allRecipes.length; i++)
				if(allRecipes[i].craftingStation == REQUIRES_NO_CRAFTING_STATION || allRecipes[i].craftingStation == REQUIRES_WORKBENCH)
					returnedRecipes.push(allRecipes[i]);
			break;
	}

	return returnedRecipes;
}


class Recipe{
	static objectNumber = -1; get objectNumber() {return this.constructor.objectNumber;}
	static typeOfObj = 'REC'; get typeOfObj() {return this.constructor.typeOfObj;}
	static typeOfRec = 'NONE'; get typeOfRec() {return this.constructor.typeOfRec;}
	static craftingStation = REQUIRES_NO_CRAFTING_STATION; get craftingStation() {return this.constructor.craftingStation;}

	//Price in silver.
	static sellPrice = 1; get sellPrice() {return this.constructor.sellPrice;}
	get buyPrice() {return Math.round(this.sellPrice*(3/2));}
	
	constructor(Obj=null, recipe, numReturned){
		this.name=Obj.name + ' Recipe';
		this.desc=Obj.desc;
		this.object = Obj;
		this.recipe = recipe;
		this.numReturned = numReturned;
		this.isTall = Obj.isTall;
	}
	update(){}
	updateWhenHeld(){}
	getRecipe(){
		return this.recipe;
	}
	isCraftable(){
		var neededObjects=this.getRecipe();
		if(neededObjects==null)
			return false;

		var canCraft=true;
		for(var i=0;i<neededObjects.length;i++){
			if(player.getObjectQuantity(neededObjects[i][0]) < neededObjects[i][1]){
				canCraft=false;
			}
		}

		return canCraft;
	}
	//Remove objects from recipe, then add object to inventory
	craftObject(){
		if(this.isCraftable()==false)
			return;
		var neededObjects=this.getRecipe();
		for(var i=0;i<neededObjects.length;i++){
			for(var j =0; j<neededObjects[i][1];j++){
				player.removeFromInventory(neededObjects[i][0]);
			}
		}
		for(var i=0;i<this.numReturned;i++)
			player.addToInventory(this.object.copy());
		return;
	}

	drawSmallObject(currentMat,scale=0.99){
		gl.uniform1i(cursorBlockLoc, true);
		let mat = mult(translate(0.5,0.5,0.5),mult(scale4(scale,scale,scale,1), translate(-0.5,-0.5,-0.5)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){
		// Draw small transparent block.
		// Kind of looks better but colours are muted set_light();
		this.drawSmallObject(currentMat);

		// Draw blue box
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
	}

}

class WorkBenchRecipe extends Recipe{
	static objectNumber = 128;

	static sellPrice = 20;
	constructor(){
		super(new WorkBench(), [[new StoneBlock(),4], [new WoodLog(),4] ],1);
		this.desc='Recipe for a workbench.';
	}


	drawSmall(currentMat){
		this.drawSmallObject(currentMat);

		currentMat = mult(currentMat,translate(1,0,0) );
		
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),scale4(1,1,0.5)))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
		
		
		var legMV = translate(0,0,0.45);
		legMV=mult(legMV,translate(0.05,0.05,0));
		legMV=mult(legMV,scale4(0.2,0.2,0.75));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);

		
		legMV=mult(legMV,translate(3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
		legMV=mult(legMV,translate(0,3.5,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
		legMV=mult(legMV,translate(-3.5,0,0));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(rotateY(-90),legMV))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
	}
}

class WoodBlockRecipe extends Recipe{
	static objectNumber = 129;

	static sellPrice = 20;
	constructor(){
		super(new WoodBlock(), [[new WoodLog(),1]],2);
		this.desc='Recipe for a wood block.';
	}
}

class DoorRecipe extends Recipe{
	static objectNumber = 130;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 20;
	constructor(){
		super(new Door(), [[new WoodBlock(),8]],1);
		this.desc='Recipe for a wooden door.';
	}
	drawSmallObject(currentMat,scale=0.99){
		gl.uniform1i(cursorBlockLoc, true);
		let mat = mult(translate(0.5,0,0.5),mult(scale4(scale,scale,scale,1), translate(-0.5,0,-0.5)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}
	drawSmall(currentMat){
		this.drawSmallObject(currentMat,0.99);
		var mat;
		mat = mult(rotateY(-90), mult(scale4(1,this.object.doorScale,1),mult(scale4(0.85,0.85,0.85),translate(-this.object.doorScale,0,-1))));	
		
		currentMat = mult(currentMat,mat);
		
		//Don't draw top!
		//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,scale4(1,1,2,1))));
		
		//gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
		//gl.drawArrays(gl.TRIANGLES,this.object.index,this.object.numberOfVerts);

		//Don't draw bottom!
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat,mult(scale4(1,1,2,1),translate(0,0,-0.5)))));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
	}
}

class BrickBlockRecipe extends Recipe{
	static objectNumber = 131;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 20;
	constructor(){
		super(new BrickBlock(), [[new StoneBlock(),2]],1);
		this.desc='Recipe for a brick block.';
	}
}


class BarRecipeAbstract extends Recipe{
	static objectNumber = -1;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static colorOne = hexToRgbA('#bcb7b7');
	static colorTwo = hexToRgbA('#92774c');

	static typeOfRec = 'BAR';

	static sendData(){
		this.indexWireframe = vertices.length;
		build_bar_wireframe();
		this.numWireframeVerts = vertices.length - this.indexWireframe;

		this.index = vertices.length;
		build_colored_bar(this.colorOne, this.colorTwo, true);
		this.numberOfVerts = vertices.length - this.index;
	}

	constructor(Obj, recipe, numRet){
		super(Obj, recipe, numRet);
		this.desc='ABSTRACT TYPE.';
	}
	drawSmallObject(currentMat,scale=0.95){

		gl.uniform1i(cursorBlockLoc, true);
		let mat = mult(translate(0,2.5,0),mult(scale4(scale,1,scale,1), translate(0,-2.5,0)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){
		//set_light_full();
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,this.indexWireframe,this.numWireframeVerts);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

/*
class CopperBarRecipe extends Recipe{
	static objectNumber = 132;
	static craftingStation = REQUIRES_WORKBENCH;
	constructor(){
		super(new CopperBar(), [[new Copper(),2]],1);
		this.desc='Recipe for a copper bar.';
	}
	drawSmall(currentMat){
		// Draw small transparent block.
		// Kind of looks better but colours are muted set_light();
		this.drawSmallObject(currentMat);

		// Draw blue box
		currentMat = mult(currentMat,mult(scale4(0.5, 1.25 ,0.65),translate(0.5,-0.1,0.29)));
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
	}
}
*/

/*
	Bar recipes.
*/
class CopperBarRecipe extends BarRecipeAbstract{
	static objectNumber = 132;
	static colorOne = hexToRgbA('#ed9f61');
	static colorTwo = hexToRgbA('#7fb6a3');

	static sellPrice = 16;

	constructor(){
		super(new CopperBar(), [[new Copper(),2]],1);
		this.desc='Recipe for a copper bar.';
	}
}

class LatkinBarRecipe extends BarRecipeAbstract{
	static objectNumber = 154;
	static colorOne = hexToRgbA('#bcb7b7');
	static colorTwo = hexToRgbA('#92774c');

	static sellPrice = 32;

	constructor(){
		super(new LatkinBar(), [[new Latkin(),2]],1);
		this.desc='Recipe for a latkin bar.';
	}
}

class IllsawBarRecipe extends BarRecipeAbstract{
	static objectNumber = 155;
	static colorOne = hexToRgbA('#d9fefc');
	static colorTwo = hexToRgbA('#7b9da3');

	static sellPrice = 64;

	constructor(){
		super(new IllsawBar(), [[new Illsaw(),2]],1);
		this.desc='Recipe for an illsaw bar.';
	}
}

class PlatinumBarRecipe extends BarRecipeAbstract{
	static objectNumber = 156;
	static colorOne = hexToRgbA('#f4f0ed');
	static colorTwo = hexToRgbA('#b8b6b7');

	static sellPrice = 128;

	constructor(){
		super(new PlatinumBar(), [[new Platinum(),2]],1);
		this.desc='Recipe for a platinum bar.';
	}
}

class LuniteBarRecipe extends BarRecipeAbstract{
	static objectNumber = 157;
	static colorOne = hexToRgbA('#e4d862');
	static colorTwo = hexToRgbA('#bbad24');

	static sellPrice = 256;

	constructor(){
		super(new LuniteBar(), [[new Lunite(),2]],1);
		this.desc='Recipe for a lunite bar.';
	}
}

class DaytumBarRecipe extends BarRecipeAbstract{
	static objectNumber = 158;
	static colorOne = hexToRgbA('#ef61f1');
	static colorTwo = hexToRgbA('#cb28d7');

	static sellPrice = 512;

	constructor(){
		super(new DaytumBar(), [[new Daytum(),2]],1);
		this.desc='Recipe for a daytum bar.';
	}
}

/*
	Bar recipes end.
*/

class ArrowRecipe extends Recipe{
	static objectNumber = 133;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 20;
	constructor(){
		super(new ArrowItem(), [[new StoneBlock(),1],[new WoodBlock(), 1]],1);
		this.desc='Recipe for an arrow.';
	}

	drawSmallObject(currentMat,scale=0.99){
		gl.uniform1i(cursorBlockLoc, true);
		let mat = mult(translate(0.5,0.5,0.5),mult(scale4(scale,scale,scale,1), translate(-0.5,-0.5,-0.5)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}



	drawSmall(currentMat){
		// Draw small transparent block.
		// Kind of looks better but colours are muted set_light();
		this.drawSmallObject(currentMat);

		// Draw blue box
		currentMat = mult(currentMat, ArrowMat);
		currentMat = mult(translate(0,0.04,0,1),currentMat)

		//currentMat = mult(translate(0,0.04,0,1),currentMat)

		currentMat = mult(currentMat,mult(scale4(0.13, 1.4 ,0.13),translate(-0.5,-0.3,-0.5)));

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);
	}
}


/*
	Make general tool recipe class?
*/
class CopperPickRecipe extends Recipe{
	static objectNumber = 134;
	static craftingStation = REQUIRES_WORKBENCH;
	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static sellPrice = 64;

	static sendData(){
		CopperPickRecipe.indexWireframe = vertices.length;
		build_pickaxe_wireframe();
		CopperPickRecipe.numWireframeVerts = vertices.length - CopperPickRecipe.indexWireframe;

		CopperPickRecipe.index = vertices.length;
		build_pickaxe_blue(hexToRgbA('#e55f28'));
		CopperPickRecipe.numberOfVerts = vertices.length - CopperPickRecipe.index;
	}

	constructor(){
		super(new CopperPickaxe(), [[new CopperBar(),6], [new WoodBlock(), 2]],1);
		this.desc='Recipe for a copper pickaxe.';
	}


	drawSmallObject(currentMat,scale=0.95){
		gl.uniform1i(cursorBlockLoc, true);
		//	Highest y: 2.5
		//	Lowest y: 0.05
		//	Midsection: 1.275
		let mat = mult(translate(0,2.5,0),mult(scale4(scale,1,scale,1), translate(0,-2.5,0)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){

		//this.drawSmallObject(currentMat);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,this.indexWireframe,this.numWireframeVerts);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}




class CopperAxeRecipe extends Recipe{
	static objectNumber = 135;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	
	static sellPrice = 64;

	static sendData(){
		CopperAxeRecipe.indexWireframe = vertices.length;
		build_axe_wireframe();
		CopperAxeRecipe.numWireframeVerts = vertices.length - CopperAxeRecipe.indexWireframe;

		CopperAxeRecipe.index = vertices.length;
		build_axe_blue(hexToRgbA('#e55f28'));
		CopperAxeRecipe.numberOfVerts = vertices.length - CopperAxeRecipe.index;
	}

	constructor(){
		super(new CopperAxe(), [[new CopperBar(),6], [new WoodBlock(), 2]],1);
		this.desc='Recipe for a copper axe.';
	}

	drawSmallObject(currentMat,scale=0.95){
		gl.uniform1i(cursorBlockLoc, true);
		//	Highest y: 2.5
		//	Lowest y: 0.05
		//	Midsection: 1.275
		let mat = mult(translate(0,2.5,0),mult(scale4(scale,1,scale,1), translate(0,-2.5,0)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){

		//this.drawSmallObject(currentMat);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,this.indexWireframe,this.numWireframeVerts);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

class CopperSwordRecipe extends Recipe{
	static objectNumber = 136;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}
	
	static sellPrice = 64;

	static sendData(){
		CopperSwordRecipe.indexWireframe = vertices.length;
		build_sword_wireframe();
		CopperSwordRecipe.numWireframeVerts = vertices.length - CopperSwordRecipe.indexWireframe;

		CopperSwordRecipe.index = vertices.length;
		build_sword(hexToRgbA('#e55f28'), true);
		CopperSwordRecipe.numberOfVerts = vertices.length - CopperSwordRecipe.index;
	}

	constructor(){
		super(new CopperSword(), [[new CopperBar(),6], [new WoodBlock(), 2]],1);
		this.desc='Recipe for a copper sword.';
	}

	drawSmallObject(currentMat,scale=0.9){
		gl.uniform1i(cursorBlockLoc, true);
		//	Highest y: 2.5
		//	Lowest y: 0.05
		//	Midsection: 1.275
		let mat = mult(translate(0,2.5,0),mult(scale4(scale,1,scale,1), translate(0,-2.5,0)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){

		//this.drawSmallObject(currentMat);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,this.indexWireframe,this.numWireframeVerts);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

class CopperBrickRecipe extends Recipe{
	static objectNumber = 137;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 100;

	constructor(){
		super(new CopperBrick(), [[new CopperBar(),3]],2);
		this.desc='Recipe for a copper brick block.';
	}
}

class ChestRecipe extends Recipe{
	static objectNumber = 138;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 20;

	constructor(){
		super(new Chest(), [[new WoodBlock(),12]],1);
		this.desc='Recipe for a workbench.';
	}

	
	drawSmall(currentMat){
		this.drawSmallObject(currentMat);

		currentMat = mult(currentMat,translate(1,0,0));
		currentMat = mult(currentMat,mult(rotateY(-90),scale4(1,1,1)));

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.object.topMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.object.bottomMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(currentMat, this.object.latchMatOriginal)));
		gl.drawArrays(gl.TRIANGLES,cursorBytes[5][0],cursorBytes[5][1]);

		return;
	}
	
}



/*
	Make abstract class for this.	()

	Then move to recipestools.js 	()
*/


class BowRecipeAbstract extends Recipe{
	static objectNumber = -1;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static color = hexToRgbA('#FF0000');
	
	static sendData(){
		this.indexWireframe = vertices.length;
		build_bow_wireframe();
		this.numWireframeVerts = vertices.length - this.indexWireframe;

		this.index = vertices.length;
		build_bow_blue(this.color);
		this.numberOfVerts = vertices.length - this.index;
	}

	constructor(Obj, recipe, numRet){
		super(Obj, recipe, numRet);
		this.desc='ABSTRACT TYPE.';
	}

	drawSmallObject(currentMat,scale=0.95){
		gl.uniform1i(cursorBlockLoc, true);
		let mat = mult(translate(0,2.5,0),mult(scale4(scale,1,scale,1), translate(0,-2.5,0)));
		this.object.drawSmall(mult(currentMat,mat));
		gl.uniform1i(cursorBlockLoc, false);
	}

	drawSmall(currentMat){
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.LINES,this.indexWireframe,this.numWireframeVerts);
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(currentMat));
		gl.drawArrays(gl.TRIANGLES,this.index,this.numberOfVerts);
	}
}

class WoodenBowRecipe extends BowRecipeAbstract{
	static objectNumber = 159;

	static color = vec4(0.9,0.6,0.15,1);

	static sellPrice = 100;
	constructor(){
		super(new WoodenBow(), [[new StoneBlock(),2],[new WoodBlock(), 6]],1);
		this.desc='Recipe for a bow.';
	}
}


class ComDirtRecipe extends Recipe{
	static objectNumber = 160;

	static sellPrice = 20;
	constructor(){
		super(new CompactedDirt(), [[new GrassBlock(),4]],1);
		this.desc='Recipe for a compacted dirt block.';
	}
}

class ComSandRecipe extends Recipe{
	static objectNumber = 161;

	static sellPrice = 20;
	constructor(){
		super(new CompactedSand(), [[new SandBlock(),4]],1);
		this.desc='Recipe for a compacted sand block.';
	}
}

class ClayBrickRecipe extends Recipe{
	static objectNumber = 162;

	static sellPrice = 20;
	constructor(){
		super(new ClayBrick(), [[new Clay(),4]],1);
		this.desc='Recipe for a brick block.';
	}
}


//Start here.
class LatkinBrickRecipe extends Recipe{
	static objectNumber = 163;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 200;

	constructor(){
		super(new LatkinBrick(), [[new LatkinBar(),3]],2);
		this.desc='Recipe for a latkin brick block.';
	}
}

class IllsawBrickRecipe extends Recipe{
	static objectNumber = 164;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 400;

	constructor(){
		super(new IllsawBrick(), [[new IllsawBar(),3]],2);
		this.desc='Recipe for an illsaw brick block.';
	}
}

class PlatinumBrickRecipe extends Recipe{
	static objectNumber = 165;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 800;

	constructor(){
		super(new PlatinumBrick(), [[new PlatinumBar(),3]],2);
		this.desc='Recipe for a platinum brick block.';
	}
}

class LuniteBrickRecipe extends Recipe{
	static objectNumber = 166;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 1600;

	constructor(){
		super(new LuniteBrick(), [[new LuniteBar(),3]],2);
		this.desc='Recipe for a lunite brick block.';
	}
}

class DaytumBrickRecipe extends Recipe{
	static objectNumber = 167;
	static craftingStation = REQUIRES_WORKBENCH;

	static sellPrice = 3200;

	constructor(){
		super(new DaytumBrick(), [[new DaytumBar(),3]],2);
		this.desc='Recipe for a daytum brick block.';
	}
}





