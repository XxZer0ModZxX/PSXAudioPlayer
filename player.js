const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 

// 1. POWER ON
startOverlay.onclick = function() {
    // Create a dummy audio context to "handshake" with PS5 hardware
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const ctx = new AudioContext();
        ctx.resume();
    }
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    audioEngine.muted = false; // Ensure it's not muted during load
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1500);
};

// 3. PLAY BUTTON (The "Volume Kick")
btnPlay.onclick = function() {
    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    
    // Force the browser to refresh the audio routing
    var playPromise = audioEngine.play();

    if (playPromise !== undefined) {
        playPromise.then(function() {
            btnLoadSong.style.backgroundColor = "green";
            // If it's green but silent, we try to nudge the volume
            setTimeout(function(){
                audioEngine.volume = 0.9;
                audioEngine.volume = 1.0;
            }, 200);
        }).catch(function() {
            audioEngine.play();
        });
    }
};

btnStop.onclick = function() {
    audioEngine.pause();
    audioEngine.currentTime = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

// UI Toggles
document.getElementById('btn-viz-toggle').onclick = function() {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = function() {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('main-ui').classList.remove('hidden');
};
