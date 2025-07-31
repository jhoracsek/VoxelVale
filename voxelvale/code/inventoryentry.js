


var leftScrollOffset = 0;
var rightScrollOffset = 0;


var contentListLeft = [];
var contentListRight = [];



/*
	General entry for an arbitrary inventory.
*/
class InventoryListEntry{

	static idleIndex = 0;
	static activeIndex = 0;
	static hoverIndex = 0;
	static numberOfVerts = 0;

	constructor(Obj=null, onRight=false, quant=0){
		this.obj = Obj;
		this.onRight = onRight;
		this.isHovered = false;
		this.quantity = 0;
		if(!onRight)
			this.quantity = player.inventory.getQuantity(this.obj);
		//else{
		//	this.quantity = currentInventoryBlock.getQuantity(this.obj);
		//}

		this.leftButtons = [];
		this.leftButtonFunctions = [];
		this.leftButtonsDrawConditions = [];

		this.rightButtons = [];
		this.rightButtonFunctions = [];
		this.rightButtonsDrawConditions = [];

		this.textToDraw = [];

		this.drawQuantity = true;

	}

	//Should update this. Using chest entries for now is fine.
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

	addLeftButton(text, func, cond){
		this.leftButtons.push(new InterfaceCanvasButton(12,2.1, 12.75,2.3,null,text,'10',function(){return true;}, '#555','#333'));
		this.leftButtonFunctions.push(func);
		this.leftButtonsDrawConditions.push(cond);
	}

	addRightButton(text, func, cond){
		this.rightButtons.push(new InterfaceCanvasButton(12,2.1, 12.75,2.3,null,text,'10',function(){return true;}, '#555','#333'));
		this.rightButtonFunctions.push(func);
		this.rightButtonsDrawConditions.push(cond);
	}

	addText(drawFunc){
		this.textToDraw.push(drawFunc);
	}


	draw(i){
		// Draw on left.
		if(!this.onRight){
			this.isHovered=false;
			let hov = false;
			click_in_bounds(2.1125,6.5875-difference*i,2.1+chest_entry_width,5.6-difference*i,function(){},function(){hov = true});
			this.isHovered=hov;


			var mv = translate(0,chestListStartY + difference*(3-i),0);
			set_mv_ui(mv);

			draw_c_text(textX,start+difference*(3-i)+0.65,this.obj.name);
			draw_c_text_small(textX+0.05,start+difference*(3-i)+0.45,this.obj.desc);

			if(this.drawQuantity){
				draw_c_text_med(textX+4.65-1.5,start+0.12+difference*(3-i),('Quantity:'));
				draw_c_text_med(textX+5.56-1.5,start+0.12+difference*(3-i),(player.inventory.getQuantity(this.obj)));
			}
			if(this.isHovered)
				gl.drawArrays(gl.TRIANGLES,ChestEntry.hoverIndex,ChestEntry.numberOfVerts);
			else
				gl.drawArrays(gl.TRIANGLES,ChestEntry.idleIndex,ChestEntry.numberOfVerts);

			draw_list_obj(this.obj,mv);

			if(this.leftButtons.length != 0){
				this.leftButtons[0].setXPos(textX+0.3+2.5+1 );
				this.leftButtons[0].setYPos(start+0.75+difference*(3-i)-0.24 );

				if(this.leftButtonsDrawConditions[0](this) && this.leftButtons[0].draw()){
					this.leftButtonFunctions[0](this);
				}
			}

			if(this.textToDraw.length != 0){
				this.textToDraw[0](this,i);
			}

			// Move all
			//this.buttons[1].setXPos(textX+0.3+2.5+1 );
			//this.buttons[1].setYPos(start+0.75+difference*(3-i)-0.3 );

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

			if(this.drawQuantity){
				draw_c_text_med(textX+4.65-1.5+6,start+0.12+difference*(3-i),('Quantity:'));
				//draw_c_text_med(textX+5.56-1.5+6,start+0.12+difference*(3-i),(currentInventoryBlock.getQuantity(this.obj)));
			}
			if(this.isHovered)
				gl.drawArrays(gl.TRIANGLES,ChestEntry.hoverIndex,ChestEntry.numberOfVerts);
			else
				gl.drawArrays(gl.TRIANGLES,ChestEntry.idleIndex,ChestEntry.numberOfVerts);
			
			draw_list_obj(this.obj,mv);


			if(this.rightButtons.length != 0){
				this.rightButtons[0].setXPos(textX+0.3+2.5+1 +6);
				this.rightButtons[0].setYPos(start+0.75+difference*(3-i)-0.24);

				if(this.rightButtonsDrawConditions[0](this) && this.rightButtons[0].draw()){
					this.rightButtonFunctions[0](this);
				}
			}
			if(this.textToDraw.length != 0){
				this.textToDraw[0](this,i);
			}

			// Move all
			//this.buttons[1].setXPos(textX+0.3+2.5+1+6 );
			//this.buttons[1].setYPos(start+0.75+difference*(3-i)-0.3 );

		}
	}
}

function tabListClick(inShop = false){
	if(!inShop){
		click_in_bounds(2.1,  7.375,  3.425 ,7,function(){selectedTab = 'BLOCK';active=-1;leftScrollOffset=0; rightScrollOffset=0; activeTab =0;refreshList=true;});
		click_in_bounds(3.6,  7.375,  4.9   ,7,function(){selectedTab = 'TOOL';active=-1;leftScrollOffset=0; rightScrollOffset=0; activeTab = 1;refreshList=true;});
		click_in_bounds(5.075,7.375,  6.375   ,7,function(){selectedTab = 'ITEM';active=-1;leftScrollOffset=0; rightScrollOffset=0; activeTab = 2;refreshList=true;});
		click_in_bounds(6.55,7.375,  7.85   ,7,function(){selectedTab = 'REC';active=-1;leftScrollOffset=0; rightScrollOffset=0; activeTab = 3;refreshList=true;});
	}else{
		click_in_bounds(2.1,  7.375,  3.425 ,7,function(){selectedTab = 'BLOCK';active=-1;leftScrollOffset=0 ; activeTab =0;refreshList=true;});
		click_in_bounds(3.6,  7.375,  4.9   ,7,function(){selectedTab = 'TOOL';active=-1;leftScrollOffset=0; activeTab = 1;refreshList=true;});
		click_in_bounds(5.075,7.375,  6.375   ,7,function(){selectedTab = 'ITEM';active=-1;leftScrollOffset=0; activeTab = 2;refreshList=true;});
		click_in_bounds(6.55,7.375,  7.85   ,7,function(){selectedTab = 'REC';active=-1;leftScrollOffset=0; activeTab = 3;refreshList=true;});
	}
	//Number of objects carried.
	draw_c_text_med(2.25,2.15,('Carry Weight:'));//draw_c_text_med_right
	draw_c_text_med_right(3.85,2.15,player.weight);
	draw_c_text_med(3.85,2.15,'/100');
}

function arrowButtonsDouble(func1, func2, func3, func4){

	let shift = 1.5;
	click_in_bounds(9.2125-shift,6.675,9.485-shift,6.9875,func1);
	click_in_bounds(9.2125-shift,2.25,9.485-shift,2.01,func2);

	click_in_bounds(9.2125-shift+6,6.675,9.485-shift+6,6.9875,func3);
	click_in_bounds(9.2125-shift+6,2.25,9.485-shift+6,2.01,func4);
}





/*
	Functions for drawing chest list.
*/
/*
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
*/



/*
	Scroll bar stuff.
*/


/*
	LEFT ===================
*/

//Updated name
function move_left_scroll_list_down(){
	if(leftScrollOffset<get_scroll_bar_left_length_limit()){leftScrollOffset++;};
}
//Updated name
function move_left_scroll_list_up(){
	if(leftScrollOffset>0){leftScrollOffset--;}
}

//Updated name
function get_scroll_bar_left_length_limit(){
	return Math.max(contentListLeft.length-4,0);
}

//Updated name
function get_scroll_bar_left_current_length(){
	var val = get_scroll_bar_left_length_limit();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}

//Updated name
function draw_scroll_bar_arb_left(){
	var yOffset = 4.5;//5.56+4.5;
	var scale = get_scroll_bar_left_current_length();
	var mat = mult(translate(-1.5,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;

	var times = get_scroll_bar_left_length_limit();
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
//Updated name
function move_right_scroll_list_down(){
	if(rightScrollOffset<get_scroll_bar_right_length_limit()){rightScrollOffset++;}
}
//Updated name
function move_right_scroll_list_up(){
	if(rightScrollOffset>0){rightScrollOffset--;}
}
//Updated name
function get_scroll_bar_right_length_limit(){
	return Math.max(contentListRight.length-4,0);
}

function get_scroll_bar_right_current_length(){
	var val = get_scroll_bar_right_length_limit();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}


function draw_scroll_bar_arb_right(){
	var yOffset = 4.5;
	var scale = get_scroll_bar_right_current_length();
	var mat = mult(translate(4.5,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;

	var times = get_scroll_bar_right_length_limit();
	var increment = -2*top/times;

	if(fixedView){
		set_mv_ui(mult(translate(0,top+increment*rightScrollOffset,0),mat));
	}else{
		set_mv(mult(translate(0,top+increment*rightScrollOffset,0),mat));
	}
	gl.drawArrays(gl.TRIANGLES,scrollBarVertices[0],scrollBarVertices[1]);
}
