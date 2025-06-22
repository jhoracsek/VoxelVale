

var zLay=-200;

var TAB_WIDTH=1.5;

var inventorySlots=[];




//cursorCoor
function click_in_bounds(x1,y1,x2,y2,func,func2=function(){}){
	if((cursorCoor[0] <= x1 && cursorCoor[0] >= x2) || (cursorCoor[0] >= x1 && cursorCoor[0] <= x2)){
		if((cursorCoor[1] <= y1 && cursorCoor[1] >= y2) || (cursorCoor[1] >= y1 && cursorCoor[1] <= y2)){
			if(click==true){
				func();
			}
			func2();			
			
		}
	}
}



//NO TEX! (for now?)
function ui_push(v1 ,v2, v3, c1=vec4(1,0,0,1), c2=c1, c3=c1){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c1);
	colours.push(c2);
	colours.push(c3);

	for(var i =0; i < 3; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
	return 3;
}

function draw_tab(){
	zLay -= 0.01;
	var v1,v2,v3,v4;
	v1 = vec3(0,0,zLay);
	v2 = vec3(0.2,TAB_WIDTH,zLay);
	v3 = vec3(TAB_WIDTH-0.2,TAB_WIDTH,zLay);
	v4 = vec3(TAB_WIDTH,0,zLay);

	ui_push(v1,v4,v3,UI_COLOURS[DARK_GREY]);
	ui_push(v3,v2,v1,UI_COLOURS[DARK_GREY]);
}

function draw_dark_tab(){
	zLay -= 0.01;
	var v1,v2,v3,v4;
	v1 = vec3(0,0,zLay);
	v2 = vec3(0.2,TAB_WIDTH,zLay);
	v3 = vec3(TAB_WIDTH-0.2,TAB_WIDTH,zLay);
	v4 = vec3(TAB_WIDTH,0,zLay);

	ui_push(v1,v4,v3,UI_COLOURS[DARKER_GREY]);
	ui_push(v3,v2,v1,UI_COLOURS[DARKER_GREY]);
}

//Like, why did you set things up like this?
//Why are you even using 3D shapes for the UI, just use context for the
//entire thing I guess tho incorperating 3d objects might be hard
//that way 
function draw_rectangle(vec1,vec2,c){
	var v1,v2,v3,v4;
	v1 = vec3(vec1[0],vec1[1],zLay);
	v2 = vec3(vec2[0],vec1[1],zLay);
	v3 = vec3(vec2[0],vec2[1],zLay);
	v4 = vec3(vec1[0],vec2[1],zLay);
	ui_push(v1,v2,v3,c);
	ui_push(v3,v4,v1,c);
	zLay-=0.01;
}

function draw_rectangle_rounded(vec1,vec2,c){
	var v1,v2,v3,v4;
	v1 = vec3(vec1[0],vec1[1],zLay);
	v2 = vec3(vec2[0],vec1[1],zLay);
	v3 = vec3(vec2[0],vec2[1],zLay);
	v4 = vec3(vec1[0],vec2[1],zLay);
	build_rounded_rectangle(v1,v2,v3,v4,0.15);
	//build_rounded_rectangle_stroke(v1,v2,v3,v4,0.15,borderColor);
	const offset=0.0005
	v1 = vec3(vec1[0]-offset,vec1[1]-offset,zLay);
	v2 = vec3(vec2[0]+offset,vec1[1]-offset,zLay);
	v3 = vec3(vec2[0]+offset,vec2[1]+offset,zLay);
	v4 = vec3(vec1[0]-offset,vec2[1]+offset,zLay);


	build_rounded_rectangle_stroke(v1,v2,v3,v4,0.15,borderColorOuter,0.01);
	zLay-=0.01;
}

function draw_rectangle_rounded_selected(vec1,vec2,c){
	var v1,v2,v3,v4;
	const offset=0.008
	v1 = vec3(vec1[0]-offset,vec1[1]-offset,zLay);
	v2 = vec3(vec2[0]+offset,vec1[1]-offset,zLay);
	v3 = vec3(vec2[0]+offset,vec2[1]+offset,zLay);
	v4 = vec3(vec1[0]-offset,vec2[1]+offset,zLay);


	build_rounded_rectangle_selected(v1,v2,v3,v4,0.15);
	zLay-=0.01;

}
function draw_triangle(x,y,d,c=UI_COLOURS[WHITE]){
	var v1,v2,v3;
	if(d==false){
		v1 = vec3(x,y,zLay);
		v2 = vec3(x+0.1,y+0.1,zLay);
		v3 = vec3(x+0.2,y,zLay);
	}else{
		v1 = vec3(x,y,zLay);
		v2 = vec3(x+0.1,y-0.1,zLay);
		v3 = vec3(x+0.2,y,zLay);
	}
	ui_push(v1,v2,v3,c);
}


var startDraw=[];
var endDraw=[];
var scrollBarVertices=[0,0];
var hoverEntryVertices=[0,0];
function build_inventory(){
	startDraw=[0,0,0,0,0,0,0,0,0,0,0,0,0];
	endDraw=[0,0,0,0,0,0,0,0,0,0,0,0,0];
	tab_lists();
	build_craft_list();
	zLay=-9;
	startDraw[0]=vertices.length;
	draw_rectangle(vec2(2,1),vec2(14,8),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(2,2),vec2(14,7),UI_COLOURS[DARK_GREY]);
	//draw_rectangle(vec2(9.5,2),vec2(14,7),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(10,2.5),vec2(13.5,6.5),UI_COLOURS[BLACK]);
	zLay=-9.49;
	draw_rectangle(vec2(9.5,2),vec2(10,7),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(13.5,2),vec2(14,7),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(10,2),vec2(13.5,2.5),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(10,7),vec2(13.5,6.5),UI_COLOURS[DARKEST_GREY]);
	zLay=-9.0;
	endDraw[0]=vertices.length-startDraw[0];

	startDraw[1]=vertices.length;
	zLay-=0.6;
	build_cursor();
	zLay+=0.6;
	endDraw[1]=vertices.length-startDraw[1];

	startDraw[2]=vertices.length;
	draw_tab();
	endDraw[2]=vertices.length-startDraw[2];

	startDraw[7]=vertices.length;
	draw_dark_tab();
	endDraw[7]=vertices.length-startDraw[7];

	startDraw[3]=vertices.length;
	zLay-=0.1;
	scroll_entry_idle();
	endDraw[3]=vertices.length-startDraw[3];

	startDraw[4]=vertices.length;
	scroll_entry_active();
	endDraw[4]=vertices.length-startDraw[4];

	hoverEntryVertices[0]=vertices.length;
	scroll_entry_hover();
	hoverEntryVertices[1]=vertices.length-hoverEntryVertices[0];




	startDraw[5]=vertices.length;
	scroll_arrows();
	endDraw[5]=vertices.length-startDraw[5];

	scrollBarVertices[0]=vertices.length;
	build_scroll_bar();
	scrollBarVertices[1]=vertices.length-scrollBarVertices[0];

	/*
		This is for the tool bar.
	*/
	tool_bar_box();


	/*
		This is for the map squares.
	*/
	build_map_squares();
}


/*
	Idle and active are reversed for some reason?
*/
function scroll_entry_idle(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(9.15,yCoord1+1),UI_COLOURS[ACTIVE_BORDER_COLOR]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(9.1,yCoord1+1-0.05),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[BLACK]);
}

function scroll_entry_active(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(9.15,yCoord1+1),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(9.1,yCoord1+1-0.05),UI_COLOURS[DARKEST_GREY]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[DARKEST_GREY]);
}

function scroll_entry_hover(){
	var yCoord1=0;
	draw_rectangle(vec2(2.1,yCoord1),vec2(9.15,yCoord1+1),UI_COLOURS[DARKER_GREY]);
	draw_rectangle(vec2(3.2,yCoord1+0.05),vec2(9.1,yCoord1+1-0.05),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(2.15,yCoord1+0.05),vec2(3.15,yCoord1+1-0.05),UI_COLOURS[BLACK]);
}

function tab_lists(){
	if(fastMode){
		blockTabList=[
			new Door(),
			new TestBlock(),
			new WorkBench(),
			new WoodBlock(),
			new WeirdBlock(),
			new GrassBlock(),
			new WoodBranch(),
			new WoodLog(),
			new StoneBlock()
			];
		toolTabList=[
			new WoodAxe(),
			new StonePickaxe(),
			new WoodenBow()
			];
	}else{
		blockTabList=player.getBlockList();
		//toolTabList=[new WoodAxe(),new StonePickaxe()];
		toolTabList=player.getItemList();
	}
	itemTabList=player.getNonToolList();
	recipeTabList=player.getRecipeList();

}

var active =-1;
var hoveredEntry =-1;
var start =2.45;
var difference=1.05;
var textX = 3.3;
var scrollOffset = 0; //WHEN THIS INCREASES ACTIVE INCREASE AND WHEN THIS DECREASES ACTIVE DECREASES

var selectedTab = 'BLOCK';
var blockTabList=[];
var toolTabList=[];
var itemTabList=[];
var recipeTabList=[];
//<----
var tabList=[]; //<---This is the active list
var tabListLength;


/*
	Should update this to just use tabListLength!
*/
function get_max_scroll_length(){
	return Math.max(tabListLength-4,0);
	/*
	var len;
	switch(selectedTab){
		case 'BLOCK':
			len = blockTabList.length;
			break;
		case 'TOOL':
			len = toolTabList.length;
			break;
	}
	return Math.max(len-4,0)
	*/
}

function get_scroll_bar_length(){
	var val = get_max_scroll_length();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}


function scroll_list_down(){
	if(scrollOffset<get_max_scroll_length()){scrollOffset++;active--;};
}

function scroll_list_up(){
	if(scrollOffset>0){scrollOffset--;active++;}
}

function draw_hold_condition(){
	return active+scrollOffset >= 0 && tabList[active+scrollOffset] != null && activeTab < 2; // And never on the recipes tab!
}

function on_click_hold(){
	if(tabList[selectedItemIndex] != null)
		player.setHeldObject(tabList[selectedItemIndex]); add_to_toolbar(tabList[selectedItemIndex])
}

function on_click_drop(){
	
	let worldObj;
	if(inDungeon) worldObj = currentDungeon;
	else worldObj = world;

	let drop = get_where_to_drop(worldObj);

	//Need the selected item!
	//Just test with grass for now.

}

function get_where_to_drop(worldObj){
	//Should get a position that you can drop, or if there
	//is no position return null or something...
	var dropSpace = worldObj.getDropBoxSpace(Math.round(player.posX), Math.round(player.posY));
	
	if(dropSpace==null){
		return;
	}

	var PX = dropSpace[1][0];
	var PY = dropSpace[1][1];
	var PZ = dropSpace[1][2];

	if(!dropSpace[0]){
		//Create a new DropBox.
		player.removeFromInventory(tabList[selectedItemIndex]);
		worldObj.addBlock(new DropBox(PX,PY,PZ,[tabList[selectedItemIndex]]));
	}else{
		//Add to an existing DropBox.
		player.removeFromInventory(tabList[selectedItemIndex]);
		dB = dropSpace[1];
		dB.addTo(tabList[selectedItemIndex]);
	}
}

/*
	This function does two things.
		Draws the scroll list and checks for clicks.
		Draws the currently selected object on the right.

	Additionally, this function sets selectedItemIndex,
	which represents the currently selected item.
	(This is then used in "inventory.js" for the hold item button.)
*/
var selectedItemIndex = -1;
function draw_scroll_list(){

	click_in_bounds(2.1,  7.375,  3.425 ,7,function(){selectedTab = 'BLOCK';active=-1;scrollOffset=0; activeTab =0;});
	click_in_bounds(3.6,  7.375,  4.9   ,7,function(){selectedTab = 'TOOL';active=-1;scrollOffset=0; activeTab = 1;});
	click_in_bounds(5.075,7.375,  6.375   ,7,function(){selectedTab = 'ITEM';active=-1;scrollOffset=0; activeTab = 2;});
	//Update. 1.3 wide offset by .175
	click_in_bounds(6.55,7.375,  7.85   ,7,function(){selectedTab = 'REC';active=-1;scrollOffset=0; activeTab = 3;});
	
	//click_in_bounds(9.2125,6.675,9.485,6.9875,function(){if(scrollOffset>0){scrollOffset--;active++;}});
	click_in_bounds(9.2125,6.675,9.485,6.9875,scroll_list_up);
	click_in_bounds(9.2125,2.25,9.485,2.01,scroll_list_down);

	hoveredEntry = -1;
	click_in_bounds(2.1125,6.5875,9.2,5.6,function(){if(tabList[0+scrollOffset]!=null) active=0;}, function(){hoveredEntry=0});
	click_in_bounds(2.1125,6.5875-difference,9.2,5.6-difference,function(){if(tabList[1+scrollOffset]!=null) active=1; }, function(){hoveredEntry=1});
	click_in_bounds(2.1125,6.5875-difference*2,9.2,5.6-difference*2,function(){if(tabList[2+scrollOffset]!=null) active=2;}, function(){hoveredEntry=2});
	click_in_bounds(2.1125,6.5875-difference*3,9.2,5.6-difference*3,function(){if(tabList[3+scrollOffset]!=null) active=3;}, function(){hoveredEntry=3});
	switch(selectedTab){
		case 'BLOCK':
			tabList = blockTabList;
			break;
		case 'TOOL':
			tabList = toolTabList;
			break;
		case 'ITEM':
			tabList = itemTabList;
			break;
		case 'REC':
			tabList = recipeTabList;
			break;
	}

	tabListLength = tabList.length;
	for(var i = 0; i < Math.min(tabListLength-scrollOffset,4); i++){
		var mv = translate(0,start+difference*(3-i),0);
		set_mv_ui(mv);
		draw_c_text(textX,start+difference*(3-i)+0.65,tabList[i+scrollOffset].name);
		draw_c_text_small(textX+0.05,start+difference*(3-i)+0.45,tabList[i+scrollOffset].desc);
		draw_c_text_med(textX+4.65,start+0.12+difference*(3-i),('QUANTITY:'));
		draw_c_text_med(textX+5.56,start+0.12+difference*(3-i),(player.inventory.getQuantity(tabList[i+scrollOffset])));
		if(active== i){
			gl.drawArrays(gl.TRIANGLES,startDraw[3],endDraw[3]);
		}
		else if(hoveredEntry==i){
			//HOVERED!
			gl.drawArrays(gl.TRIANGLES,hoverEntryVertices[0],hoverEntryVertices[1]);

		}else{
			gl.drawArrays(gl.TRIANGLES,startDraw[4],endDraw[4]);
		}
		draw_inventory_item(tabList[i+scrollOffset],mv);
	}
	if(active+scrollOffset >= 0 && tabList[active+scrollOffset] != null){
		draw_display_item(tabList[active+scrollOffset]);
		selectedItemIndex = active+scrollOffset;
	}
	reset_mv();
}
//IF CLICK ARROW BUTTONS, ACTIVE++/ACTIVE--
function draw_inventory_item(object,mv){

	if(selectedTab=='TOOL'){
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
	//set_mv(mv);
	if(fixedView)
		object.drawSmall(mult(viewMatrixUI, mv));
	else
		object.drawSmall(mult(viewMatrix, mv));
	//gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
}

//this is for the view of actively selected item
var xSpin = 0;
var controlledXSpin=0;
var controlledYSpin=0;
//var controlledXSpin=0;
function draw_display_item(object){
	var instanceMat=mat4();//goober
	instanceMat = translate(11.8,4.25,-9.45);
	if(modelTestMode==false){
		if(xSpin >= 360){
			xSpin = 0;
		}
		if(object.typeOfObj=='ITEM'){
			instanceMat = mult(instanceMat, translate(1.22,-1.05,0));
			instanceMat = mult(instanceMat, scale4(1.25,1.25,0.01));
			instanceMat = mult(instanceMat,rotateZ(45));
			instanceMat = mult(instanceMat,rotateY(xSpin));
			instanceMat = mult(instanceMat,rotateX(15));
			xSpin+=2;
		}else if(object.isTall){
			instanceMat = mult(instanceMat, translate(0,-1,0));
			instanceMat = mult(instanceMat, scale4(-1.5,1.5,-0.01));
			
			instanceMat = mult(instanceMat,rotateZ(90));
			instanceMat = mult(instanceMat,rotateX(90));
			instanceMat = mult(instanceMat,rotateX(xSpin));
			instanceMat = mult(instanceMat, translate(0,-0.25,0));
			xSpin+=2;
		}
		else{
			instanceMat = mult(instanceMat, scale4(-1.5,1.5,-0.01));
			instanceMat = mult(instanceMat,rotateX(xSpin));
			instanceMat = mult(instanceMat,rotateZ(xSpin));
			xSpin++;
		}
	}else{
		instanceMat = mult(instanceMat, translate(-0.05,-0.75,0));
		instanceMat = mult(instanceMat, scale4(0.85,0.85,0.01));
		instanceMat = mult(instanceMat,rotateY(controlledXSpin));
		instanceMat = mult(instanceMat,rotateX(controlledYSpin));
	}
	//set_mv(instanceMat);
	//gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
	if(fixedView)
		object.drawSmall(mult(viewMatrixUI, instanceMat));
	else
		object.drawSmall(mult(modelViewMatrix, instanceMat));
}

var activeTab = 0;

var tabNames=[
	"Blocks",
	"Tools",
	"Items",
	"Recipes",
];
function draw_all_tabs(){
	var numberOfTabs=tabNames.length;
	var instanceMat;
	var translateNum=2;
	for(var i = 0; i < numberOfTabs;i++){
		instanceMat = translate(translateNum,7,0);
		draw_c_text(translateNum+0.2,7+0.075,tabNames[i]);
		//draw_c_line(translateNum,2,translateNum+TAB_WIDTH,2);
		instanceMat = mult(instanceMat, scale4(1,0.25,1));
		set_mv_ui(instanceMat);
		if(activeTab == i){
			gl.drawArrays(gl.TRIANGLES,startDraw[2],endDraw[2]);
		}else{
			gl.drawArrays(gl.TRIANGLES,startDraw[7],endDraw[7]);
		}
		translateNum+=TAB_WIDTH;
	}
}


function scroll_arrows(){
	draw_rectangle(vec2(9.2,2.25),vec2(9.5,2),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(9.2,6.5+0.25),vec2(9.5,7),UI_COLOURS[BLACK]);
	draw_rectangle(vec2(9.2,2.25),vec2(9.5,6.5+0.25),UI_COLOURS[DARKEST_GREY]);
	//draw_rectangle();
	zLay-=0.01;
	draw_triangle(9.25,6.825,false);
	draw_triangle(9.25,2.175,true);
}




function draw_c_text(x1,y1,text1){
	context.font = "18px Verdana";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.fillText(text1,xCoor1,yCoor1);
}

function draw_c_text_small_stroke(x1,y1,text1){
	context.font = "10px Verdana";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.strokeStyle = '#333';
    context.strokeText(text1,xCoor1,yCoor1);
 	context.fillText(text1,xCoor1,yCoor1);
}

function draw_c_text_small(x1,y1,text1){
	context.font = "10px Verdana";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.fillText(text1,xCoor1,yCoor1);
}

function draw_c_text_med(x1,y1,text1){
	context.font = "13px Verdana";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.fillText(text1,xCoor1,yCoor1);
}

function draw_c_text_med_stroke(x1,y1,text1){
	context.font = "13px Verdana";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.strokeStyle = '#333';
    context.strokeText(text1,xCoor1,yCoor1);
 	context.fillText(text1,xCoor1,yCoor1);
 
}

function draw_c_box(x1,y1,x2,y2){
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - (y2*(canvas.height/9));
	context.beginPath();
	context.rect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
	context.stroke();
	return;
}

function draw_c_line(x1,y1,x2,y2, c='#FFFFFF'){
    var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = y1*(canvas.height/9);
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = y2*(canvas.height/9);

    context.beginPath(); 
   	context.moveTo(xCoor1,yCoor1);
 	context.lineTo(xCoor2,yCoor2);
 	context.strokeStyle = c;
 	//context.lineWidth =1;
  	context.stroke();
}

var rot=0;
function draw_test(){
	rot++;
	reset_mv()
	//var mv = translate(0,4,0);
	mv = translate(4,4,zLay);
	mv = mult(mv,scale4(1,1,0.1));
	mv = mult(mv,rotateX(rot));
	mv = mult(mv,rotateY(rot));
	set_mv(mv);
	gl.drawArrays(gl.TRIANGLES,axeStart,24);
	reset_mv();
}

var rot=0;
var currentMenu='INVENTORY';
function draw_inventory(){

	set_light_full();
	if(fixedView)
		set_ui_pv();
	else
		set_ui_pv(translate(-1,-1,0));

	switch(currentMenu){
		case 'INVENTORY':
			draw_scroll_list();
			set_mv_ui();

			//Scroll bar
			if(tabListLength > 4){
				gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
				draw_scroll_bar();
			}

			/*
				This is where you draw the cursor.
			*/
			draw_inventory_cursor();
			reset_mv();
			draw_all_tabs();

			
	
			//This is where the updated stuff is included.
			draw_interface_inventory();

			break;
		case 'CRAFTING':
			draw_crafting_menu();
			break;
		}
	reset_mv();
	reset_pv();
}


/*
	Scroll bar.
*/
function build_scroll_bar(){
	//draw_rectangle(vec2(9.2,2.25),vec2(9.5,2),UI_COLOURS[WHITE]);
	//draw_rectangle(vec2(9.2,6.5+0.25),vec2(9.5,7),UI_COLOURS[WHITE]);
	draw_rectangle(vec2(9.3,2.3),vec2(9.4,6.5+0.2),UI_COLOURS[WHITE]);
	//draw_rectangle();
	zLay-=0.01;
	//draw_triangle(9.25,6.825,false);
	//draw_triangle(9.25,2.175,true);
}

function draw_scroll_bar(){
	//Move to origin!
	//TO ORIGIN: 4.5
	//Bottom: 2.3, Top: 6.7 Midpoint: 
	//Translate: BOTTOM = 2.3+4.5 = 6.8, TOP = 6.7+4.5 = 11.2. MIDPOINT: 9

	/*
		If we translate the top portion to (0,0), then when we translate back it will be at the top.
		What is the length? 11.2 - 6.8
	*/
	var yOffset = 4.5;//5.56+4.5;
	var scale = get_scroll_bar_length();
	var mat = mult(translate(0,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;
	//Scale factor: get_scroll_bar_length()
	//Number of times you can click the thing. get_max_scroll_length()
	//scrollOffset 

	var times = get_max_scroll_length();
	var increment = -2*top/times;

	if(fixedView){
		set_mv_ui(mult(translate(0,top+increment*scrollOffset,0),mat));
	}else{
		set_mv(mult(translate(0,top+increment*scrollOffset,0),mat));
	}
	gl.drawArrays(gl.TRIANGLES,scrollBarVertices[0],scrollBarVertices[1]);
}


/*
	Inventory cursor.
*/

function line_push(v1 ,v2){
	vertices.push(v1);
	vertices.push(v2);

	colours.push(UI_COLOURS[BLACK]);
	colours.push(UI_COLOURS[BLACK]);

	for(var i =0; i < 2; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

function ui_push_cursor(v1 ,v2, v3, c1=vec4(1,0,0,1), c2=c1, c3=c1){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c1);
	colours.push(c2);
	colours.push(c3);

	for(var i =0; i < 3; i++){
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

function build_cursor(){
	var v1,v2,v3,v4;
	zLay -= 0.01;
	var zVal = -9.649;
	//ui_push

/*	
	v1=vec3(-1,0,zLay);
	v2=vec3(1,0,zLay);
	v3=vec3(0,-1,zLay);
	v4=vec3(0,1,zLay);
	line_push(v1,v2);
	line_push(v3,v4);
*/

	v1 = vec3(0,   0,   zVal);
	v2 = vec3(0.75,-0.25,zVal);
	v3 = vec3(0.75/2, -0.75/2, zVal);
	v4 = vec3(0.25,-0.75,zVal);

	ui_push_cursor(v1,v3,v2, vec4(1,1,1,1)) ;
	ui_push_cursor(v1,v3,v4,vec4(1,1,1,1));

	zVal -= 0.001;

	v1 = vec3(0,   0,   zVal);
	v2 = vec3(0.75,-0.25,zVal);
	v3 = vec3(0.75/2, -0.75/2, zVal);
	v4 = vec3(0.25,-0.75,zVal);


	line_push(v1,v2);
	line_push(v2,v3);
	line_push(v3,v4);
	line_push(v4,v1);
	//(0,0) is where the cursor should hit.
	
}

function draw_inventory_cursor(){
	set_mv_ui(mult(translate(cursorCoor[0],cursorCoor[1],-0.35),scale4(0.35,0.35,1)));
	gl.drawArrays(gl.TRIANGLES,startDraw[1],6);
	gl.drawArrays(gl.LINES,startDraw[1]+6,8);
}

/*
	Also draw on context so it appears above everything else.
*/
function draw_inventory_cursor_overlay(){

	//tip 		cursorCoor[0]					cursorCoor[1]
	//Right 	cursorCoor[0]+0.75*0.35 		cursorCoor[1]-0.25*0.35
	//Mid 		cursorCoor[0]+(0.75/2)*0.35 	cursorCoor[1] - (0.75/2)*0.35
	//Left 		cursorCoor[0]+0.25*0.35			cursorCoor[1] -0.75*0.35

	let tip 	= convert_to_canvas_coords(cursorCoor[0], cursorCoor[1]);
	let right 	= convert_to_canvas_coords(cursorCoor[0]+0.75*0.35, cursorCoor[1]-0.25*0.35);
	let mid 	= convert_to_canvas_coords(cursorCoor[0]+(0.75/2)*0.35, cursorCoor[1] - (0.75/2)*0.35);
	let left 	= convert_to_canvas_coords(cursorCoor[0]+0.25*0.35, cursorCoor[1] -0.75*0.35);

	let cursor = new Path2D();

	//cursor.beginPath(); 
   	
   	cursor.moveTo(tip[0],tip[1]);
 	cursor.lineTo(right[0],right[1]);

 	//cursor.moveTo(right[0],right[1]);
 	cursor.lineTo(mid[0],mid[1]);

 	//cursor.moveTo(mid[0],mid[1]);
 	cursor.lineTo(left[0],left[1]);

 	//cursor.moveTo(left[0],left[1]);
 	cursor.lineTo(tip[0],tip[1]);

 	cursor.closePath();

 	context.fillStyle = "#FFFFFF";
 	context.fill(cursor,"evenodd")
 	context.strokeStyle = '#000000';
 	context.lineWidth = 1;
  	context.stroke(cursor,"evenodd");
  	context.lineWidth = 1;

	//Need to make sure these are drawn at the highest level!
	/*
	draw_context_line(cursorCoor[0],cursorCoor[1], cursorCoor[0]+0.75*0.35,cursorCoor[1]-0.25*0.35, '#FF0000');
	draw_context_line(cursorCoor[0]+0.75*0.35, cursorCoor[1]-0.25*0.35, cursorCoor[0]+(0.75/2)*0.35, cursorCoor[1] - (0.75/2)*0.35,   '#FF0000');
	draw_context_line(cursorCoor[0]+(0.75/2)*0.35, cursorCoor[1] - (0.75/2)*0.35,cursorCoor[0]+0.25*0.35, cursorCoor[1] -0.75*0.35,'#FF0000');
	draw_context_line(cursorCoor[0]+0.25*0.35, cursorCoor[1] -0.75*0.35,cursorCoor[0],cursorCoor[1],'#FF0000');
	*/
	context.fillStyle = "white";
}


/*
	Toolbar functions
*/


/*
	Basically, you should push everything in the toolbar to the right,
	place the object in the fourth slot, and make the active item 3.
	Unless it's a tool, in which case just assign the active item to the
	appropriate tool.
*/
function add_to_toolbar(Object){
	if(Object == null){
		return;
	}
	const objNum = Object.objectNumber;

	if(objNum == 64){
		activeToolBarItem = 1;
		return;
	}
	if(objNum == 65){
		activeToolBarItem = 2;
		return;
	}
	if(objNum == 66){
		activeToolBarItem = 3;
		return;
	}
	//toolBarList, activeToolBarItem = 3. From: 3, 4, 5, 6 const NUM_TOOLBAR_TOOLS = 3; const NUM_TOOLBAR_ITEMS = 7;
	
	
	//Find position of block in tool bar
	var toolBarPosition = -1;
	for(let i = NUM_TOOLBAR_TOOLS; i < NUM_TOOLBAR_ITEMS; i++){
		if(toolBarList[i] != null && toolBarList[i].objectNumber == objNum){
			toolBarPosition = i;
			break;
		}
	}

	// Two cases, item is already in toolbar, item isn't in toolbar
	if(toolBarPosition == -1){
		//Just shift everything to the right.
		for(let i = NUM_TOOLBAR_ITEMS-1; i > NUM_TOOLBAR_TOOLS; i--){
			toolBarList[i] = toolBarList[i-1];
		}	
			
	}else if(toolBarPosition == NUM_TOOLBAR_TOOLS){
		activeToolBarItem = NUM_TOOLBAR_TOOLS+1;
		return;		
	}else{
		//Basically just shift everything behind toolBarPosition
		//One value to the right, then set the first position to the object.
		for(let i = toolBarPosition; i > NUM_TOOLBAR_TOOLS; i--){
			toolBarList[i] = toolBarList[i-1];
		}	
		
	}

	activeToolBarItem = NUM_TOOLBAR_TOOLS+1;
	toolBarList[activeToolBarItem-1]=Object;
}

/*
	This function should remove any spaces in the toolbar.
*/
function updateToolBar(){

	for(let i = NUM_TOOLBAR_TOOLS; i < NUM_TOOLBAR_ITEMS; i++){
		//3, 4, 5, 6
		if(toolBarList[i] == null){
			for(let j = i+1; j < NUM_TOOLBAR_ITEMS; j++){
				if(toolBarList[j] != null){
					toolBarList[i] = toolBarList[j];
					toolBarList[j] = null;
					break;
				}
			}
		}
	}
}


/*
	This function assumes that the projection and modelView matrices are
	set to identity.
*/
//var obj1 = mult(scale4(0.2, 0.2,0.2),translate(-0.05,-0.75,0));
var scaleAndRotate;
var toolBarObjs=[];
function draw_toolbar_items(){
	// Draw tools
	var object;
	const space = 0.65;
	for(let i = 0; i < 7; i++){
		object = toolBarList[i];
		if(object != null){
			if(i >= NUM_TOOLBAR_TOOLS)
				draw_c_text_small_stroke(3.15+space*(i-NUM_TOOLBAR_TOOLS),8,player.getObjectQuantity(object));
			
			//gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
			if(i >= NUM_TOOLBAR_TOOLS){
				object.drawSmall(toolBarObjs[i]);
			}else{
				gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(toolBarObjs[i]));
				gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
			}
		}
	}

	//Draw active block (after one is selected)
}

function set_toolbar_matrices(){
	//obj1 = translate(-0.3,0.6,-10);	//Roughly centered, scale 0.35.
	//obj1 = translate(-0.2,0.6,-10);	//Roughly centered, scale 0.25.
	
	//Here
	scaleAndRotate = scale4(0.22,0.22,0.001);
	scaleAndRotate = mult(scaleAndRotate,rotateZ(-35));

	var xpositions = [3.45, 0, -1, -2]

	toolBarObjs.push(mult(viewMatrix,mult(translate(-7.4, 3.45,-10),scaleAndRotate)));
	toolBarObjs.push(mult(viewMatrix,mult(translate(-7.4+0.65, 3.45,-10),scaleAndRotate)));
	toolBarObjs.push(mult(viewMatrix,mult(translate(-7.4+0.65*2, 3.45,-10),scaleAndRotate)));


	//For blocks
	//mv = mult(mv,translate(2.5,0.15,zLay-0.3));
	//mv = mult(mv,scale4(0.5,0.45,0.001))
	//mv = mult(mv,rotateZ(45));
	//mv = mult(mv,rotateX(45));
	//mv = mult(mv,rotateY(55));
	var rotateMat = mult(mult(rotateZ(45),rotateX(45)),rotateY(55))

	scaleAndRotate = mult(scale4(0.22,0.22,0.001), rotateMat);


	for (let i = 0; i < 4; i++){
		toolBarObjs.push(mult(viewMatrix,mult(translate(-4.97+0.65*i, 3.49,-9.5),scaleAndRotate)));
	}
}

function draw_tool_bar(){

	//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(-7.4,1.225,0))));
	//gl.drawArrays(gl.TRIANGLES,startDraw[6],endDraw[6]);

	//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(-7.4,1.225 -0.75,0))));
	//gl.drawArrays(gl.TRIANGLES,startDraw[6],endDraw[6]);

	//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(-7.4,1.225-1.5,0))));
	//gl.drawArrays(gl.TRIANGLES,startDraw[6],endDraw[6]);

	//gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(-7.4,1.225-1.5-0.75,0))));
	//gl.drawArrays(gl.TRIANGLES,startDraw[6],endDraw[6]);
	draw_c_text_med_stroke(1.249,8.59,'Tools');
	//draw_c_text_med_stroke(3.7732,8.59,'Items');
	draw_c_text_med_stroke(3.767,8.59,'Blocks');

	const xlinepos=2.58;
	draw_c_line(xlinepos,0.61,xlinepos,1,'#6a6a6a');

	const height = 3.7;
	const space = 0.65;
	var startX = -7.2-space;
	for (let i = 0; i < 3; i++){
		startX += space;
		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(startX,height,0))));
		if(activeToolBarItem == (i+1)){
			gl.drawArrays(gl.TRIANGLES,startDraw[9],endDraw[9]);
			gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		}
		gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		draw_c_text_small_stroke(0.58+space*i,8.323,i+1);
	}
	startX += 0.3;
	for (let i = 0; i < 4; i++){
		startX += space;

		gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(startX,height,0))));

		if(activeToolBarItem == (i+4)){
			gl.drawArrays(gl.TRIANGLES,startDraw[9],endDraw[9]);
			gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		}


		gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		draw_c_text_small_stroke(2.841+space*i,8.323,i+4);

	}

	
}

var clearBlack = vec4(0.1,0.2,0.15,0.7);
var borderColor = vec4(0.28,0.4,0.32,0.9);
var borderColorOuter = vec4(0.7,0.7,0.7,0.4);

function tool_bar_box(){
	const width = 0.625;
	const height = 0.625;
	startDraw[8]=vertices.length;
	//draw_rectangle(vec2(-7.75,0.9),vec2(-7,1.65),clearBlack);
	draw_rectangle_rounded(vec2(-width/2,-height/2),vec2(width/2,height/2),clearBlack);
	endDraw[8]=vertices.length-startDraw[8];

	startDraw[9]=vertices.length;
	//draw_rectangle(vec2(-7.75,0.9),vec2(-7,1.65),clearBlack);
	draw_rectangle_rounded_selected(vec2(-width/2,-height/2),vec2(width/2,height/2),clearBlack);
	endDraw[9]=vertices.length-startDraw[9];
}




/*
function draw_inventory_item(object,mv){

	if(selectedTab=='TOOL'){
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
	set_mv(mv);
	gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
}

*/
function build_rounded_rectangle(v1, v2, v3, v4, r, color=clearBlack, segments = 6) {
    function lerp(a, b, t) {
        return [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, zLay];
    }

    function arc(center, startAngle, endAngle, radius, steps) {
        const result = [];
        for (let i = 0; i <= steps; ++i) {
            let theta = startAngle + (endAngle - startAngle) * i / steps;
            result.push([
                center[0] + radius * Math.cos(theta),
                center[1] + radius * Math.sin(theta),
                zLay
            ]);
        }
        return result;
    }

    let bl = [v1[0] + r, v1[1] + r, zLay];
    let br = [v2[0] - r, v2[1] + r, zLay];
    let tr = [v3[0] - r, v3[1] - r, zLay];
    let tl = [v4[0] + r, v4[1] - r, zLay];

    let arc_bl = arc(bl, Math.PI, 1.5 * Math.PI, r, segments);
    let arc_br = arc(br, 1.5 * Math.PI, 2 * Math.PI, r, segments);
    let arc_tr = arc(tr, 0, 0.5 * Math.PI, r, segments);
    let arc_tl = arc(tl, 0.5 * Math.PI, Math.PI, r, segments);

    function draw_fan(center, points) {
        for (let i = 0; i < points.length - 1; i++) {
            ui_push(center, points[i], points[i + 1], clearBlack);
        }
    }

    draw_fan(bl, arc_bl);
    draw_fan(br, arc_br);
    draw_fan(tr, arc_tr);
    draw_fan(tl, arc_tl);

    function draw_strip(p1, p2, p3, p4) {
        ui_push(p1, p2, p3,clearBlack);
        ui_push(p1, p3, p4,clearBlack);
    }

    // Bottom edge
    draw_strip(arc_bl[arc_bl.length - 1], arc_br[0], br, bl);
    // Right edge
    draw_strip(arc_br[arc_br.length - 1], arc_tr[0], tr, br);
    // Top edge
    draw_strip(arc_tr[arc_tr.length - 1], arc_tl[0], tl, tr);
    // Left edge
    draw_strip(arc_tl[arc_tl.length - 1], arc_bl[0], bl, tl);

    // Center
    draw_strip(bl, br, tr, tl);
}

/*
	This is just the outline
*/

function build_rounded_rectangle_stroke(v1, v2, v3, v4, r, color, thickness=0.02, segments = 6) {
	const depth = -9.9;

    function lerp(a, b, t) {
        return [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, depth];
    }

    function arc(center, startAngle, endAngle, radius, steps) {
        const result = [];
        for (let i = 0; i <= steps; ++i) {
            let theta = startAngle + (endAngle - startAngle) * i / steps;
            result.push([
                center[0] + radius * Math.cos(theta),
                center[1] + radius * Math.sin(theta),
                depth
            ]);
        }
        return result;
    }

    // 1. Compute inset corner centers
    let bl = [v1[0] + r, v1[1] + r, depth];
    let br = [v2[0] - r, v2[1] + r, depth];
    let tr = [v3[0] - r, v3[1] - r, depth];
    let tl = [v4[0] + r, v4[1] - r, depth];

    // 2. Generate arcs
    let arc_bl = arc(bl, Math.PI, 1.5 * Math.PI, r, segments);
    let arc_bl_inner = arc(bl, Math.PI, 1.5 * Math.PI, r-thickness, segments);



    let arc_br = arc(br, 1.5 * Math.PI, 2 * Math.PI, r, segments);
    let arc_br_inner = arc(br, 1.5 * Math.PI, 2 * Math.PI, r-thickness, segments);



    let arc_tr = arc(tr, 0, 0.5 * Math.PI, r, segments);
    let arc_tr_inner = arc(tr, 0, 0.5 * Math.PI, r-thickness, segments);


    let arc_tl = arc(tl, 0.5 * Math.PI, Math.PI, r, segments);
    let arc_tl_inner = arc(tl, 0.5 * Math.PI, Math.PI, r-thickness, segments);

    // 3. Draw corner fans
    function draw_fan(innerPoints, points) {
        for (let i = 0; i < points.length - 1; i++) {
            ui_push(innerPoints[i], points[i], points[i + 1],color);
            ui_push(innerPoints[i], innerPoints[i+1], points[i + 1],color);
        }
    }

    draw_fan(arc_bl_inner, arc_bl);
    draw_fan(arc_br_inner, arc_br);
    draw_fan(arc_tr_inner, arc_tr);
    draw_fan(arc_tl_inner, arc_tl);

    // 4. Draw straight edges as rectangles (2 tris each)
    function draw_strip(p1, p2, p3, p4) {
        ui_push(p1, p2, p3, color);
        ui_push(p1, p3, p4, color);
    }

    // Bottom edge
    draw_strip(arc_bl[arc_bl.length - 1], arc_br[0], arc_br_inner[0], arc_bl_inner[arc_bl_inner.length-1]);
    // Right edge
    draw_strip(arc_br[arc_br.length - 1], arc_tr[0], arc_tr_inner[0], arc_br_inner[arc_br_inner.length-1]);
    // Top edge
    draw_strip(arc_tr[arc_tr.length - 1], arc_tl[0], arc_tl_inner[0], arc_tr_inner[arc_tr_inner.length-1]);
    // Left edge
    draw_strip(arc_tl[arc_tl.length - 1], arc_bl[0], arc_bl_inner[0], arc_tl_inner[arc_tl_inner.length-1]);

    // 5. Draw center rectangle
    //draw_strip(bl, br, tr, tl);
}


/*
	This could be like the selected one!
*/
var selectedColor = vec4(0.9,1,0.6,1.0);
function build_rounded_rectangle_selected(v1, v2, v3, v4, r, segments = 6) {
    function lerp(a, b, t) {
        return [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, -10];
    }

    function arc(center, startAngle, endAngle, radius, steps) {
        const result = [];
        for (let i = 0; i <= steps; ++i) {
            let theta = startAngle + (endAngle - startAngle) * i / steps;
            result.push([
                center[0] + radius * Math.cos(theta),
                center[1] + radius * Math.sin(theta),
                -10
            ]);
        }
        return result;
    }

    // 1. Compute inset corner centers
    let bl = [v1[0] + r, v1[1] + r, -10];
    let br = [v2[0] - r, v2[1] + r, -10];
    let tr = [v3[0] - r, v3[1] - r, -10];
    let tl = [v4[0] + r, v4[1] - r, -10];

    // 2. Generate arcs
    let arc_bl = arc(bl, Math.PI, 1.5 * Math.PI, r, segments);
    let arc_bl_inner = arc(bl, Math.PI, 1.5 * Math.PI, r-0.03, segments);



    let arc_br = arc(br, 1.5 * Math.PI, 2 * Math.PI, r, segments);
    let arc_br_inner = arc(br, 1.5 * Math.PI, 2 * Math.PI, r-0.03, segments);



    let arc_tr = arc(tr, 0, 0.5 * Math.PI, r, segments);
    let arc_tr_inner = arc(tr, 0, 0.5 * Math.PI, r-0.03, segments);


    let arc_tl = arc(tl, 0.5 * Math.PI, Math.PI, r, segments);
    let arc_tl_inner = arc(tl, 0.5 * Math.PI, Math.PI, r-0.03, segments);

    // 3. Draw corner fans
    function draw_fan(innerPoints, points) {
        for (let i = 0; i < points.length - 1; i++) {
            ui_push(innerPoints[i], points[i], points[i + 1],selectedColor);
            ui_push(innerPoints[i], innerPoints[i+1], points[i + 1],selectedColor);
        }
    }

    draw_fan(arc_bl_inner, arc_bl);
    draw_fan(arc_br_inner, arc_br);
    draw_fan(arc_tr_inner, arc_tr);
    draw_fan(arc_tl_inner, arc_tl);

    // 4. Draw straight edges as rectangles (2 tris each)
    function draw_strip(p1, p2, p3, p4) {
        ui_push(p1, p2, p3,selectedColor);
        ui_push(p1, p3, p4,selectedColor);
    }

    // Bottom edge
    //draw_strip(arc_bl[arc_bl.length - 1], arc_br[0], br, bl);
    // Right edge
    //draw_strip(arc_br[arc_br.length - 1], arc_tr[0], tr, br);
    // Top edge
    //draw_strip(arc_tr[arc_tr.length - 1], arc_tl[0], tl, tr);
    // Left edge
    //draw_strip(arc_tl[arc_tl.length - 1], arc_bl[0], bl, tl);

    // 5. Draw center rectangle
    //draw_strip(bl, br, tr, tl);
}

/*
	Map stuff.
*/

/*
	Build squares for the dungeon maps.
	mapSquares[0] = [startPos, length] //White
	mapSquares[1] = [startPos, length] //Grey
	mapSquares[2] = [startPos, length] //Black
*/
var mapSquareVerts=[];
function build_map_squares(){
	const width = 0.625;
	const height = 0.625;
	mapSquareVerts.push([vertices.length,0]);
	build_map_rect(vec2(-width/2,-height/2),vec2(width/2,height/2),vec4(0.9,0.9,0.9,1));
	mapSquareVerts[0][1] = vertices.length-mapSquareVerts[0][0];

	mapSquareVerts.push([vertices.length,0]);
	//draw_rectangle_rounded(vec2(-width/2,-height/2),vec2(width/2,height/2),vec4(0.5,0.5,0.5,0.5));
	build_map_rect(vec2(-width/2,-height/2),vec2(width/2,height/2),vec4(0.4,0.4,0.4,1));
	mapSquareVerts[1][1] = vertices.length-mapSquareVerts[1][0];

	mapSquareVerts.push([vertices.length,0]);
	//draw_rectangle(vec2(-7.75,0.9),vec2(-7,1.65),clearBlack);
	//draw_rectangle_rounded_selected(vec2(-width/2,-height/2),vec2(width/2,height/2),clearBlack);
	build_map_rect(vec2(-width/2,-height/2),vec2(width/2,height/2),vec4(0.1,0.1,0.1,1));
	mapSquareVerts[2][1] = vertices.length-mapSquareVerts[2][0];
}


/*
	This is to draw the surrounding "black" portions that are not
	yet visited, but are visible.
*/
function set_map_surrounding_viewed(i,j){
	//i-1, j
	if(i-1 >= 0 && !visitedGrid[i-1][j] && dungeonGrid[i-1][j]){
		viewedGrid[i-1][j] = true;
	}

	//i+1, j
	if(i+1 < gridSize && !visitedGrid[i+1][j] && dungeonGrid[i+1][j]){
		viewedGrid[i+1][j] = true;
	}

	//i, j-1
	if(j-1 >= 0 && !visitedGrid[i][j-1] && dungeonGrid[i][j-1]){
		viewedGrid[i][j-1] = true;
	}

	//i, j+1
	if(j+1 < gridSize && !visitedGrid[i][j+1] && dungeonGrid[i][j+1]){
		viewedGrid[i][j+1] = true;
	}
}

function draw_map(){

	const height = 0;
	const space = 0.65;
	var startY = 0;
	for(let j = 0; j < dungeonGrid.length; j++){
		var startX = 0;
		for (let i = 0; i < dungeonGrid.length; i++){
			startX += space;
			
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(startX,startY,0))));
			if(dungeonGrid[j][i] == true){
				if(j == currentRoom[0] && i == currentRoom[1]){
					gl.drawArrays(gl.TRIANGLES,mapSquareVerts[0][0],mapSquareVerts[0][1]);
					//gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
					//Draw surrounding unvisited
					set_map_surrounding_viewed(j,i)
				}else{
					if(visitedGrid[j][i]){
						gl.drawArrays(gl.TRIANGLES,mapSquareVerts[1][0],mapSquareVerts[1][1]);
						//gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
						//Draw surrounding unvisited
						//set_map_surrounding_viewed(j,i)
					}
				}
			}
			//gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		}
		startY -= space;
	}
	// Now draw the viewed spaces.
	// viewGrid and !visitedGrid
	startY = 0;
	for(let j = 0; j < dungeonGrid.length; j++){
		var startX = 0;
		for (let i = 0; i < dungeonGrid.length; i++){
			startX += space;
			
			gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(mult(viewMatrix,translate(startX,startY,0))));
			if(dungeonGrid[j][i] == true){
				if(viewedGrid[j][i] && !visitedGrid[j][i]){
					gl.drawArrays(gl.TRIANGLES,mapSquareVerts[2][0],mapSquareVerts[2][1]);	
				}
			
			}
			//gl.drawArrays(gl.TRIANGLES,startDraw[8],endDraw[8]);
		}
		startY -= space;
	}

	
}





/*
	Building methods for map.
*/

function build_map_rect(vec1,vec2,c){
	var v1,v2,v3,v4;
	v1 = vec3(vec1[0],vec1[1],zLay);
	v2 = vec3(vec2[0],vec1[1],zLay);
	v3 = vec3(vec2[0],vec2[1],zLay);
	v4 = vec3(vec1[0],vec2[1],zLay);
	build_colored_quad(v1,v2,v3,v4,0.08,c);
	//build_rounded_rectangle_stroke(v1,v2,v3,v4,0.15,borderColor);
	/*
	const offset=0.0005
	v1 = vec3(vec1[0]-offset,vec1[1]-offset,zLay);
	v2 = vec3(vec2[0]+offset,vec1[1]-offset,zLay);
	v3 = vec3(vec2[0]+offset,vec2[1]+offset,zLay);
	v4 = vec3(vec1[0]-offset,vec2[1]+offset,zLay);


	build_rounded_rectangle_stroke(v1,v2,v3,v4,0.15,borderColorOuter,0.01);
	*/
	zLay-=0.01;
}


function build_colored_quad(v1, v2, v3, v4, r, color=clearBlack, segments = 6) {
    function lerp(a, b, t) {
        return [a[0] * (1 - t) + b[0] * t, a[1] * (1 - t) + b[1] * t, zLay];
    }

    function arc(center, startAngle, endAngle, radius, steps) {
        const result = [];
        for (let i = 0; i <= steps; ++i) {
            let theta = startAngle + (endAngle - startAngle) * i / steps;
            result.push([
                center[0] + radius * Math.cos(theta),
                center[1] + radius * Math.sin(theta),
                zLay
            ]);
        }
        return result;
    }

    let bl = [v1[0] + r, v1[1] + r, zLay];
    let br = [v2[0] - r, v2[1] + r, zLay];
    let tr = [v3[0] - r, v3[1] - r, zLay];
    let tl = [v4[0] + r, v4[1] - r, zLay];

    let arc_bl = arc(bl, Math.PI, 1.5 * Math.PI, r, segments);
    let arc_br = arc(br, 1.5 * Math.PI, 2 * Math.PI, r, segments);
    let arc_tr = arc(tr, 0, 0.5 * Math.PI, r, segments);
    let arc_tl = arc(tl, 0.5 * Math.PI, Math.PI, r, segments);

    function draw_fan(center, points) {
        for (let i = 0; i < points.length - 1; i++) {
            ui_push(center, points[i], points[i + 1], color);
        }
    }

    draw_fan(bl, arc_bl);
    draw_fan(br, arc_br);
    draw_fan(tr, arc_tr);
    draw_fan(tl, arc_tl);

    function draw_strip(p1, p2, p3, p4) {
        ui_push(p1, p2, p3,color);
        ui_push(p1, p3, p4,color);
    }

    // Bottom edge
    draw_strip(arc_bl[arc_bl.length - 1], arc_br[0], br, bl);
    // Right edge
    draw_strip(arc_br[arc_br.length - 1], arc_tr[0], tr, br);
    // Top edge
    draw_strip(arc_tr[arc_tr.length - 1], arc_tl[0], tl, tr);
    // Left edge
    draw_strip(arc_tl[arc_tl.length - 1], arc_bl[0], bl, tl);

    // Center
    draw_strip(bl, br, tr, tl);
}






