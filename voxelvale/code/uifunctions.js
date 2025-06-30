/*
	New class for UI stuff.

	Things will be a little bit more streamlined.

	Eventually plan to completely work "UI.js".

	June 8th 2025.
*/


/*
	Functions that draw UI elements, regardless of if we are in fixed view or not.

	This is our typical coordinate system:
		  		(0,4.5)
		  		 /\
		  		 |
                 |
	(-8,0) <---(0,0)---> (8,0)
		  		 |
		  		 |
		  		 \/
		  	   (0,-4.5)

	This is what our coordinate system looks like here:
	(0,9)
		  /\
		  |
		  |
	(0,0) |------->(16,0)

*/

const SMALLEST_Z_VALUE = -0.999;

var interface_matrix;

const CANVAS_SIZE_X = 16;
const CANVAS_SIZE_Y = 9;

/*
	All interface (or at least most) elements should extend this class.
*/
class InterfaceElement{
	constructor(X1,Y1,X2,Y2,Z,colorNum,left,right,top,bottom){
		this.x1 = X1;
		this.x2 = X2;
		this.y1 = Y1;
		this.y2 = Y2;

		this.instanceMat = mult( translate(X1,Y1,1+Z), scale4(X2-X1,Y2-Y1,1));
		this.instanceMat = mult(interface_matrix, this.instanceMat);

		this.colorNum = colorNum;

		this.left = left;
		this.right = right;
		this.top = top;
		this.bottom = bottom;
	}

	draw(){
		//Draw border
		draw_box_border(this.x1,this.y1,this.x2,this.y2,this.left, this.right, this.top, this.bottom);

		//Draw background
		if(this.colorNum == CLEAR) return;
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(this.instanceMat) );
		gl.drawArrays(gl.TRIANGLES,elementVertices[this.colorNum][0],elementVertices[this.colorNum][1]);
	}
}

/*
	Movable interface element.
	Can move when mouse is held.
	Drawn as a text-canvas element.

	Needs X and Y bounds
*/
class InterfaceVolumeSlider{
	constructor(X1,Y1,X2,Y2,music,c1 = '#CCC', c2 = '#555'){
		this.x1 = X1;
		this.x2 = X2;
		this.y1 = Y1;
		this.y2 = Y2;

		this.boundX = [this.x1-1, this.x1+1];
		this.boundY = [this.y1,this.y1];

		this.width = Math.abs(X2-X1);
		this.height = Math.abs(Y2-Y1);

		this.instanceMat = mult( translate(X1,Y1,1+(-0.998)), scale4(X2-X1,Y2-Y1,1));
		this.instanceMat = mult(interface_matrix, this.instanceMat);

		this.colorBorder = c1;
		this.colorBackground = c2;

		this.inMotion = false;
		this.forMusic = music;
	}

	update(hovering){
		//cursorCoor[0], cursorCoor[1]
		if(!hold){
			this.inMotion = false;
			return;
		}else{
			this.inMotion = true;
		}

		this.x1 = Math.min(this.boundX[1],Math.max(this.boundX[0],cursorCoor[0]-this.width/2));
		this.y1 = Math.min(this.boundY[1],Math.max(this.boundY[0],cursorCoor[1]-this.height/2));

		this.x2 = this.x1 + this.width;
		this.y2 = this.y1 + this.height;

		if(this.forMusic)
			backgroundMusic.volume = this.getVolume()*0.4;
		else
			masterGain.gain.value = this.getVolume()*0.25;
	}

	/*
		For volume buttons
	*/
	getVolume(){
		/*
			The middle of this.boundX should be associated with 0.5
			this.boundX[0] should be 0.
			this.boundX[1] should be 1.
		*/
		return (this.x1-this.boundX[0])/(this.boundX[1]- this.boundX[0])
	}

	draw(){

		let hovering = false;
		let grabbed = false;
	
		click_in_bounds(this.x1,this.y1,this.x2,this.y2, function(){grabbed=true}, function(){hovering=true} );

		if((grabbed||this.inMotion) && (hovering || this.inMotion))
			this.update();

		
		//Draw border
		draw_box_border(this.x1,this.y1,this.x2,this.y2,this.left, this.right, this.top, this.bottom);

		if(!hovering && !this.inMotion){
			draw_filled_box(this.x1,this.y1,this.x2,this.y2,this.colorBorder,this.colorBackground);
		}else{
			draw_filled_box(this.x1,this.y1,this.x2,this.y2,this.colorBorder,'#777');
		}

		//Draw background
		//if(this.colorNum == CLEAR) return;
		//gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(this.instanceMat) );
		//gl.drawArrays(gl.TRIANGLES,elementVertices[this.colorNum][0],elementVertices[this.colorNum][1]);
	}
}

/*
	Smallest possible level element.
*/
class InterfaceBackground extends InterfaceElement{
	constructor(X1,Y1,X2,Y2,colorNum,left=true,right=true,top=true,bottom=true){
		super(X1,Y1,X2,Y2,-0.9,colorNum,left,right,top,bottom);
	}
}

/*
	Level slightly below cursor.
*/
class InterfaceForeground extends InterfaceElement{
	constructor(X1,Y1,X2,Y2,colorNum,left=true,right=true,top=true,bottom=true){
		super(X1,Y1,X2,Y2,-0.998,colorNum,left,right,top,bottom);
	}
}

/*
	Buttons.
	They are at the highest level below the cursor.
*/
class InterfaceButton extends InterfaceElement{
	constructor(X1,Y1,X2,Y2,colorNum,func1=function(){},text="null",textSize='18', conditionToDraw=function(){return true;}){
		super(X1,Y1,X2,Y2,-0.9985,colorNum,true,true,true,true);
		this.clickFunction = func1;
		this.text = text;
		this.drawConditionFunction = conditionToDraw;
		this.size=textSize;
		this.imDrawn = false;
	}

	draw(){
		this.imDrawn = false;
		if(!this.drawConditionFunction())
			return;
		//Click and hover.
		let hovering = false;
		click_in_bounds(this.x1,this.y1,this.x2,this.y2, this.clickFunction, function(){hovering=true} );

		//Draw border
		draw_box_border(this.x1,this.y1,this.x2,this.y2);

		//Draw text (should be centered)
		draw_centered_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.text,this.size);

		//Draw background
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(this.instanceMat) );
		if(!hovering ){
			gl.drawArrays(gl.TRIANGLES,elementVertices[this.colorNum][0],elementVertices[this.colorNum][1]);
		}else{
			gl.drawArrays(gl.TRIANGLES,elementVertices[GREY][0],elementVertices[GREY][1])
		}
		this.imDrawn = true;
	}
}

/*
	Buttons that are just drawn on the text canvas and don't use any webgl.
*/
class InterfaceCanvasButton {
	constructor(X1,Y1,X2,Y2,func1=function(){},text="null",textSize='18', conditionToDraw=function(){return true;}, c1 = '#CCC', c2 = '#555'){
		
		this.clickFunction = func1;
		this.text = text;
		this.drawConditionFunction = conditionToDraw;
		this.size=textSize;
		this.imDrawn = false;

		this.x1 = X1;
		this.x2 = X2;
		this.y1 = Y1;
		this.y2 = Y2;

		this.colorBorder = c1;
		this.colorBackground = c2;
	}

	draw(){
		this.imDrawn = false;
		if(!this.drawConditionFunction())
			return;

		//Click and hover.
		let hovering = false;
		click_in_bounds(this.x1,this.y1,this.x2,this.y2, this.clickFunction, function(){hovering=true} );

		if(!hovering ){
			draw_filled_box(this.x1,this.y1,this.x2,this.y2,this.colorBorder,this.colorBackground);
		}else{
			draw_filled_box(this.x1,this.y1,this.x2,this.y2,this.colorBorder,'#777');
		}

		draw_centered_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.text,this.size);
		this.imDrawn = true;
	}
}

var heldButtonCount = 0;
var heldIndex = -1;
var clickedThisButton = false;
class InterfaceHeldButton extends InterfaceButton{
	constructor(X1,Y1,X2,Y2,colorNum,func1=function(){},text="null",clickedByDefault=false){
		super(X1,Y1,X2,Y2,colorNum,func1,text);
		this.buttonID = heldButtonCount;
		heldButtonCount++;
		if(clickedByDefault){
			heldIndex = this.buttonID;
		}
	}

	getButtonID(){
		return this.buttonID;
	}

	draw(){
		//Click and hover.
		let hovering = false;
		clickedThisButton = false;
		click_in_bounds(this.x1,this.y1,this.x2,this.y2, this.clickFunction, function(){hovering=true} );
		click_in_bounds(this.x1,this.y1,this.x2,this.y2, function(){clickedThisButton = true;});

		if(clickedThisButton)
			heldIndex = this.buttonID;
		clickedThisButton = false;

		//Draw border
		draw_box_border(this.x1,this.y1,this.x2,this.y2);

		//Draw text (should be centered)
		draw_centered_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.text);

		//Draw background
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(this.instanceMat) );

		if(this.buttonID == heldIndex){
			gl.drawArrays(gl.TRIANGLES,elementVertices[BLACK][0],elementVertices[BLACK][1]);
			return;
		}

		if(!hovering ){
			gl.drawArrays(gl.TRIANGLES,elementVertices[this.colorNum][0],elementVertices[this.colorNum][1]);
		}else{
			gl.drawArrays(gl.TRIANGLES,elementVertices[GREY][0],elementVertices[GREY][1]);
		}
	}	
}

/*
	For consistency adding text.

	Either x1, y1, "text", textSize, isLeft
	Or,
	x1, y1, x2, y2, "text", textSize, isLeft
*/
class InterfaceText{
	constructor(X1,Y1,arg2,arg3,arg4="null",arg5='18',arg6=false,arg7=null){
		this.x1 = X1;
		this.y1 = Y1;
		this.getTextFrom = arg7;
		if(typeof arg2 == "string"){
			this.x2 = X1;
			this.y2 = Y1;
			this.text = arg2;
			this.size = arg3;
			this.isLeft = arg4;
		}else{	
			this.x2 = arg2;
			this.y2 = arg3;
			this.text = arg4;
			this.size = arg5;
			this.isLeft = arg6;
		}
	}

	draw(){
		if(this.getTextFrom==null){
			if(this.isLeft)
				draw_left_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.text,this.size);
			else
				draw_centered_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.text,this.size);
		}else{
			//otherwise getTextFrom represents a function
			//which returns the current text to display.
			if(this.isLeft)
				draw_left_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.getTextFrom(),this.size);
			else
				draw_centered_text((this.x1+this.x2)/2,(this.y1+this.y2)/2,this.getTextFrom(),this.size);
		}
	}
}

function interface_push(v1 ,v2, v3, c){
	vertices.push(v1); vertices.push(v2); vertices.push(v3);
	for(var i =0; i < 3; i++){
		colours.push(c);
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

//Only called once
function build_interface_element(c=0){
	var v1,v2,v3,v4;
	//This is the maximum you can push it.
	var z = SMALLEST_Z_VALUE;

	//Bottom Left
	v1 = vec3(0,0,z);

	//Bottom Right
	v2 = vec3(1,0,z);

	//Top Left
	v3 = vec3(0,1,z);

	//Top Right
	v4 = vec3(1,1,z);

	interface_push(v1,v2,v3,UI_COLOURS[c]);
	interface_push(v4,v3,v2,UI_COLOURS[c]);
}

/*
	Element vertices are indexed by color. For example
	So elementVertices[WHITE][0] = starting vertex of elementvertices.
	   elementVertices[WHITE][1] = number of vertices.
*/
var elementVertices=[];
function build_interface(){
	interface_matrix = scale4(1/(CANVAS_SIZE_X/2),1/(CANVAS_SIZE_Y/2),1);
	interface_matrix = mult(interface_matrix,translate(-(CANVAS_SIZE_X/2),-(CANVAS_SIZE_Y/2),0));

	for(let i = 0; i < UI_COLOURS.length; i++){
		let ind=[0,0];
		ind[0] = vertices.length;
		build_interface_element(i);
		ind[1] = vertices.length - ind[0];
		elementVertices.push(ind);
	}

	add_interface_elements();

	add_crafting_interface_elements();

	add_interface_bottom_bar();
}
function draw_bottom_bar(){
	set_ui_pv();
	set_light_full();
	
	for(let i = 0; i < bottomBarElements.length; i++){
		bottomBarElements[i].draw();
	}
	
	reset_pv();
}


function draw_interface_inventory(){
	set_ui_pv();
	set_light_full();
	//Can enable the depth thingy so whatever order is drawn is their depth???
	for(let i = 0; i < interfaceBackgrounds.length; i++){
		interfaceBackgrounds[i].draw();
	}
	draw_bottom_bar();
	reset_pv();
}

function draw_interface_crafting(){
	set_ui_pv();
	set_light_full();
	
	for(let i = 0; i < craftingElements.length; i++){
		craftingElements[i].draw();
	}
	draw_bottom_bar();
	reset_pv();
}

function draw_context_line(x1,y1,x2,y2, c='#FFFFFF'){
	//var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - y1*(canvas.height/9);
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - y2*(canvas.height/9);

    context.beginPath(); 
   	context.moveTo(xCoor1,yCoor1);
 	context.lineTo(xCoor2,yCoor2);
 	context.strokeStyle = c;
 	context.lineWidth = 2;
  	context.stroke();
  	context.lineWidth = 1;
  	return;
}

function convert_to_canvas_coords(x1,y1){
	return [x1*(canvas.width/16), canvas.height - y1*(canvas.height/9)];
}

function draw_box_border(x1,y1,x2,y2,left=true,right=true,top=true,bottom=true){
	if(!left&&!right&&!top&&!bottom) return;

	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - (y2*(canvas.height/9));
    
    context.strokeStyle = "#CCC";
	context.lineWidth = 2;
    
    if(left&&right&&top&&bottom){
		context.beginPath();
		context.strokeRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
    }else{
    	if(left){
    		context.beginPath(); 
		   	context.moveTo(xCoor1,yCoor1);
		 	context.lineTo(xCoor1,yCoor2);
		 	context.stroke();
    	}

    	if(right){
    		context.beginPath(); 
		   	context.moveTo(xCoor2,yCoor1);
		 	context.lineTo(xCoor2,yCoor2);
		 	context.stroke();
    	}

    	if(top){
    		context.beginPath(); 
		   	context.moveTo(xCoor1,yCoor2);
		 	context.lineTo(xCoor2,yCoor2);
		 	context.stroke();
    	}

    	if(bottom){
    		context.beginPath(); 
		   	context.moveTo(xCoor1,yCoor1);
		 	context.lineTo(xCoor2,yCoor1);
		 	context.stroke();
    	}

    }
    context.lineWidth = 1;
}

function draw_filled_box(x1,y1,x2,y2,c1='#CCC', c2='#111'){
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - (y2*(canvas.height/9));

    var temp = context.fillStyle;
    context.fillStyle = c2;
    context.strokeStyle = c1;
	context.lineWidth = 2;
  
	context.beginPath();
	context.strokeRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
	context.fillRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1)

	context.fillStyle = temp;
    context.lineWidth = 1;
}

function draw_left_text(x1,y1,text1,size='18'){
	context.font = size+"px "+FONT;
	context.textAlign = "left";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));


    context.textBaseline = "middle";

    context.fillText(text1,xCoor1,yCoor1);
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
}

function draw_right_text(x1,y1,text1,size='18'){
	context.font = size+"px "+FONT;
	context.textAlign = "right";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));


    context.textBaseline = "middle";

    context.fillText(text1,xCoor1,yCoor1);
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
}

function draw_centered_text(x1,y1,text1,size='18'){
	context.font = size+"px "+FONT;
	context.textAlign = "center";
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));


    context.textBaseline = "middle";

    context.fillText(text1,xCoor1,yCoor1);
    context.textAlign = "left";
    context.textBaseline = "alphabetic";

}

function measure_text(text1,size='18'){
	let length = 0;
	context.font = size+"px "+FONT;
	context.textAlign = "center";
    context.textBaseline = "middle";

    length = context.measureText(text1).width/(canvas.width/16);

    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    return length;
}


/*
	Just in case I eventually make the canvas size larger.
*/
function get_draw_center(){
	return [16/2,9/2];
}

//CANVAS_SIZE_X CANVAS_SIZE_Y
/*
	Assume size 1280, 720.
*/
function pixToCanX(x){
	//Value ranging from [1,1280] to [0,16]
	let canvas_x = x-1; //[0, 1279]
	canvas_x = canvas_x/1279; // [0,1]
	canvas_x = canvas_x*CANVAS_SIZE_X;
	return canvas_x;
}
function pixToCanY(y){
	//Value ranging from [1,720] to [0,9]

	let canvas_y = y-1; //[0, 719]
	canvas_y = canvas_y/719; // [0,1]
	canvas_y = canvas_y*CANVAS_SIZE_Y;
	return canvas_y;

}







/*
function draw_c_text(x1,y1,text1){
	context.font = "18px "+FONT;
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    context.fillText(text1,xCoor1,yCoor1);
}
function draw_c_text_small_stroke(x1,y1,text1){
	context.font = "10px "+FONT;
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
*/
// draw_c_text(2.73,1.42,'CRAFTING MENU');
//click_in_bounds(2.25,1.75,5.25,1.25,function(){currentMenu='CRAFTING';});

