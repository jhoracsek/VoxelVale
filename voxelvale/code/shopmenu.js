






/*

	Menu for the shopkeeper.

	Added July 25th.

*/


let SHOP_ITEMS = [];


function set_available_shop_items(){
	SHOP_ITEMS = [];
	SHOP_ITEMS.push(new CopperBarRecipe());
	SHOP_ITEMS.push(new LatkinBarRecipe());
	SHOP_ITEMS.push(new IllsawBarRecipe());
	SHOP_ITEMS.push(new PlatinumBarRecipe());
	SHOP_ITEMS.push(new LuniteBarRecipe());
	SHOP_ITEMS.push(new DaytumBarRecipe());


	SHOP_ITEMS.push(new CopperPickRecipe());
	SHOP_ITEMS.push(new LatkinPickRecipe());
	SHOP_ITEMS.push(new IllsawPickRecipe());
	SHOP_ITEMS.push(new PlatinumPickRecipe());
	SHOP_ITEMS.push(new LunitePickRecipe());
	SHOP_ITEMS.push(new DaytumPickRecipe());



	SHOP_ITEMS.push(new CopperAxeRecipe());
	SHOP_ITEMS.push(new LatkinAxeRecipe());
	SHOP_ITEMS.push(new IllsawAxeRecipe());
	SHOP_ITEMS.push(new PlatinumAxeRecipe());
	SHOP_ITEMS.push(new LuniteAxeRecipe());
	SHOP_ITEMS.push(new DaytumAxeRecipe());


	SHOP_ITEMS.push(new CopperSwordRecipe());
	SHOP_ITEMS.push(new LatkinSwordRecipe());
	SHOP_ITEMS.push(new IllsawSwordRecipe());
	SHOP_ITEMS.push(new PlatinumSwordRecipe());
	SHOP_ITEMS.push(new LuniteSwordRecipe());
	SHOP_ITEMS.push(new DaytumSwordRecipe());

}

function draw_shop_menu(){

	var menuTranslate=-9;
	var zVal=menuTranslate;

	//draw_c_text_fontsize(2.2,7.1,'Chest',22);
	draw_c_text(2.2,6.685,'Inventory contents');
	draw_c_text(8.2,6.685,'Shop contents');


	draw_shop_list();
	
	draw_inventory_cursor();

	/*
		Top tab bar from inventory
	*/

	
	reset_mv();
	draw_all_tabs();
	
	reset_mv();	
	draw_double_sided_interface();
}


//contentListLeft
//contentListRight

function draw_shop_list(){
	tabListClick();
	build_shop_list();
	leftScrollOffset = Math.min(leftScrollOffset, get_scroll_bar_left_length_limit());
	rightScrollOffset = Math.min(rightScrollOffset, get_scroll_bar_right_length_limit());

	
	// Draw left side.
	let listLen = contentListLeft.length;
	for(var i = leftScrollOffset; i < Math.min(listLen,4+leftScrollOffset); i++){
		contentListLeft[i].draw(i-leftScrollOffset);
	}

	if(listLen > 4){
		if(fixedView){
			set_mv_ui(translate(-1.5,0,0));
		}else{
			set_mv(translate(-1.5,0,0));
		}
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_scroll_bar_arb_left();
	}

	
	// Draw right side.
	listLen = contentListRight.length;
	for(var i = rightScrollOffset; i < Math.min(listLen,4+rightScrollOffset); i++){
		contentListRight[i].draw(i-rightScrollOffset);
	}

	if(listLen > 4){
		if(fixedView){
			set_mv_ui(translate(-1,0,0));
		}else{
			set_mv(translate(4.5,0,0));
		}
		gl.drawArrays(gl.TRIANGLES,startDraw[5],endDraw[5]);
		draw_scroll_bar_arb_right();
	}
	
	reset_mv();
}


function build_shop_list(){
	// Left side	
	let blockListInventory = [];
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
	contentListLeft = [];
	for(let i = 0; i < blockListInventory.length; i++){
		contentListLeft.push(new InventoryListEntry(blockListInventory[i]));
	}

	// Right side
	//SHOP_ITEMS
	contentListRight = [];
	for(let i = 0; i < SHOP_ITEMS.length; i++){
		contentListRight.push(new InventoryListEntry(SHOP_ITEMS[i], true ))
	}

}