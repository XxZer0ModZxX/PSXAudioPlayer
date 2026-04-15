const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

// YouTube Playlist Config
const PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
let ytPlayer;
let isEngineReady = false;

// 1. INITIALIZE YOUTUBE ENGINE
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-engine', {
        height: '200',
        width: '200',
        playerVars: {
            'listType': 'playlist',
            'list': PLAYLIST_ID,
            'playsinline': 1,
            'controls': 0,
            'disablekb': 1,
            'enablejsapi': 1,
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isEngineReady = true;
    console.log("YouTube Engine Ready");
}

function onPlayerStateChange(event) {
    // Green when playing, yellow when paused/stopped
    if (event.data == YT.PlayerState.PLAYING) {
        btnLoadSong.style.backgroundColor = "green";
    } else {
        btnLoadSong.style.backgroundColor = "yellow";
    }
}

// 2. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    console.log("Powering on...");
    
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            // "Prime" the engine with a quick play/pause
            ytPlayer.playVideo();
            setTimeout(() => { ytPlayer.pauseVideo(); }, 300);
        } catch (e) {
            console.log("YT Prime failed");
        }
    }
    
    startOverlay.style.display = 'none';
};

// 3. LOAD MUSIC
btnLoadSong.onclick = function() {
    if(!isEngineReady) return;
    
    btnLoadSong.style.backgroundColor = "white";
    
    ytPlayer.cuePlaylist({
        listType: 'playlist',
        list: PLAYLIST_ID,
        index: 0,
        startSeconds: 0
    });

    setTimeout(() => {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Playlist Cued");
    }, 1000);
};

// 4. CONTROLS
btnPlay.onclick = function() {
    if(isEngineReady) ytPlayer.playVideo();
};

btnStop.onclick = function() {
    if(isEngineReady) {
        ytPlayer.stopVideo();
        btnLoadSong.style.backgroundColor = "yellow";
    }
};

btnPause.onclick = function() {
    if(isEngineReady) {
        ytPlayer.pauseVideo();
        btnLoadSong.style.backgroundColor = "yellow";
    }
};

document.getElementById('btn-next').onclick = function() {
    if(isEngineReady) ytPlayer.nextVideo();
};

document.getElementById('btn-prev').onclick = function() {
    if(isEngineReady) ytPlayer.previousVideo();
};

// BIOS & UI Toggle
document.getElementById('btn-open-bios').onclick = function() {
    fetch('./bios/SCPH7501.BIN').then(res => res.arrayBuffer()).then(buf => {
        if (typeof startPS1Bios === "function") startPS1Bios(buf);
    });
};

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
