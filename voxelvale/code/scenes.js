



/*
    var scene = 2; is the default for the generated world
    I'm setting to 4 for testing the dungeon.
*/
const WORLD_SCENE = 2;
var scene = WORLD_SCENE;





function refresh_scene(){
    blocks=[];
    ceilingBlocks=[];
    init_world();
    get_scene();
    removeBlock = new NullifierBlock();
}




function change_scene(Scene){
    clear();
    set_scene(Scene);
    refresh_scene();
}
function set_scene(Scene){
	scene = Scene;
}
function update_scene_data(){
    if(scene==2){
        if(check_reload()){
            var all = return_draw_blocks()
            blocks = all[0];
            ceilingBlocks = all[1];
        }

    }
}
function get_scene(){
	switch(scene){
		case 0:
			//cursor_test_scene();
			home_scene();
			return;
		case 1:
            gen();
            test_scene();
			return;
		case 2:
            inDungeon = false;
            world_test();
			return;
        case 3:
            dungeon_test_scene();
            return;
        case 4:
            inDungeon = true;
            dungeon_scene();
            return;
	}
}
function world_test(){
    init_world();
    player.posX=lastPos[0];
    player.posY=lastPos[1]-0.5;
    var all = return_draw_blocks()
    blocks = all[0];
    ceilingBlocks = all[1];
    fixedView=false;
}

function cursor_test_scene(){
    testView = true;
    fixedView = false;
    //Starts at (0,0) ends at (16,9)
    //blocks.push(new WeirdBlock(0,0,0));
    blocks.push(new WeirdBlock(15,8,0));
    for(var i = 1; i < 15; i+=1.0){
        for (var j = 1; j < 8; j+=1.0){
            //blocks.push(new WoodBlock(i,j,-2,true));
        }
    }
}


function test_scene(){
    fixedView = false;
	for(var i = 1; i < 15; i+=1.0){
        for (var j = 1; j < 8; j+=1.0){
            blocks.push(new WoodBlock(i,j,-2,true));
        }
    }
    for(var i = 1; i < 9; i++){
        blocks.push(new WeirdBlock(0,i,-3));
        blocks.push(new WeirdBlock(0,i,-4));
    }
    for(var i = 1; i < 9; i++){
        blocks.push(new WeirdBlock(15,i,-3));
        blocks.push(new WeirdBlock(15,i,-4));
    }

    for(var i = 1; i < 15; i++){
        blocks.push(new WeirdBlock(i,8,-3));
        blocks.push(new WeirdBlock(i,8,-4));
    }
    for(var i = 0; i < 16; i++){
        if(i!=10 && i!=11){ 
            blocks.push(new WeirdBlock(i,0,-3));
            blocks.push(new WeirdBlock(i,0,-4));
        }else{
            blocks.push(new WoodBlock(i,0,-2));
            blocks.push(new WoodBlock(i,0,-2));
        }
    }
    blocks.push(new TeleBlock(10,1,-4,0))
    blocks.push(new TeleBlock(11,1,-4,0))
}
function home_scene(){
    //TEST***
    fixedView = true;
    blocks.push(new TeleBlock(10,-1,-4,2))
    blocks.push(new TeleBlock(11,-1,-4,2))
    //blocks.push(new WeirdBlock(7,2,-4))
    //return;
	for(var i = 1; i < 15; i+=1.0){
		for (var j = 1; j < 8; j+=1.0){
    		//blocks.push(new WoodBlock(i,j,-2,true));
        }
    }
    //return;
    var l=5;
    for(var i = 1; i < 9; i++){
    	blocks.push(new WeirdBlock(0,i,-3));
    	blocks.push(new WeirdBlock(0,i,-4));
    }
    for(var i = 1; i < 9; i++){
    	blocks.push(new WeirdBlock(15,i,-3));
    	blocks.push(new WeirdBlock(15,i,-4));
    }

    for(var i = 1; i < 15; i++){
    	blocks.push(new WeirdBlock(i,8,-3));
    	blocks.push(new WeirdBlock(i,8,-4));
    }
    for(var i = 0; i < 16; i++){
    	if(i!=10 && i!=11){	
	    	blocks.push(new WeirdBlock(i,0,-3));
	    	blocks.push(new WeirdBlock(i,0,-4));
    	}else{
    		blocks.push(new WoodBlock(i,0,-2));
	    	blocks.push(new WoodBlock(i,0,-2));
    	}
    }
}

var lastPos;
function dungeon_test_scene(){
    //Should clear enemy array!


    // Could just remove enemy collisions.
    //var enemy=new Undead(5,5,-6);
    //    enemy.initialize_enemy();
    //    enemyArray.push(enemy)

    fixedView = true;
    lastPos=[player.posX,player.posY];
    player.posX=8;
    player.posY=0.1;
    for(let i = -20; i < 30; i++){
        for(let j = 0; j < 20; j++){
            if(i < 16 && i >= 0 && j < 9 && j >= 0){
                blocks.push(new WoodBlock(i,j,-2));
            }else{
                blocks.push(new GrassBlock(i,j,-2));
            }
        }
    }
    blocks.push(new WoodBlock(7,-2,-2))
    blocks.push(new WoodBlock(8,-2,-2))
    blocks.push(new WoodBlock(7,-1,-2))
    blocks.push(new WoodBlock(8,-1,-2))
    blocks.push(new GrassBlock(6,-2,-2))
    blocks.push(new GrassBlock(9,-2,-2))


    blocks.push(new TeleBlock(7,-2,-4,2))
    blocks.push(new TeleBlock(8,-2,-4,2))
    //blocks.push(new WeirdBlock(7,2,-4))
    //return;
    for(var i = 1; i < 15; i+=1.0){
        for (var j = 1; j < 8; j+=1.0){
            //blocks.push(new WoodBlock(i,j,-2,true));
        }
    }
    //return;
    var l=5;
    for(var i = -1; i < 9; i++){
        blocks.push(new WeirdBlock(0,i,-3));
        blocks.push(new WeirdBlock(0,i,-4));
    }
    for(var i = -1; i < 9; i++){
        blocks.push(new WeirdBlock(15,i,-3));
        blocks.push(new WeirdBlock(15,i,-4));
    }

    for(var i = 1; i < 15; i++){
        blocks.push(new WeirdBlock(i,9,-3));
        blocks.push(new WeirdBlock(i,9,-4));
    }

    for(var i = 1; i < 7; i++){
        blocks.push(new WeirdBlock(i,-1,-3));
        blocks.push(new WeirdBlock(i,-1,-4));

        blocks.push(new WeirdBlock(15-i,-1,-3));
        blocks.push(new WeirdBlock(15-i,-1,-4));
    }
    for(var i = 0; i < 16; i++){
        for(var j = 0; j < 8; j++){
            //blocks.push(new WoodBlock(i,j,-2));
        }
    }

    
    
    return;
}

function dungeon_one_default_room(){

}