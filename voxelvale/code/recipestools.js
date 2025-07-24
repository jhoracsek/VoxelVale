
/*
	ABSTRACTS.
*/
class PickRecipeAbstract extends Recipe{
	static objectNumber = -1;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static color = hexToRgbA('#e55f28');
	
	static sendData(){
		this.indexWireframe = vertices.length;
		build_pickaxe_wireframe();
		this.numWireframeVerts = vertices.length - this.indexWireframe;

		this.index = vertices.length;
		build_pickaxe_blue(this.color);
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
class AxeRecipeAbstract extends Recipe{
	static objectNumber = -1;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static color = hexToRgbA('#e55f28');
	
	static sendData(){
		this.indexWireframe = vertices.length;
		build_axe_wireframe();
		this.numWireframeVerts = vertices.length - this.indexWireframe;

		this.index = vertices.length;
		build_axe_blue(this.color);
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

class SwordRecipeAbstract extends Recipe{
	static objectNumber = -1;
	static craftingStation = REQUIRES_WORKBENCH;

	static indexWireframe = 0; get indexWireframe() {return this.constructor.indexWireframe;}
	static numWireframeVerts = 0; get numWireframeVerts() {return this.constructor.numWireframeVerts;}

	static index = 0; get index() {return this.constructor.index;}
	static numberOfVerts = 0; get numberOfVerts() {return this.constructor.numberOfVerts;}

	static color = hexToRgbA('#e55f28');
	
	static sendData(){
		this.indexWireframe = vertices.length;
		build_sword_wireframe();
		this.numWireframeVerts = vertices.length - this.indexWireframe;

		this.index = vertices.length;
		build_sword(this.color, true);
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










/*
	Pickaxes.
*/
class LatkinPickRecipe extends PickRecipeAbstract{
	static objectNumber = 139;
	static color = hexToRgbA('#bcb7b7');

	constructor(){
		super(new LatkinPickaxe(), [[new LatkinBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a latkin pickaxe.';
	}
}

class IllsawPickRecipe extends PickRecipeAbstract{
	static objectNumber = 140;
	static color = hexToRgbA('#d9fefc');

	constructor(){
		super(new IllsawPickaxe(), [[new IllsawBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for an illsaw pickaxe.';
	}
}

class PlatinumPickRecipe extends PickRecipeAbstract{
	static objectNumber = 141;
	static color = hexToRgbA('#f4f0ed');

	constructor(){
		super(new PlatinumPickaxe(), [[new PlatinumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a platinum pickaxe.';
	}
}

class LunitePickRecipe extends PickRecipeAbstract{
	static objectNumber = 142;
	static color = hexToRgbA('#e4d862');

	constructor(){
		super(new LunitePickaxe(), [[new LuniteBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a lunite pickaxe.';
	}
}

class DaytumPickRecipe extends PickRecipeAbstract{
	static objectNumber = 143;
	static color = hexToRgbA('#ef61f1');

	constructor(){
		super(new DaytumPickaxe(), [[new DaytumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a daytum pickaxe.';
	}
}





/*
	Axes.
*/
class LatkinAxeRecipe extends AxeRecipeAbstract{
	static objectNumber = 144;
	static color = hexToRgbA('#bcb7b7');

	constructor(){
		super(new LatkinAxe(), [[new LatkinBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a latkin axe.';
	}
}
class IllsawAxeRecipe extends AxeRecipeAbstract{
	static objectNumber = 145;
	static color = hexToRgbA('#d9fefc');

	constructor(){
		super(new IllsawAxe(), [[new IllsawBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for an illsaw axe.';
	}
}
class PlatinumAxeRecipe extends AxeRecipeAbstract{
	static objectNumber = 146;
	static color = hexToRgbA('#f4f0ed');

	constructor(){
		super(new PlatinumAxe(), [[new PlatinumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a platinum axe.';
	}
}
class LuniteAxeRecipe extends AxeRecipeAbstract{
	static objectNumber = 147;
	static color = hexToRgbA('#e4d862');

	constructor(){
		super(new LuniteAxe(), [[new LuniteBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a lunite axe.';
	}
}

class DaytumAxeRecipe extends AxeRecipeAbstract{
	static objectNumber = 148;
	static color = hexToRgbA('#ef61f1');

	constructor(){
		super(new DaytumAxe(), [[new DaytumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a daytum axe.';
	}
}




/*
	Swords.
*/
class LatkinSwordRecipe extends SwordRecipeAbstract{
	static objectNumber = 149;
	static color = hexToRgbA('#bcb7b7');

	constructor(){
		super(new LatkinSword(), [[new LatkinBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a latkin sword.';
	}
}

class IllsawSwordRecipe extends SwordRecipeAbstract{
	static objectNumber = 150;
	static color = hexToRgbA('#d9fefc');

	constructor(){
		super(new IllsawSword(), [[new IllsawBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for an illsaw sword.';
	}
}

class PlatinumSwordRecipe extends SwordRecipeAbstract{
	static objectNumber = 151;
	static color = hexToRgbA('#f4f0ed');

	constructor(){
		super(new PlatinumSword(), [[new PlatinumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a platinum sword.';
	}
}

class LuniteSwordRecipe extends SwordRecipeAbstract{
	static objectNumber = 152;
	static color = hexToRgbA('#e4d862');

	constructor(){
		super(new LuniteSword(), [[new LuniteBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a lunite sword.';
	}
}

class DaytumSwordRecipe extends SwordRecipeAbstract{
	static objectNumber = 153;
	static color = hexToRgbA('#ef61f1');

	constructor(){
		super(new DaytumSword(), [[new DaytumBar(),6], [new WoodBlock(), 2]] ,1);
		this.desc='Recipe for a daytum sword.';
	}
}