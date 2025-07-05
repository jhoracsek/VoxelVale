/*
    Functions for building dungeons.
    May 31st.
*/


/*
    Maybe a 7x7 grid.
        -Max number of rooms 12.
    Should have
        -Treasure room.
        -Boss room
*/
var dungeonGrid=[];
var visitedGrid;
var viewedGrid;
const gridSize = 7;
function build_layout(){
    var layout_grid = [];
    for(let i = 0; i < gridSize; i++){
        var temp = []
        for(let j = 0; j < gridSize; j++){
            temp.push(false);
        }
        layout_grid.push(temp);
    }

    //Set starting room.
    var visited = new Queue();
    visited.enqueue([6,3])
    layout_grid[6][3] = true;

    var numberOfRooms = 8 + Math.floor(Math.random() * 2);
    var roomsGenerated = 1;
    var hardCap = 0;

    while(roomsGenerated < numberOfRooms && hardCap < 10000){
        if(visited.isEmpty()){
            //For simplicity, just retry.
            for(let i = 0; i < gridSize; i++){
                for(let j = 0; j < gridSize; j++){
                    layout_grid[i][j] = false;
                }
            }
            visited.enqueue([6,3])
            layout_grid[6][3] = true;
            roomsGenerated = 1;
        }
        var [x,y] = visited.peek();
        visited.dequeue();
        // Look at all four surrounding "rooms". Check that they are in range.

        //(x-1, y), (x+1, y), (x, y-1), (x, y+1)
        if(x-1 >= 0 && !layout_grid[x-1][y]){
            let zeroOne = (Math.random()>=0.5)? 1 : 0;
            if(zeroOne == 1){
                visited.enqueue([x-1,y]);
                layout_grid[x-1][y] = true;
                roomsGenerated++;
            }
        }
        if(x+1 < gridSize && !layout_grid[x+1][y]){
            let zeroOne = (Math.random()>=0.5)? 1 : 0;
            if(zeroOne == 1){
                visited.enqueue([x+1,y]);
                layout_grid[x+1][y] = true;
                roomsGenerated++;
            }   
        }
        if(y-1 >= 0 && !layout_grid[x][y-1]){
            let zeroOne = (Math.random()>=0.5)? 1 : 0;
            if(zeroOne == 1){
                visited.enqueue([x,y-1]);
                layout_grid[x][y-1] = true;
                roomsGenerated++;
            }
        }
        if(y+1 < gridSize && !layout_grid[x][y+1]){
            let zeroOne = (Math.random()>=0.5)? 1 : 0;
            if(zeroOne == 1){
                visited.enqueue([x,y+1]);
                layout_grid[x][y+1] = true;
                roomsGenerated++;
            }
        }
        hardCap++;
    }
    return layout_grid;
}


/*
    Dungeon class.

    TODO:

        Remove blocks array.
        Redo get blocks so that it is formed from the 3D array.
            But also this array only updates when you move through a shift block!
*/

class Dungeon{
    constructor(){
        this.grid = build_layout();

        //this.roomSizeX = 16;
        this.roomSizeX = 16;
        this.roomSizeY = 10;

        this.MAX_X_SIZE = (this.roomSizeX+1)*gridSize + 1;
        this.MAX_Y_SIZE = (this.roomSizeY+1)*gridSize + 1;
        this.MAX_Z_SIZE = 8;

        this.isOccupied = [];
        this.blocks3D = [];
        this.buildIsOccupied();

        this.blocks = [];
        this.ceilingBlocks = [];

        this.dungeonMap = [];

        this.floor = StoneFloorBlock;
        this.wall = DungeonWall;

    }

    setDungeonMap(map){
        this.dungeonMap = map;
    }

    getDungeonMap(){
        return this.dungeonMap;
    }

    /*
        Build a 3D array that determines if a block is already
        placed at a given position. This is used purely for building.
        (If you change to be used for collisions, then it needs to be updated
        when blocks are place, if you don't it can be deleted after the dungeon
        is built).
    */
    buildIsOccupied(){

        // X: -52 to 67
        // Y: -1 to 76
        // Z: -1 (Dirt) to -6 (top of placement)
        // For Z, -2 is ground (e.g., where the floor is placed)

        /*
            The starting positions of X and Y need to be generalized.
            xStart = -(this.roomSizeX+1)*floor(gridSize)/2 - 1.
            yStart = -1.

        */
        for (let i = 0; i < this.MAX_X_SIZE; i++) {
            var tempOut = [];
            var tempBOut = [];
            for (let j = 0; j < this.MAX_Y_SIZE; j++) {
                var tempIn = [];
                var tempBIn = [];
                for (let k = 0; k < this.MAX_Z_SIZE; k++) {
                  tempIn.push(false);
                  tempBIn.push(null);
                }
                tempOut.push(tempIn);
                tempBOut.push(tempBIn);
            }
            this.isOccupied.push(tempOut);
            this.blocks3D.push(tempBOut);
        }
    }

    /*
        Needs to be optimized a lot,
        this is just for testing!!
    */
    getPathMap(){
        //Get grid based off "currentRoom".
        //(j-3)*(this.roomSizeX+1), (6-i)*(this.roomSizeY+1), leftD, rightD, topD, bottomD, [i,j]

        const i = currentRoom[0];
        const j = currentRoom[1];

        const START_X = (j-3)*(this.roomSizeX+1);
        const START_Y = (6-i)*(this.roomSizeY+1);

        var pathMap = [];
        for(let x = START_X; x < START_X+this.roomSizeX; x++){
            var temp = [];
            for(let y = START_Y; y < START_Y+this.roomSizeY; y++){
                temp.push(this.getIsOccupied(x,y,-3) || this.getIsOccupied(x,y,-4))
            }
            pathMap.push(temp);
        }
        return pathMap;
    }

    convertToRoomCoords(PX,PY){
        //Based off "currentRoom"
        const i = currentRoom[0];
        const j = currentRoom[1];

        const START_X = (j-3)*(this.roomSizeX+1);
        const START_Y = (6-i)*(this.roomSizeY+1);

        return [PX-START_X,PY-START_Y];
    }

    convertToDungeonCoords(PX,PY){
        const i = currentRoom[0];
        const j = currentRoom[1];

        const START_X = (j-3)*(this.roomSizeX+1);
        const START_Y = (6-i)*(this.roomSizeY+1);

        return [PX+START_X, PY+START_Y]; 
    }

    getIsOccupied(PX,PY,PZ){
        const xOffset = (this.roomSizeX+1)*Math.floor(gridSize/2) + 1;
        const yOffset = 1;
        const zOffset = 8;

        if(PX+xOffset >= this.MAX_X_SIZE || PY + yOffset >= this.MAX_Y_SIZE|| PZ + zOffset >= this.MAX_Z_SIZE || PX + xOffset < 0 || PY + yOffset < 0|| PZ + zOffset < 0){
            return false;
        }

        return this.isOccupied[PX + xOffset][PY + yOffset][PZ + zOffset];
    }

    isSpaceOccupied(PX,PY,PZ){
        return this.getIsOccupied(PX,PY,PZ);
    }

    setIsOccupied(PX,PY,PZ, val=true){
        const xOffset = (this.roomSizeX+1)*Math.floor(gridSize/2) + 1;
        const yOffset = 1;
        const zOffset = 8;
    
        this.isOccupied[PX + xOffset][PY + yOffset][PZ + zOffset] = val;
    }

    setBlock3D(PX,PY,PZ, block){
        const xOffset = (this.roomSizeX+1)*Math.floor(gridSize/2) + 1;
        const yOffset = 1;
        const zOffset = 8;
    
        this.blocks3D[PX + xOffset][PY + yOffset][PZ + zOffset] = block;
    }

    removeBlock3D(PX,PY,PZ){
        const xOffset = (this.roomSizeX+1)*Math.floor(gridSize/2) + 1;
        const yOffset = 1;
        const zOffset = 8;
    
        this.blocks3D[PX + xOffset][PY + yOffset][PZ + zOffset] = null;
    }

    getBlockAt(PX,PY,PZ){
        const xOffset = (this.roomSizeX+1)*Math.floor(gridSize/2) + 1;
        const yOffset = 1;
        const zOffset = 8;

        /*
            Return null if not in range!
        */

        if(PX+xOffset >= this.MAX_X_SIZE || PY + yOffset >= this.MAX_Y_SIZE|| PZ + zOffset >= this.MAX_Z_SIZE || PX + xOffset < 0 || PY + yOffset < 0|| PZ + zOffset < 0){
            return null;
        }

        return this.blocks3D[PX + xOffset][PY + yOffset][PZ + zOffset];
    }

    /*
        Should return false if the space is null,
        or a block with no collision box.
    */
    isSpaceSolid(PX, PY, PZ){
        var block = this.getBlockAt(PX,PY,PZ);
        if(block == null) return false;
        let objNum = block.objectNumber;
        if(objNum == 9 || objNum == 13) return false;
        return true;
    }

    getGrid(){
        return this.grid;
    }

    getBlocks(){
        //After you are done this class you should make sure to remove any duplicate blocks from this.blocks.
        return this.blocks;
    }

    getCeilingBlocks(){
        return this.ceilingBlocks;
    }

    push(block){
        //If the space is already occupied, don't push.
        var PX = block.posX;
        var PY = block.posY;
        var PZ = block.posZ;
        if(!this.getIsOccupied(PX,PY,PZ)){
            this.setIsOccupied(PX,PY,PZ);
            this.setBlock3D(PX,PY,PZ,block);
            this.blocks.push(block);
        }
    }

    pushCeiling(block){
        this.ceilingBlocks.push(block);
    }

    remove(){

    }

    buildRoom(startX, startY, leftDoor=false, rightDoor=false, topDoor=false, bottomDoor=false, curRoom = [0,0], start=false){
        // Floor
        for(let i = 0; i < this.roomSizeX; i++){
            for(let j = 0; j < this.roomSizeY; j++){
                this.push(new this.floor(startX+i,startY+j,-2));
            }
        }

        this.pushCeiling(new DungeonCeiling(startX,startY,-7,this.roomSizeX,this.roomSizeY,curRoom));

        this.push(new StoneBlock(startX+5,startY+5,-3));
        this.push(new StoneBlock(startX+6,startY+5,-3));

        for(let k = -1; k < 4; k++){
            //Left
            for(let i = 0; i < this.roomSizeY; i++){
                    var block = new this.wall(startX-1, + startY+i, -3-k);
                    if(k == -1){
                        block = new this.floor(startX-1, + startY+i, -3-k)
                    }else if(k<2 && leftDoor && (i == 4 || i == 5)){
                        block = new ShiftBlock(startX-1, + startY+i, -3-k);
                    }
                    this.push(block);
            }

            //Right
            for(let i = 0; i < this.roomSizeY; i++){
                var block = new this.wall(startX+this.roomSizeX, + startY+i, -3-k);
                if(k == -1){
                    block = new this.floor(startX+this.roomSizeX, + startY+i, -3-k);
                }else if(k<2 && rightDoor&&(i == 4 || i == 5)){
                    block = new ShiftBlock(startX+this.roomSizeX, + startY+i, -3-k)
                }
                this.push(block);
            }

            //Bottom
            for(let i = 0; i < this.roomSizeX; i++){
                var block = new this.wall(startX+i,startY-1,-3-k);
                if(k == -1){
                    block = new this.floor(startX+i,startY-1,-3-k);
                }
                else if(k<2 && (bottomDoor||start)&&(i==7 || i==8)){
                    if(!start){
                        block = new ShiftBlock(startX+i,startY-1,-3-k);
                    }else{
                        block = new TeleBlock(startX+i,startY-1,-3-k,2);
                        //new TeleBlock(X+4,Y+1,j,4)
                    }
                }
                this.push(block);
            }

            //Top
            for(let i = 0; i < this.roomSizeX; i++){
                var block = new this.wall(startX+i,startY+this.roomSizeY,-3-k);
                if(k == -1){
                    block = new this.floor(startX+i,startY+this.roomSizeY,-3-k);
                }
                else if(k<2 && topDoor&&(i==7 || i==8)){
                    block = new ShiftBlock(startX+i,startY+this.roomSizeY,-3-k);
                }
                this.push(block);
            }
        }
        return;
    }

    buildDungeon(){
        for(let i = 0; i < gridSize; i++){
            for(let j = 0; j < gridSize; j++){
                //6, 3 => 0,0
                //6, 4 => this.sizeX + 1, 0
                //row, col => 
                var leftD = (j-1 >= 0) && this.grid[i][j-1];
                var rightD = (j+1 < gridSize) && this.grid[i][j+1];
                var bottomD = (i+1 < gridSize) && this.grid[i+1][j];
                var topD = (i-1 >= 0) && this.grid[i-1][j];

                if(this.grid[i][j]){
                    if(i==6 && j==3)
                        this.buildRoom( (j-3)*(this.roomSizeX+1), (6-i)*(this.roomSizeY+1), leftD, rightD, topD, bottomD, [i,j],true);
                    else
                        this.buildRoom( (j-3)*(this.roomSizeX+1), (6-i)*(this.roomSizeY+1), leftD, rightD, topD, bottomD, [i,j],false);
                }
            }
        }
        //Update everything.
        for(let i = 0; i < this.blocks.length; i++){
            //Ruins tops of blocks for some reason?!?!?
            this.blocks[i].update();
        }

    }

    removeFromBlockArray(PX,PY,PZ){
        //Should maybe handle ceiling, but I don't really care about it in dungeons.
        if(this.blocks.length == 0){
            return;
        }
        if(this.blocks.length == 1){
            if(this.blocks[0].posX == PX && this.blocks[0].posY == PY && this.blocks[0].posZ == PZ){
                this.blocks=[];
            }
            return;
        }
        //Here...
        for(var i = 0; i < this.blocks.length; i++){
            if(this.blocks[i].posX == PX && this.blocks[i].posY == PY && this.blocks[i].posZ == PZ){
                if(i != this.blocks.length-1){
                    var temp = this.blocks[i];
                    this.blocks[i]=this.blocks[this.blocks.length-1];
                    this.blocks.pop();
                    temp.destroy();
                }else{
                    var temp = this.blocks[i];
                    this.blocks.pop();
                    temp.destroy();
                }
                //if(block.posZ == -2){
                //    //create a dirt block at -1.
                //    this.addBlock(new DirtBlock(block.posX,block.posY,-1));
                //}
            }

        }
    }

    removeBlockByPos(PX,PY,PZ){
        //Update chunk!
        if(this.getIsOccupied(PX,PY,PZ)){
            /*
                3 things:
                    Remove from isOccupied
                    Remove from 3D array
                    Remove from blocks array
            */
            this.setIsOccupied(PX,PY,PZ,false);
            this.removeBlock3D(PX,PY,PZ);
            this.removeFromBlockArray(PX,PY,PZ);
            this.updateChunk(PX,PY,PZ)
        }else{
            return false;
        }
        

    }

    addBlock(block){
        //Update chunk!
        var PX = block.posX;
        var PY = block.posY;
        var PZ = block.posZ; 
        var occupied =  this.getIsOccupied(PX,PY,PZ);

        if(!occupied){
            this.push(block);
            this.updateChunk(PX,PY,PZ);
            return true;
        }
        return false;
    }


    updateChunk(PX,PY,PZ){
        //Update cube around block
        for(let i = -1; i < 2; i++){
            for(let j = -1; j < 2; j++){
                for(let k = -1; k < 2; k++){
                    var block = this.getBlockAt(PX+i, PY+j, PZ+k);
                    if(block != null){
                        block.update();
                    }
                }
            }
        }
        var block = this.getBlockAt(PX, PY, PZ-2);
        if(block != null){
            block.update();
        }
    }

    getChunk(PX,PY){
        var chunk = [];
        for(let i = -2; i < 3; i++){
            for(let j = -2; j < 3; j++){
                var block = this.getBlockAt(PX+i, PY+j, -3);
                if(block != null){
                    chunk.push(block);
                }
                block = this.getBlockAt(PX+i, PY+j, -4);
                if(block != null){
                    chunk.push(block);
                }
                /*
                    Also get dirt.
                */
                block = this.getBlockAt(PX+i, PY+j, -1)
                if(block != null){
                    chunk.push(block);
                }
            }
        }
        return chunk;
    }


    /*
        Used for drop box. 

        Returns object of the form:

        [isADropBox, Position].

        If there is no dropBox, but there is an available space
        it returns:
            [false, pX,pY,pZ].

        If there is a dropbox at pX,pY,pZ, it returns
            [true, pX,pY,pZ].

        If neither conditions are met the function returns null.
    */  
    getDropBoxSpace(PX,PY){
        //DropBox objectNumber = 9.
        let PZ = -3;

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                let temp = this.getBlockAt(PX+(i-1), PY+(j-1), PZ);
                if(temp!=null && temp.objectNumber == 9)
                    return [true,temp];
            }
        }

        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(!this.isSpaceOccupied(PX+(i-1), PY+(j-1), PZ))
                    return [false,[PX+(i-1), PY+(j-1), PZ]]; 
            }
        }
        

        return null;
    }


}

var currentDungeon;
var dungeonList=[];
var genNewDungeon = true;
var dungeonNumber = -1;
function dungeon_scene(){
    fixedView = true;
    lastPos=[player.posX,player.posY];
    player.posX=8;
    //player.posY=0.1;
    player.posY=1;

    let newDun = false;

    if(genNewDungeon){
        newDun = true;
        currentDungeon = new Dungeon();
        currentDungeon.buildDungeon();
        dungeonList.push(currentDungeon);
        genNewDungeon = false;
    }else{
        currentDungeon = dungeonList[dungeonNumber];
    }
    dungeonGrid = currentDungeon.getGrid();
    blocks = currentDungeon.getBlocks();
    ceilingBlocks = currentDungeon.getCeilingBlocks();

    /*
        Need to set the fixed view matrix as a funciton of the size of each room.
    */
    viewMatrixFixed = translate(0,0,0);
    viewMatrixFixed = mult(viewMatrixFixed, scale4(0.125,(1/4.5),0.1));
    //viewMatrixFixed = mult(viewMatrixFixed,translate(-8,-4.5,0));
    viewMatrixFixed = mult(viewMatrixFixed,translate(-8,-4.75,0));

    roomSizeX = currentDungeon.roomSizeX + 1;
    roomSizeY = currentDungeon.roomSizeY + 1;
    if(newDun){
        visitedGrid = [];
        for(let i = 0; i < gridSize; i++){
            var temp = []
            for(let j = 0; j < gridSize; j++){
                temp.push(false);
            }
            visitedGrid.push(temp);
        }
        //The starting position is visited by default.
        visitedGrid[6][3] = true;

        viewedGrid = [];
        for(let i = 0; i < gridSize; i++){
            var temp = []
            for(let j = 0; j < gridSize; j++){
                temp.push(false);
            }
            viewedGrid.push(temp);
        }
        // Set both viewed and visited HERE
        currentDungeon.setDungeonMap([visitedGrid, viewedGrid]);
    }else{
        let maps = currentDungeon.getDungeonMap();
        visitedGrid = maps[0];
        viewGrid = maps[1];
    }

    //Should store this in the dungeon object.

    return;

    //Should clear enemy array!

    // Could just remove enemy collisions.
    //var enemy=new Undead(5,5,-6);
    //    enemy.initialize_enemy();
    //    enemyArray.push(enemy)
}