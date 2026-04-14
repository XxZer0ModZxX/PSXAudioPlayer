const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// Change this name if you test Track01.wav, Track01.m4a, etc.
const TRACK_FILE = "Track01.wav"; 

// 1. POWER ON HANDSHAKE (The "YouTube" Method)
startOverlay.onclick = function() {
    // We "kick" the engine with a tiny bit of data to grab the hardware
    audioEngine.play().catch(function(){});
    
    // Attempt to "Mute" the system background music by claiming the audio focus
    audioEngine.src = TRACK_FILE;
    audioEngine.muted = false;
    audioEngine.volume = 0.01; // Play at 1% volume immediately to steal focus
    
    audioEngine.play().then(() => {
        console.log("System music should have stopped now.");
        startOverlay.style.display = 'none';
    }).catch(() => {
        startOverlay.style.display = 'none';
    });
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Set source and FORCE MUTED (The handshake that worked for you)
    audioEngine.muted = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    // Attempt silent playback immediately
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
            // SUCCESS STATE - TURN GREEN
            btnLoadSong.style.backgroundColor = "green";
            // Nudge to force audio routing
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
