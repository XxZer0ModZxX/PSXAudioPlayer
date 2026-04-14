const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 

/**
 * 1. POWER ON
 */
startOverlay.onclick = function() {
    startOverlay.style.display = 'none';
    // Initial attempt to unlock audio context
    audioEngine.play().catch(function(){});
};

/**
 * 2. LOAD MUSIC
 */
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Use the absolute path logic that worked before
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // PS5 needs a moment to actually "see" the file data
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1200);
};

/**
 * 3. PLAY BUTTON (The Force Logic)
 */
btnPlay.onclick = function() {
    // Force settings
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    // We try to play. If it fails, we wait 100ms and try again automatically.
    // This often "breaks" the PS5's block.
    var attemptPlay = function() {
        audioEngine.play().then(function() {
            btnLoadSong.style.backgroundColor = "green";
        }).catch(function(err) {
            console.log("Retrying play...");
            // Manual fallback: toggle muted state to trick the browser
            audioEngine.muted = true;
            audioEngine.play().then(function(){
                audioEngine.muted = false;
                btnLoadSong.style.backgroundColor = "green";
            });
        });
    };

    attemptPlay();
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

// BIOS & UI remains standard
document.getElementById('btn-open-bios').onclick = function() {
    fetch('./bios/SCPH7501.BIN').then(function(res) { return res.arrayBuffer(); })
    .then(function(buf) { if (typeof startPS1Bios === "function") startPS1Bios(buf); });
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
