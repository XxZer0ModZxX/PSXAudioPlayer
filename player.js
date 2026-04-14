const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const TRACK_FILE = "Track01.mp3"; 
let audioCtx;
let gainNode;

// 1. POWER ON (Initialize the "Mixer")
startOverlay.onclick = function() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        audioCtx = new AudioContext();
        // Create an amplifier node
        gainNode = audioCtx.createGain();
        const source = audioCtx.createMediaElementSource(audioEngine);
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 1.0; // Force full volume
    }
    
    audioEngine.play().catch(function(){});
    startOverlay.style.display = 'none';
};

// 2. LOAD MUSIC
btnLoadSong.onclick = function() {
    btnLoadSong.style.backgroundColor = "white";
    
    // Hard-reset the engine
    audioEngine.pause();
    audioEngine.src = "";
    audioEngine.load();
    
    // Load fresh version
    audioEngine.src = TRACK_FILE + "?v=" + Date.now();
    audioEngine.load();
    
    setTimeout(function() {
        btnLoadSong.style.backgroundColor = "yellow";
    }, 1500);
};

// 3. PLAY BUTTON (The "Hardware Kick")
btnPlay.onclick = function() {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    audioEngine.muted = false;
    audioEngine.volume = 1.0;
    if (gainNode) gainNode.gain.value = 1.0;

    audioEngine.play().then(function() {
        btnLoadSong.style.backgroundColor = "green";
        console.log("Audio playing at hardware level");
    }).catch(function() {
        // One last fallback: Restart the source
        audioEngine.src = TRACK_FILE;
        audioEngine.play();
    });
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
