


var audioContext = new (window.AudioContext || window.webkitAudioContext)();
const masterGain = audioContext.createGain();
masterGain.gain.value = 0.125;
masterGain.connect(audioContext.destination);

let soundBuffers = {};

async function loadSound(name, url){
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	soundBuffers[name]= await audioContext.decodeAudioData(arrayBuffer);
}

async function initAudio(){
	await Promise.all([
		// Dirt steps.
		loadSound('stepdirt1', 'voxelvale/sounds/effects/dirtsteps/stepdirt_1.wav'),
		loadSound('stepdirt2', 'voxelvale/sounds/effects/dirtsteps/stepdirt_2.wav'),
		loadSound('stepdirt3', 'voxelvale/sounds/effects/dirtsteps/stepdirt_3.wav'),
		loadSound('stepdirt4', 'voxelvale/sounds/effects/dirtsteps/stepdirt_4.wav'),
		loadSound('stepdirt5', 'voxelvale/sounds/effects/dirtsteps/stepdirt_5.wav'),
		loadSound('stepdirt6', 'voxelvale/sounds/effects/dirtsteps/stepdirt_6.wav'),
		loadSound('stepdirt7', 'voxelvale/sounds/effects/dirtsteps/stepdirt_7.wav'),
		loadSound('stepdirt8', 'voxelvale/sounds/effects/dirtsteps/stepdirt_8.wav'),

		// Stone steps.
		loadSound('stepstone1', 'voxelvale/sounds/effects/stonesteps/stepstone_1.wav'),
		loadSound('stepstone2', 'voxelvale/sounds/effects/stonesteps/stepstone_2.wav'),
		loadSound('stepstone3', 'voxelvale/sounds/effects/stonesteps/stepstone_3.wav'),
		loadSound('stepstone4', 'voxelvale/sounds/effects/stonesteps/stepstone_4.wav'),
		loadSound('stepstone5', 'voxelvale/sounds/effects/stonesteps/stepstone_5.wav'),
		loadSound('stepstone6', 'voxelvale/sounds/effects/stonesteps/stepstone_6.wav'),
		loadSound('stepstone7', 'voxelvale/sounds/effects/stonesteps/stepstone_7.wav'),
		loadSound('stepstone8', 'voxelvale/sounds/effects/stonesteps/stepstone_8.wav'),

		// Wood steps.
		loadSound('stepwood1', 'voxelvale/sounds/effects/woodsteps/stepwood_1.wav'),
		loadSound('stepwood2', 'voxelvale/sounds/effects/woodsteps/stepwood_2.wav'),
		
		// Swishes.
		loadSound('swish1', 'voxelvale/sounds/effects/swishes/swish-1.wav'),
		loadSound('swish2', 'voxelvale/sounds/effects/swishes/swish-2.wav'),
		loadSound('swish3', 'voxelvale/sounds/effects/swishes/swish-3.wav'),
		loadSound('swish4', 'voxelvale/sounds/effects/swishes/swish-4.wav'),
		loadSound('swish5', 'voxelvale/sounds/effects/swishes/swish-5.wav'),
		loadSound('swish6', 'voxelvale/sounds/effects/swishes/swish-6.wav'),
		loadSound('swish7', 'voxelvale/sounds/effects/swishes/swish-7.wav'),
		loadSound('swish8', 'voxelvale/sounds/effects/swishes/swish-8.wav'),

		// Bow shoot
		loadSound('shoot', 'voxelvale/sounds/effects/bowandarrow/shoot.wav'),

		// Impacts.
		loadSound('metal', 'voxelvale/sounds/effects/impact/metal.wav'),
		loadSound('stone', 'voxelvale/sounds/effects/impact/stone.wav'),
		loadSound('wood', 'voxelvale/sounds/effects/impact/wood.wav'),
		loadSound('dirt', 'voxelvale/sounds/effects/impact/dirt.wav'),	//https://opengameart.org/content/stop

		//Placing blocks.
		loadSound('placed1', 'voxelvale/sounds/effects/placed/placed1.wav'),
		loadSound('placed2', 'voxelvale/sounds/effects/placed/placed2.wav'),
		loadSound('placed3', 'voxelvale/sounds/effects/placed/placed3.wav'),


		// UI SOUNDS

		// Buying / selling
		loadSound('buysell', 'voxelvale/sounds/effects/uisounds/coinsplash.wav'),

		// Click
		loadSound('click', 'voxelvale/sounds/effects/uisounds/click.wav'),
	]);
}

//blockOnTopOf block.sound == 'WOOD', 'DIRT' or 'STONE'

/*
	================ WALKING ON DIRT ====================
	Will need spatial audio when in dungeon.
	Don't worry about this for now.
*/
var dirtSoundCooldown = 0;
function soundWalkOnDirt(){
	if(dirtSoundCooldown > 0){
		dirtSoundCooldown--;
		return;
	}else{
		dirtSoundCooldown = 35;
	}
	/*
		Math.floor(Math.random() * exclusive) 
	*/
	let randomNumber = Math.floor(Math.random() * 8);
	let buffer = null;
	if(blockOnTopOf==null) return;

	switch(blockOnTopOf.sound){
		case 'DIRT':
			buffer = soundBuffers['stepdirt'+(randomNumber+1).toString()];
			break;
		case 'STONE':
			buffer = soundBuffers['stepstone'+(randomNumber+1).toString()];
			break;

		case 'WOOD':
			buffer = soundBuffers['stepwood'+(randomNumber%2+1).toString()];
			break;
	}
	//let buffer = soundBuffers['stepdirt1'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	//gainNode.connect(audioContext.destination);

	source.start();
}
function soundStopOnDirt(){
	dirtSoundCooldown = 3;
}

/*
	Determine what sound player swinging tool makes.
	(Can do this based on if the cursor is green or not)
*/
var swishSoundCooldown = 0;
function sound_StartSwinging(){
	if(cursorGreen && selectedBlock != null){
		if(selectedBlock.tob == 'WOOD'){
			sound_WoodImpact();
		}else{
			if(selectedBlock.objectNumber == 2 || selectedBlock.objectNumber == 27)
				sound_DirtImpact();
			else
				sound_StoneImpact();
		}
	}else{
		sound_SwishStart();	
	}
	
}


/*
	================ EMPTY SWING ====================
*/
function sound_SwishStart(){
	let randomNumber = Math.floor(Math.random() * 8);
	let buffer = soundBuffers['swish'+(randomNumber+1).toString()];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}

function sound_StoneImpact(){
	let buffer = soundBuffers['metal'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}

function sound_WoodImpact(){
	let buffer = soundBuffers['stone'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}

function sound_DirtImpact(){
	let buffer = soundBuffers['dirt'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}




function sound_StopSwinging(){}

/*
	Placing block sound
*/

function sound_PlaceBlock(block){
	let randomNumber = Math.floor(Math.random() * 8);
	let buffer = null;
	if(block==null) return;

	switch(block.sound){
		case 'DIRT':
			buffer = soundBuffers['placed1'];//+(randomNumber+1).toString()];
			break;
		case 'STONE':
			buffer = soundBuffers['placed1'];//+(randomNumber+1).toString()];
			break;

		case 'WOOD':
			buffer = soundBuffers['placed1'];//+(randomNumber%2+1).toString()];
			break;
	}
	//let buffer = soundBuffers['stepdirt1'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	//gainNode.connect(audioContext.destination);

	source.start();
}

/*
	Arrow shoot sound,
*/
function sound_ArrowShoot(){
	let buffer = soundBuffers['shoot'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}

function sound_BuySell(){
	let buffer = soundBuffers['buysell'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}


function sound_Click(){
	let buffer = soundBuffers['click'];
	if(buffer == null) return;
	
	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(masterGain);
	source.start();
}











