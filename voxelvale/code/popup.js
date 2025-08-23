




/*
	Always displays in the center of screen.

	Any button click should set isDead to true.
*/
class Popup{
	constructor(width, height){
		this.width =  width;
		this.height = height;
		this.isDead = false;

		this.center = get_draw_center();


		this.x1 = this.center[0]-width/2;
		this.x2 = this.center[0]+width/2;

		this.y1 = this.center[1]-height/2;
		this.y2 = this.center[1]+height/2;

		//How long the animation last
		this.animationTimer = 8;
		//When to shrink slightly
		this.popBackTime = 7;

		this.elements = [];

		keyboardDisabled = true;
	}

	kill(){
		keyboardDisabled = false;
		this.isDead = true;
		disableInventoryCursor = false;

	}


	//Should make it work with uifunctions.js
	addElement(element){
		this.elements.push(element);
	}

	update(){
		//20 frames
		if(this.animationTimer > 0 && this.animationTimer <= this.popBackTime){
			this.x1 = this.center[0]-this.width/2 + this.animationTimer*0.01;
			this.x2 = this.center[0]+this.width/2 - this.animationTimer*0.01;

			this.y1 = this.center[1]-this.height/2 + this.animationTimer*0.01;
			this.y2 = this.center[1]+this.height/2 - this.animationTimer*0.01;
			this.animationTimer--;
		}else if(this.animationTimer > 0){
			this.x1 = this.center[0]-this.width/2 - this.animationTimer*0.0005;
			this.x2 = this.center[0]+this.width/2 + this.animationTimer*0.0005;

			this.y1 = this.center[1]-this.height/2 - this.animationTimer*0.0005;
			this.y2 = this.center[1]+this.height/2 + this.animationTimer*0.0005;
			this.animationTimer--;
		}
	}

	//Two parts should have a starting animation
	//where the frame gets bigger
	draw(){
		
		this.update();
		disableInventoryCursor = false;
		// Draw background
		draw_filled_box(0,0,16,9,'rgba(0,0,0,0)','rgba(0,0,0,0.4)');

		//Draw box
		//draw_filled_box(this.x1,this.y1,this.x2,this.y2,'#CCC','#111');
		draw_filled_box(this.x1,this.y1,this.x2,this.y2,'#2c2c2c','#111',10);


		//Now draw elements:
		for(let i = 0; i < this.elements.length; i++){
			this.elements[i].draw();
		}
		if(!this.isDead)
			disableInventoryCursor = true;
	}

}