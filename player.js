// Variable Declarations
const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

const TRACK_FILE = "Track01.mp3"; 

let audioCtx = null;
let audioBuffer = null;
let sourceNode = null;
let startTime = 0;
let pausedAt = 0;
let isPlaying = false;

/**
 * 1. POWER ON HANDSHAKE
 */
if (startOverlay) {
    startOverlay.onclick = function() {
        try {
            // Initialize Web Audio
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
            
            // Hide overlay
            startOverlay.style.display = 'none';
            console.log("PSX Powered On");
        } catch (e) {
            alert("Web Audio not supported on this browser.");
        }
    };
}

/**
 * 2. LOAD MUSIC
 */
btnLoadSong.onclick = async function() {
    if (!audioCtx) return;
    btnLoadSong.style.backgroundColor = "white";
    
    try {
        const response = await fetch(TRACK_FILE + "?v=" + Date.now());
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode raw data
        audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
            audioBuffer = buffer;
            btnLoadSong.style.backgroundColor = "yellow";
            console.log("CD Ready");
        }, function(err) {
            btnLoadSong.style.backgroundColor = "red";
        });
    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
    }
};

/**
 * 3. PLAY LOGIC
 */
btnPlay.onclick = function() {
    if (!audioBuffer || isPlaying) return;

    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioCtx.destination);
    
    sourceNode.start(0, pausedAt);
    startTime = audioCtx.currentTime - pausedAt;
    isPlaying = true;
    
    btnLoadSong.style.backgroundColor = "green";
    
    sourceNode.onended = function() {
        if (isPlaying) {
            isPlaying = false;
            btnLoadSong.style.backgroundColor = "yellow";
        }
    };
};

/**
 * 4. STOP & PAUSE
 */
btnStop.onclick = function() {
    if (sourceNode) {
        sourceNode.stop();
        isPlaying = false;
    }
    pausedAt = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = function() {
    if (sourceNode && isPlaying) {
        sourceNode.stop();
        pausedAt = audioCtx.currentTime - startTime;
        isPlaying = false;
    }
    btnLoadSong.style.backgroundColor = "yellow";
};

// BIOS and UI Logic
btnOpenBios.onclick = async function() {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        const buffer = await response.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(buffer);
    } catch (e) {}
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
