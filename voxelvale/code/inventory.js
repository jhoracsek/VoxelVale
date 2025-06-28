/*
	Colours
*/
const WHITE = 0;
const BLACK = 1;
const DARK_GREY = 2;
const GREY = 3;
const LIGHT_GREY = 4;
const DARKER_GREY = 5;
const DARKEST_GREY = 6;
const CLEAR_BLACK = 7;
const ACTIVE_BORDER_COLOR = 8;
const CLEAR = 9;
const TESTRED = 10;

var UI_COLOURS = [
	vec4(1,1,1,1),
	vec4(0,0,0,1),
	vec4(0.25,0.25,0.25,1),
	vec4(0.5,0.5,0.5,1),
	vec4(0.75,0.75,0.75,1),
	vec4(0.1,0.1,0.1,1),
	vec4(0.05,0.05,0.05,1),
	vec4(0.1,0.1,0.1, 0.1),
	vec4(0.5,0.55,0.5, 1),
	vec4(0,0,0,0),
	vec4(1,0,0,1)
];


//Should change to interfaceElements or something more specific!
var interfaceBackgrounds = [];
var craftingElements = [];
var bottomBarElements = [];
/*
	Add elements to the interface as defined in "uifunctions.js".

	This is what our coordinate system looks like here:
	(0,9)
		  /\
		  |
		  |
	(0,0) |------->(16,0)


	TRACE OVER CURSOR WITH BLACK LINES!!!
*/
const centerCoordinates = get_draw_center();

function saveWorldButton(){
	let savePopup = new Popup(6.5,2.25);

	let push = 0.26;
	let pushUp = 0.35;
	savePopup.addElement(new InterfaceCanvasButton(5.5+push,3.25+pushUp, 7.5+push,3.75+pushUp,function(){savePopup.kill()},"Close"));
	savePopup.addElement(new InterfaceCanvasButton(5.5+2.5+push,3.25+pushUp, 7.5+2.5+push,3.75+pushUp,saveWorld,"Save"));

	savePopup.addElement(new InterfaceText(centerCoordinates[0], centerCoordinates[1]+0.5, "Save world to the cloud?", '18', false));
	savePopup.addElement(new InterfaceText(centerCoordinates[0], centerCoordinates[1]+0.1, "Note, this will overwrite your existing save!", '18', false));



	pQueue.enqueue(savePopup);
}

function loadWorldButton(){
	let loadPopup = new Popup(6.5,2.25);

	let push = 0.26;
	let pushUp = 0.35;
	loadPopup.addElement(new InterfaceCanvasButton(5.5+push,3.25+pushUp, 7.5+push,3.75+pushUp,function(){loadPopup.kill()},"Close"));
	loadPopup.addElement(new InterfaceCanvasButton(5.5+2.5+push,3.25+pushUp, 7.5+2.5+push,3.75+pushUp,loadWorld,"Load"));

	loadPopup.addElement(new InterfaceText(centerCoordinates[0], centerCoordinates[1]+0.5, "Load world from the cloud?", '18', false));
	loadPopup.addElement(new InterfaceText(centerCoordinates[0], centerCoordinates[1]+0.1, "Note, this will overwrite the current world!", '18', false));


	pQueue.enqueue(loadPopup);
}

/*
	This is the bottom bar that stays for all inventories.
*/
function add_interface_bottom_bar(){
	let squish = 0.125
	let buttonWidth = 2.5;
	let buttonSpace = 3;
	var inventoryButton = new InterfaceHeldButton(2.25, 1.25+squish, 2.25+buttonWidth, 2-squish,DARK_GREY,function(){currentMenu='INVENTORY';},"Inventory",true);
	bottomBarElements.push(inventoryButton);

	var craftingButton = new InterfaceHeldButton(2.25+buttonSpace, 1.25+squish, (2.25+buttonWidth)+buttonSpace, 2-squish,DARK_GREY,function(){currentMenu='CRAFTING';},"Crafting");
	bottomBarElements.push(craftingButton);

	var saveButton = new InterfaceButton(2.25+buttonSpace*2, 1.25+squish, (2.25+buttonWidth)+buttonSpace*2, 2-squish,DARK_GREY,saveWorldButton,"Save World");
	bottomBarElements.push(saveButton);

	var loadButton = new InterfaceButton(2.25+buttonSpace*3, 1.25+squish, (2.25+buttonWidth)+buttonSpace*3, 2-squish,DARK_GREY,loadWorldButton,"Load World");
	bottomBarElements.push(loadButton);

	/*

		Music play bar.

	*/
	var background = new InterfaceBackground(3,0.5,13,1,BLACK);
	bottomBarElements.push(background);	

	var songInfo = new InterfaceText(3.25,0.5,3.25,1,currentTrackInfo,'12',true,getCurrentTrackInfo);
	bottomBarElements.push(songInfo);
	var playButton = new InterfaceButton(10.8, 0.60, 11.8, 0.90,DARK_GREY,resumeMusic,"Play",'12',function(){return !musicPlaying});
	bottomBarElements.push(playButton);
	var pauseButton = new InterfaceButton(10.8, 0.60, 11.8, 0.90,DARK_GREY,pauseMusic,"Pause",'12',function(){return (musicPlaying&&!playButton.imDrawn)});
	bottomBarElements.push(pauseButton);

	var skipButton = new InterfaceButton(11.9, 0.60, 12.9, 0.90,DARK_GREY,skipMusic,"Skip",'12');
	bottomBarElements.push(skipButton);

	/*
		Volume sliders
	*/
	let sliderSize = 0.25;
	let sliderPosition = 11;
	let sliderY = 0.115;
	var sliderButton = new InterfaceVolumeSlider(sliderPosition, sliderY, sliderPosition+sliderSize, sliderY+sliderSize,true);
	var sliderBackground = new InterfaceBackground(sliderPosition-1,sliderY+0.05,sliderPosition+1.25,sliderY+sliderSize-0.05,BLACK);
	var sliderText = new InterfaceText(sliderPosition-1.7,sliderY+sliderSize/2-0.01,sliderPosition-1.7,sliderY+sliderSize/2-0.01,'Music Volume:','12');
	
	
	bottomBarElements.push(sliderBackground);
	bottomBarElements.push(sliderButton);
	bottomBarElements.push(sliderText);

	sliderPosition = 6;
	sliderButton = new InterfaceVolumeSlider(sliderPosition, sliderY, sliderPosition+sliderSize, sliderY+sliderSize,false);
	sliderBackground = new InterfaceBackground(sliderPosition-1,sliderY+0.05,sliderPosition+1.25,sliderY+sliderSize-0.05,BLACK);
	sliderText = new InterfaceText(sliderPosition-1.7,sliderY+sliderSize/2-0.01,sliderPosition-1.7,sliderY+sliderSize/2-0.01,'Sound Volume:','12');

	bottomBarElements.push(sliderBackground);
	bottomBarElements.push(sliderButton);
	bottomBarElements.push(sliderText);

	

}

function add_interface_elements(){

	/*
		Add button to hold item.
		new InterfaceButton(10,2, 13.5,2.5,DARK_GREY,on_click_hold,"Hold",draw_hold_condition);
	*/
	var holdObjButton = new InterfaceButton(10.25,2.1, 11.5,2.4,DARK_GREY,on_click_hold,"Hold",'14',draw_hold_condition);
	interfaceBackgrounds.push(holdObjButton);

	var dropObjButton = new InterfaceButton(12,2.1, 13.25,2.4,DARK_GREY,on_click_drop,"Drop",'14',draw_drop_condition);
	interfaceBackgrounds.push(dropObjButton);

	//left,right,top,bottom
	//var background = new InterfaceBackground(2,1,14,8,BLACK);
	var background = new InterfaceBackground(2,1.25,14,7.75,BLACK);
	
	var leftMidSection = new InterfaceBackground(2,2,9.5,7,DARK_GREY,false,false,false,true);
	var rightBlockBackground = new InterfaceBackground(10,2.5,13.5,6.5,BLACK)
	
	interfaceBackgrounds.push(background);
	interfaceBackgrounds.push(leftMidSection);
	interfaceBackgrounds.push(rightBlockBackground);

	/*
		Right midsection.
		(This is done to cover the rotating block on the right.)
	*/
	var rightMidLEFT = new InterfaceForeground(9.5,2,10,7,DARKEST_GREY,true,false,true,true);
	var rightMidRIGHT = new InterfaceForeground(13.5,2,14,7,DARKEST_GREY,false,false,true,true);
	var rightMidTOP = new InterfaceForeground(10,6.5,13.5,7,DARKEST_GREY,false,false,true,false);
	var rightMidBOTTOM = new InterfaceForeground(10,2,13.5,2.5,DARKEST_GREY,false,false,false,true);

	interfaceBackgrounds.push(rightMidLEFT);
	interfaceBackgrounds.push(rightMidRIGHT);
	interfaceBackgrounds.push(rightMidTOP);
	interfaceBackgrounds.push(rightMidBOTTOM);

}


function add_crafting_interface_elements(){
	var background = new InterfaceBackground(2,1.25,14,7.75,BLACK);
	var leftMidSection = new InterfaceBackground(2,2,9.5,7,DARK_GREY,false,false,false,true);
	var rightMidSection = new InterfaceBackground(9.5,2,14,7,DARK_GREY,false,false,false,true);
	var rightBoxUpper = new InterfaceBackground(9.6, 2.7, 13.9, 6.6, GREY);
	var rightBoxLower = new InterfaceBackground(9.6, 2.1, 13.9, 2.6, GREY);

	craftingElements.push(background);
	craftingElements.push(leftMidSection);
	craftingElements.push(rightMidSection);
	craftingElements.push(rightBoxUpper);
	craftingElements.push(rightBoxLower);
}