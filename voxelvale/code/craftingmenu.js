//BUILDING THE CRAFTING MENU
/*
Using draw_2D_square(mv,index)
	mv is obviously just the translation and scaling, so that's pretty easy,
	but realize that you must translate the zAxis to around -9, I'm not sure
	where exactly is best, but I plan to update that anyway and hopefully
	implement a more efficient system for the UI.
	For the index, it's essentially just what colour you want to use. 
	The colours are,
		WHITE = 0;
		BLACK = 1;
		DARK_GREY = 2;
		GREY = 3;
		LIGHT_GREY = 4;
		DARKER_GREY = 5;
		DARKEST_GREY = 6;
	Pretty stupid names I know, but that's how I did it :/
*/








function draw_crafting_menu(){

	var menuTranslate=-9;
	var zVal=menuTranslate;

	draw_c_text(2.2,6.685,'Recipes:');
	draw_c_text(9.7,6.685,'Required materials:');

	switch(currentStation){
		case IN_NONE:
			draw_c_text_fontsize(2.2,7.1,'Crafting menu',22);
			draw_craftable_list();
			break;
		case IN_WORKBENCH:
			draw_c_text_fontsize(2.2,7.1,'Workbench',22);
			draw_craftable_list();
			break;
	}
	

	//Scroll bar
	
	if(craftableList.length > 4){
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_craft_scroll_bar();
	}
	
	draw_inventory_cursor();
	
	reset_mv();	

	draw_interface_crafting();
}



var craftListOffset = 0;
var craftableList;
var itemToCraft=-1;


//craftableList is essentially the tabList
function draw_craftable_list(){
	//console.log('Information:', craftListOffset, itemToCraft);
	//click_in_bounds(9.2125,6.675,9.485,6.9875,function(){if(craftListOffset>0){craftListOffset--;itemToCraft++;}});
	//click_in_bounds(9.2125,2.25,9.485,2.01,function(){craftListOffset++;itemToCraft--;});
	click_in_bounds(9.2125,6.675,9.485,6.9875,craft_scroll_list_up);
	click_in_bounds(9.2125,2.25,9.485,2.01,craft_scroll_list_down);

	click_in_bounds(2.1125,6.5875,9.2,5.6,function(){if(craftableList[0+craftListOffset]!=null){itemToCraft=0; startPos=0;}},function(){hoveredEntry=0});
	click_in_bounds(2.1125,6.5875-difference,9.2,5.6-difference,function(){if(craftableList[1+craftListOffset]!=null){itemToCraft=1; startPos=0;}},function(){hoveredEntry=1});
	click_in_bounds(2.1125,6.5875-difference*2,9.2,5.6-difference*2,function(){if(craftableList[2+craftListOffset]!=null){itemToCraft=2; startPos=0;}},function(){hoveredEntry=2});
	click_in_bounds(2.1125,6.5875-difference*3,9.2,5.6-difference*3,function(){if(craftableList[3+craftListOffset]!=null){itemToCraft=3; startPos=0;}},function(){hoveredEntry=3});


	/*
	click_in_bounds(2.1125,6.5875,9.2,5.6,function(){if(tabList[0+scrollOffset]!=null) active=0;}, function(){hoveredEntry=0});
	click_in_bounds(2.1125,6.5875-difference,9.2,5.6-difference,function(){if(tabList[1+scrollOffset]!=null) active=1; }, function(){hoveredEntry=1});
	click_in_bounds(2.1125,6.5875-difference*2,9.2,5.6-difference*2,function(){if(tabList[2+scrollOffset]!=null) active=2;}, function(){hoveredEntry=2});
	click_in_bounds(2.1125,6.5875-difference*3,9.2,5.6-difference*3,function(){if(tabList[3+scrollOffset]!=null) active=3;}, function(){hoveredEntry=3});

	*/

	let craftableListLength = craftableList.length;
	for(var i = 0; i < Math.min(craftableListLength-craftListOffset,4); i++){
		var mv = translate(0,start+difference*(3-i),0);
		set_mv_ui(mv);
		draw_c_text(textX,start+difference*(3-i)+0.65,craftableList[i+craftListOffset].name);
		draw_c_text_small(textX+0.05,start+difference*(3-i)+0.45,craftableList[i+craftListOffset].desc);
		//draw_c_text_med(textX+4.65,start+0.12+difference*(3-i),('Quantity:'+player.inventory.getQuantity(craftableList[i+craftListOffset]).toString()));
		if(itemToCraft== i){
			gl.drawArrays(gl.TRIANGLES,startDraw[3],endDraw[3]);
			draw_recipe_list(craftableList[i+craftListOffset]);
		}
		else if(hoveredEntry==i){
			//HOVERED!
			gl.drawArrays(gl.TRIANGLES,hoverEntryVertices[0],hoverEntryVertices[1]);

		}
		else{
			gl.drawArrays(gl.TRIANGLES,startDraw[4],endDraw[4]);
		}
		//draw_craftable_item(craftableList[i+craftListOffset].object,mv);
		draw_left_panel_object(craftableList[i+craftListOffset],mv);
	}
	reset_mv();
}


function draw_2D_square(mv,index){
	//mv = mult(mv,translate(2.25,0.15,zLay-0.3));
	set_mv_ui(mv);
	gl.drawArrays(gl.TRIANGLES,squareSrt[index],squareEnd[index]);
	reset_mv();
}

/*
	Draws items in the 'Required materials' panel.
*/
function draw_craftable_item(object,mv){
	//if(object.typeOfObj=='ITEM' || object.typeOfObj=='NON_ACTIONABLE_ITEM'){
	if(object.typeOfObj=='ITEM'){
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
}

/*
	Draws objects on the left panel.
*/
function draw_left_panel_object(recipe, mv){
	//if(recipe.object.typeOfObj=='ITEM' || recipe.object.typeOfObj=='NON_ACTIONABLE_ITEM'){
	if(recipe.object.typeOfObj=='ITEM'){
		mv = mult(mv,translate(2.25,0.15,zLay-0.3));
		mv = mult(mv,scale4(0.35,0.35,0.001))
		mv = mult(mv,rotateZ(-35));
	//else if a block, or maybe a switch? 
	}else{
		mv = mult(mv,translate(2.5,0.15,zLay-0.3));
		mv = mult(mv,scale4(0.5,0.45,0.001))
		mv = mult(mv,rotateZ(45));
		mv = mult(mv,rotateX(45));
		mv = mult(mv,rotateY(55));
	}
	if(fixedView)
		recipe.drawSmall(mult(viewMatrixUI, mv));
	else
		recipe.drawSmall(mult(viewMatrix, mv));

}

/*
	Draws all objects in 'Required materials:' panel on the right.
*/
var startPos=0;
function draw_recipe_list(recipe){
	let object = recipe.object;
	var bigList=false;
	if(recipe.isCraftable()){
		draw_c_text_med(9.75,2.3,'Craft');
		draw_2D_square(mult(translate(9.65,2.15,-9.1),scale4(0.75,0.4,1)),GREY);
		click_in_bounds(9.65,2.15,9.65+0.75,2.15+0.4,function(){recipe.craftObject()});
	}else{
		draw_c_text_med(9.75,2.3,'Cannot craft');
	}
	draw_c_text_small(12.75,2.3,'Quantity:');
	draw_c_text_small(12.75+(11.4-10.65),2.3,player.getObjectQuantity(object));
	//draw_2D_square(mult(translate(9.65,2.2,-9.1),scale4(0.75,0.3,1)),DARKEST_GREY);
	var requiredItems=recipe.getRecipe();
	if (requiredItems==null)
		return;
	if(requiredItems.length>4)
		bigList=true;
	if(bigList){
		draw_2D_square(mult(translate(13.75,2.7,-9.1),scale4(0.15,3.9,1)),DARKER_GREY);
		draw_2D_square(mult(translate(13.75,2.7,-9.1),scale4(0.15,0.15,1)),BLACK);
		draw_2D_square(mult(translate(13.75,6.45,-9.1),scale4(0.15,0.15,1)),BLACK);
		click_in_bounds(13.75,6.45,13.9,6.6,function(){if(startPos>0)startPos--;});
		click_in_bounds(13.75,2.7,13.9,2.85,function(){if(startPos+5<=requiredItems.length)startPos++;});
		//click_in_bounds(3.6,7.375,4.9,7,function(){selectedTab = 'TOOL';active=-1;scrollOffset=0; activeTab = 1;});
		//draw_c_line(13.75,6.3,13.75,2.4);
	}
	//Make this a different colour if you cannot craft
	for(var i = startPos; i < Math.min((requiredItems.length+startPos),Math.min(requiredItems.length,(4+startPos))); i++){
		//Make this red if the quantity is too small!
		if(bigList)
			draw_2D_square(mult(translate(9.6,5.69-(i-startPos),-9),scale4(4.15,0.91,1)),DARKEST_GREY);
		else
			draw_2D_square(mult(translate(9.6,5.69-(i-startPos),-9),scale4(4.3,0.91,1)),DARKEST_GREY);
		//draw_2D_square(mult(translate(9.6,5.6-i,-9),scale4(4.3,1,1)),DARKEST_GREY);
		draw_2D_square(mult(translate(9.74,5.725-(i-startPos),-9),scale4(0.84,0.82,1)),BLACK);
		draw_craftable_item(requiredItems[i][0],translate(7.57,5.625-(i-startPos),0));
		draw_c_text(10.65,6.1-(i-startPos),requiredItems[i][0].name);
		draw_c_text_small(10.65,5.9-(i-startPos),'Required:');
		draw_c_text_small(11.4,5.9-(i-startPos),requiredItems[i][1]);
		//MAKE RED IF TOO LOW!
		draw_c_text_small(12.65,5.9-(i-startPos),'Quantity:');
		draw_c_text_small(12.65+(11.4-10.65),5.9-(i-startPos),player.getObjectQuantity(requiredItems[i][0]));
	}
}

/*
	Scrollbar for crafting menu.
*/

function draw_craft_scroll_bar(){

	var yOffset = 4.5;//5.56+4.5;
	var scale = get_craft_scroll_bar_length();
	var mat = mult(translate(0,yOffset,0),mult(scale4(1,scale,1),translate(0,-yOffset,0)));
	
	let top = 2.2 - 2.2*scale;

	var times = get_max_craft_scroll_length();
	var increment = -2*top/times;

	if(fixedView){
		set_mv_ui(mult(translate(0,top+increment*craftListOffset,0),mat));
	}else{
		set_mv(mult(translate(0,top+increment*craftListOffset,0),mat));
	}
	gl.drawArrays(gl.TRIANGLES,scrollBarVertices[0],scrollBarVertices[1]);
}

function get_max_craft_scroll_length(){
	return Math.max(craftableList.length-4,0);
}

function get_craft_scroll_bar_length(){
	var val = get_max_craft_scroll_length();

	if(val == 0)
		return 1;
	else{
		return 0.9**val;
	}
}


function craft_scroll_list_down(){
	if(craftListOffset<get_max_craft_scroll_length()){craftListOffset++;itemToCraft--;};
}

function craft_scroll_list_up(){
	if(craftListOffset>0){craftListOffset--;itemToCraft++;}
}





/*
	Building functions.
*/
function build_craft_list(){
	var menuColours = [
		vec4(1,1,1,1),
		vec4(0,0,0,1),
		vec4(0.25,0.25,0.25,1),
		vec4(0.5,0.5,0.5,1),
		vec4(0.75,0.75,0.75,1),
		vec4(0.1,0.1,0.1,1),
		vec4(0.05,0.05,0.05,1)
	];
	craftableList=getEligibleRecipes();
	for(var i = 0; i < menuColours.length; i++){
		build_2D_square(menuColours[i],i);
	}
}


var squareSrt=[];
var squareEnd=[];
function build_2D_square(c,index){
	squareSrt[index] = vertices.length;
	var v1,v2,v3,v4;
	v1=vec3(0.5,0.5,0);
	v2=vec3(-0.5,0.5,0);
	v3=vec3(-0.5,-0.5,0);
	v4=vec3(0.5,-0.5,0);
	//It's easier in terms of scaling if the vectors are positioned as such
	v1=vec3(1,1,0);
	v2=vec3(0,1,0);
	v3=vec3(0,0,0);
	v4=vec3(1,0,0);
	ui_push(v1,v2,v3,c);
	ui_push(v3,v4,v1,c);
	squareEnd[index] = vertices.length-squareSrt[index];
}


