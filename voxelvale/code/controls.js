window.addEventListener("keydown", getKeyDown, false);
window.addEventListener("keyup", getKeyUp, false);

var hasInteractedWithWindow = false;
var isFocused = false;
var keyboardDisabled = false;

var upOneStore = -1;

function getKeyDown(key){
	if(!isFocused || keyboardDisabled)
		return;
	//LEFT
	if(key.keyCode == 65){
		//updateCursorColour();
		//if(!isStopLeft)
			player.isMovingLeft = true;
	}
	//RIGHT
	if(key.keyCode == 68){
		//updateCursorColour();
		//if(!isStopRight)
			player.isMovingRight = true;
	}
	//UP
	if(key.keyCode == 87){
		//updateCursorColour();
		//if(!isStopUp)
			player.isMovingUp = true;
	}
	//DOWN
	if(key.keyCode == 83){
		//updateCursorColour();
		//if(!isStopDown)
			player.isMovingDown = true;
	}

	if(key.keyCode == 27){
		isFocused = false;
	}
	//Turn off hitbox render (and some other stuff...)
	// Keycode 81 is 'Q'
	if(key.keyCode == 81){
		hitBox = !hitBox;
		print = !print;
		modelTestMode = !modelTestMode;
	}

	if(key.keyCode == 69){
		if(fastMode){
			upOne--;
		}else{
			upOne = Math.max(upOne-1, -6);
		}
		//scroll = -upOne;
		scroll = 0;
	}
	if(key.keyCode == 82){
		if(fastMode){
			upOne++;
		}else{
			upOne = Math.min(upOne+1, -2);
		}
		//scroll = -upOne;
		scroll = 0;
	}

	//Hit tab
	if(key.keyCode == 9){
		//Stop tab from zipping around the page.
		key.preventDefault();
		activeToolBarItem = ((activeToolBarItem)%(NUM_TOOLBAR_ITEMS+1))+1

		//if(toolBarList[activeToolBarItem-1] != null){
			//console.log(activeToolBarItem-1);
		if(activeToolBarItem == NUM_TOOLBAR_ITEMS+1){
			player.setHeldObject(null);
			return;	
		}
		player.setHeldObject(toolBarList[activeToolBarItem-1]);
		//}
	}

	if(key.keyCode == 192){
		tab_lists();
		if(fQueue.isEmpty()==false){
			inFunction=false;
			fQueue.dequeue();
			selectXCoor=8.5;
			selectYCoor=4;
			coorSys = vec3(selectXCoor,selectYCoor,0);
			return;
		}
		inventory=!inventory;
		if(inventory){
			xCoor=8;
			yCoor=4.5;
			cursorCoor = vec2(xCoor,yCoor);
		}else{
			selectXCoor=8.5;
			selectYCoor=4;
			coorSys = vec3(selectXCoor,selectYCoor,0);
		}
	}
	if(key.keyCode == 49){
		//console.log(world.getPortionNum(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5)));
		//var name = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),Math.round(upOne));
		//if(name!=null)
		//	console.log(name.name);

		/*
		var enemy=new Undead(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-6);
		enemy.initialize_enemy();
		enemyArray.push(enemy)
		*/

		/*
		var enemy=new Roller(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3);
		enemy.initialize_enemy();
		enemyArray.push(enemy)
		*/

		var enemy=new Finder(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),-3);
		enemy.initialize_enemy();
		enemyArray.push(enemy)

	}
	if(key.keyCode == 50){
		fastMode=!fastMode;
		tab_lists();
		player.checkSpeed();
	}

	if(key.keyCode == 80){
		testView = !testView;
	}

	//For testing models
	//Down
	if(key.keyCode == 40){
		controlledYSpin-=3;
	}
	//Up
	if(key.keyCode == 38){
		controlledYSpin+=3;
	}
	//Right
	if(key.keyCode == 39){
		controlledXSpin+=3;
	}
	//Left
	if(key.keyCode == 37){
		controlledXSpin-=3;
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
}

/*
	Also sets  blockOnTopOf;
*/
function checkHovering(){
	if(inDungeon){
		//console.log(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		selectedBlock = currentDungeon.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		if(selectedBlock!=null){
			selectedBlock.onHover();
		}
		blockOnTopOf = currentDungeon.getBlockAt(Math.round(player.posX),Math.round(player.posY),-2);

	}else{
		selectedBlock = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
		if(selectedBlock!=null){
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
				var selectedBlock = currentDungeon.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				if(selectedBlock!=null){
					selectedBlock.onClick();
				}

			}else{
				var selectedBlock = world.getBlockAt(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
				if(selectedBlock!=null){
					selectedBlock.onClick();
				}
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
	
	if(inventory){
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
	}

	scroll += event.deltaY * -0.02;
	if(scroll <= -1){
		if(scrollCooldown <= 0){
			upOne = Math.min(upOne+1, -2);
			scrollCooldown = 4;
		}
		scroll = 0;
	}
	if(scroll >= 1){
		if(scrollCooldown <= 0){
			upOne = Math.max(upOne-1,-6);
			scrollCooldown = 4;
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

