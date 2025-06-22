
/*
	Todo: Randomize track order.

*/

const backgroundMusicTracks = [
	'voxelvale/code/sounds/music/nature sketch.wav',
	'voxelvale/code/sounds/music/ChillLofiR.mp3',
	'voxelvale/code/sounds/music/old city theme.ogg',
	'voxelvale/code/sounds/music/snow_city.mp3',
	'voxelvale/code/sounds/music/town theme_0.flac',

];

const backgroundMusicTracksNames = [
	'Nature Theme',
	'Chill lofi',
	'Old City Theme',
	'Snow City',
	'Town Theme'
];

const backgroundMusicTracksArtists = [
	'remaxim',
	'omfgdude',
	'remaxim',
	'Tarush Singhal',
	'remaxim'
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


