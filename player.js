const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
// Replace this with the ID of your recorded BIOS/Viz video!
const BIOS_VIDEO_ID = "YOUR_RECORDED_VIDEO_ID_HERE"; 

let ytPlayer;
let isEngineReady = false;

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
        // We only use tiny quality when the video is SMALL in the corner
        if(!document.getElementById('visualizer-overlay').classList.contains('visible')) {
            event.target.setPlaybackQuality('tiny');
        } else {
            event.target.setPlaybackQuality('hd720'); // High quality when watching the "BIOS"
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
    ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID, suggestedQuality: 'tiny' });
};

btnPlay.onclick = () => ytPlayer.playVideo();
btnStop.onclick = () => ytPlayer.stopVideo();
btnPause.onclick = () => ytPlayer.pauseVideo();
document.getElementById('btn-next').onclick = () => ytPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => ytPlayer.previousVideo();

// THE NINJA SWITCH: Use the "Open BIOS" button to play the video
document.getElementById('btn-open-bios').onclick = function() {
    // 1. Hide the UI
    document.getElementById('main-ui').classList.add('hidden');
    const viz = document.getElementById('visualizer-overlay');
    viz.classList.remove('hidden');
    viz.classList.add('visible');

    // 2. Make the YouTube Player BIG
    const ytDiv = document.getElementById('youtube-engine');
    ytDiv.style.width = "100%";
    ytDiv.style.height = "100%";
    ytDiv.style.bottom = "0";
    ytDiv.style.right = "0";
    ytDiv.style.opacity = "1";

    // 3. Load the recorded BIOS video
    ytPlayer.loadVideoById(BIOS_VIDEO_ID);
};

document.getElementById('btn-exit-viz').onclick = function() {
    // 1. Restore the UI
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');

    // 2. Make the YouTube Player TINY again
    const ytDiv = document.getElementById('youtube-engine');
    ytDiv.style.width = "64px";
    ytDiv.style.height = "36px";
    ytDiv.style.bottom = "10px";
    ytDiv.style.right = "10px";
    ytDiv.style.opacity = "0.5";

    // 3. Go back to the music playlist
    ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
};
