
/*
	Todo: Randomize track order.

*/

const backgroundMusicTracks = [
	'voxelvale/sounds/music/nature sketch.wav',
	'voxelvale/sounds/music/ChillLofiR.mp3',
	'voxelvale/sounds/music/oldcitytheme.mp3',
	'voxelvale/sounds/music/snow_city.mp3',
	'voxelvale/sounds/music/towntheme.mp3',


	//New tracks
	//'voxelvale/sounds/music/save.mp3' ()
	'voxelvale/sounds/music/d.mp3',
	'voxelvale/sounds/music/8_bit_memory_indie_proj_2_ma.mp3',
	'voxelvale/sounds/music/indieproj.mp3',
	'voxelvale/sounds/music/drm.mp3',
	//'voxelvale/sounds/music/hungrytribes.mp3',

];

const backgroundMusicTracksNames = [
	'Nature Theme',
	'Chill lofi',
	'Old City Theme',
	'Snow City',
	'Town Theme',

	//New tracks
	//'Forest', (Might be good for dungeon)
	'Small Town',	//Not a starter
	'8-Bit Summer Memory', //Not a starter
	'8 Bit Prairie',
	'Dreamlike State',
	//'Hungry Tribes', (Might be good for dungeon)

];

const backgroundMusicTracksArtists = [
	'remaxim',
	'omfgdude',
	'remaxim',
	'Tarush Singhal',
	'remaxim',

	//New tracks
	//'Tarush Singhal',
	'Tarush Singhal',
	'Tarush Singhal',
	'Tarush Singhal',
	'Tarush Singhal',
	//'remaxim',

];

const dungeonMusicTracks=[];

let currentTrack = Math.floor(Math.random() * backgroundMusicTracks.length);
let backgroundMusic = new Audio();
backgroundMusic.volume = 0.2;
var currentTrackInfo = backgroundMusicTracksNames[currentTrack] + ' | ' + backgroundMusicTracksArtists[currentTrack];


var musicPlaying;
var playPauseCooldown = 0;

function getCurrentTrackInfo(){
	return currentTrackInfo;
}

/*
	This is where the music is started.

	random start song
*/
function playMusic(){
	musicPlaying = true;
	backgroundMusic.src = backgroundMusicTracks[currentTrack];
	backgroundMusic.play();
}

function resumeMusic(){
	if(playPauseCooldown > 0)
		return;
	playPauseCooldown = 20;
	musicPlaying = true;
	//backgroundMusic.src = backgroundMusicTracks[currentTrack];
	backgroundMusic.play();
}

function pauseMusic(){
	if(playPauseCooldown > 0)
		return;
	playPauseCooldown = 20;
	musicPlaying = false;
	backgroundMusic.pause();	
}

function skipMusic(){
	musicPlaying = true;
	currentTrack = (currentTrack + 1)%backgroundMusicTracks.length;
	backgroundMusic.src = backgroundMusicTracks[currentTrack];
	backgroundMusic.play();
	currentTrackInfo = backgroundMusicTracksNames[currentTrack] + ' | ' + backgroundMusicTracksArtists[currentTrack];
}


backgroundMusic.addEventListener('ended', () => {
	currentTrack = (currentTrack + 1)%backgroundMusicTracks.length;
	currentTrackInfo = backgroundMusicTracksNames[currentTrack] + ' | ' + backgroundMusicTracksArtists[currentTrack];
	playMusic();
});


