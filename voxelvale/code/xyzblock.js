

function build_block_3D(Texture, oX=0.0065, oY=0.0065, Texture2 = Texture, Texture3 = Texture){
	//Bottom
	block_face( 1, 0, 3, 2 );
	set_texture(Texture,oX,oY);
	
	//Right
	block_face( 2, 3, 7, 6 ,true);
	set_texture(Texture3,oX,oY);
	
	//Front
	block_face( 3, 0, 4, 7,true);
	set_texture(Texture2,oX,oY);


	//Back (here)
	block_face( 6, 5, 1, 2,true);
	set_texture_rotate(Texture2,oX,oY);
	
	//Top
	block_face( 4, 5, 6, 7,true);
	set_texture(Texture,oX,oY);
	

	//Left
	block_face( 5, 4, 0, 1,true);
	set_texture(Texture3,oX,oY);
}

function build_block_flip_top(Texture, oX=0.0065, oY=0.0065, Texture2 = Texture, Texture3 = Texture){
	//Bottom
	block_face( 1, 0, 3, 2 );
	set_texture(Texture,oX,oY);
	
	//Right
	block_face( 2, 3, 7, 6 ,true);
	set_texture_rotate90(Texture3,oX,oY); 	//GOOD
	
	//Front
	block_face( 3, 0, 4, 7,true);
	set_texture_rotate90(Texture2,oX,oY);	//GOOD


	//Back (here)
	block_face( 6, 5, 1, 2,true);
	set_texture_rotate90(Texture2,oX,oY,true);
	
	//Top
	block_face( 4, 5, 6, 7,true);
	set_texture(Texture,oX,oY);				//GOOD
	

	//Left
	block_face( 5, 4, 0, 1,true);
	set_texture_rotate90(Texture3,oX,oY,true);
}

function set_texture_rotate90(texLoc=0, oX=0.0065, oY=0.0065,flip=false){
	
	var row = Math.floor(texLoc%8);
	var col = Math.floor(texLoc/8);

	var xStart = 32 + row*(3*32);
	var xEnd = xStart + 32;
	var yStart = 32 + col*(3*32);
	var yEnd = yStart + 32;

	var s = 1024;

	let p = [vec2(xStart/s, yStart/s), vec2(xEnd/s, yStart/s), vec2(xStart/s, yEnd/s), vec2(xEnd/s, yEnd/s), vec2(2,2)];

	let order = [0,1,2,3];
	//order = [0,1,3,2];
	//order = [0,3,1,2];
	//order = [3,0,1,2];
	if(flip)
		order = [3,2,1,0];
	//order = [2,3,0,1];

	p = [p[order[0]], p[order[1]], p[order[2]], p[order[3]]];

	// Test.
	/*
		123	()
		132 ()

	*/

	texCoords.push(p[3]);
	texCoords.push(p[2]);
	texCoords.push(p[0]);

	texCoords.push(p[3])//1
	texCoords.push(p[0])//2;
	texCoords.push(p[1])//0;

	



	return;
}

function set_texture_rotate(texLoc=0, oX=0.0065, oY=0.0065){
	
	var row = Math.floor(texLoc%8);
	var col = Math.floor(texLoc/8);

	var xStart = 32 + row*(3*32);
	var xEnd = xStart + 32;
	var yStart = 32 + col*(3*32);
	var yEnd = yStart + 32;

	var s = 1024;

	let p = [vec2(xStart/s, yStart/s), vec2(xEnd/s, yStart/s), vec2(xStart/s, yEnd/s), vec2(xEnd/s, yEnd/s), vec2(2,2)];

	texCoords.push(p[1]);//213
	texCoords.push(p[3]);
	texCoords.push(p[2]);

	texCoords.push(p[1])//p[2]);
	texCoords.push(p[2])//p[0]);
	texCoords.push(p[0])//p[1]);

	



	return;
}


/*
	super(X,Y,Z, top-bottom, front-back, left-right)
*/
class X_Y_Z_TextureBlock extends BlockWall{
	constructor(X=null,Y=null,Z=null,t1=0,t2=0,t3=0,TOB='NULL'){
		super(X,Y,Z,t1,false,TOB);
		this.t1 = t1;
		this.t2 = t2;
		this.t3 = t3;
	}

	sendData(){
		//Need to send for each of the three faces.
		build_block_3D(this.t1,0,0,this.t2,this.t3)
	}

}