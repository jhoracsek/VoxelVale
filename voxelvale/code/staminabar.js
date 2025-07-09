

/*
	Function for the stamina bar.

	This is really lazy, but it's literally the same as the health bar.
*/

let staminaBorderColor = ["rgba(100,200,100,", "rgba(241,200,23,"];
let staminaFillColor = ["rgba(0,200,0,", "rgba(222,220,63,"];
let staminaBarBackColor = ["rgba(0,60,0,", "rgba(102,102,51,"];


function draw_staminabar(x1, y1, x2, y2, health, maxHealth, borderRadius=40,opacity=1,onCooldown=false){
	let colorIndex = +onCooldown;

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
    context.strokeStyle = staminaBorderColor[colorIndex] + (opacity).toString() + ")";
    context.beginPath();
    context.roundRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1,[borderRadius]);
    context.stroke();

    // Draw health portion of the bar.
    context.beginPath();
    // If health is within some small episilon of being full, only draw health.
    if(health >= maxHealth-0.01){
    	context.roundRect(xCoor1, yCoor1, endHealth, yCoor2-yCoor1,[borderRadius,borderRadius,borderRadius,borderRadius]);
    	context.fillStyle = staminaFillColor[colorIndex] + (opacity*0.7).toString() + ")";
    	context.fill();
    }
    else{
    	//Otherwise draw both sides.
        if(health > 0){
        	context.roundRect(xCoor1, yCoor1, endHealth, yCoor2-yCoor1,[borderRadius,0,0,borderRadius]);
        	context.fillStyle = staminaFillColor[colorIndex] + (opacity*0.7).toString() + ")";
        	context.fill();
        }

    	//Draw right side.
    	context.beginPath();
	    if(health <= 0)
            context.roundRect(xCoor1+endHealth, yCoor1, (xCoor2-xCoor1)-endHealth, yCoor2-yCoor1,[borderRadius,borderRadius,borderRadius,borderRadius]);
	    else
            context.roundRect(xCoor1+endHealth, yCoor1, (xCoor2-xCoor1)-endHealth, yCoor2-yCoor1,[0,borderRadius,borderRadius,0]);
        context.fillStyle = staminaBarBackColor[colorIndex]+ (opacity*0.7).toString() + ")";
	    context.fill();
    }
	
    //Reset
    context.fillStyle = temp;
    context.lineWidth = 1*canvas_multiplier;
}
