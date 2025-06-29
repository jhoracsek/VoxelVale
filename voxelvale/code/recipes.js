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
		Switches based on the current crafting station: 'currentCraftingStation',
		as defined in 'craftingmenu.js'.
	*/
	switch(currentCraftingStation){
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
	static craftingStation = REQUIRES_NO_CRAFTING_STATION; get craftingStation() {return this.constructor.craftingStation;}
	constructor(Obj=null, recipe, numReturned){
		this.name=Obj.name + ' Recipe';
		this.desc=Obj.desc;
		this.object = Obj;
		this.recipe = recipe;
		this.numReturned = numReturned;
		this.isTall = Obj.isTall;
	}

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
	constructor(){
		super(new WoodBlock(), [[new WoodLog(),1]],2);
		this.desc='Recipe for a wood block.';
	}
}

class DoorRecipe extends Recipe{
	static objectNumber = 130;
	static craftingStation = REQUIRES_WORKBENCH;
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
	constructor(){
		super(new BrickBlock(), [[new StoneBlock(),2]],1);
		this.desc='Recipe for a brick block.';
	}
}

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

class ArrowRecipe extends Recipe{
	static objectNumber = 133;
	static craftingStation = REQUIRES_WORKBENCH;
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



const RECIPE_OBJNUMS = [WorkBenchRecipe,WoodBlockRecipe,DoorRecipe,BrickBlockRecipe,CopperBarRecipe, ArrowRecipe];





