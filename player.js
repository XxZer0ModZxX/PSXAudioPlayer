const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// UPDATED PATH: Includes the 'music/' folder
const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Set source and FORCE MUTED (This is what worked for you)
    audioEngine.muted = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Playing Silently...");
    }).catch(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    });
};

// 3. PLAY BUTTON (The Unmute Kick)
btnPlay.onclick = function() {
    // Force volume settings
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(function() {
            // SUCCESS STATE
            btnLoadSong.style.backgroundColor = "green";
            // Extra nudge to force hardware audio routing
            audioEngine.volume = 0.99;
            setTimeout(() => { audioEngine.volume = 1.0; }, 100);
        }).catch(function() {
            // FALLBACK logic that turned green for you before
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

// BIOS & UI Toggle Logic (Standard)
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
