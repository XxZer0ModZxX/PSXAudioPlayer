const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// We are moving the file to the ROOT to bypass folder security
const TRACK_FILE = "Track01.mp3";

// 1. THE ULTIMATE UNLOCK
startOverlay.onclick = () => {
    // Create a dummy audio context to "handshake" with the PS5 hardware
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const context = new AudioContext();
        context.resume();
    }
    
    // Play a tiny silent beep to wake the engine
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD & AUTO-PLAY
 */
btnLoadSong.onclick = async () => {
    btnLoadSong.style.backgroundColor = "blue"; // Blue = "Trying to bypass security"
    
    try {
        // We set the source to the root file
        audioEngine.src = TRACK_FILE;
        audioEngine.load();
        
        // On PS5, we must try to play immediately while the click is "hot"
        await audioEngine.play();
        
        btnLoadSong.style.backgroundColor = "green";
    } catch (e) {
        // If it's red now, the PS5 is literally blocking the MP3 format or the filename
        btnLoadSong.style.backgroundColor = "red";
        console.log("Error: " + e.message);
    }
};

/**
 * 3. PLAY BUTTON (Manual Force)
 */
btnPlay.onclick = () => {
    audioEngine.muted = false;
    audioEngine.play().catch(() => {
        // Triple-check the source if it fails
        if(!audioEngine.src) audioEngine.src = TRACK_FILE;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS & UI Logic
document.getElementById('btn-open-bios').onclick = async () => {
    try {
        const res = await fetch('./bios/SCPH7501.BIN');
        const buf = await res.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(buf);
    } catch (e) {}
};

document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('main-ui').classList.remove('hidden');
};
