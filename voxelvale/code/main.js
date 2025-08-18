var gl;
var vertices;
var normals;
var colours;
var texCoords;
var tetraVerts = 0;
var menuLogo;

var modelViewMatrix;
var modelViewMatrixLoc;

var zoomOutLevel = 0;
var zoomAnimation = null;
var viewModMatrix;
var viewModMatrixLoc;

var viewMatrix;
var viewMatrixFixed;
var viewMatrixUI;

var projectionMatrix;
var projectionMatrixLoc;

var tiles = [];
var blocks = [];
var ceilingBlocks = [];
var removeBlock;

var player;

var hitBox = false;

var drawDistanceX;
var drawDistanceY;

var xCoor=8, yCoor=4, zCoor=-2;
var selectXCoor=8.5, selectYCoor=4;

var inventory = false;

var click = false;
/*
	Lighting.
*/
var lightPosition = vec4(0, 0, -0.40, 1.0);

var lightAmbient = vec4(0.9, 0.9, 0.9, 1.0);
var lightDiffuse = vec4(0.7, 0.7, 0.7, 1.0);
var lightSpecular = vec4(0.6, 0.6, 0.6, 1.0);

var materialAmbient = vec4(0.8, 0.8, 0.8, 1.0);
var materialDiffuse = vec4(0.6, 0.6, 0.6, 0.5);
var materialSpecular = vec4(0.5, 0.5, 0.5, 1.0);
var materialShininess = 100;

var playerAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var ambientProductPlayer = vec4(0.8, 0.8, 0.8, 0.8);

var ambientProduct = mult(lightAmbient, materialAmbient);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular, materialSpecular);

var disableNotifications = true;
/*
	Lighting end.
*/

/*
	Shadows.
*/

// Colour for shadows.
var sColor;

// Will be helpful to have a slightly different light for which we calculate shadows.
// This is just for aesthetic purposes, it helps to be able to vary the z-level at which the light lies,
// independent of how it affects the lighting in our scene.
//var lPosition = vec4(0, 0, -0.6, 1);
var lPosition = vec4(0, 0, -0.7, 1);
var sMatrix;

var lPositionForEnemy =vec4(0, -0.2, -1, 1);
var sMatrixForEnemy;

var lPositionForPlayer = vec4(0, -0.1, -2, 1);
var sMatrixForPlayer;

var shadowMatrixLoc;

/*
	Shadows end.
*/

var modelTestMode=false;

//Texturing.
var texture;

var fixedView = true;
var testView = false;

var texScale = 1;
const imageSize = 256;
const upScaledImageSize = 256*3;
var texSize = imageSize*texScale;
var textureImage;

var cursorGreen=false;

var blockCursor=true;

var nQueue;
var fQueue;
var pQueue;
var inFunction=false;
var projectileArray;
var enemyArray;
var townFolkArray;
var drawDeathArray;
var waterNetworkArray;
var newWaterNetworkID;

//AKA Universal Acceleration Cutoff Threshold;
var UACT;

var worldMade;

var identityMatrix;

var activeToolBarItem = 8;
var toolBarList = [];
const NUM_TOOLBAR_TOOLS = 3;
const NUM_TOOLBAR_ITEMS = 7;

var cursorBlockLoc;
const cursorFramesToDisappear=120;
var cursorDisplayTimer=cursorFramesToDisappear;

var flashingLoc;

var isParticleLoc;
var isCeilingLoc;
var inDungeonLoc;
var opacityFactorLoc;

var inDungeon = true;

const recipeColor = vec4(0.3,0.3,1,0.4);


/*
	Cooldown for any projectile the player can shoot.
*/
var projectileCooldown = 0;


/*
	Particles:
	Of the form particles[i] := [vec3(xPos, yPos, zPos), framesAlive]
	Every time the particle loop runs in render it should decrease framesAlive,
	once it reaches 0, it should remove the particles from the array.
*/

var particles =[]


/*
	For adjusting background
*/
let bodycontainer;


// Font
const FONT = "ROBOTO";


let howToPlayText = [
	"Use 'WASD' to move.",
	"Press 'space' to sprint.",
	"Press '~' to open inventory.",
	"Left click to use tools and place blocks.",
	"Right click to interact with blocks.",
	"Scroll or use 'Q' and 'E' to adjust cursor.",
	"Press 'G' to toggle grid mode.",
	"Use arrow up and arrow down to zoom the camera."
];


/*
	For testing/screenshots
*/
let unrotatedViewMatrix;

let viewRotateX = 0;
let viewRotateY = 0;
let viewRotateZ = 0;

let viewShiftX = 0;
let viewShiftY = 0;
let viewShiftZ = 0;


//Thank you: w3schools.com/tags/canvas_getimagedata.asp
function create_image_old(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("scream");
	ctx.drawImage(img, 0, 0);

	var imgData = ctx.getImageData(0, 0, c.width, c.height);

	textureImage = new Uint8Array(4*texSize*texSize);

    var count=0;
    for(var i = 0; i < imageSize; i++){
		for(var j = 0; j < imageSize; j++){
			for(var k = 0; k < 4; k++){
				textureImage[count] = imgData.data[count]
				count+=1;
			}
		}
	}
}

/*
	Given a 1D array where containing the data in the RGBA order, with integer values between 0 and 255.
	The order goes by rows from the top-left pixel to the bottom-right.

	You access the image like ret[x][y][a]
*/
function convert_image_to_3D(image, width, height, channels=4){
	let ret = [];
	for (let i = 0; i < width; i++) {
		let temp1 = [];
		for (let j = 0; j < height; j++) {
			let temp2 = [];
			for (let k = 0; k < channels; k++) {
			  temp2.push(0);
			}
			temp1.push(temp2);
		}
		ret.push(temp1);
	}

	for(let count = 0; count < width*height*channels; count++){
		var x = Math.floor(count / (height * channels));
		var y = Math.floor((count / channels) % height);
		var z = count%4;

		ret[x][y][z] = image[count];
	}
	return ret;
}

/*
	Takes 3D array and for each 32 X 32 tile
	Adds 8 surronding tiles.
*/
function tile_image_3by3(image, width, height, channels=4, textureSize=32){
	var newRet = [];
	var newWidth = width*4;
	var newHeight = height*4;
	for (let i = 0; i < newWidth; i++) {
		let temp1 = [];
		for (let j = 0; j < newHeight; j++) {
			let temp2 = [];
			for (let k = 0; k < channels; k++) {
			  //temp2.push(1);
			}
			temp1.push([256,256,256,256]);
		}
		newRet.push(temp1);
	}

	for(let i = 0; i < width; i++){
		for(let j = 0; j < height; j++){
		//Find top left "square" that contains this pixel copy it nine times.
		var qi = Math.floor(i/textureSize);
		var qj = Math.floor(j/textureSize);

		var topI = (i%textureSize) + qi*textureSize*3;
		var topJ = (j%textureSize) + qj*textureSize*3;

		newRet[topI][topJ] = image[i][j];
		newRet[topI+textureSize][topJ] = image[i][j];
		newRet[topI+textureSize*2][topJ] = image[i][j];

		newRet[topI][topJ+textureSize] = image[i][j];
		newRet[topI][topJ+textureSize*2] = image[i][j];

		newRet[topI+textureSize][topJ+textureSize] = image[i][j];
		newRet[topI+textureSize][topJ+textureSize*2] = image[i][j];
		newRet[topI+textureSize*2][topJ+textureSize] = image[i][j];
		newRet[topI+textureSize*2][topJ+textureSize*2] = image[i][j];
		
		}
	}
	return newRet;
}

function convert_image_to_1D(image, width, height, channels=4){
	let ret = new Uint8Array(channels*width*height);

	var count = 0;
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			//This is for all the channels RGBA.
			for(var k = 0; k < 4; k++){
				ret[count] = image[i][j][k]
				count+=1;
			}
		}
	}
	return ret;

}


/*
	Going to make the size of textureImage 3 times as large.

	Need to find where the coordinates are calculated based on the textures.

	At the very bottom set_texture().
*/
function create_image(){
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	var img = document.getElementById("scream");
	ctx.drawImage(img, 0, 0);

	var imgData = ctx.getImageData(0, 0, c.width, c.height);

	textureImage = new Uint8Array(4*texSize*texSize);


    var count=0;
    for(var i = 0; i < imageSize; i++){
		for(var j = 0; j < imageSize; j++){
			//This is for all the channels RGBA.
			for(var k = 0; k < 4; k++){
				textureImage[count] = imgData.data[count]
				count+=1;
			}
		}
	}
	let image3D = convert_image_to_3D(textureImage, texSize, texSize, 4);
	image3D = tile_image_3by3(image3D,texSize,texSize,4);

	//displayImage3DArray(image3D, texSize*4, texSize*4);


	delete(textureImage);
	textureImage = convert_image_to_1D(image3D,texSize*4,texSize*4);

	delete(imdData);
	delete(image3D);
}

function displayImage3DArray(imageArray, width, height) {
    const canvas = document.getElementById("poop");
    const ctx = canvas.getContext("2d");

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const [r, g, b, a = 255] = imageArray[y][x]; // Assumes shape [height][width][3 or 4]

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = a;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function configure_texture(image){
	texture=gl.createTexture();
	gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize*4, texSize*4, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
   	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

//Thank you MDN webdocs
async function lockChangeAlert(){
	if(document.pointerLockElement===canvas || document.mozPointerLockElement===canvas){
		if(!isFocused)
			resumeMusic();
		isFocused = true;
		
		
		document.addEventListener("mousemove",mouseMoveUpdate,false);
	}else{
		document.removeEventListener("mousemove",mouseMoveUpdate,false);
		isFocused = false;
		pauseMusic();
	    canvas.blur();
	    canvas.classList.remove("pointer-lock-active");
	}
}

function computeShadowMatrix(lightPos, plane){
	const [lx, ly, lz, lw] = lightPos;
    const [a, b, c, d] = plane;

    const dot = a * lx + b * ly + c * lz + d * lw;

    const m = mat4(); // Start with identity

    for (let i = 0; i < 4; ++i) {
        for (let j = 0; j < 4; ++j) {
            m[i][j] = ((i === j ? dot : 0) - lightPos[i] * plane[j])/dot;
        }
    }

    return m;
}

var coorSys=[8.5,4];

window.onload = function init(){
	let startTime = performance.now();


	bodycontainer = document.getElementById('body')
	identityMatrix = mat4();
	worldMade=false;
	UACT = 0.001;
	//Assuming 50 X 50lastPos=[255,255]; WORLD_SIZE/2
	lastPos=[(WORLD_SIZE/2)*10+5,(WORLD_SIZE/2)*10+5];
	

	//This is our projection onto the z = -0.201 plane from the perspective of the light defined by the coordinate lPosition. 
	sMatrix = computeShadowMatrix(lPosition, vec4(0.0,0.0,1.0,0.201));
	sMatrixForPlayer = computeShadowMatrix(lPositionForPlayer, vec4(0.0,0.0,1.0,0.201));
	sMatrixForEnemy = computeShadowMatrix(lPositionForEnemy, vec4(0.0,0.0,1.0,0.201));		
	// Sets textureImage to contain colour values of "textures/textures.png".
	create_image();
	canvas = document.getElementById("gl-canvas");

	textCanvas = document.getElementById("text-canvas");
	context = textCanvas.getContext("2d");
	context.fillStyle = "#FFFFFF";
	context.clearRect(0,0,context.canvas.width,context.canvas.height);
	context.font = "18px "+FONT;

	gl = WebGLUtils.setupWebGL(canvas, {stencil:true, alpha: false, premultipliedAlpha: false});
	if(!gl){
		alert("Webl is not available")
	}



	newWaterNetworkID = 0;
	waterNetworkArray = [];
	//In controls.js, adds mouse functionality.
	/*
		It's all here.
	*/
	canvasEvents();
	
	//canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
	//canvas.requestPointerLock();
	document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
	canvas.onclick = async function() {
  		await canvas.requestPointerLock();
	};
	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
	
	//WebGL Setup
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.1,0.1,0.1,1.0);
	gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.polygonOffset(0.0, 0.0);
    
    gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.blendEquation( gl.FUNC_ADD );
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	
	gl.enable(gl.STENCIL_TEST);
	gl.clearStencil(0);
	vertices=[];
	normals=[];
	colours=[];
	texCoords=[];
	townFolkArray = new ProperArray();

	drawDeathArray = new ProperArray();

	player = new Player(10,10,-6);



	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
	modelViewMatrix = translate(0,0,0);
	modelViewMatrix = mult(modelViewMatrix, scale4(0.125,(1/4.5),0.1))
	modelViewMatrix = mult(modelViewMatrix,translate(-8,-4.5,0));


	viewModMatrixLoc = gl.getUniformLocation(program, "viewModMatrix");
	viewModMatrix = mat4();
	gl.uniformMatrix4fv( viewModMatrixLoc, false, flatten(viewModMatrix) );

	
	
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
	projectionMatrix=mat4();

	shadowMatrixLoc = gl.getUniformLocation( program, "shadowMatrix" );

	//Shadows
	sColor = gl.getUniformLocation(program, "sColor");
	gl.uniform4fv(sColor, flatten(vec4(1,1,1,1)));

	particleColorLoc = gl.getUniformLocation(program, "particleColor");
	gl.uniform4fv(particleColorLoc, flatten(vec4(1,0,0,1)));

	opacityFactorLoc = gl.getUniformLocation(program,"opacityFactor");
	gl.uniform1f(opacityFactorLoc,0.0);

	if(!testView){
		projectionMatrix = mat4(0.75,0,0,0  ,0,0.75,0,0   ,0,0,1,0   ,0,0,1,1);
		projectionMatrix = mat4(0.75,0,0,0  ,0,0.75,0,0   ,0,0,0.75,0   ,0,0,1,1);
		projectionMatrix = mult(projectionMatrix, rotateX(15));
		projectionMatrix = mult(projectionMatrix, translate(0,0.25,.25));
	}


	/*
		Don't run this until umm the menu is umm ready....
	*/
	if(LOAD_MENU){
		add_start_menu_elements();
		requestAnimationFrame(render_start_menu);
	}else{
		afterMenu();
	}
}

function afterMenu(){
	send_data_to_GPU();

	nQueue = new NotificationQueue();
	fQueue = new Queue();
	pQueue = new Queue();
	projectileArray = new ProperArray();
	enemyArray = new ProperArray();
	
	addToInventory();


	cursorBlockLoc = gl.getUniformLocation(program, "cursorBlock");
	gl.uniform1i(cursorBlockLoc, false);

	flashingLoc = gl.getUniformLocation(program, "flashing");
	gl.uniform1i(flashingLoc, false);

	isParticleLoc = gl.getUniformLocation(program, "isParticle");
	gl.uniform1i(isParticleLoc, false);

	isCeilingLoc = gl.getUniformLocation(program, "isCeiling");
	gl.uniform1i(isCeilingLoc, false);

	inDungeonLoc = gl.getUniformLocation(program, "inDungeon");
	gl.uniform1i(inDungeonLoc, false);

	universalEnemyId=0;


	viewMatrix = translate(1,1,0);
	viewMatrix = mult(viewMatrix, scale4(0.125,(1/4.5),0.1));
	viewMatrix = mult(viewMatrix,translate(-8,-4.5,0));


	unrotatedViewMatrix = translate(1,1,0);
	unrotatedViewMatrix = mult(unrotatedViewMatrix, scale4(0.125,(1/4.5),0.1));
	unrotatedViewMatrix = mult(unrotatedViewMatrix,translate(-8,-4.5,0));

	

	viewMatrixUI = translate(-1,0,0);
	viewMatrixUI = mult(viewMatrixUI, scale4(0.125,(1/4.5),0.1));
	viewMatrixUI = mult(viewMatrixUI,translate(0,-4.5,0));


	//viewMatrixFixed = translate(0,0,0);
	//viewMatrixFixed = mult(viewMatrixFixed, scale4(0.125,(1/4.5),0.1));
	//viewMatrixFixed = mult(viewMatrixFixed,translate(-8,-4.5,0));
	//viewMatrixFixed = mult(viewMatrixFixed,translate(-8,-4.75,0));	
	set_toolbar_matrices();


	disableNotifications = false;
	requestAnimationFrame(render);
}


//May aswell put projectiles in here aswell
var woodStart;
var testStart;;
var weirdStart;
var grassStart;
var dirtStart;
var woodLogStart;
var woodBranchStart;
var stoneBlockStart;
var doorStart;
var dungeonCeilingStart;
var axeStart;
var pickaxeStart;
var bowStart;
var arrowStart;
var arrowHB;
var dropBoxStart;
var brickStart;
var copperStart;

/*
	For grid mode
*/
var gridModeFrameStart;
var gridModeFrameNum;
var gridModeFrameStart1;
var gridModeFrameNum1;

var simpleBlocks = [];
var nonActionableItems = [];

function send_block(){
	woodStart = vertices.length;
	sendWood = new WoodBlock();
	sendWood.sendData();

	testStart = vertices.length;
	sendTest = new TestBlock();
	sendTest.sendData();

	initialize_simpleBlocks();
	for(let i = 0; i < simpleBlocks.length; i++){
		simpleBlocks[i].index = vertices.length;
		simpleBlocks[i].sendData();
	}

	initializeNonActionableItems();
	for(let i = 0; i < nonActionableItems.length; i++){
		nonActionableItems[i].index = vertices.length;
		nonActionableItems[i].sendData();
		nonActionableItems[i].numberOfVerts = vertices.length - nonActionableItems[i].index; 
	}

	dirtStart = vertices.length;
	sendDirt = new DirtBlock();
	sendDirt.sendData();

	woodLogStart = vertices.length;
	sendWoodLog = new WoodLog();
	sendWoodLog.sendData();

	woodBranchStart = vertices.length;
	sendWoodBranch = new WoodBranch();
	sendWoodBranch.sendData();

	stoneBlockStart = vertices.length;
	sendStoneBlock = new StoneBlock();
	sendStoneBlock.sendData();

	copperStart = vertices.length;
	(new CopperStone()).sendData();
	(new LuniteStone()).sendData();
	(new DaytumStone()).sendData();

	(new LatkinStone()).sendData();
	(new IllsawStone()).sendData();
	(new PlatinumStone()).sendData();

	doorStart = vertices.length;
	sendDoor = new Door();
	sendDoor.sendData();

	dungeonCeilingStart = vertices.length;
	sendDungeonCeiling = new DungeonCeiling();
	sendDungeonCeiling.sendData();

	axeStart = vertices.length;
	sendWoodAxe = new WoodAxe();
	sendWoodAxe.sendData();

	pickaxeStart = vertices.length;
	sendPickaxe = new StonePickaxe();
	sendPickaxe.sendData();

	//Pickaxes
	(new CopperPickaxe()).sendData();
	(new LatkinPickaxe()).sendData();
	(new IllsawPickaxe()).sendData();
	(new PlatinumPickaxe()).sendData();
	(new LunitePickaxe()).sendData();
	(new DaytumPickaxe()).sendData();


	/*
		Recipes for tools / bars.
	*/
	//Bar recipes
	CopperBarRecipe.sendData();
	LatkinBarRecipe.sendData();
	IllsawBarRecipe.sendData();
	PlatinumBarRecipe.sendData();
	LuniteBarRecipe.sendData();
	DaytumBarRecipe.sendData();

	//Pick recipes
	CopperPickRecipe.sendData();
	LatkinPickRecipe.sendData();
	IllsawPickRecipe.sendData();
	PlatinumPickRecipe.sendData();
	LunitePickRecipe.sendData();
	DaytumPickRecipe.sendData();

	//Axe recipes
	CopperAxeRecipe.sendData();
	LatkinAxeRecipe.sendData();
	IllsawAxeRecipe.sendData();
	PlatinumAxeRecipe.sendData();
	LuniteAxeRecipe.sendData();
	DaytumAxeRecipe.sendData();

	//Sword recipes
	CopperSwordRecipe.sendData();
	LatkinSwordRecipe.sendData();
	IllsawSwordRecipe.sendData();
	PlatinumSwordRecipe.sendData();
	LuniteSwordRecipe.sendData();
	DaytumSwordRecipe.sendData();


	//Bow recipes
	WoodenBowRecipe.sendData();


	//Swords
	StoneSword.sendData();
	CopperSword.sendData();
	LatkinSword.sendData();
	IllsawSword.sendData();
	PlatinumSword.sendData();
	LuniteSword.sendData();
	DaytumSword.sendData();

	//Axes
	CopperAxe.sendData();

	LatkinAxe.sendData();
	IllsawAxe.sendData();
	PlatinumAxe.sendData();
	LuniteAxe.sendData();
	DaytumAxe.sendData();




	//Misc
	(new ClayBlock()).sendData();

	//Buckets
	WoodenBucket.sendData();

	bowStart = vertices.length;
	sendBow = new WoodenBow();
	sendBow.sendData();

	arrowStart = vertices.length;
	sendArrow = new Arrow(0,0);
	sendArrow.sendData();

	arrowHB = vertices.length;
	sendArrow.sendHitBoxData();

	dropBoxStart = vertices.length;
	(new DropBox()).sendData();

	gridModeFrameStart = vertices.length;
	//wireframe_prism(vec3(0,0,0), vec3(1,1,1));
	build_grid_mode_wireframe(1, vec4(1,1,1,0.15));
	gridModeFrameNum = vertices.length - gridModeFrameStart;


	gridModeFrameStart1 = vertices.length;
	build_grid_mode_wireframe(1, vec4(1,1,1,0.09));
	gridModeFrameNum1 = vertices.length - gridModeFrameStart1;



}
function clear(){
	vertices=[];
	normals=[];
	vertCoords=[];
	colours=[];
	blocks=[];
}
var lastByte;
var numberOfBytes;
var numberOfByte=[];
var cursorBytes=[];
var cursorBlock;
//I hate to keep defining the start of vertex positions like this, I obviously need to change it, for now it will
//suffice, but I've been saying that about a lot of things...
var startPositionOfGreenWireframe;
var totalVerticesOfGreenWireframe;

var bowVectorStart=0;
var particleStart;
var undeadHitboxStart;
var undeadHitboxSize;

var enemyVertices = [];
var enemyHitboxVertices = [];
function send_data_to_GPU(){
	clear();
	init_player();
	gl.lineWidth(1);
	player.sendData();
	send_block();
	bowVectorStart=vertices.length;
	make_bow_vector();
	lastByte = vertices.length;
	push_wireframe_indices(vec3(-0.25,-0.25,3.9),vec3(0.25,0.25,1.25));
	//push_wireframe_indices(player.returnBounds()[0],player.returnBounds()[1]);
	numberOfBytes = add_collision_bound();
	numberOfByte[0] = vertices.length;
	//Make this larger and then add semi transpaerent aronud it
	push_wireframe_indices(vec3(0,0,0),vec3(1,1,1));
	numberOfByte[1] = vertices.length-numberOfByte[0];
	numberOfByte[2] = vertices.length;
	build_inventory();
	numberOfByte[3] = vertices.length-numberOfByte[2];

	build_interface();

	startPositionOfGreenWireframe = vertices.length;
	push_wireframe_indices(vec3(-0.0125,-0.0125,-0.0125),vec3(1.0125,1.0125,1.0125),vec4(0.5,1,0.25,0.5));
	totalVerticesOfGreenWireframe = vertices.length-startPositionOfGreenWireframe;

	/*
		Adding updated cursors. Note: cursorBytes[i][0] is the starting point, and cursorBytes[i][1] is the number of vertices.
		cursorBytes[0] is associated with the player holding no object. 
		cursorBytes[1] is associated with the green cursor block/tool lines.
		cursorBytes[2] is associated with the red cursor block/tool lines.
		cursorBytes[3] is associated with the green block/tool cursor.
		cursorBytes[4] is associated with the red block/tool cursor.
		cursorBytes[5] is associated with the blue block/tool cursor (this is used to look like a blue print for recipes.)
	*/
		// Holding nothing.
		cursorBytes.push([vertices.length,null]);
		vertices.push(vec3(0.5,0.5,0));
		colours.push(vec4(1,1,1,1));
		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
		cursorBytes[0][1] = vertices.length-cursorBytes[0][0];

		// Cursor lines green.
		cursorBytes.push([vertices.length,0]);
		build_cursor_lines_green();
		cursorBytes[1][1] = vertices.length-cursorBytes[1][0];

		// Cursor lines red.
		cursorBytes.push([vertices.length,0]);
		build_cursor_lines_red();
		cursorBytes[2][1] = vertices.length-cursorBytes[2][0];

		// Holding block. (GREEN)
		cursorBytes.push([vertices.length,0]);
		build_thick_wireframe(1, vec4(0.2,1,0.4,1), vec4(0,1,0,0.3));
		cursorBytes[3][1] = vertices.length-cursorBytes[3][0];
	
		// Holding block. (RED)
		cursorBytes.push([vertices.length,0]);
		build_thick_wireframe(1, vec4(1,0,0,1), vec4(1,0,0,0.3));
		cursorBytes[4][1] = vertices.length-cursorBytes[4][0];

		// Holding block. (Blue)
		cursorBytes.push([vertices.length,0]);
		build_thick_wireframe(1, vec4(1,1,1,1), recipeColor);
		cursorBytes[5][1] = vertices.length-cursorBytes[5][0];
	
	/*
		Updated cursors end.
	*/

	/*
		Particles (particle really.)
	*/
	particleStart = vertices.length;
	vertices.push(vec3(0.5,0.5,0));
	colours.push(vec4(0,0,0,1));
	texCoords.push(vec2(2.0,2.0));
	normals.push(vec3(0,0,0));

	/*
		Push undead wireframe.
		This should be abstracted to all enemies.
	*/
	Undead.sendData();

	undeadHitboxStart = vertices.length;
	push_wireframe_indices(undeadHitboxBounds[0],undeadHitboxBounds[1]);
	undeadHitboxSize = vertices.length - undeadHitboxStart;


	TownFolk.sendData();


	ArrowBlockHitBox.sendData();


	/*
		Sets enemyVertices. E.g.,
		enemyVertices[i] = [vertStart, numVerts].

		For example,
		enemyVertices[0] represents the vertices for the roller. 
	*/
	let ENEMIES = [new Roller(), new Finder()];

	for(let i = 0; i < ENEMIES.length; i++){
		enemyVertices.push([vertices.length,0]);
		ENEMIES[i].sendData();
		enemyVertices[i][1] = vertices.length - enemyVertices[i][0];
	}

	// Now do the same thing for enemy hitboxes: "enemyHitboxVertices".
	for(let i = 0; i < ENEMIES.length; i++){
		enemyHitboxVertices.push([vertices.length,0]);
		ENEMIES[i].sendHitboxData();
		enemyHitboxVertices[i][1] = vertices.length - enemyHitboxVertices[i][0];
	}
	//Should delete all the enemies in ENEMIES!

	bind_and_send();
	if(worldMade==false){
		worldMade=true;
		make_world();
	}
	init_world();
	get_scene();
	removeBlock = new NullifierBlock();
}


//Pushes the indices for the 
function push_wireframe_indices(pointOne, pointTwo,c=vec4(1,0,0,0.75)){
	var v = [];
	v[0] = vec3(pointOne[0],pointOne[1],pointOne[2]);
	v[1] = vec3(pointTwo[0],pointOne[1],pointOne[2]);
	v[2] = vec3(pointTwo[0],pointTwo[1],pointOne[2]);
	v[3] = vec3(pointOne[0],pointTwo[1],pointOne[2]);

	v[4] = vec3(pointOne[0],pointOne[1],pointTwo[2]);
	v[5] = vec3(pointTwo[0],pointOne[1],pointTwo[2]);
	v[6] = vec3(pointTwo[0],pointTwo[1],pointTwo[2]);
	v[7] = vec3(pointOne[0],pointTwo[1],pointTwo[2]);
	var pushVerts = [v[0],v[1],v[1],v[2],v[2],v[3],v[3],v[0], v[4],v[5],v[5],v[6],v[6],v[7],v[7],v[4],v[0],v[4],v[1],v[5],v[2],v[6],v[3],v[7]];
	for(var i = 0; i < pushVerts.length; i++){
		vertices.push(pushVerts[i]);
		colours.push(c);

		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

//This will be for the transparent box surrounding the cursor cube,
function push_cube_indices(pointOne, pointTwo,c=vec4(1,0,0,1)){
	var v = [];
	v[0] = vec3(pointOne[0],pointOne[1],pointOne[2]);
	v[1] = vec3(pointTwo[0],pointOne[1],pointOne[2]);
	v[2] = vec3(pointTwo[0],pointTwo[1],pointOne[2]);
	v[3] = vec3(pointOne[0],pointTwo[1],pointOne[2]);

	v[4] = vec3(pointOne[0],pointOne[1],pointTwo[2]);
	v[5] = vec3(pointTwo[0],pointOne[1],pointTwo[2]);
	v[6] = vec3(pointTwo[0],pointTwo[1],pointTwo[2]);
	v[7] = vec3(pointOne[0],pointTwo[1],pointTwo[2]);
	var pushVerts = [v[0],v[1],v[2] ,v[2],v[2],v[3] ,v[3],v[0],v[4] ,v[5],v[5],v[6] ,v[6],v[7],v[7] ,v[4],v[0],v[4] ,v[1],v[5],v[2] ,v[6],v[3],v[7]];
	for(var i = 0; i < pushVerts.length; i++){
		vertices.push(pushVerts[i]);
		colours.push(c);

		texCoords.push(vec2(2.0,2.0));
		normals.push(vec3(0,0,0));
	}
}

function add_collision_bound(){
	return vertices.length-lastByte;
}

var pX, pY, pZ, bX, bY, bZ;
var allBlocks;
var drawBlocks;
var leftBlocks,rightBlocks,upBlocks,downBlocks;
function clear_block_col(){
	allBlocks=[];
	pX = Math.floor(player.returnBounds()[0][0]);
	pY = Math.floor(player.returnBounds()[0][1]);
	pZ = Math.floor(player.returnBounds()[0][2]);
}
function add_block_to_draw_list(block, drawDistanceX, drawDistanceY){
	bX = block.returnPos()[0];
	bY = block.returnPos()[1];
	bZ = block.returnPos()[2];
	DDLeft = pX - this.drawDistanceX;
	DDRight = pX + this.drawDistanceX;
	DDUp = pY + this.drawDistanceY;
	DDDown = pY - this.drawDistanceY; 
	if((pX==bX)&&(pY==bY))
			return true;
	if((bX<=DDRight)&&(bX>=DDLeft)&&(bY<=DDUp)&&(bY>=DDDown))
			return true;
	return false;
}
function add_block_to_list(block){
	bX = block.returnPos()[0];
	bY = block.returnPos()[1];
	bZ = block.returnPos()[2];
	//Should check for z-axis...
	//bZ + 2 is for dirt blocks!

	//if(bZ == pZ || bZ == pZ-1 || bZ == pZ + 2){
	if(bZ == -3 || bZ == -4 || bZ == -1){
		if((pX==bX)&&(pY==bY))
			return true;
		if((pX == bX) && ((bY==(pY+1))||(bY==(pY-1))))
			return true;
		if((pX == (bX+1))&&(pY == (bY+1)))
			return true;
		if((pX == (bX+1))&&(pY == (bY-1)))
			return true;
		if((pX == (bX-1))&&(pY == (bY+1)))
			return true;
		if((pX == (bX-1))&&(pY == (bY-1)))
			return true;
		if((pY == bY) && ((bX==(pX+1))||(bX==(pX-1))))
			return true;
	}
	return false;
}

var colLeft=false;
var colRight=false;
var colUp=false;
var colDown=false;
/*
	This stores the current room of the dungeon the player is in.
	It's value is changed in the render_data(); function, when the player
	passes through a ShiftBlock.
*/
var currentRoom = [6,3];

//For some reason, this represents the 'height' of the red collision box. I have no idea
//why I did this, but I'm too lazy to change it, so whateva.
//Also as more of a note from a gameplay stance, the idea that this value should even change
//at all is an important concern. Allowing the player to change this might give too much 
//freedom in terms of the ability to manipulate the world, which is not really the game
//I want to create. Focus on adventure, with the building aspects being a secondary component.
var upOne=-3;
//var scroll = upOne;
var scroll = 0;
var scrollCooldown = 0;
var print=false;
var currentPortion;
var newPortion;
var universalCounter=0;
var blockCounter=0;
const blockCounterMax=120;
var updateUnimportantMethods = false;
var cursorCoordinates=[];
//Make a counter that updates every second for unimportant methods...
var frameCount = 0;

let bgX = 0;

function render_data(){

	//Don't think it's necessary to set light each time.
	set_light();

	/*
		Update body background position
	*/
	gl.uniformMatrix4fv( viewModMatrixLoc, false, flatten(mat4()) );
	frameCount = (frameCount+1)%60;
	if(scrollCooldown > 0){
		scrollCooldown--;
	}

	if(playPauseCooldown > 0)
		playPauseCooldown--;
	//text_log(upOne);
	//text_log(genNewDungeon);

	if(cursorDisplayTimer < cursorFramesToDisappear)
		cursorDisplayTimer+=1

	shiftCoolDown--;
	shiftTransition--;
	if(isShifting){
		shiftFixedView();
	}

	//lowLevelChange = false;

	if(projectileCooldown > 0){
		projectileCooldown--;
	}
	
	updateLogic();

	if(!hold)
		blockCounter=0;
	check_player_action();
	if(universalCounter>=15){
		universalCounter=0;
		//You can shut this off when computers are bad, so only use this for superficial stuff
		updateUnimportantMethods=true;
		//This is why the cursor color takes so long to update, but what was I thinking? This can't be that resource intensive!
		
	}updateCursorColour();
	update_scene_data();
	context.clearRect(0,0,context.canvas.width,context.canvas.height);

	nQueue.updateNotifications();
	drawBlocks=[];
	/*
		DO NOT NEED TO CALCULATE THE MODEL VIEW EACH LOOP LOOK AT IT!!
	*/
	if(!fixedView){
		if(IS_FILMING){
			drawDistanceX = 40;//Math.round(20*(slider.value/10));
			drawDistanceY = 24;	
		}else{
			drawDistanceX = 20;//Math.round(20*(slider.value/10));
			drawDistanceY = 12;//Math.round(10*(slider.value/10));
		}
		viewMatrix = unrotatedViewMatrix;
		modelViewMatrix = viewMatrix;

	}else{
		drawDistanceX = 40;
		drawDistanceY = 20;
		modelViewMatrix = viewMatrixFixed;
	}
	set_mv()
	if(fQueue.isEmpty()==false)
		fQueue.peek().run();

	if(inventory)
		draw_inventory();

	/*
		Draw popups
	*/
	set_light_full();
	if(pQueue.isEmpty()==false){
		let popup = pQueue.peek();
		if(popup.isDead){
			pQueue.dequeue();
		}else{
			pQueue.peek().draw();
		}
	}

	reset_mv();
	reset_pv();


	/*
		Zoom animation.
	*/
	if(isZooming){



		if(isZoomingIn){
			if(filmZoom){
				if(curZoomFrame < 61){
					viewRotateX+=5/numFramesToZoom;	
				}
				viewShiftZ-=(1/5)/numFramesToZoom;
				viewShiftY-=(0.5/5)/numFramesToZoom;
			}else{
				if(zoomOutLevel < 3){
					viewRotateX+=5/numFramesToZoom;	
				}
				viewShiftZ-=(1/5)/numFramesToZoom;
				viewShiftY-=(0.5/5)/numFramesToZoom;
			}
		}

		else{

			if(DEV_TOOLS)
				viewRotateX = Math.max(-15, viewRotateX - 5/numFramesToZoom);	
			else
				viewRotateX-=5/numFramesToZoom;
			viewShiftZ+=(1/5)/numFramesToZoom;
			viewShiftY+=(0.5/5)/numFramesToZoom;
		}

		if(curZoomFrame > 1){
			curZoomFrame--;
		}else{
			isZooming = false;
			curZoomFrame = 0;
		}
	}


	viewModMatrix = translate(viewShiftX, viewShiftY, viewShiftZ);
	viewModMatrix = mult(viewModMatrix,rotateX(viewRotateX));
	viewModMatrix = mult(viewModMatrix,rotateY(viewRotateY));
	viewModMatrix = mult(viewModMatrix,rotateZ(viewRotateZ));

	gl.uniformMatrix4fv( viewModMatrixLoc, false, flatten(viewModMatrix) );

	
	set_light();
	//What do??? I have a tendancy to add irrelevant comments, I hope these never see the light of day, but incase they do I apologize,
	//because it's kind of counter intuitive to the idea of adding comments. I'll probably be the only one reading these so it doesn't matter
	//... I'm, very tired right now.
	//Is set to settle down, take a look around you, no more dreaming to be found.
	clear_block_col();
	
	updateUpOne();
	player.stopKnockback([colLeft,colRight,colUp,colDown]);
	colLeft=false;
	colRight=false;
	colUp=false;
	colDown=false
	
	/*
		Change the light position and ambient lighting for the player.
		I do this purely for aesthetic purporses. 
	*/
	ambientProductPlayer = vec4(0.9, 0.9, 0.9, 1);
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(vec4(0.7, 0.7, 0.7, 1.0)));


	// HERE!!!
	//console.log('Test', viewMatrix)
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(vec4(0.0, 0.0, -0.1, 1.0)) );

	//gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten( mult(inverseMatrix, vec4(0.0, 0.0, -1/100, 1.0) ) ) );


	//gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(worldScreen) );
	
	player.draw();
	/*
		Reset light position and ambient lighting after drawing player.
	*/
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));




	if(fixedView){
		set_mv(translate(player.posX,player.posY,player.posZ))
	}else{
		set_mv(translate(0,0,player.posZ))
	}

	// Draw player hitbox.
	if(hitBox){
		gl.drawArrays(gl.LINES,lastByte,numberOfBytes);
	}

	if(fixedView){
		modelViewMatrix = viewMatrixFixed;
		set_mv(translate(player.posX,player.posY,player.posZ));
	}else{
		modelViewMatrix = mult(viewMatrix, translate(-player.posX, -player.posY, 0));
	}

	set_mv();
	set_light();
	var tbd=[];
	if(projectileArray.isEmpty()==false){
		for(var i=0;i<projectileArray.getLength();i++){
			if(projectileArray.accessElement(i).markedToDestroy==true){
				tbd.push(i);
			}else{
				projectileArray.accessElement(i).draw();
				projectileArray.accessElement(i).checkCollisions();
			}
		}
		for(var i=0;i<tbd.length;i++)
			projectileArray.removeElement(tbd[i]);
	}
	tbd=[];
	if(enemyArray.isEmpty()==false){
		for(var i=0;i<enemyArray.getLength();i++){
			if(enemyArray.accessElement(i).deathMarker==true){
				
			}else{
				enemyArray.accessElement(i).updatePosition();
			}
		}
		for(var i=0;i<enemyArray.getLength();i++){
			if(enemyArray.accessElement(i).deathMarker==true){
				tbd.push(i);
				if(enemyArray.accessElement(i).drawDeathTimer){
					let animation = new Animation(1,false);
					function anim(val){return val-0.04;}
					function stop(val){if(val <= 0) return true; return false;}
					animation.addPhase(anim,stop);
					animation.startAnimation();
					drawDeathArray.push([enemyArray.accessElement(i).posX,enemyArray.accessElement(i).posY, animation,enemyArray.accessElement(i).silverDropped ]);

				}
			}else{
				enemyArray.accessElement(i).draw();
			}
		}
		for(var i=0;i<tbd.length;i++)
			enemyArray.removeElement(tbd[i]);
	}

	if(drawDeathArray.isEmpty()==false){
		for(let i = 0; i < drawDeathArray.getLength(); i++){
			if(drawDeathArray.accessElement(i)[2].currentPhase != -1){
				let opac = drawDeathArray.accessElement(i)[2].getOutput()
				if(!(inventory|| inFunction)){
					let drawHeight = 0.25;
					let c = vec4(0,drawHeight,0,1);
					let zVal = -6+1.25;//opacity add here
					c = mult(translate( drawDeathArray.accessElement(i)[0], drawDeathArray.accessElement(i)[1],zVal), c);
					c = mult(modelViewMatrix, c);
					c = mult(projectionMatrix, c);

					c = [(c[0]/c[3]+1)*8,(c[1]/c[3]+1)*4.5-opac*0.1];
					
					draw_centered_text_with_opacity(c[0], c[1], "+"+drawDeathArray.accessElement(i)[3].toString()+" Silver", opac,'11');
				}
			}
		}
	}

	if(townFolkArray.isEmpty()==false){
		for(var i=0;i<townFolkArray.getLength();i++){
			townFolkArray.accessElement(i).draw();
		}
	}


	let fluids = [];
	for(var i = 0; i < blocks.length; i++){
		
		if(add_block_to_draw_list(blocks[i],drawDistanceX, drawDistanceY)){
			if(!blocks[i].isFluid){
				blocks[i].draw();
			}else{
				fluids.push(blocks[i]);
				continue;
			}
			
			if(add_block_to_list(blocks[i])){
				var directions = colDirection(player,blocks[i]);

				/*
					This is where you handle player collisions with blocks.

					Why is this not handled in the player class?!?! :/
				*/
				if(colRight == false && directions[RIGHT]){
					if(blocks[i].type != 'SPECIAL_BLOCK'){
						colRight = true;
	    				blocks[i].intersect();
	    			}else{
	    				// Update location in dungeon, and update the visited rooms.
	    				if(blocks[i].objectNumber == 512 && shiftCoolDown <= 0){
	    					currentRoom = [currentRoom[0], currentRoom[1]+1];
	    					//Ensure that current room is still on grid.
	    					if(currentRoom[1] < gridSize){//CHECK BOUND ON CURRENTROOM[0]
	    						visitedGrid[currentRoom[0]][currentRoom[1]] = true;
	    						viewedGrid[currentRoom[0]][currentRoom[1]] = false;
	    					}
	    				}
	    				blocks[i].intersect(RIGHT);
	    			}
				}

				if(colLeft == false && directions[LEFT]){
					if(blocks[i].type != 'SPECIAL_BLOCK'){
		    			colLeft = true;
		    			blocks[i].intersect();
		    		}else{
		    			// Update location in dungeon, and update the visited rooms.
		    			if(blocks[i].objectNumber == 512 && shiftCoolDown <= 0){
	    					currentRoom = [currentRoom[0], currentRoom[1]-1];
	    					//Ensure that current room is still on grid.
	    					if(currentRoom[1] >= 0){ //CHECK BOUND ON CURRENTROOM[0]
	    						visitedGrid[currentRoom[0]][currentRoom[1]] = true;
	    						viewedGrid[currentRoom[0]][currentRoom[1]] = false;
	    					}
		    			}
	    				blocks[i].intersect(LEFT);
		    		}
		    	}
		    	if(colUp == false && directions[TOP]){
		    		if(blocks[i].type != 'SPECIAL_BLOCK'){
		    			colUp = true;
		    			blocks[i].intersect();
		    		}else{
		    			// Update location in dungeon, and update the visited rooms.
		    			if(blocks[i].objectNumber == 512 && shiftCoolDown <= 0){
	    					currentRoom = [currentRoom[0]-1, currentRoom[1]];
	    					//Ensure that current room is still on grid.
	    					if(currentRoom[0] >= 0){//CHECK BOUND ON CURRENTROOM[1]
	    						visitedGrid[currentRoom[0]][currentRoom[1]] = true;
	    						viewedGrid[currentRoom[0]][currentRoom[1]] = false;
	    					}
		    			}
	    				blocks[i].intersect(TOP);
		    		}
		    	}
		    	if(colDown == false && directions[BOTTOM]){
		    		if(blocks[i] != null && blocks[i].type != 'SPECIAL_BLOCK'){
		    			colDown = true;
		    			blocks[i].intersect();
		    		}else{
		    			// Update location in dungeon, and update the visited rooms.
		    			if(blocks[i] != null && blocks[i].objectNumber == 512 && shiftCoolDown <= 0){
	    					currentRoom = [currentRoom[0]+1, currentRoom[1]];
	    					//Ensure that current room is still on grid.
	    					if(currentRoom[0] < gridSize){//CHECK BOUND ON CURRENTROOM[1]
	    						visitedGrid[currentRoom[0]][currentRoom[1]] = true;
	    						viewedGrid[currentRoom[0]][currentRoom[1]] = false;
	    					}
		    			}
	    				if(blocks[i] != null) blocks[i].intersect(BOTTOM);
		    		}
		    	}
			}
		}
	}
	/*
		Now draw fluids
		Maybe do the stencil thing and seperate top and side blocks?
	*/
	gl.enable(gl.STENCIL_TEST);
	gl.stencilMask(0xFF);
	gl.stencilFunc(gl.EQUAL, 0, 0xFF);
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
	//gl.uniform1i(isCeilingLoc, true);



	
	for(var i = 0; i < fluids.length; i++){
		fluids[i].drawTopFace();
	}
	for(var i = 0; i < fluids.length; i++){
		fluids[i].draw();
	}

	gl.uniform1i(isCeilingLoc, false);
	gl.disable(gl.STENCIL_TEST);


	var transparentBlocksNeg6 = [];
	var transparentBlocksNeg5 = [];
	for(var i = 0; i < ceilingBlocks.length; i++){

		if(add_block_to_draw_list(ceilingBlocks[i],drawDistanceX, drawDistanceY)){
			var block = ceilingBlocks[i];
			if(block.isCeiling){
				if(block.posZ == -6 || block.posZ == -7){
					transparentBlocksNeg6.push(block);
				}else{
					//transparentBlocksNeg5.push(block);
					block.draw();
				}
			}else{
				block.draw();
			}
			
		}
	}


	gl.clearStencil(0);
	gl.clear(gl.STENCIL_BUFFER_BIT);
	//DRAW SHADOWS
	//gl.enable( gl.BLEND );
	//gl.blendEquation( gl.FUNC_ADD );
	//gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
		//gl.disable(gl.BLEND);
	gl.enable(gl.STENCIL_TEST);
	gl.stencilMask(0xFF);
	gl.stencilFunc(gl.EQUAL, 0, 0xFF);
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                            
    gl.uniform4fv(sColor, flatten(vec4(0.0,0.0,0.0,0.4)));
    gl.uniformMatrix4fv( shadowMatrixLoc, false, flatten(sMatrix));

    // HERE!!!

	//I could just add them to an array (above) and not have to recompute them
	for(var i = 0; i < blocks.length; i++){
		if(add_block_to_draw_list(blocks[i],drawDistanceX, drawDistanceY)){
			if(!blocks[i].isFluid)
				blocks[i].drawShadows();
		}
	}
	for(var i = 0; i < ceilingBlocks.length; i++){
		if(add_block_to_draw_list(ceilingBlocks[i],drawDistanceX, drawDistanceY)){
			ceilingBlocks[i].drawShadows();
		}
	}

	//Here
	if(projectileArray.isEmpty()==false){
		for(var i=0;i<projectileArray.getLength();i++){		
				projectileArray.accessElement(i).drawShadows();
			
		}
	}

	gl.uniform4fv(sColor, flatten(vec4(0.0,0.0,0.0,0.1)));
	gl.uniformMatrix4fv( shadowMatrixLoc, false, flatten(sMatrixForEnemy));
	if(enemyArray.isEmpty()==false){
		for(var i=0;i<enemyArray.getLength();i++){
			enemyArray.accessElement(i).drawShadows();
		}
	}

	gl.uniform4fv(sColor, flatten(vec4(0.0,0.0,0.0,0.2)));
	
	/*
		Temporarily disable shadows for player under fixed view.
	*/
	if(!fixedView){
		gl.uniformMatrix4fv( shadowMatrixLoc, false, flatten(sMatrixForPlayer));
		player.drawShadows();
		//HERE

		
		
	}else{

	}
	gl.disable(gl.STENCIL_TEST);
	//--------------
	gl.uniform4fv(sColor, flatten(vec4(1,1,1,1)));

	//gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix));
    if(!fastMode){
	    if(colRight)
	    	isStopRight = true;
	    else
	    	isStopRight = false;

	    if(colLeft)
	    	isStopLeft = true;
	    else
	    	isStopLeft = false;

	    if(colUp)
	    	isStopUp = true;
	    else
	    	isStopUp = false;

	    if(colDown)
	    	isStopDown = true;
	    else
	    	isStopDown = false;
	}else{
		isStopRight = false;
		isStopLeft = false;
		isStopUp = false;
		isStopDown = false;
	}

	/*
		Draw cursor.
	*/

	// Set views.
	if(fixedView){
		modelViewMatrix = viewMatrixFixed;
		set_mv(translate(player.posX,player.posY,player.posZ));
	}else{
		modelViewMatrix = viewMatrix;
		set_mv(translate(0,0,player.posZ));
		modelViewMatrix = mult(viewMatrix, translate(-player.posX, -player.posY, 0));
	}

	if(upOne >= -4)
		draw_cursor_full();

	
	/*
		Process particles from back to front!
	*/	
	gl.uniform1i(isParticleLoc, true);
	if (particles.length > 0){
		const n = particles.length-1;
		for(let i = n; i >= 0; i--){
			particles[i].draw();

			if(!particles[i].isAlive()){
				delete particles[i];
				particles.splice(i,1);
			}
		}
	}
	gl.uniform1i(isParticleLoc, false);

	/*
		Draw transparent ceiling blocks.
	*/

	gl.clearStencil(0);
	gl.clear(gl.STENCIL_BUFFER_BIT);
	//DRAW SHADOWS
	//gl.enable( gl.BLEND );
	//gl.blendEquation( gl.FUNC_ADD );
	//gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

	gl.enable(gl.STENCIL_TEST);
	gl.stencilMask(0xFF);
	gl.stencilFunc(gl.EQUAL, 0, 0xFF);
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
                        	

    set_light();
	gl.uniform1i(isCeilingLoc, true);

	/*
	for(var i = 0; i < transparentBlocksNeg5.length; i++){
		if(add_block_to_draw_list(transparentBlocksNeg5[i],drawDistanceX, drawDistanceY)){
			transparentBlocksNeg5[i].drawTopBlock();
		}
	}
	for(var i = 0; i < transparentBlocksNeg5.length; i++){
		if(add_block_to_draw_list(transparentBlocksNeg5[i],drawDistanceX, drawDistanceY)){
			transparentBlocksNeg5[i].draw();
		}
	}
	*/
	gl.uniform1i(isCeilingLoc, false);
	gl.disable(gl.STENCIL_TEST);

	if(upOne == -5)
		draw_cursor_full();

	gl.enable(gl.STENCIL_TEST);
	gl.stencilMask(0xFF);
	gl.stencilFunc(gl.EQUAL, 0, 0xFF);
	gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
	gl.uniform1i(isCeilingLoc, true);

	if(fixedView){
		gl.uniform1i(inDungeonLoc, true);
	}else{
		gl.uniform1i(inDungeonLoc, false);
	}

	for(var i = 0; i < transparentBlocksNeg6.length; i++){
		if(add_block_to_draw_list(transparentBlocksNeg6[i],drawDistanceX, drawDistanceY)){
			transparentBlocksNeg6[i].drawTopBlock();
		}
	}
	for(var i = 0; i < transparentBlocksNeg6.length; i++){
		if(add_block_to_draw_list(transparentBlocksNeg6[i],drawDistanceX, drawDistanceY)){
			transparentBlocksNeg6[i].draw();
		}
	}

	gl.uniform1i(isCeilingLoc, false);
	gl.disable(gl.STENCIL_TEST);

	if(upOne <= -6)
		draw_cursor_full();




	/*
		Toolbar should be with no modelViewMatrix modifications.
	*/

	gl.uniformMatrix4fv( viewModMatrixLoc, false, flatten(mat4()) );




	// Reset light for toolbar and map.
	set_light();




	/*
		Draw toolbar and map.
		Basically, I'll just do this in clip space with x,y,z in [-1, 1]
		Then set projection and model view matrices to the identity.
	*/
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(identityMatrix));
	//
	if(!PICTURE_MODE){
		draw_tool_bar();
		draw_toolbar_items();
	}
	if(!inventory && !inFunction){
		if(fixedView)
			draw_map();
	}

	





	// Reset projection matrix.
	gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    click=false;
    //removeBlock = new NullifierBlock();
    universalCounter++;
    blockCounter++;
    updateUnimportantMethods=false;
    //updateToolBar();

    // Draw players health bar
    //draw_healthbar(0.5, 7.4979, 5.3, 7.81084, 49)
    //Can you pixToCan but once you're done calculate all the numbers!

    // Maybe bottom right?
    let pinch = 0.1;
    if(!PICTURE_MODE)
    	draw_healthbar(0.5+pinch, pixToCanY(615+12), 5.3-pinch, pixToCanY(623+9), Math.max(player.health,0), player.maxHealth);
    

    // Should draw enemies health bars.


    if(inventory || inFunction){
		draw_inventory_cursor_overlay();
    }
    checkHovering();

    if(player.health<=0 && !player.isDead){
    	player.kill();
    }else if(player.health<=0){
    	onDeath();
    }

    //draw_centered_text(1,15, "FPS: "+averageFPS.toString(), '11');
    
    if(DEV_TOOLS){
    	//draw_centered_text(14, 1, "FPS: "+(averageFPS.toFixed(2)).toString());
    }
    //UNFOCUSED OVERLAY
	if(!isFocused){
		var offset = 0.5;
		draw_filled_box(0,0,16,9,'rgba(0,0,0,0)','rgba(0,0,0,0.5)');
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]+1.5+offset, "Press on the window to begin playing!");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]+1+offset, "Use 'WASD' to move.")
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]+0.5+offset, "Press 'space' to sprint.")
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]+offset, "Press '~' to open inventory.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-0.5+offset, "Left click to use tools and place blocks.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-1+offset, "Right click to interact with blocks.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-1.5+offset, "Scroll or use 'Q' and 'E' to adjust cursor.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-2+offset, "Press 'G' to toggle grid mode.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-2.5+offset, "Use arrow up and arrow down to zoom the camera.");
		draw_centered_text(centerCoordinates[0], centerCoordinates[1]-4, "VoxelVale "+GAME_VERSION, '11');
	}
	//console.log(lowLevelChange)
	updateEndLogic();
}


/*
	Moving forward any logic updates should happen here.
*/
var logicCounter = 0;
function updateLogic(){
	
	/*
		Spawning undead enemies.
	*/

	// Roughly every second try to spawn an enemy.
	if(logicCounter == 0){
		if(Math.random() <= SPAWN_RATE && SPAWN_ENEMIES && enemyArray.getLength() < MAX_ENEMIES_IN_WORLD){
			spawnEnemy()
		}
	}

	//Moved to player.js
	//if(player.heldObject != null){
	//	player.heldObject.updateWhenHeld();
	//}




	logicCounter = (logicCounter + 1)%60;
}

function updateEndLogic(){

	/*
		Update water network!
	*/

	//waterNetworkArray
	/*
		SHOULD ONLY UPDATE IF YOU ARE SIGNIFICANTLY CLOSE.
		(Better solution see delete)
	*/
	if(logicCounter%10 == 0){
		let numAlive = 0;
		let deadNetworkIndices = [];
		for(let i = 0; i < waterNetworkArray.length; i++){
			if(waterNetworkArray[i].isAlive){
				if(waterNetworkArray[i].requiresUpdate){
					//if(lowLevelChange)
					//	waterNetworkArray[i].updateCooldown = 20;	
					waterNetworkArray[i].update();

				}
				
				numAlive++;
			}else{
				waterNetworkArray[i].kill();
				deadNetworkIndices.push(i);
			}
		}

		/*
			Clean up dead networks.
		*/
		for(let i = deadNetworkIndices.length-1; i >= 0; i--){
			waterNetworkArray[deadNetworkIndices[i]] = waterNetworkArray[waterNetworkArray.length-1];
			waterNetworkArray.pop();
		}

		/*
			Redo these.
		*/
		//console.log('Number of active water networks:', numAlive);
		//console.log('Array size:', waterNetworkArray.length);
	}
}

const NO_ITEM_HELD = 0;
const BLOCK_HELD = 1; 
const TOOL_HELD = 2;
const BOW_HELD = 3;
const SWORD_HELD = 4;

var currentlyHeldObject = 0;

function draw_cursor_full(){
	if(!inventory && !inFunction && !player.isDead){
		
		if(player.heldObject != null){
			if(player.heldObject.typeOfObj === 'BLOCK'){
				set_light_full();
				if(!gridMode)
					draw_cursor_block( (coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5,upOne,player.heldObject);
				else{
					draw_cursor_block( Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne,player.heldObject);
					draw_grid_mode_cursor(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne)
				}
				currentlyHeldObject = BLOCK_HELD;
			}
			else{
				if(player.heldObject.toolType == 'SWORD'){
					set_light_full();
					draw_cursor_point((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5,-3);
					currentlyHeldObject = SWORD_HELD;
				}
				else if(blockCursor){
					set_light_full();
					if(!gridMode)
						draw_cursor((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5,upOne);
					else
						draw_cursor(Math.round((coorSys[0]+player.posX)-9),Math.round((coorSys[1]+player.posY)-4.5),upOne);
					currentlyHeldObject = TOOL_HELD;
				}else{
					//AND HERE
					//upOne = -3;
					//upOneStore = upOne;

					draw_bow_vector((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5,-3);
					currentlyHeldObject = BOW_HELD;
				}
			}
		
		}else{
			set_light_full();
			//AND HERE
			draw_cursor_point((coorSys[0]+player.posX)-9,(coorSys[1]+player.posY)-4.5,-3);
			currentlyHeldObject = NO_ITEM_HELD;
			
		}
		cursorCoordinates[0]=(coorSys[0]+player.posX)-9;
		cursorCoordinates[1]=(coorSys[1]+player.posY)-4.5;
		set_light();
	}
}

function set_light(){
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPosition) );
    gl.uniform1f(gl.getUniformLocation(program,"shininess"),materialShininess);
}

function set_light_arrow_vector(lightPos){
	gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(lightPos) );	
}

function set_light_full(){
	gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(vec4(1.0,1.0,1.0,1.0)));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(vec4(1.0,1.0,1.0,1.0)));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),flatten(vec4(1.0,1.0,1.0,1.0)));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),flatten(vec4(1.0,1.0,1.0,1.0)));
}






/*
	STARTING MENU.

	Need menus for:
		- World selection.
		- How to play.
		- Account information.

*/
const MAIN_MENU = 0;
const WORLD_SELECT = 1;
const HOW_TO_PLAY = 2;
const ACC_INFO = 3;


let activeMenu = 0;
let currentMenuElements;

let startMenuElements = [];
let worldSelectionElements = [];
let howToPlayElements = [];
let accInfoElements = [];


let menuBackground;
let menuOverlay;

function add_start_menu_elements(){
	menuLogo = document.getElementById("menuLogo");
	menuBackground = document.getElementById("menuBG");
	menuOverlay = document.getElementById("menuOverlay");
	

	/*
		For the main menu
	*/
	let buttonHeight = 0.6;
	let eY = 0.1;
	let startGame = new InterfaceMenuButton(5,4-buttonHeight + eY, 16-5,4 + eY,function(){activeMenu = WORLD_SELECT},"Start Game");
	startMenuElements.push(startGame);

	let howToPlay = new InterfaceMenuButton(5,4-buttonHeight-0.85 + eY, 16-5,4-0.85 + eY,function(){activeMenu = HOW_TO_PLAY},"How to Play");
	startMenuElements.push(howToPlay);
	
	startMenuElements.push(new InterfaceMenuButton(5,4-buttonHeight-0.85*2 + eY, 8-0.125,4-0.85*2 + eY,openLoginPopup,"Login", function(){if(!loggedIn)return true; return false}));
  	startMenuElements.push(new InterfaceMenuButton(8+0.125,4-buttonHeight-0.85*2 + eY,11,4-0.85*2 + eY,openRegisterPopup,"Sign up", function(){if(!loggedIn)return true; return false}));
  	startMenuElements.push(new InterfaceMenuButton(5,4-buttonHeight-0.85*2 + eY, 11,4-0.85*2 + eY,displayAccountInformation,"Account Information", function(){if(loggedIn)return true; return false}));

  

  	/*
		For world selection.
  	*/
	let test = new InterfaceCanvasButton(5.5,3.25, 7.5,3.75,function(){console.log('test')},"End");
	worldSelectionElements.push(test);


	/*
		For how to play.
	*/
	//howToPlayText
	for(let i = 0; i < howToPlayText.length; i++){
		//x1, y1, "text", textSize, isLeft
		howToPlayElements.push(new InterfaceText(8,6.8-i/2,howToPlayText[i],'18',false));
	}

	howToPlayElements.push(new InterfaceMenuButtonLarge(8,2,function(){activeMenu = MAIN_MENU;},"Back"));






	// Make sure the active menu when starting is the main menu.
	activeMenu = MAIN_MENU;
}

let logoScale = 1;
let logoGrow = true;

let backgroundX = 0;
let backgroundY = 0;

function render_start_menu(now){
	/*
		Clear the screen before drawing next frame.
	*/
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
	context.clearRect(0,0,context.canvas.width,context.canvas.height);





	//Top Left
	context.drawImage(menuBackground, backgroundX,backgroundY,canvas.width,canvas.height);
	//Top Right
	context.drawImage(menuBackground, canvas.width+backgroundX,backgroundY,canvas.width,canvas.height);
	//Bottom Left
	context.drawImage(menuBackground, backgroundX,backgroundY+canvas.height,canvas.width,canvas.height);
	//Bottom Right
	context.drawImage(menuBackground, canvas.width+backgroundX,backgroundY+canvas.height,canvas.width,canvas.height);

	backgroundX = (backgroundX - 0.1)%canvas.width;
	backgroundY = (backgroundY - 0.1)%canvas.height;

	context.globalAlpha=0.8;
	context.drawImage(menuOverlay, 0,0,canvas.width,canvas.height);
	context.globalAlpha=1;


	switch(activeMenu){
		case MAIN_MENU:
			currentMenuElements = startMenuElements;
			break;
		case WORLD_SELECT:
			currentMenuElements = worldSelectionElements;
			break;
		case HOW_TO_PLAY:
			currentMenuElements = howToPlayElements;
			break;
		case ACC_INFO:
			currentMenuElements = accInfoElements;
			break;
	}


	// Draw logo if on main menu screen
	if(activeMenu == MAIN_MENU){
		if(logoGrow){
			logoScale+=0.00025;
			if(logoScale >= 1){
				logoGrow = false;
				logoScale = 1;
			}
		}else{
			logoScale-=0.00025;
			if(logoScale <= 0.95){
				logoGrow = true;
				logoScale = 0.95;
			}
		}
		let logoWidth = (menuLogo.width/1.75)*(logoScale)*canvas_multiplier;
		let logoHeight = (menuLogo.height/1.75)*(logoScale)*canvas_multiplier;

		let logoXStart = canvas.width/2-logoWidth/2;
		let logoYStart = (menuLogo.height/1.75)*canvas_multiplier*(1-logoScale/2)- canvas.height/7;

		let logoXEnd = logoXStart + logoWidth;
		let logoYEnd = logoYStart + logoHeight;

		context.drawImage(menuLogo, logoXStart,logoYStart,logoWidth, logoHeight);
	}



	for(let i = 0; i < currentMenuElements.length; i++){
		currentMenuElements[i].draw();
	}



	draw_centered_text(centerCoordinates[0], centerCoordinates[1]-4, "VoxelVale " + GAME_VERSION, '11');



	draw_inventory_cursor_overlay();
	// Request new frame.
	window.requestAnimFrame(render_start_menu);	
}


/*
	For getting fps. https://webglfundamentals.org/webgl/lessons/webgl-qna-recording-fps-in-webgl.html
*/
const fpsElem = document.querySelector("#fps");
let then = 0;


const frameTimes = [];
let   frameCursor = 0;
let   numFrames = 0;   
const maxFrames = 20;
let   totalFPS = 0;
let averageFPS=0;

function render(now){
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

	

	//Do menus here?

    render_data();

	
	//draw_fps(now);	

    window.requestAnimFrame(render);
}

function draw_fps(now){
	now *= 0.001;                          // convert to seconds
	const deltaTime = now - then;          // compute time since last frame
	then = now;                            // remember time for next frame
	const fps = 1 / deltaTime;             // compute frames per second
	totalFPS += fps - (frameTimes[frameCursor] || 0);
	frameTimes[frameCursor++] = fps;
	numFrames = Math.max(numFrames, frameCursor);
	frameCursor %= maxFrames;
	averageFPS = totalFPS / numFrames;

	draw_centered_text(15, 0.5,"FPS:"+(Math.round(averageFPS*100)/100).toString());
}


function bind_and_send(){
	/*
		Vertices
	*/
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	/*
		Normals
	*/
	var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );


    /*
		Colours
    */
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colours), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	/*
		Textures
	*/
	tBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

	var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
	gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false,0,0);
	gl.enableVertexAttribArray(vTexCoord);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(texture, 0);

	configure_texture(textureImage);
}

/*
	Instead of console.log you can use this to display something that updates.
*/
function text_log(text){
	document.querySelector("#textlog").textContent = text;
}

function set_ui_pv(pv2=translate(0,0,0)){
	var pv = mat4();	
	pv = mult(pv,pv2);
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(pv) );
}

function reset_pv(){
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix));
}

function set_mv(mv=translate(0,0,0)){
	gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mult(modelViewMatrix,mv)) );
}

function get_mv(){
	return modelViewMatrix;
}

function set_mv_ui(mv=translate(0,0,0)){
	if(fixedView)
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mult(viewMatrixUI,mv)) );
	else{
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mult(viewMatrix,mv)) );
	}
}

function set_mv_id(mat=mat4()){
	gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(mat) );	
}

function reset_mv(){
	gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
}

function default_push(v1, v2, v3, c1=vec4(1,1,1,1),c2=vec4(1,1,1,1),c3=vec4(1,1,1,1)){
	vertices.push(v1);
	vertices.push(v2);
	vertices.push(v3);

	colours.push(c1);
	colours.push(c2);
	colours.push(c3);

    var cross1 = subtract(v2,v1); 
	var cross2 = subtract(v3,v1);
	var norm =negate((cross(cross1, cross2)));
	norm = vec3(norm);
	for(var i =0; i < 3; i++)
		normals.push(norm);

    return;
}

//0 - 15
//Here!
function set_texture_old(texLoc=0, oX=0.0065, oY=0.0065){
	if(texLoc == 16){
		for(var i =0; i < 6; i++)
			texCoords.push(vec2(2.0,2.0));
		return;
	}
	var s = 8;
	//var offsetX = 0.0065;
	//var offsetY = 0.0065;
	var offsetX = oX;
	var offsetY = oY;
	var xStart = (texLoc%8)+offsetX;
	var yStart = (Math.floor(texLoc/8))+offsetY;

	var xEnd = xStart+1-(2*offsetX);
	var yEnd = yStart+1-(2*offsetY);

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));

	return;
}


/*
	Now instead of 8X8 it should be (8*3) X (8*3).
	Then I can probably just set the offset to 0.

	Okay so coordinates here are (0,0) (assume bottom left) to (1,1) (assume top right).

	The image is of size 1024 x 1024, but the only area that's filled is 768 X 768.



*/
function set_texture(texLoc=0, oX=0.0065, oY=0.0065){
	/*
	if(texLoc == 16){
		for(var i =0; i < 6; i++)
			texCoords.push(vec2(2.0,2.0));
		return;
	}*/
	var s = 8;
	//var offsetX = 0.0065;
	//var offsetY = 0.0065;
	var offsetX = oX;
	var offsetY = oY;
	var xStart = (texLoc%8)+offsetX;
	var yStart = (Math.floor(texLoc/8))+offsetY;

	var xEnd = xStart+1-(2*offsetX);
	var yEnd = yStart+1-(2*offsetY);


/*
	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));
*/
	//Assume we have (i,j) (row, column) coordinates
	var row = Math.floor(texLoc%8);
	var col = Math.floor(texLoc/8);

	var xStart = 32 + row*(3*32);
	var xEnd = xStart + 32;
	var yStart = 32 + col*(3*32);
	var yEnd = yStart + 32;

	var s = 1024;

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xStart/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yStart/s));

	texCoords.push(vec2(xStart/s,yEnd/s));
	texCoords.push(vec2(xEnd/s,yStart/s));
	texCoords.push(vec2(xEnd/s,yEnd/s));

	return;
}


let isZooming = false;
let isZoomingIn = false;

let filmZoom = false;

let curZoomFrame = 0;
let numFramesToZoom = 20;

function zoomOut(){
	if(DEV_TOOLS){
		if(zoomOutLevel >= 6) return;
	}else{
		if(zoomOutLevel >= 2) return;
	}
	if(isZooming) return;

	isZooming = true;
	isZoomingIn = false;

	curZoomFrame = 20;
	zoomOutLevel++;
	/*	
	viewRotateX-=5;
	viewShiftZ+=1/5;
	viewShiftY+=0.5/5;
	zoomOutLevel++;
	*/
}

function zoomIn(){

	if(DEV_TOOLS){
		if(zoomOutLevel <= -2) return;
	}else{
		if(zoomOutLevel <= 0) return;
	}

	
	if(isZooming) return;

	isZooming = true;
	isZoomingIn = true;

	curZoomFrame = 20;
	zoomOutLevel--;
	/*
	viewRotateX+=5;
	viewShiftZ-=1/5;
	viewShiftY-=0.5/5;
	zoomOutLevel--;
	*/
}


function zoomOutFilm(){
	if(DEV_TOOLS){
		if(zoomOutLevel >= 6) return;
	}else{
		if(zoomOutLevel >= 2) return;
	}
	if(isZooming) return;

	isZooming = true;
	isZoomingIn = false;

	curZoomFrame = 140;
	//curZoomFrame = 230;
	zoomOutLevel++;
	/*	
	viewRotateX-=5;
	viewShiftZ+=1/5;
	viewShiftY+=0.5/5;
	zoomOutLevel++;
	*/
}

function zoomInFilm(){

	if(DEV_TOOLS){
		if(zoomOutLevel <= -2) return;
	}else{
		if(zoomOutLevel <= 0) return;
	}
	filmZoom = true;
	
	if(isZooming) return;

	isZooming = true;
	isZoomingIn = true;

	curZoomFrame = 140;
	zoomOutLevel--;
	/*
	viewRotateX+=5;
	viewShiftZ-=1/5;
	viewShiftY-=0.5/5;
	zoomOutLevel--;
	*/
}