






/*

	Menu for the shopkeeper.

	Added July 25th.

*/


let SHOP_ITEMS = [];


function set_available_shop_items(){
	SHOP_ITEMS = [];
	
	// Copper.
	SHOP_ITEMS.push(new CopperBarRecipe());
	SHOP_ITEMS.push(new CopperPickRecipe());
	SHOP_ITEMS.push(new CopperAxeRecipe());
	SHOP_ITEMS.push(new CopperSwordRecipe());

	// Latkin.
	SHOP_ITEMS.push(new LatkinBarRecipe());
	SHOP_ITEMS.push(new LatkinPickRecipe());
	SHOP_ITEMS.push(new LatkinAxeRecipe());
	SHOP_ITEMS.push(new LatkinSwordRecipe());


	// Illsaw.
	SHOP_ITEMS.push(new IllsawBarRecipe());
	SHOP_ITEMS.push(new IllsawPickRecipe());
	SHOP_ITEMS.push(new IllsawAxeRecipe());
	SHOP_ITEMS.push(new IllsawSwordRecipe());


	// Platinum.
	SHOP_ITEMS.push(new PlatinumBarRecipe());
	SHOP_ITEMS.push(new PlatinumPickRecipe());
	SHOP_ITEMS.push(new PlatinumAxeRecipe());
	SHOP_ITEMS.push(new PlatinumSwordRecipe());

	// Lunite.
	SHOP_ITEMS.push(new LuniteBarRecipe());
	SHOP_ITEMS.push(new LunitePickRecipe());
	SHOP_ITEMS.push(new LuniteAxeRecipe());
	SHOP_ITEMS.push(new LuniteSwordRecipe());


	// Daytum.
	SHOP_ITEMS.push(new DaytumBarRecipe());
	SHOP_ITEMS.push(new DaytumPickRecipe());
	SHOP_ITEMS.push(new DaytumAxeRecipe());
	SHOP_ITEMS.push(new DaytumSwordRecipe());

	// Non-default items.
	SHOP_ITEMS.push(new BrickBlockRecipe());
	SHOP_ITEMS.push(new CopperBrickRecipe());
	
	// Misc.
	SHOP_ITEMS.push(new WoodBlockRecipe());
	SHOP_ITEMS.push(new DoorRecipe());
	SHOP_ITEMS.push(new WorkBenchRecipe());
	SHOP_ITEMS.push(new ArrowRecipe());
	SHOP_ITEMS.push(new ChestRecipe());
	SHOP_ITEMS.push(new WoodenBowRecipe());

	SHOP_ITEMS.push(new ComDirtRecipe());
	SHOP_ITEMS.push(new ComSandRecipe());
	SHOP_ITEMS.push(new ClayBrickRecipe());

}

function draw_shop_menu(){

	var menuTranslate=-9;
	var zVal=menuTranslate;

	//draw_c_text_fontsize(2.2,7.1,'Chest',22);
	draw_c_text(2.2,6.685,'Inventory contents');
	draw_c_text(8.2,6.685,'Shop contents');


	/*
		Drawing the amount of gold and silver the player has.
	*/
	let goldStart = 5.5;
	//Draw gold and silver (silver and goooooold)
	draw_c_text_med(goldStart,2.15,('Gold:'));
	draw_c_text_med_right(goldStart+0.8,2.15,player.gold);
	draw_c_text_med_right(goldStart+0.8,2.15,player.gold);

	let silverStart = goldStart + 1.04;
	draw_c_text_med(silverStart,2.15,('Silver:'));
	draw_c_text_med_right(silverStart+1,2.15,player.silver);
	draw_c_text_med_right(silverStart+1,2.15,player.silver);


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
	tabListClick(true);

	arrowButtonsDouble(move_left_scroll_list_up,move_left_scroll_list_down,move_right_scroll_list_up,move_right_scroll_list_down);


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

	// Left side.
	contentListLeft = [];
	for(let i = 0; i < blockListInventory.length; i++){
		let entry = new InventoryListEntry(blockListInventory[i]);
		
		function onSell(entry){
			let objToSell = entry.obj;
			player.removeFromInventory(objToSell);
			player.increaseSilver(objToSell.sellPrice);
			sound_BuySell();
		}
		function drawSell(entry){return true;}

		entry.addLeftButton("Sell",onSell,drawSell)

		function drawTextFunc(entry, i){
			let objToSell = entry.obj;
			let sellPrice = objToSell.sellPrice;

			let xPosition = textX+0.04;
			//let yPosition = start+0.75+difference*(3-i)-0.4;
			let yPosition = start+0.75+difference*(3-i)-0.5;
			if(sellPrice < 100)
				draw_c_text_colored(xPosition,yPosition,"Sell for "+sellPrice+" Silver.",'#AAA',10);
			else
				draw_c_text_colored(xPosition,yPosition,"Sell for "+Math.floor(sellPrice/100) + " Gold and "+ (sellPrice - Math.floor(sellPrice/100)*100) +" Silver.",'#AAA',10);
		}

		entry.addText(drawTextFunc);
		contentListLeft.push(entry);
	}

	// Right side.
	contentListRight = [];
	for(let i = 0; i < SHOP_ITEMS.length; i++){
		let entry = new InventoryListEntry(SHOP_ITEMS[i], true);
		entry.drawQuantity = false;
		function onBuy(entry){
			let objToBuy = entry.obj;
			player.addToInventory(objToBuy);
			player.decreaseSilver(objToBuy.buyPrice);
			sound_BuySell();
		}

		function drawBuy(entry){
			let objToBuy = entry.obj;
			if(player.getTotalSilver() >= objToBuy.buyPrice){
				return true;
			}
			return false;
		}


		function drawTextFunc(entry, i){
			let objToSell = entry.obj;
			let sellPrice = objToSell.buyPrice;

			let xPosition = textX+0.04+6;
			let yPosition = start+0.75+difference*(3-i)-0.5;
			if(sellPrice < 100)
				draw_c_text_colored(xPosition,yPosition,"Buy for "+sellPrice+" Silver.",'#AAA',10);
			else
				draw_c_text_colored(xPosition,yPosition,"Buy for "+Math.floor(sellPrice/100) + " Gold and "+ (sellPrice - Math.floor(sellPrice/100)*100) +" Silver.",'#AAA',10);
		}

		entry.addText(drawTextFunc);

		entry.addRightButton("Buy",onBuy,drawBuy)
		contentListRight.push(entry)
	}

}