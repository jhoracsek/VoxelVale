class FinderFour extends Enemy{
	constructor(X=null,Y=null,Z=null){
		super(X,Y,Z);
		this.verticesStart = 1;
		this.speed = 0.02;

		if(X == null) return;

		let coords = currentDungeon.convertToRoomCoords(Math.round(X),Math.round(Y))
		this.mapPosX = coords[0];
		this.mapPosY = coords[1];

		this.roomSizeX = 16;
		this.roomSizeY = 10;

		this.pathUpdateTime = 0;
		this.pathUpdateTimeMax = 10;
		this.path = [];
	}

	sendData(){
		build_block(1);
	}

	updateActualPosition(){
		let coords = currentDungeon.convertToDungeonCoords(this.mapPosX, this.mapPosY)
		var desiredX = coords[0];
		var desiredY = coords[1];

		var PX = this.posX;
		var PY = this.posY;

		var dX = desiredX - PX;
		var dY = desiredY - PY;

		if(dX == 0 && dY == 0)
			return true;

		var hyp=Math.sqrt(dX*dX + dY*dY);

		this.posX += this.speed*(dX/hyp);
		this.posY += this.speed*(dY/hyp);

		switch(Math.sign(dX)){
			//Moving left
			case -1:
				if(this.posX <= desiredX)
					this.posX = desiredX;
				break;
			//Moving right
			case 1:
				if(this.posX >= desiredX)
					this.posX = desiredX;
				break;
		}

		switch(Math.sign(dY)){
			//Moving down
			case -1:
				if(this.posY <= desiredY)
					this.posY = desiredY;
				break;
			//Moving up
			case 1:
				if(this.posY >= desiredY)
					this.posY = desiredY;
				break;
		}

		if(this.posX == desiredX && this.posY == desiredY){
			return true;
		}else{
			return false;
		}

	}

	updatePosition(){
		/*
			This is how frequently you should update the path tracking the player.
			(As a note, this should update whenever the dungeon changes (e.g., blocks place or removed. 10 frames is probably fine though.))
		*/
		if(this.pathUpdateTime <= 0){
			var pathMap = currentDungeon.getPathMap();

			var playerCoords = currentDungeon.convertToRoomCoords(player.posX-0.5, player.posY-0.5);

			// This is roughly the desired indices for the player.
			var desired = [Math.round(playerCoords[0]), Math.round(playerCoords[1])];

			this.path = this.updatePath(desired,pathMap);
			if(this.path.length != 0 && this.path != null)
				this.path.pop();
			this.pathUpdateTime = this.pathUpdateTimeMax;
		}else{
			this.pathUpdateTime--;
		}

		if(this.updateActualPosition()){
			if(this.path.length == 0)
				return;

			var len = this.path.length;
			var lastSquare = this.path[len-1][0]

			this.mapPosX = lastSquare[0];
			this.mapPosY = lastSquare[1];

			this.path.pop();
		}

		this.instanceMat = translate(this.posX,this.posY,this.posZ);
	}

	// 16 X 10 grid.
	getCandidates(square, grid){
		let candidates = [];
		var PX = square[0];
		var PY = square[1];

		//Left
		if(PX - 1 >= 0){
			if(!grid[PX - 1][PY])
				candidates.push([PX-1,PY]);
		}

		//Right
		if(PX + 1 < this.roomSizeX){
			if(!grid[PX+1][PY])
				candidates.push([PX+1,PY]);
		}

		//Above
		if(PY + 1 < this.roomSizeY){
			if(!grid[PX][PY+1])
				candidates.push([PX,PY+1]);
		}

		//Below
		if(PY - 1 >= 0){
			if(!grid[PX][PY-1])
				candidates.push([PX,PY-1]);
		}


		return candidates;
	}

	/*
		Updates 'mapPosX' and 'mapPosY' to be 
		the semi-optimal square as given by A*.
	*/
	updatePath(desired, grid){
		/*
			So the current position of the box is:
			this.mapPosX, this.mapPosY.

			These values will always stay integers.

			'desired' is the sqaure we are trying to move to.

			It's given as desired = [x,y];
		*/
		var PX = this.mapPosX;
		var PY = this.mapPosY;

		
		let open = new PriorityQueue();
		//Closed can probably just be like a 2D array that is true if closed.
		let closed = [];
		for(let i = 0; i < this.roomSizeX; i++){
			let temp = [];
			for(let j = 0; j < this.roomSizeY; j++){
				temp.push(null);
			}
			closed.push(temp);
		}
	
		var heurStart = this.heuristic([PX,PY],desired,grid)
		//Candidate, key, path, heuristic evaluation (This is used for cases when the enemy cannot reach player)
		var start = [ [PX,PY], heurStart, [], heurStart ];
		open.add( start );

		/*
			Keep track of the path with the lowest heuristic as it's been added to the closed list.
			This will be used for cases where the goal (the player) cannot be reached.
		*/
		var last = start;

		//Run a_star search.
		while(!open.isEmpty() && closed[desired[0]][desired[1]]==null){
			let current = open.remove();

			var PXc = current[0][0];
			var PYc = current[0][1];

			closed[PXc][PYc] = current;
			
			if(current[3] < last[3]){
				last = current;
			}

			var path = current[2];
			var pathC = []
			if(path.length > 0){
				pathC = path.slice();
			}
			pathC.push(current);

			var candidates = this.getCandidates([PXc, PYc], grid);
			for(let i = 0; i < candidates.length; i++){
				var pxc = candidates[i][0];
				var pyc = candidates[i][1];

				var heur =  this.heuristic(candidates[i], desired, grid);
				var cost = pathC.length + heur;

				if(closed[pxc][pyc] != null ){
					if(cost < closed[pxc][pyc][1])
						closed[pxc][pyc] = null;
				}
				if(closed[pxc][pyc] == null){
					open.add([[pxc,pyc], cost, pathC, heur]);
				}
			}
		}
		var ret = null;
		if(closed[desired[0]][desired[1]] == null){
			ret = last[2];
			ret.push(last);
			return ret.reverse();
		}else{
			ret = closed[desired[0]][desired[1]][2];
			ret.push([desired]);			
		}

		return ret.reverse();
	}

	heuristic(space, desired, grid){
		var dX = Math.abs(space[0] - desired[0]);
		var dY = Math.abs(space[1] - desired[1]);

		if(space[0] < 0 || space[0] > this.roomSizeX || space[1] < 0 || space[1] > this.roomSizeY) return 1000;

		if (grid[space[0]][space[1]])
			return 1000;

		return (dX+dY);
	}

	draw(){
		set_mv(this.instanceMat);
		gl.drawArrays(gl.TRIANGLES,enemyVertices[this.verticesStart][0],enemyVertices[this.verticesStart][1]);

		//For testing, draw the box that chases the player.
		let coords = currentDungeon.convertToDungeonCoords(this.mapPosX,this.mapPosY);
		var PX = coords[0];
		var PY = coords[1];

		set_mv(translate(PX,PY,this.posZ));
		gl.drawArrays(gl.LINES,enemyHitboxVertices[this.verticesStart][0],enemyHitboxVertices[this.verticesStart][1]);

		if(hitBox){
			set_mv(translate(this.posX,this.posY,this.posZ));
			gl.drawArrays(gl.LINES,enemyHitboxVertices[this.verticesStart][0],enemyHitboxVertices[this.verticesStart][1]);
		}
	}
}