
//Gonna have to make this an object that redraws itself at a lower alpha each time
function draw_notification_box(x1,y1,x2,y2,a=1,text='none',number=1,size='10'){

	var xCoor1 = x1*(canvas.width/16);
    var yCoor1 = canvas.height - (y1*(canvas.height/9));
    var xCoor2 = x2*(canvas.width/16);
    var yCoor2 = canvas.height - (y2*(canvas.height/9));

    context.globalAlpha = a;
	context.fillStyle = "#111111";
	context.fillRect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
	context.fillStyle = "#FFFFFF";
	context.strokeStyle = '#FFFFFF';
	context.beginPath();
	context.rect(xCoor1, yCoor1, xCoor2-xCoor1, yCoor2-yCoor1);
	context.stroke();
	draw_c_text_variable_size(x1+0.05,y1-0.25,text,size);
	draw_c_text_variable_size(x1+0.05,y1-0.37,number);
	context.globalAlpha = 1;

	return;
}

class NotificationQueue{
	constructor(){
		this.notificationQueue = new Queue();
		//this.timer=0;
	}
	//Would enforce usage of Notification class if I could, but javascript. So just be careful
	//to only use Notification objects.
	addNotification(notification){
		if(this.isEmpty()==false && this.notificationQueue.cheekyPeek().name == notification.name)
			this.notificationQueue.cheekyPeek().addQuantity();
		else
			this.notificationQueue.enqueue(notification);
		return;
	}
	//Updates notifications and draws them onto the text-canvas.
	updateNotifications(){
		//if(this.timer>=60)this.timer=0;
		if(this.isEmpty()){return;}
		if(this.notificationQueue.peek().isDestroyed())
			this.notificationQueue.dequeue();
		if(this.isEmpty()){return;}
		this.notificationQueue.peek().update();
		var notificationsToDraw = this.notificationQueue.peek5();
		for(var i=0;i<notificationsToDraw.length;i++){
			this.notificationQueue.peek5()[i].draw(-i*0.7);
			//notificationsToDraw[i].draw(-i*0.7);
		}
		//this.timer++;
	}
	isEmpty(){
		if(this.notificationQueue.isEmpty())
			return true;
		return false;
	}
}

class Notification{
	static width = 1.5;
	constructor(OBJECT,QUANTITY){
		this.name=OBJECT.name;
		this.quantity=QUANTITY;
		this.alpha=1;
		this.exist=true;
		this.width=1.5;
		this.fontSize = 10;
		
		while(measure_text(this.name,this.fontSize.toString()) > (this.width-0.1)){
			this.fontSize--;	
		}
		
	}
	//Make it so only the first one fades away?
	update(){
		this.alpha-=0.01;
		if(this.alpha <= 0){
			this.alpha = 0
			this.exist=false;
		}
	}
	addQuantity(){
		this.alpha=1;
		this.quantity++;
	}
	draw(y=0){
		draw_notification_box(14.25,(8.6+y),14.25+Notification.width,(8.1+y),this.alpha,this.name,this.quantity,this.fontSize.toString());
		//draw_notification_box(14.25,(8.6+y),15.75,(8.1+y),this.alpha,this.name);
		/*this.alpha-=0.005;
		if(this.alpha <= 0){
			this.exist=false;
		}*/
		return;
	}
	isDestroyed(){
		return !this.exist;
	}

}