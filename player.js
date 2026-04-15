const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const ytDiv = document.getElementById('youtube-engine');
const videoUI = document.getElementById('video-ui-overlay');
const mainUI = document.getElementById('main-ui');

const MUSIC_PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
const TEST_VIDEO_ID = "EColTNIbOko"; 

let ytPlayer;
let isEngineReady = false;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-engine', {
        height: '100%',
        width: '100%',
        playerVars: {
            'listType': 'playlist',
            'list': MUSIC_PLAYLIST_ID,
            'playsinline': 1,
            'controls': 0,
            'modestbranding': 1,
            'iv_load_policy': 3
        },
        events: {
            'onReady': () => { isEngineReady = true; },
            'onStateChange': (e) => {
                btnLoadSong.style.backgroundColor = (e.data == YT.PlayerState.PLAYING) ? "green" : "yellow";
            }
        }
    });
}

startOverlay.onclick = function() {
    if (ytPlayer && isEngineReady) {
        ytPlayer.playVideo();
        setTimeout(() => { ytPlayer.pauseVideo(); }, 500);
    }
    startOverlay.style.display = 'none';
};

// MUSIC CONTROLS
btnLoadSong.onclick = () => ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
btnPlay.onclick = () => ytPlayer.playVideo();
document.getElementById('btn-stop').onclick = () => ytPlayer.stopVideo();
document.getElementById('btn-pause').onclick = () => ytPlayer.pauseVideo();
document.getElementById('btn-next').onclick = () => ytPlayer.nextVideo();
document.getElementById('btn-prev').onclick = () => ytPlayer.previousVideo();

// VISUALS TRIGGER (Middle Button)
document.getElementById('btn-viz-toggle').onclick = function() {
    // 1. Swap Video
    ytPlayer.loadVideoById(TEST_VIDEO_ID);
    // 2. Bring Video to front
    ytDiv.classList.add('full-mode');
    videoUI.classList.remove('hidden');
    mainUI.classList.add('hidden');
};

// BACK BUTTON
document.getElementById('btn-exit-viz').onclick = function() {
    // 1. Hide Video
    ytDiv.classList.remove('full-mode');
    videoUI.classList.add('hidden');
    mainUI.classList.remove('hidden');
    // 2. Back to music
    ytPlayer.cuePlaylist({ listType: 'playlist', list: MUSIC_PLAYLIST_ID });
};
