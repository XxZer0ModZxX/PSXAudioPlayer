const startOverlay = document.getElementById('start-overlay');
const btnOpenBios = document.getElementById('btn-open-bios');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnPause = document.getElementById('btn-pause');

// File must be in the root folder
const TRACK_FILE = "Track01.mp3"; 

let audioCtx = null;
let audioBuffer = null;
let sourceNode = null;
let startTime = 0;
let pausedAt = 0;
let isPlaying = false;

/**
 * 1. THE POWER ON (Initialize the Audio System)
 */
startOverlay.onclick = () => {
    // Create the Audio Context - This is what YouTube uses
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // Wake up the context immediately
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    startOverlay.style.display = 'none';
};

/**
 * 2. THE LOAD BUTTON (Download raw data into RAM)
 */
btnLoadSong.onclick = async () => {
    btnLoadSong.style.backgroundColor = "white";
    
    try {
        // Download the file as raw data (ArrayBuffer)
        const response = await fetch(TRACK_FILE + "?v=" + Date.now());
        const arrayBuffer = await response.arrayBuffer();
        
        // Decode the MP3 data into a playable buffer
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        btnLoadSong.style.backgroundColor = "yellow";
        console.log("Audio Decoded and Ready");
    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
        console.error("Decode failed", e);
    }
};

/**
 * 3. THE PLAY BUTTON (The Direct Stream)
 */
btnPlay.onclick = () => {
    if (!audioBuffer || isPlaying) return;

    // Ensure context is active (PS5 requirement)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    // WebAudio requires a new source for every play
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioCtx.destination);
    
    // Handle the start point (for resume/pause logic)
    sourceNode.start(0, pausedAt);
    startTime = audioCtx.currentTime - pausedAt;
    isPlaying = true;
    
    btnLoadSong.style.backgroundColor = "green";
    
    sourceNode.onended = () => {
        isPlaying = false;
        btnLoadSong.style.backgroundColor = "yellow";
    };
};

/**
 * 4. STOP & PAUSE
 */
btnStop.onclick = () => {
    if (sourceNode) {
        sourceNode.stop();
        isPlaying = false;
    }
    pausedAt = 0;
    btnLoadSong.style.backgroundColor = "yellow";
};

btnPause.onclick = () => {
    if (sourceNode && isPlaying) {
        sourceNode.stop();
        pausedAt = audioCtx.currentTime - startTime;
        isPlaying = false;
    }
    btnLoadSong.style.backgroundColor = "yellow";
};

/**
 * BIOS AND UI
 */
btnOpenBios.onclick = async () => {
    try {
        const response = await fetch('./bios/SCPH7501.BIN');
        const biosBuffer = await response.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(biosBuffer);
    } catch (err) {}
};

document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.remove('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('visualizer-overlay').classList.add('hidden');
    document.getElementById('main-ui').classList.remove('hidden');
};
