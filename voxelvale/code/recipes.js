/*
	Recipes for crafting.
/*
	Recipes
	June 13 2025
*/


class Recipe{
	constructor(Obj=null){
		this.typeOfObj='REC';
		this.name=Obj.name + ' Recipe';
		this.objectToCraft = Obj;
		this.id;
		this.recipe=null;
		this.craftingStation = 'NONE';
		this.objectNumber = -1;
	}

	drawSmall(){
		
	}






}

class WorkBenchRecipe extends Recipe{
	constructor(){
		super(WorkBench);
		this.objectNumber = 128;
	}
}