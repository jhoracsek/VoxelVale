


/*
	Todo.

	Define 'scroll sections'. So scrolling over the left half only modifies the left half and
	vice versa.

*/

var currentInventoryBlock = null;
var refreshList = false;

function draw_chest_menu(){

	var menuTranslate=-9;
	var zVal=menuTranslate;

	//draw_c_text_fontsize(2.2,7.1,'Chest',22);
	draw_c_text(2.2,6.685,'Inventory contents');
	draw_c_text(8.2,6.685,'Chest contents');


	draw_chest_inventory_list();
	
	//Scroll bar
	/*
	if(craftableList.length > 4){
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_craft_scroll_bar();
	}
	*/
	draw_inventory_cursor();

	/*
		Top tab bar from inventory
	*/
	reset_mv();
	draw_all_tabs();
	
	reset_mv();	

	draw_interface_chest();
}




function add_chest_interface_elements(){
	var background = new InterfaceBackground(2,1.25,14,7.75,BLACK);
	//left=true,right=true,top=true,bottom=true
	var leftSection = new InterfaceBackground(2,2,8,7,DARK_GREY,false,true,false,true);
	var rightSection = new InterfaceBackground(8,2,14,7,DARK_GREY,false,false,false,true);
	var rightBoxUpper = new InterfaceBackground(9.6, 2.7, 13.9, 6.6, BLACK);
	var rightBoxLower = new InterfaceBackground(9.6, 2.1, 13.9, 2.6, BLACK);

	chestElements.push(background);
	chestElements.push(leftSection);
	chestElements.push(rightSection);
	//chestElements.push(rightBoxUpper);
	//chestElements.push(rightBoxLower);
}


let chestListStartY = 2.45;
let chestListInventory = [];
let chestListChest = [];
function draw_chest_inventory_list(){


	tabListClick();


	draw_c_text_med(2.25+6,2.15,('Chest Quantity:'));//draw_c_text_med_right
	draw_c_text_med_right(4.05+6,2.15,currentInventoryBlock.numberOfObjects);
	draw_c_text_med(4.05+6,2.15,'/'+currentInventoryBlock.maxCapacity);



	//Need to move this!
	build_chest_list();

	leftScrollOffset = Math.min(leftScrollOffset, get_max_scroll_bar_left_length());
	rightScrollOffset = Math.min(rightScrollOffset, get_max_scroll_bar_right_length());

	let listLen = chestListInventory.length;
	/*
		Check the scroll list thing.
	*/


	for(var i = leftScrollOffset; i < Math.min(listLen,4+leftScrollOffset); i++){
		chestListInventory[i].draw(i-leftScrollOffset);
	}



	if(listLen > 4){
		if(fixedView){
			set_mv_ui(translate(-1.5,0,0));
		}else{
			set_mv(translate(-1.5,0,0));
		}
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_scroll_bar_chest_left();
	}

	listLen = chestListChest.length;
	for(var i = rightScrollOffset; i < Math.min(listLen,4+rightScrollOffset); i++){
		chestListChest[i].draw(i-rightScrollOffset);
	}

	if(listLen > 4){
		if(fixedView){
			set_mv_ui(translate(-1,0,0));
		}else{
			set_mv(translate(4.5,0,0));
		}
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_scroll_bar_chest_right();
	}


	
	reset_mv();


}

function draw_list_obj(obj, mv){
	if(obj.typeOfObj=='ITEM' || (obj.typeOfObj=='REC' && obj.object.typeOfObj == 'ITEM')){
		mv = mult(mv,translate(2.25,0.15,zLay-0.3));
		mv = mult(mv,scale4(0.35,0.35,0.001))
		mv = mult(mv,rotateZ(-35));
	}else{
		mv = mult(mv,translate(2.5,0.15,zLay-0.3));
		mv = mult(mv,scale4(0.5,0.45,0.001))
		mv = mult(mv,rotateZ(45));
		mv = mult(mv,rotateX(45));
		mv = mult(mv,rotateY(55));
	}
	if(fixedView)
		obj.drawSmall(mult(viewMatrixUI, mv));
	else
		obj.drawSmall(mult(viewMatrix, mv));
}

/*
	Should be run when stuff needs to get updated I guess?
	Like if an object is entirely moved over.
*/
function build_chest_list(){
	/*
		Start with just blocks.
	*/
	//Now get player list.
	if(!refreshList) return;

	let blockListInventory = []; //player.getBlockList();
	switch(selectedTab){
		case 'BLOCK':
			blockListInventory = player.getBlockList();
			break;
		case 'TOOL':
			blockListInventory = player.getItemList();
			break;
		case 'ITEM':
			blockListInventory = player.getNonActionableItemList();
			break;
		case 'REC':
			blockListInventory = player.getRecipeList();
			break;
	}
	chestListInventory = [];
	for(let i = 0; i < blockListInventory.length; i++){
		chestListInventory.push(new ChestEntry(blockListInventory[i]));
	}

	/*
		Need to get objects from chest as well.

		currentInventoryBlock is assumed to be a chest at this point.
	*/

	chestListChestPair = [];
	switch(selectedTab){
		case 'BLOCK':
			chestListChestPair = currentInventoryBlock.getBlockList();
			break;
		case 'TOOL':
			chestListChestPair = currentInventoryBlock.getToolList();
			break;
		case 'ITEM':
			chestListChestPair = currentInventoryBlock.getItemList();
			break;
		case 'REC':
			chestListChestPair = currentInventoryBlock.getRecipeList();
			break;
	}



	chestListChest = [];
	for(let i = 0; i < chestListChestPair.length; i++){
		chestListChest.push(new ChestEntry(chestListChestPair[i][0], true, chestListChestPair[i][1]));
	}
	refreshList = false;
}




/*
	Make those slider things....
*/
class ChestEntry{

	static idleIndex = 0;
	static activeIndex = 0;
	static hoverIndex = 0;
	static numberOfVerts = 0;

	constructor(Obj=null, inChest=false, quant=0){
		this.obj = Obj;
		this.inChest = inChest;
		this.isHovered = false;
		this.quantity = 0;
		if(!inChest)
			this.quantity = player.inventory.getQuantity(this.obj);
		else{
			this.quantity = currentInventoryBlock.getQuantity(this.obj);
		}

		//Move one, move all.
		//var dropObjButton = new InterfaceButton(12,2.1, 13.25,2.4,DARK_GREY,on_click_drop,"Drop",'14',draw_drop_condition);
		//interfaceBackgrounds.push(dropObjButton);

		this.buttons = [new InterfaceCanvasButton(12,2.1, 12.75,2.3,null,"Move one",'10',function(){return true;}, '#555','#333'), 
						new InterfaceCanvasButton(12,2.1, 12.75,2.3,null,"Move all",'10',function(){return true;}, '#555','#333')]
	}

	moveOneToChest(){
		
		currentInventoryBlock.addObject(this.obj);
		player.removeFromInventory(this.obj);
		refreshList = true;
	}

	moveAllToChest(){
		let quant = Math.min(currentInventoryBlock.maxCapacity - currentInventoryBlock.numberOfObjects, player.inventory.getQuantity(this.obj));
		currentInventoryBlock.addObject(this.obj, quant)
		for(let i = 0; i < quant; i++){
			player.removeFromInventory(this.obj);		
		}
		refreshList = true;
	}

	moveOneToInventory(){
		player.addToInventory(this.obj);
		currentInventoryBlock.removeObject(this.obj);
		refreshList = true;
	}

	moveAllToInventory(){
		let quant = currentInventoryBlock.getQuantity(this.obj);

		
		for(let i = 0; i < quant; i++){
			player.addToInventory(this.obj)
		}
		currentInventoryBlock.removeObject(this.obj, quant);
		refreshList = true;
	}

	static sendData(){
		ChestEntry.idleIndex = vertices.length;
		chest_entry_idle();
		ChestEntry.numberOfVerts = vertices.length - ChestEntry.idleIndex;

		// Probably don't need this because you won't be able to select items just move them.
		ChestEntry.activeIndex = vertices.length;
		chest_entry_active();

		ChestEntry.hoverIndex = vertices.length;
		chest_entry_hover();
	}

	onMoveToChest(){
		this.inChest = true;
	}
	onMoveToInventory(){
		this.inChest = false;
	}

	/*
		Need to implement click and hover.
	*/
	draw(i){
		// Draw on left.
		if(!this.inChest){
			this.isHovered=false;
			let hov = false;
			click_in_bounds(2.1125,6.5875-difference*i,2.1+chest_entry_width,5.6-difference*i,function(){},function(){hov = true});
			this.isHovered=hov;


			var mv = translate(0,chestListStartY + difference*(3-i),0);
			set_mv_ui(mv);

			draw_c_text(textX,start+difference*(3-i)+0.65,this.obj.name);
			draw_c_text_small(textX+0.05,start+difference*(3-i)+0.45,this.obj.desc);

			draw_c_text_med(textX+4.65-1.5,start+0.12+difference*(3-i),('Quantity:'));
			draw_c_text_med(textX+5.56-1.5,start+0.12+difference*(3-i),(player.inventory.getQuantity(this.obj)));
			if(this.isHovered)
				gl.drawArrays(gl.TRIANGLES,ChestEntry.hoverIndex,ChestEntry.numberOfVerts);
			else
				gl.drawArrays(gl.TRIANGLES,ChestEntry.idleIndex,ChestEntry.numberOfVerts);

			draw_list_obj(this.obj,mv);

			// Move one
			//this.buttons[0].setXPos(textX+0.3+2.5 );
			//this.buttons[0].setYPos(start+0.75+difference*(3-i) );
			this.buttons[0].setXPos(textX+0.3+2.5+1 );
			this.buttons[0].setYPos(start+0.75+difference*(3-i) );
			if(currentInventoryBlock.numberOfObjects < currentInventoryBlock.maxCapacity && this.buttons[0].draw())
				this.moveOneToChest();

			// Move all
			//this.buttons[1].setXPos(textX+0.3+2.5+1 );
			//this.buttons[1].setYPos(start+0.75+difference*(3-i) );
			this.buttons[1].setXPos(textX+0.3+2.5+1 );
			this.buttons[1].setYPos(start+0.75+difference*(3-i)-0.3 );
			if(currentInventoryBlock.numberOfObjects < currentInventoryBlock.maxCapacity && this.buttons[1].draw())
				this.moveAllToChest();

		}
		// Draw on right.
		else{
			this.isHovered=false;
			let hov = false;
			click_in_bounds(2.1125+6,6.5875-difference*i,2.1+chest_entry_width+6,5.6-difference*i,function(){},function(){hov = true});
			this.isHovered=hov;


			var mv = translate(6,chestListStartY + difference*(3-i),0);
			set_mv_ui(mv);

			draw_c_text(textX+6,start+difference*(3-i)+0.65,this.obj.name);
			draw_c_text_small(textX+0.05+6,start+difference*(3-i)+0.45,this.obj.desc);

			draw_c_text_med(textX+4.65-1.5+6,start+0.12+difference*(3-i),('Quantity:'));
			draw_c_text_med(textX+5.56-1.5+6,start+0.12+difference*(3-i),(currentInventoryBlock.getQuantity(this.obj)));
			if(this.isHovered)
				gl.drawArrays(gl.TRIANGLES,ChestEntry.hoverIndex,ChestEntry.numberOfVerts);
			else
				gl.drawArrays(gl.TRIANGLES,ChestEntry.idleIndex,ChestEntry.numberOfVerts);
			
			draw_list_obj(this.obj,mv);

			// Move one
			//this.buttons[0].setXPos(textX+0.3+2.5+6 );
			//this.buttons[0].setYPos(start+0.75+difference*(3-i) );
			this.buttons[0].setXPos(textX+0.3+2.5+1 +6);
			this.buttons[0].setYPos(start+0.75+difference*(3-i) );
			if(this.buttons[0].draw())
				this.moveOneToInventory();

			// Move all
			//this.buttons[1].setXPos(textX+0.3+2.5+7 );
			//this.buttons[1].setYPos(start+0.75+difference*(3-i) );
			this.buttons[1].setXPos(textX+0.3+2.5+1+6 );
			this.buttons[1].setYPos(start+0.75+difference*(3-i)-0.3 );
			if(this.buttons[1].draw())
				this.moveAllToInventory();


		}
	}
}




/*
	Functions for drawing chest list.
*/
// Probably need to push a little further left because of the scroll list.
//let chest_entry_width = 5.8;
let chest_entry_width = 5.5;
function chest_entry_idle(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(2.1+chest_entry_width,yCoord1+1),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(2.1+chest_entry_width-0.05,yCoord1+1-0.05),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[DARKEST_GREY]);
}

function chest_entry_active(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(2.1+chest_entry_width,yCoord1+1),UI_COLOURS[ACTIVE_BORDER_COLOR]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(2.1+chest_entry_width-0.05,yCoord1+1-0.05),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[BLACK]);
}

function chest_entry_hover(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(2.1+chest_entry_width,yCoord1+1),UI_COLOURS[DARKER_GREY]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(2.1+chest_entry_width-0.05,yCoord1+1-0.05),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[BLACK]);
}



/*
	LEFT ===================
*/

function left_scroll_list_down(){
	if(leftScrollOffset<get_max_scroll_bar_left_length()){leftScrollOffset++;};
}

function left_scroll_list_up(){
	if(leftScrollOffset>0){leftScrollOffset--;}
}

function get_max_scroll_bar_left_length(){
	return Math.max(chestListInventory.length-4,0);
}

function get_scroll_bar_left_length(){
	var val = get_max_scroll_bar_left_length();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}


function draw_scroll_bar_chest_left(){
	var yOffset = 4.5;//5.56+4.5;
	var scale = get_scroll_bar_left_length();
	var mat = mult(translate(-1.5,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;

	var times = get_max_scroll_bar_left_length();
	var increment = -2*top/times;

	if(fixedView){
		set_mv_ui(mult(translate(0,top+increment*leftScrollOffset,0),mat));
	}else{
		set_mv(mult(translate(0,top+increment*leftScrollOffset,0),mat));
	}
	gl.drawArrays(gl.TRIANGLES,scrollBarVertices[0],scrollBarVertices[1]);
}

/*
	RIGHT ==========================
*/

function right_scroll_list_down(){
	if(rightScrollOffset<get_max_scroll_bar_right_length()){rightScrollOffset++;}
}

function right_scroll_list_up(){
	if(rightScrollOffset>0){rightScrollOffset--;}
}

function get_max_scroll_bar_right_length(){
	return Math.max(chestListChest.length-4,0);
}

function get_scroll_bar_right_length(){
	var val = get_max_scroll_bar_right_length();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}


function draw_scroll_bar_chest_right(){
	var yOffset = 4.5;
	var scale = get_scroll_bar_right_length();
	var mat = mult(translate(4.5,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;

	var times = get_max_scroll_bar_right_length();
	var increment = -2*top/times;

	if(fixedView){
		set_mv_ui(mult(translate(0,top+increment*rightScrollOffset,0),mat));
	}else{
		set_mv(mult(translate(0,top+increment*rightScrollOffset,0),mat));
	}
	gl.drawArrays(gl.TRIANGLES,scrollBarVertices[0],scrollBarVertices[1]);
}

