const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

const PLAYLIST_ID = "PLda2GiZdqiZbhzAVAnbrCsojDbrrCUTU_";
let ytPlayer;
let isEngineReady = false;

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
            'rel': 0,           // Don't show related videos (Saves memory)
            'showinfo': 0,      // Hide info (Saves memory)
            'modestbranding': 1 // Less YouTube UI bloat
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isEngineReady = true;
    // Force the lowest quality immediately to save PS5 RAM
    event.target.setPlaybackQuality('tiny');
    console.log("YouTube Engine Ready (Low Memory Mode)");
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        btnLoadSong.style.backgroundColor = "green";
    } else {
        btnLoadSong.style.backgroundColor = "yellow";
    }
}

startOverlay.onclick = function() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.playVideo();
            setTimeout(() => { ytPlayer.pauseVideo(); }, 300);
        } catch (e) {}
    }
    startOverlay.style.display = 'none';
};

btnLoadSong.onclick = function() {
    if(!isEngineReady) return;
    btnLoadSong.style.backgroundColor = "white";
    
    ytPlayer.cuePlaylist({
        listType: 'playlist',
        list: PLAYLIST_ID,
        index: 0,
        startSeconds: 0,
        suggestedQuality: 'tiny' // CRITICAL for PS5 Memory
    });

    setTimeout(() => {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1000);
};

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
