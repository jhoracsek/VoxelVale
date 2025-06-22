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
	draw_c_text(9.7,6.685,'Required Materials:');

	draw_craftable_list()
	//gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
	//Scroll bar
	if(tabListLength > 4){
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_scroll_bar();
	}

	draw_inventory_cursor();
	
	reset_mv();	
	


	draw_interface_crafting();
}

var craftListOffset = 0;
//Add something to here if you want it to be a basic item the player can craft at any given time.
//I plan on making specific objects that will be used for more intricate crafting (I wonder where I got that idea from?)
var craftableList;
var itemToCraft=-1;
function draw_craftable_list(){
	click_in_bounds(9.2125,6.675,9.485,6.9875,function(){if(craftListOffset>0){craftListOffset--;itemToCraft++;}});
	click_in_bounds(9.2125,2.25,9.485,2.01,function(){craftListOffset++;itemToCraft--;});

	click_in_bounds(2.1125,6.5875,9.2,5.6,function(){itemToCraft=0; startPos=0;},function(){hoveredEntry=0});
	click_in_bounds(2.1125,6.5875-difference,9.2,5.6-difference,function(){itemToCraft=1; startPos=0;},function(){hoveredEntry=1});
	click_in_bounds(2.1125,6.5875-difference*2,9.2,5.6-difference*2,function(){itemToCraft=2; startPos=0;},function(){hoveredEntry=2});
	click_in_bounds(2.1125,6.5875-difference*3,9.2,5.6-difference*3,function(){itemToCraft=3; startPos=0;},function(){hoveredEntry=3});

	craftableListLength = craftableList.length;
	for(var i = 0; i < Math.min(craftableListLength-craftListOffset,4); i++){
		var mv = translate(0,start+difference*(3-i),0);
		set_mv_ui(mv);
		draw_c_text(textX,start+difference*(3-i)+0.65,craftableList[i+craftListOffset].name);
		draw_c_text_small(textX+0.05,start+difference*(3-i)+0.45,craftableList[i+craftListOffset].desc);
		draw_c_text_med(textX+4.65,start+0.12+difference*(3-i),('QUANTITY:',player.inventory.getQuantity(craftableList[i+craftListOffset])));
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
		draw_craftable_item(craftableList[i+craftListOffset],mv);
	}
	reset_mv();
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

function draw_2D_square(mv,index){
	//mv = mult(mv,translate(2.25,0.15,zLay-0.3));
	set_mv_ui(mv);
	gl.drawArrays(gl.TRIANGLES,squareSrt[index],squareEnd[index]);
	reset_mv();
}

function draw_craftable_item(object,mv){
	if(object.typeOfObj=='ITEM'){
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
	set_mv_ui(mv);
	gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
}

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
	craftableList=[
	new WoodBlock(),
	new StoneBlock()
	];
	for(var i = 0; i < menuColours.length; i++){
		build_2D_square(menuColours[i],i);
	}
}

var startPos=0;
function draw_recipe_list(object){
	var bigList=false;
	if(object.isCraftable()){
		draw_c_text_med(9.75,2.3,'CRAFT');
		draw_2D_square(mult(translate(9.65,2.15,-9.1),scale4(0.75,0.4,1)),DARKEST_GREY);
		click_in_bounds(9.65,2.15,9.65+0.75,2.15+0.4,function(){object.craftObject()});
	}else{
		draw_c_text_med(9.75,2.3,'CANNOT CRAFT');
	}
	draw_c_text_small(12.75,2.3,'QUANTITY:');
	draw_c_text_small(12.75+(11.4-10.65),2.3,player.getObjectQuantity(object));
	//draw_2D_square(mult(translate(9.65,2.2,-9.1),scale4(0.75,0.3,1)),DARKEST_GREY);
	var requiredItems=object.getRecipe();
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
		draw_c_text_small(10.65,5.9-(i-startPos),'REQUIRED:');
		draw_c_text_small(11.4,5.9-(i-startPos),requiredItems[i][1]);
		//MAKE RED IF TOO LOW!
		draw_c_text_small(12.65,5.9-(i-startPos),'QUANTITY:');
		draw_c_text_small(12.65+(11.4-10.65),5.9-(i-startPos),player.getObjectQuantity(requiredItems[i][0]));
	}

}

var xSpin = 0;
var controlledXSpin=0;
var controlledYSpin=0;
function draw_recipe_list2(object){
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
		}else{
			instanceMat = mult(instanceMat, scale4(1.5,1.5,0.01));
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
	set_mv_ui(instanceMat);
	gl.drawArrays(gl.TRIANGLES,object.index,object.numberOfVerts);
}