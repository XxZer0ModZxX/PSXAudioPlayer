const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// Local file reference
const TRACK_FILE = "Track01.mp3"; 

/**
 * 1. POWER ON
 */
startOverlay.onclick = function() {
    startOverlay.style.display = 'none';
    // Muted play attempt to wake up the engine
    audioEngine.muted = true;
    audioEngine.play().catch(function(){});
};

/**
 * 2. LOAD MUSIC
 */
btnLoadSong.onclick = function() {
    // Visual cue
    btnLoadSong.style.backgroundColor = "white";
    
    // Set source and load
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // Give it a moment to buffer
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1000);
};

/**
 * 3. PLAY BUTTON
 */
btnPlay.onclick = function() {
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(function() {
            btnLoadSong.style.backgroundColor = "green";
        }).catch(function(error) {
            // If it blocks, we try a "Hard Reset" of the source
            audioEngine.src = TRACK_FILE;
            audioEngine.play();
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

// BIOS & UI Logic
document.getElementById('btn-open-bios').onclick = function() {
    fetch('./bios/SCPH7501.BIN').then(function(res) {
        return res.arrayBuffer();
    }).then(function(buf) {
        if (typeof startPS1Bios === "function") startPS1Bios(buf);
    }).catch(function(){});
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
