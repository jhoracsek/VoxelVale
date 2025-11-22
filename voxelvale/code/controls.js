window.addEventListener("keydown", getKeyDown, false);
window.addEventListener("keyup", getKeyUp, false);

var hasInteractedWithWindow = false;
var isFocused = false;
var keyboardDisabled = false;

var upOneStore = -1;
var spaceHeld = false;
var gridMode = false;


/*
	Keycodes

		1: 	49
		2: 	50
		3: 	51
		4: 	52
		5: 	53
		6: 	54
		7: 	55
		8: 	56
		9: 	57
		0: 	48

		W: 	87
		A: 	65
		S: 	83
		D: 	68

		G: 	71

		P: 	80

		~: 192

		TAB: 	9

		Q: 	81
		E: 	69
		R: 	82

		SPACE: 	32

		ARROW_UP: 		38
		ARROW_LEFT: 	37
		ARROW_DOWN: 	40
		ARROW_RIGHT:  39

		ESCAPE: 			27


*/

function getKeyDown(key){
	if(!isFocused || keyboardDisabled){
		//console.log('isFocused:', isFocused)
		//console.log('keyboardDisabled:', keyboardDisabled)
		return;
	}

	//'ESCAPE'
	if(key.keyCode == 27){
		isFocused = false;
	}

	//'SPACE'
	if(key.keyCode == 32){
		key.preventDefault();
		if(player.isDead){
			player.respawn();
		}else{
			spaceHeld = true;
		}
	}
	if(player.isDead){
		return;
	}

	//'A' LEFT
	if(key.keyCode == 65){
		//updateCursorColour();
		//if(!isStopLeft)
			player.isMovingLeft = true;
	}
	//'D' RIGHT
	if(key.keyCode == 68){
		//updateCursorColour();
		//if(!isStopRight)
			player.isMovingRight = true;
	}
	//'W' UP
	if(key.keyCode == 87){
		//updateCursorColour();
		//if(!isStopUp)
			player.isMovingUp = true;
	}
	//'S' DOWN
	if(key.keyCode == 83){
		//updateCursorColour();
		//if(!isStopDown)
			player.isMovingDown = true;
	}

	//'G' Toggle grid mode.
	if(key.keyCode == 71){
		gridMode = !gridMode;
	}




	//'Q'
	if(key.keyCode == 81){

		if(fastMode){
			upOne--;
		}else{
			upOne = Math.max(upOne-1, -6);
		}
		//scroll = -upOne;
		scroll = 0;
	}

	if(key.keyCode == 20){
		if(DEV_TOOLS){
			hitBox = !hitBox;
			print = !print;
			modelTestMode = !modelTestMode;
		}
	}

	//'E'
	if(key.keyCode == 69){
		if(fastMode){
			upOne++;
		}else{
			upOne = Math.min(upOne+1, -2);
		}
		//scroll = -upOne;
		scroll = 0;
		
	}


	//'TAB'
	if(key.keyCode == 9){
		//Stop tab from zipping around the page.
		key.preventDefault();

		if(inventory && (currentMenu == 'INVENTORY' || currentMenu == 'CHEST' || currentMenu == 'SHOP')){
			activeTab = (activeTab+1)%4;
			switch(activeTab){
				case 0:
					selectedTab = 'BLOCK';active=-1;scrollOffset=0;
					break;
				case 1:
					selectedTab = 'TOOL';active=-1;scrollOffset=0;
					break;
				case 2:
					selectedTab = 'ITEM';active=-1;scrollOffset=0;
					break;
				case 3:
					selectedTab = 'REC';active=-1;scrollOffset=0;
					break;
			}
			if(currentMenu == 'CHEST'){
				refreshList=true;
				leftScrollOffset = 0;
				rightScrollOffset = 0;
			}
			if(currentMenu == 'SHOP'){
				leftScrollOffset = 0;
			}
		}

		if(!inventory){
			activeToolBarItem = ((activeToolBarItem)%(NUM_TOOLBAR_ITEMS+1))+1

			if(activeToolBarItem == NUM_TOOLBAR_ITEMS+1){
				player.setHeldObject(null);
				return;	
			}
			player.setHeldObject(toolBarList[activeToolBarItem-1]);
		}
	}

	//'~'
	if(key.keyCode == 192){
		key.preventDefault();
		toggleInventory();
	}

	//'T'
	if(key.keyCode == 84){
		if(DEV_TOOLS){
			/*
			//Spawn Finder
			var enemy=new Finder(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3);
			enemy.initialize_enemy();
			enemyArray.push(enemy);
			*/

			
			//Spawn Zombie
			
			var enemy = new Undead(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3.25);
			enemy.initialize_enemy();
			enemyArray.push(enemy);
			

			//var shopkeep = new ShopKeeper(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5));
			//townFolkArray.push(shopkeep);

			//spawnEnemy();

		}

	}

	//'R'
	if(key.keyCode == 82){
		if(DEV_TOOLS){
			fastMode=!fastMode;
			tab_lists();
			player.checkSpeed();
		}
	}

	//'1'
	if(key.keyCode == 49){
		activeToolBarItem = 1;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'2'
	if(key.keyCode == 50){
		activeToolBarItem = 2;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'3'
	if(key.keyCode == 51){
		activeToolBarItem = 3;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'4'
	if(key.keyCode == 52){
		activeToolBarItem = 4;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'5'
	if(key.keyCode == 53){
		activeToolBarItem = 5;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'6'
	if(key.keyCode == 54){
		activeToolBarItem = 6;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'7'
	if(key.keyCode == 55){
		activeToolBarItem = 7;
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
	}
	//'8'
	if(key.keyCode == 56){
		activeToolBarItem = 0;
		player.setHeldObject(null);
	}
	//'9'
	if(key.keyCode == 57){
		activeToolBarItem = 0;
		player.setHeldObject(null);
	}
	//'0'
	if(key.keyCode == 48){
		activeToolBarItem = 0;
		player.setHeldObject(null);
	}

	//'P'
	if(key.keyCode == 80){
		if(DEV_TOOLS){
			testView = !testView;
		}
	}

	//For testing models
	//'ARROW_DOWN' Down
	if(key.keyCode == 40){
		key.preventDefault();
		zoomOut();
		if(DEV_TOOLS){
			//viewRotateX-=5;
			//viewShiftZ+=1/5;
			//viewShiftY+=0.5/5;
			//viewRotateX-=5;
			//viewShiftZ++;
			//viewShiftY+=0.5;
			controlledYSpin-=10;
		}
	}
	//'ARROW_UP' Up
	if(key.keyCode == 38){
		key.preventDefault();
		zoomIn();
		if(DEV_TOOLS){
			//viewRotateX+=5;
			//viewShiftZ-=1/5;
			//viewShiftY-=0.5/5;
			
			//viewRotateX+=5;
			//viewShiftZ--;
			//viewShiftY-=0.5;
			controlledYSpin+=10;
		}
	}

	/*
		For filming shorts
	*/
	// 'V'
	if(key.keyCode == 86){
		if(DEV_TOOLS){
			zoomOutFilm();
		}
	}

	// 'F'
	if(key.keyCode == 70){
		if(DEV_TOOLS){
			zoomInFilm();
		}
	}




	//'ARROW_RIGHT' Right
	if(key.keyCode == 39){
		key.preventDefault();
		if(DEV_TOOLS){
			//viewRotateZ++;
			viewShiftZ++;
			controlledXSpin+=10;
		}
	}
	//'ARROW_LEFT' Left
	if(key.keyCode == 37){
		key.preventDefault();
		if(DEV_TOOLS){
			//viewRotateZ--;
			viewShiftZ--;
			controlledXSpin-=10;
		}
	}

	//'1' NUM PAD
	if(key.keyCode == 97){
		key.preventDefault();
		if(DEV_TOOLS){
			addImage();
		}
	}


	// '2' Num pad
	if(key.keyCode == 98){
		key.preventDefault();
		if(DEV_TOOLS){
				setProjectionMatrix();
		}
	}

	// '4' Num pad
	if(key.keyCode == 100){
		if(DEV_TOOLS){
			scalePM += 0.05;

			projectionMatrix = mat4(scalePM,0,0,0  ,0,1,0,0   ,0,0,0.1,0   ,0,0,1,1);
				projectionMatrix = mult(projectionMatrix, rotateX(25));
				projectionMatrix = mult(projectionMatrix, translate(0,0.25,0.5));
		}
	}
		
	// '6' Num pad
	if(key.keyCode == 102){
		if(DEV_TOOLS){
			scalePM -= 0.05;
			projectionMatrix = mat4(scalePM,0,0,0  ,0,1,0,0   ,0,0,0.1,0   ,0,0,1,1);
				projectionMatrix = mult(projectionMatrix, rotateX(25));
				projectionMatrix = mult(projectionMatrix, translate(0,0.25,0.5));
		}
	}

	// '9' Num pad
	if(key.keyCode == 105){
		if(DEV_TOOLS){
			//Fix camera.
			fixForFilm = !fixForFilm;
			//fixedView = !fixedView;
			
		}
	}

}

function getKeyUp(key){
	//LEFT
	if(key.keyCode == 65){
		player.isMovingLeft = false;
	}
	//RIGHT
	if(key.keyCode == 68){
		player.isMovingRight = false;
	}
	//UP
	if(key.keyCode == 87){
		player.isMovingUp = false;
	}
	//DOWN
	if(key.keyCode == 83){
		player.isMovingDown = false;
	}

	if(key.keyCode == 32){
		spaceHeld = false;
	}
}

/*
	Also sets  blockOnTopOf;

	I think 'blockOnTopOf' is just used for the door. I have no idea why it's fixed at -2 and not upOne + 1? I know
	doors can only be placed at -3, so it makes sense for that one specific use case.
*/
function checkHovering(){
	if(inDungeon){
		//console.log(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		if(currentlyHeldObject == NO_ITEM_HELD || currentlyHeldObject == BOW_HELD || currentlyHeldObject == SWORD_HELD)
			selectedBlock = currentDungeon.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3);
		else
			selectedBlock = currentDungeon.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		
		if(selectedBlock!=null && !player.isDead &&!inventory){
			selectedBlock.onHover();
		}
		blockOnTopOf = currentDungeon.getBlockAt(Math.round(player.posX),Math.round(player.posY),-2);

	}else{
		if(currentlyHeldObject == NO_ITEM_HELD || currentlyHeldObject == BOW_HELD || currentlyHeldObject == SWORD_HELD)
			selectedBlock = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3);
		else
			selectedBlock = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		if(selectedBlock!=null && !player.isDead&& !inventory){
			selectedBlock.onHover();
		}
		blockOnTopOf = world.getBlockAt(Math.round(player.posX-0.5),Math.round(player.posY-0.5),-2);
	}

}

/*
let awaitingPointerLock = false;

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === canvas) {
  	isFocused = true;
  	console.log('Requested')
  } else {
  	console.log('Exited')
  	isFocused = false;
    canvas.blur();
    canvas.classList.remove("pointer-lock-active");
  }
});
*/


var cursorCoor=vec2(0,0);
var coorSys=vec3(0,0,0);
var transMatrix;
var yCoor2;
var hold=false;
function canvasEvents(){

canvas.addEventListener('focus', () => {
  isFocused = true;
});

canvas.addEventListener('blur', () => {
  isFocused = false;
});




canvas.addEventListener("mouseup",function(event){
	hold=false;

});

canvas.addEventListener("contextmenu",function(event){
	//console.log(instanceOfMouseEvent.button);
});

canvas.addEventListener("mousedown", function(event){
	//Should only do this if you are unfocused.

	if(!hasInteractedWithWindow){
		playMusic();
		initAudio();
		hasInteractedWithWindow = true;
	}

	if(!isFocused){
		return;
	}
	switch(event.button){
		//Left Click
		case 0:
			//updateCursorColour();
			click=true;
			hold=true;
			if(player.heldObject == null)
				return;
			//player.heldObject.onLClick();
			if(!inventory && !inFunction){

				player.heldObject.onLClick();
				
				// Needs to be fixed!!!
				if(fixedView){
					switch(player.heldObject.type){
						case 'BLOCK_WALL':
							if(cursorGreen && currentDungeon.addBlock(player.heldObject.copy(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne))){
								if(!fastMode){
									sound_PlaceBlock(player.heldObject);
									player.isPlacing = true;
									player.inventory.removeBlock(player.heldObject);
								}
								if(fastMode==false && player.inventory.getQuantityBlock(player.heldObject)==0)
									player.heldObject=null;
							}
						break;
						case 'TOOL':
							//This is handled in "check_player_action()" in "player.js".
							
						break;
					}
				}else{
					switch(player.heldObject.type){
						case 'BLOCK_WALL':
								if(cursorGreen && world.addBlock(player.heldObject.copy(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne))){
									if(!fastMode){
										sound_PlaceBlock(player.heldObject);
										player.isPlacing = true;
										player.inventory.removeBlock(player.heldObject);
									}
									if(fastMode==false && player.inventory.getQuantityBlock(player.heldObject)==0)
										player.heldObject=null;
								}
						break;

						case 'TOOL':
							//This is handled in "check_player_action()" in "player.js".

						break;
						}
					}
		    }
			break;
		//Right Click
		case 2:
			if(inDungeon){
				//console.log(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				//var selectedBlock = currentDungeon.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				if(selectedBlock!=null&& !player.isDead && !inventory){
					selectedBlock.onClick();
				}

			}else{
				//var selectedBlock = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				if(selectedBlock!=null&& !player.isDead && !inventory){
					selectedBlock.onClick();
				}
			}
			for(let i = 0; i < townFolkArray.getLength(); i++){
				townFolkArray.accessElement(i).fireClick();
			}
			break;

	}
});
/*
canvas.addEventListener("click",function(event){
	if (document.pointerLockElement !== canvas) {
    	//await canvas.requestPointerLock();
  }
});
*/
canvas.addEventListener("mouseup",function(event){
	click=false;
});
//https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event
canvas.addEventListener("wheel",function(event){
	if(!isFocused)
		return;
	event.preventDefault();
	
	if(inventory && currentMenu == 'INVENTORY'){
		if(scrollCooldown <= 0){
			if(event.deltaY > 0){
				scroll_list_down();
			}
			if(event.deltaY < 0){
				scroll_list_up();
			}
		}
		scrollCooldown = 2;
		return;
	}else if(inventory && currentMenu == 'CRAFTING'){
		if(scrollCooldown <= 0){
			if(event.deltaY > 0){
				craft_scroll_list_down();
			}
			if(event.deltaY < 0){
				craft_scroll_list_up();
			}
		}
		scrollCooldown = 2;
		return;
	}else if(inventory && currentMenu == 'CHEST'){
		let overLeft = false;
		click_in_bounds(2,2,8,7,function(){},function(){overLeft=true});
		if(scrollCooldown <= 0 && overLeft){
			if(event.deltaY > 0){
				left_scroll_list_down();
			}
			if(event.deltaY < 0){
				left_scroll_list_up();
			}
		}
		let overRight = false;
		click_in_bounds(8,2,14,7,function(){},function(){overRight=true});
		if(scrollCooldown <= 0 && overRight){
			if(event.deltaY > 0){
				right_scroll_list_down();
			}
			if(event.deltaY < 0){
				right_scroll_list_up();
			}
		}

		scrollCooldown = 2;
	}else if(inventory && currentMenu == 'SHOP'){
		let overLeft = false;
		click_in_bounds(2,2,8,7,function(){},function(){overLeft=true});
		if(scrollCooldown <= 0 && overLeft){
			if(event.deltaY > 0){
				move_left_scroll_list_down();
			}
			if(event.deltaY < 0){
				move_left_scroll_list_up();
			}
		}
		let overRight = false;
		click_in_bounds(8,2,14,7,function(){},function(){overRight=true});
		if(scrollCooldown <= 0 && overRight){
			if(event.deltaY > 0){
				move_right_scroll_list_down();
			}
			if(event.deltaY < 0){
				move_right_scroll_list_up();
			}
		}

		scrollCooldown = 2;
	}

	scroll += event.deltaY * -0.02;
	if(scroll <= -1){
		if(scrollCooldown <= 0){
			upOne = Math.min(upOne+1, -2);
			scrollCooldown = 3;
		}
		scroll = 0;
	}
	if(scroll >= 1){
		if(scrollCooldown <= 0){
			upOne = Math.max(upOne-1,-6);
			scrollCooldown = 3;
		}
		scroll = 0;
	}//Add a cooldown.
});
}

var selectedBlock=null;
var blockOnTopOf=null;
var selectedBlockCanBeBroken=false;
//THIS METHOD NEEDS TO UPDATE WHEN THE PLAYER WALKS, BECAUSE THE PLAYER CAN WALK INTO A BLOCK AND STILL HAVE REDWIREFRAME!
function mouseMoveUpdate(e){
	cursorDisplayTimer=0;
	//cursorGreen=false;
	//console.log('running!')
	transMatrix = mat4();	
    //xCoor = (event.clientX-8)*(16/canvas.width);
    //yCoor = ((canvas.height-(event.clientY))+8)*(9/canvas.height);
  
    xCoor += e.movementX/100;
    yCoor += -(e.movementY/100);
    selectXCoor+= e.movementX/100;
    //I did this since it's like the same
    //angle I rotated the modelview matrix
    //or something, I obviously don't f@@@ing
    //remember, but I should probably look at it
    //at some point.
    //selectYCoor = yCoor/Math.cos(0.261799);
    selectYCoor+= -(e.movementY/100)/Math.cos(0.261799);
    if(xCoor<=0)xCoor=0;
    if(xCoor>=16)xCoor=16;
    if(yCoor<=0)yCoor=0;
    if(yCoor>=9)yCoor=9;
	cursorCoor = vec2(xCoor,yCoor);
    if(fastMode)
    	coorSys = vec3(selectXCoor,selectYCoor,0);
    else{
    	//8.5mid
    	//This is where the cursor is limited
    	if(selectXCoor>=10.5)selectXCoor=10.5;
    	if(selectXCoor<=6.5)selectXCoor=6.5;
    	//4mid
    	if(selectYCoor>=6)selectYCoor=6;
    	if(selectYCoor<=2)selectYCoor=2;
    	coorSys = vec3(selectXCoor,selectYCoor,0);
    }
    //updateCursorColour();
	return;
}

//Aptly named for my mysterious usage of the name upOne to define the coordinate of the cursor on the z-axis.
function updateUpOne(){
	
}

