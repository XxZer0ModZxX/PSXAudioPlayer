const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

const MUSIC_URL = "https://xxzer0modzxx.github.io/PSXAudioPlayer/music/Track01.mp3";

// 1. UNLOCK THE SYSTEM (THE HANDSHAKE)
startOverlay.onclick = () => {
    // We play a silent sound to open the audio gate
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    startOverlay.style.display = 'none';
};

/**
 * 2. THE MASTER LOAD & PLAY FUNCTION
 * On PS5, the click must trigger the Fetch AND the Playback
 */
btnLoadSong.onclick = async () => {
    // Visual feedback instead of an alert
    btnLoadSong.style.background = "rgba(255, 255, 255, 0.8)"; 
    
    try {
        const response = await fetch(MUSIC_URL);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        audioEngine.src = url;
        audioEngine.load();
        
        // This is the "Magic" part: Play immediately after the fetch finishes
        // while the 'click' event is still considered "active" by the browser.
        await audioEngine.play();
        
        btnLoadSong.style.background = "rgba(0, 255, 0, 0.4)"; // Green for success
    } catch (e) {
        btnLoadSong.style.background = "rgba(255, 0, 0, 0.4)"; // Red for error
    }
};

/**
 * 3. PLAY BUTTON (Secondary Manual Control)
 */
btnPlay.onclick = () => {
    audioEngine.play().catch(() => {
        // If blocked, we try the "Mute Flip" trick
        audioEngine.muted = false;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS Logic (Silent)
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
