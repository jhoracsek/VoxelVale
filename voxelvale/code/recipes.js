/*
	Recipes for crafting.

	Recipes have some instance variables,
	because I think there should only ever be one
	in existence.
/*
	Recipes
	June 13 2025
*/


/*
	Player should be holding these.
*/
function getAllRecipes(){
	//return [new WorkBenchRecipe()]
	return player.getRecipeList()
}


class Recipe{
	static objectNumber = -1; get objectNumber() {return this.constructor.objectNumber;}
	static typeOfObj = 'REC'; get typeOfObj() {return this.constructor.typeOfObj;}
	static craftingStation = 'ALL'; get craftingStation() {return this.constructor.craftingStation;}
	constructor(Obj=null, recipe, numReturned){
		this.name=Obj.name + ' Recipe';
		this.desc=Obj.desc;
		this.object = Obj;
		this.recipe = recipe;
		this.numReturned = numReturned;
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

	drawSmall(){
		
	}
}

class WorkBenchRecipe extends Recipe{
	static objectNumber = 128;
	constructor(){
		super(new WorkBench(), [[new StoneBlock(),4], [new WoodLog(),4] ],1);
	}
}

class WoodBlockRecipe extends Recipe{
	static objectNumber = 129;
	constructor(){
		super(new WoodBlock(), [[new WoodLog(),1]],2);
	}
}

class DoorRecipe extends Recipe{
	static objectNumber = 130;
	constructor(){
		super(new Door(), [[new WoodBlock(),8]],1);
	}
}



const RECIPE_OBJNUMS = [WorkBenchRecipe,WoodBlockRecipe,DoorRecipe];





