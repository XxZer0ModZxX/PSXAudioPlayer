const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// We use the local path to satisfy the mini-coi.js security rules
const LOCAL_MUSIC_PATH = "./music/Track01.mp3";

// 1. UNLOCK THE SYSTEM
startOverlay.onclick = () => {
    // Play silence to open the gate
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. THE MASTER LOAD & PLAY
 */
btnLoadSong.onclick = async () => {
    // White indicates "loading"
    btnLoadSong.style.backgroundColor = "white"; 
    
    try {
        // Fetching locally to avoid CORS/Security errors
        const response = await fetch(LOCAL_MUSIC_PATH);
        if (!response.ok) throw new Error("Not Found");
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        audioEngine.src = url;
        audioEngine.load();
        
        // Attempt immediate playback
        await audioEngine.play();
        
        // Green means it worked!
        btnLoadSong.style.backgroundColor = "rgba(0, 255, 0, 0.6)"; 
    } catch (e) {
        // Red means the file path ./music/Track01.mp3 was blocked or not found
        btnLoadSong.style.backgroundColor = "red";
        console.error(e);
    }
};

btnPlay.onclick = () => {
    audioEngine.play().catch(() => {
        audioEngine.muted = false;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS Logic
document.getElementById('btn-open-bios').onclick = async () => {
    try {
        const res = await fetch('./bios/SCPH7501.BIN');
        const buf = await res.arrayBuffer();
        if (typeof startPS1Bios === "function") await startPS1Bios(buf);
    } catch (e) {}
};

// UI Toggles
document.getElementById('btn-viz-toggle').onclick = () => {
    document.getElementById('main-ui').classList.add('hidden');
    document.getElementById('visualizer-overlay').classList.add('visible');
};

document.getElementById('btn-exit-viz').onclick = () => {
    document.getElementById('visualizer-overlay').classList.remove('visible');
    document.getElementById('main-ui').classList.remove('hidden');
};
