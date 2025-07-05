



/*

	Functions for the health bar.

	Health bars are just drawn on the text-canvas for simplicity. 

*/


//let healthBorderColor = "rgba(50,0,0,1)";


//let healthBorderColor = "rgba(200,100,100,1)";
//let healthFillColor = "rgba(200,0,0,0.7)";
//let healthBarBackColor = "rgba(60,0,0,0.7)";

let healthBorderColor = "rgba(200,100,100,";
let healthFillColor = "rgba(200,0,0,";
let healthBarBackColor = "rgba(60,0,0,";



/*
	Experiment with context.fill(); before vs after context.stroke();


    Add opacity for fade in and out!
*/
function draw_healthbar(x1, y1, x2, y2, health, maxHealth, borderRadius=40,opacity=1){
	let xCoor1 = x1*(canvas.width/16);
    let yCoor1 = canvas.height - (y1*(canvas.height/9));
    let xCoor2 = x2*(canvas.width/16);
    let yCoor2 = canvas.height - (y2*(canvas.height/9));

    let temp = context.fillStyle;
    let width = (xCoor2-xCoor1);

    // Calculate how much health player has lost on the scale [0,width].
    let convertedDamage = (maxHealth - health)*(width/maxHealth);

    // Calculate where to stop drawing health portion of the bar.
    let endHealth = width-convertedDamage;
	context.lineWidth = 2*canvas_multiplier;
    context.strokeStyle = healthBorderColor + (opacity).toString() + ")";
    context.beginPath();
    context.roundRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1,[borderRadius]);
    context.stroke();

    // Draw health portion of the bar.
    context.beginPath();
    // If health is within some small episilon of being full, only draw health.
    if(health >= maxHealth-0.01){
    	context.roundRect(xCoor1, yCoor1, endHealth, yCoor2-yCoor1,[borderRadius,borderRadius,borderRadius,borderRadius]);
    	context.fillStyle = healthFillColor + (opacity*0.7).toString() + ")";
    	context.fill();
    }
    else{
    	//Otherwise draw both sides.
        if(health > 0){
        	context.roundRect(xCoor1, yCoor1, endHealth, yCoor2-yCoor1,[borderRadius,0,0,borderRadius]);
        	context.fillStyle = healthFillColor + (opacity*0.7).toString() + ")";
        	context.fill();
        }

    	//Draw right side.
    	context.beginPath();
	    if(health <= 0)
            context.roundRect(xCoor1+endHealth, yCoor1, (xCoor2-xCoor1)-endHealth, yCoor2-yCoor1,[borderRadius,borderRadius,borderRadius,borderRadius]);
	    else
            context.roundRect(xCoor1+endHealth, yCoor1, (xCoor2-xCoor1)-endHealth, yCoor2-yCoor1,[0,borderRadius,borderRadius,0]);
        context.fillStyle = healthBarBackColor+ (opacity*0.7).toString() + ")";
	    context.fill();
    }
 
    //Draw stroke around health bar.
	

    //Reset
    context.fillStyle = temp;
    context.lineWidth = 1*canvas_multiplier;
}


function draw_filled_box_test(x1,y1,x2,y2,c1='#CCC', c2='#111'){
	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - (y2*(canvas.height/9));

    var temp = context.fillStyle;
    context.fillStyle = c2;
    context.strokeStyle = c1;
	context.lineWidth = 2*canvas_multiplier;
  
	context.beginPath();
	context.strokeRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
	context.fillRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1)

	context.fillStyle = temp;
    context.lineWidth = 1*canvas_multiplier;
}