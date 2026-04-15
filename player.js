const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
// The 10-hour test video ID
const TEST_VIDEO_ID = "EColTNIbOko"; 

let ytPlayer;
let isEngineReady = false;
let isBiosMode = false;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-engine', {
        height: '36',
        width: '64',
        playerVars: {
            'listType': 'playlist',
            'list': MUSIC_PLAYLIST_ID,
            'playsinline': 1,
            'controls': 0,
            'enablejsapi': 1,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': (e) => { isEngineReady = true; e.target.setPlaybackQuality('tiny'); },
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.BUFFERING || event.data == YT.PlayerState.PLAYING) {
        // If we are NOT in BIOS mode, keep it tiny. If we ARE, go High Quality.
        if(!isBiosMode) {
            event.target.setPlaybackQuality('tiny');
        } else {
            event.target.setPlaybackQuality('hd720'); 
        }
    }
    btnLoadSong.style.backgroundColor = (event.data == YT.PlayerState.PLAYING) ? "green" : "yellow";
}

startOverlay.onclick = function() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
        setTimeout(() => { ytPlayer.pauseVideo(); }, 300);
    }
    startOverlay.style.display = 'none';
};

// MUSIC CONTROLS
btnLoadSong.onclick = () => {
    if(!isEngineReady) return;
    isBiosMode = false;
    ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID, suggestedQuality: 'tiny' });
};

btnPlay.onclick = () => ytPlayer.playVideo();
btnStop.onclick = () => ytPlayer.stopVideo();
btnPause.onclick = () => ytPlayer.pauseVideo();
document.getElementById('btn-next').onclick = () => ytPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => ytPlayer.previousVideo();

// THE TEST SWITCH: Open BIOS plays the 10h video
document.getElementById('btn-open-bios').onclick = function() {
    isBiosMode = true;
    
    // 1. Hide the UI
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.remove('hidden');

    // 2. Make YouTube FULL SCREEN
    const ytDiv = document.getElementById('youtube-engine');
    ytDiv.style.width = "100vw";
    ytDiv.style.height = "100vh";
    ytDiv.style.bottom = "0";
    ytDiv.style.right = "0";
    ytDiv.style.opacity = "1";
    ytDiv.style.zIndex = "1500"; // Put it behind the Exit button but above UI

    // 3. Load the 10h Video
    ytPlayer.loadVideoById(TEST_VIDEO_ID);
};

document.getElementById('btn-exit-viz').onclick = function() {
    isBiosMode = false;

    // 1. Restore the UI
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');

    // 2. Make YouTube TINY again
    const ytDiv = document.getElementById('youtube-engine');
    ytDiv.style.width = "64px";
    ytDiv.style.height = "36px";
    ytDiv.style.bottom = "10px";
    ytDiv.style.right = "10px";
    ytDiv.style.opacity = "0.5";
    ytDiv.style.zIndex = "1000";

    // 3. Go back to the music playlist
    ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
};
