
class InventoryObject{
	constructor(Object){
		this.object=Object;
		this.quant=1;
	}
	increase(){this.quant++};
	decrease(){this.quant--};
}



/*
	Maybe just redo this?
*/
class Inventory{
	constructor(){
		this.blockNums=[];
		this.blocks=[];
		this.itemNums=[];
		this.items=[];
		//this.objects=[];
		this.recipes=[];
		this.recipeQuants=[];
	}

	getInventoryContents(){
		return [this.getBlocks(), this.getItems(), this.getNonToolItems(), this.getRecipes()];
	}

	/*
		Given same thing returned by the above.
	*/
	setInventoryContents(){
		this.blockNums=[];
		this.blocks=[];
		this.itemNums=[];
		this.items=[];
		this.recipes=[];
		this.recipeQuants=[];
		//this.constructor();


	}


	addItem(Item){
		if(this.items[Item.objectNumber]==null){
			this.items[Item.objectNumber]=new InventoryObject(Item);
			this.itemNums.push(Item.objectNumber);
		}else{
			this.items[Item.objectNumber].increase();
		}
		return;
	}
	addBlock(Block){
		if(this.blocks[Block.objectNumber]==null){
			this.blocks[Block.objectNumber]=new InventoryObject(Block);
			this.blockNums.push(Block.objectNumber);
		}
		else
			this.blocks[Block.objectNumber].increase();
		return;
	}
	addRecipe(Recipe){
		//Make sure it's not a duplicate.
		let duplicate = false;
		for(let i = 0; i < this.recipes.length; i++){
			if(this.recipes[i].objectNumber == Recipe.objectNumber){
				duplicate = true;
				this.recipeQuants[i]++;
				break;
			}
		}
		if(!duplicate){
			this.recipeQuants.push(1);
			this.recipes.push(Recipe);
		}

	}
	removeItem(Item){
		if(this.items[Item.objectNumber]==null || this.items[Item.objectNumber]==0)
			return;
		else
			this.items[Item.objectNumber].decrease();
		return;
	}
	removeRecipe(Recipe){
		if(Recipe==null){return null;}
		for(let i = 0; i < this.recipes.length; i++){
			if(this.recipes[i].objectNumber == Recipe.objectNumber){
				this.recipeQuants[i]--;
				if(this.recipeQuants[i] <= 0){
					//remove the recipe.
					let maxIndex = this.recipes.length;
					if(maxIndex == 1 || i == maxIndex-1){
						this.recipeQuants.pop();
						this.recipes.pop();
						break;
					}else{
						//remove at index i.
						for(let j = i; j < maxIndex-1; j++){
							this.recipes[j] = this.recipes[j+1];
							this.recipeQuants[j] = this.recipeQuants[j+1];
						}
						this.recipes.pop();
						this.recipeQuants.pop();
					}


				}
				
			}
		}
	}
	removeBlock(Block){
		if(this.blocks[Block.objectNumber]==null || this.blocks[Block.objectNumber]==0)
			return;
		else{
			this.blocks[Block.objectNumber].decrease();
			
			/*
				If we've exhausted our quantity we should remove it from the toolbar.
				The condition here should be that the block is active in the toolbar if it's currently held.
				That is unless it's being used in a recipe. (e.g., wood log).
			*/
			for(let i = NUM_TOOLBAR_TOOLS; i < NUM_TOOLBAR_ITEMS; i++){
				if(toolBarList[i] != null){
					if(toolBarList[i].objectNumber == Block.objectNumber){

						// We know the block is in the toolbar, so we need to remove it if the quantity in the player item is 0.
						if(this.getQuantityBlock(Block) <= 0){
							//This means that we have no blocks remaining so we set the toolbar position to null
							toolBarList[i] = null;
							if((activeToolBarItem-1) == i){
								activeToolBarItem = 8;
								player.heldObject=null;
							}
							return;
						}
					}
				}
			}
			//if(toolBarList[activeToolBarItem-1].objectNumber == Block.objectNumber){

			//}
		}
		return;
	}
	getQuantityBlock(Block){
		if(Block==null){return null;}
		var obj=this.blocks[Block.objectNumber];
		if(obj==null||obj.quant<=0)
			return 0;
		else
			return obj.quant;
	}
	getQuantityItem(Item){
		if(Item==null){return null;}
		var obj=this.items[Item.objectNumber];
		if(obj==null||obj.quant<=0)
			return 0;
		else
			return obj.quant;
	}
	getQuantityRec(Recipe){
		if(Recipe==null){return null;}
		for(let i = 0; i < this.recipes.length; i++){
			if(this.recipes[i].objectNumber == Recipe.objectNumber)
				return this.recipeQuants[i];
		}
		return 0;
	}
	getQuantity(Object){
		switch(Object.typeOfObj){
			case 'ITEM':
				return this.getQuantityItem(Object);
				break;
			case 'BLOCK':
				return this.getQuantityBlock(Object);
				break;
			case 'REC':
				return this.getQuantityRec(Object);
		}
		return 0;
	}
	getBlocks(){
		var retArray=[];
		for(var i=0;i<this.blockNums.length;i++){
			if(this.blocks[this.blockNums[i]].quant>0)
				retArray.push(this.blocks[this.blockNums[i]].object);
		}
		return retArray;
	}
	/*
		Not used!!
	*/
	getTools(){
		return this.getItems();
	}
	getItems(){
		var retArray=[];
		for(var i=0;i<this.itemNums.length;i++){
			if(this.items[this.itemNums[i]].quant>0)
				retArray.push(this.items[this.itemNums[i]].object);
		}
		return retArray;
	}
	getNonToolItems(){
		return [];
	}
	getRecipes(){
		return this.recipes;
	}
}
class Humanoid{
	constructor(X,Y,Z=0){
		//INSTANCE TRANSLATE MATRIX
		//Something
		this.posX = X;
		this.posY = Y;
		this.posZ = Z;
		this.health=10;
		this.deathMarker=false;
	}
	healthDown(amount){
		this.health-=amount;
		return;
	}
	checkIfDead(){
		if(this.health<=0)
			this.deathMarker=true;
		return;
	}
	setHeldObject(OBJECT){
		if(this.heldObject != null)
			this.heldObject.onRelease();
		if(OBJECT == null){
			this.heldObject =null;
			return;
		}
		OBJECT.onHold();
		this.heldObject=OBJECT;
		return;
	}
	hit(angle){
		
	}
	returnBounds(){
		//return [vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(-0.25,-0.25,4,1))),vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(0.25,0.25,1.25,1)))];
		//return [vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(-0.25,-0.25,3.1,1))),vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(0.25,0.25,1.25,1)))];
		return [vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(-0.25,-0.25,1.25,1))),vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(0.25,0.25,3.1,1)))];
		
		/*
		if(fixedView)
			return [vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(-0.25,-0.25,3.1,1))),vec3(mult(translate(this.posX,this.posY,this.posZ),vec4(0.25,0.25,1.25,1)))];
		else
			return [vec3(-0.25,-0.25,3.1,1),vec3(0.25,0.25,1.25,1)];
		*/
	}

}

var fastMode=false;
class Player extends Humanoid{
	constructor(X,Y,Z=0){
		super(X,Y,Z);
		this.heldObject = null;	//SHOULD BE THIS ONE
		//this.heldObject = new WoodAxe();
		this.idle = true;
		this.speed = 0.05;
		//LEFT,RIGHT,UP,DOWN,IDLE
		this.directionMoving;
		this.isMovingLeft = false;
		this.isMovingRight = false;
		this.isMovingUp = false;
		this.isMovingDown = false;
		this.isMoving = false;
		this.isSwinging=false;
		this.isShooting=false;
		this.isPlacing=false;
		this.completedAction=true;
		this.inventory = new Inventory();
	}

	getInventoryContents(){
		return this.inventory.getInventoryContents();
	}
	resetInventory(){
		this.inventory = null;
		this.inventory = new Inventory();
	}

	getItemList(){
		return this.inventory.getItems();
	}
	getBlockList(){
		return this.inventory.getBlocks();
	}
	/*
		Update the name. Right now just used in the tab list.
	*/
	getNonToolList(){
		return [];
	}
	getRecipeList(){
		return this.inventory.getRecipes();
	}
	getObjectQuantity(Object){
		return this.inventory.getQuantity(Object);
	}
	addToInventory(object){
		nQueue.addNotification(new Notification(object,1));
		switch(object.typeOfObj){
			case 'ITEM':
				this.inventory.addItem(object);
				break;
			case 'BLOCK':
				this.inventory.addBlock(object);
				break;
			case 'REC':
				this.inventory.addRecipe(object);
				break;
		}
		tab_lists();
	}
	removeFromInventory(object){
		/*
			Need to account for tool bar.
		*/
		switch(object.typeOfObj){
			case 'ITEM':
				this.inventory.removeItem(object);
				break;
			case 'BLOCK':
				this.inventory.removeBlock(object);
				break;
			case 'REC':
				this.inventory.removeRecipe(object);
				break;
		}
		tab_lists();
	}
	setObject(object){
		this.heldObject = object;
	}
	//test Method
	checkSpeed(){
		if(fastMode)
			this.speed=0.30;
		else
			this.speed=0.05;
	}
	
	move(){
		this.isMoving = false;
		let initialPosX = this.posX;
		let initialPosY = this.posY;

		if(this.isMovingLeft)
			this.moveLeft();
		if(this.isMovingRight)
			this.moveRight();
		if(this.isMovingUp)
			this.moveUp();
		if(this.isMovingDown)
			this.moveDown();

		let diffX = this.posX - initialPosX;
		let diffY = this.posY - initialPosY;
		if(diffX != 0 || diffY != 0)
			this.isMoving = true;
		/*
			Should calculate angle based of which positions are moving.
			(Like if you click w a s) this looks wonky.
		*/
		//if(!this.isShooting)
		//	player_angle_by_diff(diffX,diffY)
		
		//if(this.isMovingDown && this.isMovingLeft){

		if(diffX < 0 && diffY < 0){
			if(!this.isShooting)
				angleFacing = 45;
		}
		//if(this.isMovingDown && this.isMovingRight){
		if(diffX > 0 && diffY < 0){
			if(!this.isShooting)
				angleFacing = -45;
		}

		//if(this.isMovingUp && this.isMovingLeft){
		if(diffX < 0 && diffY > 0){
			if(!this.isShooting)
				angleFacing = 135;
		}
		//if(this.isMovingUp && this.isMovingRight){
		if(diffX > 0 && diffY > 0){
			if(!this.isShooting)
				angleFacing = -135;
		}

		if(!this.isShooting){
			if(diffX == 0){
				if(diffY > 0){
					angleFacing = 180;
				}
				if(diffY < 0){
					angleFacing = 0;
				}
			}

			if(diffY == 0){
				if(diffX > 0){
					angleFacing = -90;
				}
				if(diffX < 0){
					angleFacing = 90;
				}
			}
		}
		//if(diffX == 0 && diffY == 0)
		//	this.idle = true;
		
		if(this.idle){
			soundStopOnDirt();
			this.stopMoving();	
		}else{
			soundWalkOnDirt();
		}
	}
	moveLeft(){
		this.idle = false;
		if(!isStopLeft)
			this.posX-=this.speed;
		if(!this.isShooting)
			angleFacing = 90;
	}
	moveRight(){
		this.idle = false;
		if(!isStopRight)
			this.posX+=this.speed;
		if(!this.isShooting)
			angleFacing = -90;
	}
	moveUp(){
		this.idle = false;
		if(!isStopUp)
			this.posY+=this.speed;
		if(!this.isShooting)
			angleFacing = 180;
	}
	moveDown(){
		this.idle = false;
		if(!isStopDown)
			this.posY-=this.speed;
		if(!this.isShooting)
			angleFacing = 0;
	}
	stopMoving(){
		this.idle = true;
	}
	sendData(){
		head2();
		headVerts = vertices.length;
		build_shoulder();
		shoulderVerts = vertices.length - headVerts;
		build_torso();
		torsoVerts = vertices.length - shoulderVerts-headVerts;
		build_leg();
		legVerts = vertices.length -torsoVerts-shoulderVerts-headVerts;
		build_eye();
		eyeVerts = vertices.length - legVerts -torsoVerts-shoulderVerts-headVerts;

		NM = vertices.length;
	}
	draw(){
		fixLegs = false;
		this.completedAction = true;
		if(!this.isMovingLeft && !this.isMovingRight && !this.isMovingUp && !this.isMovingDown)
			this.stopMoving();
		this.move();

		if(this.isSwinging){
			this.completedAction = false;
			player_swinging();
		}else{
			sound_StopSwinging();
		}
		if(this.isShooting){
			this.completedAction = false;
			player_shooting();
		}
		if(this.isPlacing){
			//this.completedAction=false;
			player_placing();
		}
		player_moving(this.posX,this.posY,this.posZ);
		traverse(bodyId);

	}
	drawShadows(){


		traverse_shadow(bodyId);
	}
	shoot(){

	}
}

function set_humanoid_texture(){
	for(var i = 0; i < 6; i++)
		texCoords.push(vec2(2.0,2.0));
	return;
}

function set_humanoid_texture_head_face(texLoc=0){
	if(texLoc == -1){
		for(var i = 0; i < 6; i++)
			texCoords.push(vec2(2.0,2.0));
		return;
	}
	var s = 8;
	var offsetX = 0.01;
	var offsetY = 0.01;
	var xStart = (texLoc%s)+offsetX;
	var yStart = (Math.floor(texLoc/s))+offsetY;
	var xEnd = xStart+1-(2*offsetX);
	var yEnd = yStart+1-(2*offsetY);

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));
}

function init_player(){
	initialize_node(bodyId);
	initialize_node(headId);
	initialize_node(leftArmId);
	initialize_node(rightArmId);
	initialize_node(leftLegId);
	initialize_node(rightLegId);
	initialize_node(leftShoulderId);
	initialize_node(rightShoulderId);
	initialize_node(leftEyeId);
	initialize_node(rightEyeId);
	initialize_node(toolId);
}

var origCoor=[0,0]
function check_cursor_change_block(){
	var c1 = Math.round((coorSys[0]+player.posX)-9);
	var c2 = Math.round((coorSys[1]+player.posY)-4.5);
	if(c1!=origCoor[0] || c2!=origCoor[1]){
		origCoor[0]=c1;
		origCoor[1]=c2;
		return false;
	}else{
		return true;
	}
}

function check_player_action(){
	if(inventory || inFunction)
		return;
	//console.log(blockCounter)
	if(!check_cursor_change_block())
		blockCounter=0;
	if(!hold || player.heldObject==null)
		return;
	if(player.heldObject.actionType == 'SHOOT'){
		//if(player.heldObject.onLClick() == true)
			player.isShooting = true;
	}else if(player.heldObject.type != 'BLOCK_WALL'){
		player.isSwinging = true;
		var activeItem = player.heldObject.type;
		switch(activeItem){
			case 'TOOL':
				if(fastMode){
					world.removeBlockByPos(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				}
				else if(blockCounter > (blockCounterMax/player.heldObject.strength)){
					blockCounter=0;
					if(cursorGreen || fastMode){
						if(!fixedView){
							world.removeBlockByPos(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
						}else{
							currentDungeon.removeBlockByPos(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
						}
					}
				}
				break;
		}
	}else{
		//Sound played in "controls.js".
	}
}

var vertexPoints = [
	vec3( -0.5, -0.5,  0.5),
    vec3( -0.5,  0.5,  0.5),
    vec3(  0.5,  0.5,  0.5),
    vec3(  0.5, -0.5,  0.5),
    vec3( -0.5, -0.5, -0.5),
    vec3( -0.5,  0.5, -0.5),
    vec3(  0.5,  0.5, -0.5),
    vec3(  0.5, -0.5, -0.5)
];

var phase1=true;
var phase2=false;
var armAngleRightSwing=0;
var armAngleLeftSwing=0;
var armAngleRightTilt=0;
var armAngleLeftTilt=0;
function player_swinging(){
	armAngleLeftSwing=armAngleLeft;
	player_body_angle_to_cursor();
	if(phase1){
		armAngleRightSwing=0;
		phase1=false;
	}
	if(!phase2){
		armAngleRightSwing+=3.5;
		if(armAngleRightSwing > 120){
			sound_StartSwinging();
			phase2=true;
		}
	}
	if(phase2){
		armAngleRightSwing-=10;
		if(armAngleRightSwing<40){
			player.isSwinging=false;
			armAngleRightSwing=0;
			phase2=false;
			phase1=true;
		}
	}

}
function player_shooting(){
	if(hold){
		armAngleRightSwing=90;
		armAngleRightTilt = 5;
		armAngleLeftTilt = -22.5;
		armAngleLeftSwing=90;

		player_angle_to_cursor();

	}else{
		armAngleRightSwing=0;
		armAngleRightTilt=0;
		armAngleLeftTilt=0;
		armAngleLeftSwing=0;
		player.isShooting = false;
	}

}

var placeTimerMax = 10;
var placeTimer = placeTimerMax;
var startPlaceAnimation = true;
//Maybe make the angle in the direction?
function player_placing(){
	if(player.isMoving){
		player.isPlacing = false;
		startPlaceAnimation = true;
		placeTimer = placeTimerMax;
	}
	if(placeTimer > 0){
		if(startPlaceAnimation){
			placeTimer = placeTimerMax;
			startPlaceAnimation = false;
			armAngleRightSwing = placeTimerMax*3-3;
			armAngleRightTilt = placeTimerMax/2;
			player_body_angle_to_cursor();
		}else{
			armAngleRightSwing-=3;
			armAngleRightTilt-=0.5;
		}

		placeTimer--;
	}else{
		player.isPlacing = false;
		startPlaceAnimation = true;
		placeTimer = placeTimerMax;
	}

}

function player_angle_by_diff(diffX, diffY){
	var opp = diffX;
	var adj = diffY;
	if(adj==0 && opp==0){
		angleFacing = 0;
		return;
	}
	if(adj==0 && opp > 0){
		angleFacing = 180;
		return
	}

	if(adj==0 && opp < 0){
		angleFacing = 0;
		return;
	}
	var theta = Math.atan(opp/adj);
	theta = (theta*180)/Math.PI;
	if(adj<0)
		theta = 90+theta;
	else
		theta = 270+theta;
	angleFacing = 180-theta;
}

function player_angle_to_cursor(){
	var opp = cursorCoordinates[1]-(player.posY-0.5);
	var adj = cursorCoordinates[0]-(player.posX-0.5);
	if(adj==0 && opp==0){
		angleFacing = 0;
		return;
	}
	if(adj==0 && opp > 0){
		angleFacing = 180;
		return
	}

	if(adj==0 && opp < 0){
		angleFacing = 0;
		return;
	}
	var theta = Math.atan(opp/adj);
	theta = (theta*180)/Math.PI;
	if(adj<0)
		theta = 90+theta;
	else
		theta = 270+theta;
	angleFacing = 180-theta;
}
var fixLegs = false;
function player_body_angle_to_cursor(){
	if(player.isMoving) return;
	var opp = cursorCoordinates[1]-(player.posY-0.5);
	var adj = cursorCoordinates[0]-(player.posX-0.5);
	if(adj==0 && opp==0){
		angleFacing = 0;
		return;
	}
	if(adj==0 && opp > 0){
		angleFacing = 180;
		return
	}

	if(adj==0 && opp < 0){
		angleFacing = 0;
		return;
	}
	var theta = Math.atan(opp/adj);
	theta = (theta*180)/Math.PI;
	if(adj<0)
		theta = 90+theta;
	else
		theta = 270+theta;
	angleFacing = 180-theta;
	fixLegs = true;
}

function player_moving(X,Y,Z){
	if(legAngle > 35 || legAngle < -35) 
		switchDirection = !switchDirection;	
	if(!fixedView){X=0;Y=0;}

	initialize_node(bodyId,X,Y,Z);
	initialize_node(rightArmId);
	initialize_node(leftArmId);
	initialize_node(leftLegId);
	initialize_node(rightLegId);
	//initialize_node(toolId);
	if(player.idle && armAngleRight==0 )
		return;

	if(switchDirection){
		legAngle+=2;
		armAngleRight+=3.75;
		//armAngleLeft-=3.75;
	}
	else{
		legAngle-=2;
		//armAngleLeft+=3.75;
		armAngleRight-=3.75;
	}
	//if(!player.isSwinging){
		armAngleLeft = -armAngleRight;
		//armAngleRight = -armAngleLeft;
	//}
}

var NM;
var headVerts;
var shoulderVerts;
var torsoVerts;
var legVerts;
var eyeVerts;

var humanoid = [];

var bodyId = 0;
var headId = 1;
var leftArmId = 2;
var rightArmId = 3;
var leftLegId = 4;
var rightLegId = 5;
var leftShoulderId = 6;
var rightShoulderId = 7;
var leftEyeId = 8;
var rightEyeId = 9;
var toolId = 10;

var BODY_HEIGHT = 1.5;
var BODY_WIDTH = 1;
var BODY_DEPTH = 0.5;
var HEAD_HEIGHT = 1;
var HEAD_WIDTH = 1;
var ARM_HEIGHT = 1.75;
var APPENDAGE_HEIGHT = 2;

var modelViewStack=[];

var switchDirection = true;
var angleFacing = 0;
var armAngleLeft = 0;
var armAngleRight = 0;
var legAngle = 0;
var cArray = [
	vec4(0,0,0,1), //K
	vec4(1,0,0,1), //R
	vec4(0,1,0,1), //G
	vec4(0,0,1,1), //B
	vec4(1,1,1,1), //W
	vec4(0,1,1,1) //B

];

function body_push(v1, v2, v3, c=vec4(1,1,1,1)){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c);
	colours.push(c);
	colours.push(c);

    var cross1 = subtract(v2,v1); 
	var cross2 = subtract(v3,v1);
	var norm =((cross(cross1, cross2)));
	norm = vec3(norm);
	for(var i =0; i < 3; i++)
		normals.push(norm);

    return;
}

var colorSwitch = 4;
function quad(a,b,c,d,color=vec4(1.0,1.0,1.0,1.0)) {
    //vertices.push(vertexPoints[a]);
    //vertices.push(vertexPoints[b]);
    //vertices.push(vertexPoints[c]);
    //default_push_3(vertexPoints[a], vertexPoints[b], vertexPoints[c], cArray[colorSwitch], cArray[colorSwitch], cArray[colorSwitch]);
    body_push(vertexPoints[a], vertexPoints[b], vertexPoints[c],color);
    //vertices.push(vertexPoints[a]);
    //vertices.push(vertexPoints[c]);
    //vertices.push(vertexPoints[d]);
    //default_push_3(vertexPoints[a], vertexPoints[c], vertexPoints[d], cArray[colorSwitch], cArray[colorSwitch], cArray[colorSwitch]);
    body_push(vertexPoints[a], vertexPoints[c], vertexPoints[d], color);
    //colorSwitch++;

}

var vertexP = [
	vec3( -0.5, -0.5,  0.5),
    vec3( -0.5,  0.5,  0.5),
    vec3(  0.5,  0.5,  0.5),
    vec3(  0.5, -0.5,  0.5),
    vec3( -0.5, -0.5, -0.5),
    vec3( -0.5,  0.5, -0.5),
    vec3(  0.5,  0.5, -0.5),
    vec3(  0.5, -0.5, -0.5)
];

function soften_edge(vertice, centerOfMass, soften=0.1){
	var v = vertice;
	var COM = centerOfMass;
	var retVerts = [];
	var soften2=(soften/5);
	//I feel like each statement should set a value of retVerts[3]***
	//v 	 : vec3(-0.5, 0.5,-0.5)
	//COM 	 : vec3( 0.0, 0.0, 0.0)

	retVerts[3] = vec3(0.0,0.0,0.0);
	if(v[0] < COM[0]){
		retVerts[0] = vec3(v[0]+soften,v[1],v[2]);
		retVerts[3][0] = v[0]+soften2;
	}else if(v[0] > COM[0]){
		retVerts[0] = vec3(v[0]-soften,v[1],v[2]);
		retVerts[3][0] = v[0]-soften2;
	}

	if(v[1] < COM[1]){
		retVerts[1] = vec3(v[0],v[1]+soften,v[2]);
		retVerts[3][1] = v[1]+soften2;
	}else if(v[1] > COM[1]){
		retVerts[1] = vec3(v[0],v[1]-soften,v[2]);
		retVerts[3][1] = v[1]-soften2;
	}

	if(v[2] < COM[2]){
		retVerts[2] = vec3(v[0],v[1],v[2]+soften);
		retVerts[3][2] = v[2]+soften2;
	}else if(v[2] > COM[2]){
		retVerts[2] = vec3(v[0],v[1],v[2]-soften);
		retVerts[3][2] = v[2]-soften2;
	}

	return [retVerts[0],retVerts[1],retVerts[2],retVerts[3]];
}

function head2(){
	var topVerts=[];
	var leftVerts=[];
	var rightVerts=[];
	var faceVerts=[];
	var backVerts=[];
	var bottomVerts=[];
	var soften = 0.2;
	//var soften = 0.0;
	var p = 0;
	for(var i=0; i < vertexP.length; i++){
		var vertsPush = soften_edge(vertexP[i],vec3(0.0,0.0,0.0),soften);
		for(var j = 0; j < vertsPush.length; j++){
			if(vertsPush[j][2] == -0.5){
				faceVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][2] == 0.5){
				backVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][1] == 0.5){
				topVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][1] == -0.5){
				bottomVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][0] == 0.5){
				rightVerts.push(vertsPush[j]);
			}
			if(vertsPush[j][0] == -0.5){
				leftVerts.push(vertsPush[j]);
			}
		}
		var pushOrder = [vertsPush[0],vertsPush[1],vertsPush[3],vertsPush[1],vertsPush[2],vertsPush[3],vertsPush[0],vertsPush[2],vertsPush[3]];
		//var pushOrder = [vertsPush[0],vertsPush[3],vertsPush[2]];
		for(var j = 0; j < pushOrder.length; j+=3){
			special_push(pushOrder[j],pushOrder[j+1],pushOrder[j+2]);
		}
	}
	draw_z_face(faceVerts,soften);
	draw_z_face(backVerts,soften);

	draw_x_face(leftVerts,soften);
	draw_x_face(rightVerts,soften);

	draw_y_face(topVerts,soften);
	draw_y_face(bottomVerts,soften);

	NM = vertices.length;
	return;
}
function draw_z_face(vertArray,soften){
	//For alt just make it push the other direction!
	var tL, tR, bL, bR;
	var tZ = vertArray[0][2];
	tL = vec3(-0.5+soften, 0.5-soften, tZ);
	tR = vec3(0.5-soften, 0.5-soften, tZ);
	bL = vec3(-0.5+soften, -0.5+soften, tZ);
	bR = vec3(0.5-soften, -0.5+soften, tZ);
	special_push(tL, bL, bR);
	special_push(bR, tR, tL);
	
	special_push(vertArray[0],vertArray[1],bL);
	special_push(vertArray[2],vertArray[3],tL);
	special_push(vertArray[4],vertArray[5],tR);
	special_push(vertArray[6],vertArray[7],bR);

	special_push(vertArray[3],vertArray[1],tL);
	special_push(bL,tL,vertArray[1]);

	special_push(vertArray[0],bR,bL);
	special_push(vertArray[0],vertArray[6],bR);

	special_push(bR,vertArray[7],vertArray[5]);
	special_push(vertArray[5], tR, bR);

	special_push(vertArray[4],vertArray[2],tR);
	special_push(vertArray[2],tL,tR);
	return;
}
function draw_x_face(vertArray,soften){
	var tL, tR, bL, bR;
	var tX = vertArray[0][0];
	tL = vec3(tX, 0.5-soften,-0.5+soften);
	tR = vec3(tX, 0.5-soften,0.5-soften);
	bR = vec3(tX, -0.5+soften,0.5-soften);
	bL = vec3(tX, -0.5+soften,-0.5+soften);

	special_push(tL, bL, bR);
	special_push(bR, tR, tL);
	
	special_push(vertArray[6],vertArray[7],bL);
	special_push(vertArray[4],vertArray[5],tL);
	special_push(vertArray[0],vertArray[1],tR);
	special_push(vertArray[2],vertArray[3],bR);

	special_push(vertArray[4],vertArray[6],tL);
	special_push(vertArray[6],bL,tL);

	special_push(vertArray[5],tL,tR);
	special_push(tR,vertArray[1],vertArray[5])

	special_push(tR,bR,vertArray[2])
	special_push(vertArray[2],vertArray[0],tR)

	special_push(bR,bL,vertArray[7])
	special_push(vertArray[7],vertArray[3],bR)
	return;
}
function draw_y_face(vertArray,soften){
	var tL, tR, bL, bR;
	var tY = vertArray[0][1];
	tL = vec3(-0.5+soften, tY, 0.5-soften);
	tR = vec3(0.5-soften,tY, 0.5-soften);
	bL = vec3(-0.5+soften,tY, -0.5+soften);
	bR = vec3(0.5-soften,tY, -0.5+soften);

	special_push(bL, bR, tL);
	special_push(tR, tL, bR);
	
	special_push(vertArray[5],vertArray[4],bL);
	special_push(vertArray[0],vertArray[1],tL);
	special_push(vertArray[3],vertArray[2],tR);
	special_push(vertArray[6],vertArray[7],bR);

	special_push(vertArray[5],tL,vertArray[1]);
	special_push(vertArray[5],bL,tL);

	special_push(bL,vertArray[4],bR);
	special_push(bR,vertArray[4],vertArray[6]);

	special_push(vertArray[3],tR,bR);
	special_push(bR,vertArray[7],vertArray[3]);

	special_push(vertArray[2],vertArray[0],tL);
	special_push(tR,vertArray[2],tL);
	return;
}

function special_push(v1, v2, v3){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	for(var z =0; z < 3; z++)
		colours.push(vec4(1.0,0.7,0.50,1));
	var cross2 = subtract(v2,v1); 
	var cross1 = subtract(v3,v1);
	var norm = cross(cross1, cross2);
	norm = vec3(norm);
	
	normals.push(vec3(v1[0],v1[1],v1[2]));
    normals.push(vec3(v2[0],v2[1],v2[2]));
    normals.push(vec3(v3[0],v3[1],v3[2]));

    //normals.push(vec3(0,0,0));
    //normals.push(vec3(0,0,0));
    //normals.push(vec3(0,0,0));

	for(var j = 0; j < 3; j++)
		texCoords.push(vec2(2.0,2.0));

	return;
}

//Hair??
function build_hair(){

}

function build_shoulder(){
	cube([6,6,6,6,6,6],vec4(0.35, 0.24, 0.19,1));
}

function build_torso(){
	cube([6,6,6,6,6,6],vec4(0.35, 0.24, 0.19,1) );
}

function build_leg(){
	cube([7,7,7,7,7,7],vec4(0.2,0.42,0.68,1));
}

function build_eye(){
	cube([-1,-1,-1,-1,-1,-1],vec4(0,0,0,1));
}


function cube(textureArray, c=vec4(1.0,1.0,1.0,1.0)) {
    quad( 1, 0, 3, 2, c );
    //BACK OF HEAD
    //set_humanoid_texture_head_face(textureArray[0]);
    set_humanoid_texture();
    quad( 2, 3, 7, 6, c );
    //RIGHT HEAD
    //set_humanoid_texture_head_face(textureArray[1]);
    set_humanoid_texture();
    quad( 3, 0, 4, 7, c );
    //BOTTOM OF HEAD
    //set_humanoid_texture_head_face(textureArray[2]);
    set_humanoid_texture();
    quad( 6, 5, 1, 2, c );
    //TOP OF HEAD
    //set_humanoid_texture_head_face(textureArray[3]);
    set_humanoid_texture();
    quad( 4, 5, 6, 7, c );
    //FACE
    //set_humanoid_texture_head_face(textureArray[4]);
    set_humanoid_texture();
    quad( 5, 4, 0, 1, c );
    //LEFT HEAD
    //set_humanoid_texture_head_face(textureArray[5]);
    set_humanoid_texture();
}

function create_node(transform, render, sibling, child){
	var node = {
		transform: transform,
		render: render,
		sibling: sibling,
		child: child,
	};
	return node;
}


function initialize_node(id, X=0,Y=0,Z=0){
	var m = mat4();
	Z = -3.25;

	switch(id){
		case bodyId:
			m = scale4(0.5,0.5,0.5);
			//m = scale4(2.5,2.5,2.5);
			m = mult(m, rotateX(-90));
			m = mult(m, rotateY(angleFacing));
			m = mult(translate(X,Y,Z,0),m)
			//m = mult(translate(X,Y+0.5,Z+1,0),m);

			//Null for now
			humanoid[bodyId] = create_node(m, body, null, headId);
			break;
		case headId:
			m = translate(0,1.5,0,0);
			humanoid[headId] = create_node(m, head, leftArmId, leftEyeId);
			break;
		case leftArmId:
			if(player.completedAction && !player.isSwinging && !player.isShooting )
				m = rotateX(armAngleLeft);
			else{
				m = rotateX(armAngleLeftSwing);
				m = mult(rotateY(armAngleLeftTilt), m);
			}
			m = mult(translate(-0.75,1.125,0,0),m);
			humanoid[leftArmId] = create_node(m, left_arm, rightArmId, leftShoulderId);
			break;
		case rightArmId:
			if(player.completedAction && !player.isSwinging && !player.isShooting && !player.isPlacing){
				m = rotateX(armAngleRight);
			}
			else{
				m = rotateX(armAngleRightSwing);
				m = mult(rotateY(armAngleRightTilt), m);
				if(player.isShooting)
					m = mult(translate(0,-0.1,0.34), m);
			}
			m = mult(translate(0.75,1.125,0,0),m);
			humanoid[rightArmId] = create_node(m, right_arm, leftLegId, rightShoulderId);
			break;
		case leftLegId:
		
				m = rotateX(-legAngle);
			m = mult(translate(-0.25,-0.25,0,0),m);
			humanoid[leftLegId] = create_node(m,left_leg, rightLegId, null);
			break;
		case rightLegId:
			
				m = rotateX(legAngle);
			m = mult(translate(0.25,-0.25,0,0),m);
			humanoid[rightLegId] = create_node(m,right_leg, null,null);
			break;
		case leftShoulderId:
			humanoid[leftShoulderId] = create_node(m, left_shoulder,null,null); 
			break;
		case rightShoulderId:
			humanoid[rightShoulderId] = create_node(m, right_shoulder, toolId, null);
			break;
		case leftEyeId:
			humanoid[leftEyeId] = create_node(m, left_eye,rightEyeId,null);
			break;
		case rightEyeId:
			humanoid[rightEyeId] = create_node(m, right_eye, null,null);
			break;
		case toolId:
			humanoid[toolId] = create_node(m, tool, null, null);
			break;
	}
}

function traverse(id){
	if(id == null) return;
	modelViewStack.push(modelViewMatrix);
	modelViewMatrix = mult(modelViewMatrix, humanoid[id].transform);
	humanoid[id].render();

	if(humanoid[id].child != null)
		traverse(humanoid[id].child);
	modelViewMatrix = modelViewStack.pop();
	if(humanoid[id].sibling != null){
		traverse(humanoid[id].sibling);
	}

	return;
}

function traverse_shadow(id){
	if(id == null) return;
	if(!fixedView){
		shadowMV = translate(1,1,0);
		shadowMV = mult(shadowMV, scale4(0.125,(1/4.5),0.1))
		shadowMV = mult(shadowMV,translate(-8,-4.5,0));
	}else{
		shadowMV = translate(0,0,0);
		shadowMV = mult(shadowMV, scale4(0.125,(1/4.5),0.1))
		shadowMV = mult(shadowMV,translate(-8,-4.5,0));
	}
	modelViewStack.push(shadowMV);
	shadowMV = mult(shadowMV, humanoid[id].transform);
	shadowMV = mult(sMatrixForPlayer, shadowMV);
	modelViewMatrix = shadowMV;
	humanoid[id].render();

	if(humanoid[id].child != null)
		traverse(humanoid[id].child);
	shadowMV = modelViewStack.pop();
	if(humanoid[id].sibling != null){
		traverse(humanoid[id].sibling);
	}
	return;
}

function build_humanoid(){

}

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}
var move = 0;
function body(){
	move++;
	var scalemat = scale4(BODY_WIDTH, BODY_HEIGHT, BODY_DEPTH);
	var instanceMat = scalemat;
	instanceMat = mult(translate(0,0.25,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES, headVerts+shoulderVerts, torsoVerts);
	//gl.drawArrays(gl.POINTS, 0, NM);
}
function head(){
	var instanceMat = scale4(1,1,1);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES, 0, headVerts);
	//gl.drawArrays(gl.POINTS, 0, NM);
}
function left_arm(){
	var instanceMat = scale4(0.5,ARM_HEIGHT, BODY_DEPTH);
	instanceMat = mult(translate(0,-1,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES, 0, headVerts);
	//gl.drawArrays(gl.POINTS, 0, NM);

}
function right_arm(){
	var instanceMat = scale4(0.5,ARM_HEIGHT, BODY_DEPTH);
	instanceMat = mult(translate(0,-1,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES, 0, headVerts);
	//gl.drawArrays(gl.POINTS, 0, NM);
}
function left_leg(){
	var instanceMat = scale4(0.5,APPENDAGE_HEIGHT, BODY_DEPTH);
	instanceMat = mult(translate(0,-1.25,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES, headVerts+shoulderVerts+torsoVerts, legVerts);
	//gl.drawArrays(gl.POINTS, 0, NM);
}
function right_leg(){
	var instanceMat = scale4(0.5,APPENDAGE_HEIGHT, BODY_DEPTH);
	instanceMat = mult(translate(0,-1.25,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	//gl.drawArrays(gl.TRIANGLES, 0, headVerts);
	gl.drawArrays(gl.TRIANGLES, headVerts+shoulderVerts+torsoVerts, legVerts);
}

function left_shoulder(){
	var instanceMat = scale4(0.6,0.6,0.6);
	instanceMat = mult(translate(0,-0.2,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES,headVerts,shoulderVerts);
}

function right_shoulder(){
	var instanceMat = scale4(0.6,0.6,0.6);
	instanceMat = mult(translate(0,-0.2,0),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES,headVerts,shoulderVerts);
}

function left_eye(){
	var instanceMat = scale4(0.1,0.2,0.2);
	instanceMat = mult(translate(-0.25,0.1,-0.43),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES,headVerts+shoulderVerts+torsoVerts+legVerts,eyeVerts);
}

function right_eye(){
	var instanceMat = scale4(0.1,0.2,0.2);
	instanceMat = mult(translate(0.25,0.1,-0.43),instanceMat);
	var transformMat = mult(modelViewMatrix, instanceMat);
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(transformMat));
	gl.drawArrays(gl.TRIANGLES,headVerts+shoulderVerts+torsoVerts+legVerts,eyeVerts);
}


function tool(){
	if(player.heldObject == null)
		return;

	if(player.heldObject.typeOfObj == 'BLOCK'){
		var instanceMat = translate(-0.3,-1.25,-0.65);
		//instanceMat = mult(instanceMat,rotateX(-35));
		instanceMat = mult(instanceMat,rotateY(35));

		instanceMat = mult(instanceMat,rotateX(100));
		var transformMat = mult(modelViewMatrix, instanceMat);
		player.heldObject.drawTransparent(transformMat);
	}else{
		if(!player.isShooting){
			var instanceMat = translate(0,-2,0.15);
			instanceMat = mult(instanceMat,rotateX(-35));
			instanceMat = mult(instanceMat,rotateY(90));
			var transformMat = mult(modelViewMatrix, instanceMat);
			player.heldObject.drawTransparent(transformMat);
		}else{
			var instanceMat = translate(-.2,-1.75,1.25);
			instanceMat = mult(instanceMat,rotateX(-90));
			instanceMat = mult(instanceMat,rotateY(90));
			instanceMat = mult(instanceMat,rotateY(10));
			var transformMat = mult(modelViewMatrix, instanceMat);
			player.heldObject.drawTransparent(transformMat);

		}
	}
}