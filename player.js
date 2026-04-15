const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

const PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
let ytPlayer;
let isEngineReady = false;

// 1. YOUTUBE SETUP
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-engine', {
        height: '1',
        width: '1',
        playerVars: {
            'listType': 'playlist',
            'list': PLAYLIST_ID,
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'enablejsapi': 1,
            'rel': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isEngineReady = true;
    event.target.setPlaybackQuality('tiny');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.BUFFERING || event.data == YT.PlayerState.PLAYING) {
        event.target.setPlaybackQuality('tiny');
    }
    btnLoadSong.style.backgroundColor = (event.data == YT.PlayerState.PLAYING) ? "green" : "yellow";
}

// 2. INTERACTION HANDSHAKE
startOverlay.onclick = function() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.playVideo();
            setTimeout(() => { ytPlayer.pauseVideo(); }, 300);
        } catch (e) {}
    }
    startOverlay.style.display = 'none';
};

// 3. MUSIC CONTROLS
btnLoadSong.onclick = function() {
    if(!isEngineReady) return;
    btnLoadSong.style.backgroundColor = "white";
    ytPlayer.cuePlaylist({ listType: 'playlist', list: PLAYLIST_ID, index: 0, suggestedQuality: 'tiny' });
    setTimeout(() => { btnLoadSong.style.backgroundColor = "yellow"; }, 1000);
};

btnPlay.onclick = () => { if(isEngineReady) ytPlayer.playVideo(); };
btnStop.onclick = () => { if(isEngineReady) { ytPlayer.stopVideo(); btnLoadSong.style.backgroundColor = "yellow"; } };
btnPause.onclick = () => { if(isEngineReady) { ytPlayer.pauseVideo(); btnLoadSong.style.backgroundColor = "yellow"; } };
document.getElementById('btn-next').onclick = () => { if(isEngineReady) ytPlayer.nextVideo(); };
document.getElementById('btn-prev').onclick = () => { if(isEngineReady) ytPlayer.previousVideo(); };

// 4. MEMORY-SAFE BIOS LOADER
document.getElementById('btn-open-bios').onclick = function() {
    btnLoadSong.style.backgroundColor = "white"; // Show loading state
    
    // Dynamically load the heavy emulator script only when needed
    const script = document.createElement('script');
    script.src = 'emulator-core/wasmpsx.min.js';
    script.onload = () => {
        fetch('./bios/SCPH7501.BIN').then(res => res.arrayBuffer()).then(buf => {
            if (typeof startPS1Bios === "function") startPS1Bios(buf);
            btnLoadSong.style.backgroundColor = "yellow";
        });
    };
    document.body.appendChild(script);
};

// 5. VISUALIZER TOGGLE
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.remove('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
};
