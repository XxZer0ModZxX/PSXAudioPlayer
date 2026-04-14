const startOverlay = document.getElementById('start-overlay');
const btnLoadSong = document.getElementById('btn-open');
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const audioEngine = document.getElementById('audio-engine');

// We use the root file. 
const TRACK_FILE = "Track01.mp3";

// 1. THE PS5 UNLOCKER
startOverlay.onclick = () => {
    // Force the hardware audio context to start
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const context = new AudioContext();
        if (context.state === 'suspended') context.resume();
    }
    
    // Play a silent handshake
    audioEngine.src = "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=";
    audioEngine.play().catch(() => {});
    
    startOverlay.style.display = 'none';
};

/**
 * 2. LOAD & AUTO-PLAY
 */
btnLoadSong.onclick = async () => {
    // Visual feedback: White = Working
    btnLoadSong.style.backgroundColor = "white"; 
    
    try {
        // We add a timestamp to the end of the URL to bypass GitHub's cache
        // This forces the PS5 to get the NEWEST version of the file
        const antiCacheUrl = TRACK_FILE + "?v=" + Date.now();
        
        audioEngine.src = antiCacheUrl;
        audioEngine.load();
        
        // Wait a tiny bit for the header to load
        setTimeout(async () => {
            try {
                await audioEngine.play();
                btnLoadSong.style.backgroundColor = "green";
            } catch (playErr) {
                // If auto-play fails, yellow means "Loaded, but waiting for you to hit PLAY"
                btnLoadSong.style.backgroundColor = "yellow";
            }
        }, 500);

    } catch (e) {
        btnLoadSong.style.backgroundColor = "red";
    }
};

/**
 * 3. THE PLAY BUTTON
 */
btnPlay.onclick = () => {
    // If the song is loaded (Green or Yellow), force it to play
    audioEngine.play().catch(() => {
        // PS5 specific: Try to unmute and play if it's still being stubborn
        audioEngine.muted = false;
        audioEngine.play();
    });
};

btnStop.onclick = () => {
    audioEngine.pause();
    audioEngine.currentTime = 0;
};

// BIOS & UI Toggle Logic (Stays the same)
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
