const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');
const audioEngine = document.getElementById('audio-engine');

// Change this filename as you test different formats (e.g., Track01.wav, Track01.ogg)
const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON HANDSHAKE
startOverlay.onclick = function() {
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Reset engine and force muted for the initial load handshake
    audioEngine.muted = true;
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Loading success - Silent play started.");
    }).catch(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    });
};

// 3. PLAY BUTTON (The "Green Light" Logic)
btnPlay.onclick = function() {
    audioEngine.muted = false;
    audioEngine.volume = 1.0;

    // Wake up the system's master volume context (Essential for PS5)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const tempCtx = new AudioContext();
        tempCtx.resume();
    }
    
    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "green";
        // Tiny volume nudge to wake up hardware
        audioEngine.volume = 0.99;
        setTimeout(() => { audioEngine.volume = 1.0; }, 100);
    }).catch(function() {
        // Fallback: Mute, Play, then Unmute
        audioEngine.muted = true;
        audioEngine.play().then(function() {
            audioEngine.muted = false;
            btnLoadSong.style.backgroundColor = "green";
        });
    });
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

// UI & BIOS (Standard)
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
