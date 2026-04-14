const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    // We try to "prime" the engine immediately
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Set source and FORCE MUTED
    audioEngine.muted = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // Attempt to start playing SILENTLY immediately
    // Browsers often allow muted auto-play even when they block sound
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Playing Silently...");
    }).catch(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    });
};

// 3. PLAY BUTTON (The Unmute Kick)
btnPlay.onclick = function() {
    // First, try to play normally
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(function() {
            btnLoadSong.style.backgroundColor = "green";
        }).catch(function() {
            // FALLBACK: If standard play fails, 
            // the PS5 might think the 'play' was blocked. 
            // We just flip the muted state back and forth.
            audioEngine.muted = true;
            audioEngine.play();
            setTimeout(function() {
                audioEngine.muted = false;
                btnLoadSong.style.backgroundColor = "green";
            }, 100);
        });
    }
};

btnStop.onclick = function() {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = function() {
    audioEngine.pause();
    btnLoadSong.style.backgroundColor = "yellow";
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
