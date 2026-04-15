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
            'enablejsapi': 1
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
    // Handle UI colors based on playing state
    if (event.data == YT.PlayerState.PLAYING) {
        btnLoadSong.style.backgroundColor = "green";
    } else {
        btnLoadSong.style.backgroundColor = "yellow";
    }
}

// 2. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    console.log("Power button clicked");
    
    // Attempt the YouTube handshake only if the player exists
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.playVideo();
            // Pause it almost immediately so it's ready to go later
            setTimeout(() => { ytPlayer.pauseVideo(); }, 200);
        } catch (e) {
            console.log("YT Handshake failed, but continuing...");
        }
    }
    
    // Hide the overlay
    startOverlay.style.display = 'none';
};

// 3. LOAD MUSIC (Cues the playlist)
btnLoadSong.onclick = function() {
    if(!isEngineReady) {
        alert("YouTube Engine still loading, please wait a second.");
        return;
    }
    
    btnLoadSong.style.backgroundColor = "white";
    
    // Cue the specific playlist
    ytPlayer.cuePlaylist({
        listType: 'playlist',
        list: PLAYLIST_ID,
        index: 0,
        startSeconds: 0
    });

    setTimeout(() => {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Playlist Loaded");
    }, 1000);
};

// 4. PLAYER CONTROLS
btnPlay.onclick = function() {
    if(isEngineReady) {
        ytPlayer.playVideo();
    }
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

// PREVIOUS / NEXT BUTTONS
document.getElementById('btn-next').onclick = function() {
    if(isEngineReady) ytPlayer.nextVideo();
};

document.getElementById('btn-prev').onclick = function() {
    if(isEngineReady) ytPlayer.previousVideo();
};

// BIOS & UI Toggle Logic
document.getElementById('btn-open-bios').onclick = function() {
    fetch('./bios/SCPH7501.BIN').then(function(res) {
        return res.arrayBuffer();
    }).then(function(buf) {
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
